package com.valuelens.ai.service;

import com.valuelens.ai.calculator.ScenarioCalculator;
import com.valuelens.ai.dto.ScenarioRequestDto;
import com.valuelens.ai.dto.ScenarioResponseDto;
import com.valuelens.ai.model.CalculationResultEntity;
import com.valuelens.ai.model.ScenarioEntity;
import com.valuelens.ai.repository.CalculationResultRepository;
import com.valuelens.ai.repository.ScenarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ScenarioService {

    private static final Logger log = LoggerFactory.getLogger(ScenarioService.class);

    private final ScenarioCalculator scenarioCalculator;
    private final CalculationResultRepository calculationResultRepository;
    private final ScenarioRepository scenarioRepository;

    public ScenarioService(
            ScenarioCalculator scenarioCalculator,
            CalculationResultRepository calculationResultRepository,
            ScenarioRepository scenarioRepository
    ) {
        this.scenarioCalculator = scenarioCalculator;
        this.calculationResultRepository = calculationResultRepository;
        this.scenarioRepository = scenarioRepository;
    }

    @Transactional
    public ScenarioResponseDto calculateScenario(ScenarioRequestDto request) {
        BigDecimal baselineCurrent = request.getBaselineCurrentTco();
        BigDecimal baselineTarget = request.getBaselineTargetTco();
        BigDecimal baselineMigration = request.getBaselineMigrationCost();

        String assessmentId = request.getAssessmentId();

        // If assessmentId is provided, pull trusted baseline snapshot from calculation_results
        if (assessmentId != null && !assessmentId.isBlank()) {
            var calcOpt = calculationResultRepository.findFirstByAssessmentIdOrderByCalculatedAtDesc(assessmentId);
            if (calcOpt.isPresent()) {
                var calc = calcOpt.get();
                baselineCurrent = calc.getCurrentPlatformTco();
                baselineTarget = calc.getTargetPlatformTco();
                baselineMigration = calc.getMigrationCost();
            }
        }

        // Default fallbacks if none provided
        if (baselineCurrent == null) baselineCurrent = BigDecimal.ZERO;
        if (baselineTarget == null) baselineTarget = BigDecimal.ZERO;
        if (baselineMigration == null) baselineMigration = BigDecimal.ZERO;

        var suite = scenarioCalculator.computeSuite(
                baselineCurrent,
                baselineTarget,
                baselineMigration,
                request.getSavingsFactor(),
                request.getMigrationCostFactor(),
                request.getTargetCostFactor()
        );

        // Optionally persist custom scenario record if assessmentId is valid
        if (assessmentId != null && !assessmentId.isBlank()) {
            ScenarioEntity entity = new ScenarioEntity();
            entity.setId(UUID.randomUUID().toString());
            entity.setAssessmentId(assessmentId);
            entity.setName("Custom Slider Scenario");
            entity.setSavingsFactor(request.getSavingsFactor());
            entity.setMigrationCostFactor(request.getMigrationCostFactor());
            entity.setTargetCostFactor(request.getTargetCostFactor());
            entity.setScenarioAnnualSavings(suite.customCase().annualSavings());
            entity.setScenarioMigrationCost(suite.customCase().migrationCost());
            entity.setScenarioTargetTco(suite.customCase().targetPlatformTco());
            entity.setScenarioBreakEvenMonths(suite.customCase().breakEvenMonths());
            entity.setScenarioFiveYearRoi(suite.customCase().fiveYearRoi());
            entity.setScenarioNetBenefit(suite.customCase().fiveYearNetBenefit());
            entity.setCreatedAt(LocalDateTime.now());
            scenarioRepository.save(entity);
        }

        return new ScenarioResponseDto(assessmentId, suite);
    }
}
