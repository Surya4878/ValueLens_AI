# ValueLens AI

**AI-Powered Migration Economics & Decision Intelligence**

ValueLens AI is an enterprise platform for evaluating and modeling integration migrations from **SAP PI/PO**, **webMethods**, and **MuleSoft** to **SAP BTP Integration Suite**.

The platform combines **100% deterministic financial computation**, **enterprise TCO modeling**, **multi-period ROI analysis**, **real-time scenario sensitivity simulation**, **data-quality auditing**, and **AI-powered migration decision intelligence**.

---

## 0. The Prime Architectural Principle: Zero Financial Hallucinations

In ValueLens AI, **Large Language Models are strictly prohibited from performing financial arithmetic or modifying calculation results**.

```
┌────────────────────────────────────────────────────────┐
│             ValueLens AI Architecture                  │
└────────────────────────────────────────────────────────┘
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     Next.js 14 Frontend       │   │  Java 21 Spring Boot Backend  │
│  - React, TypeScript, Tailwind│   │  - Sole Source of Truth       │
│  - Recharts Visualizations    │   │  - Pure BigDecimal Math       │
│  - UI State & Scenario Sliders│   │  - Flyway Migrations          │
│  - Communicates via REST only │   │  - PostgreSQL / H2 Database   │
└──────────────┬────────────────┘   └──────────────┬────────────────┘
               │                                   │
               │ HTTP REST                         │ JSON Context
               ▼                                   ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│       HTTP REST Endpoints     │   │     NVIDIA NIM AI Advisory    │
│  - POST /api/v1/calculateROI  │   │  - Model: nemotron-3-super    │
│  - POST /api/v1/assessments   │   │  - Risk Register & Strategic  │
│  - POST /api/v1/calculateScen.│   │    Recommendations            │
│  - POST /api/v1/ai/analyze    │   │  - Read-Only Advisory Layer   │
└───────────────────────────────┘   └───────────────────────────────┘
```

1. **Frontend (Next.js):** Responsible exclusively for user interaction, visual charts, scenario tuning sliders, and presenting board-ready dossiers. Never performs financial math.
2. **Backend (Java 21 LTS + Spring Boot 3.3.4):** The sole authoritative financial source of truth. All calculations are executed with exact `BigDecimal` scaling, yielding deterministic results down to the penny with step-by-step arithmetic audit traces.
3. **AI Layer (NVIDIA NIM):** Powered by `nvidia/nemotron-3-super-120b-a12b` via `https://integrate.api.nvidia.com/v1`. Generates executive narratives, risk registers, and next actions. It consumes verified financial outputs as read-only context and cannot alter numbers.

---

## 1. Verified Production Case Study Benchmark

When loading the benchmark SAP PI/PO enterprise case study, the engine yields the following exact metrics:

| Metric | Benchmark Value | Data Origin | Formula / Basis |
| :--- | :--- | :--- | :--- |
| **Current Platform TCO** | **$730,000.00** | `CALCULATED` | Licensing ($290k) + Infra ($100k) + Support ($220k) + Ops ($120k) |
| **Target Platform TCO** | **$313,084.00** | `CALCULATED` | BTP Standard Edition ($19,140) + Additional Ops ($293,944) |
| **Annual Operational Savings** | **$416,916.00** | `DERIVED` | Current TCO - Target TCO (57.11% reduction) |
| **One-Time Migration Cost** | **$300,000.00** | `CALCULATED` | Dev ($140k), QA ($45k), Arch ($30k), PM ($25k), Training ($20k), Buffer ($15k) |
| **Capital Break-Even Horizon** | **8.64 Months** | `DERIVED` | `(MigrationCost / AnnualSavings) * 12` |
| **1-Year ROI** | **38.97%** | `DERIVED` | Net Benefit: $116,916.00 |
| **3-Year ROI** | **316.92%** | `DERIVED` | Net Benefit: $950,748.00 |
| **5-Year ROI** | **594.86%** | `DERIVED` | Net Benefit: $1,784,580.00 |
| **10-Year ROI** | **1,289.72%** | `DERIVED` | Net Benefit: $3,869,160.00 |
| **Executive Recommendation** | **FAVORABLE (91%)**| `AI_INTERPRETED`| Rapid payback within Year 1; low execution risk profile |

---

## 2. Directory Structure

