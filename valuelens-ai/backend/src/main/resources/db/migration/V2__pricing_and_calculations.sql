-- V2__pricing_and_calculations.sql: Pricing Catalog & Calculation Result Snapshots

CREATE TABLE IF NOT EXISTS pricing_catalog (
    id VARCHAR(64) PRIMARY KEY,
    platform VARCHAR(64) NOT NULL,
    edition_name VARCHAR(128) NOT NULL,
    pricing_unit VARCHAR(128) NOT NULL,
    unit_price NUMERIC(18, 2) NOT NULL,
    message_pack_price NUMERIC(18, 2) NOT NULL,
    message_pack_size INT NOT NULL DEFAULT 10000,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    version_tag VARCHAR(64) NOT NULL,
    effective_from TIMESTAMP NOT NULL,
    effective_until TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS target_platform_configs (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL UNIQUE,
    selected_edition VARCHAR(128) NOT NULL,
    number_of_units INT NOT NULL DEFAULT 1,
    additional_message_packs INT NOT NULL DEFAULT 0,
    configuration_cost NUMERIC(18, 2) NOT NULL DEFAULT 0,
    additional_annual_tco NUMERIC(18, 2) NOT NULL DEFAULT 0,
    total_target_tco NUMERIC(18, 2) NOT NULL DEFAULT 0,
    calculation_formula VARCHAR(255),
    pricing_version_tag VARCHAR(64) NOT NULL,
    CONSTRAINT fk_target_config_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS calculation_results (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL,
    current_platform_tco NUMERIC(18, 2) NOT NULL,
    target_platform_tco NUMERIC(18, 2) NOT NULL,
    migration_cost NUMERIC(18, 2) NOT NULL,
    annual_savings NUMERIC(18, 2) NOT NULL,
    savings_percentage NUMERIC(8, 2) NOT NULL,
    break_even_months NUMERIC(8, 2),
    break_even_status VARCHAR(32) NOT NULL,
    one_year_roi NUMERIC(10, 2),
    three_year_roi NUMERIC(10, 2),
    five_year_roi NUMERIC(10, 2),
    ten_year_roi NUMERIC(10, 2),
    one_year_net_benefit NUMERIC(18, 2),
    three_year_net_benefit NUMERIC(18, 2),
    five_year_net_benefit NUMERIC(18, 2),
    ten_year_net_benefit NUMERIC(18, 2),
    calculation_version VARCHAR(32) NOT NULL,
    pricing_version VARCHAR(32) NOT NULL,
    data_quality_score INT NOT NULL,
    data_quality_level VARCHAR(16) NOT NULL,
    calculation_trace JSONB,
    consistency_warnings JSONB,
    calculated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_calc_result_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

-- Seed initial standard SAP BTP Integration Suite pricing
INSERT INTO pricing_catalog (id, platform, edition_name, pricing_unit, unit_price, message_pack_price, message_pack_size, currency, version_tag, effective_from, active)
VALUES 
('price_btp_starter_2026', 'SAP BTP Integration Suite', 'Starter Edition', 'Tenants per year', 20736.00, 84.00, 10000, 'USD', 'BTP_2026_Q1', '2026-01-01 00:00:00', TRUE),
('price_btp_standard_2026', 'SAP BTP Integration Suite', 'Standard Edition', 'Tenants per year', 64068.00, 84.00, 10000, 'USD', 'BTP_2026_Q1', '2026-01-01 00:00:00', TRUE),
('price_btp_enhanced_2026', 'SAP BTP Integration Suite', 'Enhanced Edition', 'Tenants per year', 92256.00, 84.00, 10000, 'USD', 'BTP_2026_Q1', '2026-01-01 00:00:00', TRUE),
('price_btp_premium_2026', 'SAP BTP Integration Suite', 'Premium Edition', 'Entitlements package per year', 318204.00, 84.00, 10000, 'USD', 'BTP_2026_Q1', '2026-01-01 00:00:00', TRUE);
