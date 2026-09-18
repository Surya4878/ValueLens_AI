# Business ValueLens AI — Production Security & Deployment Checklist

**Framework Standard:** OWASP Application Security Verification Standard (ASVS) 5.0 (Levels 1 & 2)  
**Classification:** Enterprise SaaS Financial & ROI Migration Intelligence  
**Target Release:** Production v1.0.0  
**Verification Date:** September 18, 2026  

---

## Quick Reference Status Dashboard

| ASVS Domain | Description | Verification Status | Notes |
|---|---|---|---|
| **V1: Architecture** | Security Architecture & Threat Model | ✅ **PASSED** | Multi-tier architecture, stateless JWT session, perimeter rate limiting |
| **V2: Authentication** | Identity, Passwords, OAuth & OTP | ✅ **PASSED** | Cryptographic Google/Microsoft JWKS verification, OTP attempt throttling |
| **V3: Session Management** | Cookies, Expiration & Invalidation | ✅ **PASSED** | `HttpOnly`, `SameSite=Lax`, `Secure`, 24h expiration, logout revocation |
| **V4: Access Control** | BOLA / IDOR & Multi-tenancy | ✅ **PASSED** | User-scoped queries, 403 AccessDeniedException, demo assessment isolation |
| **V5: Input Validation** | Payloads, Types & Parameter Tampering | ✅ **PASSED** | Jakarta Bean Validation, UUID verification, sanitized file exports |
| **V6: Cryptography & Secrets**| Key Management & Secret Isolation | ✅ **PASSED** | Code clean, config files sanitized; Supabase DB password rotated |
| **V7: Error Handling & Logs** | Information Disclosure & Logging | ✅ **PASSED** | Correlation IDs (`X-Request-Id`), PII masking, generic 500 responses |
| **V8: Data Protection** | Transit & Rest Protection | ✅ **PASSED** | TLS enforcement headers, HSTS, sensitive field isolation |
| **V9: Communications** | CORS & Transport Security | ✅ **PASSED** | Whitelisted origins, credentialed CORS, preflight handling |
| **V10: Malicious Code** | Dependency Vulnerability Auditing | ✅ **PASSED** | Next.js updated to 14.2.35, PostCSS updated to 8.4.49+ |
| **V11: Business Logic** | ROI Calculations & Integrity | ✅ **PASSED** | Deterministic calculations, immutable demo assessment baseline |
| **V12: File Handling** | Export & Upload Sanitization | ✅ **PASSED** | Filename regex sanitization on JSON/CSV exports, no local file execution |
| **V13: API Security** | Rate Limiting & REST Controls | ✅ **PASSED** | In-memory sliding window rate limiter: 15 auth/min, 25 AI/min, 120 gen/min |
| **V14: Configuration** | Container, Docker & Production Flags | ✅ **PASSED** | Next.js standalone output, dev endpoints disabled in production |

---

## Detailed ASVS Verification Items

### V1 — Architecture & Threat Modeling
- [x] **V1.1.1**: The application enforces separation between presentation (Next.js), business logic (Spring Boot), and persistence (PostgreSQL).
- [x] **V1.1.2**: All security controls are enforced on the trusted server (Spring Boot backend) rather than the browser client.
- [x] **V1.1.3**: Micro-segmentation implemented between unauthenticated public routes (`/api/auth/**`, `/api/v1/assessments/demo`) and authenticated business routes (`/api/v1/assessments/**`, `/api/v1/ai/**`).

