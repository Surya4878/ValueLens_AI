package com.valuelens.ai.service;

import com.valuelens.ai.model.PricingCatalogEntity;
import com.valuelens.ai.repository.PricingCatalogRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PricingCatalogService {

    private final PricingCatalogRepository pricingCatalogRepository;

    public PricingCatalogService(PricingCatalogRepository pricingCatalogRepository) {
        this.pricingCatalogRepository = pricingCatalogRepository;
    }

    public List<PricingCatalogEntity> getActiveCatalogForPlatform(String platform) {
        var list = pricingCatalogRepository.findByPlatformAndActiveTrue(platform);
        if (list.isEmpty()) {
            return getDefaultBtpCatalog();
        }
        return list;
    }

    public Optional<PricingCatalogEntity> getEditionPricing(String platform, String editionName) {
        return pricingCatalogRepository.findByPlatformAndEditionNameAndActiveTrue(platform, editionName);
    }

    public List<PricingCatalogEntity> getDefaultBtpCatalog() {
        return List.of(
                createCatalogEntry("price_btp_starter_2026", "SAP BTP Integration Suite", "Starter Edition", "Tenants per year", BigDecimal.valueOf(20736.00), BigDecimal.valueOf(84.00)),
                createCatalogEntry("price_btp_standard_2026", "SAP BTP Integration Suite", "Standard Edition", "Tenants per year", BigDecimal.valueOf(64068.00), BigDecimal.valueOf(84.00)),
                createCatalogEntry("price_btp_enhanced_2026", "SAP BTP Integration Suite", "Enhanced Edition", "Tenants per year", BigDecimal.valueOf(92256.00), BigDecimal.valueOf(84.00)),
                createCatalogEntry("price_btp_premium_2026", "SAP BTP Integration Suite", "Premium Edition", "Entitlements package per year", BigDecimal.valueOf(318204.00), BigDecimal.valueOf(84.00))
        );
    }

    private PricingCatalogEntity createCatalogEntry(String id, String platform, String edition, String unit, BigDecimal unitPrice, BigDecimal packPrice) {
        PricingCatalogEntity e = new PricingCatalogEntity();
        e.setId(id);
        e.setPlatform(platform);
        e.setEditionName(edition);
        e.setPricingUnit(unit);
        e.setUnitPrice(unitPrice);
        e.setMessagePackPrice(packPrice);
        e.setMessagePackSize(10000);
        e.setCurrency("USD");
        e.setVersionTag("BTP_2026_Q1");
        e.setEffectiveFrom(LocalDateTime.now().minusDays(30));
        e.setActive(true);
        return e;
    }
}
