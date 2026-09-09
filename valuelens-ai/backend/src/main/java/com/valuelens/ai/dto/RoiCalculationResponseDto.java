package com.valuelens.ai.dto;

import com.valuelens.ai.calculator.BreakEvenCalculator.BreakEvenStatus;
import com.valuelens.ai.calculator.MigrationComplexityCalculator.ComplexityResult;
import com.valuelens.ai.service.DataQualityService.QualityResult;
import com.valuelens.ai.validation.DataConsistencyValidator.ConsistencyWarning;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class RoiCalculationResponseDto {

    private String assessmentId;
    private String calculationResultId;

    // Core Metrics
    private BigDecimal currentPlatformTCO;
    private BigDecimal targetPlatformTCO;
    private BigDecimal migrationCost;
    private BigDecimal annualSavings;
    private BigDecimal savingsPercentage;

    // Break-even
    private BigDecimal breakEvenMonths;
    private BreakEvenStatus breakEvenStatus;

    // Multi-period ROI (%)
    private BigDecimal oneYearROI;
    private BigDecimal threeYearROI;
    private BigDecimal fiveYearROI;
    private BigDecimal tenYearROI;

    // Multi-period Net Benefit
    private BigDecimal oneYearNetBenefit;
    private BigDecimal threeYearNetBenefit;
    private BigDecimal fiveYearNetBenefit;
    private BigDecimal tenYearNetBenefit;

    // Formulas
    private String annualSavingsFormula = "Current Platform TCO - Target Platform TCO";
    private String roiFormula = "((Annual Savings * ROI Analysis Period Years) - Migration Cost) / Migration Cost * 100";
    private String breakEvenFormula = "Migration Cost / Annual Savings * 12";

    // Subtotal Breakdown (Current TCO)
    private BigDecimal licensingSubtotal;
    private BigDecimal infrastructureSubtotal;
    private BigDecimal supportSubtotal;
    private BigDecimal operationsSubtotal;

    // Subtotal Breakdown (Target TCO)
    private BigDecimal targetConfigurationCost;
    private BigDecimal targetAdditionalTco;

    // Cost Drivers
    private List<CostDriverDto> costDrivers;

    // Migration Complexity
    private ComplexityResult complexityResult;

    // Data Quality
    private QualityResult dataQuality;

    // Data Consistency
    private List<ConsistencyWarning> consistencyWarnings;

    // Calculation Traces for Auditability ("View Calculation")
    private Map<String, CalculationTraceDto> calculationTraces;

    // Audit Metadata
    private String pricingVersion;
    private String calculationVersion;
    private LocalDateTime calculatedAt;
    private String currency;

    public RoiCalculationResponseDto() {}

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public String getCalculationResultId() { return calculationResultId; }
    public void setCalculationResultId(String calculationResultId) { this.calculationResultId = calculationResultId; }
    public BigDecimal getCurrentPlatformTCO() { return currentPlatformTCO; }
    public void setCurrentPlatformTCO(BigDecimal currentPlatformTCO) { this.currentPlatformTCO = currentPlatformTCO; }
    public BigDecimal getTargetPlatformTCO() { return targetPlatformTCO; }
    public void setTargetPlatformTCO(BigDecimal targetPlatformTCO) { this.targetPlatformTCO = targetPlatformTCO; }
    public BigDecimal getMigrationCost() { return migrationCost; }
    public void setMigrationCost(BigDecimal migrationCost) { this.migrationCost = migrationCost; }
    public BigDecimal getAnnualSavings() { return annualSavings; }
    public void setAnnualSavings(BigDecimal annualSavings) { this.annualSavings = annualSavings; }
    public BigDecimal getSavingsPercentage() { return savingsPercentage; }
    public void setSavingsPercentage(BigDecimal savingsPercentage) { this.savingsPercentage = savingsPercentage; }
    public BigDecimal getBreakEvenMonths() { return breakEvenMonths; }
    public void setBreakEvenMonths(BigDecimal breakEvenMonths) { this.breakEvenMonths = breakEvenMonths; }
    public BreakEvenStatus getBreakEvenStatus() { return breakEvenStatus; }
    public void setBreakEvenStatus(BreakEvenStatus breakEvenStatus) { this.breakEvenStatus = breakEvenStatus; }
    public BigDecimal getOneYearROI() { return oneYearROI; }
    public void setOneYearROI(BigDecimal oneYearROI) { this.oneYearROI = oneYearROI; }
    public BigDecimal getThreeYearROI() { return threeYearROI; }
    public void setThreeYearROI(BigDecimal threeYearROI) { this.threeYearROI = threeYearROI; }
    public BigDecimal getFiveYearROI() { return fiveYearROI; }
    public void setFiveYearROI(BigDecimal fiveYearROI) { this.fiveYearROI = fiveYearROI; }
    public BigDecimal getTenYearROI() { return tenYearROI; }
    public void setTenYearROI(BigDecimal tenYearROI) { this.tenYearROI = tenYearROI; }
    public BigDecimal getOneYearNetBenefit() { return oneYearNetBenefit; }
    public void setOneYearNetBenefit(BigDecimal oneYearNetBenefit) { this.oneYearNetBenefit = oneYearNetBenefit; }
    public BigDecimal getThreeYearNetBenefit() { return threeYearNetBenefit; }
    public void setThreeYearNetBenefit(BigDecimal threeYearNetBenefit) { this.threeYearNetBenefit = threeYearNetBenefit; }
    public BigDecimal getFiveYearNetBenefit() { return fiveYearNetBenefit; }
    public void setFiveYearNetBenefit(BigDecimal fiveYearNetBenefit) { this.fiveYearNetBenefit = fiveYearNetBenefit; }
    public BigDecimal getTenYearNetBenefit() { return tenYearNetBenefit; }
    public void setTenYearNetBenefit(BigDecimal tenYearNetBenefit) { this.tenYearNetBenefit = tenYearNetBenefit; }
    public String getAnnualSavingsFormula() { return annualSavingsFormula; }
    public void setAnnualSavingsFormula(String annualSavingsFormula) { this.annualSavingsFormula = annualSavingsFormula; }
    public String getRoiFormula() { return roiFormula; }
    public void setRoiFormula(String roiFormula) { this.roiFormula = roiFormula; }
    public String getBreakEvenFormula() { return breakEvenFormula; }
    public void setBreakEvenFormula(String breakEvenFormula) { this.breakEvenFormula = breakEvenFormula; }
    public BigDecimal getLicensingSubtotal() { return licensingSubtotal; }
    public void setLicensingSubtotal(BigDecimal licensingSubtotal) { this.licensingSubtotal = licensingSubtotal; }
    public BigDecimal getInfrastructureSubtotal() { return infrastructureSubtotal; }
    public void setInfrastructureSubtotal(BigDecimal infrastructureSubtotal) { this.infrastructureSubtotal = infrastructureSubtotal; }
    public BigDecimal getSupportSubtotal() { return supportSubtotal; }
    public void setSupportSubtotal(BigDecimal supportSubtotal) { this.supportSubtotal = supportSubtotal; }
    public BigDecimal getOperationsSubtotal() { return operationsSubtotal; }
    public void setOperationsSubtotal(BigDecimal operationsSubtotal) { this.operationsSubtotal = operationsSubtotal; }
    public BigDecimal getTargetConfigurationCost() { return targetConfigurationCost; }
    public void setTargetConfigurationCost(BigDecimal targetConfigurationCost) { this.targetConfigurationCost = targetConfigurationCost; }
    public BigDecimal getTargetAdditionalTco() { return targetAdditionalTco; }
    public void setTargetAdditionalTco(BigDecimal targetAdditionalTco) { this.targetAdditionalTco = targetAdditionalTco; }
    public List<CostDriverDto> getCostDrivers() { return costDrivers; }
    public void setCostDrivers(List<CostDriverDto> costDrivers) { this.costDrivers = costDrivers; }
    public ComplexityResult getComplexityResult() { return complexityResult; }
    public void setComplexityResult(ComplexityResult complexityResult) { this.complexityResult = complexityResult; }
    public QualityResult getDataQuality() { return dataQuality; }
    public void setDataQuality(QualityResult dataQuality) { this.dataQuality = dataQuality; }
    public List<ConsistencyWarning> getConsistencyWarnings() { return consistencyWarnings; }
    public void setConsistencyWarnings(List<ConsistencyWarning> consistencyWarnings) { this.consistencyWarnings = consistencyWarnings; }
    public Map<String, CalculationTraceDto> getCalculationTraces() { return calculationTraces; }
    public void setCalculationTraces(Map<String, CalculationTraceDto> calculationTraces) { this.calculationTraces = calculationTraces; }
    public String getPricingVersion() { return pricingVersion; }
    public void setPricingVersion(String pricingVersion) { this.pricingVersion = pricingVersion; }
    public String getCalculationVersion() { return calculationVersion; }
    public void setCalculationVersion(String calculationVersion) { this.calculationVersion = calculationVersion; }
    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public static class CostDriverDto {
        private String category;
        private BigDecimal amount;
        private BigDecimal percentage;
        private String description;

        public CostDriverDto() {}

        public CostDriverDto(String category, BigDecimal amount, BigDecimal percentage, String description) {
            this.category = category;
            this.amount = amount;
            this.percentage = percentage;
            this.description = description;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public BigDecimal getPercentage() { return percentage; }
        public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class CalculationTraceDto {
        private String metric;
        private String formula;
        private Map<String, Object> inputs;
        private Object result;
        private String explanation;

        public CalculationTraceDto() {}

        public CalculationTraceDto(String metric, String formula, Map<String, Object> inputs, Object result, String explanation) {
            this.metric = metric;
            this.formula = formula;
            this.inputs = inputs;
            this.result = result;
            this.explanation = explanation;
        }

        public String getMetric() { return metric; }
        public void setMetric(String metric) { this.metric = metric; }
        public String getFormula() { return formula; }
        public void setFormula(String formula) { this.formula = formula; }
        public Map<String, Object> getInputs() { return inputs; }
        public void setInputs(Map<String, Object> inputs) { this.inputs = inputs; }
        public Object getResult() { return result; }
        public void setResult(Object result) { this.result = result; }
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }
}
