package com.valuelens.ai.calculator;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class AnnualSavingsCalculator {

    public record SavingsResult(
            BigDecimal annualSavings,
            BigDecimal savingsPercentage,
            String formula
    ) {}

    public SavingsResult calculate(BigDecimal currentPlatformTco, BigDecimal targetPlatformTco) {
        BigDecimal current = zeroIfNull(currentPlatformTco);
        BigDecimal target = zeroIfNull(targetPlatformTco);

        BigDecimal savings;
        if (current.compareTo(BigDecimal.ZERO) <= 0) {
            savings = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        } else {
            savings = current.subtract(target).setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal percentage = BigDecimal.ZERO;
        if (current.compareTo(BigDecimal.ZERO) > 0 && savings.compareTo(BigDecimal.ZERO) > 0) {
            percentage = savings
                    .divide(current, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        String formula = "Current Platform TCO - Target Platform TCO";

        return new SavingsResult(savings, percentage, formula);
    }

    private BigDecimal zeroIfNull(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }
}
