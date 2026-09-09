package com.valuelens.ai.validation;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataConsistencyValidator {

    public record ConsistencyWarning(
            String field,
            BigDecimal providedValue,
            BigDecimal calculatedValue,
            BigDecimal variance,
            String message
    ) {}

    public List<ConsistencyWarning> validate(
            BigDecimal providedLicensingSubtotal, BigDecimal calculatedLicensingSubtotal,
            BigDecimal providedInfraSubtotal, BigDecimal calculatedInfraSubtotal,
            BigDecimal providedSupportSubtotal, BigDecimal calculatedSupportSubtotal,
            BigDecimal providedOpsSubtotal, BigDecimal calculatedOpsSubtotal,
            BigDecimal providedCurrentTco, BigDecimal calculatedCurrentTco,
            BigDecimal providedBaseMigration, BigDecimal calculatedBaseMigration,
            BigDecimal providedTotalMigration, BigDecimal calculatedTotalMigration,
            BigDecimal providedTargetConfigCost, BigDecimal calculatedTargetConfigCost
    ) {
        List<ConsistencyWarning> warnings = new ArrayList<>();

        checkMatch("licensingSubtotal", providedLicensingSubtotal, calculatedLicensingSubtotal, warnings);
        checkMatch("infrastructureSubtotal", providedInfraSubtotal, calculatedInfraSubtotal, warnings);
        checkMatch("supportSubtotal", providedSupportSubtotal, calculatedSupportSubtotal, warnings);
        checkMatch("operationsSubtotal", providedOpsSubtotal, calculatedOpsSubtotal, warnings);
        checkMatch("currentPlatformTCO", providedCurrentTco, calculatedCurrentTco, warnings);
        checkMatch("baseMigrationCost", providedBaseMigration, calculatedBaseMigration, warnings);
        checkMatch("totalMigrationCost", providedTotalMigration, calculatedTotalMigration, warnings);
        checkMatch("targetConfigurationCost", providedTargetConfigCost, calculatedTargetConfigCost, warnings);

        return warnings;
    }

    private void checkMatch(String fieldName, BigDecimal provided, BigDecimal calculated, List<ConsistencyWarning> warnings) {
        if (provided != null && calculated != null) {
            BigDecimal variance = provided.subtract(calculated).abs();
            // Allow minor rounding tolerance of $1.00
            if (variance.compareTo(BigDecimal.ONE) > 0) {
                warnings.add(new ConsistencyWarning(
                        fieldName,
                        provided,
                        calculated,
                        variance,
                        String.format("Mismatch in %s: provided $%,.2f vs calculated $%,.2f (variance $%,.2f)",
                                fieldName, provided.doubleValue(), calculated.doubleValue(), variance.doubleValue())
                ));
            }
        }
    }
}
