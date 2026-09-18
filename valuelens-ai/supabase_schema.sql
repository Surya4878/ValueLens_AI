-- =============================================================================
-- Business ValueLens AI — Supabase Database Schema
-- Run this script in the Supabase SQL Editor to set up authentication & assessment tables
-- =============================================================================

-- 1. Enable pgcrypto for UUIDs if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    company_name VARCHAR(255),
    password_hash VARCHAR(255),
    provider VARCHAR(32) NOT NULL DEFAULT 'EMAIL', -- 'EMAIL', 'GOOGLE', 'MICROSOFT'
    provider_user_id VARCHAR(128),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_user_id);

-- 3. Email Verification / Pending Registrations Table (Temporary records before permanent account)
CREATE TABLE IF NOT EXISTS email_verifications (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);

-- 4. Password Resets Table
CREATE TABLE IF NOT EXISTS password_resets (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(email);

-- 5. Assessments Table (Ensures uniqueness by id = assessmentId and links to user)
CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(64) PRIMARY KEY, -- Assessment ID (e.g. custom-assessment-xxx or demo-assessment-1)
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    source_platform VARCHAR(64) NOT NULL,
    target_platform VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by VARCHAR(128),
    notes TEXT,
    assessment_data TEXT, -- JSON payload of complete assessment inputs
    calculation_data TEXT  -- JSON payload of calculation engine results
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
