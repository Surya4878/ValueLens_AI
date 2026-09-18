# Business ValueLens AI — Security & Secret Exposure Audit Report

**Audit Date:** September 18, 2026  
**Auditor:** ValueLens AI Security Architecture Team  
**Scope:** Entire Repository (`valuelens-ai`, Git History, Configs, Code, Migrations)  
**Security Baseline:** OWASP Top 10:2025 (A07: Identification and Authentication Failures, A02: Cryptographic Failures), OWASP ASVS 5.0 (V6 Cryptography, V14 Configuration)

---

## 1. Executive Summary & Exposure Severity

During the production security audit of Business ValueLens AI, a thorough inspection of source code, configuration files, and recent Git commits revealed high-severity hardcoded credentials. These credentials have been **sanitized in the working tree**, extracted into environment variables, and isolated into a gitignored `.env` file. 

| Exposed Credential | File Location (Historical) | Type / Service | Severity | Current Status in Code | Remediation Action Required |
|---|---|---|---|---|---|
| **Supabase PostgreSQL Password** (`Inc@832418!`) | `application.yml`, `application-dev.yml` | Production/Staging Database Connection | **CRITICAL** | Sanitized with `${DB_PASSWORD}` | **IMMEDIATE ROTATION REQUIRED** in Supabase Console |
| **Supabase DB Connection URL** (`db.bcjlwdjwpsksysukraup.supabase.co`) | `application.yml`, `application-dev.yml` | Database Host & User | **HIGH** | Sanitized with `${DB_URL}` | Verify network firewall / IP restriction |
| **Google SMTP App Password** (`pmnk uavb hxwk jzvo`) | `application.yml` | Gmail Outbound Email Relay | **HIGH** | Sanitized with `${SMTP_PASSWORD}` | **IMMEDIATE REVOCATION REQUIRED** in Google Account |
| **Developer Personal Email** (`yashwanthgr003@gmail.com`) | `application.yml`, `EmailService.java` | Sender Identity / PII | **MEDIUM** | Replaced with `${SMTP_USERNAME:noreply@valuelens.ai}` | Use official corporate domain for SMTP |
| **Local Git Commit `98bc8929`** | Git commit log (`about to push`) | Git Repository History | **CRITICAL** | Local commit only (Not pushed to remote origin) | **AMEND COMMIT** before pushing to remote repository |

---

## 2. Detailed Findings & Audit Trails

### SEC-AUD-001: Supabase Database Credentials in Configuration
- **Discovery:** `valuelens-ai/backend/src/main/resources/application.yml` and `application-dev.yml` contained plaintext database URLs with embedded credentials:
  ```yaml
  url: postgresql://postgres:Inc%40832418!@db.bcjlwdjwpsksysukraup.supabase.co:5432/postgres
  username: postgres
  password: Inc%40832418!
  ```
- **Impact:** Anyone with read access to the repository or packaged JAR had full administrative access to the PostgreSQL database, user tables, password hashes, and assessment records.
- **Fix Applied:**
  - Updated `application.yml` to dynamic parameter interpolation:
    ```yaml
    url: ${DB_URL:jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:valuelens}}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:}
    ```
  - Updated `application-dev.yml` to consume environment variables without hardcoded passwords.
  - Placed actual connection parameters in `valuelens-ai/.env` (which is gitignored).
