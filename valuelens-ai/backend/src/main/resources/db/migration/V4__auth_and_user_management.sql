-- V4__auth_and_user_management.sql: Users, OTP Verification, Password Resets and Assessment Ownership

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    company_name VARCHAR(255),
    password_hash VARCHAR(255),
    provider VARCHAR(32) NOT NULL DEFAULT 'EMAIL',
    provider_user_id VARCHAR(128),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS email_verifications (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);

CREATE TABLE IF NOT EXISTS password_resets (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(email);

-- Add assessment columns if not already present
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS user_id VARCHAR(64);
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS assessment_data TEXT;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS calculation_data TEXT;
