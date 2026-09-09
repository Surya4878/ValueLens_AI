package com.valuelens.ai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AiAnalysisResponseDto {

    private String assessmentId;
    private String calculationResultId;
    private String decision = "FAVORABLE";
    private BigDecimal confidence = BigDecimal.valueOf(0.91);
    private String executiveSummary;
    private String financialAssessment;
    private String scenarioInterpretation;
    private String aiStatus = "AVAILABLE";
    private String statusMessage;

    private List<String> whatTheNumbersSay = new ArrayList<>();
    private List<CostDriverInsightDto> costDrivers = new ArrayList<>();
    private List<ChartInsightDto> chartInsights = new ArrayList<>();
    private List<String> keyInsights = new ArrayList<>();
    private List<RiskInsightDto> risks = new ArrayList<>();
    private List<String> opportunities = new ArrayList<>();
    private List<RecommendationDto> recommendations = new ArrayList<>();
    private List<String> decisionFactors = new ArrayList<>();
    private List<String> assumptions = new ArrayList<>();

    private DataQualitySummaryDto dataQuality;
    private String aiModel;
    private String promptVersion;
    private LocalDateTime timestamp;

    public AiAnalysisResponseDto() {}

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public String getCalculationResultId() { return calculationResultId; }
    public void setCalculationResultId(String calculationResultId) { this.calculationResultId = calculationResultId; }
    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
    public BigDecimal getConfidence() { return confidence; }
    public void setConfidence(BigDecimal confidence) { this.confidence = confidence; }
    public String getExecutiveSummary() { return executiveSummary; }
    public void setExecutiveSummary(String executiveSummary) { this.executiveSummary = executiveSummary; }
    public String getFinancialAssessment() { return financialAssessment; }
    public void setFinancialAssessment(String financialAssessment) { this.financialAssessment = financialAssessment; }
    public String getScenarioInterpretation() { return scenarioInterpretation; }
    public void setScenarioInterpretation(String scenarioInterpretation) { this.scenarioInterpretation = scenarioInterpretation; }
    public String getAiStatus() { return aiStatus; }
    public void setAiStatus(String aiStatus) { this.aiStatus = aiStatus; }
    public String getStatusMessage() { return statusMessage; }
    public void setStatusMessage(String statusMessage) { this.statusMessage = statusMessage; }
    public List<String> getWhatTheNumbersSay() { return whatTheNumbersSay; }
    public void setWhatTheNumbersSay(List<String> whatTheNumbersSay) { this.whatTheNumbersSay = whatTheNumbersSay; }
    public List<CostDriverInsightDto> getCostDrivers() { return costDrivers; }
    public void setCostDrivers(List<CostDriverInsightDto> costDrivers) { this.costDrivers = costDrivers; }
    public List<ChartInsightDto> getChartInsights() { return chartInsights; }
    public void setChartInsights(List<ChartInsightDto> chartInsights) { this.chartInsights = chartInsights; }
    public List<String> getKeyInsights() { return keyInsights; }
    public void setKeyInsights(List<String> keyInsights) { this.keyInsights = keyInsights; }
    public List<RiskInsightDto> getRisks() { return risks; }
    public void setRisks(List<RiskInsightDto> risks) { this.risks = risks; }
    public List<String> getOpportunities() { return opportunities; }
    public void setOpportunities(List<String> opportunities) { this.opportunities = opportunities; }
    public List<RecommendationDto> getRecommendations() { return recommendations; }
    public void setRecommendations(List<RecommendationDto> recommendations) { this.recommendations = recommendations; }
    public List<String> getDecisionFactors() { return decisionFactors; }
    public void setDecisionFactors(List<String> decisionFactors) { this.decisionFactors = decisionFactors; }
    public List<String> getAssumptions() { return assumptions; }
    public void setAssumptions(List<String> assumptions) { this.assumptions = assumptions; }
    public DataQualitySummaryDto getDataQuality() { return dataQuality; }
    public void setDataQuality(DataQualitySummaryDto dataQuality) { this.dataQuality = dataQuality; }
    public String getAiModel() { return aiModel; }
    public void setAiModel(String aiModel) { this.aiModel = aiModel; }
    public String getPromptVersion() { return promptVersion; }
    public void setPromptVersion(String promptVersion) { this.promptVersion = promptVersion; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CostDriverInsightDto {
        private String name;
        private String impact;
        private String explanation;

        public CostDriverInsightDto() {}
        public CostDriverInsightDto(String name, String impact, String explanation) {
            this.name = name;
            this.impact = impact;
            this.explanation = explanation;
        }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getImpact() { return impact; }
        public void setImpact(String impact) { this.impact = impact; }
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChartInsightDto {
        private String chartId;
        private String finding;
        private String businessImpact;

        public ChartInsightDto() {}
        public ChartInsightDto(String chartId, String finding, String businessImpact) {
            this.chartId = chartId;
            this.finding = finding;
            this.businessImpact = businessImpact;
        }
        public String getChartId() { return chartId; }
        public void setChartId(String chartId) { this.chartId = chartId; }
        public String getFinding() { return finding; }
        public void setFinding(String finding) { this.finding = finding; }
        public String getBusinessImpact() { return businessImpact; }
        public void setBusinessImpact(String businessImpact) { this.businessImpact = businessImpact; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RiskInsightDto {
        private String severity; // LOW, MEDIUM, HIGH, CRITICAL
        private String title;
        private String reason;
        private String potentialImpact;
        private String mitigation;

        public RiskInsightDto() {}
        public RiskInsightDto(String severity, String title, String reason, String potentialImpact, String mitigation) {
            this.severity = severity;
            this.title = title;
            this.reason = reason;
            this.potentialImpact = potentialImpact;
            this.mitigation = mitigation;
        }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public String getPotentialImpact() { return potentialImpact; }
        public void setPotentialImpact(String potentialImpact) { this.potentialImpact = potentialImpact; }
        public String getMitigation() { return mitigation; }
        public void setMitigation(String mitigation) { this.mitigation = mitigation; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RecommendationDto {
        private String priority; // HIGH, MEDIUM, LOW
        private String action;
        private String reason;
        private String expectedImpact;
        private String owner;
        private String timing;

        public RecommendationDto() {}
        public RecommendationDto(String priority, String action, String reason, String expectedImpact, String owner, String timing) {
            this.priority = priority;
            this.action = action;
            this.reason = reason;
            this.expectedImpact = expectedImpact;
            this.owner = owner;
            this.timing = timing;
        }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public String getExpectedImpact() { return expectedImpact; }
        public void setExpectedImpact(String expectedImpact) { this.expectedImpact = expectedImpact; }
        public String getOwner() { return owner; }
        public void setOwner(String owner) { this.owner = owner; }
        public String getTiming() { return timing; }
        public void setTiming(String timing) { this.timing = timing; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DataQualitySummaryDto {
        private int score;
        private String level;

        public DataQualitySummaryDto() {}
        public DataQualitySummaryDto(int score, String level) {
            this.score = score;
            this.level = level;
        }
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
    }
}
