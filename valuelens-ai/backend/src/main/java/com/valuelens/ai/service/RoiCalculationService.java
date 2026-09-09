package com.valuelens.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valuelens.ai.calculator.*;
import com.valuelens.ai.dto.AssessmentDto;
import com.valuelens.ai.dto.RoiCalculationResponseDto;
import com.valuelens.ai.dto.RoiCalculationResponseDto.CalculationTraceDto;
import com.valuelens.ai.dto.RoiCalculationResponseDto.CostDriverDto;
import com.valuelens.ai.model.CalculationResultEntity;
import com.valuelens.ai.repository.CalculationResultRepository;
import com.valuelens.ai.validation.DataConsistencyValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class RoiCalculationService {

    private static final Logger log = LoggerFactory.getLogger(RoiCalculationService.class);

    private final CurrentPlatformTcoCalculator currentPlatformTcoCalculator;
    private final TargetPlatformTcoCalculator targetPlatformTcoCalculator;
    private final MigrationCostCalculator migrationCostCalculator;
    private final AnnualSavingsCalculator annualSavingsCalculator;
    private final BreakEvenCalculator breakEvenCalculator;
    private final RoiCalculator roiCalculator;
    private final NetBenefitCalculator netBenefitCalculator;
    private final MigrationComplexityCalculator migrationComplexityCalculator;
    private final DataConsistencyValidator dataConsistencyValidator;
    private final DataQualityService dataQualityService;
    private final CalculationResultRepository calculationResultRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.calculation.engine-version:ROI_ENGINE_V1}")
    private String calculationVersion;

    @Value("${app.pricing.version-tag:BTP_2026_Q1}")
    private String pricingVersion;

    public RoiCalculationService(
            CurrentPlatformTcoCalculator currentPlatformTcoCalculator,
            TargetPlatformTcoCalculator targetPlatformTcoCalculator,
            MigrationCostCalculator migrationCostCalculator,
            AnnualSavingsCalculator annualSavingsCalculator,
            BreakEvenCalculator breakEvenCalculator,
            RoiCalculator roiCalculator,
            NetBenefitCalculator netBenefitCalculator,
            MigrationComplexityCalculator migrationComplexityCalculator,
            DataConsistencyValidator dataConsistencyValidator,
            DataQualityService dataQualityService,
            CalculationResultRepository calculationResultRepository,
            ObjectMapper objectMapper
    ) {
        this.currentPlatformTcoCalculator = currentPlatformTcoCalculator;
        this.targetPlatformTcoCalculator = targetPlatformTcoCalculator;
        this.migrationCostCalculator = migrationCostCalculator;
        this.annualSavingsCalculator = annualSavingsCalculator;
        this.breakEvenCalculator = breakEvenCalculator;
        this.roiCalculator = roiCalculator;
        this.netBenefitCalculator = netBenefitCalculator;
        this.migrationComplexityCalculator = migrationComplexityCalculator;
        this.dataConsistencyValidator = dataConsistencyValidator;
        this.dataQualityService = dataQualityService;
        this.calculationResultRepository = calculationResultRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public RoiCalculationResponseDto calculate(AssessmentDto assessment) {
        log.info("Executing deterministic ROI calculation for assessment: {}", assessment.getId());

        var srcSystem = assessment.getSourceSystem() != null ? assessment.getSourceSystem() : new AssessmentDto.SourceSystemDto();
        var costs = srcSystem.getSapPiPoAnnualCostBreakdown();
        var lic = costs.getLicensing();
        var inf = costs.getInfrastructure();
        var sup = costs.getSupport();
        var ops = costs.getOperations();

        // 1. Calculate Current Platform TCO
        var currentTcoResult = currentPlatformTcoCalculator.calculate(
                lic.getSapPiPoLicenseCosts(), lic.getThirdPartyAdapterLicenses(), lic.getDevelopmentEnvironmentLicenses(), lic.getTestingEnvironmentLicenses(),
                inf.getHardwareServerCosts(), inf.getStorageBackupCosts(), inf.getNetworkingConnectivity(), inf.getDataCenterFacilities(),
                sup.getSapSupportMaintenance(), sup.getThirdPartySupportContracts(), sup.getSystemMaintenanceUpgrades(), sup.getDataCenterFacilities(),
                ops.getAdministrativeStaffCosts(), ops.getSupportStaffCosts(), ops.getTrainingCertificationCosts(), ops.getDataCenterFacilities()
        );

        // 2. Calculate Target Platform TCO
        var targetSystem = assessment.getTargetSystem() != null ? assessment.getTargetSystem() : new AssessmentDto.TargetSystemDto();
        var targetConfig = targetSystem.getConfiguration() != null ? targetSystem.getConfiguration() : new AssessmentDto.TargetConfigurationDto();
        var targetAdditional = targetSystem.getAdditionalTcoComponents() != null ? targetSystem.getAdditionalTcoComponents() : new AssessmentDto.AdditionalTcoComponentsDto();

        // Dynamically determine edition pricing and units based on selectedEditionName
        String editionName = targetConfig.getSelectedEditionName() != null ? targetConfig.getSelectedEditionName().toLowerCase() : "";
        BigDecimal unitPrice;
        int units;

        if (editionName.contains("starter")) {
            unitPrice = BigDecimal.valueOf(18744.00);
            units = targetConfig.getNumberOfUnits() > 0 ? targetConfig.getNumberOfUnits() : 1;
        } else if (editionName.contains("premium")) {
            unitPrice = BigDecimal.valueOf(318204.00);
            units = targetConfig.getNumberOfUnits() > 0 ? targetConfig.getNumberOfUnits() : 1;
        } else {
            // Standard edition ($57,900/unit)
            unitPrice = BigDecimal.valueOf(57900.00);
            units = targetConfig.getNumberOfUnits() > 0 ? targetConfig.getNumberOfUnits() : 3;
        }

        BigDecimal packPrice = BigDecimal.valueOf(75.96);
        int packs = Math.max(0, targetConfig.getAdditionalMessagePacks());
        BigDecimal additionalTco = targetAdditional.getTotalAdditionalTcoAnnual() != null
                ? targetAdditional.getTotalAdditionalTcoAnnual()
                : BigDecimal.valueOf(109000.00);

        var targetTcoResult = targetPlatformTcoCalculator.calculate(
                unitPrice,
                units,
                packPrice,
                packs,
                additionalTco
        );

        // 3. Calculate Migration Cost
        var migrationDetails = assessment.getMigrationRelatedDetails() != null ? assessment.getMigrationRelatedDetails() : new AssessmentDto.MigrationDetailsDto();
        var migrationResult = migrationCostCalculator.calculate(
                migrationDetails.getDevelopmentCost(),
                migrationDetails.getTestingCost(),
                migrationDetails.getArchitectureCost(),
                migrationDetails.getProjectManagementCost(),
                migrationDetails.getTrainingCost(),
                migrationDetails.getDeploymentCutoverCost(),
                migrationDetails.getDocumentationCost(),
                migrationDetails.getContingencyCost()
        );

        // 4. Calculate Annual Savings
        var savingsResult = annualSavingsCalculator.calculate(
                currentTcoResult.totalCurrentTco(),
                targetTcoResult.totalTargetTco()
        );

        // 5. Calculate Break-even
        var breakEvenResult = breakEvenCalculator.calculate(
                migrationResult.totalMigrationCost(),
                savingsResult.annualSavings()
        );

        // 6. Calculate Multi-period ROI
        var roiResult = roiCalculator.calculate(
                savingsResult.annualSavings(),
                migrationResult.totalMigrationCost()
        );

        // 7. Calculate Multi-period Net Benefit
        var netBenefitResult = netBenefitCalculator.calculate(
                savingsResult.annualSavings(),
                migrationResult.totalMigrationCost()
        );

        // 8. Calculate Migration Complexity
        var env = srcSystem.getEnvironmentAssessment();
        var vol = srcSystem.getVolumetrics();
        long throughput = 200000;
        try {
            throughput = Long.parseLong(vol.getCurrentMessageThroughput());
        } catch (Exception ignored) {}

        var complexityResult = migrationComplexityCalculator.evaluate(
                env.getTotalInterfaces(),
                env.getComplexInterfaces(),
                throughput,
                env.getCustomDevelopment(),
                env.getComplianceRequirements()
        );

        // 9. Consistency Validation
        var consistencyWarnings = dataConsistencyValidator.validate(
                lic.getSubtotal(), currentTcoResult.licensingSubtotal(),
                inf.getSubtotal(), currentTcoResult.infrastructureSubtotal(),
                sup.getSubtotal(), currentTcoResult.supportSubtotal(),
                ops.getSubtotal(), currentTcoResult.operationsSubtotal(),
                null, currentTcoResult.totalCurrentTco(),
                migrationDetails.getBaseMigrationCost(), migrationResult.baseMigrationCost(),
                migrationDetails.getTotalMigrationCost(), migrationResult.totalMigrationCost(),
                targetConfig.getTotalAnnualCost(), targetTcoResult.configurationAnnualCost()
        );

        // 10. Data Quality Scoring
        boolean hasCompany = srcSystem.getCompanyInformation() != null && srcSystem.getCompanyInformation().getCompanySize() != null;
        boolean hasEnv = env != null && env.getTotalInterfaces() > 0;
        boolean hasVol = vol != null && vol.getCurrentMessageThroughput() != null;
        var dataQualityResult = dataQualityService.evaluate(
                currentTcoResult.totalCurrentTco(),
                targetTcoResult.totalTargetTco(),
                migrationResult.totalMigrationCost(),
                consistencyWarnings,
                hasCompany, hasEnv, hasVol, false
        );

        // 11. Cost Drivers
        List<CostDriverDto> costDrivers = computeCostDrivers(currentTcoResult);

        // 12. Audit Traces ("View Calculation")
        Map<String, CalculationTraceDto> traces = buildCalculationTraces(
                currentTcoResult, targetTcoResult, migrationResult, savingsResult, breakEvenResult, roiResult, netBenefitResult
        );

        // 13. Persist Calculation Result Snapshot
        String resultId = UUID.randomUUID().toString();
        CalculationResultEntity entity = new CalculationResultEntity();
        entity.setId(resultId);
        entity.setAssessmentId(assessment.getId() != null ? assessment.getId() : "demo-assessment");
        entity.setCurrentPlatformTco(currentTcoResult.totalCurrentTco());
        entity.setTargetPlatformTco(targetTcoResult.totalTargetTco());
        entity.setMigrationCost(migrationResult.totalMigrationCost());
        entity.setAnnualSavings(savingsResult.annualSavings());
        entity.setSavingsPercentage(savingsResult.savingsPercentage());
        entity.setBreakEvenMonths(breakEvenResult.breakEvenMonths());
        entity.setBreakEvenStatus(breakEvenResult.status().name());
        entity.setOneYearRoi(roiResult.oneYearRoi());
        entity.setThreeYearRoi(roiResult.threeYearRoi());
        entity.setFiveYearRoi(roiResult.fiveYearRoi());
        entity.setTenYearRoi(roiResult.tenYearRoi());
        entity.setOneYearNetBenefit(netBenefitResult.oneYearNetBenefit());
        entity.setThreeYearNetBenefit(netBenefitResult.threeYearNetBenefit());
        entity.setFiveYearNetBenefit(netBenefitResult.fiveYearNetBenefit());
        entity.setTenYearNetBenefit(netBenefitResult.tenYearNetBenefit());
        entity.setCalculationVersion(calculationVersion);
        entity.setPricingVersion(pricingVersion);
        entity.setDataQualityScore(dataQualityResult.score());
        entity.setDataQualityLevel(dataQualityResult.level().name());
        entity.setCalculatedAt(LocalDateTime.now());

        try {
            entity.setCalculationTraceJson(objectMapper.writeValueAsString(traces));
            entity.setConsistencyWarningsJson(objectMapper.writeValueAsString(consistencyWarnings));
        } catch (Exception e) {
            log.warn("Failed to serialize traces or warnings to JSON", e);
        }

        calculationResultRepository.save(entity);

        // 14. Build Response DTO
        RoiCalculationResponseDto response = new RoiCalculationResponseDto();
        response.setAssessmentId(entity.getAssessmentId());
        response.setCalculationResultId(resultId);
        response.setCurrentPlatformTCO(currentTcoResult.totalCurrentTco());
        response.setTargetPlatformTCO(targetTcoResult.totalTargetTco());
        response.setMigrationCost(migrationResult.totalMigrationCost());
        response.setAnnualSavings(savingsResult.annualSavings());
        response.setSavingsPercentage(savingsResult.savingsPercentage());
        response.setBreakEvenMonths(breakEvenResult.breakEvenMonths());
        response.setBreakEvenStatus(breakEvenResult.status());
        response.setOneYearROI(roiResult.oneYearRoi());
        response.setThreeYearROI(roiResult.threeYearRoi());
        response.setFiveYearROI(roiResult.fiveYearRoi());
        response.setTenYearROI(roiResult.tenYearRoi());
        response.setOneYearNetBenefit(netBenefitResult.oneYearNetBenefit());
        response.setThreeYearNetBenefit(netBenefitResult.threeYearNetBenefit());
        response.setFiveYearNetBenefit(netBenefitResult.fiveYearNetBenefit());
        response.setTenYearNetBenefit(netBenefitResult.tenYearNetBenefit());
        response.setLicensingSubtotal(currentTcoResult.licensingSubtotal());
        response.setInfrastructureSubtotal(currentTcoResult.infrastructureSubtotal());
        response.setSupportSubtotal(currentTcoResult.supportSubtotal());
        response.setOperationsSubtotal(currentTcoResult.operationsSubtotal());
        response.setTargetConfigurationCost(targetTcoResult.configurationAnnualCost());
        response.setTargetAdditionalTco(targetTcoResult.additionalAnnualTco());
        response.setCostDrivers(costDrivers);
        response.setComplexityResult(complexityResult);
        response.setDataQuality(dataQualityResult);
        response.setConsistencyWarnings(consistencyWarnings);
        response.setCalculationTraces(traces);
        response.setPricingVersion(pricingVersion);
        response.setCalculationVersion(calculationVersion);
        response.setCalculatedAt(entity.getCalculatedAt());
        response.setCurrency(assessment.getCurrency() != null ? assessment.getCurrency() : "USD");

        return response;
    }

    private List<CostDriverDto> computeCostDrivers(CurrentPlatformTcoCalculator.TcoResult tco) {
        BigDecimal total = tco.totalCurrentTco();
        List<CostDriverDto> list = new ArrayList<>();
        if (total.compareTo(BigDecimal.ZERO) <= 0) return list;

        BigDecimal licPct = tco.licensingSubtotal().divide(total, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(1, RoundingMode.HALF_UP);
        BigDecimal infPct = tco.infrastructureSubtotal().divide(total, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(1, RoundingMode.HALF_UP);
        BigDecimal supPct = tco.supportSubtotal().divide(total, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(1, RoundingMode.HALF_UP);
        BigDecimal opsPct = tco.operationsSubtotal().divide(total, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(1, RoundingMode.HALF_UP);

        list.add(new CostDriverDto("Licensing", tco.licensingSubtotal(), licPct, "Proprietary server and adapter licenses"));
        list.add(new CostDriverDto("Infrastructure", tco.infrastructureSubtotal(), infPct, "On-premise hardware, storage, and data centers"));
        list.add(new CostDriverDto("Support", tco.supportSubtotal(), supPct, "Annual vendor maintenance and support contracts"));
        list.add(new CostDriverDto("Operations", tco.operationsSubtotal(), opsPct, "Administrative staff, training, and maintenance runs"));

        list.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));
        return list;
    }

    private Map<String, CalculationTraceDto> buildCalculationTraces(
            CurrentPlatformTcoCalculator.TcoResult current,
            TargetPlatformTcoCalculator.TargetTcoResult target,
            MigrationCostCalculator.MigrationCostResult migration,
            AnnualSavingsCalculator.SavingsResult savings,
            BreakEvenCalculator.BreakEvenResult breakEven,
            RoiCalculator.MultiPeriodRoiResult roi,
            NetBenefitCalculator.NetBenefitResult netBenefit
    ) {
        Map<String, CalculationTraceDto> map = new HashMap<>();

        map.put("annualSavings", new CalculationTraceDto(
                "Annual Savings",
                "Current Platform TCO - Target Platform TCO",
                Map.of("currentPlatformTCO", current.totalCurrentTco(), "targetPlatformTCO", target.totalTargetTco()),
                savings.annualSavings(),
                String.format("$%,.2f - $%,.2f = $%,.2f", current.totalCurrentTco().doubleValue(), target.totalTargetTco().doubleValue(), savings.annualSavings().doubleValue())
        ));

        map.put("breakEvenMonths", new CalculationTraceDto(
                "Break-even Period",
                "(Total Migration Cost / Annual Savings) * 12",
                Map.of("migrationCost", migration.totalMigrationCost(), "annualSavings", savings.annualSavings()),
                breakEven.breakEvenMonths(),
                String.format("($%,.2f / $%,.2f) * 12 = %,.2f months", migration.totalMigrationCost().doubleValue(), savings.annualSavings().doubleValue(), breakEven.breakEvenMonths() != null ? breakEven.breakEvenMonths().doubleValue() : 0.0)
        ));

        map.put("fiveYearRoi", new CalculationTraceDto(
                "5-Year ROI",
                "((Annual Savings * 5 - Migration Cost) / Migration Cost) * 100",
                Map.of("annualSavings", savings.annualSavings(), "migrationCost", migration.totalMigrationCost(), "years", 5),
                roi.fiveYearRoi(),
                String.format("(($%,.2f * 5 - $%,.2f) / $%,.2f) * 100 = %,.2f%%", savings.annualSavings().doubleValue(), migration.totalMigrationCost().doubleValue(), migration.totalMigrationCost().doubleValue(), roi.fiveYearRoi().doubleValue())
        ));

        return map;
    }
}