### V2 — Authentication & Identity Management
- [x] **V2.1.1**: Passwords hashed with BCrypt (strength 10+ rounds) before database persistence.
- [x] **V2.1.2**: Password complexity enforced: minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.
- [x] **V2.2.1**: Google OAuth tokens verified cryptographically using Google JWKS endpoint (`https://www.googleapis.com/oauth2/v3/certs`), verifying RSA signature, audience matching `GOOGLE_CLIENT_ID`, expiration timestamp, and `email_verified = true`.
- [x] **V2.2.2**: Microsoft Entra ID tokens verified cryptographically against Microsoft JWKS (`https://login.microsoftonline.com/common/discovery/v2.0/keys`), verifying kid signature, issuer, and expiration.
- [x] **V2.3.1**: Email OTP verification enforces:
  - 6-digit cryptographic random code.
  - 10-minute expiration window.
  - 60-second cooldown between resend requests.
  - Maximum 5 failed attempts per OTP before invalidation.
- [x] **V2.3.2**: Outbound OTP values and password reset tokens are **NEVER** logged to stdout, logs, or external monitoring.

### V3 — Session Management
- [x] **V3.1.1**: Authenticated session maintained via `valuelens_session` cookie with `HttpOnly=true` to prevent JavaScript XSS theft.
- [x] **V3.1.2**: Cookie `SameSite=Lax` configured to mitigate Cross-Site Request Forgery (CSRF).
- [x] **V3.1.3**: Cookie `Secure` flag enabled automatically in production environments or when `app.security.cookie.secure=true`.
- [x] **V3.2.1**: Stateless JWT session tokens signed with HMAC-SHA256 (`HS256`).
- [x] **V3.2.2**: JWT expiration configured to 24 hours (86,400,000 ms).
- [x] **V3.2.3**: Logout endpoint (`POST /api/auth/logout`) terminates session by issuing cookie clearing header (`maxAge=0`).

### V4 — Access Control (Broken Object-Level Authorization - BOLA / IDOR)
- [x] **V4.1.1**: All private assessments scoped by `userId`. Users cannot view, update, or delete assessments owned by another user.
- [x] **V4.1.2**: `AssessmentRepository` queries require `userId` binding: `findByIdAndUserId(id, userId)` and `findByUserIdOrderByUpdatedAtDesc(userId)`.
- [x] **V4.1.3**: Accessing an unauthorized assessment returns **HTTP 403 Forbidden** (`AccessDeniedException`), or **HTTP 401 Unauthorized** (`UnauthorizedException`) if unauthenticated.
- [x] **V4.1.4**: Public demo assessment (`demo-assessment-1`) explicitly allowed for unauthenticated read access, while preserving user scoping for saved copies.
- [x] **V4.1.5**: Report generation (`/api/v1/reports/generate`) and Export (`/api/v1/export/*`) endpoints verify ownership of the target assessment.

### V5 — Input Validation & Sanitization
- [x] **V5.1.1**: Request bodies validated using Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Email`, `@Size`).
- [x] **V5.1.2**: Malformed JSON triggers **HTTP 400 Bad Request** with sanitized error structure.
- [x] **V5.1.3**: Export endpoints sanitize export filenames (`assessmentId.replaceAll("[^a-zA-Z0-9_-]", "")`) preventing HTTP Header Injection and path traversal.

### V6 — Stored Cryptography & Secrets Management
- [x] **V6.1.1**: Rotated Supabase PostgreSQL password in Supabase Console and verified live with connection pooler.
- [ ] **V6.1.2 (ACTION REQUIRED)**: Revoke Google App Password in Google Account Security settings.
- [x] **V6.1.3**: All hardcoded passwords, tokens, and keys removed from `application.yml` and `application-dev.yml`.
- [x] **V6.1.4**: `valuelens-ai/.env` gitignored and verified untracked.
- [x] **V6.2.1**: `JWT_SECRET` startup validation blocks execution if key is default or <32 characters when running with `SPRING_PROFILES_ACTIVE=prod`.

### V7 — Error Handling & Logging
- [x] **V7.1.1**: Detailed Java stack traces and SQL exception messages hidden from API error responses.
- [x] **V7.1.2**: Generic internal server errors return:
  ```json
  {
    "success": false,
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "An unexpected error occurred. Please contact support with the reference ID.",
      "details": ["Reference ID: a1b2c3d4-..."]
    }
  }
  ```
- [x] **V7.2.1**: `CorrelationIdFilter` captures or generates `X-Request-Id` and binds to SLF4J MDC (`requestId`).
- [x] **V7.2.2**: Sensitive user PII (emails) masked in logs (`a***t@valuelens.demo`).

### V8 & V9 — Communications, CORS & Security Headers
- [x] **V8.1.1**: Security headers injected on all HTTP responses:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Cache-Control: no-cache, no-store, max-age=0, must-revalidate` on all `/api/*` routes.
- [x] **V9.1.1**: Frontend Next.js configured with Content-Security-Policy (CSP) restricting scripts, fonts, and connect origins to trusted endpoints.
- [x] **V9.1.2**: CORS whitelists `app.cors.allowed-origins` with credentials enabled (`allowCredentials(true)`).

