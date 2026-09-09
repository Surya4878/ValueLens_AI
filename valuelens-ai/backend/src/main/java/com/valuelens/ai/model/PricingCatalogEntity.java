package com.valuelens.ai.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pricing_catalog")
public class PricingCatalogEntity {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String platform;

    @Column(name = "edition_name", nullable = false, length = 128)
    private String editionName;

    @Column(name = "pricing_unit", nullable = false, length = 128)
    private String pricingUnit;

    @Column(name = "unit_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "message_pack_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal messagePackPrice;

    @Column(name = "message_pack_size", nullable = false)
    private int messagePackSize = 10000;

    @Column(nullable = false, length = 10)
    private String currency = "USD";

    @Column(name = "version_tag", nullable = false, length = 64)
    private String versionTag;

    @Column(name = "effective_from", nullable = false)
    private LocalDateTime effectiveFrom;

    @Column(name = "effective_until")
    private LocalDateTime effectiveUntil;

    @Column(nullable = false)
    private boolean active = true;

    public PricingCatalogEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    public String getEditionName() { return editionName; }
    public void setEditionName(String editionName) { this.editionName = editionName; }
    public String getPricingUnit() { return pricingUnit; }
    public void setPricingUnit(String pricingUnit) { this.pricingUnit = pricingUnit; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getMessagePackPrice() { return messagePackPrice; }
    public void setMessagePackPrice(BigDecimal messagePackPrice) { this.messagePackPrice = messagePackPrice; }
    public int getMessagePackSize() { return messagePackSize; }
    public void setMessagePackSize(int messagePackSize) { this.messagePackSize = messagePackSize; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getVersionTag() { return versionTag; }
    public void setVersionTag(String versionTag) { this.versionTag = versionTag; }
    public LocalDateTime getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDateTime effectiveFrom) { this.effectiveFrom = effectiveFrom; }
    public LocalDateTime getEffectiveUntil() { return effectiveUntil; }
    public void setEffectiveUntil(LocalDateTime effectiveUntil) { this.effectiveUntil = effectiveUntil; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
