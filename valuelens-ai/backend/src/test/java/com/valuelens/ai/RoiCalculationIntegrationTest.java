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

        // Verify Authoritative Financial Calculations with SAP 2026 pricing & Incture Silver Package
        assertEquals(new BigDecimal("190000.00"), result.getCurrentPlatformTCO());
        assertEquals(new BigDecimal("69024.00"), result.getTargetPlatformTCO());
        assertEquals(new BigDecimal("120976.00"), result.getAnnualSavings());
        assertEquals(new BigDecimal("63.67"), result.getSavingsPercentage());
        assertEquals(new BigDecimal("65000.00"), result.getMigrationCost());

        // Payback (~6.5 months)
        assertEquals(new BigDecimal("6.45"), result.getBreakEvenMonths());
        assertEquals(BreakEvenCalculator.BreakEvenStatus.REACHED, result.getBreakEvenStatus());

        // Net Benefit
        assertEquals(new BigDecimal("539880.00"), result.getFiveYearNetBenefit());
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
        assertEquals(new BigDecimal("190000.00"), result.getCurrentPlatformTCO());
        // Annual Savings: 190,000 - 79,136 = 110,864
        assertEquals(new BigDecimal("110864.00"), result.getAnnualSavings());
        // Savings %: (110,864 / 190,000) * 100 = 58.35%
        assertEquals(new BigDecimal("58.35"), result.getSavingsPercentage());
    }
}
