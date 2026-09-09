-- V1__init_schema.sql: Initial Core Tables for ValueLens AI

CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    source_platform VARCHAR(64) NOT NULL,
    target_platform VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by VARCHAR(128),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS company_information (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL UNIQUE,
    company_size VARCHAR(64),
    industry VARCHAR(128),
    migration_timeline VARCHAR(64),
    integration_complexity VARCHAR(64),
    availability_requirements VARCHAR(64),
    compliance_requirements VARCHAR(64),
    custom_development VARCHAR(64),
    monitoring_maturity VARCHAR(64),
    CONSTRAINT fk_company_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS current_platform_costs (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL UNIQUE,
    -- Licensing
    license_costs NUMERIC(18, 2) DEFAULT 0,
    adapter_licenses NUMERIC(18, 2) DEFAULT 0,
    dev_env_licenses NUMERIC(18, 2) DEFAULT 0,
    test_env_licenses NUMERIC(18, 2) DEFAULT 0,
    licensing_subtotal NUMERIC(18, 2) DEFAULT 0,
    -- Infrastructure
    hardware_server_costs NUMERIC(18, 2) DEFAULT 0,
    storage_backup_costs NUMERIC(18, 2) DEFAULT 0,
    networking_connectivity NUMERIC(18, 2) DEFAULT 0,
    data_center_facilities NUMERIC(18, 2) DEFAULT 0,
    infrastructure_subtotal NUMERIC(18, 2) DEFAULT 0,
    -- Support
    vendor_support NUMERIC(18, 2) DEFAULT 0,
    third_party_support NUMERIC(18, 2) DEFAULT 0,
    maintenance_upgrades NUMERIC(18, 2) DEFAULT 0,
    support_facilities NUMERIC(18, 2) DEFAULT 0,
    support_subtotal NUMERIC(18, 2) DEFAULT 0,
    -- Operations
    admin_staff_costs NUMERIC(18, 2) DEFAULT 0,
    support_staff_costs NUMERIC(18, 2) DEFAULT 0,
    training_certification NUMERIC(18, 2) DEFAULT 0,
    operations_facilities NUMERIC(18, 2) DEFAULT 0,
    operations_subtotal NUMERIC(18, 2) DEFAULT 0,
    -- Total
    total_current_tco NUMERIC(18, 2) DEFAULT 0,
    CONSTRAINT fk_current_costs_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS migration_costs (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL UNIQUE,
    development_cost NUMERIC(18, 2) DEFAULT 0,
    testing_cost NUMERIC(18, 2) DEFAULT 0,
    architecture_cost NUMERIC(18, 2) DEFAULT 0,
    project_management_cost NUMERIC(18, 2) DEFAULT 0,
    training_cost NUMERIC(18, 2) DEFAULT 0,
    deployment_cutover_cost NUMERIC(18, 2) DEFAULT 0,
    documentation_cost NUMERIC(18, 2) DEFAULT 0,
    base_migration_cost NUMERIC(18, 2) DEFAULT 0,
    contingency_cost NUMERIC(18, 2) DEFAULT 0,
    total_migration_cost NUMERIC(18, 2) DEFAULT 0,
    roi_analysis_period_years INT DEFAULT 5,
    CONSTRAINT fk_migration_costs_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    action VARCHAR(32) NOT NULL,
    actor VARCHAR(128) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP NOT NULL
);
