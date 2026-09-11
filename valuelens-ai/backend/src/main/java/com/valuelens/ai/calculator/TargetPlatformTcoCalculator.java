package com.valuelens.ai.calculator;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class TargetPlatformTcoCalculator {

    public record TargetTcoResult(
            BigDecimal editionTotalCost,
            BigDecimal messagePacksTotalCost,
            BigDecimal dataSpaceTotalCost,
            BigDecimal additionalEicTotalCost,
            BigDecimal addOnsTotalCost,
            BigDecimal configurationAnnualCost,
            BigDecimal additionalAnnualTco,
            BigDecimal totalTargetTco,
            String calculationFormula
    ) {
        // Constructor overload for backward compatibility with 6-arg calls/record accessors
        public TargetTcoResult(
                BigDecimal editionTotalCost,
                BigDecimal messagePacksTotalCost,
                BigDecimal configurationAnnualCost,
                BigDecimal additionalAnnualTco,
                BigDecimal totalTargetTco,
                String calculationFormula
        ) {
            this(
                    editionTotalCost,
                    messagePacksTotalCost,
                    BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP),
                    BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP),
                    messagePacksTotalCost,
                    configurationAnnualCost,
                    additionalAnnualTco,
                    totalTargetTco,
                    calculationFormula
            );
        }
    }

    public TargetTcoResult calculate(
            BigDecimal unitPrice,
            int numberOfUnits,
            BigDecimal messagePackPrice,
            int additionalMessagePacks,
            BigDecimal additionalAnnualTco
    ) {
        return calculate(
                unitPrice,
                numberOfUnits,
                messagePackPrice,
                additionalMessagePacks,
                BigDecimal.valueOf(900.00),
                0,
                BigDecimal.valueOf(41460.00),
                0,
                additionalAnnualTco
        );
    }

    public TargetTcoResult calculate(
            BigDecimal unitPrice,
            int numberOfUnits,
            BigDecimal messagePackPrice,
            int additionalMessagePacks,
            BigDecimal dataSpacePrice,
            int dataSpacePackages,
            BigDecimal eicTenantPrice,
            int additionalEicTenants,
            BigDecimal additionalAnnualTco
    ) {
        BigDecimal units = BigDecimal.valueOf(Math.max(0, numberOfUnits));
        BigDecimal safeUnitPrice = zeroIfNull(unitPrice);
        BigDecimal editionCost = safeUnitPrice.multiply(units).setScale(2, RoundingMode.HALF_UP);

        BigDecimal packs = BigDecimal.valueOf(Math.max(0, additionalMessagePacks));
        BigDecimal safePackPrice = zeroIfNull(messagePackPrice);
        BigDecimal messageCost = safePackPrice.multiply(packs).setScale(2, RoundingMode.HALF_UP);

        BigDecimal dataSpacePkgs = BigDecimal.valueOf(Math.max(0, dataSpacePackages));
        BigDecimal safeDataSpacePrice = zeroIfNull(dataSpacePrice);
        BigDecimal dataSpaceCost = safeDataSpacePrice.multiply(dataSpacePkgs).setScale(2, RoundingMode.HALF_UP);

        BigDecimal eicTenants = BigDecimal.valueOf(Math.max(0, additionalEicTenants));
        BigDecimal safeEicPrice = zeroIfNull(eicTenantPrice);
        BigDecimal eicCost = safeEicPrice.multiply(eicTenants).setScale(2, RoundingMode.HALF_UP);

        BigDecimal addOnsTotal = messageCost.add(dataSpaceCost).add(eicCost).setScale(2, RoundingMode.HALF_UP);
        BigDecimal configCost = editionCost.add(addOnsTotal).setScale(2, RoundingMode.HALF_UP);
        BigDecimal safeAdditionalTco = zeroIfNull(additionalAnnualTco).setScale(2, RoundingMode.HALF_UP);

        BigDecimal total = configCost.add(safeAdditionalTco).setScale(2, RoundingMode.HALF_UP);

        StringBuilder formula = new StringBuilder();
        formula.append(String.format("%d x $%,.2f", numberOfUnits, safeUnitPrice.doubleValue()));
        if (additionalMessagePacks > 0) {
            formula.append(String.format(" + %d msg packs x $%,.2f", additionalMessagePacks, safePackPrice.doubleValue()));
        }
        if (dataSpacePackages > 0) {
            formula.append(String.format(" + %d Data Space x $%,.2f", dataSpacePackages, safeDataSpacePrice.doubleValue()));
        }
        if (additionalEicTenants > 0) {
            formula.append(String.format(" + %d EIC tenants x $%,.2f", additionalEicTenants, safeEicPrice.doubleValue()));
        }

        return new TargetTcoResult(
                editionCost,
                messageCost,
                dataSpaceCost,
                eicCost,
                addOnsTotal,
                configCost,
                safeAdditionalTco,
                total,
                formula.toString()
        );
    }

    private BigDecimal zeroIfNull(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }
}
