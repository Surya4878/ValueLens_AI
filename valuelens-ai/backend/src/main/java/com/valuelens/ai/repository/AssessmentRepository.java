package com.valuelens.ai.repository;

import com.valuelens.ai.model.AssessmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<AssessmentEntity, String> {
    List<AssessmentEntity> findAllByOrderByUpdatedAtDesc();
}
