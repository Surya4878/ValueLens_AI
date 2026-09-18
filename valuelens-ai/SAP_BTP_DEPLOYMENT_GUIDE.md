# ValueLens AI — SAP BTP Cloud Foundry & Business Application Studio Master Deployment Guide

This document is the definitive, production-grade guide for deploying **ValueLens AI** (Java 21 Spring Boot 3.3 backend + Next.js 14 frontend) onto **SAP Business Technology Platform (SAP BTP) Cloud Foundry** using **SAP Business Application Studio (BAS)**.

It captures every step, every command explained in detail, all real-world troubleshooting scenarios ("if-else" cases) encountered during deployment, and instructions for replicating the deployment in any other SAP BTP account.

---

## Table of Contents
1. [Architecture on SAP BTP Cloud Foundry](#1-architecture-on-sap-btp-cloud-foundry)
2. [Every Command Explained](#2-every-command-explained)
3. [Step-by-Step Deployment Runbook in SAP BAS](#3-step-by-step-deployment-runbook-in-sap-bas)
4. [Real-World Troubleshooter & "If-Else" Decision Matrix](#4-real-world-troubleshooter--if-else-decision-matrix)
5. [How to Deploy to Another SAP BTP Account or Space](#5-how-to-deploy-to-another-sap-btp-account-or-space)
6. [Post-Deployment Health Verification](#6-post-deployment-health-verification)

---

## 1. Architecture on SAP BTP Cloud Foundry

```
                                    ┌─────────────────────────────────────────────────────────┐
                                    │               SAP BTP Cloud Foundry Space               │
                                    │                                                         │
   End-User Browser ───────────────►│  valuelens-frontend (Next.js 14 / Node 20)              │
                                    │  Route: https://valuelens-frontend.<domain>            │
                                    │  Memory: 1024 MB | Healthcheck: /login                  │
                                    └────────────────────────────┬────────────────────────────┘
                                                                 │ API Calls (REST / JWT)
                                                                 ▼
                                    ┌─────────────────────────────────────────────────────────┐
                                    │  valuelens-backend (Spring Boot 3.3.4 / Java 21)        │
                                    │  Route: https://valuelens-backend.<domain>             │
                                    │  Memory: 1024 MB | Healthcheck: /api/v1/assessments/demo│
                                    └────────────────────────────┬────────────────────────────┘
                                                                 │ Encrypted JDBC Pooler
                                                                 ▼
                                    ┌─────────────────────────────────────────────────────────┐
                                    │  PostgreSQL Database (Supabase Pooler on AWS)           │
                                    │  Port: 5432 | sslmode=require                           │
                                    └─────────────────────────────────────────────────────────┘
```

---

## 2. Every Command Explained

Here is the exact explanation of every tool, CLI argument, and flag used throughout the deployment:

### Backend Build Commands
| Command | What It Does | Why It Is Used |
|---|---|---|
| `mvn clean package -DskipTests` | Compiles Java source code, downloads Maven dependencies, packages classes into a fat JAR at `backend/target/valuelens-backend-1.0.0-SNAPSHOT.jar`, and skips test suite execution. | Generates the deployable Spring Boot executable JAR in BAS without waiting for local integration tests. |

### Cloud Foundry Authentication & Targeting
| Command & Flags | Meaning & Explanation |
|---|---|
| `cf login` | The Cloud Foundry CLI authentication command. |
| `-a <API_ENDPOINT>` | Specifies the Cloud Foundry API Endpoint URL (e.g., `https://api.cf.us10-003.hana.ondemand.com`). Never open this URL in a browser; it is exclusively for the CLI. |
| `-o <ORG_NAME>` | Pre-selects the Cloud Foundry Organization (e.g., `190643ebtrial`). |
| `-s <SPACE_NAME>` | Pre-selects the target Space within the Org (e.g., `dev` or `prod`). |
| `--sso` | Single Sign-On flag. Prompts Cloud Foundry to output a temporary passcode URL (e.g. `https://login.cf.<region>.hana.ondemand.com/passcode`). Open that passcode URL in your browser, copy the code, and paste it into the terminal. |
| `cf target` | Displays the currently active API endpoint, logged-in user, organization, and space. |
| `cf routes` | Lists all HTTP/HTTPS routes (hostnames and domains) mapped to applications in the active space. |
| `cf apps` | Shows status (`running`, `crashed`, `stopped`), instance counts (`1/1`), memory usage, and URLs of all applications. |

### Environment Variables & Secrets
| Command & Flags | Meaning & Explanation |
|---|---|
| `cf set-env <APP> <KEY> "<VAL>"` | Sets an environment variable in Cloud Foundry container metadata. |
| `cf restart <APP>` | Restarts an application container **without re-uploading code or re-running the buildpack**. Injects newly set environment variables into the JVM/Node process. |
| `cf restage <APP>` | Re-runs the full buildpack staging process on the existing uploaded code droplet. Required if buildpack settings change. |

### Cloud Foundry Push Commands & Flags
| Command & Flag | Meaning & Explanation |
|---|---|
| `cf push <APP_NAME>` | Uploads and launches an application container. |
| `-p <PATH>` | Specifies the local folder or file to upload (e.g. `-p ./backend/target/valuelens-backend-1.0.0-SNAPSHOT.jar` or `-p ./frontend`). |
| `-b <BUILDPACK>` | Specifies the buildpack: `java_buildpack` (for Spring Boot JAR) or `nodejs_buildpack` (for Next.js). |
| `-m 1024M` | Allocates **1024 MB (1 GB)** container RAM. Essential for Spring Boot JVM and Next.js SSR processes. |
| `-k 1024M` | Allocates **1024 MB (1 GB)** container disk quota for application files and dependencies. |
| `-u http` | Sets the container health check type to `http` rather than port-listening, ensuring the web server is actually responding. |
| `--endpoint <PATH>` | Specifies the URL path Cloud Foundry pings to determine health (e.g. `/api/v1/assessments/demo` for backend, `/login` for frontend). |

### Frontend Build Commands in SAP BAS
| Command | What It Does | Why It Is Used |
|---|---|---|
| `npm install` | Installs all dependencies (including `devDependencies` like TypeScript, Tailwind, PostCSS). | Must be run in SAP BAS once before compiling the production bundle. |
| `export NEXT_PUBLIC_...` | Sets an environment variable in the current bash session. | Next.js inlines all `NEXT_PUBLIC_*` variables at compile time into client JavaScript. |
| `npm run build` | Runs `next build` to generate static pages, server components, and `.next/` directory. | Runs inside SAP BAS (which has 4GB+ RAM) to avoid Cloud Foundry container memory crashes. |

---

## 3. Step-by-Step Deployment Runbook in SAP BAS

### Prerequisites
1. SAP BTP Subaccount with Cloud Foundry enabled.
2. SAP Business Application Studio dev space created with type: **Full Stack Cloud Application**.
3. Cloned repository inside SAP BAS (`git clone https://github.com/Surya4878/ValueLens_AI.git`).

---

### Step 1: Log in to Cloud Foundry in SAP BAS Terminal
Open terminal in SAP BAS (`Ctrl + \`` or `Menu -> Terminal -> New Terminal`):

```bash
cf login -a https://api.cf.<region>.hana.ondemand.com -o <ORG_NAME> -s <SPACE_NAME> --sso
```
*Open the passcode link printed in the terminal, copy your one-time code, paste it into the terminal, and press Enter.*

---

### Step 2: Build & Push the Spring Boot Backend

1. **Build Backend JAR**:
   ```bash
   cd backend
   mvn clean package -DskipTests
   cd ..
   ```

2. **Push Backend Application**:
   ```bash
   cf push valuelens-backend -p ./backend/target/valuelens-backend-1.0.0-SNAPSHOT.jar -b java_buildpack -m 1024M -k 1024M -u http --endpoint /api/v1/assessments/demo
   ```

3. **Set Production Environment Variables on Backend**:
   ```bash
   # Database connection (Supabase PostgreSQL pooler)
   cf set-env valuelens-backend DATABASE_URL "jdbc:postgresql://aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
   cf set-env valuelens-backend DATABASE_USER "postgres.bcjlwdjwpsksysukraup"
   cf set-env valuelens-backend DATABASE_PASSWORD 'Surya@!INC0307'

   # Production Security Keys (Must NOT be default template key)
   cf set-env valuelens-backend JWT_SECRET "c9f8a3e7b1d420658a12de49b8214f5e7109a25b68cd4e91fb032478a69e4f21"

   # SMTP Notification Credentials
   cf set-env valuelens-backend SMTP_USER "noreply.businessvaluelensai@gmail.com"
   cf set-env valuelens-backend SMTP_PASS "impdmyqqqhxcbdwa"

   # Google OAuth Client ID
   cf set-env valuelens-backend GOOGLE_CLIENT_ID "1046788661030-vv9n8btfmsqucik86duuuqdock41kni7.apps.googleusercontent.com"

   # Activate Production Profile
   cf set-env valuelens-backend SPRING_PROFILES_ACTIVE "prod"
   ```

4. **Restart Backend to load configuration**:
   ```bash
   cf restart valuelens-backend
   ```
   *Verify status shows: `state: running`, `instances: 1/1`.*

---

### Step 3: Build & Push the Next.js Frontend

1. **Find your live Backend URL**:
   ```bash
   cf routes
   ```
   *(e.g., `https://valuelens-backend.cfapps.<region>.hana.ondemand.com`)*.

2. **Build the Next.js Frontend in SAP BAS**:
   ```bash
   cd frontend
   npm install
   export NEXT_PUBLIC_API_BASE_URL="https://valuelens-backend.cfapps.<region>.hana.ondemand.com"
   export NEXT_PUBLIC_GOOGLE_CLIENT_ID="1046788661030-vv9n8btfmsqucik86duuuqdock41kni7.apps.googleusercontent.com"
   npm run build
   cd ..
   ```

3. **Push Pre-built Frontend**:
   ```bash
   cf push valuelens-frontend -p ./frontend -b nodejs_buildpack -m 1024M -k 1024M -u http --endpoint /login
   ```
   *Verify status shows: `state: running`, `instances: 1/1`.*

---

### Step 4: Link Frontend and Backend via CORS

1. **Find your live Frontend URL**:
   ```bash
   cf routes
   ```
   *(e.g., `https://valuelens-frontend.cfapps.<region>.hana.ondemand.com`)*.

2. **Whitelist the Frontend URL on the Backend**:
   ```bash
   cf set-env valuelens-backend CORS_ALLOWED_ORIGINS "https://valuelens-frontend.cfapps.<region>.hana.ondemand.com"
   cf set-env valuelens-backend FRONTEND_URL "https://valuelens-frontend.cfapps.<region>.hana.ondemand.com"
   cf restart valuelens-backend
   ```

---

### Step 5: Whitelist BTP Domain in Google Cloud Console
1. Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Click your OAuth 2.0 Web Client ID.
3. Under **Authorised JavaScript origins**, click **+ Add URI**:
   `https://valuelens-frontend.cfapps.<region>.hana.ondemand.com`
4. Under **Authorised redirect URIs**, click **+ Add URI**:
   `https://valuelens-frontend.cfapps.<region>.hana.ondemand.com/login`
5. Click **Save**.

---

## 4. Real-World Troubleshooter & "If-Else" Decision Matrix

Below are all the real-world obstacles, errors, and nuances encountered during deployment, along with the technical rationale and exact solution:

| # | Error / Symptom | Root Cause | Solution |
|---|---|---|---|
| **1** | `bash: region: No such file or directory` | Angle brackets `<region>` in documentation were treated by Linux bash as file redirection (`<`). | Replace the placeholder with your actual region URL without brackets: `cf login -a https://api.cf.us10-003.hana.ondemand.com`. |
| **2** | `Forbidden` error when opening API endpoint in Chrome | `api.cf.<region>.hana.ondemand.com` is a REST API for the CF CLI, not a web page. Directly opening it in a browser produces 403 Forbidden. | Do not open the API endpoint in a browser. Only open the temporary **passcode URL** (`login.cf.../passcode`) prompted during `cf login --sso`. |
| **3** | Backend crashes: `Could not resolve placeholder 'DATABASE_URL'` | Spring Boot requires database configuration on startup. If env vars are missing, context refresh fails. | Run `cf set-env valuelens-backend DATABASE_URL "..."` followed by `cf restart valuelens-backend`. |
| **4** | Password with `!` gets altered or gives `event not found` | In Linux Bash, an exclamation mark (`!`) inside double quotes triggers Bash History Expansion (e.g. `!INC0307`). | Always wrap passwords containing `!` in **single quotes**: `cf set-env valuelens-backend DATABASE_PASSWORD 'Surya@!INC0307'`. |
| **5** | Backend crash: `CRITICAL SECURITY ERROR: Default or weak JWT_SECRET cannot be used in production` | `JwtSessionService.java` enforces a security guard in `prod` profile: it throws an exception if the secret is `< 32 chars` or equals `DEFAULT_SECRET`. | Generate a unique, random 64-char key: `cf set-env valuelens-backend JWT_SECRET "c9f8a3e7b1d420658a12de49b8214f5e7109a25b68cd4e91fb032478a69e4f21"`. |
| **6** | Frontend staging fails: `BuildpackCompileFailed` | Cloud Foundry staging containers have strict 1GB limits. Compiling 14 Next.js pages and Webpack optimizations in the staging container runs out of memory. | Build the application inside SAP BAS (`cd frontend && npm run build && cd ..`) and push the pre-built `.next/` directory. |
| **7** | Frontend crashes on start: `Could not find a production build in the '.next' directory` | `.next/` was listed in `.gitignore`, so Cloud Foundry did not upload it. | Add a `frontend/.cfignore` file containing only `node_modules/`, `.git/`, and `*.log` so `.next` is included in the upload droplet. |
| **8** | Frontend login shows: `Google sign-in requires NEXT_PUBLIC_GOOGLE_CLIENT_ID in configuration` | Next.js inlines `NEXT_PUBLIC_*` variables at compile time. If built without setting `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, the client bundle has an undefined client ID. | Export `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in BAS before running `npm run build`, and add your BTP domain to Authorized JavaScript origins in Google Cloud Console. |
| **9** | Previous user inputs visible across account switch on same browser | Inputs were stored in browser `localStorage` (`valuelens_active_assessment`). `localStorage` is scoped to domain, not user accounts. | Implemented user-session validation in `AssessmentWizard.tsx`, cleared cache on logout, and added automatic account mismatch detection in `AuthProvider.tsx`. |

---

## 5. How to Deploy to Another SAP BTP Account or Space

If you need to deploy this solution to a client's SAP BTP account, a new subaccount, or a different Cloud Foundry space (e.g. `prod` instead of `dev`), follow this checklist:

### Checklist for a New Account

1. **Get Subaccount Details from SAP BTP Cockpit**:
   - Go to **Subaccount Overview** &rarr; Cloud Foundry Environment.
   - Note down:
     - **API Endpoint** (e.g. `https://api.cf.eu10.hana.ondemand.com` or `https://api.cf.ap21.hana.ondemand.com`).
     - **Org Name** (e.g. `customer-prod-org`).
     - **Space Name** (e.g. `production`).

2. **Open SAP Business Application Studio in the New Account**:
   - Create a Dev Space &rarr; Type: **Full Stack Cloud Application**.
   - Open the space once running.

3. **Clone the Repository in the New BAS**:
   ```bash
   git clone https://github.com/Surya4878/ValueLens_AI.git
   cd ValueLens_AI/valuelens-ai
   ```

4. **Authenticate to the New BTP Space**:
   ```bash
   cf login -a <NEW_API_ENDPOINT> -o <NEW_ORG> -s <NEW_SPACE> --sso
   ```

5. **Deploy Backend**:
   ```bash
   cd backend
   mvn clean package -DskipTests
   cd ..
   cf push valuelens-backend -p ./backend/target/valuelens-backend-1.0.0-SNAPSHOT.jar -b java_buildpack -m 1024M -k 1024M -u http --endpoint /api/v1/assessments/demo
   ```
   Set environment variables with the target database credentials and new unique JWT secret, then `cf restart valuelens-backend`.

6. **Check Backend URL & Deploy Frontend**:
   ```bash
   cf routes
   # Copy the new valuelens-backend URL
   cd frontend
   npm install
   export NEXT_PUBLIC_API_BASE_URL="https://valuelens-backend.<new-domain>"
   export NEXT_PUBLIC_GOOGLE_CLIENT_ID="<GOOGLE_CLIENT_ID>"
   npm run build
   cd ..
   cf push valuelens-frontend -p ./frontend -b nodejs_buildpack -m 1024M -k 1024M -u http --endpoint /login
   ```

7. **Update CORS & Google Console**:
   ```bash
   cf routes
   # Copy new valuelens-frontend URL
   cf set-env valuelens-backend CORS_ALLOWED_ORIGINS "https://valuelens-frontend.<new-domain>"
   cf set-env valuelens-backend FRONTEND_URL "https://valuelens-frontend.<new-domain>"
   cf restart valuelens-backend
   ```
   Add the new frontend domain to Google Cloud Console Authorized JavaScript origins.

---

## 6. Post-Deployment Health Verification

Verify both endpoints respond with **HTTP 200**:

```bash
# 1. Backend REST Endpoint
curl -I https://valuelens-backend.<your-domain>/api/v1/assessments/demo
# Expected: HTTP/1.1 200 OK

# 2. Frontend Login Route
curl -I https://valuelens-frontend.<your-domain>/login
# Expected: HTTP/1.1 200 OK

# 3. Check container states
cf apps
# Expected: Both apps show 'running' with instances '1/1'
```

---

*ValueLens AI — Enterprise SAP BTP Production Deployment Guide — 2026*