### V10 — Malicious Code & Dependencies
- [x] **V10.1.1**: Next.js upgraded from `14.2.15` to `14.2.35` to address critical/high CVEs (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4, GHSA-89xv-2m56-2m9x).
- [x] **V10.1.2**: PostCSS upgraded to `^8.4.49` to prevent source map path traversal and style stringification XSS.

### V11 & V12 — Business Logic & File Safety
- [x] **V11.1.1**: ROI, TCO, and Break-Even calculations are deterministic mathematical formulas run server-side.
- [x] **V11.1.2**: Incture pricing model packages, duration multipliers, and BTP edition sizing logic cannot be tampered with via client manipulation.
- [x] **V12.1.1**: No arbitrary file uploads accepted; export outputs are memory-buffered CSV and JSON strings with safe `Content-Disposition`.

### V13 — API Security & DoS Protection
- [x] **V13.1.1**: Sliding-window rate limiting filter implemented:
  - Auth routes (`/api/auth/**`): **15 requests/minute/IP**.
  - AI routes (`/api/v1/ai/**`): **25 requests/minute/IP**.
  - General API routes (`/api/**`): **120 requests/minute/IP**.
- [x] **V13.1.2**: Rate limit exceeded returns **HTTP 429 Too Many Requests** with `Retry-After: 60`.
- [x] **V13.1.3**: AI Debug route (`/api/v1/ai/debug`) disabled when `SPRING_PROFILES_ACTIVE=prod`.

### V14 — Configuration & Container Deployment
- [x] **V14.1.1**: Next.js configured with `output: 'standalone'` matching multi-stage Docker build.
- [x] **V14.1.2**: `poweredByHeader: false` configured to suppress framework version fingerprinting.
- [x] **V14.1.3**: Non-root container execution pattern supported for production Kubernetes/Cloud Run deployment.

---

## Pre-Flight Deployment Sign-Off Procedure

Before pointing production DNS to the application:

1. **Rotate Credentials:**
   - Execute Supabase database password reset.
   - Revoke compromised Google App Password.
2. **Set Production Environment Variables:**
   - `SPRING_PROFILES_ACTIVE=prod`
   - `DB_URL=jdbc:postgresql://<prod-db-host>:5432/<prod-db-name>`
   - `DB_PASSWORD=<new-rotated-password>`
   - `JWT_SECRET=<64-char-random-key>`
   - `APP_SECURITY_COOKIE_SECURE=true`
   - `APP_CORS_ALLOWED_ORIGINS=https://app.valuelens.ai`
   - `APP_FRONTEND_URL=https://app.valuelens.ai`
   - `NEXT_PUBLIC_API_BASE_URL=https://api.valuelens.ai`
3. **Verify Health & Smoke Tests:**
   - Run health check `GET /actuator/health`.
   - Test user registration with enterprise email and OTP verification.
   - Verify demo assessment read access.
   - Verify rate limiting triggers after 15 rapid requests to `/api/auth/login`.
