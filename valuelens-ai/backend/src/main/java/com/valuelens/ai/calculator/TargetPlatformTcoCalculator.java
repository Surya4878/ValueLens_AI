package com.valuelens.ai.calculator;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class TargetPlatformTcoCalculator {

    public record TargetTcoResult(
            BigDecimal editionTotalCost,
            BigDecimal messagePacksTotalCost,
            BigDecimal configurationAnnualCost,
            BigDecimal additionalAnnualTco,
            BigDecimal totalTargetTco,
            String calculationFormula
    ) {}

    public TargetTcoResult calculate(
            BigDecimal unitPrice,
            int numberOfUnits,
            BigDecimal messagePackPrice,
            int additionalMessagePacks,
            BigDecimal additionalAnnualTco
    ) {
        BigDecimal units = BigDecimal.valueOf(Math.max(1, numberOfUnits));
        BigDecimal safeUnitPrice = zeroIfNull(unitPrice);
        BigDecimal editionCost = safeUnitPrice.multiply(units).setScale(2, RoundingMode.HALF_UP);

        BigDecimal packs = BigDecimal.valueOf(Math.max(0, additionalMessagePacks));
        BigDecimal safePackPrice = zeroIfNull(messagePackPrice);
        BigDecimal messageCost = safePackPrice.multiply(packs).setScale(2, RoundingMode.HALF_UP);

        BigDecimal configCost = editionCost.add(messageCost).setScale(2, RoundingMode.HALF_UP);
        BigDecimal safeAdditionalTco = zeroIfNull(additionalAnnualTco).setScale(2, RoundingMode.HALF_UP);

        BigDecimal total = configCost.add(safeAdditionalTco).setScale(2, RoundingMode.HALF_UP);

        String formula = String.format("%d x $%,.2f + %d x $%,.2f",
                numberOfUnits, safeUnitPrice.doubleValue(),
                additionalMessagePacks, safePackPrice.doubleValue());

        return new TargetTcoResult(editionCost, messageCost, configCost, safeAdditionalTco, total, formula);
    }

    private BigDecimal zeroIfNull(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }
}
