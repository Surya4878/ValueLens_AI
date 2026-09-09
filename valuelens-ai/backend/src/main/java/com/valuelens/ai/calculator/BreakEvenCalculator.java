package com.valuelens.ai.calculator;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class BreakEvenCalculator {

    public enum BreakEvenStatus {
        REACHED,
        NOT_REACHED,
        IMMEDIATE
    }

    public record BreakEvenResult(
            BigDecimal breakEvenMonths,
            BreakEvenStatus status,
            String formula
    ) {}

    public BreakEvenResult calculate(BigDecimal migrationCost, BigDecimal annualSavings) {
        BigDecimal cost = zeroIfNull(migrationCost);
        BigDecimal savings = zeroIfNull(annualSavings);

        String formula = "Migration Cost / Annual Savings * 12";

        // If no migration cost, payback is immediate
        if (cost.compareTo(BigDecimal.ZERO) <= 0) {
            return new BreakEvenResult(BigDecimal.ZERO, BreakEvenStatus.IMMEDIATE, formula);
        }

        // If savings are 0 or negative, break-even is never reached
        if (savings.compareTo(BigDecimal.ZERO) <= 0) {
            return new BreakEvenResult(null, BreakEvenStatus.NOT_REACHED, formula);
        }

        // Break-even Months = (cost / savings) * 12
        BigDecimal ratio = cost.divide(savings, 4, RoundingMode.HALF_UP);
        BigDecimal months = ratio
                .multiply(BigDecimal.valueOf(12))
                .setScale(2, RoundingMode.HALF_UP);

        return new BreakEvenResult(months, BreakEvenStatus.REACHED, formula);
    }

    private BigDecimal zeroIfNull(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }
}
