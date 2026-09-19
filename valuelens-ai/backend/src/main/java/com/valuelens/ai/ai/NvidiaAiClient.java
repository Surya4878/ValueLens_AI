package com.valuelens.ai.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.valuelens.ai.config.NvidiaProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

@Component
public class NvidiaAiClient {

    private static final Logger log = LoggerFactory.getLogger(NvidiaAiClient.class);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final NvidiaProperties properties;

    // NVIDIA NIM developer tier enforces strict single-request concurrency.
    // Fair semaphore serializes calls across Tomcat threads and prevents mutual timeouts.
    private final Semaphore concurrencyGate = new Semaphore(1, true);

    // In-memory cache for fast repeated queries (3-minute TTL)
    private final Map<String, CacheEntry> responseCache = new ConcurrentHashMap<>();

    private record CacheEntry(String response, long expiresAt) {
        boolean isExpired() {
            return System.currentTimeMillis() > expiresAt;
        }
    }

    public NvidiaAiClient(HttpClient httpClient, ObjectMapper objectMapper, NvidiaProperties properties) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    public String callChatCompletion(String systemPrompt, String userContent) {
        return callChatCompletion(systemPrompt, userContent, null);
    }

    public String callChatCompletion(String systemPrompt, String userContent, Integer customMaxTokens) {
        String apiKey = properties.getApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("NVIDIA API key not configured. Using intelligent fallback mode.");
            return null;
        }

        int tokens = (customMaxTokens != null && customMaxTokens > 0) ? customMaxTokens : properties.getMaxTokens();
        String cacheKey = properties.getModel() + "|" + tokens + "|" + (systemPrompt != null ? systemPrompt.hashCode() : 0) + "|" + (userContent != null ? userContent.hashCode() : 0);

        CacheEntry cached = responseCache.get(cacheKey);
        if (cached != null && !cached.isExpired()) {
            log.info("Returning cached AI response for cacheKey (TTL valid)");
            return cached.response();
        }

        boolean acquired = false;
        try {
            int gateTimeoutSec = (properties.getTimeoutSeconds() != null && properties.getTimeoutSeconds() > 0)
                    ? properties.getTimeoutSeconds() : 6;
            acquired = concurrencyGate.tryAcquire(gateTimeoutSec, TimeUnit.SECONDS);
            if (!acquired) {
                log.warn("NVIDIA NIM concurrency gate timed out after {}s waiting for active request.", gateTimeoutSec);
                return null;
            }

            // Re-check cache after acquiring gate in case a parallel thread just computed it
            cached = responseCache.get(cacheKey);
            if (cached != null && !cached.isExpired()) {
                log.info("Returning cached AI response acquired post-lock");
                return cached.response();
            }

            ObjectNode root = objectMapper.createObjectNode();
            root.put("model", properties.getModel());
            root.put("temperature", properties.getTemperature());
            root.put("max_tokens", tokens);
            root.put("stream", false);

            ArrayNode messages = root.putArray("messages");

            ObjectNode systemMsg = messages.addObject();
            systemMsg.put("role", "system");
            systemMsg.put("content", systemPrompt);

            ObjectNode userMsg = messages.addObject();
            userMsg.put("role", "user");
            userMsg.put("content", userContent);

            String requestBody = objectMapper.writeValueAsString(root);

            String url = properties.getBaseUrl();
            if (!url.endsWith("/chat/completions")) {
                url = url + (url.endsWith("/") ? "" : "/") + "chat/completions";
            }

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(properties.getTimeoutSeconds()))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            log.info("Dispatching chat completion request to NVIDIA NIM model: {} (max_tokens: {})", properties.getModel(), tokens);

            String text = executeCall(request);
            if (text != null && !text.isBlank()) {
                responseCache.put(cacheKey, new CacheEntry(text, System.currentTimeMillis() + 180_000));
                return text;
            }

