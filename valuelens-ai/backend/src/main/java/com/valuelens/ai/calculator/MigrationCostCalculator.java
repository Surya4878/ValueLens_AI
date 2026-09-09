package com.valuelens.ai.calculator;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class MigrationCostCalculator {

    public record MigrationCostResult(
            BigDecimal baseMigrationCost,
            BigDecimal contingencyCost,
            BigDecimal totalMigrationCost
    ) {}

    public MigrationCostResult calculate(
            BigDecimal developmentCost,
            BigDecimal testingCost,
            BigDecimal architectureCost,
            BigDecimal projectManagementCost,
            BigDecimal trainingCost,
            BigDecimal deploymentCutoverCost,
            BigDecimal documentationCost,
            BigDecimal contingencyCost
    ) {
        BigDecimal base = zeroIfNull(developmentCost)
                .add(zeroIfNull(testingCost))
                .add(zeroIfNull(architectureCost))
                .add(zeroIfNull(projectManagementCost))
                .add(zeroIfNull(trainingCost))
                .add(zeroIfNull(deploymentCutoverCost))
                .add(zeroIfNull(documentationCost))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal contingency = zeroIfNull(contingencyCost).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = base.add(contingency).setScale(2, RoundingMode.HALF_UP);

        return new MigrationCostResult(base, contingency, total);
    }

    private BigDecimal zeroIfNull(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }
}
