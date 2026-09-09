package com.valuelens.ai.repository;

import com.valuelens.ai.model.PricingCatalogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PricingCatalogRepository extends JpaRepository<PricingCatalogEntity, String> {
    List<PricingCatalogEntity> findByPlatformAndActiveTrue(String platform);
    Optional<PricingCatalogEntity> findByPlatformAndEditionNameAndActiveTrue(String platform, String editionName);
    List<PricingCatalogEntity> findByVersionTag(String versionTag);
}
