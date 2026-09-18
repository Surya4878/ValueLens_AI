package com.valuelens.ai.repository;

import com.valuelens.ai.model.PasswordResetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordResetEntity, String> {
    Optional<PasswordResetEntity> findTopByEmailIgnoreCaseAndUsedFalseOrderByCreatedAtDesc(String email);
    Optional<PasswordResetEntity> findByTokenHashAndUsedFalse(String tokenHash);
}