- **Mandatory Production Action:**
  1. Open the [Supabase Dashboard](https://supabase.com/dashboard/project/bcjlwdjwpsksysukraup).
  2. Navigate to **Project Settings** > **Database**.
  3. Scroll to **Database Password** and click **Reset Database Password**.
  4. Generate a 32+ character high-entropy password.
  5. Update the production environment variable `DB_PASSWORD` in your deployment environment (e.g. AWS ECS, GCP Cloud Run, or Kubernetes Secret).

---

### SEC-AUD-002: Google SMTP Application Password Exposure
- **Discovery:** In `application.yml`, the SMTP configuration was configured as:
  ```yaml
  username: yashwanthgr003@gmail.com
  password: pmnk uavb hxwk jzvo
  ```
- **Impact:** The 16-character Google App Password grants full capability to send emails on behalf of that Google account, potentially enabling spam, phishing, or reputational damage.
- **Fix Applied:**
  - `application.yml` now uses:
    ```yaml
    username: ${SMTP_USERNAME:}
    password: ${SMTP_PASSWORD:}
    ```
  - Fallback sender email in `EmailService.java` updated to `noreply@valuelens.ai`.
- **Mandatory Production Action:**
  1. Log into Google Account `yashwanthgr003@gmail.com`.
  2. Navigate to **Security** > **2-Step Verification** > **App passwords**.
  3. Locate the app password created for ValueLens and click **Delete / Revoke**.
  4. In production, configure an enterprise transactional email service such as Amazon SES, SendGrid, or Microsoft 365 SMTP relay.

---

### SEC-AUD-003: Plaintext OTP and Password Reset Token Logging
- **Discovery:** In `valuelens-ai/backend/src/main/java/com/valuelens/ai/service/EmailService.java`:
  ```java
  log.info("Verification Code: [{}] (Valid for 10 minutes)", otp);
  log.info("Reset URL: {}", resetUrl);
  ```
- **Impact:** System logs, console aggregators (e.g., CloudWatch, Datadog), and container standard out exposed valid 6-digit OTPs and one-time password reset tokens. Any operator or compromised logging service could perform account takeover.
- **Fix Applied:**
  - Removed all plaintext OTP and reset token logging.
  - Implemented `maskEmail(toEmail)` to ensure recipient emails in logs are pseudonymized (e.g. `a***t@valuelens.demo`).
  - Parameterized frontend URL in `sendPasswordReset` using `${app.frontend.url:http://localhost:3000}`.

---

### SEC-AUD-004: JWT Secret Key Strength & Lifecycle
- **Discovery:** The default `JWT_SECRET` in `JwtSessionService.java` used a static fallback string. If left unconfigured in production, session tokens could be forged.
- **Fix Applied:**
  - Added a startup validation in `JwtSessionService.java`:
    - If `SPRING_PROFILES_ACTIVE=prod` and `JWT_SECRET` is less than 32 characters or matches known development defaults, application startup is **blocked** with an explicit error.
    - Token lifetime is set to 24 hours (86,400,000 ms) by default with support for `JWT_EXPIRATION_MS`.

---

## 3. Safe Environment Variable Architecture

To maintain zero secret exposure, configuration is strictly segregated into three tiers:

### Tier 1: Public Frontend Variables (`NEXT_PUBLIC_*`)
*Safe for browser exposure; embedded at Next.js build time.*
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_MICROSOFT_CLIENT_ID`
- `NEXT_PUBLIC_MICROSOFT_TENANT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Tier 2: Server-Only Backend Variables
*Injected into container / runtime environment only.*
- `DB_URL`, `DB_HOST`, `DB_PORT`, `DB_NAME`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`
- `APP_CORS_ALLOWED_ORIGINS`
- `APP_FRONTEND_URL`
- `PORT` / `SERVER_PORT`

### Tier 3: Sensitive Secrets & Cryptographic Keys
*Stored in Secret Manager (AWS Secrets Manager, GCP Secret Manager, Vault, or GitHub Actions Secrets).*
- `DB_PASSWORD`
- `SMTP_PASSWORD`
- `JWT_SECRET` (minimum 256-bit / 32 characters random)
- `GEMINI_API_KEY`
- `NVIDIA_API_KEY`
- `OPENAI_API_KEY`

---

## 4. Git Repository Sanitization Verification

Prior to pushing to `origin/main` (`Surya4878/ValueLens_AI.git`):

1. **Local Commit `98bc8929` contains credentials in its snapshot.**
2. **Resolution:**
   Run the following commands to fold the security sanitization into the commit:
   ```bash
   git add valuelens-ai/backend/src/main/resources/application.yml
   git add valuelens-ai/backend/src/main/resources/application-dev.yml
   git add valuelens-ai/.env.example
   git commit --amend -m "feat(security): production security audit, hardening and credential sanitization"
   ```
3. **Verify Git History Cleanliness:**
   ```bash
   git log -n 1 -p -- valuelens-ai/backend/src/main/resources/application.yml
   ```
   Verify that no password or API key is present in the patch.
4. Verify `valuelens-ai/.env` is listed in `.gitignore` and untracked by `git status`.

---

## 5. Summary Sign-Off

- [x] All hardcoded production credentials removed from active configuration files.
- [x] Dynamic environment variable fallbacks established for containerized runtime.
- [x] Clear rotation steps provided for Supabase DB and Google SMTP App Password.
- [x] Git repository verification instructions documented.