            // Fallback model if primary model failed
            if (!"meta/llama-3.2-11b-vision-instruct".equalsIgnoreCase(properties.getModel())) {
                log.warn("Attempting fallback chat completion with meta/llama-3.2-11b-vision-instruct");
                root.put("model", "meta/llama-3.2-11b-vision-instruct");
                String fallbackBody = objectMapper.writeValueAsString(root);
                HttpRequest fallbackReq = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("Authorization", "Bearer " + apiKey)
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(properties.getTimeoutSeconds()))
                        .POST(HttpRequest.BodyPublishers.ofString(fallbackBody))
                        .build();
                String fallbackText = executeCall(fallbackReq);
                if (fallbackText != null && !fallbackText.isBlank()) {
                    responseCache.put(cacheKey, new CacheEntry(fallbackText, System.currentTimeMillis() + 180_000));
                    return fallbackText;
                }
            }

            return null;

        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            log.warn("Thread interrupted while waiting for NVIDIA NIM concurrency gate");
            return null;
        } catch (Exception e) {
            log.error("Error communicating with NVIDIA NIM: {}", e.getMessage(), e);
            return null;
        } finally {
            if (acquired) {
                concurrencyGate.release();
            }
        }
    }

    private String executeCall(HttpRequest request) {
        int maxRetries = 2;
        long retryDelayMs = 1500;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            long t0 = System.currentTimeMillis();
            try {
                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                long elapsed = System.currentTimeMillis() - t0;

                if (response.statusCode() == 200) {
                    JsonNode respNode = objectMapper.readTree(response.body());
                    JsonNode messageNode = respNode.path("choices").path(0).path("message");
                    JsonNode contentNode = messageNode.path("content");

                    if (!contentNode.isMissingNode() && !contentNode.isNull() && !contentNode.asText().isBlank()) {
                        log.info("NVIDIA NIM returned AI response on attempt {} in {}ms", attempt, elapsed);
                        return contentNode.asText();
                    }

                    JsonNode reasoningNode = messageNode.path("reasoning_content");
                    if (!reasoningNode.isMissingNode() && !reasoningNode.isNull() && !reasoningNode.asText().isBlank()) {
                        log.info("NVIDIA NIM returned AI reasoning response on attempt {} in {}ms", attempt, elapsed);
                        return reasoningNode.asText();
                    }

                    log.warn("NVIDIA NIM response contained neither content nor reasoning_content on attempt {}: {}", attempt, response.body().substring(0, Math.min(response.body().length(), 200)));
                    return null;
                }

                boolean isRetryable = (response.statusCode() >= 500 && response.statusCode() <= 599)
                        || response.statusCode() == 429
                        || response.statusCode() == 408;

                if (isRetryable) {
                    log.warn("NVIDIA NIM transient error status {} on attempt {}/{} in {}ms. Retrying in {}ms...", response.statusCode(), attempt, maxRetries, elapsed, retryDelayMs);
                    if (attempt < maxRetries) {
                        Thread.sleep(retryDelayMs);
                        retryDelayMs *= 2;
                    }
                } else {
                    log.error("NVIDIA NIM returned non-retryable error status {}: {}", response.statusCode(), response.body().substring(0, Math.min(response.body().length(), 300)));
                    return null;
                }

            } catch (java.net.http.HttpTimeoutException te) {
                log.warn("NVIDIA NIM request timed out after {}ms. Activating fast advisory fallback.", System.currentTimeMillis() - t0);
                return null;
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                log.warn("Retry sleep interrupted");
                return null;
            } catch (Exception e) {
                log.error("Error in executeCall attempt {}: {}", attempt, e.getMessage());
                if (attempt < maxRetries) {
                    try { Thread.sleep(retryDelayMs); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                    retryDelayMs *= 2;
                }
            }
        }

        log.error("NVIDIA NIM failed after {} attempts", maxRetries);
        return null;
    }
}
