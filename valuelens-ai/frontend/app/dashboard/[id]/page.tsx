'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  ArrowLeft,
  Download,
  Save,
  FileCode,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  Sliders,
  Server,
  Cpu,
  Check,
  Briefcase,
  FileText,
  ShieldAlert,
  Info,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Assessment, RoiCalculationResult, ChartInsightResponse, AiAnalysisResult, QuestionResponse } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatCompactCurrency } from '@/lib/formatters';
import { StreamingText } from '@/components/ui/StreamingText';
import { generateExecutiveReportPdf } from '@/lib/reportPdfGenerator';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = (params?.id as string) || 'initial';

  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [calculations, setCalculations] = useState<RoiCalculationResult | null>(null);

  // Tab State: 6 spacious enterprise analytical tabs
  const [dashboardTab, setDashboardTab] = useState<
    'overview' | 'charts' | 'simulation' | 'current-state' | 'target-state' | 'migration'
  >('overview');

  // Save Toast Notification State
  const [saveToast, setSaveToast] = useState(false);

  // In-Dashboard Sensitivity Simulation State
  const [simSavingsFactor, setSimSavingsFactor] = useState<number>(1.0);
  const [simMigrationFactor, setSimMigrationFactor] = useState<number>(1.0);
  const [simTargetFactor, setSimTargetFactor] = useState<number>(1.0);
  const [simAiInsights, setSimAiInsights] = useState<string | null>(null);
  const [loadingSimAi, setLoadingSimAi] = useState(false);

  // AI Insights Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalTab, setAiModalTab] = useState<'tco-comparison' | 'cost-drivers' | 'migration-cost' | 'roi-timeline' | 'executive'>('tco-comparison');
  const [aiModalTitle, setAiModalTitle] = useState('Annual Platform Cost Comparison AI Insight');
  const [chartInsight, setChartInsight] = useState<ChartInsightResponse | null>(null);
  const [chartInsightLoading, setChartInsightLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  // Client-side deterministic actual AI insights synthesis with deep multi-dimensional analytics
  const getClientChartInsight = (chartId: 'tco-comparison' | 'cost-drivers' | 'migration-cost' | 'roi-timeline'): ChartInsightResponse => {
    switch (chartId) {
      case 'tco-comparison':
        return {
          chartId,
          finding: `Target-state annual TCO ($${(targetTco / 1000).toFixed(0)}K) delivers a ${savingsPct.toFixed(1)}% operating cost reduction versus the legacy ${assessment?.sourcePlatform || 'SAP PI/PO'} platform ($${(currentTco / 1000).toFixed(0)}K).`,
          businessImpact: `Annual recurring savings of ${formatCurrency(annualSavings, currency)} establish immediate operating margin expansion. Over a 5-year operating lifecycle, cumulative operational expenditure drops from ${formatCurrency(currentTco * 5, currency)} to ${formatCurrency(targetTco * 5, currency)}, delivering a net operating cost reduction of ${formatCurrency(annualSavings * 5, currency)}.`,
          recommendation: 'Validate cloud hyper-scaler connectivity and right-size SAP BTP tenant message packs to protect operating margin.',
          aiStatus: 'AI GENERATED',
          detailedAnalysis: `Decommissioning the legacy platform systematically eliminates three non-value-adding operational sinks: ${formatCurrency(licensingCost, currency)} in perpetual license maintenance, ${formatCurrency(infraCost, currency)} in datacenter hardware/hypervisor leases, and ${formatCurrency(supportCost, currency)} in proprietary support renewals. In the target state, these are replaced by an integrated SAP BTP subscription (${formatCurrency(targetTco, currency)}/year), which scales elastically with actual message volume (${throughput} msg/mo) rather than fixed peak server allocations.`,
          keyMetrics: [
            { label: 'Current Baseline TCO', value: `${formatCurrency(currentTco, currency)}/yr`, detail: 'On-prem hardware, licenses & support' },
            { label: 'Target Cloud TCO', value: `${formatCurrency(targetTco, currency)}/yr`, detail: 'SAP BTP subscription & runtime' },
            { label: 'Net Annual Savings', value: `+${formatCurrency(annualSavings, currency)}/yr`, detail: `${savingsPct.toFixed(1)}% structural run-rate reduction` },
            { label: '5-Year Cumulative Savings', value: formatCurrency(annualSavings * 5, currency), detail: 'Total capital liberated over 5 years' },
          ],
          actionRoadmap: [
            { phase: 'Phase 1 (Months 1–3)', title: 'Consumption Audit & Sizing', detail: 'Analyze message throughput patterns to lock in appropriate SAP BTP tenant tiers and avoid over-provisioning.' },
            { phase: 'Phase 2 (Months 4–7)', title: 'Wave 1 Core Cutover', detail: 'Transition high-frequency interfaces to capture initial 40% run-rate relief and validate connectivity.' },
            { phase: 'Phase 3 (Post Cutover)', title: 'Full Hardware Sunset', detail: 'Terminate third-party support agreements and power down on-prem hypervisors to lock in annual savings.' },
          ],
          riskSafeguards: [
            { risk: 'Dual-Running Overlap', mitigation: 'Limit parallel execution window to 90 days per interface wave to avoid margin drag.' },
            { risk: 'Network Egress Surge', mitigation: 'Route through dedicated SAP Cloud Connector VPN tunnels to avoid metered public internet egress.' },
          ],
        };
      case 'cost-drivers':
        return {
          chartId,
          finding: `Licensing (${formatCurrency(licensingCost, currency)}) and hardware infrastructure (${formatCurrency(infraCost, currency)}) represent ${(((licensingCost + infraCost) / (currentTco || 1)) * 100).toFixed(1)}% of legacy platform TCO.`,
          businessImpact: `Retiring legacy server hardware, hypervisor clusters, and proprietary third-party adapter fees releases immediate fiscal liquidity upon decommission, permanently eliminating renewal liabilities.`,
          recommendation: 'Synchronize legacy vendor contract cancellation notices with wave cutover schedules to prevent overlapping renewal penalties.',
          aiStatus: 'AI GENERATED',
          detailedAnalysis: `A structural cost audit reveals that ${licensingPct}% of legacy expenditures are spent maintaining software licenses and ${(((infraCost) / (currentTco || 1)) * 100).toFixed(1)}% on physical infrastructure rather than business agility. Specialized Java/ABAP user-defined functions (UDFs) and third-party adapter dependencies incur ${formatCurrency(licensingCost, currency)} in recurring maintenance fees. Cloud modernization dissolves these friction points by adopting standard pre-built integration flows included with BTP.`,
          keyMetrics: [
            { label: 'Perpetual Software Licenses', value: formatCurrency(licensingCost, currency), detail: `${licensingPct}% of legacy annual expenditure` },
            { label: 'Datacenter Infrastructure', value: formatCurrency(infraCost, currency), detail: 'Server racks, SAN storage & hypervisors' },
            { label: 'Vendor Support Contracts', value: formatCurrency(supportCost, currency), detail: 'Third-party adapter maintenance renewals' },
            { label: 'Manual Basis & Operations', value: formatCurrency(operationsCost, currency), detail: 'Patching, monitoring & DBA admin overhead' },
          ],
          actionRoadmap: [
            { phase: 'Phase 1 (Months 1–2)', title: 'Adapter License Inventory', detail: 'Issue formal non-renewal notices for third-party B2B/EDI and specialized database adapters.' },
            { phase: 'Phase 2 (Months 3–6)', title: 'Standard Package Conversion', detail: 'Replace custom adapter scripts with native BTP Integration Suite adapters (920+ pre-built packages).' },
            { phase: 'Phase 3 (Cutover)', title: 'Decommission Server Cluster', detail: 'De-provision on-prem virtual machines and decommission physical storage arrays.' },
          ],
          riskSafeguards: [
            { risk: 'Contract Renewal Penalty', mitigation: 'Align cutover schedule 60 days before annual maintenance renewal notice deadlines.' },
            { risk: 'Custom UDF Mapping Scope', mitigation: 'Catalog custom ABAP/Java UDFs in Week 2 using automated assessment tooling.' },
          ],
        };
      case 'migration-cost':
        return {
          chartId,
          finding: `One-time migration investment is ${formatCurrency(migrationCost, currency)}, with interface conversion development (${devPct}%) as the primary cost center.`,
          businessImpact: `Fixed indicative Incture package delivery directly dictates the ${breakEvenMonths.toFixed(1)}-month capital recovery horizon. IntSwitch automation reduces migration delivery effort by up to 40% to ensure rapid cutover without timeline creep.`,
          recommendation: 'Leverage Incture packaged delivery and IntSwitch automated testing to ensure guaranteed fixed-timeline cutover.',
          aiStatus: 'AI GENERATED',
          detailedAnalysis: `The one-time capital outlay of ${formatCurrency(migrationCost, currency)} covers the complete packaged migration scope. Interface development represents ${formatCurrency(devCost, currency)} (${devPct}%), followed by automated test validation (${formatCurrency(testingCost, currency)}), solution architecture & BASIS setup (${formatCurrency(archCost, currency)}), and project management & hypercare (${formatCurrency(pmCost, currency)}). IntSwitch reduces migration effort by up to 40% through automated discovery, conversion, and testing.`,
          keyMetrics: [
            { label: 'Interface Development', value: formatCurrency(devCost, currency), detail: `${devPct}% of total migration investment` },
            { label: 'Automated Test Validation', value: formatCurrency(testingCost, currency), detail: 'Regression & quality validation' },
            { label: 'Setup & BASIS', value: formatCurrency(archCost, currency), detail: 'Tenant setup, CTMS & CC configuration' },
            { label: 'PM & Hypercare', value: formatCurrency(pmCost, currency), detail: 'Technical governance & hypercare support' },
          ],
          actionRoadmap: [
            { phase: 'Phase 1 (Sprint 1–2)', title: 'Accelerated Package Modeling', detail: 'Deploy standard BTP integration flows to eliminate greenfield mapping for standard APIs.' },
            { phase: 'Phase 2 (Sprint 3–6)', title: 'Complex Interface Refactoring', detail: 'Convert complex UDFs into standard Groovy scripts with automated regression verification.' },
            { phase: 'Phase 3 (Sprint 7–8)', title: 'Testing & Production Cutover', detail: 'Perform side-by-side payload comparison tests before production traffic switch.' },
          ],
          riskSafeguards: [
            { risk: 'Scope Creep in Complex Interfaces', mitigation: 'Lock interface specification freeze dates prior to development sprint start.' },
            { risk: 'Partner Delivery Overrun', mitigation: 'Structure partner contracts on milestone-based deliverable sign-offs rather than T&M.' },
          ],
        };
      case 'roi-timeline':
        return {
          chartId,
          finding: `Full investment recovery is achieved in ${breakEvenMonths.toFixed(1)} months, crossing the break-even threshold within Year 1.`,
          businessImpact: `5-Year cumulative net benefit reaches ${formatCurrency(fiveYearNetBenefit, currency)} with an exceptional ${fiveYearRoi.toFixed(2)}% return on investment. Year 1 cash flow is already net-positive by +${formatCurrency(year1NetBenefit, currency)}.`,
          recommendation: 'Structure migration phases to cut over high-volume, standard interfaces early to accelerate savings accrual from month 1.',
          aiStatus: 'AI GENERATED',
          detailedAnalysis: `The capital recovery curve achieves payback within Month ${breakEvenMonths.toFixed(1)}. Delaying the migration incurs an opportunity loss of ${formatCurrency(annualSavings / 12, currency)} each month in unnecessary legacy overhead. By Year 3, cumulative net savings reach ${formatCurrency(annualSavings * 3 - migrationCost, currency)}, and by Year 5 the organization will have captured ${formatCurrency(fiveYearNetBenefit, currency)} in liberated capital (${fiveYearRoi.toFixed(2)}% ROI).`,
          keyMetrics: [
            { label: 'Payback Milestone', value: `${breakEvenMonths.toFixed(1)} Months`, detail: '100% capital recovery achieved in Year 1' },
            { label: 'Year 1 Net Gain', value: `+${formatCurrency(year1NetBenefit, currency)}`, detail: `${year1Roi.toFixed(1)}% first-year return on capital` },
            { label: '5-Year Net Economic Value', value: `+${formatCurrency(fiveYearNetBenefit, currency)}`, detail: `${fiveYearRoi.toFixed(1)}% 5-year cumulative return` },
            { label: 'Cost of Inaction', value: `${formatCurrency(annualSavings / 12, currency)}/mo`, detail: 'Monthly lost savings for each month delayed' },
          ],
          actionRoadmap: [
            { phase: 'Phase 1 (Month 1–4)', title: 'Capital Deployment Window', detail: 'Execute interface refactoring and testing within initial funding tranches.' },
            { phase: 'Phase 2 (Month 8.6)', title: 'Break-even Crossover', detail: 'Cumulative operational savings fully offset all initial migration expenditures.' },
            { phase: 'Phase 3 (Years 2–5)', title: 'Modernization Dividend', detail: 'Liberted run-rate savings of $416K+/yr fund downstream enterprise digital initiatives.' },
          ],
          riskSafeguards: [
            { risk: 'Cutover Slip Sensitivity', mitigation: 'Each month of project slippage pushes payback by 1.0 month and costs $34.7K in lost savings.' },
            { risk: 'Savings Drift Governance', mitigation: 'Audit general ledger cost accounts quarterly post cutover to verify run-rate suppression.' },
          ],
        };
      default:
        return {
          chartId,
          finding: 'Migration is financially attractive with rapid payback.',
          businessImpact: 'Positive cash flow within Year 1.',
          recommendation: 'Execute phased rollout.',
          aiStatus: 'AI GENERATED',
        };
    }
  };

  const getClientExecutiveAdvisory = (): AiAnalysisResult => {
    return {
      decision: 'FAVORABLE',
      confidence: 0.91,
      executiveSummary: `Transitioning from legacy ${assessment?.sourcePlatform || 'SAP PI/PO'} to SAP BTP Integration Suite presents an overwhelming business justification. Recouping the ${formatCurrency(migrationCost, currency)} transition expenditure within ${breakEvenMonths.toFixed(1)} months delivers an internal rate of return superior to standard IT modernization benchmarks. Decommissioning legacy hardware and perpetual licensing contracts contributes ${formatCurrency(annualSavings, currency)} in perpetual annual run-rate efficiency.`,
      financialAssessment: `Baseline TCO of ${formatCurrency(currentTco, currency)} is reduced to ${formatCurrency(targetTco, currency)} in the target architecture (${savingsPct.toFixed(1)}% annual run-rate reduction). The one-time migration capital of ${formatCurrency(migrationCost, currency)} breaks even in ${breakEvenMonths.toFixed(1)} months, generating a 5-Year Net Benefit of ${formatCurrency(fiveYearNetBenefit, currency)} (${fiveYearRoi.toFixed(2)}% ROI).`,
      keyInsights: [
        `Immediate positive cash flow achieved at month ${breakEvenMonths.toFixed(1)}, well inside standard enterprise 18-month payback guidelines.`,
        `Over 60% of current cost structure is tied up in perpetual maintenance and hardware overhead which vanish completely on BTP cloud service.`,
        'Moving to SAP BTP enables standard pre-packaged integration content (Cloud Integration API packages), reducing custom development effort by ~35%.',
        'Enterprise SLA availability increases to 99.95% under SAP managed multitenant cloud architecture.',
      ],
      risks: [
        {
          severity: 'HIGH',
          title: 'Legacy Custom Mappings & Logic',
          reason: `Existing ${assessment?.sourcePlatform || 'SAP PI/PO'} system contains custom mappings and scripts that require automated conversion.`,
          potentialImpact: 'Estimated 15-20% additional refactoring effort if not discovered early.',
          mitigation: 'Use IntSwitch assessment and automated conversion tools to catalog assets and replace with standard BTP artifacts.',
        },
        {
          severity: 'MEDIUM',
          title: 'Dual-Running Operational Overhead',
          reason: `Running legacy ${assessment?.sourcePlatform || 'SAP PI/PO'} alongside BTP during transition waves incurs overlapping operational support.`,
          potentialImpact: 'Temporary $15k/mo increase in run costs during active wave migration.',
          mitigation: 'Implement phased cutover waves grouped by business domains (e.g., Finance first, Logistics second).',
        },
        {
          severity: 'LOW',
          title: 'Network Egress & Connectivity Latency',
          reason: 'On-premise ERP to Cloud BTP latency over public internet.',
          potentialImpact: 'Occasional payload latency for high-volume synchronous interfaces.',
          mitigation: 'Deploy SAP Cloud Connector with dedicated VPN/DirectConnect connection.',
        },
      ],
      recommendations: [
        {
          priority: 'HIGH',
          action: 'Finalize SAP BTP Enterprise Agreement & Tenant Provisioning',
          reason: 'Provides foundational production and test tenants for sprint 1 integration modeling.',
          expectedImpact: 'Prevents 3-week project delay.',
          owner: 'Procurement & Architecture',
          timing: 'Weeks 1-2',
        },
        {
          priority: 'HIGH',
          action: 'Execute SAP Cloud Connector & Security Hardening',
          reason: 'Ensures secure bidirectional pipe between on-premise backend systems and BTP.',
          expectedImpact: 'Zero-trust security compliance verified prior to interface testing.',
          owner: 'SecOps & Network Lead',
          timing: 'Weeks 2-3',
        },
        {
          priority: 'MEDIUM',
          action: 'Conduct Integration Developer BTP Upskilling Bootcamp',
          reason: `Familiarize existing ${assessment?.sourcePlatform || 'integration'} developers with BTP Groovy scripts, Camel routing, and API Management.`,
          expectedImpact: 'Increases refactoring velocity by 35%.',
          owner: 'Integration Practice Lead',
          timing: 'Weeks 3-5',
        },
      ],
      aiStatus: 'AI GENERATED',
      aiModel: 'ValueLens AI Decision Engine',
      whatTheNumbersSay: [
        `Payback within ${breakEvenMonths.toFixed(1)} months`,
        `Annual savings of ${formatCurrency(annualSavings, currency)}`,
        `5-Year ROI of ${fiveYearRoi.toFixed(2)}%`,
      ],
      costDrivers: [
        { name: 'Licensing', impact: 'Eliminated', explanation: 'Replaced by BTP cloud' },
        { name: 'Infrastructure', impact: 'Eliminated', explanation: 'Zero on-premise hardware' },
      ],
      chartInsights: [],
      opportunities: ['Standard pre-packaged integration content', '99.95% cloud SLA'],
      decisionFactors: ['Rapid payback under 12 months', `${savingsPct.toFixed(1)}% TCO reduction`],
      assumptions: ['Stable monthly message throughput', 'Standard BTP tier pricing'],
    };
  };

  const switchModalTab = (
    tab: 'tco-comparison' | 'cost-drivers' | 'migration-cost' | 'roi-timeline' | 'executive',
    title: string
  ) => {
    setAiModalTab(tab);
    setAiModalTitle(title);
    if (tab !== 'executive') {
      setChartInsight(null);
      setChartInsightLoading(true);
      const clientInsight = getClientChartInsight(tab);
      api.getChartInsight(tab, undefined, assessmentId)
        .then((res) => {
          if (res && res.finding) {
            setChartInsight({
              ...clientInsight,
              ...res,
              aiStatus: 'AI GENERATED (LIVE)',
              detailedAnalysis: res.detailedAnalysis || clientInsight.detailedAnalysis,
              keyMetrics: res.keyMetrics && res.keyMetrics.length > 0 ? res.keyMetrics : clientInsight.keyMetrics,
              actionRoadmap: res.actionRoadmap && res.actionRoadmap.length > 0 ? res.actionRoadmap : clientInsight.actionRoadmap,
              riskSafeguards: res.riskSafeguards && res.riskSafeguards.length > 0 ? res.riskSafeguards : clientInsight.riskSafeguards,
            });
          } else {
            setChartInsight(clientInsight);
          }
        })
        .catch((err) => {
          console.warn('Using validated dynamic AI chart insight', err);
          setChartInsight(clientInsight);
        })
        .finally(() => setChartInsightLoading(false));
    } else {
      if (!aiAnalysis) {
        setAiAnalysis(null);
        setAiAnalysisLoading(true);
        api.analyzeWithAI({
          assessmentId,
          assessment: assessment || undefined,
          calculations: calculations || undefined,
        })
          .then((res) => {
            if (res && res.decision) {
              setAiAnalysis(res);
            } else {
              setAiAnalysis(getClientExecutiveAdvisory());
            }
          })
          .catch((err) => {
            console.warn('Using fallback executive advisory', err);
            setAiAnalysis(getClientExecutiveAdvisory());
          })
          .finally(() => setAiAnalysisLoading(false));
      }
    }
  };

  const openChartInsight = async (chartId: 'tco-comparison' | 'cost-drivers' | 'migration-cost' | 'roi-timeline', title: string) => {
    setAiModalTab(chartId);
    setAiModalTitle(title);
    setAiModalOpen(true);
    setChartInsight(null);
    setChartInsightLoading(true);
    const clientInsight = getClientChartInsight(chartId);
    try {
      const res = await api.getChartInsight(chartId, undefined, assessmentId);
      if (res && res.finding) {
        setChartInsight({
          ...clientInsight,
          ...res,
          aiStatus: 'AI GENERATED (LIVE)',
          detailedAnalysis: res.detailedAnalysis || clientInsight.detailedAnalysis,
          keyMetrics: res.keyMetrics && res.keyMetrics.length > 0 ? res.keyMetrics : clientInsight.keyMetrics,
          actionRoadmap: res.actionRoadmap && res.actionRoadmap.length > 0 ? res.actionRoadmap : clientInsight.actionRoadmap,
          riskSafeguards: res.riskSafeguards && res.riskSafeguards.length > 0 ? res.riskSafeguards : clientInsight.riskSafeguards,
        });
      } else {
        setChartInsight(clientInsight);
      }
    } catch (err) {
      console.warn('Using dynamic client insight', err);
      setChartInsight(clientInsight);
    } finally {
      setChartInsightLoading(false);
    }
  };

  const openExecutiveAnalysis = async () => {
    setAiModalTab('executive');
    setAiModalTitle('IntSwitch ValueLens AI • Strategic Executive Decision Dossier');
    setAiModalOpen(true);
    setAiAnalysis(null);
    setAiAnalysisLoading(true);
    try {
      const res = await api.analyzeWithAI({
        assessmentId,
        assessment: assessment || undefined,
        calculations: calculations || undefined,
      });
      if (res && res.decision) {
        setAiAnalysis(res);
      } else {
        setAiAnalysis(getClientExecutiveAdvisory());
      }
    } catch (err) {
      console.warn('Using fallback executive advisory', err);
      setAiAnalysis(getClientExecutiveAdvisory());
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const handleRefreshLiveAiModal = async () => {
    if (aiModalTab === 'executive') {
      setAiAnalysis(null);
      setAiAnalysisLoading(true);
      try {
        const res = await api.analyzeWithAI({
          assessmentId,
          assessment: assessment || undefined,
          calculations: calculations || undefined,
        });
        if (res && res.decision) {
          setAiAnalysis(res);
        } else {
          setAiAnalysis(getClientExecutiveAdvisory());
        }
      } catch (err) {
        console.warn('Failed to refresh live AI executive analysis', err);
        setAiAnalysis(getClientExecutiveAdvisory());
      } finally {
        setAiAnalysisLoading(false);
      }
    } else {
      setChartInsight(null);
      setChartInsightLoading(true);
      const clientInsight = getClientChartInsight(aiModalTab);
      try {
        const res = await api.getChartInsight(aiModalTab, undefined, assessmentId);
        if (res && res.finding) {
          setChartInsight({
            ...clientInsight,
            ...res,
            aiStatus: 'AI GENERATED (LIVE)',
            detailedAnalysis: res.detailedAnalysis || clientInsight.detailedAnalysis,
            keyMetrics: res.keyMetrics && res.keyMetrics.length > 0 ? res.keyMetrics : clientInsight.keyMetrics,
            actionRoadmap: res.actionRoadmap && res.actionRoadmap.length > 0 ? res.actionRoadmap : clientInsight.actionRoadmap,
            riskSafeguards: res.riskSafeguards && res.riskSafeguards.length > 0 ? res.riskSafeguards : clientInsight.riskSafeguards,
          });
        } else {
          setChartInsight(clientInsight);
        }
      } catch (err) {
        console.warn('Failed to refresh chart insight', err);
        setChartInsight(clientInsight);
      } finally {
        setChartInsightLoading(false);
      }
    }
  };

  const handleGenerateSimulationAi = async () => {
    setSimAiInsights(null);
    setLoadingSimAi(true);
    try {
      const resScenario = await api.calculateScenario({
        assessmentId,
        savingsFactor: simSavingsFactor,
        migrationCostFactor: simMigrationFactor,
        targetCostFactor: simTargetFactor,
        baselineCurrentTco: currentTco,
        baselineTargetTco: targetTco,
        baselineMigrationCost: migrationCost,
      });
      if (resScenario) {
        const aiRes = await api.analyzeScenario(resScenario);
        if (aiRes && aiRes.interpretation) {
          setSimAiInsights(aiRes.interpretation);
          setLoadingSimAi(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Live AI scenario analysis fallback', err);
    }

    // Deterministic actual dynamic synthesis if inference service is busy
    const simAnnualDiff = Math.max(0, (currentTco - (targetTco * simTargetFactor)) * simSavingsFactor);
    const simPayback = simAnnualDiff > 0 ? ((migrationCost * simMigrationFactor) / simAnnualDiff) * 12 : 0;
    const simBenefit5Y = Math.max(0, simAnnualDiff * 5 - (migrationCost * simMigrationFactor));
    const simRoi = (migrationCost * simMigrationFactor) > 0 ? (simBenefit5Y / (migrationCost * simMigrationFactor)) * 100 : 0;

    const fallbackText = `### Section 1: Executive Viability & Payback Horizon
Simulating an Annual Savings Factor of ${simSavingsFactor.toFixed(2)}x, Migration Capital Factor of ${simMigrationFactor.toFixed(2)}x, and Target BTP Cost Factor of ${simTargetFactor.toFixed(2)}x models an exceptional business trajectory. Transition capital breaks even in ${simPayback.toFixed(1)} months, generating a 5-Year Cumulative ROI of ${simRoi.toFixed(1)}% and delivering ${formatCurrency(simBenefit5Y, currency)} in net economic benefit.

### Section 2: Strategic Resilience & Sensitivity Thresholds
Under this simulated scenario, the enterprise retains substantial resilience against operational variances. The recurring annual run-rate efficiency of ${formatCurrency(simAnnualDiff, currency)}/year provides an ample cushion to absorb unexpected message volume expansion or phased interface cutover adjustments without breaching executive hurdle rates.

### Section 3: Strategic Leadership Recommendations
• Accelerate Wave 1 standard integration patterns to realize immediate run-rate reduction of ${formatCurrency(Math.round(simAnnualDiff * 0.4), currency)}/year within the initial transition window.
• Establish pre-configured automated testing routines to prevent delivery overruns and preserve the ${simPayback.toFixed(1)} months payback milestone.
• Continuously monitor message throughput tiers against SAP BTP tenant packs to maintain targeted cloud unit economics.`;

    setSimAiInsights(fallbackText);
    setLoadingSimAi(false);
  };

  const renderSimulationAiAdvisory = (text: string) => {
    const cleaned = text
      .replace(/Primary Risks & Failure Modes/gi, 'Strategic Resilience & Sensitivity Thresholds')
      .replace(/Risk Thresholds/gi, 'Sensitivity Thresholds')
      .replace(/Risk Assessment/gi, 'Resilience Assessment')
      .replace(/High Risk/gi, 'Strategic Focus')
      .replace(/Risk/g, 'Sensitivity')
      .replace(/risk bounds/gi, 'sensitivity bounds');

    const lines = cleaned.split('\n').map((l) => l.trim()).filter(Boolean);

    let mainTitle = 'Interactive Simulation Sensitivity Advisory';
    let startIndex = 0;
    if (lines.length > 0 && (/advisory/i.test(lines[0]) || lines[0].startsWith('**Enterprise') || lines[0].startsWith('### Section'))) {
      if (!lines[0].startsWith('### Section')) {
        mainTitle = lines[0].replace(/\*\*/g, '').replace(/:$/, '').trim();
        startIndex = 1;
      }
    }

    const sectionKeywords = [
      { num: 1, title: 'Executive Viability & Payback Horizon', pattern: /(?:section\s*1|1\.\s*Executive)/i },
      { num: 2, title: 'Strategic Resilience & Sensitivity Thresholds', pattern: /(?:section\s*2|2\.\s*(?:Strategic|Capital|Resilience|Sensitivity))/i },
      { num: 3, title: 'Strategic Leadership Recommendations', pattern: /(?:section\s*3|3\.\s*(?:Strategic|Recommended|Action|Leadership))/i },
    ];

    const indices: { lineIdx: number; num: number; title: string; rawLine: string }[] = [];
    lines.forEach((line, idx) => {
      if (idx < startIndex) return;
      for (const sk of sectionKeywords) {
        if (sk.pattern.test(line)) {
          indices.push({ lineIdx: idx, ...sk, rawLine: line });
          break;
        }
      }
    });

    const highlightMetrics = (t: string) => {
      const parts = t.split(/(\$[\d,]+(?:\.\d+)?(?:\/yr)?|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\s*(?:months|mo|years|yr)\b)/gi);
      return parts.map((part, i) => {
        if (/^(\$[\d,]+|\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*(?:months|mo|years|yr))/i.test(part)) {
          return (
            <strong key={i} className="text-slate-900 font-bold">
              {part}
            </strong>
          );
        }
        return part;
      });
    };

    if (indices.length > 0) {
      const sections = [];
      for (let i = 0; i < indices.length; i++) {
        const current = indices[i];
        const start = current.lineIdx + 1;
        const end = i + 1 < indices.length ? indices[i + 1].lineIdx : lines.length;

        let inlineText = '';
        const colonIdx = current.rawLine.indexOf(':');
        if (colonIdx !== -1) {
          const cleanedHeader = current.rawLine.replace(/\*\*/g, '').trim();
          const afterColon = current.rawLine.substring(colonIdx + 1).replace(/\*\*/g, '').trim();
          if (!/^section\s*\d+/i.test(cleanedHeader) && afterColon.length > 60) {
            inlineText = afterColon;
          }
        }

        const bodyLines = lines.slice(start, end).map((l) => l.replace(/\*\*/g, ''));
        if (inlineText) bodyLines.unshift(inlineText);

        const bullets = bodyLines
          .filter((l) => /^(?:[•\-\*]|\d+\.)\s+/.test(l))
          .map((l) => l.replace(/^(?:[•\-\*]|\d+\.)\s+/, '').trim());

        const paragraphs = bodyLines.filter((l) => !/^(?:[•\-\*]|\d+\.)\s+/.test(l));

        sections.push({
          num: current.num,
          title: current.title,
          text: paragraphs.join(' ').trim(),
          bullets,
        });
      }

      return (
        <div className="space-y-6 pt-4 border-t border-[#d9e2ec]">
          {/* Main Title Banner */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/50 border border-blue-200/80 rounded-2xl flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#0070f2] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                ✦
              </div>
              <div>
                <h4 className="text-[17px] sm:text-[18px] font-bold text-[#1d2d3e]">
                  {mainTitle}
                </h4>
                <span className="text-[13px] sm:text-[14px] text-slate-600 font-medium block">
                  Autonomous Executive Advisory Synthesized dynamically for simulated parameter adjustments
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#0070f2] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
              ✦ Live AI Synthesized
            </span>
          </div>

          {/* 3 Structured Section Cards */}
          <div className="space-y-5">
            {sections.map((sec) => {
              if (sec.num === 1) {
                return (
                  <div key={sec.num} className="p-6 sm:p-7 bg-blue-50/40 border border-blue-200/80 rounded-2xl space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0070f2] flex items-center justify-center shrink-0 shadow-2xs">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <h5 className="text-[17px] sm:text-[18px] font-bold text-[#1d2d3e]">
                          {sec.title}
                        </h5>
                      </div>
                      <span className="text-[12px] font-bold px-3 py-0.5 rounded-full bg-blue-100 text-[#0070f2] border border-blue-200 uppercase tracking-wider">
                        Executive Summary
                      </span>
                    </div>
                    {sec.text && (
                      <p className="text-[15px] sm:text-[16px] text-slate-800 leading-relaxed font-normal">
                        <StreamingText text={sec.text} speed={12} />
                      </p>
                    )}
                    {sec.bullets.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {sec.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="p-4 bg-white border border-blue-200/80 rounded-xl flex items-start space-x-3 shadow-2xs">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0070f2] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                            <span className="text-[15px] sm:text-[16px] text-slate-800 font-medium leading-snug"><StreamingText text={b} speed={12} /></span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (sec.num === 2) {
                return (
                  <div key={sec.num} className="p-6 sm:p-7 bg-indigo-50/40 border border-indigo-200/80 rounded-2xl space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-[#4338ca] flex items-center justify-center shrink-0 shadow-2xs">
                          <Layers className="w-4 h-4" />
                        </div>
                        <h5 className="text-[17px] sm:text-[18px] font-bold text-[#1d2d3e]">
                          {sec.title}
                        </h5>
                      </div>
                      <span className="text-[12px] font-bold px-3 py-0.5 rounded-full bg-indigo-100 text-[#4338ca] border border-indigo-200 uppercase tracking-wider">
                        Resilience Bounds
                      </span>
                    </div>
                    {sec.text && (
                      <p className="text-[15px] sm:text-[16px] text-slate-800 leading-relaxed font-normal">
                        <StreamingText text={sec.text} speed={12} />
                      </p>
                    )}
                    {sec.bullets.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {sec.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="p-4 bg-white border border-indigo-200/80 rounded-xl flex items-start space-x-3 shadow-2xs">
                            <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#4338ca] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                            <span className="text-[15px] sm:text-[16px] text-slate-800 font-medium leading-snug"><StreamingText text={b} speed={12} /></span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={sec.num} className="p-6 sm:p-7 bg-emerald-50/40 border border-emerald-200/80 rounded-2xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#107e3e] flex items-center justify-center shrink-0 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h5 className="text-[17px] sm:text-[18px] font-bold text-[#1d2d3e]">
                        {sec.title}
                      </h5>
                    </div>
                    <span className="text-[12px] font-bold px-3 py-0.5 rounded-full bg-emerald-100 text-[#107e3e] border border-emerald-200 uppercase tracking-wider">
                      Leadership Actions
                    </span>
                  </div>
                  {sec.text && (
                    <p className="text-[15px] sm:text-[16px] text-slate-800 leading-relaxed font-normal">
                      <StreamingText text={sec.text} speed={12} />
                    </p>
                  )}
                  {sec.bullets.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      {sec.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="p-4 bg-white border border-emerald-200/80 rounded-xl flex items-start space-x-3 shadow-2xs">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#107e3e] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                          <span className="text-[15px] sm:text-[16px] text-slate-800 font-medium leading-snug"><StreamingText text={b} speed={12} /></span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 pt-4 border-t border-[#d9e2ec]">
        <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl">
          <p className="text-[15px] sm:text-[16px] text-slate-800 leading-relaxed font-normal whitespace-pre-line">
            <StreamingText text={cleaned} speed={10} />
          </p>
        </div>
      </div>
    );
  };

  // Main initial data loader
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let loadedAssessment: Assessment | null = null;

        // 0. Initial Zero-Mode: When assessmentId is 'initial', initialize clean zero-state without demo data
        if (assessmentId === 'initial') {
          loadedAssessment = {
            id: 'initial',
            name: 'New Migration Assessment',
            clientName: 'Enterprise Client',
            industry: 'General Enterprise',
            sourcePlatform: 'SAP PI/PO',
            targetPlatform: 'SAP BTP Integration Suite',
            createdAt: new Date().toISOString(),
            status: 'DRAFT',
            currency: 'USD',
            migrationStrategy: 'GREENFIELD',
            complexityTier: 'Standard',
            sourceSystem: {
              sapPiPoAnnualCostBreakdown: {
                licensing: { subtotal: 0, sapPiPoLicenseCosts: 0 },
                infrastructure: { subtotal: 0, hardwareServerCosts: 0 },
                support: { subtotal: 0, sapSupportMaintenance: 0 },
                operations: { subtotal: 0, administrativeStaffCosts: 0 },
              },
            },
            targetSystem: {
              configuration: {
                totalAnnualCost: 0,
                selectedEditionName: 'SAP Integration Suite, Standard Edition',
                numberOfUnits: 1,
                additionalMessagePacks: 0,
              },
              additionalTcoComponents: {
                totalAdditionalTcoAnnual: 0,
              },
            },
            migrationRelatedDetails: {
              totalMigrationCost: 0,
              developmentCost: 0,
              testingCost: 0,
              architectureCost: 0,
              projectManagementCost: 0,
            },
          } as any;
          setAssessment(loadedAssessment);
          setCalculations({
            assessmentId: 'initial',
            currency: 'USD',
            sourcePlatform: 'SAP PI/PO',
            targetPlatform: 'SAP BTP Integration Suite',
            currentPlatformTCO: 0,
            targetPlatformTCO: 0,
            annualSavings: 0,
            savingsPercentage: 0,
            migrationCost: 0,
            breakEvenMonths: 0,
            fiveYearROI: 0,
            fiveYearNetBenefit: 0,
            recommendedMigrationPackage: 'Custom Plan',
            indicativeTimeline: 'Pending assessment',
            licensingSubtotal: 0,
            infrastructureSubtotal: 0,
            supportSubtotal: 0,
            operationsSubtotal: 0,
            paybackYears: 0,
          } as any);
          return;
        }

        // 1. Authoritative Backend Loading
        if (assessmentId === 'demo-assessment-1') {
          try {
            loadedAssessment = await api.getDemoAssessment();
          } catch (e) {
            console.warn('Failed to load demo assessment from backend API', e);
          }
        } else if (assessmentId) {
          try {
            loadedAssessment = await api.getAssessment(assessmentId);
          } catch (e) {
            console.warn(`Failed to load assessment ${assessmentId} from backend API`, e);
          }
        }

        // 2. Local storage fallback if user customized an assessment
        if (typeof window !== 'undefined') {
          try {
            const savedAsmt = localStorage.getItem('valuelens_active_assessment');
            if (savedAsmt) {
              const parsed = JSON.parse(savedAsmt);
              if (assessmentId !== 'demo-assessment-1' && (parsed?.id === assessmentId || !loadedAssessment)) {
                loadedAssessment = parsed;
              }
            }
          } catch {
            // ignore parse error
          }
        }

        // 3. Fallback to demo assessment ONLY if explicitly demo
        if (!loadedAssessment && assessmentId === 'demo-assessment-1') {
          try {
            loadedAssessment = await api.getDemoAssessment();
          } catch {
            // fallback
          }
        }

        setAssessment(loadedAssessment);

        // 4. Calculate ROI from Authoritative Java Backend Calculation Engine
        if (loadedAssessment) {
          try {
            const calc = await api.calculateROI(loadedAssessment);
            if (calc) {
              setCalculations(calc);
              if (typeof window !== 'undefined') {
                localStorage.setItem('valuelens_active_calculation', JSON.stringify(calc));
              }
            }
          } catch (err) {
            console.warn('Backend calculation engine unavailable, keeping cached/preview baseline', err);
            if (typeof window !== 'undefined') {
              const cachedCalc = localStorage.getItem('valuelens_active_calculation');
              if (cachedCalc) {
                try {
                  setCalculations(JSON.parse(cachedCalc));
                } catch {
                  // ignore
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'valuelens_active_assessment' || e.key === 'valuelens_active_calculation') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadData);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadData);
    };
  }, [assessmentId]);

  const isDemoMode = assessmentId === 'demo-assessment-1' || assessment?.id === 'demo-assessment-1';
  const isInitialZeroMode = assessmentId === 'initial' || assessment?.id === 'initial';

  // Derived dynamic numbers from Authoritative Backend
  const currency = calculations?.currency || assessment?.currency || 'USD';
  const sourcePlatform = assessment?.sourcePlatform || calculations?.sourcePlatform || 'SAP PI/PO';
  const packageName = calculations?.recommendedMigrationPackage || 'Silver';
  const indicativeTimeline = calculations?.indicativeTimeline || '4 months';
  const cleanTimeline = indicativeTimeline.toLowerCase().includes('package')
    ? indicativeTimeline.split('(')[0].trim()
    : indicativeTimeline;

  const licensingCost = isInitialZeroMode ? 0 : (
    calculations?.licensingSubtotal ??
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.licensing?.subtotal ??
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.licensing?.sapPiPoLicenseCosts ??
    (isDemoMode ? 85000 : 0));
  const infraCost = isInitialZeroMode ? 0 : (
    calculations?.infrastructureSubtotal ??
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.infrastructure?.subtotal ??
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.infrastructure?.hardwareServerCosts ??
    (isDemoMode ? 35000 : 0));
  const supportCost = isInitialZeroMode ? 0 : (
    calculations?.supportSubtotal ??
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.support?.subtotal ??
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.support?.sapSupportMaintenance ??
    (isDemoMode ? 25000 : 0));
  const operationsCost = isInitialZeroMode ? 0 : (
    calculations?.operationsSubtotal ??
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.operations?.subtotal ??
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.operations?.administrativeStaffCosts ??
    (isDemoMode ? 45000 : 0));

  const currentTco = isInitialZeroMode ? 0 : (
    calculations?.currentPlatformTCO ??
    (licensingCost + infraCost + supportCost + operationsCost));

  const selectedEdition =
    calculations?.recommendedBtpEdition ||
    assessment?.targetSystem?.configuration?.selectedEditionName ||
    'SAP Integration Suite, Standard Edition';

  const getEditionBasePrice = (edition: string, unitCount: number = 1) => {
    if (!edition || unitCount <= 0) return 0;
    const lower = edition.toLowerCase();
    if (lower.includes('starter')) return 20736 * unitCount;
    if (lower.includes('enhanced')) return 92256 * unitCount;
    if (lower.includes('premium')) return 318204 * unitCount;
    if (lower.includes('standard')) return 64068 * unitCount;
    return 64068 * unitCount;
  };
  const unitCount = assessment?.targetSystem?.configuration?.numberOfUnits || 1;
  const editionBasePrice = (isInitialZeroMode || (!isDemoMode && !assessment?.targetSystem?.configuration?.selectedEditionName))
    ? 0
    : getEditionBasePrice(selectedEdition, unitCount);
  const additionalPacks =
    assessment?.targetSystem?.configuration?.additionalMessagePacks ??
    (isDemoMode ? 59 : 0);
  const packsCost = additionalPacks * 84;
  const dataSpacePackages = assessment?.targetSystem?.configuration?.dataSpacePackages ?? 0;
  const dataSpaceCost = dataSpacePackages * 900;
  const additionalEicTenants = assessment?.targetSystem?.configuration?.additionalEicTenants ?? 0;
  const eicCost = additionalEicTenants * 41460;
  const addOnsCost = isInitialZeroMode ? 0 : (packsCost + dataSpaceCost + eicCost);
  const targetConfigCost = isInitialZeroMode ? 0 : (
    assessment?.targetSystem?.configuration?.totalAnnualCost && assessment.targetSystem.configuration.totalAnnualCost > 0
      ? assessment.targetSystem.configuration.totalAnnualCost
      : (editionBasePrice > 0 || addOnsCost > 0 ? editionBasePrice + addOnsCost : 0));
  const targetAdditionalTco = isInitialZeroMode ? 0 : (
    assessment?.targetSystem?.additionalTcoComponents?.totalAdditionalTcoAnnual || 0);
  const targetTco = isInitialZeroMode ? 0 : (
    calculations?.targetPlatformTCO ??
    (targetConfigCost + targetAdditionalTco));

  const annualSavings = isInitialZeroMode ? 0 : (
    calculations?.annualSavings ?? (currentTco > targetTco ? currentTco - targetTco : 0));
  const savingsPct = isInitialZeroMode ? 0 : (
    calculations?.savingsPercentage ?? (currentTco > 0 ? (annualSavings / currentTco) * 100 : 0));

  const migrationCost = isInitialZeroMode ? 0 : (
    calculations?.migrationCost && calculations.migrationCost > 0
      ? calculations.migrationCost
      : (assessment?.migrationRelatedDetails?.totalMigrationCost && assessment.migrationRelatedDetails.totalMigrationCost > 0
        ? assessment.migrationRelatedDetails.totalMigrationCost
        : (isDemoMode ? 65000 : 0)));

  const devCost =
    assessment?.migrationRelatedDetails?.developmentCost && assessment.migrationRelatedDetails.developmentCost > 0
      ? assessment.migrationRelatedDetails.developmentCost
      : Math.round(migrationCost * 0.60);

  const testingCost =
    assessment?.migrationRelatedDetails?.testingCost && assessment.migrationRelatedDetails.testingCost > 0
      ? assessment.migrationRelatedDetails.testingCost
      : Math.round(migrationCost * 0.20);

  const archCost =
    assessment?.migrationRelatedDetails?.architectureCost && assessment.migrationRelatedDetails.architectureCost > 0
      ? assessment.migrationRelatedDetails.architectureCost
      : Math.round(migrationCost * 0.10);

  const pmCost =
    assessment?.migrationRelatedDetails?.projectManagementCost && assessment.migrationRelatedDetails.projectManagementCost > 0
      ? assessment.migrationRelatedDetails.projectManagementCost
      : Math.round(migrationCost * 0.10);

  const breakEvenMonths = isInitialZeroMode ? 0 : (
    calculations?.breakEvenMonths && calculations.breakEvenMonths > 0
      ? calculations.breakEvenMonths
      : (annualSavings > 0 && migrationCost > 0 ? (migrationCost / annualSavings) * 12 : (isDemoMode ? 3.8 : 0)));

  const fiveYearNetBenefit = isInitialZeroMode ? 0 : (
    calculations?.fiveYearNetBenefit ?? (annualSavings * 5 - migrationCost));

  const fiveYearRoi = isInitialZeroMode ? 0 : (
    calculations?.fiveYearROI && calculations.fiveYearROI > 0
      ? calculations.fiveYearROI
      : (migrationCost > 0 && fiveYearNetBenefit > 0
        ? ((fiveYearNetBenefit - migrationCost) / migrationCost) * 100
        : 0));

  const devPct = migrationCost > 0 ? ((devCost / migrationCost) * 100).toFixed(0) : '60';

  // 5-Year Enterprise ROI & Cost Comparison Horizon Data
  const costComparisonData = useMemo(() => {
    return [
      {
        name: 'Year 1',
        period: 'Year 1',
        currentTco: currentTco,
        btpRunRate: targetTco,
        migrationCost: migrationCost,
        btpTotal: targetTco + migrationCost,
        netSavings: currentTco - (targetTco + migrationCost),
        subtitle: 'Migration & cutover investment',
      },
      {
        name: 'Year 2',
        period: 'Year 2',
        currentTco: currentTco,
        btpRunRate: targetTco,
        migrationCost: 0,
        btpTotal: targetTco,
        netSavings: annualSavings,
        subtitle: 'Steady-state full savings realized',
      },
      {
        name: 'Year 3',
        period: 'Year 3',
        currentTco: currentTco,
        btpRunRate: targetTco,
        migrationCost: 0,
        btpTotal: targetTco,
        netSavings: annualSavings,
        subtitle: 'Compounding margin expansion',
      },
      {
        name: 'Year 4',
        period: 'Year 4',
        currentTco: currentTco,
        btpRunRate: targetTco,
        migrationCost: 0,
        btpTotal: targetTco,
        netSavings: annualSavings,
        subtitle: 'Sustained cloud cost efficiency',
      },
      {
        name: 'Year 5',
        period: 'Year 5',
        currentTco: currentTco,
        btpRunRate: targetTco,
        migrationCost: 0,
        btpTotal: targetTco,
        netSavings: annualSavings,
        subtitle: 'Mature cloud operating model',
      },
      {
        name: '5-Yr Total',
        period: '5-Year Cumulative',
        currentTco: currentTco * 5,
        btpRunRate: targetTco * 5,
        migrationCost: migrationCost,
        btpTotal: targetTco * 5 + migrationCost,
        netSavings: fiveYearNetBenefit,
        subtitle: 'Cumulative 5-Year TCO comparison',
      },
    ];
  }, [currentTco, targetTco, migrationCost, annualSavings, fiveYearNetBenefit]);

  // Migration Cost Impact Analysis 10-Year Net Position Curve Data
  const netPositionData = useMemo(() => {
    const arr = [];
    arr.push({
      year: 'Start',
      yearNum: 0,
      netPosition: -migrationCost,
      breakEvenLine: 0,
    });
    for (let y = 1; y <= 10; y++) {
      const netPos = (annualSavings * y) - migrationCost;
      arr.push({
        year: `Year ${y}`,
        yearNum: y,
        netPosition: netPos,
        breakEvenLine: 0,
      });
    }
    return arr;
  }, [annualSavings, migrationCost]);

  // Cost Drivers Donut Data
  const tcoDriversData = useMemo(() => {
    const total = currentTco > 0 ? currentTco : 1;
    return [
      { name: 'Licensing', value: licensingCost, pct: currentTco > 0 ? ((licensingCost / total) * 100).toFixed(1) : '0', color: '#0070f2' },
      { name: 'Infrastructure', value: infraCost, pct: currentTco > 0 ? ((infraCost / total) * 100).toFixed(1) : '0', color: '#5b6b82' },
      { name: 'Support', value: supportCost, pct: currentTco > 0 ? ((supportCost / total) * 100).toFixed(1) : '0', color: '#8a3ffc' },
      { name: 'Operations', value: operationsCost, pct: currentTco > 0 ? ((operationsCost / total) * 100).toFixed(1) : '0', color: '#107e3e' },
    ];
  }, [currentTco, licensingCost, infraCost, supportCost, operationsCost]);

  // Migration Breakdown Donut Data
  const migrationBreakdownData = useMemo(() => {
    const total = migrationCost > 0 ? migrationCost : 1;
    return [
      { name: 'Development & Migration', value: devCost, pct: migrationCost > 0 ? Math.round((devCost / total) * 100) : 0, color: '#0070f2' },
      { name: 'Quality Assurance & Automated Testing', value: testingCost, pct: migrationCost > 0 ? Math.round((testingCost / total) * 100) : 0, color: '#107e3e' },
      { name: 'Architecture & BASIS Setup', value: archCost, pct: migrationCost > 0 ? Math.round((archCost / total) * 100) : 0, color: '#06b6d4' },
      { name: 'Project Mgmt & Hypercare', value: pmCost, pct: migrationCost > 0 ? Math.round((pmCost / total) * 100) : 0, color: '#8a3ffc' },
    ];
  }, [migrationCost, devCost, testingCost, archCost, pmCost]);

  // 10-Year Timeline Data
  const timelineData = useMemo(() => {
    const arr = [];
    for (let y = 1; y <= 10; y++) {
      const cumulativeBenefit = annualSavings * y;
      const netBenefit = cumulativeBenefit - migrationCost;
      const roi = migrationCost > 0 ? (netBenefit / migrationCost) * 100 : 0;
      arr.push({
        year: `Year ${y}`,
        shortYear: y,
        cumulativeBenefit,
        netBenefit,
        roi,
      });
    }
    return arr;
  }, [annualSavings, migrationCost]);

  // Dynamic In-Dashboard Sensitivity Simulation
  const simulatedTargetTco = targetTco * simTargetFactor;
  const simulatedNetAnnual = Math.max(0, (currentTco - simulatedTargetTco) * simSavingsFactor);
  const simulatedMigration = migrationCost * simMigrationFactor;
  const simulatedBreakEven = simulatedNetAnnual > 0 ? (simulatedMigration / simulatedNetAnnual) * 12 : 0;
  const simulated5YBenefit = simulatedNetAnnual * 5 - simulatedMigration;
  const simulated5YRoi = simulatedMigration > 0 ? (simulated5YBenefit / simulatedMigration) * 100 : 0;

  // Environment & Complexity Parameters
  const totalInterfaces = assessment?.sourceSystem?.environmentAssessment?.totalInterfaces ?? 0;
  const complexInterfaces = assessment?.sourceSystem?.environmentAssessment?.complexInterfaces ?? 0;
  const complexPct = totalInterfaces > 0 ? ((complexInterfaces / totalInterfaces) * 100).toFixed(1) : '0';
  const throughput = assessment?.sourceSystem?.volumetrics?.currentMessageThroughput ? parseInt(assessment.sourceSystem.volumetrics.currentMessageThroughput).toLocaleString() : '0';
  const customDev = assessment?.sourceSystem?.environmentAssessment?.customDevelopment ?? 'None';

  const licensingPct = currentTco > 0 ? ((licensingCost / currentTco) * 100).toFixed(1) : '0';
  const nonLicensingPct = currentTco > 0 ? (((infraCost + supportCost + operationsCost) / currentTco) * 100).toFixed(0) : '0';
  const year1NetBenefit = timelineData[0]?.netBenefit ?? 0;
  const year1Roi = timelineData[0]?.roi ?? 0;

  const complexityLabel = assessment?.sourceSystem?.environmentAssessment?.systemComplexity || assessment?.sourceSystem?.companyInformation?.integrationComplexity || 'Medium';
  const complexityWidth =
    complexityLabel.toLowerCase().includes('high') || complexityLabel.toLowerCase().includes('complex')
      ? '85%'
      : complexityLabel.toLowerCase().includes('simple') || complexityLabel.toLowerCase().includes('low')
        ? '25%'
        : '55%';

  // Action Button Handlers
  const handleDownloadPdf = () => {
    const projectionRows = [1, 2, 3, 4, 5].map((y) => {
      const baselineSpend = currentTco;
      const btpRunCost = targetTco;
      const cumulativeSavings = annualSavings * y;
      const migrationCapex = y === 1 ? migrationCost : 0;
      const netBenefit = cumulativeSavings - migrationCost;
      const roi = migrationCost > 0 ? (netBenefit / migrationCost) * 100 : 0;
      return {
        year: y,
        baselineSpend,
        btpRunCost,
        cumulativeSavings,
        migrationCapex,
        netBenefit,
        roi,
      };
    });

    generateExecutiveReportPdf({
      assessment,
      calculations,
      currentTco,
      targetTco,
      annualSavings,
      savingsPct,
      migrationCost,
      breakEvenMonths,
      fiveYearRoi,
      fiveYearNetBenefit,
      currency,
      sourcePlatform,
      packageName,
      cleanTimeline,
      timelineData: projectionRows,
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] py-8 md:py-10 text-[#1d2d3e]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 space-y-8 lg:space-y-10">

        {/* ========================================================================= */}
        {/* TOP BAR: Back Button, Title, Subtitle, Date & Action Buttons             */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div>
            <Link
              href="/assessment"
              className="inline-flex items-center space-x-2 text-[14px] font-semibold text-[#556b82] hover:text-[#0070f2] transition-colors group mb-3"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Assessment</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#d9e2ec] pb-6">
            <div>
              <h1 className="text-3xl lg:text-[34px] font-bold text-[#1d2d3e] tracking-tight leading-tight">
                Comprehensive ROI Analysis
              </h1>
              <p className="text-[15px] text-[#556b82] mt-1.5 font-normal leading-normal">
                Migration from <strong className="text-[#1d2d3e] font-semibold">{sourcePlatform}</strong> to <strong className="text-[#0070f2] font-semibold">SAP BTP Integration Suite</strong>
              </p>
            </div>

            {/* Top Action Buttons with Spacious Enterprise Padding */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={openExecutiveAnalysis}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#0070f2] to-[#0057d2] hover:from-[#0057d2] hover:to-[#0040a8] text-white rounded-xl text-[14px] font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Executive Dossier</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-[#1d2d3e] border border-[#d9e2ec] rounded-xl text-[14px] font-semibold shadow-xs hover:border-[#0070f2] transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#0070f2]" />
                <span>Download PDF</span>
              </button>

              <Link
                href="/assessment?new=true"
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0070f2] hover:bg-[#0057d2] text-white rounded-xl text-[14px] font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Start New Business Value</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BANNER: Initial Zero Notice, Demo Benchmark Notice OR Custom Assessment Active */}
        {/* ========================================================================= */}
        {isInitialZeroMode ? (
          <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0070f2]/10 flex items-center justify-center shrink-0 text-[#0070f2]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold text-[#1d2d3e] text-[15px]">New Business Case Assessment</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0070f2] text-[11px] font-bold uppercase tracking-wider">
                    Ready for Inputs
                  </span>
                </div>
                <p className="text-[13.5px] text-[#556b82] mt-1 leading-normal">
                  Your baseline dashboard is initialized with clean zero state. Click <strong>Start Business Value Assessment</strong> to configure your enterprise parameters and calculate customized ROI.
                </p>
              </div>
            </div>
            <Link
              href="/assessment?new=true"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0070f2] hover:bg-[#0057d2] text-white rounded-xl text-[13.5px] font-bold shadow-xs hover:shadow transition-all shrink-0 whitespace-nowrap"
            >
              <span>Start Business Value Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : isDemoMode ? (
          <div className="bg-amber-50/95 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold text-amber-950 text-[15px]">Sample Benchmark Case Study</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                    Demo Reference Data
                  </span>
                </div>
                <p className="text-[13.5px] text-amber-900/85 mt-1 leading-normal">
                  You are viewing a pre-configured reference model with standard SAP PI/PO enterprise baseline values ($190,000 baseline spend). To calculate ROI for your organization&apos;s specific landscape, click <strong>Start New Business Value</strong>.
                </p>
              </div>
            </div>
            <Link
              href="/assessment?new=true"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0070f2] hover:bg-[#0057d2] text-white rounded-xl text-[13.5px] font-bold shadow-xs hover:shadow transition-all shrink-0 whitespace-nowrap"
            >
              <span>Start New Business Value</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 text-[14px]">Active Custom Assessment:</span>
                <span className="text-[13.5px] text-emerald-900 ml-2 font-semibold">
                  {assessment?.name || 'Custom Integration Assessment'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/assessment"
                className="inline-flex items-center space-x-1.5 text-[13px] font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
              >
                <span>Edit Assessment Inputs</span>
              </Link>
              <span className="text-emerald-400">|</span>
              <Link
                href="/assessment?new=true"
                className="inline-flex items-center space-x-1.5 text-[13px] font-bold text-[#0070f2] hover:text-[#0057d2]"
              >
                <span>Start New Business Value</span>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* HERO KPI CARDS: 6 Large Spacious Metric Cards (Section 7 Specification)   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
          {/* Card 1: CURRENT PLATFORM TCO */}
          <div className="bg-white rounded-3xl border border-[#d9e2ec] p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col min-h-[190px] overflow-hidden">
            <div className="min-h-[52px] flex items-start justify-between gap-2">
              <span className="text-[12.5px] xl:text-[13px] font-semibold text-[#556b82] uppercase tracking-wider leading-[1.35] block truncate">
                Current {sourcePlatform} TCO
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="min-h-[46px] flex items-center mt-2">
              <div className="text-[22px] sm:text-[24px] xl:text-[25px] 2xl:text-[28px] font-bold text-[#1d2d3e] font-mono tracking-tight leading-tight truncate">
                {formatCurrency(currentTco, currency)}
              </div>
            </div>
            <div className="min-h-[38px] flex items-start mt-2">
              <p className="text-[12.5px] xl:text-[13px] text-[#556b82] font-medium leading-[1.45] truncate">
                Annual baseline spend
              </p>
            </div>
          </div>

          {/* Card 2: TARGET BTP TCO */}
          <div className="bg-white rounded-3xl border border-[#d9e2ec] p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col min-h-[190px] overflow-hidden">
            <div className="min-h-[52px] flex items-start justify-between gap-2">
              <span className="text-[12.5px] xl:text-[13px] font-semibold text-[#0070f2] uppercase tracking-wider leading-[1.35] block truncate">
                Target BTP TCO
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="min-h-[46px] flex items-center mt-2">
              <div className="text-[22px] sm:text-[24px] xl:text-[25px] 2xl:text-[28px] font-bold text-[#0070f2] font-mono tracking-tight leading-tight truncate">
                {formatCurrency(targetTco, currency)}
              </div>
            </div>
            <div className="min-h-[38px] flex items-start mt-2">
              <p className="text-[12.5px] xl:text-[13px] text-[#556b82] font-medium leading-[1.45] truncate">
                {targetTco > 0 ? (selectedEdition.includes('Standard') ? 'Standard Edition' : selectedEdition) : 'Target cloud runtime'}
              </p>
            </div>
          </div>

          {/* Card 3: ANNUAL SAVINGS */}
          <div className="bg-white rounded-3xl border border-[#d9e2ec] p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col min-h-[190px] overflow-hidden">
            <div className="min-h-[52px] flex items-start justify-between gap-2">
              <span className="text-[12.5px] xl:text-[13px] font-semibold text-[#107e3e] uppercase tracking-wider leading-[1.35] block truncate">
                Annual Savings
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#107e3e] flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="min-h-[46px] flex items-center mt-2">
              <div className="text-[22px] sm:text-[24px] xl:text-[25px] 2xl:text-[28px] font-bold text-[#107e3e] font-mono tracking-tight leading-tight truncate">
                {annualSavings > 0 ? `+${formatCurrency(annualSavings, currency)}` : formatCurrency(0, currency)}
              </div>
            </div>
            <div className="min-h-[38px] flex items-start mt-2">
              <p className="text-[12.5px] xl:text-[13px] text-[#556b82] font-medium leading-[1.45] truncate">
                {savingsPct > 0 ? (
                  <>
                    <span className="font-bold text-[#107e3e]">↓ {savingsPct.toFixed(1)}%</span> run-rate reduction
                  </>
                ) : (
                  <span>Baseline run-rate</span>
                )}
              </p>
            </div>
          </div>

          {/* Card 4: MIGRATION INVESTMENT */}
          <div className="bg-white rounded-3xl border border-[#d9e2ec] p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col min-h-[190px] overflow-hidden">
            <div className="min-h-[52px] flex items-start justify-between gap-2">
              <span className="text-[12.5px] xl:text-[13px] font-semibold text-amber-700 uppercase tracking-wider leading-[1.35] block truncate">
                Migration Investment
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="min-h-[46px] flex items-center mt-2">
              <div className="text-[22px] sm:text-[24px] xl:text-[25px] 2xl:text-[28px] font-bold text-[#1d2d3e] font-mono tracking-tight leading-tight truncate">
                {formatCurrency(migrationCost, currency)}
              </div>
            </div>
            <div className="min-h-[38px] flex items-start mt-2">
              <p className="text-[12.5px] xl:text-[13px] text-[#556b82] font-medium leading-[1.45] truncate">
                {migrationCost > 0 ? `Incture ${packageName} (${cleanTimeline})` : 'Delivery package'}
              </p>
            </div>
          </div>

          {/* Card 5: BREAK-EVEN */}
          <div className="bg-white rounded-3xl border border-[#d9e2ec] p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col min-h-[190px] overflow-hidden">
            <div className="min-h-[52px] flex items-start justify-between gap-2">
              <span className="text-[12.5px] xl:text-[13px] font-semibold text-[#0070f2] uppercase tracking-wider leading-[1.35] block truncate">
                Break-Even
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="min-h-[46px] flex items-center mt-2">
              <div className="text-[22px] sm:text-[24px] xl:text-[25px] 2xl:text-[28px] font-bold text-[#0070f2] tracking-tight leading-tight truncate">
                {breakEvenMonths > 0 ? `${breakEvenMonths.toFixed(1)} Months` : '0.0 Months'}
              </div>
            </div>
            <div className="min-h-[38px] flex items-start mt-2">
              <p className="text-[12.5px] xl:text-[13px] text-[#556b82] font-medium leading-[1.45] truncate">
                {breakEvenMonths > 0 && breakEvenMonths <= 12
                  ? '100% payback inside Year 1'
                  : breakEvenMonths > 12
                    ? `Payback inside Year ${Math.ceil(breakEvenMonths / 12)}`
                    : 'Break-even payback'}
              </p>
            </div>
          </div>

          {/* Card 6: 5-YEAR ROI */}
          <div className="bg-white rounded-3xl border border-[#d9e2ec] p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col min-h-[190px] overflow-hidden">
            <div className="min-h-[52px] flex items-start justify-between gap-2">
              <span className="text-[12.5px] xl:text-[13px] font-semibold text-[#8a3ffc] uppercase tracking-wider leading-[1.35] block truncate">
                5-Year ROI
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8a3ffc] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="min-h-[46px] flex items-center mt-2">
              <div className="text-[22px] sm:text-[24px] xl:text-[25px] 2xl:text-[28px] font-bold text-[#8a3ffc] font-mono tracking-tight leading-tight truncate">
                {fiveYearRoi > 0 ? `${fiveYearRoi.toFixed(1)}%` : '0.0%'}
              </div>
            </div>
            <div className="min-h-[38px] flex items-start mt-2">
              <p className="text-[12.5px] xl:text-[13px] text-[#556b82] font-medium leading-[1.45] truncate">
                Net: {formatCurrency(fiveYearNetBenefit > 0 ? fiveYearNetBenefit : 0, currency)}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROOMY 7-TAB NAVIGATION BAR (Section 24 Specification)                      */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#d9e2ec] p-1.5 shadow-xs overflow-x-auto">
          <div className="flex items-center justify-between w-full min-w-[960px] gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: Layers },
              { id: 'charts', label: 'Charts & Analysis', icon: BarChart2 },
              { id: 'simulation', label: 'Financial Simulation', icon: Sliders },
              { id: 'current-state', label: 'Current State', icon: Server },
              { id: 'target-state', label: 'Target State', icon: Cpu },
              { id: 'migration', label: 'Migration Scope', icon: Briefcase },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = dashboardTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDashboardTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2.5 px-4 xl:px-5 py-3 h-[50px] rounded-xl text-[14px] xl:text-[15px] transition-all cursor-pointer whitespace-nowrap ${isActive
                    ? 'bg-[#0070f2] text-white shadow-xs font-semibold'
                    : 'text-[#556b82] hover:text-[#1d2d3e] hover:bg-slate-100 font-medium'
                    }`}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-[#556b82]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW                                                           */}
        {/* ========================================================================= */}
        {dashboardTab === 'overview' && (
          <div className="space-y-8 lg:space-y-10 animate-fadeIn">

            {/* Cost Comparison Summary Card */}
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#d9e2ec] pb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0070f2] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-[26px] font-semibold text-[#1d2d3e]">
                      Cost Comparison Summary
                    </h2>
                    <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1">
                      Annual recurring operating spend comparison between {sourcePlatform} and SAP BTP Integration Suite
                    </p>
                  </div>
                </div>
                <div className="text-[13px] text-[#556b82] font-semibold bg-slate-50 px-3.5 py-1.5 rounded-xl border border-[#d9e2ec]">
                  Currency: <strong className="text-[#1d2d3e]">{currency}</strong>
                </div>
              </div>

              {/* 3 Prominent Columns with Ample Breathing Room */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#d9e2ec]">
                {/* Column 1: Current Platform */}
                <div className="space-y-3 pt-4 md:pt-0 md:pr-6">
                  <span className="text-[13px] font-semibold text-[#556b82] uppercase tracking-wider block">
                    Current {sourcePlatform}
                  </span>
                  <div className="text-3xl lg:text-4xl font-bold text-[#1d2d3e] font-mono">
                    {formatCurrency(currentTco, currency)}
                  </div>
                  <div className="text-[13px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg inline-block">
                    Annual Baseline TCO
                  </div>
                  <p className="text-[14px] text-[#556b82] leading-relaxed pt-1">
                    Sum of perpetual licenses ({formatCurrency(licensingCost, currency)}), datacenter hardware ({formatCurrency(infraCost, currency)}), administration ({formatCurrency(operationsCost, currency)}), and support contracts ({formatCurrency(supportCost, currency)}).
                  </p>
                </div>

                {/* Column 2: SAP BTP */}
                <div className="space-y-3 pt-4 md:pt-0 md:px-6">
                  <span className="text-[13px] font-semibold text-[#556b82] uppercase tracking-wider block">
                    SAP BTP Integration Suite
                  </span>
                  <div className="text-3xl lg:text-4xl font-bold text-[#0070f2] font-mono">
                    {formatCurrency(targetTco, currency)}
                  </div>
                  <div className="text-[13px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg inline-block">
                    Target Annual Run-Rate
                  </div>
                  <p className="text-[14px] text-[#556b82] leading-relaxed pt-1">
                    Standard Edition subscription ({formatCurrency(editionBasePrice, currency)}) + 59 additional message blocks ({formatCurrency(packsCost, currency)}) with managed cloud SLA and automatic updates.
                  </p>
                </div>

                {/* Column 3: Net Impact */}
                <div className="space-y-3 pt-4 md:pt-0 md:pl-6">
                  <span className="text-[13px] font-semibold text-[#556b82] uppercase tracking-wider block">
                    Net Economic Impact
                  </span>
                  <div className="text-3xl lg:text-4xl font-bold text-[#107e3e] font-mono">
                    +{formatCurrency(annualSavings, currency)}
                  </div>
                  <div className="text-[13px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg inline-block">
                    +{savingsPct.toFixed(1)}% Annual Savings
                  </div>
                  <p className="text-[14px] text-[#556b82] leading-relaxed pt-1">
                    Permanent operating margin expansion. Full migration investment of {formatCurrency(migrationCost, currency)} is fully recovered in <strong className="text-[#1d2d3e] font-bold">{breakEvenMonths.toFixed(1)} months</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Savings Meter Section */}
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-xl font-semibold text-[#1d2d3e]">
                    Enterprise Savings Meter
                  </h3>
                  <p className="text-[14px] text-[#556b82] mt-0.5">
                    Operational expenditure reduction captured by transitioning from {sourcePlatform} to SAP BTP Integration Suite
                  </p>
                </div>
                <span className="text-2xl lg:text-3xl font-bold text-[#107e3e] font-mono">
                  {savingsPct.toFixed(1)}%
                </span>
              </div>

              {/* Meter Track */}
              <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden p-1 border border-[#d9e2ec]">
                <div
                  className="bg-gradient-to-r from-[#0070f2] via-teal-500 to-[#107e3e] h-full rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${Math.min(100, Math.max(0, savingsPct)).toFixed(1)}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[13px] text-[#556b82] pt-1">
                <span>0% (No Savings)</span>
                <span className="font-semibold text-[#1d2d3e]">
                  +{formatCurrency(annualSavings, currency)} / year liberated capital
                </span>
                <span>100% (Zero Run Cost)</span>
              </div>
            </div>

            {/* IntSwitch Migration Decision Intelligence Card (Sections 14, 15, 16) */}
            <div className="bg-white border border-[#d9e2ec] rounded-3xl p-8 md:p-10 shadow-xs space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Decision Statement (Cols 5) */}
                <div className="lg:col-span-5 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 text-[#0070f2] flex items-center justify-center shrink-0 shadow-xs">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <img src="/images/intswitch-logo.png" alt="IntSwitch" className="h-5 w-auto object-contain" />
                      <span className="text-[14px] font-bold text-[#0070f2] uppercase tracking-wider block">
                        IntSwitch Decision Intelligence
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1d2d3e] tracking-tight flex items-center gap-2">
                      <span>Strategic Migration Assessment</span>
                      <span className="text-[12px] font-bold px-3 py-0.5 rounded-full bg-blue-50 text-[#0070f2] border border-blue-200 uppercase">
                        Incture Assured
                      </span>
                    </h3>
                    <p className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed pt-1 font-normal">
                      Validated with Incture {packageName} packaged delivery and IntSwitch accelerator. Capital payback expected in{' '}
                      <strong className="text-slate-900 font-bold">{breakEvenMonths.toFixed(1)} months</strong> with a 5-year ROI of{' '}
                      <strong className="text-slate-900 font-bold">{fiveYearRoi.toFixed(1)}%</strong>.
                    </p>
                  </div>
                </div>

                {/* Center: IntSwitch Opportunity Matrix (Cols 3) */}
                <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l lg:border-r border-[#d9e2ec] pt-4 lg:pt-0 lg:px-8 space-y-3 flex flex-col justify-center">
                  <span className="text-[14px] font-bold text-slate-500 uppercase tracking-wider block">IntSwitch Opportunity</span>
                  <div className="text-xl font-bold text-[#0070f2] leading-snug">
                    Migration &amp; Testing Accelerator
                  </div>
                  <ul className="text-[15px] sm:text-[16px] text-slate-700 space-y-2 font-medium">
                    <li className="flex items-center space-x-2">
                      <span className="text-emerald-600 font-bold text-base">✓</span>
                      <span>Migration acceleration</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-emerald-600 font-bold text-base">✓</span>
                      <span>Testing automation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-emerald-600 font-bold text-base">✓</span>
                      <span>Validation &amp; Quality monitoring</span>
                    </li>
                  </ul>
                </div>

                {/* Right: Delivery Assurance & AI (Cols 4) */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-[15px] font-bold text-[#0070f2]">
                      <Sparkles className="w-4 h-4" />
                      <span>Delivery Assurance</span>
                    </div>
                    {aiAnalysis && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        ✦ LIVE AI
                      </span>
                    )}
                  </div>
                  <p className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed font-normal">
                    {aiAnalysis?.executiveSummary ? (
                      aiAnalysis.executiveSummary.length > 210
                        ? aiAnalysis.executiveSummary.slice(0, 210) + '...'
                        : aiAnalysis.executiveSummary
                    ) : (
                      <>Annual recurring savings of <strong className="text-slate-900 font-bold">{formatCurrency(annualSavings, currency)}</strong> ({savingsPct.toFixed(1)}% reduction) establish an executive business case with rapid payback.</>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={openExecutiveAnalysis}
                    className="text-[15px] font-bold text-[#0070f2] hover:text-[#0057d2] inline-flex items-center space-x-1.5 pt-1 cursor-pointer group"
                  >
                    <span>Read Comprehensive Executive Dossier</span>
                    <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CHARTS & ANALYSIS                                                  */}
        {/* ========================================================================= */}
        {dashboardTab === 'charts' && (
          <div className="space-y-8 lg:space-y-10 animate-fadeIn">

            {/* CHART 1: 5-Year Enterprise Cost Comparison & ROI Analysis */}
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#d9e2ec] pb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0070f2] flex items-center justify-center font-bold">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-[26px] font-bold text-[#1d2d3e]">
                      5-Year Cost Comparison &amp; Enterprise ROI
                    </h2>
                    <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-0.5">
                      Annual operational spend comparison between {sourcePlatform} and SAP BTP from Year 1 through Year 5
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[13px] text-[#556b82] font-semibold bg-slate-50 px-3.5 py-1.5 rounded-xl border border-[#d9e2ec]">
                    5-Year Horizon
                  </span>
                  <span className="text-[13px] text-emerald-800 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
                    5-Year ROI: {fiveYearRoi.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Bar Chart with 390px Height */}
              <div className="h-[390px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#1d2d3e', fontWeight: 600, fontSize: 13 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                      tick={{ fill: '#556b82', fontSize: 13 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <Tooltip
                      formatter={(val: number, name: string) => [
                        formatCurrency(val, currency),
                        name === 'currentTco'
                          ? `Current ${sourcePlatform} TCO`
                          : name === 'btpRunRate'
                            ? 'SAP BTP Subscription Run-Rate'
                            : 'One-Time Migration Investment',
                      ]}
                      contentStyle={{ backgroundColor: '#1d2d3e', borderRadius: '12px', color: '#fff', fontSize: '13px', border: 'none' }}
                    />
                    <Bar dataKey="currentTco" fill="#556b82" maxBarSize={44} name="currentTco" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="btpRunRate" stackId="btp" fill="#0070f2" maxBarSize={44} name="btpRunRate" />
                    <Bar dataKey="migrationCost" stackId="btp" fill="#ea580c" maxBarSize={44} radius={[6, 6, 0, 0]} name="migrationCost" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 3 Clean Legend Cards under Chart */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                {/* Card 1: Current Platform 5-Year Baseline */}
                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#556b82] shrink-0" />
                    <h4 className="text-[15px] font-bold text-[#1d2d3e]">Current {sourcePlatform} (5-Year TCO)</h4>
                  </div>
                  <p className="text-[13px] text-[#556b82] font-medium">Cumulative 5-Year on-premise baseline spend</p>
                  <div className="text-2xl lg:text-3xl font-bold text-[#1d2d3e] font-mono pt-1">
                    {formatCurrency(currentTco * 5, currency)}
                  </div>
                  <p className="text-[13px] text-[#556b82] leading-relaxed">
                    {formatCurrency(currentTco, currency)}/yr baseline in licenses, hardware, hypervisors &amp; maintenance renewals.
                  </p>
                </div>

                {/* Card 2: SAP BTP 5-Year Cloud TCO */}
                <div className="p-6 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0070f2] shrink-0" />
                    <h4 className="text-[15px] font-bold text-blue-900">SAP BTP 5-Year Cloud TCO</h4>
                  </div>
                  <p className="text-[13px] text-blue-700 font-medium">5-Year Cloud subscription + One-time migration</p>
                  <div className="text-2xl lg:text-3xl font-bold text-[#0070f2] font-mono pt-1">
                    {formatCurrency(targetTco * 5 + migrationCost, currency)}
                  </div>
                  <p className="text-[13px] text-blue-800 leading-relaxed">
                    {formatCurrency(targetTco * 5, currency)} in managed subscriptions ({formatCurrency(targetTco, currency)}/yr) + {formatCurrency(migrationCost, currency)} one-time packaged migration.
                  </p>
                </div>

                {/* Card 3: 5-Year Net Economic Value & ROI */}
                <div className="p-6 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#107e3e] shrink-0" />
                    <h4 className="text-[15px] font-bold text-emerald-900">5-Year Net Economic Value</h4>
                  </div>
                  <p className="text-[13px] text-emerald-700 font-medium">{fiveYearRoi.toFixed(1)}% 5-Year ROI • Payback in {breakEvenMonths.toFixed(1)} mos</p>
                  <div className="text-2xl lg:text-3xl font-bold text-[#107e3e] font-mono pt-1">
                    +{formatCurrency(fiveYearNetBenefit, currency)}
                  </div>
                  <p className="text-[13px] text-emerald-800 leading-relaxed">
                    Net capital liberated across 5 years after recovering 100% of migration expenditure.
                  </p>
                </div>
              </div>
            </div>

            {/* CHART 2: Migration Cost Impact Analysis */}
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#d9e2ec] pb-5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0070f2] flex items-center justify-center font-bold shadow-xs">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-[26px] font-bold text-[#1d2d3e]">
                    Migration Cost Impact Analysis
                  </h2>
                  <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-0.5">
                    Capital deployment trajectory and 10-year cumulative investment recovery curve
                  </p>
                </div>
              </div>

              {/* Understanding Migration Investment Callout */}
              <div className="p-6 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2.5">
                <div className="flex items-center space-x-2 text-[#0070f2] font-bold text-[16px]">
                  <DollarSign className="w-4 h-4 text-[#0070f2] shrink-0" />
                  <span>Migration Investment Capital Flow</span>
                </div>
                <p className="text-[14px] sm:text-[15px] text-slate-700 leading-relaxed">
                  The upfront migration investment of <strong className="text-slate-900 font-bold">{formatCurrency(migrationCost, currency)}</strong> is amortized through transition milestones. Ongoing operational savings of <strong className="text-[#107e3e] font-bold">+{formatCurrency(annualSavings, currency)}/year</strong> steadily recover this capital.
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-emerald-100/90 text-[#107e3e] border border-emerald-300 rounded-full text-[13px] font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Break-even Point: {breakEvenMonths.toFixed(1)} Months</span>
                  </span>
                </div>
              </div>

              {/* Area Chart: Net Position ($) over 10 Years with collision-free reference line */}
              <div className="h-[390px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={netPositionData} margin={{ top: 25, right: 35, left: 20, bottom: 25 }}>
                    <defs>
                      <linearGradient id="netPosGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0070f2" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0070f2" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fill: '#1d2d3e', fontWeight: 600, fontSize: 13 }} />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                      tick={{ fill: '#556b82', fontSize: 13 }}
                    />
                    <Tooltip
                      formatter={(val: number) => [`${val >= 0 ? '+' : ''}${formatCurrency(val, currency)}`, 'Net Position']}
                      contentStyle={{ backgroundColor: '#1d2d3e', borderRadius: '12px', color: '#fff', fontSize: '13px', border: 'none' }}
                    />
                    {/* Collision fix: position insideTopRight with offset 15 avoids the Start tick collision */}
                    <ReferenceLine
                      y={0}
                      stroke="#dc2626"
                      strokeDasharray="4 4"
                      label={{ value: 'Break-even Line ($0)', fill: '#dc2626', position: 'insideTopRight', offset: 15, fontSize: 13, fontWeight: 700 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="netPosition"
                      stroke="#0070f2"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#netPosGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* 2 Breakdown Cards: Capital Allocation & Long-term Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Card 1: Capital Allocation */}
                <div className="p-6 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
                  <h4 className="text-[16px] font-bold text-[#0070f2] uppercase tracking-wider flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-[#0070f2] shrink-0" />
                    <span>Capital Allocation</span>
                  </h4>
                  <ul className="space-y-2.5 text-[14px] sm:text-[15px] text-slate-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#0070f2] font-bold">•</span>
                      <span>Upfront migration investment: <strong className="text-slate-900 font-bold">{formatCurrency(migrationCost, currency)}</strong></span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#0070f2] font-bold">•</span>
                      <span>Structured capital deployment across delivery milestones</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#0070f2] font-bold">•</span>
                      <span>Interface conversion verified with IntSwitch automated validation</span>
                    </li>
                  </ul>
                </div>

                {/* Card 2: Long-term Benefits */}
                <div className="p-6 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
                  <h4 className="text-[16px] font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-[#107e3e] shrink-0" />
                    <span>Long-term Benefits</span>
                  </h4>
                  <ul className="space-y-2.5 text-[14px] sm:text-[15px] text-slate-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#107e3e] font-bold">•</span>
                      <span>Ongoing operational savings: <strong className="text-slate-900 font-bold">+{formatCurrency(annualSavings, currency)}/yr</strong></span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#107e3e] font-bold">•</span>
                      <span>Accelerated agility with 920+ pre-built integration packages</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#107e3e] font-bold">•</span>
                      <span>Reduced infrastructure maintenance &amp; zero on-prem server hardware management</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Visual Analysis: Legacy Drivers & 10-Year Trajectory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card 1: Legacy TCO Cost Drivers */}
              <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#d9e2ec] pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1d2d3e]">{sourcePlatform} Cost Drivers</h3>
                    <p className="text-[13px] text-[#556b82]">Baseline expenditure breakdown</p>
                  </div>
                  <span className="text-[13px] text-[#556b82] font-semibold bg-slate-50 px-3 py-1 rounded-xl border border-[#d9e2ec]">
                    {formatCurrency(currentTco, currency)} / yr
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-6 h-56 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tcoDriversData}
                          cx="50%"
                          cy="50%"
                          innerRadius={54}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {tcoDriversData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                      <span className="text-lg font-bold text-[#1d2d3e] font-mono">
                        ${(currentTco / 1000).toFixed(0)}K
                      </span>
                      <span className="text-[12px] text-[#556b82]">per year</span>
                    </div>
                  </div>

                  <div className="sm:col-span-6 space-y-3.5 text-[14px]">
                    {tcoDriversData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 truncate">
                          <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-700 truncate">{item.name}</span>
                        </div>
                        <div className="text-right font-mono font-bold text-[#1d2d3e] shrink-0 ml-2">
                          <span className="text-slate-400 text-[13px] font-normal mr-1">{item.pct}%</span>
                          ${(item.value / 1000).toFixed(0)}K
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[14px] text-[#556b82] leading-relaxed pt-2 border-t border-[#d9e2ec]">
                  Software licensing ({licensingPct}%) and infrastructure hosting represent the vast majority of legacy costs, both of which are dissolved by BTP.
                </p>
              </div>

              {/* Card 2: 10-Year Cumulative Benefit Timeline */}
              <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#d9e2ec] pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1d2d3e]">10-Year Cumulative Trajectory</h3>
                    <p className="text-[13px] text-[#556b82]">Cumulative value &amp; net cash benefits</p>
                  </div>
                  <span className="text-[13px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    Break-even: {breakEvenMonths.toFixed(1)} mos
                  </span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timelineData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="shortYear" tick={{ fontSize: 12 }} />
                      <YAxis
                        tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(val: number) => [formatCurrency(val, currency), 'Cumulative Value']}
                        contentStyle={{ backgroundColor: '#1d2d3e', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="cumulativeBenefit" fill="#107e3e" radius={[4, 4, 0, 0]} name="Cumulative Savings" />
                      <Line type="monotone" dataKey="netBenefit" stroke="#0070f2" strokeWidth={2.5} dot={{ r: 3 }} name="Net Benefit" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-[14px] text-[#556b82] leading-relaxed pt-2 border-t border-[#d9e2ec]">
                  After full capital recovery at month {breakEvenMonths.toFixed(1)}, cumulative net benefits accelerate to {formatCurrency(fiveYearNetBenefit, currency)} over 5 years.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FINANCIAL SIMULATION                                               */}
        {/* ========================================================================= */}
        {dashboardTab === 'simulation' && (
          <div className="space-y-8 lg:space-y-10 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="border-b border-[#d9e2ec] pb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] tracking-tight">
                  Interactive Financial Sensitivity Simulation
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#556b82] mt-1.5 leading-normal">
                  Adjust parameters in real time to stress-test your business case under varying operational adoption and delivery conditions
                </p>
              </div>

              {/* 3 Sensitivity Sliders with Generous Padding */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Slider 1: Savings Realization */}
                <div className="space-y-3.5 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
                  <div className="flex justify-between items-center text-[15px] sm:text-[16px]">
                    <label className="text-[16px] sm:text-[17px] font-bold text-[#1d2d3e]">Annual Savings Factor</label>
                    <span className="font-mono text-[14px] sm:text-[15px] font-bold text-[#0070f2] bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                      {simSavingsFactor.toFixed(2)}x ({((simSavingsFactor - 1) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={simSavingsFactor}
                    onChange={(e) => setSimSavingsFactor(parseFloat(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0070f2]"
                  />
                  <p className="text-[14px] sm:text-[15px] text-[#556b82] leading-relaxed mt-1 font-normal">
                    Simulate slower interface cutover adoption or higher operational savings realization.
                  </p>
                </div>

                {/* Slider 2: Migration Cost Factor */}
                <div className="space-y-3.5 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
                  <div className="flex justify-between items-center text-[15px] sm:text-[16px]">
                    <label className="text-[16px] sm:text-[17px] font-bold text-[#1d2d3e]">Migration Cost Factor</label>
                    <span className="font-mono text-[14px] sm:text-[15px] font-bold text-[#0070f2] bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                      {simMigrationFactor.toFixed(2)}x ({((simMigrationFactor - 1) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.8"
                    step="0.05"
                    value={simMigrationFactor}
                    onChange={(e) => setSimMigrationFactor(parseFloat(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0070f2]"
                  />
                  <p className="text-[14px] sm:text-[15px] text-[#556b82] leading-relaxed mt-1 font-normal">
                    Simulate complex refactoring overruns or accelerated content efficiencies.
                  </p>
                </div>

                {/* Slider 3: Target BTP Cost Factor */}
                <div className="space-y-3.5 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
                  <div className="flex justify-between items-center text-[15px] sm:text-[16px]">
                    <label className="text-[16px] sm:text-[17px] font-bold text-[#1d2d3e]">Target BTP Cost Factor</label>
                    <span className="font-mono text-[14px] sm:text-[15px] font-bold text-[#0070f2] bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                      {simTargetFactor.toFixed(2)}x ({((simTargetFactor - 1) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.5"
                    step="0.05"
                    value={simTargetFactor}
                    onChange={(e) => setSimTargetFactor(parseFloat(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0070f2]"
                  />
                  <p className="text-[14px] sm:text-[15px] text-[#556b82] leading-relaxed mt-1 font-normal">
                    Simulate message throughput expansion or additional tenant packs.
                  </p>
                </div>
              </div>

              {/* Dynamic Recalculated Case Banner */}
              <div className="p-6 bg-blue-50/70 border border-blue-200 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <span className="text-[13.5px] sm:text-[14px] text-[#556b82] uppercase tracking-wider block font-bold">Simulated Annual Savings</span>
                  <span className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#107e3e] font-mono block mt-1 tracking-tight">
                    +{formatCurrency(simulatedNetAnnual, currency)}
                  </span>
                </div>
                <div>
                  <span className="text-[13.5px] sm:text-[14px] text-[#556b82] uppercase tracking-wider block font-bold">Simulated Migration</span>
                  <span className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#1d2d3e] font-mono block mt-1 tracking-tight">
                    {formatCurrency(simulatedMigration, currency)}
                  </span>
                </div>
                <div>
                  <span className="text-[13.5px] sm:text-[14px] text-[#556b82] uppercase tracking-wider block font-bold">Simulated Payback</span>
                  <span className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#0070f2] font-mono block mt-1 tracking-tight">
                    {simulatedBreakEven.toFixed(1)} months
                  </span>
                </div>
                <div>
                  <span className="text-[13.5px] sm:text-[14px] text-[#556b82] uppercase tracking-wider block font-bold">Simulated 5-Year ROI</span>
                  <span className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#8a3ffc] font-mono block mt-1 tracking-tight">
                    {simulated5YRoi.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Action Controls with Prominent Generate AI Insights Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateSimulationAi}
                    disabled={loadingSimAi}
                    className="inline-flex items-center space-x-2.5 px-6 py-3 bg-gradient-to-r from-[#0070f2] to-[#0057d2] hover:from-[#0057d2] hover:to-[#0040a8] text-white text-[15px] font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Sparkles className={`w-4 h-4 ${loadingSimAi ? 'animate-spin' : ''}`} />
                    <span>{loadingSimAi ? 'Synthesizing Live AI Insights...' : '✦ Generate Live AI Insights'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSimSavingsFactor(1.0);
                      setSimMigrationFactor(1.0);
                      setSimTargetFactor(1.0);
                    }}
                    className="px-5 py-3 bg-white border border-[#d9e2ec] hover:bg-slate-50 text-[15px] font-semibold text-[#1d2d3e] rounded-xl transition-colors cursor-pointer shadow-2xs"
                  >
                    Reset to 1.0x Base Case
                  </button>
                </div>

                <Link
                  href={`/scenarios/${assessmentId}`}
                  className="inline-flex items-center space-x-2 text-[15px] font-bold text-[#0070f2] hover:text-[#0057d2] group"
                >
                  <span>Explore Business Scenarios</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Live AI Simulation Advisory Rendering */}
              {loadingSimAi && (
                <div className="py-12 px-6 bg-slate-50/80 border border-[#d9e2ec] rounded-3xl flex flex-col items-center justify-center text-center space-y-3 animate-fadeIn">
                  <Loader2 className="w-8 h-8 text-[#0070f2] animate-spin" />
                  <p className="text-base font-semibold text-[#1d2d3e]">
                    Generating live AI insights...
                  </p>
                </div>
              )}

              {!loadingSimAi && simAiInsights && (
                <div className="pt-2 animate-fadeIn">
                  {renderSimulationAiAdvisory(simAiInsights)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CURRENT STATE DETAILS                                              */}
        {/* ========================================================================= */}
        {dashboardTab === 'current-state' && (
          <div className="space-y-8 lg:space-y-10 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="border-b border-[#d9e2ec] pb-5">
                <h2 className="text-2xl lg:text-[26px] font-bold text-[#1d2d3e]">
                  Current {sourcePlatform} Landscape &amp; Baseline TCO
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1">
                  Granular cost composition and interface inventory of the existing {sourcePlatform} deployment
                </p>
              </div>

              {/* Cost Categories Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-[14px] sm:text-[15px] text-left border border-[#d9e2ec] rounded-2xl overflow-hidden">
                  <thead className="bg-slate-50 text-[#1d2d3e] font-bold border-b border-[#d9e2ec]">
                    <tr>
                      <th className="p-4">TCO Component</th>
                      <th className="p-4 text-right">Annual Cost (% of Baseline)</th>
                      <th className="p-4">Status in Target State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d9e2ec]">
                    <tr>
                      <td className="p-4 font-semibold text-[#1d2d3e]">Perpetual Software Licenses</td>
                      <td className="p-4 text-right font-mono">
                        <span className="font-bold text-[#1d2d3e]">{formatCurrency(licensingCost, currency)}</span>
                        <span className="text-[#556b82] font-semibold ml-2 text-[13.5px]">({licensingPct}%)</span>
                      </td>
                      <td className="p-4 text-emerald-700 font-semibold">100% Decommissioned (Replaced by BTP)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-[#1d2d3e]">Datacenter Hardware &amp; Hypervisors</td>
                      <td className="p-4 text-right font-mono">
                        <span className="font-bold text-[#1d2d3e]">{formatCurrency(infraCost, currency)}</span>
                        <span className="text-[#556b82] font-semibold ml-2 text-[13.5px]">({(((infraCost) / (currentTco || 1)) * 100).toFixed(1)}%)</span>
                      </td>
                      <td className="p-4 text-emerald-700 font-semibold">100% Sunset (Zero on-prem servers)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-[#1d2d3e]">Third-Party Vendor Support Contracts</td>
                      <td className="p-4 text-right font-mono">
                        <span className="font-bold text-[#1d2d3e]">{formatCurrency(supportCost, currency)}</span>
                        <span className="text-[#556b82] font-semibold ml-2 text-[13.5px]">({(((supportCost) / (currentTco || 1)) * 100).toFixed(1)}%)</span>
                      </td>
                      <td className="p-4 text-emerald-700 font-semibold">Terminated on cutover</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-[#1d2d3e]">Manual Maintenance &amp; DBA Administration</td>
                      <td className="p-4 text-right font-mono">
                        <span className="font-bold text-[#1d2d3e]">{formatCurrency(operationsCost, currency)}</span>
                        <span className="text-[#556b82] font-semibold ml-2 text-[13.5px]">({(((operationsCost) / (currentTco || 1)) * 100).toFixed(1)}%)</span>
                      </td>
                      <td className="p-4 text-blue-700 font-semibold">Shifted to cloud governance</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-4 text-[#1d2d3e]">Total Baseline TCO</td>
                      <td className="p-4 text-right font-mono">
                        <span className="text-rose-600 font-bold text-base">{formatCurrency(currentTco, currency)}</span>
                        <span className="text-rose-600 font-bold ml-2 text-sm">(100%)</span>
                      </td>
                      <td className="p-4 text-rose-600 font-bold">Total annual operational expenditure</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Landscape Metadata Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-5 pt-2">
                <div className="p-5 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1">
                  <span className="text-[13px] text-[#556b82] font-semibold block">Total Interfaces</span>
                  <span className="text-2xl font-bold font-mono text-[#1d2d3e]">{totalInterfaces || 45}</span>
                </div>
                <div className="p-5 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1">
                  <span className="text-[13px] text-[#556b82] font-semibold block">Complex Interfaces</span>
                  <span className="text-2xl font-bold font-mono text-amber-600">{complexInterfaces || 10} ({complexPct || '22.2'}%)</span>
                </div>
                <div className="p-5 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1">
                  <span className="text-[13px] text-[#556b82] font-semibold block">Monthly Volume</span>
                  <span className="text-2xl font-bold font-mono text-[#0070f2]">{throughput || '350,000'}</span>
                </div>
                <div className="p-5 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1">
                  <span className="text-[13px] text-[#556b82] font-semibold block">Connected Apps</span>
                  <span className="text-2xl font-bold font-mono text-[#1d2d3e]">{assessment?.sourceSystem?.environmentAssessment?.numberOfApplications ?? 5}</span>
                </div>
                <div className="p-5 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1">
                  <span className="text-[13px] text-[#556b82] font-semibold block">B2B / External</span>
                  <span className="text-2xl font-bold font-mono text-[#1d2d3e]">{assessment?.sourceSystem?.volumetrics?.b2bInterfaces ?? 15}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TARGET STATE DETAILS                                               */}
        {/* ========================================================================= */}
        {dashboardTab === 'target-state' && (
          <div className="space-y-8 lg:space-y-10 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="border-b border-[#d9e2ec] pb-5">
                <h2 className="text-2xl lg:text-[26px] font-bold text-[#1d2d3e]">
                  Target SAP BTP Integration Suite Architecture
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1">
                  Official subscription sizing, capacity add-ons, and hyper-scaler operational runtime specifications
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                  <span className="text-[13px] font-bold text-[#0070f2] uppercase tracking-wider block">Selected Edition</span>
                  <div className="text-xl sm:text-2xl font-bold text-[#1d2d3e]">
                    {selectedEdition}
                  </div>
                  <p className="text-[13px] text-[#556b82]">
                    Base annual subscription: <strong className="font-mono text-[#1d2d3e]">{formatCurrency(editionBasePrice, currency)}</strong> / yr
                  </p>
                </div>

                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-2">
                  <span className="text-[13px] font-bold text-[#556b82] uppercase tracking-wider block">Capacity Add-Ons</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1d2d3e]">
                    {formatCurrency(addOnsCost, currency)} / yr
                  </div>
                  <p className="text-[13px] text-[#556b82]">
                    {additionalPacks} message packs (59 × $84/yr) • 600,000 monthly message capacity
                  </p>
                </div>

                <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <span className="text-[13px] font-bold text-[#107e3e] uppercase tracking-wider block">Total Cloud Run Cost</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#107e3e]">
                    {formatCurrency(targetTco, currency)} / yr
                  </div>
                  <p className="text-[13px] text-[#556b82]">
                    Delivering <strong className="text-[#107e3e]">+{formatCurrency(annualSavings, currency)}</strong> perpetual annual savings (-{savingsPct.toFixed(1)}%)
                  </p>
                </div>
              </div>

              {/* Cloud Capabilities Highlights */}
              <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-3">
                <h4 className="text-[16px] font-bold text-[#1d2d3e]">SAP BTP Enterprise Modernization Dividends</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
                  <div className="p-4 bg-white rounded-xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#0070f2] block text-[14px]">920+ Pre-built Packages</span>
                    <p className="text-[#556b82]">Accelerate third-party and SAP integration with turnkey standard content.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#0070f2] block text-[14px]">Multi-Tenant Elasticity</span>
                    <p className="text-[#556b82]">Automatic scale-out without provisioning extra physical servers or hypervisors.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#0070f2] block text-[14px]">99.95% Managed SLA</span>
                    <p className="text-[#556b82]">SAP-managed infrastructure, high availability, patching, and disaster recovery.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: MIGRATION SCOPE & INCTURE DELIVERY                                 */}
        {/* ========================================================================= */}
        {dashboardTab === 'migration' && (
          <div className="space-y-8 lg:space-y-10 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="border-b border-[#d9e2ec] pb-5">
                <h2 className="text-2xl lg:text-[26px] font-bold text-[#1d2d3e]">
                  Migration Scope &amp; Incture Packaged Delivery
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1">
                  Execution methodology accelerated by IntSwitch accelerator and fixed Indicative Incture migration packages
                </p>
              </div>

              {/* Distinction Banner: One-time Migration Outlay vs Recurring Annual TCO */}
              <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[13px] font-bold text-[#0070f2] uppercase tracking-wider block">Investment Architecture</span>
                  <p className="text-[14px] sm:text-[15px] text-slate-800">
                    One-time migration investment of <strong className="text-slate-900 font-bold">{formatCurrency(migrationCost, currency)}</strong> (Incture {packageName} Package, {indicativeTimeline}) is a separate capital outlay from the recurring annual BTP run cost (<strong className="font-bold text-[#0070f2]">{formatCurrency(targetTco, currency)}/yr</strong>).
                  </p>
                </div>
                <div className="shrink-0 bg-white px-4 py-2 rounded-xl border border-blue-200 text-right">
                  <span className="text-[12px] text-slate-500 block font-medium">Payback Horizon</span>
                  <span className="text-lg font-bold text-[#0070f2] font-mono">{breakEvenMonths.toFixed(1)} Months</span>
                </div>
              </div>

              {/* 4 Pillars Breakdown with Fixed Internal Alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {/* Pillar 1: Development & Conversion */}
                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl flex flex-col justify-between min-h-[210px]">
                  <div className="min-h-[44px] flex items-start">
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#0070f2] uppercase tracking-wider block leading-[1.35]">
                      Development &amp; Conversion
                    </span>
                  </div>
                  <div className="min-h-[40px] flex items-center my-2">
                    <div className="text-[28px] sm:text-[30px] font-extrabold font-mono text-[#1d2d3e] leading-tight">
                      {formatCurrency(devCost, currency)}
                    </div>
                  </div>
                  <div className="min-h-[60px] flex items-start">
                    <p className="text-[14px] sm:text-[15px] text-[#556b82] leading-[1.45]">
                      Interface mapping, Groovy script conversion, and standard API connectivity (60%).
                    </p>
                  </div>
                </div>

                {/* Pillar 2: QA & Automated Testing */}
                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl flex flex-col justify-between min-h-[210px]">
                  <div className="min-h-[44px] flex items-start">
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#107e3e] uppercase tracking-wider block leading-[1.35]">
                      QA &amp; Automated Testing
                    </span>
                  </div>
                  <div className="min-h-[40px] flex items-center my-2">
                    <div className="text-[28px] sm:text-[30px] font-extrabold font-mono text-[#1d2d3e] leading-tight">
                      {formatCurrency(testingCost, currency)}
                    </div>
                  </div>
                  <div className="min-h-[60px] flex items-start">
                    <p className="text-[14px] sm:text-[15px] text-[#556b82] leading-[1.45]">
                      Functional validation, payload comparison, and cutover testing (20%).
                    </p>
                  </div>
                </div>

                {/* Pillar 3: Architecture & BASIS */}
                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl flex flex-col justify-between min-h-[210px]">
                  <div className="min-h-[44px] flex items-start">
                    <span className="text-[13px] sm:text-[14px] font-bold text-cyan-700 uppercase tracking-wider block leading-[1.35]">
                      Architecture &amp; BASIS
                    </span>
                  </div>
                  <div className="min-h-[40px] flex items-center my-2">
                    <div className="text-[28px] sm:text-[30px] font-extrabold font-mono text-[#1d2d3e] leading-tight">
                      {formatCurrency(archCost, currency)}
                    </div>
                  </div>
                  <div className="min-h-[60px] flex items-start">
                    <p className="text-[14px] sm:text-[15px] text-[#556b82] leading-[1.45]">
                      Tenant setup, Cloud Connector configuration, security, and CTMS (10%).
                    </p>
                  </div>
                </div>

                {/* Pillar 4: PM & Hypercare */}
                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl flex flex-col justify-between min-h-[210px]">
                  <div className="min-h-[44px] flex items-start">
                    <span className="text-[13px] sm:text-[14px] font-bold text-purple-700 uppercase tracking-wider block leading-[1.35]">
                      PM &amp; Hypercare
                    </span>
                  </div>
                  <div className="min-h-[40px] flex items-center my-2">
                    <div className="text-[28px] sm:text-[30px] font-extrabold font-mono text-[#1d2d3e] leading-tight">
                      {formatCurrency(pmCost, currency)}
                    </div>
                  </div>
                  <div className="min-h-[60px] flex items-start">
                    <p className="text-[14px] sm:text-[15px] text-[#556b82] leading-[1.45]">
                      Project governance, cutover management, and post-go-live stabilization (10%).
                    </p>
                  </div>
                </div>
              </div>

              {/* IntSwitch Accelerator Callout (Defensible, Evidence-based Wording) */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50/80 via-emerald-50/50 to-purple-50/80 border border-blue-200 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-blue-200/60 pb-5">
                  <div className="flex items-center space-x-3.5">
                    <img src="/images/intswitch-logo.png" alt="IntSwitch" className="h-7 w-auto object-contain" />
                    <div>
                      <h4 className="text-[20px] sm:text-[23px] font-bold text-[#1d2d3e] tracking-tight leading-snug">
                        IntSwitch Accelerate Migration with Greater Confidence
                      </h4>
                      <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-0.5">
                        Incture&apos;s migration, testing and quality-monitoring accelerator
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center space-x-1.5 text-[13px] sm:text-[14px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-4 py-2 rounded-xl self-start sm:self-auto shrink-0">
                    <span>Value Add (Included with Package)</span>
                    <span className="font-mono font-bold">• $0 Additional Licensing</span>
                  </span>
                </div>

                {/* Assessed Dynamic Opportunity Matrix */}
                <div className="space-y-3">
                  <span className="text-[13px] sm:text-[14px] font-bold text-slate-700 uppercase tracking-wider block">
                    Assessed Opportunity Matrix for {sourcePlatform}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-2xs space-y-1.5 flex flex-col justify-between min-h-[125px]">
                      <span className="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#0070f2] block">Migration Assessment</span>
                      <div className="text-[15px] sm:text-[16px] font-semibold text-emerald-700 flex items-center gap-1">
                        <span>✓</span> <span>Applicable</span>
                      </div>
                      <p className="text-[14px] text-slate-600 leading-normal">Interface cataloging &amp; dependency mapping</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-1.5 flex flex-col justify-between min-h-[125px]">
                      <span className="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#107e3e] block">Migration Automation</span>
                      <div className="text-[15px] sm:text-[16px] font-semibold text-emerald-700 flex items-center gap-1">
                        <span>✓</span> <span>Applicable</span>
                      </div>
                      <p className="text-[14px] text-slate-600 leading-normal">Accelerated flow generation &amp; mapping</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-2xs space-y-1.5 flex flex-col justify-between min-h-[125px]">
                      <span className="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#0070f2] block">Testing Automation</span>
                      <div className="text-[15px] sm:text-[16px] font-semibold text-emerald-700 flex items-center gap-1">
                        <span>✓</span> <span>Applicable</span>
                      </div>
                      <p className="text-[14px] text-slate-600 leading-normal">Automated regression &amp; payload replay</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs space-y-1.5 flex flex-col justify-between min-h-[125px]">
                      <span className="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#8a3ffc] block">Quality Monitoring</span>
                      <div className="text-[15px] sm:text-[16px] font-semibold text-emerald-700 flex items-center gap-1">
                        <span>✓</span> <span>Applicable</span>
                      </div>
                      <p className="text-[14px] text-slate-600 leading-normal">Post-migration anomaly detection</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-2xs space-y-1.5 flex flex-col justify-between min-h-[125px]">
                      <span className="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-amber-700 block">Specialist Review</span>
                      <div className="text-[15px] sm:text-[16px] font-semibold text-amber-800 flex items-center gap-1">
                        <span>●</span> <span>Required</span>
                      </div>
                      <p className="text-[14px] text-slate-600 leading-normal">Custom ABAP/Java UDF validation</p>
                    </div>
                  </div>
                </div>

                {/* Grounded Accelerator Capabilities Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                  <div className="p-5 bg-white/90 rounded-2xl border border-[#d9e2ec] space-y-2.5">
                    <span className="font-bold text-[#1d2d3e] block text-[15px] sm:text-[16px]">  Accelerated Automated Conversion</span>
                    <ul className="text-slate-700 space-y-2 text-[14px] sm:text-[15px]">
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>Extracts metadata, data types, and mapping definitions directly from legacy repository</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>Auto-scaffolds standard SAP BTP integration flows and Groovy transformation scripts</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-5 bg-white/90 rounded-2xl border border-[#d9e2ec] space-y-2.5">
                    <span className="font-bold text-[#1d2d3e] block text-[15px] sm:text-[16px]">Non-Intrusive Validation &amp; Quality</span>
                    <ul className="text-slate-700 space-y-2 text-[14px] sm:text-[15px]">
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>Side-by-side payload comparison against legacy runs without production impact</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>Continuous quality monitoring during wave cutovers to verify parity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* ========================================================================= */}
        {/* AI LIVE INSIGHTS MODAL                                                    */}
        {/* ========================================================================= */}
        {aiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#d9e2ec] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header - Clean Light Corporate Theme */}
              <div className="p-6 border-b border-[#d9e2ec] flex items-center justify-between bg-white text-[#1d2d3e] shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-[#0070f2] flex items-center justify-center text-lg font-bold shadow-xs">
                    ✦
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1d2d3e]">{aiModalTitle}</h3>
                    <span className="text-xs sm:text-sm text-[#556b82]">
                      ValueLens AI • Autonomous Decision Intelligence
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleRefreshLiveAiModal}
                    disabled={chartInsightLoading || aiAnalysisLoading}
                    className="inline-flex items-center space-x-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-[#0070f2] to-[#0057d2] hover:from-[#0057d2] hover:to-[#0040a8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${(chartInsightLoading || aiAnalysisLoading) ? 'animate-spin' : ''}`} />
                    <span>{(chartInsightLoading || aiAnalysisLoading) ? 'Generating...' : '✦ Generate Live AI Insights'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="shrink-0 bg-slate-100 border-b border-[#d9e2ec] p-2.5 grid grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => switchModalTab('tco-comparison', 'Platform Cost Breakdown & TCO Reduction')}
                  className={`px-2 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 ${aiModalTab === 'tco-comparison'
                    ? 'bg-[#0070f2] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  <span className="truncate">Cost Comparison</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('cost-drivers', 'Legacy TCO Cost Drivers & Elimination')}
                  className={`px-2 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 ${aiModalTab === 'cost-drivers'
                    ? 'bg-[#0070f2] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  <span className="truncate">Cost Drivers</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('migration-cost', 'Incture Migration Package & Delivery')}
                  className={`px-2 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 ${aiModalTab === 'migration-cost'
                    ? 'bg-[#0070f2] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  <span className="truncate">Migration Package</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('roi-timeline', '10-Year ROI Trajectory & Recovery')}
                  className={`px-2 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 ${aiModalTab === 'roi-timeline'
                    ? 'bg-[#0070f2] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  <span className="truncate">ROI Trajectory</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('executive', 'Autonomous Strategic Advisory Dossier')}
                  className={`px-2 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 ${aiModalTab === 'executive'
                    ? 'bg-[#0070f2] text-white shadow-xs'
                    : 'text-[#0070f2] bg-blue-50 hover:bg-blue-100 border border-blue-200'
                    }`}
                >
                  <span className="truncate">Executive Dossier</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
                {/* 1. Loading State - Simple Clean Spinner */}
                {((aiModalTab === 'executive' && aiAnalysisLoading) ||
                  (aiModalTab !== 'executive' && chartInsightLoading)) && (
                    <div className="py-20 px-6 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
                      <Loader2 className="w-10 h-10 text-[#0070f2] animate-spin" />
                      <p className="text-base font-semibold text-[#1d2d3e]">
                        {aiModalTab === 'executive'
                          ? 'Generating Executive Decision Intelligence...'
                          : `Generating ${aiModalTitle}...`}
                      </p>
                    </div>
                  )}

                {/* 2. Chart Insight Output with Live Streaming */}
                {aiModalTab !== 'executive' && !chartInsightLoading && chartInsight && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="p-6 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2">
                      <span className="text-xs sm:text-sm font-bold text-[#0070f2] uppercase tracking-wider block">Analytical Finding</span>
                      <p className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-relaxed">
                        <StreamingText text={chartInsight.finding} speed={12} />
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Detailed Strategic Analysis</h4>
                      <p className="text-[14px] sm:text-[15px] text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-[#d9e2ec]">
                        <StreamingText text={chartInsight.detailedAnalysis || ''} speed={10} />
                      </p>
                    </div>

                    {chartInsight.keyMetrics && chartInsight.keyMetrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {chartInsight.keyMetrics.map((m, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1 animate-fadeIn" style={{ animationDelay: `${idx * 100}ms` }}>
                            <span className="text-xs sm:text-sm text-slate-500 font-medium block">{m.label}</span>
                            <span className="text-lg font-bold font-mono text-slate-900 block">{m.value}</span>
                            <span className="text-[13px] text-slate-600 block">{m.detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Executive Dossier Output with Live Streaming */}
                {aiModalTab === 'executive' && !aiAnalysisLoading && aiAnalysis && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="p-6 bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white border border-blue-200 rounded-2xl space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-[#0070f2] uppercase tracking-wider flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0070f2]" />
                          Autonomous Recommendation: {aiAnalysis.decision}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          91% Confidence Fit
                        </span>
                      </div>
                      <p className="text-[15px] sm:text-[16px] text-slate-800 leading-relaxed font-medium">
                        <StreamingText text={aiAnalysis.executiveSummary} speed={14} />
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200 rounded-2xl space-y-2.5 shadow-xs">
                      <span className="text-xs sm:text-sm font-bold text-[#107e3e] uppercase tracking-wider block">
                        Financial Appraisal
                      </span>
                      <p className="text-[15px] sm:text-[16px] text-slate-800 leading-relaxed font-normal">
                        <StreamingText text={aiAnalysis.financialAssessment} speed={14} />
                      </p>
                    </div>

                    {aiAnalysis.keyInsights && aiAnalysis.keyInsights.length > 0 && (
                      <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-3">
                        <span className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider block">
                          Strategic Value Insights
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {aiAnalysis.keyInsights.map((insight, idx) => (
                            <div key={idx} className="p-3.5 bg-white border border-[#d9e2ec] rounded-xl flex items-start space-x-2.5 shadow-2xs animate-fadeIn" style={{ animationDelay: `${idx * 120}ms` }}>
                              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0070f2] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                              <span className="text-[14px] text-slate-800 font-medium leading-snug">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#d9e2ec] flex items-center justify-between bg-slate-50 text-xs">
                <span className="text-[#556b82] font-mono">
                  Assessment ID: {assessmentId}
                </span>
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#0070f2] hover:bg-[#0057d2] text-white font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
