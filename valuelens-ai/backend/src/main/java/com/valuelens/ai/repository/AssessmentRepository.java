package com.valuelens.ai.repository;

import com.valuelens.ai.model.AssessmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<AssessmentEntity, String> {
    List<AssessmentEntity> findAllByOrderByUpdatedAtDesc();
    List<AssessmentEntity> findByUserIdOrderByUpdatedAtDesc(String userId);
    Optional<AssessmentEntity> findByIdAndUserId(String id, String userId);
}