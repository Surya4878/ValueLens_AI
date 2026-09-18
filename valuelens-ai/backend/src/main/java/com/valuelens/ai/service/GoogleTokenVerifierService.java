package com.valuelens.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.RSAPublicKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Validates Google Identity Services (GIS) ID tokens cryptographically
 * against Google's public JWKS certificates.
 */
@Service
public class GoogleTokenVerifierService {

    private static final Logger log = LoggerFactory.getLogger(GoogleTokenVerifierService.class);
    private static final String GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${app.auth.google-client-id:}")
    private String googleClientId;

    // In-memory cache of public keys keyed by kid with 6-hour TTL
    private final Map<String, CachedKey> keyCache = new ConcurrentHashMap<>();
    private volatile Instant lastFetchTime = Instant.EPOCH;

    private record CachedKey(PublicKey key, String kid) {}

    public record VerifiedGoogleUser(String sub, String email, String name, boolean emailVerified) {}

    public GoogleTokenVerifierService(HttpClient httpClient, ObjectMapper objectMapper) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
    }

    public VerifiedGoogleUser verifyToken(String idToken) {
        if (idToken == null || idToken.isBlank()) {
            throw new IllegalArgumentException("Google credential token must not be null or empty.");
        }

        String[] parts = idToken.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Malformed Google ID token: must contain 3 parts.");
        }

        try {
            // 1. Parse header to extract kid
            String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
            JsonNode header = objectMapper.readTree(headerJson);
            String kid = header.path("kid").asText();
            String alg = header.path("alg").asText("RS256");

            if (!"RS256".equals(alg)) {
                throw new IllegalArgumentException("Unsupported Google token signing algorithm: " + alg);
            }

            // 2. Fetch or retrieve cached RSA public key
            PublicKey publicKey = getPublicKey(kid);
            if (publicKey == null) {
                // Refresh cache and retry once
                refreshKeyCache();
                publicKey = getPublicKey(kid);
                if (publicKey == null) {
                    throw new IllegalArgumentException("Unrecognized Google signing key ID (kid: " + kid + ")");
                }
            }

            // 3. Cryptographically verify SHA256withRSA signature
            byte[] signedData = (parts[0] + "." + parts[1]).getBytes(StandardCharsets.US_ASCII);
            byte[] signatureBytes = Base64.getUrlDecoder().decode(parts[2]);

            Signature signature = Signature.getInstance("SHA256withRSA");
            signature.initVerify(publicKey);
            signature.update(signedData);

            if (!signature.verify(signatureBytes)) {
                log.warn("Google ID token signature verification failed for kid: {}", kid);
                throw new IllegalArgumentException("Cryptographic verification failed: invalid Google ID token signature.");
            }

            // 4. Verify Payload Claims
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            JsonNode payload = objectMapper.readTree(payloadJson);

            long exp = payload.path("exp").asLong(0);
            if (Instant.now().getEpochSecond() > exp) {
                throw new IllegalArgumentException("Google ID token has expired.");
            }

            String iss = payload.path("iss").asText();
            if (!"https://accounts.google.com".equals(iss) && !"accounts.google.com".equals(iss)) {
                throw new IllegalArgumentException("Invalid Google token issuer: " + iss);
            }

            if (googleClientId != null && !googleClientId.isBlank()) {
                String aud = payload.path("aud").asText();
                if (!googleClientId.equals(aud)) {
                    log.warn("Google token audience mismatch: expected {} but got {}", googleClientId, aud);
                    throw new IllegalArgumentException("Google token audience does not match configured Client ID.");
                }
            }

            boolean emailVerified = payload.path("email_verified").asBoolean(false);
            if (!emailVerified) {
                throw new IllegalArgumentException("Google account email address is not verified by Google.");
            }

            String sub = payload.path("sub").asText();
            String email = payload.path("email").asText().toLowerCase().trim();
            String name = payload.path("name").asText("Google User");

            return new VerifiedGoogleUser(sub, email, name, true);

        } catch (IllegalArgumentException iae) {
            throw iae;
        } catch (Exception e) {
            log.error("Failed to verify Google token: {}", e.getMessage());
            throw new IllegalArgumentException("Google identity verification failed: " + e.getMessage(), e);
        }
    }

    private PublicKey getPublicKey(String kid) {
        CachedKey cached = keyCache.get(kid);
        if (cached != null) {
            return cached.key();
        }
        return null;
    }

    private synchronized void refreshKeyCache() {
        if (Duration.between(lastFetchTime, Instant.now()).toMinutes() < 5) {
            return; // Throttle JWKS fetch
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GOOGLE_JWKS_URL))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode keys = root.path("keys");
                KeyFactory factory = KeyFactory.getInstance("RSA");

                for (JsonNode k : keys) {
                    String kid = k.path("kid").asText();
                    String n = k.path("n").asText();
                    String e = k.path("e").asText();

                    BigInteger modulus = new BigInteger(1, Base64.getUrlDecoder().decode(n));
                    BigInteger exponent = new BigInteger(1, Base64.getUrlDecoder().decode(e));
                    RSAPublicKeySpec spec = new RSAPublicKeySpec(modulus, exponent);
                    PublicKey pk = factory.generatePublic(spec);

                    keyCache.put(kid, new CachedKey(pk, kid));
                }
                lastFetchTime = Instant.now();
                log.info("Successfully refreshed Google JWKS certificates (loaded {} keys)", keyCache.size());
            }
        } catch (Exception e) {
            log.warn("Failed to fetch Google JWKS certificates: {}", e.getMessage());
        }
    }
}