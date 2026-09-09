package com.valuelens.ai.repository;

import com.valuelens.ai.model.CalculationResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CalculationResultRepository extends JpaRepository<CalculationResultEntity, String> {
    Optional<CalculationResultEntity> findFirstByAssessmentIdOrderByCalculatedAtDesc(String assessmentId);
    List<CalculationResultEntity> findByAssessmentIdOrderByCalculatedAtDesc(String assessmentId);
}
