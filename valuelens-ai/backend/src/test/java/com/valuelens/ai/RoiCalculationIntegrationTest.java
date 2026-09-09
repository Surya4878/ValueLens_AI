package com.valuelens.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valuelens.ai.calculator.*;
import com.valuelens.ai.repository.CalculationResultRepository;
import com.valuelens.ai.service.AssessmentService;
import com.valuelens.ai.service.DataQualityService;
import com.valuelens.ai.service.RoiCalculationService;
import com.valuelens.ai.validation.DataConsistencyValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class RoiCalculationIntegrationTest {

    private RoiCalculationService roiCalculationService;
    private AssessmentService assessmentService;

    @BeforeEach
    void setUp() {
        var calcResultRepo = Mockito.mock(CalculationResultRepository.class);
        when(calcResultRepo.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var assessmentRepo = Mockito.mock(com.valuelens.ai.repository.AssessmentRepository.class);
        when(assessmentRepo.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        assessmentService = new AssessmentService(assessmentRepo);

        roiCalculationService = new RoiCalculationService(
                new CurrentPlatformTcoCalculator(),
                new TargetPlatformTcoCalculator(),
                new MigrationCostCalculator(),
                new AnnualSavingsCalculator(),
                new BreakEvenCalculator(),
                new RoiCalculator(),
                new NetBenefitCalculator(),
                new MigrationComplexityCalculator(),
                new DataConsistencyValidator(),
                new DataQualityService(),
                calcResultRepo,
                new ObjectMapper()
        );
    }

    @Test
    void testEndToEndDemoRoiCalculationMatchesSpecifications() {
        var demoAssessment = assessmentService.buildDemoAssessment();
        var result = roiCalculationService.calculate(demoAssessment);

        // Verify Authoritative Financial Calculations
        assertEquals(new BigDecimal("730000.00"), result.getCurrentPlatformTCO());
        assertEquals(new BigDecimal("313084.00"), result.getTargetPlatformTCO());
        assertEquals(new BigDecimal("416916.00"), result.getAnnualSavings());
        assertEquals(new BigDecimal("57.11"), result.getSavingsPercentage());
        assertEquals(new BigDecimal("300000.00"), result.getMigrationCost());

        // Payback
        assertEquals(new BigDecimal("8.64"), result.getBreakEvenMonths());
        assertEquals(BreakEvenCalculator.BreakEvenStatus.REACHED, result.getBreakEvenStatus());

        // Multi-period ROI
        assertEquals(new BigDecimal("38.97"), result.getOneYearROI());
        assertEquals(new BigDecimal("316.92"), result.getThreeYearROI());
        assertEquals(new BigDecimal("594.86"), result.getFiveYearROI());
        assertEquals(new BigDecimal("1289.72"), result.getTenYearROI());

        // Net Benefit
        assertEquals(new BigDecimal("116916.00"), result.getOneYearNetBenefit());
        assertEquals(new BigDecimal("950748.00"), result.getThreeYearNetBenefit());
        assertEquals(new BigDecimal("1784580.00"), result.getFiveYearNetBenefit());
        assertEquals(new BigDecimal("3869160.00"), result.getTenYearNetBenefit());
    }

    @Test
    void testDynamicTargetTcoCalculationForStarterEdition() {
        var asmt = assessmentService.buildDemoAssessment();
        // Change Target System to Starter Edition with 100 packs and 50,000 additional TCO
        asmt.getTargetSystem().getConfiguration().setSelectedEditionName("Starter Edition");
        asmt.getTargetSystem().getConfiguration().setNumberOfUnits(1);
        asmt.getTargetSystem().getConfiguration().setAdditionalMessagePacks(100);
        asmt.getTargetSystem().getAdditionalTcoComponents().setTotalAdditionalTcoAnnual(new BigDecimal("50000.00"));

        var result = roiCalculationService.calculate(asmt);

        // Expected:
        // Edition Cost: $18,744.00
        // Message Packs: 100 * $75.96 = $7,596.00
        // Config Cost: $18,744 + $7,596 = $26,340.00
        // Additional TCO: $50,000.00
        // Total Target TCO: $26,340 + $50,000 = $76,340.00
        assertEquals(new BigDecimal("76340.00"), result.getTargetPlatformTCO());
        assertEquals(new BigDecimal("730000.00"), result.getCurrentPlatformTCO());
        // Annual Savings: 730,000 - 76,340 = 653,660
        assertEquals(new BigDecimal("653660.00"), result.getAnnualSavings());
        // Savings %: (653,660 / 730,000) * 100 = 89.54%
        assertEquals(new BigDecimal("89.54"), result.getSavingsPercentage());
    }
}
