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

        // Verify Authoritative Financial Calculations with SAP 2026 pricing
        assertEquals(new BigDecimal("730000.00"), result.getCurrentPlatformTCO());
        assertEquals(new BigDecimal("334804.00"), result.getTargetPlatformTCO());
        assertEquals(new BigDecimal("395196.00"), result.getAnnualSavings());
        assertEquals(new BigDecimal("54.14"), result.getSavingsPercentage());
        assertEquals(new BigDecimal("300000.00"), result.getMigrationCost());

        // Payback
        assertEquals(new BigDecimal("9.11"), result.getBreakEvenMonths());
        assertEquals(BreakEvenCalculator.BreakEvenStatus.REACHED, result.getBreakEvenStatus());

        // Multi-period ROI
        assertEquals(new BigDecimal("31.73"), result.getOneYearROI());
        assertEquals(new BigDecimal("295.20"), result.getThreeYearROI());
        assertEquals(new BigDecimal("558.66"), result.getFiveYearROI());
        assertEquals(new BigDecimal("1217.32"), result.getTenYearROI());

        // Net Benefit
        assertEquals(new BigDecimal("95196.00"), result.getOneYearNetBenefit());
        assertEquals(new BigDecimal("885588.00"), result.getThreeYearNetBenefit());
        assertEquals(new BigDecimal("1675980.00"), result.getFiveYearNetBenefit());
        assertEquals(new BigDecimal("3651960.00"), result.getTenYearNetBenefit());
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

        // Expected SAP 2026:
        // Edition Cost: $20,736.00
        // Message Packs: 100 * $84.00 = $8,400.00
        // Config Cost: $20,736 + $8,400 = $29,136.00
        // Additional TCO: $50,000.00
        // Total Target TCO: $29,136 + $50,000 = $79,136.00
        assertEquals(new BigDecimal("79136.00"), result.getTargetPlatformTCO());
        assertEquals(new BigDecimal("730000.00"), result.getCurrentPlatformTCO());
        // Annual Savings: 730,000 - 79,136 = 650,864
        assertEquals(new BigDecimal("650864.00"), result.getAnnualSavings());
        // Savings %: (650,864 / 730,000) * 100 = 89.16%
        assertEquals(new BigDecimal("89.16"), result.getSavingsPercentage());
    }
}
