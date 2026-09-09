package com.valuelens.ai.repository;

import com.valuelens.ai.model.AiAnalysisEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiAnalysisRepository extends JpaRepository<AiAnalysisEntity, String> {
    Optional<AiAnalysisEntity> findFirstByAssessmentIdOrderByCreatedAtDesc(String assessmentId);
    Optional<AiAnalysisEntity> findByCacheHash(String cacheHash);
}
