package com.valuelens.ai.repository;

import com.valuelens.ai.model.ExecutiveReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExecutiveReportRepository extends JpaRepository<ExecutiveReportEntity, String> {
    Optional<ExecutiveReportEntity> findFirstByAssessmentIdOrderByGeneratedAtDesc(String assessmentId);
    List<ExecutiveReportEntity> findByAssessmentIdOrderByGeneratedAtDesc(String assessmentId);
}
