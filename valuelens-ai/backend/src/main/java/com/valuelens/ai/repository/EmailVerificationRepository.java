package com.valuelens.ai.repository;

import com.valuelens.ai.model.EmailVerificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerificationEntity, String> {
    Optional<EmailVerificationEntity> findTopByEmailIgnoreCaseOrderByCreatedAtDesc(String email);
    void deleteByEmailIgnoreCase(String email);
}
