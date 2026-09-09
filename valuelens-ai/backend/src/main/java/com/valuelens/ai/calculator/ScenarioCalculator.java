package com.valuelens.ai.calculator;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class ScenarioCalculator {

    private final BreakEvenCalculator breakEvenCalculator;
    private final RoiCalculator roiCalculator;
    private final NetBenefitCalculator netBenefitCalculator;

    public ScenarioCalculator(
            BreakEvenCalculator breakEvenCalculator,
            RoiCalculator roiCalculator,
            NetBenefitCalculator netBenefitCalculator
    ) {
        this.breakEvenCalculator = breakEvenCalculator;
        this.roiCalculator = roiCalculator;
        this.netBenefitCalculator = netBenefitCalculator;
    }

    public record ScenarioOutcome(
            String scenarioName,
            BigDecimal savingsFactor,
            BigDecimal migrationCostFactor,
            BigDecimal targetCostFactor,
            BigDecimal currentPlatformTco,
            BigDecimal targetPlatformTco,
            BigDecimal migrationCost,
            BigDecimal annualSavings,
            BigDecimal savingsPercentage,
            BigDecimal breakEvenMonths,
            BreakEvenCalculator.BreakEvenStatus breakEvenStatus,
            BigDecimal oneYearRoi,
            BigDecimal threeYearRoi,
            BigDecimal fiveYearRoi,
            BigDecimal tenYearRoi,
            BigDecimal fiveYearNetBenefit
    ) {}

    public record ScenarioSuite(
            ScenarioOutcome customCase,
            ScenarioOutcome bestCase,
            ScenarioOutcome baseCase,
            ScenarioOutcome worstCase
    ) {}

    public ScenarioOutcome computeScenario(
            String name,
            BigDecimal baselineCurrentTco,
            BigDecimal baselineTargetTco,
            BigDecimal baselineMigrationCost,
            BigDecimal savingsFactor,
            BigDecimal migrationCostFactor,
            BigDecimal targetCostFactor
    ) {
        BigDecimal sFactor = savingsFactor != null ? savingsFactor : BigDecimal.ONE;
        BigDecimal mFactor = migrationCostFactor != null ? migrationCostFactor : BigDecimal.ONE;
        BigDecimal tFactor = targetCostFactor != null ? targetCostFactor : BigDecimal.ONE;

        BigDecimal scenarioTargetTco = baselineTargetTco.multiply(tFactor).setScale(2, RoundingMode.HALF_UP);
        BigDecimal scenarioMigrationCost = baselineMigrationCost.multiply(mFactor).setScale(2, RoundingMode.HALF_UP);

        BigDecimal baseSavings = baselineCurrentTco.subtract(scenarioTargetTco);
        BigDecimal scenarioAnnualSavings = baseSavings.multiply(sFactor).setScale(2, RoundingMode.HALF_UP);

        BigDecimal savingsPercentage = BigDecimal.ZERO;
        if (baselineCurrentTco.compareTo(BigDecimal.ZERO) > 0) {
            savingsPercentage = scenarioAnnualSavings
                    .divide(baselineCurrentTco, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        var breakEven = breakEvenCalculator.calculate(scenarioMigrationCost, scenarioAnnualSavings);
        var roi = roiCalculator.calculate(scenarioAnnualSavings, scenarioMigrationCost);
        var netBenefit = netBenefitCalculator.calculate(scenarioAnnualSavings, scenarioMigrationCost);

        return new ScenarioOutcome(
                name,
                sFactor,
                mFactor,
                tFactor,
                baselineCurrentTco,
                scenarioTargetTco,
                scenarioMigrationCost,
                scenarioAnnualSavings,
                savingsPercentage,
                breakEven.breakEvenMonths(),
                breakEven.status(),
                roi.oneYearRoi(),
                roi.threeYearRoi(),
                roi.fiveYearRoi(),
                roi.tenYearRoi(),
                netBenefit.fiveYearNetBenefit()
        );
    }

    public ScenarioSuite computeSuite(
            BigDecimal baselineCurrentTco,
            BigDecimal baselineTargetTco,
            BigDecimal baselineMigrationCost,
            BigDecimal customSavingsFactor,
            BigDecimal customMigrationFactor,
            BigDecimal customTargetFactor
    ) {
        ScenarioOutcome custom = computeScenario(
                "Custom Scenario",
                baselineCurrentTco,
                baselineTargetTco,
                baselineMigrationCost,
                customSavingsFactor,
                customMigrationFactor,
                customTargetFactor
        );

        ScenarioOutcome base = computeScenario(
                "Base Case",
                baselineCurrentTco,
                baselineTargetTco,
                baselineMigrationCost,
                BigDecimal.valueOf(1.0),
                BigDecimal.valueOf(1.0),
                BigDecimal.valueOf(1.0)
        );

        ScenarioOutcome best = computeScenario(
                "Best Case",
                baselineCurrentTco,
                baselineTargetTco,
                baselineMigrationCost,
                BigDecimal.valueOf(1.20),
                BigDecimal.valueOf(0.85),
                BigDecimal.valueOf(0.90)
        );

        ScenarioOutcome worst = computeScenario(
                "Worst Case",
                baselineCurrentTco,
                baselineTargetTco,
                baselineMigrationCost,
                BigDecimal.valueOf(0.80),
                BigDecimal.valueOf(1.20),
                BigDecimal.valueOf(1.15)
        );

        return new ScenarioSuite(custom, best, base, worst);
    }
}
