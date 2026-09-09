package com.valuelens.ai.dto;

import java.util.Map;

public class AiAnalysisRequestDto {

    private String assessmentId;
    private AssessmentDto assessment;
    private RoiCalculationResponseDto calculations;
    private Map<String, Object> scenario;

    public AiAnalysisRequestDto() {}

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public AssessmentDto getAssessment() { return assessment; }
    public void setAssessment(AssessmentDto assessment) { this.assessment = assessment; }
    public RoiCalculationResponseDto getCalculations() { return calculations; }
    public void setCalculations(RoiCalculationResponseDto calculations) { this.calculations = calculations; }
    public Map<String, Object> getScenario() { return scenario; }
    public void setScenario(Map<String, Object> scenario) { this.scenario = scenario; }
}
