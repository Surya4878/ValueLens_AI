package com.valuelens.ai.ai;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Service
public class AiCacheService {

    public String computeCacheHash(String assessmentId, String calculationResultId, String scenarioKey, String model, String promptVersion) {
        String key = String.format("%s:%s:%s:%s:%s",
                assessmentId != null ? assessmentId : "none",
                calculationResultId != null ? calculationResultId : "none",
                scenarioKey != null ? scenarioKey : "base",
                model != null ? model : "default",
                promptVersion != null ? promptVersion : "v1");

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(key.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            return Integer.toHexString(key.hashCode());
        }
    }
}
