package com.valuelens.ai.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analysis_snapshots")
public class AiAnalysisEntity {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "assessment_id", length = 64)
    private String assessmentId;

    @Column(name = "calculation_result_id", length = 64)
    private String calculationResultId;

    @Column(name = "scenario_id", length = 64)
    private String scenarioId;

    @Column(nullable = false, length = 32)
    private String decision;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal confidence;

    @Column(name = "executive_summary", columnDefinition = "TEXT")
    private String executiveSummary;

    @Column(name = "financial_assessment", columnDefinition = "TEXT")
    private String financialAssessment;

    @Column(name = "scenario_interpretation", columnDefinition = "TEXT")
    private String scenarioInterpretation;

    @Column(name = "ai_model", nullable = false, length = 128)
    private String aiModel;

    @Column(name = "prompt_version", nullable = false, length = 32)
    private String promptVersion;

    @Column(name = "cache_hash", nullable = false, length = 128)
    private String cacheHash;

    @Column(name = "data_quality_json", columnDefinition = "TEXT")
    private String dataQualityJson;

    @Column(name = "cost_drivers_json", columnDefinition = "TEXT")
    private String costDriversJson;

    @Column(name = "key_insights_json", columnDefinition = "TEXT")
    private String keyInsightsJson;

    @Column(name = "risks_json", columnDefinition = "TEXT")
    private String risksJson;

    @Column(name = "opportunities_json", columnDefinition = "TEXT")
    private String opportunitiesJson;

    @Column(name = "recommendations_json", columnDefinition = "TEXT")
    private String recommendationsJson;

    @Column(name = "assumptions_json", columnDefinition = "TEXT")
    private String assumptionsJson;

    @Column(name = "decision_factors_json", columnDefinition = "TEXT")
    private String decisionFactorsJson;

    @Column(name = "chart_insights_json", columnDefinition = "TEXT")
    private String chartInsightsJson;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public AiAnalysisEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public String getCalculationResultId() { return calculationResultId; }
    public void setCalculationResultId(String calculationResultId) { this.calculationResultId = calculationResultId; }
    public String getScenarioId() { return scenarioId; }
    public void setScenarioId(String scenarioId) { this.scenarioId = scenarioId; }
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
    public String getAiModel() { return aiModel; }
    public void setAiModel(String aiModel) { this.aiModel = aiModel; }
    public String getPromptVersion() { return promptVersion; }
    public void setPromptVersion(String promptVersion) { this.promptVersion = promptVersion; }
    public String getCacheHash() { return cacheHash; }
    public void setCacheHash(String cacheHash) { this.cacheHash = cacheHash; }
    public String getDataQualityJson() { return dataQualityJson; }
    public void setDataQualityJson(String dataQualityJson) { this.dataQualityJson = dataQualityJson; }
    public String getCostDriversJson() { return costDriversJson; }
    public void setCostDriversJson(String costDriversJson) { this.costDriversJson = costDriversJson; }
    public String getKeyInsightsJson() { return keyInsightsJson; }
    public void setKeyInsightsJson(String keyInsightsJson) { this.keyInsightsJson = keyInsightsJson; }
    public String getRisksJson() { return risksJson; }
    public void setRisksJson(String risksJson) { this.risksJson = risksJson; }
    public String getOpportunitiesJson() { return opportunitiesJson; }
    public void setOpportunitiesJson(String opportunitiesJson) { this.opportunitiesJson = opportunitiesJson; }
    public String getRecommendationsJson() { return recommendationsJson; }
    public void setRecommendationsJson(String recommendationsJson) { this.recommendationsJson = recommendationsJson; }
    public String getAssumptionsJson() { return assumptionsJson; }
    public void setAssumptionsJson(String assumptionsJson) { this.assumptionsJson = assumptionsJson; }
    public String getDecisionFactorsJson() { return decisionFactorsJson; }
    public void setDecisionFactorsJson(String decisionFactorsJson) { this.decisionFactorsJson = decisionFactorsJson; }
    public String getChartInsightsJson() { return chartInsightsJson; }
    public void setChartInsightsJson(String chartInsightsJson) { this.chartInsightsJson = chartInsightsJson; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
