-- V3__ai_analysis_and_reports.sql: AI Analysis Snapshots, Scenarios, and Executive Reports

CREATE TABLE IF NOT EXISTS ai_analysis_snapshots (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL,
    calculation_result_id VARCHAR(64) NOT NULL,
    scenario_id VARCHAR(64),
    decision VARCHAR(32) NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL,
    executive_summary TEXT,
    financial_assessment TEXT,
    scenario_interpretation TEXT,
    ai_model VARCHAR(128) NOT NULL,
    prompt_version VARCHAR(32) NOT NULL,
    cache_hash VARCHAR(128) NOT NULL UNIQUE,
    data_quality_json JSONB,
    cost_drivers_json JSONB,
    key_insights_json JSONB,
    risks_json JSONB,
    opportunities_json JSONB,
    recommendations_json JSONB,
    assumptions_json JSONB,
    decision_factors_json JSONB,
    chart_insights_json JSONB,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_ai_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    CONSTRAINT fk_ai_calc_result FOREIGN KEY (calculation_result_id) REFERENCES calculation_results(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scenario_records (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    savings_factor NUMERIC(5, 2) NOT NULL,
    migration_cost_factor NUMERIC(5, 2) NOT NULL,
    target_cost_factor NUMERIC(5, 2) NOT NULL,
    scenario_annual_savings NUMERIC(18, 2) NOT NULL,
    scenario_migration_cost NUMERIC(18, 2) NOT NULL,
    scenario_target_tco NUMERIC(18, 2) NOT NULL,
    scenario_break_even_months NUMERIC(8, 2),
    scenario_five_year_roi NUMERIC(10, 2),
    scenario_net_benefit NUMERIC(18, 2),
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_scenario_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS executive_reports (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL,
    calculation_result_id VARCHAR(64) NOT NULL,
    ai_analysis_id VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    report_version VARCHAR(32) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    generated_at TIMESTAMP NOT NULL,
    generated_by VARCHAR(128),
    CONSTRAINT fk_report_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    CONSTRAINT fk_report_calc_result FOREIGN KEY (calculation_result_id) REFERENCES calculation_results(id) ON DELETE CASCADE
);
