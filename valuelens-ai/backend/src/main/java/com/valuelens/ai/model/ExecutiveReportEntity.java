package com.valuelens.ai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "executive_reports")
public class ExecutiveReportEntity {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "assessment_id", nullable = false, length = 64)
    private String assessmentId;

    @Column(name = "calculation_result_id", nullable = false, length = 64)
    private String calculationResultId;

    @Column(name = "ai_analysis_id", length = 64)
    private String aiAnalysisId;

    @Column(nullable = false)
    private String title;

    @Column(name = "report_version", nullable = false, length = 32)
    private String reportVersion;

    @Column(nullable = false, length = 10)
    private String currency = "USD";

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @Column(name = "generated_by", length = 128)
    private String generatedBy;

    public ExecutiveReportEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public String getCalculationResultId() { return calculationResultId; }
    public void setCalculationResultId(String calculationResultId) { this.calculationResultId = calculationResultId; }
    public String getAiAnalysisId() { return aiAnalysisId; }
    public void setAiAnalysisId(String aiAnalysisId) { this.aiAnalysisId = aiAnalysisId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getReportVersion() { return reportVersion; }
    public void setReportVersion(String reportVersion) { this.reportVersion = reportVersion; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }
}
