package com.valuelens.ai.dto;

import java.util.List;

public class QuestionResponseDto {

    private String question;
    private String answer;
    private List<String> evidenceUsed;
    private String recommendedAction;
    private String aiStatus = "AVAILABLE";

    public QuestionResponseDto() {}

    public QuestionResponseDto(String question, String answer, List<String> evidenceUsed, String recommendedAction) {
        this.question = question;
        this.answer = answer;
        this.evidenceUsed = evidenceUsed;
        this.recommendedAction = recommendedAction;
    }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public List<String> getEvidenceUsed() { return evidenceUsed; }
    public void setEvidenceUsed(List<String> evidenceUsed) { this.evidenceUsed = evidenceUsed; }
    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
    public String getAiStatus() { return aiStatus; }
    public void setAiStatus(String aiStatus) { this.aiStatus = aiStatus; }
}
