package com.valuelens.ai.dto;

import java.math.BigDecimal;

public class ScenarioRequestDto {

    private String assessmentId;
    private BigDecimal savingsFactor = BigDecimal.valueOf(1.0);
    private BigDecimal migrationCostFactor = BigDecimal.valueOf(1.0);
    private BigDecimal targetCostFactor = BigDecimal.valueOf(1.0);
    private BigDecimal messageVolumeFactor = BigDecimal.valueOf(1.0);
    private BigDecimal interfaceCountFactor = BigDecimal.valueOf(1.0);

    // Optional direct inputs if no assessmentId
    private BigDecimal baselineCurrentTco;
    private BigDecimal baselineTargetTco;
    private BigDecimal baselineMigrationCost;

    public ScenarioRequestDto() {}

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public BigDecimal getSavingsFactor() { return savingsFactor; }
    public void setSavingsFactor(BigDecimal savingsFactor) { this.savingsFactor = savingsFactor; }
    public BigDecimal getMigrationCostFactor() { return migrationCostFactor; }
    public void setMigrationCostFactor(BigDecimal migrationCostFactor) { this.migrationCostFactor = migrationCostFactor; }
    public BigDecimal getTargetCostFactor() { return targetCostFactor; }
    public void setTargetCostFactor(BigDecimal targetCostFactor) { this.targetCostFactor = targetCostFactor; }
    public BigDecimal getMessageVolumeFactor() { return messageVolumeFactor; }
    public void setMessageVolumeFactor(BigDecimal messageVolumeFactor) { this.messageVolumeFactor = messageVolumeFactor; }
    public BigDecimal getInterfaceCountFactor() { return interfaceCountFactor; }
    public void setInterfaceCountFactor(BigDecimal interfaceCountFactor) { this.interfaceCountFactor = interfaceCountFactor; }
    public BigDecimal getBaselineCurrentTco() { return baselineCurrentTco; }
    public void setBaselineCurrentTco(BigDecimal baselineCurrentTco) { this.baselineCurrentTco = baselineCurrentTco; }
    public BigDecimal getBaselineTargetTco() { return baselineTargetTco; }
    public void setBaselineTargetTco(BigDecimal baselineTargetTco) { this.baselineTargetTco = baselineTargetTco; }
    public BigDecimal getBaselineMigrationCost() { return baselineMigrationCost; }
    public void setBaselineMigrationCost(BigDecimal baselineMigrationCost) { this.baselineMigrationCost = baselineMigrationCost; }
}
