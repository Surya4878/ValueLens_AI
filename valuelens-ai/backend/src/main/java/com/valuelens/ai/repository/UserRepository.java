package com.valuelens.ai.repository;

import com.valuelens.ai.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByEmailIgnoreCase(String email);
    Optional<UserEntity> findByProviderAndProviderUserId(String provider, String providerUserId);
    boolean existsByEmailIgnoreCase(String email);
}
