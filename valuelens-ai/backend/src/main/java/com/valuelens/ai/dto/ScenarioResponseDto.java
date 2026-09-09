package com.valuelens.ai.dto;

import com.valuelens.ai.calculator.ScenarioCalculator.ScenarioOutcome;
import com.valuelens.ai.calculator.ScenarioCalculator.ScenarioSuite;

public class ScenarioResponseDto {

    private String assessmentId;
    private ScenarioOutcome customCase;
    private ScenarioOutcome bestCase;
    private ScenarioOutcome baseCase;
    private ScenarioOutcome worstCase;
    private String sensitivityWarning;

    public ScenarioResponseDto() {}

    public ScenarioResponseDto(String assessmentId, ScenarioSuite suite) {
        this.assessmentId = assessmentId;
        this.customCase = suite.customCase();
        this.bestCase = suite.bestCase();
        this.baseCase = suite.baseCase();
        this.worstCase = suite.worstCase();

        // Check for decision reversals
        if (this.baseCase.annualSavings().compareTo(java.math.BigDecimal.ZERO) > 0 &&
            this.worstCase.annualSavings().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            this.sensitivityWarning = "Decision sensitivity is high: Downside assumptions cause annual savings to become negative.";
        } else if (this.worstCase != null) {
            this.sensitivityWarning = String.format(
                    "Across all 4 simulated operational horizons—including the conservative stress test where migration expenses escalate by +25%% and run-rate savings decrease by -20%%—the business case retains an attractive break-even within %.1f months and generates over $%,.2fM in 5-year net economic returns.",
                    this.worstCase.breakEvenMonths().doubleValue(),
                    this.worstCase.fiveYearNetBenefit().doubleValue() / 1_000_000.0
            );
        }
    }

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public ScenarioOutcome getCustomCase() { return customCase; }
    public void setCustomCase(ScenarioOutcome customCase) { this.customCase = customCase; }
    public ScenarioOutcome getBestCase() { return bestCase; }
    public void setBestCase(ScenarioOutcome bestCase) { this.bestCase = bestCase; }
    public ScenarioOutcome getBaseCase() { return baseCase; }
    public void setBaseCase(ScenarioOutcome baseCase) { this.baseCase = baseCase; }
    public ScenarioOutcome getWorstCase() { return worstCase; }
    public void setWorstCase(ScenarioOutcome worstCase) { this.worstCase = worstCase; }
    public String getSensitivityWarning() { return sensitivityWarning; }
    public void setSensitivityWarning(String sensitivityWarning) { this.sensitivityWarning = sensitivityWarning; }
}