```
valuelens-ai/
├── backend/                        # Java 21 LTS + Spring Boot 3.3.4
│   ├── src/main/java/com/valuelens/ai/
│   │   ├── ai/                     # NVIDIA NIM Client & Prompt Builders
│   │   ├── calculator/             # 9 Pure BigDecimal Deterministic Calculators
│   │   ├── config/                 # CORS, OpenAPI, and Properties
│   │   ├── controller/             # REST Endpoints (/api/v1/calculateROI, etc.)
│   │   ├── dto/                    # Strongly-typed Request & Response DTOs
│   │   ├── model/                  # JPA Entities
│   │   ├── repository/             # Spring Data JPA Repositories
│   │   ├── service/                # Business & Orchestration Services
│   │   └── validator/              # Data Quality & Consistency Validators
│   ├── src/main/resources/
│   │   ├── db/migration/           # Flyway Migrations (V1, V2, V3)
│   │   ├── application.yml         # Main Configuration
│   │   └── application-dev.yml     # Zero-setup H2 PostgreSQL profile
│   ├── src/test/java/              # Comprehensive JUnit 5 Integration Tests
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                       # Next.js 14 + React + TypeScript + Tailwind
│   ├── app/
│   │   ├── assessment/page.tsx     # 4-step Migration Assessment Wizard
│   │   ├── dashboard/[id]/page.tsx # Executive ROI Dashboard (3 View Modes)
│   │   ├── scenarios/[id]/page.tsx # Interactive Sensitivity Simulator
│   │   ├── report/[id]/page.tsx    # Board-Ready PDF Dossier
│   │   ├── methodology/page.tsx    # Transparency & Formula Documentation
│   │   ├── settings/page.tsx       # System Diagnostics & Model Check
│   │   ├── layout.tsx              # Root Navigation & Theme
│   │   └── page.tsx                # Enterprise Landing Page
│   ├── components/
│   │   ├── ai/                     # AiInsightPanel & AiAssistantDrawer
│   │   ├── assessment/             # AssessmentWizard Form
│   │   ├── dashboard/              # DecisionHero, KpiCard, 4 Recharts Charts
│   │   ├── navigation/             # TopNavbar
│   │   └── ui/                     # ValueOriginChip
│   ├── lib/                        # API client, Formatters, Design Tokens
│   ├── types/                      # TypeScript Interface Definitions
│   ├── Dockerfile
│   └── package.json
│
├── sample-data/
│   └── demo-assessment.json        # Benchmark SAP PI/PO Assessment Payload
├── docker-compose.yml              # Multi-container Compose
├── .env.example                    # Sample Environment Variables
└── README.md                       # Platform Documentation
```

---

## 3. Running Locally

### Prerequisites
- **Java 21 LTS** (e.g. Eclipse Temurin 21)
- **Node.js 20+** and **npm**
- *(Optional)* **Docker & Docker Compose**

### Option A: Direct Local Execution

#### 1. Start the Java Backend
```powershell
cd valuelens-ai/backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"  # Or your Java 21 path
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```
The backend starts on `http://localhost:8080`.
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI Docs: `http://localhost:8080/v3/api-docs`

#### 2. Start the Next.js Frontend
In a separate terminal:
```powershell
cd valuelens-ai/frontend
npm run dev
```
The frontend starts on `http://localhost:3000`.

---

### Option B: Docker Compose

To start PostgreSQL, the Java Backend, and the Next.js Frontend in containers:
```bash
cd valuelens-ai
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

---

## 4. Key REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/calculateROI` | Authoritative deterministic calculation of TCO, savings, payback, and multi-period ROI. |
| `POST` | `/api/v1/calculateScenario` | Real-time sensitivity simulation (savings, migration cost, target TCO factors). |
| `GET` | `/api/v1/assessments/demo` | Retrieves standard pre-calibrated SAP PI/PO benchmark assessment. |
| `POST` | `/api/v1/assessments` | Saves new assessment and executes baseline calculations. |
| `POST` | `/api/v1/ai/analyze` | Generates autonomous executive interpretation via NVIDIA NIM. |
| `POST` | `/api/v1/ai/chart-insight` | Generates contextual commentary for a specific chart. |
| `POST` | `/api/v1/ai/question` | Contextual Q&A agent grounded strictly in calculated facts. |
| `GET` | `/api/v1/export/json` | Exports complete assessment, calculation trace, and AI analysis in JSON. |
| `GET` | `/api/v1/export/csv` | Exports itemized financial metrics in tabular CSV format. |

---

## 5. Verification & Test Suite

The deterministic financial engine is covered by automated integration tests verifying all calculations down to the exact cent:

```powershell
cd valuelens-ai/backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
.\mvnw.cmd test
```
**Results:** `Tests run: 10, Failures: 0, Errors: 0, Skipped: 0` (100% passing).
