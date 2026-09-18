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
 * Validates Microsoft Entra ID / Microsoft Identity Platform tokens cryptographically
 * against Microsoft's public JWKS certificates.
 */
@Service
public class MicrosoftTokenVerifierService {

    private static final Logger log = LoggerFactory.getLogger(MicrosoftTokenVerifierService.class);
    private static final String MS_JWKS_URL = "https://login.microsoftonline.com/common/discovery/v2.0/keys";

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${app.auth.microsoft-client-id:}")
    private String microsoftClientId;

    // Cache keys by kid with 6-hour TTL
    private final Map<String, CachedKey> keyCache = new ConcurrentHashMap<>();
    private volatile Instant lastFetchTime = Instant.EPOCH;

    private record CachedKey(PublicKey key, String kid) {}

    public record VerifiedMicrosoftUser(String sub, String email, String name) {}

    public MicrosoftTokenVerifierService(HttpClient httpClient, ObjectMapper objectMapper) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
    }

    public VerifiedMicrosoftUser verifyToken(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Microsoft token must not be null or empty.");
        }

        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Malformed Microsoft token: must contain 3 parts.");
        }

        try {
            // 1. Parse header to extract kid
            String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
            JsonNode header = objectMapper.readTree(headerJson);
            String kid = header.path("kid").asText();
            String alg = header.path("alg").asText("RS256");

            if (!"RS256".equals(alg)) {
                throw new IllegalArgumentException("Unsupported Microsoft token signing algorithm: " + alg);
            }

            // 2. Fetch or retrieve cached RSA public key
            PublicKey publicKey = getPublicKey(kid);
            if (publicKey == null) {
                refreshKeyCache();
                publicKey = getPublicKey(kid);
                if (publicKey == null) {
                    throw new IllegalArgumentException("Unrecognized Microsoft signing key ID (kid: " + kid + ")");
                }
            }

            // 3. Cryptographically verify SHA256withRSA signature
            byte[] signedData = (parts[0] + "." + parts[1]).getBytes(StandardCharsets.US_ASCII);
            byte[] signatureBytes = Base64.getUrlDecoder().decode(parts[2]);

            Signature signature = Signature.getInstance("SHA256withRSA");
            signature.initVerify(publicKey);
            signature.update(signedData);

            if (!signature.verify(signatureBytes)) {
                log.warn("Microsoft token signature verification failed for kid: {}", kid);
                throw new IllegalArgumentException("Cryptographic verification failed: invalid Microsoft token signature.");
            }

            // 4. Verify Payload Claims
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            JsonNode payload = objectMapper.readTree(payloadJson);

            long exp = payload.path("exp").asLong(0);
            if (Instant.now().getEpochSecond() > exp) {
                throw new IllegalArgumentException("Microsoft token has expired.");
            }

            if (microsoftClientId != null && !microsoftClientId.isBlank()) {
                String aud = payload.path("aud").asText();
                if (!microsoftClientId.equals(aud)) {
                    log.warn("Microsoft token audience mismatch: expected {} but got {}", microsoftClientId, aud);
                    throw new IllegalArgumentException("Microsoft token audience does not match configured Client ID.");
                }
            }

            String sub = payload.path("sub").asText(payload.path("oid").asText());
            String email = null;
            if (payload.has("email") && !payload.path("email").asText().isBlank()) {
                email = payload.path("email").asText();
            } else if (payload.has("preferred_username") && !payload.path("preferred_username").asText().isBlank()) {
                email = payload.path("preferred_username").asText();
            } else if (payload.has("upn") && !payload.path("upn").asText().isBlank()) {
                email = payload.path("upn").asText();
            }

            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("Microsoft identity token does not contain a verified email or username.");
            }

            email = email.toLowerCase().trim();
            String name = payload.path("name").asText("Microsoft User");

            return new VerifiedMicrosoftUser(sub, email, name);

        } catch (IllegalArgumentException iae) {
            throw iae;
        } catch (Exception e) {
            log.error("Failed to verify Microsoft token: {}", e.getMessage());
            throw new IllegalArgumentException("Microsoft identity verification failed: " + e.getMessage(), e);
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
            return;
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(MS_JWKS_URL))
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
                log.info("Successfully refreshed Microsoft JWKS certificates (loaded {} keys)", keyCache.size());
            }
        } catch (Exception e) {
            log.warn("Failed to fetch Microsoft JWKS certificates: {}", e.getMessage());
        }
    }
}