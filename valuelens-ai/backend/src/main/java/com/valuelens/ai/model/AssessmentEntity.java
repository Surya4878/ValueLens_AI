package com.valuelens.ai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
public class AssessmentEntity {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "source_platform", nullable = false, length = 64)
    private String sourcePlatform;

    @Column(name = "target_platform", nullable = false, length = 64)
    private String targetPlatform;

    @Column(nullable = false, length = 32)
    private String status;

    @Column(nullable = false, length = 10)
    private String currency = "USD";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 128)
    private String createdBy;

    @Column(name = "user_id", length = 64)
    private String userId;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "assessment_data", columnDefinition = "TEXT")
    private String assessmentData;

    @Column(name = "calculation_data", columnDefinition = "TEXT")
    private String calculationData;

    public AssessmentEntity() {}

    public AssessmentEntity(String id, String name, String sourcePlatform, String targetPlatform, String status, String currency) {
        this.id = id;
        this.name = name;
        this.sourcePlatform = sourcePlatform;
        this.targetPlatform = targetPlatform;
        this.status = status;
        this.currency = currency;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSourcePlatform() { return sourcePlatform; }
    public void setSourcePlatform(String sourcePlatform) { this.sourcePlatform = sourcePlatform; }
    public String getTargetPlatform() { return targetPlatform; }
    public void setTargetPlatform(String targetPlatform) { this.targetPlatform = targetPlatform; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getAssessmentData() { return assessmentData; }
    public void setAssessmentData(String assessmentData) { this.assessmentData = assessmentData; }
    public String getCalculationData() { return calculationData; }
    public void setCalculationData(String calculationData) { this.calculationData = calculationData; }
}
