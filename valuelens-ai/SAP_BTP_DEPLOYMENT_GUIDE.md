# ValueLens AI — SAP Business Application Studio & SAP BTP Deployment Guide

This guide provides step-by-step instructions to import, configure, and deploy **ValueLens AI** (Java 21 Spring Boot backend + Next.js 14 frontend) onto **SAP Business Technology Platform (SAP BTP) Cloud Foundry** using **SAP Business Application Studio (BAS)**.

---

## 1. Architecture Overview on SAP BTP

```
                               ┌─────────────────────────────────────────┐
                               │       SAP BTP Cloud Foundry Space       │
                               │                                         │
  Client Browser ─────────────►│  valuelens-frontend (Next.js 14)        │
                               │  Buildpack: nodejs_buildpack (Node 20)  │
                               │  Memory: 1024 MB                        │
                               └────────────────────┬────────────────────┘
                                                    │ API Calls
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │  valuelens-backend (Spring Boot 3.3.4)  │
                               │  Buildpack: java_buildpack (Java 21)    │
                               │  Memory: 1024 MB                        │
                               └────────────────────┬────────────────────┘
                                                    │ JDBC Pooler
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │  PostgreSQL Database                    │
                               │  (Supabase Pooler or SAP BTP Hyperscaler)│
                               └─────────────────────────────────────────┘
```

---

## 2. Prerequisites on SAP BTP Cockpit

1. **SAP BTP Global Account & Subaccount**:
   - Cloud Foundry Environment must be **Enabled**.
   - A Cloud Foundry **Org** and **Space** (e.g., `dev` or `prod`) must exist.
2. **Entitlements & Quotas**:
   - **Cloud Foundry Runtime**: Minimum **2 GB** application memory (1 GB for backend + 1 GB for frontend).
   - **SAP Business Application Studio**: Subscribed under Subaccount Services / Applications.
3. **Role Collections**:
   - Ensure your SAP user has `Business_Application_Studio_Developer` and `Subaccount Administrator` or `Space Developer` roles.

---

## 3. Step 1: Create a Dev Space in SAP Business Application Studio

1. Open **SAP BTP Cockpit** &rarr; Navigate to your Subaccount.
2. In the left navigation, go to **Instances and Subscriptions** &rarr; Open **SAP Business Application Studio**.
3. Click **Create Dev Space**:
   - **Name**: `valuelens-workspace`
   - **Type**: Select **Full Stack Cloud Application** *(comes pre-configured with Java 21, Maven, Node.js 20, CF CLI, and MTA Build Tool)*.
   - Click **Create Dev Space**.
4. Once the status turns to **RUNNING**, click the space name to open the IDE.

---

## 4. Step 2: Clone the Project into SAP BAS

1. In SAP Business Application Studio, click **Clone from Git** on the Welcome screen (or open the Terminal: `Ctrl + \`` or `Menu -> Terminal -> New Terminal`).
2. Run the clone command:
   ```bash
   git clone https://github.com/Surya4878/ValueLens_AI.git
   ```
3. Open the cloned folder:
   - In BAS, select **File &rarr; Open Folder...** &rarr; navigate to `ValueLens_AI/valuelens-ai` and click **Open**.

---

## 5. Step 3: Log In to SAP BTP Cloud Foundry from SAP BAS

In the SAP BAS terminal:

1. Target your SAP BTP Cloud Foundry API endpoint:
   ```bash
   cf login -a https://api.cf.<region>.hana.ondemand.com
   ```
   *(Example for Frankfurt: `https://api.cf.eu10.hana.ondemand.com`; US East: `https://api.cf.us10.hana.ondemand.com`)*.

2. If using Corporate SSO / 2FA:
   - Use a temporary passcode:
     ```bash
     cf login -a https://api.cf.<region>.hana.ondemand.com --sso
     ```
   - Open the URL printed in the terminal, copy your one-time passcode, and paste it back into the terminal.

3. Select your **Org** and **Space** (e.g. `dev`).

4. Verify your active target:
   ```bash
   cf target
   ```

---

## 6. Step 4: Configure Database & Secrets

All secrets are externalized from configuration files. Set them securely via Cloud Foundry User-Provided Services or environment variables.

### Option A: Using Existing Supabase Database (Recommended)

Run the following in the BAS terminal to create a User-Provided Service for your database credentials:

```bash
cf create-user-provided-service valuelens-db-service -p '{
  "url": "jdbc:postgresql://aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require",
  "username": "postgres.bcjlwdjwpsksysukraup",
  "password": "YOUR_ROTATED_DB_PASSWORD"
}'
```

### Option B: Using SAP BTP PostgreSQL Hyperscaler Service

