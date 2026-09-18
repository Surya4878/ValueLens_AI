package com.valuelens.ai.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
public class RateLimitingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    @Value("${app.security.rate-limit.enabled:true}")
    private boolean enabled;

    private static final int AUTH_LIMIT_PER_MINUTE = 15;
    private static final int AI_LIMIT_PER_MINUTE = 25;
    private static final int GENERAL_LIMIT_PER_MINUTE = 120;
    private static final long WINDOW_MS = 60_000L;

    private final Map<String, Deque<Long>> requestBuckets = new ConcurrentHashMap<>();
    private volatile long lastPruneTime = System.currentTimeMillis();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (!enabled) {
            chain.doFilter(request, response);
            return;
        }

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Skip preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String path = httpRequest.getRequestURI();
        if (path == null || !path.startsWith("/api/")) {
            chain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(httpRequest);
        int maxAllowed = getLimitForPath(path);
        String bucketKey = clientIp + ":" + getCategory(path);

        long now = System.currentTimeMillis();
        boolean allowed = checkRateLimit(bucketKey, maxAllowed, now);

        if (!allowed) {
            log.warn("Rate limit exceeded for client IP [{}] on path [{}]", clientIp, path);
            httpResponse.setStatus(429); // 429 Too Many Requests
            httpResponse.setHeader("Retry-After", "60");
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("""
                {
                    "success": false,
                    "code": "RATE_LIMIT_EXCEEDED",
                    "message": "Too many requests. Please wait a moment before trying again."
                }
            """);
            return;
        }

        chain.doFilter(request, response);
    }

    private synchronized boolean checkRateLimit(String bucketKey, int maxAllowed, long now) {
        Deque<Long> timestamps = requestBuckets.computeIfAbsent(bucketKey, k -> new ArrayDeque<>());
        long windowStart = now - WINDOW_MS;

        // Evict timestamps older than 60 seconds
        while (!timestamps.isEmpty() && timestamps.peekFirst() < windowStart) {
            timestamps.pollFirst();
        }

        if (timestamps.size() >= maxAllowed) {
            return false;
        }

        timestamps.addLast(now);

        // Periodically prune stale bucket keys every 5 minutes
        if (now - lastPruneTime > 300_000L) {
            pruneStaleBuckets(now);
            lastPruneTime = now;
        }

        return true;
    }

    private void pruneStaleBuckets(long now) {
        long windowStart = now - WINDOW_MS;
        requestBuckets.entrySet().removeIf(entry -> {
            Deque<Long> deque = entry.getValue();
            synchronized (entry.getValue()) {
                while (!deque.isEmpty() && deque.peekFirst() < windowStart) {
                    deque.pollFirst();
                }
                return deque.isEmpty();
            }
        });
    }

    private int getLimitForPath(String path) {
        if (path.startsWith("/api/auth/")) {
            return AUTH_LIMIT_PER_MINUTE;
        } else if (path.startsWith("/api/v1/ai/") || path.startsWith("/api/ai/")) {
            return AI_LIMIT_PER_MINUTE;
        }
        return GENERAL_LIMIT_PER_MINUTE;
    }

    private String getCategory(String path) {
        if (path.startsWith("/api/auth/")) return "AUTH";
        if (path.startsWith("/api/v1/ai/") || path.startsWith("/api/ai/")) return "AI";
        return "GENERAL";
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}