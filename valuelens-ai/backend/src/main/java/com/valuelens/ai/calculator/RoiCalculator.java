package com.valuelens.ai.calculator;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class RoiCalculator {

    public record MultiPeriodRoiResult(
            BigDecimal oneYearRoi,
            BigDecimal threeYearRoi,
            BigDecimal fiveYearRoi,
            BigDecimal tenYearRoi,
            String formula
    ) {}

    public BigDecimal calculatePeriodRoi(BigDecimal annualSavings, BigDecimal migrationCost, int years) {
        BigDecimal savings = zeroIfNull(annualSavings);
        BigDecimal cost = zeroIfNull(migrationCost);

        if (cost.compareTo(BigDecimal.ZERO) <= 0) {
            // If zero migration cost and positive savings, ROI is effectively infinite/100% gain
            return savings.compareTo(BigDecimal.ZERO) > 0 ? BigDecimal.valueOf(9999.99) : BigDecimal.ZERO;
        }

        BigDecimal periodYears = BigDecimal.valueOf(years);
        BigDecimal cumulativeSavings = savings.multiply(periodYears);
        BigDecimal netBenefit = cumulativeSavings.subtract(cost);

        return netBenefit
                .divide(cost, 6, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public MultiPeriodRoiResult calculate(BigDecimal annualSavings, BigDecimal migrationCost) {
        BigDecimal oneYear = calculatePeriodRoi(annualSavings, migrationCost, 1);
        BigDecimal threeYear = calculatePeriodRoi(annualSavings, migrationCost, 3);
        BigDecimal fiveYear = calculatePeriodRoi(annualSavings, migrationCost, 5);
        BigDecimal tenYear = calculatePeriodRoi(annualSavings, migrationCost, 10);

        String formula = "((Annual Savings * ROI Analysis Period Years) - Migration Cost) / Migration Cost * 100";

        return new MultiPeriodRoiResult(oneYear, threeYear, fiveYear, tenYear, formula);
    }

    private BigDecimal zeroIfNull(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }
}
