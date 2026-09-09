package com.valuelens.ai.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "calculation_results")
public class CalculationResultEntity {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "assessment_id", nullable = false, length = 64)
    private String assessmentId;

    @Column(name = "current_platform_tco", nullable = false, precision = 18, scale = 2)
    private BigDecimal currentPlatformTco;

    @Column(name = "target_platform_tco", nullable = false, precision = 18, scale = 2)
    private BigDecimal targetPlatformTco;

    @Column(name = "migration_cost", nullable = false, precision = 18, scale = 2)
    private BigDecimal migrationCost;

    @Column(name = "annual_savings", nullable = false, precision = 18, scale = 2)
    private BigDecimal annualSavings;

    @Column(name = "savings_percentage", nullable = false, precision = 8, scale = 2)
    private BigDecimal savingsPercentage;

    @Column(name = "break_even_months", precision = 8, scale = 2)
    private BigDecimal breakEvenMonths;

    @Column(name = "break_even_status", nullable = false, length = 32)
    private String breakEvenStatus;

    @Column(name = "one_year_roi", precision = 10, scale = 2)
    private BigDecimal oneYearRoi;

    @Column(name = "three_year_roi", precision = 10, scale = 2)
    private BigDecimal threeYearRoi;

    @Column(name = "five_year_roi", precision = 10, scale = 2)
    private BigDecimal fiveYearRoi;

    @Column(name = "ten_year_roi", precision = 10, scale = 2)
    private BigDecimal tenYearRoi;

    @Column(name = "one_year_net_benefit", precision = 18, scale = 2)
    private BigDecimal oneYearNetBenefit;

    @Column(name = "three_year_net_benefit", precision = 18, scale = 2)
    private BigDecimal threeYearNetBenefit;

    @Column(name = "five_year_net_benefit", precision = 18, scale = 2)
    private BigDecimal fiveYearNetBenefit;

    @Column(name = "ten_year_net_benefit", precision = 18, scale = 2)
    private BigDecimal tenYearNetBenefit;

    @Column(name = "calculation_version", nullable = false, length = 32)
    private String calculationVersion;

    @Column(name = "pricing_version", nullable = false, length = 32)
    private String pricingVersion;

    @Column(name = "data_quality_score", nullable = false)
    private int dataQualityScore;

    @Column(name = "data_quality_level", nullable = false, length = 16)
    private String dataQualityLevel;

    @Column(name = "calculated_at", nullable = false)
    private LocalDateTime calculatedAt;

    @Column(name = "calculation_trace", columnDefinition = "TEXT")
    private String calculationTraceJson;

    @Column(name = "consistency_warnings", columnDefinition = "TEXT")
    private String consistencyWarningsJson;

    public CalculationResultEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public BigDecimal getCurrentPlatformTco() { return currentPlatformTco; }
    public void setCurrentPlatformTco(BigDecimal currentPlatformTco) { this.currentPlatformTco = currentPlatformTco; }
    public BigDecimal getTargetPlatformTco() { return targetPlatformTco; }
    public void setTargetPlatformTco(BigDecimal targetPlatformTco) { this.targetPlatformTco = targetPlatformTco; }
    public BigDecimal getMigrationCost() { return migrationCost; }
    public void setMigrationCost(BigDecimal migrationCost) { this.migrationCost = migrationCost; }
    public BigDecimal getAnnualSavings() { return annualSavings; }
    public void setAnnualSavings(BigDecimal annualSavings) { this.annualSavings = annualSavings; }
    public BigDecimal getSavingsPercentage() { return savingsPercentage; }
    public void setSavingsPercentage(BigDecimal savingsPercentage) { this.savingsPercentage = savingsPercentage; }
    public BigDecimal getBreakEvenMonths() { return breakEvenMonths; }
    public void setBreakEvenMonths(BigDecimal breakEvenMonths) { this.breakEvenMonths = breakEvenMonths; }
    public String getBreakEvenStatus() { return breakEvenStatus; }
    public void setBreakEvenStatus(String breakEvenStatus) { this.breakEvenStatus = breakEvenStatus; }
    public BigDecimal getOneYearRoi() { return oneYearRoi; }
    public void setOneYearRoi(BigDecimal oneYearRoi) { this.oneYearRoi = oneYearRoi; }
    public BigDecimal getThreeYearRoi() { return threeYearRoi; }
    public void setThreeYearRoi(BigDecimal threeYearRoi) { this.threeYearRoi = threeYearRoi; }
    public BigDecimal getFiveYearRoi() { return fiveYearRoi; }
    public void setFiveYearRoi(BigDecimal fiveYearRoi) { this.fiveYearRoi = fiveYearRoi; }
    public BigDecimal getTenYearRoi() { return tenYearRoi; }
    public void setTenYearRoi(BigDecimal tenYearRoi) { this.tenYearRoi = tenYearRoi; }
    public BigDecimal getOneYearNetBenefit() { return oneYearNetBenefit; }
    public void setOneYearNetBenefit(BigDecimal oneYearNetBenefit) { this.oneYearNetBenefit = oneYearNetBenefit; }
    public BigDecimal getThreeYearNetBenefit() { return threeYearNetBenefit; }
    public void setThreeYearNetBenefit(BigDecimal threeYearNetBenefit) { this.threeYearNetBenefit = threeYearNetBenefit; }
    public BigDecimal getFiveYearNetBenefit() { return fiveYearNetBenefit; }
    public void setFiveYearNetBenefit(BigDecimal fiveYearNetBenefit) { this.fiveYearNetBenefit = fiveYearNetBenefit; }
    public BigDecimal getTenYearNetBenefit() { return tenYearNetBenefit; }
    public void setTenYearNetBenefit(BigDecimal tenYearNetBenefit) { this.tenYearNetBenefit = tenYearNetBenefit; }
    public String getCalculationVersion() { return calculationVersion; }
    public void setCalculationVersion(String calculationVersion) { this.calculationVersion = calculationVersion; }
    public String getPricingVersion() { return pricingVersion; }
    public void setPricingVersion(String pricingVersion) { this.pricingVersion = pricingVersion; }
    public int getDataQualityScore() { return dataQualityScore; }
    public void setDataQualityScore(int dataQualityScore) { this.dataQualityScore = dataQualityScore; }
    public String getDataQualityLevel() { return dataQualityLevel; }
    public void setDataQualityLevel(String dataQualityLevel) { this.dataQualityLevel = dataQualityLevel; }
    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
    public String getCalculationTraceJson() { return calculationTraceJson; }
    public void setCalculationTraceJson(String calculationTraceJson) { this.calculationTraceJson = calculationTraceJson; }
    public String getConsistencyWarningsJson() { return consistencyWarningsJson; }
    public void setConsistencyWarningsJson(String consistencyWarningsJson) { this.consistencyWarningsJson = consistencyWarningsJson; }
}
