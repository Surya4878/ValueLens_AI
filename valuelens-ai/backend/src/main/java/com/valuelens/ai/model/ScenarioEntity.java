package com.valuelens.ai.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "scenario_records")
public class ScenarioEntity {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "assessment_id", nullable = false, length = 64)
    private String assessmentId;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(name = "savings_factor", nullable = false, precision = 5, scale = 2)
    private BigDecimal savingsFactor;

    @Column(name = "migration_cost_factor", nullable = false, precision = 5, scale = 2)
    private BigDecimal migrationCostFactor;

    @Column(name = "target_cost_factor", nullable = false, precision = 5, scale = 2)
    private BigDecimal targetCostFactor;

    @Column(name = "scenario_annual_savings", nullable = false, precision = 18, scale = 2)
    private BigDecimal scenarioAnnualSavings;

    @Column(name = "scenario_migration_cost", nullable = false, precision = 18, scale = 2)
    private BigDecimal scenarioMigrationCost;

    @Column(name = "scenario_target_tco", nullable = false, precision = 18, scale = 2)
    private BigDecimal scenarioTargetTco;

    @Column(name = "scenario_break_even_months", precision = 8, scale = 2)
    private BigDecimal scenarioBreakEvenMonths;

    @Column(name = "scenario_five_year_roi", precision = 10, scale = 2)
    private BigDecimal scenarioFiveYearRoi;

    @Column(name = "scenario_net_benefit", precision = 18, scale = 2)
    private BigDecimal scenarioNetBenefit;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public ScenarioEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getSavingsFactor() { return savingsFactor; }
    public void setSavingsFactor(BigDecimal savingsFactor) { this.savingsFactor = savingsFactor; }
    public BigDecimal getMigrationCostFactor() { return migrationCostFactor; }
    public void setMigrationCostFactor(BigDecimal migrationCostFactor) { this.migrationCostFactor = migrationCostFactor; }
    public BigDecimal getTargetCostFactor() { return targetCostFactor; }
    public void setTargetCostFactor(BigDecimal targetCostFactor) { this.targetCostFactor = targetCostFactor; }
    public BigDecimal getScenarioAnnualSavings() { return scenarioAnnualSavings; }
    public void setScenarioAnnualSavings(BigDecimal scenarioAnnualSavings) { this.scenarioAnnualSavings = scenarioAnnualSavings; }
    public BigDecimal getScenarioMigrationCost() { return scenarioMigrationCost; }
    public void setScenarioMigrationCost(BigDecimal scenarioMigrationCost) { this.scenarioMigrationCost = scenarioMigrationCost; }
    public BigDecimal getScenarioTargetTco() { return scenarioTargetTco; }
    public void setScenarioTargetTco(BigDecimal scenarioTargetTco) { this.scenarioTargetTco = scenarioTargetTco; }
    public BigDecimal getScenarioBreakEvenMonths() { return scenarioBreakEvenMonths; }
    public void setScenarioBreakEvenMonths(BigDecimal scenarioBreakEvenMonths) { this.scenarioBreakEvenMonths = scenarioBreakEvenMonths; }
    public BigDecimal getScenarioFiveYearRoi() { return scenarioFiveYearRoi; }
    public void setScenarioFiveYearRoi(BigDecimal scenarioFiveYearRoi) { this.scenarioFiveYearRoi = scenarioFiveYearRoi; }
    public BigDecimal getScenarioNetBenefit() { return scenarioNetBenefit; }
    public void setScenarioNetBenefit(BigDecimal scenarioNetBenefit) { this.scenarioNetBenefit = scenarioNetBenefit; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
