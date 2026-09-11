package com.valuelens.ai.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valuelens.ai.dto.AssessmentDto;
import com.valuelens.ai.dto.RoiCalculationResponseDto;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class AiPromptBuilder {

    private final ObjectMapper objectMapper;

    public static final String PROMPT_VERSION = "VALUELENS_AI_V1";

    public AiPromptBuilder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String buildSystemPrompt() {
        return """
You are ValueLens AI, an enterprise migration economics and integration-platform decision analyst specializing in SAP PI/PO, MuleSoft, SAP CPI (Neo), and Boomi transitions to SAP BTP Integration Suite.

STRICT OPERATIONAL RULES:
1. Ground every statement exclusively on the provided deterministic calculations and assessment metrics.
2. NEVER invent, hallucinate, or alter financial numbers. The calculations provided to you are the authoritative financial truth.
3. Clearly distinguish between CALCULATED FACTS (e.g. Current TCO, Target TCO, Annual Savings, ROI, Break-even) and ADVISORY INTERPRETATIONS.
4. Formulate an executive-level decision from one of these exact values: STRONGLY_FAVORABLE, FAVORABLE, CONDITIONALLY_FAVORABLE, NEUTRAL, UNFAVORABLE, INSUFFICIENT_DATA.
5. Base the decision on the combination of: financial savings, payback period, interface migration complexity, data quality, timeline, and risk profile.
6. Provide concrete, actionable recommendations categorized by priority (HIGH, MEDIUM, LOW) with suggested owners and timing.
7. Identify specific migration risks and realistic mitigations.
8. Explain what assumptions management must validate before investment approval.
9. Formulate 'decisionFactors' explaining what would change this decision (e.g., if migration costs exceed threshold X or target consumption increases by Y).
10. Return ONLY a valid, parseable JSON object adhering strictly to the requested schema. Do NOT include extraneous markdown explanations outside the JSON.

REQUIRED JSON OUTPUT FORMAT:
{
  "decision": "FAVORABLE",
  "confidence": 0.91,
  "executiveSummary": "Concise executive overview of the migration economics...",
  "financialAssessment": "Detailed financial assessment...",
  "scenarioInterpretation": "Sensitivity and scenario analysis commentary...",
  "whatTheNumbersSay": ["Bullet 1 with exact numbers", "Bullet 2"],
  "costDrivers": [{"name": "Licensing", "impact": "High", "explanation": "..."}],
  "keyInsights": ["Insight 1", "Insight 2"],
  "risks": [{"severity": "MEDIUM", "title": "...", "reason": "...", "potentialImpact": "...", "mitigation": "..."}],
  "opportunities": ["Opportunity 1", "Opportunity 2"],
  "recommendations": [{"priority": "HIGH", "action": "...", "reason": "...", "expectedImpact": "...", "owner": "...", "timing": "..."}],
  "decisionFactors": ["Factor 1", "Factor 2"],
  "assumptions": ["Assumption 1", "Assumption 2"]
}
""";
    }

    public String buildNormalizedContextPayload(AssessmentDto assessment, RoiCalculationResponseDto calculations, Map<String, Object> scenario) {
        try {
            Map<String, Object> context = new HashMap<>();

            Map<String, Object> meta = new HashMap<>();
            meta.put("sourcePlatform", assessment.getSourcePlatform());
            meta.put("targetPlatform", assessment.getTargetPlatform());
            meta.put("currency", assessment.getCurrency());
            context.put("metadata", meta);

            if (assessment.getSourceSystem() != null) {
                context.put("company", assessment.getSourceSystem().getCompanyInformation());
                context.put("environment", assessment.getSourceSystem().getEnvironmentAssessment());
                context.put("volumetrics", assessment.getSourceSystem().getVolumetrics());
            }

            if (calculations != null) {
                Map<String, Object> financialSummary = new HashMap<>();
                financialSummary.put("currentPlatformTCO", calculations.getCurrentPlatformTCO());
                financialSummary.put("targetPlatformTCO", calculations.getTargetPlatformTCO());
                financialSummary.put("annualSavings", calculations.getAnnualSavings());
                financialSummary.put("savingsPercentage", calculations.getSavingsPercentage());
                financialSummary.put("migrationCost", calculations.getMigrationCost());
                financialSummary.put("breakEvenMonths", calculations.getBreakEvenMonths());
                financialSummary.put("breakEvenStatus", calculations.getBreakEvenStatus());
                financialSummary.put("oneYearROI", calculations.getOneYearROI());
                financialSummary.put("threeYearROI", calculations.getThreeYearROI());
                financialSummary.put("fiveYearROI", calculations.getFiveYearROI());
                financialSummary.put("tenYearROI", calculations.getTenYearROI());
                financialSummary.put("fiveYearNetBenefit", calculations.getFiveYearNetBenefit());

                financialSummary.put("licensingSubtotal", calculations.getLicensingSubtotal());
                financialSummary.put("infrastructureSubtotal", calculations.getInfrastructureSubtotal());
                financialSummary.put("supportSubtotal", calculations.getSupportSubtotal());
                financialSummary.put("operationsSubtotal", calculations.getOperationsSubtotal());
                financialSummary.put("costDrivers", calculations.getCostDrivers());
                financialSummary.put("complexity", calculations.getComplexityResult());
                financialSummary.put("dataQuality", calculations.getDataQuality());
                context.put("calculations", financialSummary);
            }

            if (scenario != null && !scenario.isEmpty()) {
                context.put("scenario", scenario);
            }

            return objectMapper.writeValueAsString(context);
        } catch (Exception e) {
            throw new RuntimeException("Failed to construct normalized AI payload", e);
        }
    }
}
