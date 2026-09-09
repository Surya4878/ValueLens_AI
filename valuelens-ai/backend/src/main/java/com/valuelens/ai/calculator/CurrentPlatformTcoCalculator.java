package com.valuelens.ai.calculator;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class CurrentPlatformTcoCalculator {

    public record TcoResult(
            BigDecimal licensingSubtotal,
            BigDecimal infrastructureSubtotal,
            BigDecimal supportSubtotal,
            BigDecimal operationsSubtotal,
            BigDecimal totalCurrentTco
    ) {}

    public TcoResult calculate(
            BigDecimal licenseCosts,
            BigDecimal adapterLicenses,
            BigDecimal devEnvLicenses,
            BigDecimal testEnvLicenses,
            BigDecimal hardwareServerCosts,
            BigDecimal storageBackupCosts,
            BigDecimal networkingConnectivity,
            BigDecimal dataCenterInfra,
            BigDecimal vendorSupport,
            BigDecimal thirdPartySupport,
            BigDecimal maintenanceUpgrades,
            BigDecimal dataCenterSupport,
            BigDecimal adminStaffCosts,
            BigDecimal supportStaffCosts,
            BigDecimal trainingCertCosts,
            BigDecimal dataCenterOperations
    ) {
        BigDecimal licensing = zeroIfNull(licenseCosts)
                .add(zeroIfNull(adapterLicenses))
                .add(zeroIfNull(devEnvLicenses))
                .add(zeroIfNull(testEnvLicenses))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal infrastructure = zeroIfNull(hardwareServerCosts)
                .add(zeroIfNull(storageBackupCosts))
                .add(zeroIfNull(networkingConnectivity))
                .add(zeroIfNull(dataCenterInfra))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal support = zeroIfNull(vendorSupport)
                .add(zeroIfNull(thirdPartySupport))
                .add(zeroIfNull(maintenanceUpgrades))
                .add(zeroIfNull(dataCenterSupport))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal operations = zeroIfNull(adminStaffCosts)
                .add(zeroIfNull(supportStaffCosts))
                .add(zeroIfNull(trainingCertCosts))
                .add(zeroIfNull(dataCenterOperations))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal total = licensing
                .add(infrastructure)
                .add(support)
                .add(operations)
                .setScale(2, RoundingMode.HALF_UP);

        return new TcoResult(licensing, infrastructure, support, operations, total);
    }

    private BigDecimal zeroIfNull(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }
}