If provisioning PostgreSQL directly on SAP BTP:
```bash
cf create-service postgresql-db standard valuelens-db
```

---

## 7. Step 5: Build & Deploy ValueLens AI

You can deploy using either **Method 1 (Direct Cloud Foundry Manifest — Recommended)** or **Method 2 (Native SAP MTA)**.

### Method 1: Direct Cloud Foundry Manifest (`manifest.yml`) — Recommended

This method provides the fastest build and deployment cycle.

1. **Build the Backend Java JAR**:
   ```bash
   cd backend
   mvn clean package -DskipTests
   cd ..
   ```
   *(Produces `backend/target/valuelens-backend-1.0.0-SNAPSHOT.jar`)*.

2. **Deploy both applications**:
   ```bash
   cf push -f manifest.yml
   ```

3. **Configure Production Environment Secrets**:
   After initial push, bind your production secrets to the backend:
   ```bash
   cf set-env valuelens-backend DATABASE_URL "jdbc:postgresql://aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
   cf set-env valuelens-backend DATABASE_USER "postgres.bcjlwdjwpsksysukraup"
   cf set-env valuelens-backend DATABASE_PASSWORD "YOUR_DB_PASSWORD"
   cf set-env valuelens-backend JWT_SECRET "ValueLensAiEnterpriseSecretKeyForAuthenticationMustBeAtLeast32BytesLong2026!"
   cf set-env valuelens-backend SMTP_USER "noreply.businessvaluelensai@gmail.com"
   cf set-env valuelens-backend SMTP_PASS "YOUR_GMAIL_APP_PASSWORD"
   ```

4. **Connect Frontend to Backend Route**:
   Check your assigned routes:
   ```bash
   cf routes
   ```
   Note the URL of `valuelens-backend` (e.g. `https://valuelens-backend-<space>.<domain>`) and `valuelens-frontend` (e.g. `https://valuelens-frontend-<space>.<domain>`).

   Configure the cross-service communication:
   ```bash
   cf set-env valuelens-frontend NEXT_PUBLIC_API_BASE_URL "https://valuelens-backend-<space>.<domain>"
   cf set-env valuelens-backend CORS_ALLOWED_ORIGINS "https://valuelens-frontend-<space>.<domain>"
   ```

5. **Restage / Restart**:
   ```bash
   cf restage valuelens-backend
   cf restart valuelens-frontend
   ```

---

### Method 2: Native SAP Multi-Target Application (`mta.yaml`)

For organizations requiring standard SAP MTA archives:

1. In SAP Business Application Studio, right-click [`mta.yaml`](file:///c:/Users/Surya.Prakash/Downloads/inc_roicalculator%201/valuelens-ai/mta.yaml) &rarr; Select **Build MTA Project** (or run `mbt build` in the terminal).
2. The Cloud MTA Build Tool creates an archive under `mta_archives/valuelens-ai_2.0.0.mtar`.
3. Right-click the `.mtar` file &rarr; Select **Deploy MTA Archive** (or run `cf deploy mta_archives/valuelens-ai_2.0.0.mtar`).

---

## 8. Step 6: Post-Deployment Verification

1. **Verify Backend Health**:
   ```bash
   curl -I https://valuelens-backend-<space>.<domain>/api/v1/assessments/demo
   ```
   **Expected Response**: `HTTP/1.1 200 OK`

2. **Verify Frontend UI**:
   Open `https://valuelens-frontend-<space>.<domain>/login` in your web browser.
   - Test Sign In / Registration.
   - Run an assessment (e.g. SAP PI/PO to SAP BTP Migration).
   - Verify AI ROI analysis calculation and PDF generation.

---

## 9. Troubleshooting & FAQ

| Issue | Cause | Solution |
|---|---|---|
| `Port check failed / health check timeout` | Frontend hardcoded port 3000 | Ensure `package.json` uses `"start": "next start"` without hardcoded `-p 3000`. Next.js will automatically bind to Cloud Foundry's `$PORT`. |
| `OutOfMemoryError` on Backend | Spring Boot heap size exceeded default | In `manifest.yml`, ensure `memory: 1024M` is allocated and `JBP_CONFIG_OPEN_JDK_JRE` is configured. |
| `CORS Error in Browser` | Frontend domain not whitelisted | Update `CORS_ALLOWED_ORIGINS` on backend: `cf set-env valuelens-backend CORS_ALLOWED_ORIGINS "https://<frontend-url>" && cf restart valuelens-backend`. |
| `Content-Security-Policy connect-src blocked` | Custom BTP domain not permitted in CSP | `next.config.js` is already configured with `https://*.hana.ondemand.com https://*.ondemand.com`. If using a custom vanity domain (e.g. `valuelens.yourcompany.com`), add it to `connect-src` in `next.config.js`. |
