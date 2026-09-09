package com.valuelens.ai.repository;

import com.valuelens.ai.model.ScenarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScenarioRepository extends JpaRepository<ScenarioEntity, String> {
    List<ScenarioEntity> findByAssessmentIdOrderByCreatedAtDesc(String assessmentId);
}
