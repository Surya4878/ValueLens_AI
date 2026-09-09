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

@Component
public class NvidiaAiClient {

    private static final Logger log = LoggerFactory.getLogger(NvidiaAiClient.class);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final NvidiaProperties properties;

    public NvidiaAiClient(HttpClient httpClient, ObjectMapper objectMapper, NvidiaProperties properties) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    public String callChatCompletion(String systemPrompt, String userContent) {
        String apiKey = properties.getApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("NVIDIA API key not configured. Using intelligent fallback mode.");
            return null;
        }

        try {
            ObjectNode root = objectMapper.createObjectNode();
            root.put("model", properties.getModel());
            root.put("temperature", properties.getTemperature());
            root.put("max_tokens", properties.getMaxTokens());
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

            log.info("Dispatching chat completion request to NVIDIA NIM model: {}", properties.getModel());

            String text = executeCall(request);
            if (text != null && !text.isBlank()) {
                return text;
            }

            // Fallback to meta/llama-3.2-11b-vision-instruct if primary model failed
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
                return executeCall(fallbackReq);
            }

            return null;

        } catch (Exception e) {
            log.error("Error communicating with NVIDIA NIM: {}", e.getMessage(), e);
            return null;
        }
    }

    private String executeCall(HttpRequest request) {
        int maxRetries = 3;
        long retryDelayMs = 2000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode respNode = objectMapper.readTree(response.body());
                    JsonNode messageNode = respNode.path("choices").path(0).path("message");
                    JsonNode contentNode = messageNode.path("content");

                    if (!contentNode.isMissingNode() && !contentNode.isNull() && !contentNode.asText().isBlank()) {
                        log.info("NVIDIA NIM returned AI response on attempt {}", attempt);
                        return contentNode.asText();
                    }

                    // Fallback to reasoning_content if content is empty
                    JsonNode reasoningNode = messageNode.path("reasoning_content");
                    if (!reasoningNode.isMissingNode() && !reasoningNode.isNull() && !reasoningNode.asText().isBlank()) {
                        return reasoningNode.asText();
                    }

                    log.warn("NVIDIA NIM response contained neither content nor reasoning_content on attempt {}: {}", attempt, response.body().substring(0, Math.min(response.body().length(), 200)));
                    return null;

                } else if (response.statusCode() == 502 || response.statusCode() == 503 || response.statusCode() == 429) {
                    log.warn("NVIDIA NIM transient error status {} on attempt {}/{}. Retrying in {}ms...", response.statusCode(), attempt, maxRetries, retryDelayMs);
                    if (attempt < maxRetries) {
                        Thread.sleep(retryDelayMs);
                        retryDelayMs *= 2; // exponential backoff
                    }
                } else {
                    log.error("NVIDIA NIM returned non-retryable error status {}: {}", response.statusCode(), response.body().substring(0, Math.min(response.body().length(), 300)));
                    return null;
                }

            } catch (java.net.http.HttpTimeoutException te) {
                log.warn("NVIDIA NIM request timed out on attempt {}/{}. Retrying...", attempt, maxRetries);
                if (attempt < maxRetries) {
                    try { Thread.sleep(retryDelayMs); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                    retryDelayMs *= 2;
                }
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                log.warn("Retry sleep interrupted");
                return null;
            } catch (Exception e) {
                log.error("Error in executeCall attempt {}: {}", attempt, e.getMessage());
                return null;
            }
        }

        log.error("NVIDIA NIM failed after {} attempts", maxRetries);
        return null;
    }
}
