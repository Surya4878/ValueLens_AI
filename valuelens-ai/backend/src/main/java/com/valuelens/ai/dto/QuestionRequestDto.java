package com.valuelens.ai.dto;

public class QuestionRequestDto {

    private String assessmentId;
    private String question;

    public QuestionRequestDto() {}

    public QuestionRequestDto(String assessmentId, String question) {
        this.assessmentId = assessmentId;
        this.question = question;
    }

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
