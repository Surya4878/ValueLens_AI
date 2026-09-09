package com.valuelens.ai.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.valuelens.ai.dto.AiAnalysisResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Component
public class AiResponseParser {

    private static final Logger log = LoggerFactory.getLogger(AiResponseParser.class);
    private final ObjectMapper objectMapper;

    private static final Set<String> VALID_DECISIONS = Set.of(
            "STRONGLY_FAVORABLE",
            "FAVORABLE",
            "CONDITIONALLY_FAVORABLE",
            "NEUTRAL",
            "UNFAVORABLE",
            "INSUFFICIENT_DATA"
    );

    public AiResponseParser(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public AiAnalysisResponseDto parseAndValidate(String rawContent, String aiModel) {
        if (rawContent == null || rawContent.isBlank()) {
            throw new IllegalArgumentException("Raw AI response content is empty");
        }

        // Clean any accidental markdown code fences or conversational preamble
        String json = rawContent.trim();
        if (json.contains("```json")) {
            int start = json.indexOf("```json") + 7;
            int end = json.indexOf("```", start);
            if (end > start) {
                json = json.substring(start, end).trim();
            }
        } else if (json.contains("```")) {
            int start = json.indexOf("```") + 3;
            int end = json.indexOf("```", start);
            if (end > start) {
                json = json.substring(start, end).trim();
            }
        }

        int firstBrace = json.indexOf('{');
        int lastBrace = json.lastIndexOf('}');
        if (firstBrace != -1 && lastBrace > firstBrace) {
            json = json.substring(firstBrace, lastBrace + 1).trim();
        }

        try {
            AiAnalysisResponseDto dto = objectMapper.readValue(json, AiAnalysisResponseDto.class);

            // Validate decision enum
            if (dto.getDecision() == null || !VALID_DECISIONS.contains(dto.getDecision().toUpperCase())) {
                log.warn("Invalid AI decision returned: '{}', falling back to CONDITIONALLY_FAVORABLE", dto.getDecision());
                dto.setDecision("CONDITIONALLY_FAVORABLE");
            } else {
                dto.setDecision(dto.getDecision().toUpperCase());
            }

            // Validate confidence range
            if (dto.getConfidence() == null || dto.getConfidence().compareTo(BigDecimal.ZERO) < 0 || dto.getConfidence().compareTo(BigDecimal.ONE) > 0) {
                dto.setConfidence(BigDecimal.valueOf(0.85));
            }

            dto.setAiModel(aiModel);
            dto.setPromptVersion(AiPromptBuilder.PROMPT_VERSION);
            dto.setAiStatus("AVAILABLE");

            return dto;
        } catch (Exception e) {
            log.error("Failed to parse structured AI response JSON: {}", rawContent, e);
            throw new RuntimeException("Malformed JSON returned by AI model", e);
        }
    }
}
