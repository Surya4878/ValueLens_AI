package com.valuelens.ai.calculator;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class NetBenefitCalculator {

    public record NetBenefitResult(
            BigDecimal oneYearNetBenefit,
            BigDecimal threeYearNetBenefit,
            BigDecimal fiveYearNetBenefit,
            BigDecimal tenYearNetBenefit
    ) {}

    public BigDecimal calculatePeriodNetBenefit(BigDecimal annualSavings, BigDecimal migrationCost, int years) {
        BigDecimal savings = zeroIfNull(annualSavings);
        BigDecimal cost = zeroIfNull(migrationCost);

        BigDecimal periodYears = BigDecimal.valueOf(years);
        return savings.multiply(periodYears).subtract(cost).setScale(2, RoundingMode.HALF_UP);
    }

    public NetBenefitResult calculate(BigDecimal annualSavings, BigDecimal migrationCost) {
        BigDecimal oneYear = calculatePeriodNetBenefit(annualSavings, migrationCost, 1);
        BigDecimal threeYear = calculatePeriodNetBenefit(annualSavings, migrationCost, 3);
        BigDecimal fiveYear = calculatePeriodNetBenefit(annualSavings, migrationCost, 5);
        BigDecimal tenYear = calculatePeriodNetBenefit(annualSavings, migrationCost, 10);

        return new NetBenefitResult(oneYear, threeYear, fiveYear, tenYear);
    }

    private BigDecimal zeroIfNull(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }
}
