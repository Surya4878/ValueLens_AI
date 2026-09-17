# ValueLens AI • Calculation Formulas, Weights & Examples Guide
### Plain-English, Human-Readable Reference for Enterprise Migration Economics

---

## About This Guide

This document explains **every single formula, factor, weighting, and metric** used in ValueLens AI to calculate migration economics from legacy middleware (such as SAP PI/PO) to SAP BTP Integration Suite.

Every metric in this guide is written in **plain, easy-to-understand English** (no confusing math code or formulas), followed by a **clear, realistic example with numbers** showing step-by-step arithmetic.

---

## Quick Table of Contents

1. [Current Platform TCO (What You Spend Today)](#1-current-platform-tco-what-you-spend-today)
2. [Target SAP BTP TCO (What You Will Spend in the Cloud)](#2-target-sap-btp-tco-what-you-will-spend-in-the-cloud)
3. [Migration Investment & Capital Allocation (One-Time Project Cost)](#3-migration-investment--capital-allocation-one-time-project-cost)
4. [Annual Operating Savings (Money Saved Every Year)](#4-annual-operating-savings-money-saved-every-year)
5. [Payback Period / Break-Even Horizon (Time to Recover Investment)](#5-payback-period--break-even-horizon-time-to-recover-investment)
6. [Multi-Year Cumulative Net Benefit (Total Cash Profit Generated)](#6-multi-year-cumulative-net-benefit-total-cash-profit-generated)
7. [Multi-Year Return on Investment (ROI %)](#7-multi-year-return-on-investment-roi-)
8. [Technical Complexity Scoring Model (0 to 100 Points)](#8-technical-complexity-scoring-model-0-to-100-points)
9. [Interactive Sensitivity Simulation (What-If Sliders)](#9-interactive-sensitivity-simulation-what-if-sliders)
10. [Data Quality & Audit Score (0 to 100 Points)](#10-data-quality--audit-score-0-to-100-points)
11. [Master Summary Sheet with One Big Example](#11-master-summary-sheet-with-one-big-example)

---

## 1. Current Platform TCO (What You Spend Today)

### What is it?
This is the **total annual operating cost** to keep your existing legacy integration platform (such as SAP PI/PO) running on-premise.

### The Plain-English Formula
```text
Total Current TCO = (Annual Licensing) + (Hardware & Datacenter) + (Vendor Support) + (Staff & Operations)
```

### Factors That Affect It & How Much They Contribute
Your current platform costs come from 4 major buckets:
1. **Licensing**: Perpetual software licenses, third-party adapters (like B2B or EDI adapters), dev/test environment software fees.
2. **Infrastructure**: Server hardware leases, disk storage, data backups, network bandwidth, datacenter rack space, power, and cooling.
3. **Support & Maintenance**: SAP annual maintenance contracts, third-party consultant retainers, bug-fix and patching costs.
4. **Operations & Staff**: Salaries of BASIS administrators, integration developers, DBA support staff, training, and custom code maintenance.

#### Weighting Formula for Each Cost Driver:
To find what percentage each category represents of your total spend:
```text
Category Weight (%) = (Category Cost divided by Total Current TCO) multiplied by 100
```

### Realistic Example
Imagine an enterprise with the following annual expenses for SAP PI/PO:
- **Licensing**: $125,000 / year
- **Hardware & Datacenter**: $65,000 / year
- **Support & Maintenance**: $85,000 / year
- **Staff & Operations**: $185,000 / year (Operations: $120,000 + Custom Dev: $45,000 + Overhead: $20,000)

**Step-by-step Calculation:**
```text
Total Current TCO = $125,000 + $65,000 + $85,000 + $185,000
Total Current TCO = $460,000 per year
```

**Cost Driver Percentages:**
- Licensing Weight: `($125,000 / $460,000) * 100 = 27.2%`
- Hardware Weight: `($65,000 / $460,000) * 100 = 14.1%`
- Support Weight: `($85,000 / $460,000) * 100 = 18.5%`
- Operations Weight: `($185,000 / $460,000) * 100 = 40.2%`

**Executive Takeaway:**
The enterprise spends **$460,000 every single year** just to keep the lights on with legacy middleware. Operations and licensing consume nearly 70% of this budget.

---

## 2. Target SAP BTP TCO (What You Will Spend in the Cloud)

### What is it?
This is the **annual cloud subscription cost** for SAP BTP Integration Suite, based on official SAP catalog pricing and your actual message throughput.

### The Plain-English Formula
```text
Total Target BTP TCO = (Base Edition Price) + (Extra Message Packs) + (Edge Integration Cell) + (Data Space Packs)
```

### Factors That Affect It & Pricing Rates
1. **SAP BTP Edition Base Price**:
   - **Standard Edition** (Recommended for 80% of enterprises): **$64,068 per year** ($5,339/month). Includes 1 tenant and 10,000 messages/month.
   - **Starter Edition**: **$20,736 per year** ($1,728/month). Small environments, up to 10 interfaces.
   - **Enhanced Edition**: **$92,256 per year** ($7,688/month). For high volumes (>500k messages) or Advanced Event Mesh.
   - **Premium Edition**: **$318,204 per year** ($26,517/month). Large multinational shared tenants.

2. **Additional Message Packs (Volume Sizing)**:
   - Each message pack gives you **10,000 additional messages per month**.
   - Price = **$84.00 per year** per pack ($7.00 per month).
   - How many packs you need:
     ```text
     Excess Messages = (Your Expected Monthly Messages) minus (Messages Included in Edition)
     Number of Packs = Excess Messages divided by 10,000 (rounded UP to nearest whole number)
     Extra Message Cost = Number of Packs multiplied by $84.00
     ```

3. **Edge Integration Cell (Private On-Premises Runtime)**:
   - For ground-to-ground security where integrations must stay behind your corporate firewall.
   - Price = **$41,460 per year** per private tenant ($3,455/month).

4. **Data Space Integration Packages**:
   - For specialized industry data exchange standards.
   - Price = **$900 per year** per package ($75/month).

### Realistic Example
An enterprise selects **Standard Edition** and expects to process **450,000 messages per month**:
1. Base Price for Standard Edition = **$64,068 / year** (includes 10,000 messages/month).
2. Excess Messages needed = `450,000 - 10,000 = 440,000 messages/month`.
3. Message packs needed = `440,000 / 10,000 = 44 packs`.
   *(If an enterprise adds a buffer for peak month spikes, say 59 packs)*:
   Message Pack Cost = `59 packs * $84 = $4,956 / year`.
4. No extra Edge Integration Cell or Data Space needed in this tier.

**Step-by-step Calculation:**
```text
Total Target BTP TCO = $64,068 (Base Edition) + $4,956 (Message Packs)
Total Target BTP TCO = $69,024 per year ($5,752 per month)
```

**Executive Takeaway:**
Your operating run-rate drops from **$460,000/year** down to just **$69,024/year** in the cloud.

---

## 3. Migration Investment & Capital Allocation (One-Time Project Cost)

### What is it?
The **one-time capital expense** to convert legacy interfaces, refactor mapping logic, test side-by-side payloads, set up cloud security, and cut over to production.

### The Plain-English Formula
```text
Total Migration Cost = Selected Incture Package Price + Any Special Custom Contingency
```

### Incture Package Options & Pricing
- **Starter Package**: **$19,000** (6 Weeks, up to 10 golden interfaces)
- **Silver Scope**: **$65,000** (12 Weeks / 3 Months, up to 50 interfaces)
- **Gold Scope**: **$110,000** (18 Weeks / 4.5 Months, up to 100 interfaces, heavy B2B/EDI)
- **Platinum Scope**: **$145,000** (24 Weeks / 6 Months, up to 150+ interfaces)

### How Migration Capital is Distributed (Standard Weights)
When Incture delivers a fixed-scope migration, the budget is allocated across 4 essential areas:
1. **Development & Conversion (60% weight)**: Automated interface conversion using IntSwitch, Groovy scripting, adapter migration.
2. **Quality Assurance & Testing (20% weight)**: Automated side-by-side payload comparison against production data.
3. **Architecture & BASIS Foundation (10% weight)**: SAP Cloud Connector setup, SSL certificates, SSO security, network configuration.
4. **Project Management & Hypercare (10% weight)**: Wave cutover management, rollback protection, 30-day post-launch support.

### Realistic Example
An enterprise selects the **Silver Scope Package** with a baseline investment of **$65,000**:
```text
Total Migration Investment = $65,000 (one-time)
```

**Breakdown of Where the $65,000 Goes:**
- Development (60%): `$65,000 * 0.60 = $39,000`
- Testing & QA (20%): `$65,000 * 0.20 = $13,000`
- Architecture & Security (10%): `$65,000 * 0.10 = $6,500`
- Governance & Hypercare (10%): `$65,000 * 0.10 = $6,500`
- **Total**: `$39,000 + $13,000 + $6,500 + $6,500 = $65,000`

---

## 4. Annual Operating Savings (Money Saved Every Year)

### What is it?
The **hard dollar cash savings** your company recovers every year by shutting down old servers and moving to BTP.

### The Plain-English Formulas
```text
Annual Dollar Savings = (Current Platform TCO) minus (Target SAP BTP TCO)
```
```text
Savings Percentage (%) = (Annual Dollar Savings divided by Current Platform TCO) multiplied by 100
```

### Realistic Example
- Current Platform TCO = **$460,000 / year**
- Target SAP BTP TCO = **$69,024 / year**

**Step-by-step Calculation:**
```text
Annual Dollar Savings = $460,000 - $69,024 = $390,976 saved per year
```
```text
Savings Percentage = ($390,976 / $460,000) * 100 = 84.99% (approximately 85.0% run-rate reduction)
```

**Executive Takeaway:**
Every single year, the IT budget frees up **$390,976** that was previously wasted on hardware depreciation, vendor maintenance, and server management. That is an **85% reduction** in recurring middleware cost!

---

## 5. Payback Period / Break-Even Horizon (Time to Recover Investment)

### What is it?
The exact number of months it takes for your annual savings to completely pay back your one-time migration cost.

### The Plain-English Formula
```text
Payback Months = (One-Time Migration Cost divided by Annual Dollar Savings) multiplied by 12 Months
```

### Realistic Example
- One-Time Migration Cost = **$65,000**
- Annual Dollar Savings = **$390,976 / year**

**Step-by-step Calculation:**
```text
Step 1: Divide Cost by Savings: $65,000 / $390,976 = 0.16625
Step 2: Multiply by 12 Months:  0.16625 * 12 = 1.995 Months (approximately 2.0 months!)
```

*(If the enterprise chooses the larger Gold Package at $110,000)*:
```text
Step 1: $110,000 / $390,976 = 0.28135
Step 2: 0.28135 * 12 = 3.38 Months (under 3.5 months!)
```

*(If using the conservative demo baseline with $120,976 annual savings)*:
```text
Step 1: $65,000 / $120,976 = 0.5373
Step 2: 0.5373 * 12 = 6.45 Months (approximately 6.5 months)
```

**Executive Takeaway:**
The entire migration project pays for itself in **under 2 to 6 months**! After that point, all savings go directly to positive cash flow.

---

## 6. Multi-Year Cumulative Net Benefit (Total Cash Profit Generated)

### What is it?
The **total cumulative profit** generated by the project over 1, 3, 5, and 10 years, after completely subtracting the initial migration expense.

### The Plain-English Formula
```text
Net Benefit for N Years = (Annual Savings multiplied by N Years) minus (One-Time Migration Cost)
```

### Realistic Example
Using **$390,976 annual savings** and **$65,000 migration cost**:

1. **Year 1 Net Benefit**:
   ```text
   ($390,976 * 1) - $65,000 = $390,976 - $65,000 = $325,976 profit in Year 1
   ```
2. **Year 3 Net Benefit**:
   ```text
   ($390,976 * 3) - $65,000 = $1,172,928 - $65,000 = $1,107,928 profit after 3 years
   ```
3. **Year 5 Net Benefit** (Standard Industry Horizon):
   ```text
   ($390,976 * 5) - $65,000 = $1,954,880 - $65,000 = $1,889,880 profit after 5 years
   ```
4. **Year 10 Net Benefit**:
   ```text
   ($390,976 * 10) - $65,000 = $3,909,760 - $65,000 = $3,844,760 profit after 10 years
   ```

**Executive Takeaway:**
Over a standard 5-year IT planning cycle, migrating to SAP BTP generates **almost $1.9 Million in pure net cash savings**!

---

## 7. Multi-Year Return on Investment (ROI %)

### What is it?
The **percentage return** on your migration investment. For every $1 invested in migration, how much profit is returned?

### The Plain-English Formula
```text
ROI (%) for N Years = (Net Benefit for N Years divided by One-Time Migration Cost) multiplied by 100
```
*Or equivalently:*
```text
ROI (%) = [ ((Annual Savings * N Years) - Migration Cost) / Migration Cost ] * 100
```

### Realistic Example
Using **$390,976 annual savings** and **$65,000 migration cost**:

1. **1-Year ROI**:
   ```text
   ($325,976 / $65,000) * 100 = 501.5% ROI
   ```
2. **3-Year ROI**:
   ```text
   ($1,107,928 / $65,000) * 100 = 1,704.5% ROI
   ```
3. **5-Year ROI** (Standard Benchmark):
   ```text
   ($1,889,880 / $65,000) * 100 = 2,907.5% ROI (or > 1,000%)
   ```

*(In conservative baseline scenarios with $120,976 savings and $65,000 cost)*:
```text
5-Year Savings = $120,976 * 5 = $604,880
5-Year Net Benefit = $604,880 - $65,000 = $539,880
5-Year ROI = ($539,880 / $65,000) * 100 = 830.58% ROI
```

**Executive Takeaway:**
Standard IT investments aim for 15% to 25% ROI. Delivering **over 800% to 2,900% ROI** makes this modernization project one of the highest-returning capital investments an enterprise can approve.

---

## 8. Technical Complexity Scoring Model (0 to 100 Points)

### What is it?
A weighted index that evaluates your technical landscape to predict transition difficulty, staffing needs, and testing scope.

### The Plain-English Formula
```text
Total Complexity Score = (Interface Count Pts) + (Complex Ratio Pts) + (Volume Pts) + (Custom Code Pts) + (Compliance Pts)
```

### The 5 Factors & Their Exact Point Weights

| Factor | Description | Measurement Criteria | Points Earned | Max Points |
|---|---|---|:---:|:---:|
| **1. Interface Count** | Total number of interfaces running on PI/PO | • Fewer than 100 interfaces<br>• 100 to 300 interfaces<br>• 301 to 800 interfaces<br>• More than 800 interfaces | 10 pts<br>20 pts<br>25 pts<br>30 pts | **30 pts** |
| **2. Complex Ratio** | Percentage of interfaces that use B2B/EDI | • Under 10%<br>• 10% to 25%<br>• 26% to 50%<br>• Over 50% | 5 pts<br>15 pts<br>20 pts<br>25 pts | **25 pts** |
| **3. Throughput Volume** | Monthly message traffic | • Under 50,000 msgs/month<br>• 50,000 to 250,000 msgs/month<br>• Over 250,000 msgs/month | 5 pts<br>10 pts<br>15 pts | **15 pts** |
| **4. Custom Development** | Presence of Java, XSLT, UDFs, ccBPM | • Low / Simple (standard maps only)<br>• Moderate (standard UDFs/Groovy)<br>• Heavy (Java maps, XSLT, ccBPM) | 5 pts<br>10 pts<br>15 pts | **15 pts** |
| **5. Regulatory Compliance** | Industry regulations | • Standard commercial<br>• Internal policies only<br>• Regulated (Banking, Pharma, Healthcare) | 5 pts<br>6 pts<br>10 pts | **10 pts** |

#### Complexity Tiers:
- **0 to 34 points**: **LOW Complexity** (Fast 1:1 conversion)
- **35 to 60 points**: **MEDIUM Complexity** (Standard automated migration)
- **61 to 80 points**: **HIGH Complexity** (Requires phased waves and Edge Integration Cell)
- **81 to 100 points**: **VERY HIGH Complexity** (Large-scale transformation)

### Realistic Example
An enterprise with:
- 120 total interfaces $\rightarrow$ **20 points**
- 35 B2B interfaces (`35 / 120 = 29.2%` complex ratio) $\rightarrow$ **20 points**
- 450,000 monthly messages (High volume) $\rightarrow$ **15 points**
- Uses Java mappings, XSLT, UDFs, and ccBPM workflows $\rightarrow$ **15 points**
- Standard manufacturing compliance $\rightarrow$ **5 points**

**Step-by-step Calculation:**
```text
Total Score = 20 + 20 + 15 + 15 + 5 = 75 Points
Classification = HIGH COMPLEXITY (75/100)
```

**Executive Takeaway:**
Because the landscape is scored at **75 (High Complexity)** due to Java and B2B/EDI interfaces, automated migration tools like IntSwitch and Edge Integration Cell are recommended to avoid manual coding delays.

---

## 9. Interactive Sensitivity Simulation (What-If Sliders)

### What is it?
In the **Sensitivity Simulation Tab**, executives can move 3 sliders to stress-test the project against unexpected risks or higher costs.

### The 3 Sliders & What They Do:
1. **Annual Savings Factor (Slider 1, range 0.50x to 1.50x)**:
   Simulates what happens if interface cutover is slower (e.g., 0.80x = 20% less savings) or faster (1.20x = 20% more savings).
2. **Migration Cost Factor (Slider 2, range 0.70x to 1.80x)**:
   Simulates what happens if the migration project experiences cost overruns (e.g., 1.35x = 35% cost overrun) or finishes under budget (0.85x).
3. **Target BTP Cost Factor (Slider 3, range 0.80x to 1.50x)**:
   Simulates what happens if message volume increases and requires more cloud capacity (e.g., 1.15x = 15% higher cloud fees).

### The Plain-English Simulation Formulas
```text
Simulated Target TCO = (Base Target BTP TCO) multiplied by (Slider 3 Factor)
Simulated Migration Cost = (Base Migration Cost) multiplied by (Slider 2 Factor)
Simulated Base Savings = (Base Current TCO) minus (Simulated Target TCO)
Simulated Annual Savings = (Simulated Base Savings) multiplied by (Slider 1 Factor)
Simulated Payback Months = (Simulated Migration Cost divided by Simulated Annual Savings) multiplied by 12
Simulated 5-Year Net Benefit = (Simulated Annual Savings multiplied by 5) minus (Simulated Migration Cost)
Simulated 5-Year ROI (%) = (Simulated 5-Year Net Benefit divided by Simulated Migration Cost) multiplied by 100
```

### Realistic Example (Stress-Testing a 35% Cost Overrun)
Suppose an executive tests a **pessimistic worst-case scenario**:
- Base Migration Cost = $65,000
- Base Current TCO = $460,000
- Base Target BTP TCO = $69,024
- **Slider 2 (Migration Cost Factor)** set to **1.35x** (+35% overrun)
- **Slider 1 (Savings Factor)** set to **1.00x** (normal)
- **Slider 3 (Target BTP Factor)** set to **1.00x** (normal)

**Step-by-step Calculation:**
```text
Step 1: Calculate New Migration Cost:  $65,000 * 1.35 = $87,750 (cost increased by $22,750)
Step 2: Annual Savings:                $460,000 - $69,024 = $390,976 / year
Step 3: New Payback Period:            ($87,750 / $390,976) * 12 = 2.69 Months
Step 4: New 5-Year Net Benefit:        ($390,976 * 5) - $87,750 = $1,954,880 - $87,750 = $1,867,130
Step 5: New 5-Year ROI:                ($1,867,130 / $87,750) * 100 = 2,127.8% ROI
```

**Executive Takeaway:**
Even if the migration suffers a **massive 35% cost overrun**, the project still pays for itself in **less than 2.7 months** and still delivers over **2,100% 5-year ROI**! This proves the business case is practically bulletproof.

---

## 10. Data Quality & Audit Score (0 to 100 Points)

### What is it?
A real-time trustworthiness index that checks if your entered numbers are complete, logically consistent, and based on realistic contracts.

### The 4 Quality Components & Weights:
1. **Completeness (40% Weight - up to 40 points)**:
   Checks if all mandatory fields are filled:
   - Current TCO entered (+25 pts)
   - Target TCO entered (+25 pts)
   - Migration cost entered (+25 pts)
   - Company profile filled (+10 pts)
   - Landscape details filled (+10 pts)
   - Volumetrics filled (+5 pts)
   *(Capped at 100 points, then multiplied by 0.40)*
2. **Consistency (30% Weight - up to 30 points)**:
   Verifies that line items correctly add up to category subtotals. Deducts 20 points for every mathematical inconsistency.
3. **Financial Validation (20% Weight - up to 20 points)**:
   Checks if the target architecture produces positive annual savings (`Target TCO < Current TCO`). If target cost exceeds old cost, deducts 30 points.
4. **Estimation Accuracy (10% Weight - up to 10 points)**:
   Gives 100 points if numbers are based on verified contracts/vendor quotes; 70 points if marked as rough user estimates.

#### Overall Score Formula:
```text
Overall Quality Score = (Completeness * 0.40) + (Consistency * 0.30) + (Validation * 0.20) + (Estimation * 0.10)
```
- **85 to 100 points**: **HIGH Quality** (Board-ready, fully auditable)
- **60 to 84 points**: **MEDIUM Quality** (Solid estimate, some secondary fields estimated)
- **Below 60 points**: **LOW Quality** (Missing data or mathematical discrepancies)

---

## 11. Master Summary Sheet with One Big Example

Below is the complete end-to-end calculation for an enterprise (**Apex Global Manufacturing Inc.**):

| # | Step / Metric Name | Formula in Plain English | Entered or Calculated Numbers | Final Result |
|---|---|---|---|:---:|
| **1** | **Current Platform TCO** | Add: Licensing + Hardware + Support + Operations | `$125,000 + $65,000 + $85,000 + $185,000` | **`$460,000 / yr`** |
| **2** | **Target SAP BTP TCO** | Base Edition ($64,068) + 59 Message Packs ($4,956) | `$64,068 + $4,956` | **`$69,024 / yr`** |
| **3** | **Annual Operating Savings** | Current TCO minus Target BTP TCO | `$460,000 - $69,024` | **`$390,976 / yr`** |
| **4** | **Savings Percentage** | (Annual Savings divided by Current TCO) * 100 | `($390,976 / $460,000) * 100` | **`~85.0% Reduction`** |
| **5** | **Migration Investment** | Selected Incture Migration Package (Silver Scope) | `$65,000` fixed project price | **`$65,000 One-Time`** |
| **6** | **Payback Period** | (Migration Investment / Annual Savings) * 12 | `($65,000 / $390,976) * 12` | **`2.0 Months`** |
| **7** | **1-Year Net Benefit** | (Annual Savings * 1) minus Migration Investment | `($390,976 * 1) - $65,000` | **`$325,976 Profit`** |
| **8** | **5-Year Cumulative Savings**| Annual Savings multiplied by 5 Years | `$390,976 * 5` | **`$1,954,880 Total`** |
| **9** | **5-Year Net Benefit** | 5-Year Cumulative Savings minus Migration Investment | `$1,954,880 - $65,000` | **`$1,889,880 Net Cash`** |
| **10**| **5-Year Cumulative ROI** | (5-Year Net Benefit / Migration Investment) * 100 | `($1,889,880 / $65,000) * 100` | **`2,907.5% ROI`** |
| **11**| **Complexity Score** | Interface Pts + Ratio Pts + Volume Pts + Code Pts + Compliance | `20 + 20 + 15 + 15 + 5` | **`75 / 100 (High)`** |
| **12**| **Simulated 35% Overrun**| Payback under $87,750 migration cost | `($87,750 / $390,976) * 12` | **`2.69 Months`** |

---

## Summary for Presentation to Executives

When presenting these numbers to a CFO, CIO, or Board of Directors, summarize the business case in three clear bullets:

1. **Massive Run-Rate Reduction**: Moving off legacy SAP PI/PO slashes annual integration operating costs by **~85%**, cutting spend from **$460,000/year to $69,024/year**.
2. **Lightning-Fast Capital Recovery**: The one-time transition investment of **$65,000** pays for itself in **just 2.0 months** (or under 3.5 months with larger Gold Scope).
3. **Enormous Multi-Year Return**: Over 5 years, the organization pockets **$1.89 Million in net cash benefit**, achieving a **>1,000% ROI** that remains resilient even under severe cost overruns.
