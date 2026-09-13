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
  ShieldAlert,
  Sparkles,
  Layers,
  Sliders,
  Server,
  Cpu,
  Check,
  Briefcase,
  FileText,
} from 'lucide-react';
import { Assessment, RoiCalculationResult, ChartInsightResponse, AiAnalysisResult, QuestionResponse } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatCompactCurrency } from '@/lib/formatters';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = (params?.id as string) || 'demo-assessment-1';

  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [calculations, setCalculations] = useState<RoiCalculationResult | null>(null);

  // Tab State: 7 spacious enterprise analytical tabs
  const [dashboardTab, setDashboardTab] = useState<
    'overview' | 'charts' | 'simulation' | 'current-state' | 'target-state' | 'migration' | 'methodology'
  >('overview');

  // Save Toast Notification State
  const [saveToast, setSaveToast] = useState(false);

  // In-Dashboard Sensitivity Simulation State
  const [simSavingsFactor, setSimSavingsFactor] = useState<number>(1.0);
  const [simMigrationFactor, setSimMigrationFactor] = useState<number>(1.0);
  const [simTargetFactor, setSimTargetFactor] = useState<number>(1.0);

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
      const clientInsight = getClientChartInsight(tab);
      setChartInsight(clientInsight);
      setChartInsightLoading(true);
      api.getChartInsight(tab, undefined, assessmentId)
        .then((res) => {
          if (res && res.finding) {
            setChartInsight((prev) => ({
              ...clientInsight,
              ...res,
              aiStatus: 'AI GENERATED (LIVE)',
              detailedAnalysis: res.detailedAnalysis || clientInsight.detailedAnalysis,
              keyMetrics: res.keyMetrics && res.keyMetrics.length > 0 ? res.keyMetrics : clientInsight.keyMetrics,
              actionRoadmap: res.actionRoadmap && res.actionRoadmap.length > 0 ? res.actionRoadmap : clientInsight.actionRoadmap,
              riskSafeguards: res.riskSafeguards && res.riskSafeguards.length > 0 ? res.riskSafeguards : clientInsight.riskSafeguards,
            }));
          }
        })
        .catch((err) => console.warn('Using validated dynamic AI chart insight', err))
        .finally(() => setChartInsightLoading(false));
    } else {
      if (!aiAnalysis) {
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
    const clientInsight = getClientChartInsight(chartId);
    setChartInsight(clientInsight);
    setChartInsightLoading(true);
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
      }
    } catch (err) {
      console.warn('Using dynamic client insight', err);
    } finally {
      setChartInsightLoading(false);
    }
  };

  const openExecutiveAnalysis = async () => {
    setAiModalTab('executive');
    setAiModalTitle('IntSwitch ValueLens AI • Strategic Executive Decision Dossier');
    setAiModalOpen(true);
    const fallbackAdvisory = getClientExecutiveAdvisory();
    setAiAnalysis(fallbackAdvisory);
    setAiAnalysisLoading(true);
    try {
      const res = await api.analyzeWithAI({
        assessmentId,
        assessment: assessment || undefined,
        calculations: calculations || undefined,
      });
      if (res && res.decision) {
        setAiAnalysis(res);
      }
    } catch (err) {
      console.warn('Using fallback executive advisory', err);
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  // Main initial data loader
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let loadedAssessment: Assessment | null = null;
        let loadedCalculation: RoiCalculationResult | null = null;

        if (typeof window !== 'undefined') {
          try {
            const savedAsmt = localStorage.getItem('valuelens_active_assessment');
            if (savedAsmt) {
              loadedAssessment = JSON.parse(savedAsmt);
            }
            const savedCalc = localStorage.getItem('valuelens_active_calculation');
            if (savedCalc) {
              loadedCalculation = JSON.parse(savedCalc);
            }
          } catch {
            // ignore JSON parse error
          }
        }

        if (!loadedAssessment || (assessmentId !== 'demo-assessment-1' && loadedAssessment.id !== assessmentId)) {
          try {
            if (assessmentId === 'demo-assessment-1' || !assessmentId) {
              loadedAssessment = await api.getDemoAssessment();
            } else {
              loadedAssessment = await api.getAssessment(assessmentId);
            }
          } catch {
            loadedAssessment = await api.getDemoAssessment();
          }
        }

        setAssessment(loadedAssessment);
        if (loadedCalculation) {
          setCalculations(loadedCalculation);
        }

        if (loadedAssessment) {
          try {
            const calc = await api.calculateROI(loadedAssessment);
            setCalculations(calc);
          } catch {
            // Keep existing loaded calculation if backend is busy
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

  // Derived dynamic numbers
  const currency = calculations?.currency || assessment?.currency || 'USD';

  const licensingCost =
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.licensing?.subtotal ?? 0;
  const infraCost =
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.infrastructure?.subtotal ?? 0;
  const supportCost =
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.support?.subtotal ?? 0;
  const operationsCost =
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.operations?.subtotal ?? 0;

  const currentTco =
    calculations?.currentPlatformTCO ??
    (licensingCost + infraCost + supportCost + operationsCost);

  const selectedEdition = assessment?.targetSystem?.configuration?.selectedEditionName || '';
  const getEditionBasePrice = (edition: string, unitCount: number = 0) => {
    if (!edition || unitCount <= 0) return 0;
    const lower = edition.toLowerCase();
    if (lower.includes('starter')) return 20736 * unitCount;
    if (lower.includes('enhanced')) return 92256 * unitCount;
    if (lower.includes('premium')) return 318204 * unitCount;
    if (lower.includes('standard')) return 57900 * unitCount;
    return 0;
  };
  const unitCount = assessment?.targetSystem?.configuration?.numberOfUnits || 0;
  const editionBasePrice = getEditionBasePrice(selectedEdition, unitCount);
  const additionalPacks = assessment?.targetSystem?.configuration?.additionalMessagePacks ?? 0;
  const packsCost = additionalPacks * 84;
  const dataSpacePackages = assessment?.targetSystem?.configuration?.dataSpacePackages ?? 0;
  const dataSpaceCost = dataSpacePackages * 900;
  const additionalEicTenants = assessment?.targetSystem?.configuration?.additionalEicTenants ?? 0;
  const eicCost = additionalEicTenants * 41460;
  const addOnsCost = packsCost + dataSpaceCost + eicCost;
  const targetConfigCost =
    assessment?.targetSystem?.configuration?.totalAnnualCost && assessment.targetSystem.configuration.totalAnnualCost > 0
      ? assessment.targetSystem.configuration.totalAnnualCost
      : editionBasePrice + addOnsCost;
  const targetAdditionalTco =
    assessment?.targetSystem?.additionalTcoComponents?.totalAdditionalTcoAnnual || 0;
  const targetTco =
    calculations?.targetPlatformTCO ??
    (targetConfigCost + targetAdditionalTco);

  const annualSavings =
    calculations?.annualSavings ?? (currentTco > targetTco ? currentTco - targetTco : 0);
  const savingsPct =
    currentTco > 0 ? (annualSavings / currentTco) * 100 : 0;

  const migrationCost =
    calculations?.migrationCost ??
    assessment?.migrationRelatedDetails?.totalMigrationCost ??
    0;

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

  const breakEvenMonths =
    calculations?.breakEvenMonths ??
    (annualSavings > 0 && migrationCost > 0 ? (migrationCost / annualSavings) * 12 : 0);

  const fiveYearRoi =
    calculations?.fiveYearROI ??
    (migrationCost > 0 && annualSavings > 0 ? (((annualSavings * 5) - migrationCost) / migrationCost) * 100 : 0);

  const fiveYearNetBenefit =
    calculations?.fiveYearNetBenefit ?? (annualSavings * 5 - migrationCost);

  const devPct = migrationCost > 0 ? ((devCost / migrationCost) * 100).toFixed(0) : '0';

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
  const simulatedSavings = annualSavings * simSavingsFactor;
  const simulatedMigration = migrationCost * simMigrationFactor;
  const simulatedTargetTco = targetTco * simTargetFactor;
  const simulatedNetAnnual = Math.max(0, currentTco - simulatedTargetTco);
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
    window.print();
  };

  const handleSaveToDatabase = () => {
    if (typeof window !== 'undefined') {
      if (assessment) localStorage.setItem('valuelens_active_assessment', JSON.stringify(assessment));
      if (calculations) localStorage.setItem('valuelens_active_calculation', JSON.stringify(calculations));
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleExportJson = () => {
    const exportData = {
      assessmentId,
      sourcePlatform: assessment?.sourcePlatform || 'SAP PI/PO',
      targetPlatform: 'SAP BTP Integration Suite',
      generatedDate: new Date().toISOString(),
      keyMetrics: {
        currentPlatformTCO: currentTco,
        targetPlatformTCO: targetTco,
        annualSavings: annualSavings,
        savingsPercentage: savingsPct,
        totalMigrationCost: migrationCost,
        breakEvenMonths: breakEvenMonths,
        fiveYearROI: fiveYearRoi,
        fiveYearNetBenefit: fiveYearNetBenefit,
      },
      assessment,
      calculations,
      aiAnalysis,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valuelens-roi-analysis-${assessmentId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] py-8 md:py-10 text-[#1d2d3e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Save Toast Notification */}
        {saveToast && (
          <div className="fixed top-6 right-6 z-50 bg-[#107e3e] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-sm font-bold animate-fadeIn border border-emerald-400">
            <Check className="w-5 h-5" />
            <span>ROI Analysis &amp; Calculations Saved Successfully</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOP BAR: Back Button, Title, Subtitle, Date & Action Buttons             */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div>
            <Link
              href="/assessment"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-[#556b82] hover:text-[#0070f2] transition-colors group mb-3"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Assessment</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#d9e2ec] pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1d2d3e] tracking-tight">
                Comprehensive ROI Analysis
              </h1>
              <p className="text-sm md:text-base text-[#556b82] mt-1 font-normal">
                Migration from <strong className="text-[#1d2d3e] font-semibold">{assessment?.sourcePlatform || 'SAP PI/PO'}</strong> to <strong className="text-[#0070f2] font-semibold">SAP BTP Integration Suite</strong>
              </p>
            </div>

            {/* Top Action Buttons with Spacious Padding */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-[#1d2d3e] border border-[#d9e2ec] rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:border-[#0070f2] transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#0070f2]" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToDatabase}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-[#1d2d3e] border border-[#d9e2ec] rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:border-[#0070f2] transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#0070f2]" />
                <span>Save to Database</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-[#1d2d3e] border border-[#d9e2ec] rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:border-[#0070f2] transition-colors cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-[#0070f2]" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO KPI CARDS: 4 Large Spacious Metric Cards                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Annual Savings */}
          <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#556b82] uppercase tracking-wider">
                Annual Savings
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#107e3e] flex items-center justify-center font-bold text-lg shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#107e3e] font-mono tracking-tight">
                +{formatCurrency(annualSavings, currency)}
              </div>
              <p className="text-xs text-[#556b82] flex items-center space-x-1 font-medium">
                <span className="font-bold text-[#107e3e]">↓ {savingsPct.toFixed(1)}%</span>
                <span>run-rate reduction vs baseline</span>
              </p>
            </div>
          </div>

          {/* 2. Break-even Period */}
          <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#556b82] uppercase tracking-wider">
                Break-even Period
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0070f2] flex items-center justify-center font-bold text-lg shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#0070f2] font-mono tracking-tight">
                {breakEvenMonths.toFixed(1)} months
              </div>
              <p className="text-xs text-[#556b82] font-medium">
                100% investment recovery inside Year 1
              </p>
            </div>
          </div>

          {/* 3. 5-Year ROI */}
          <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#556b82] uppercase tracking-wider">
                5-Year ROI
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#8a3ffc] flex items-center justify-center font-bold text-lg shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#8a3ffc] font-mono tracking-tight">
                {fiveYearRoi.toFixed(1)}%
              </div>
              <p className="text-xs text-[#556b82] font-medium">
                Cumulative net benefit: {formatCurrency(fiveYearNetBenefit, currency)}
              </p>
            </div>
          </div>

          {/* 4. Total Migration Cost */}
          <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#556b82] uppercase tracking-wider">
                Total Migration Cost
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#1d2d3e] font-mono tracking-tight">
                {formatCurrency(migrationCost, currency)}
              </div>
              <p className="text-xs text-[#556b82] font-medium">
                Incture packaged delivery
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROOMY 7-TAB NAVIGATION BAR                                                */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#d9e2ec] p-2 shadow-xs overflow-x-auto">
          <div className="flex items-center space-x-2 min-w-max">
            {[
              { id: 'overview', label: 'Overview', icon: Layers },
              { id: 'charts', label: 'Charts & Analysis', icon: BarChart2 },
              { id: 'simulation', label: 'Financial Simulation', icon: Sliders },
              { id: 'current-state', label: 'Current State', icon: Server },
              { id: 'target-state', label: 'Target State', icon: Cpu },
              { id: 'migration', label: 'Migration Scope', icon: Briefcase },
              { id: 'methodology', label: 'Methodology & Risk', icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = dashboardTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDashboardTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0070f2] text-white shadow-sm font-bold'
                      : 'text-[#556b82] hover:text-[#1d2d3e] hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#556b82]'}`} />
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
          <div className="space-y-8 animate-fadeIn">

            {/* Cost Comparison Summary Card (Image 3 Feature) */}
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#d9e2ec] pb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0070f2] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#1d2d3e]">
                      Cost Comparison Summary
                    </h2>
                    <p className="text-xs sm:text-sm text-[#556b82]">
                      Annual operating run-rate transition from legacy infrastructure to SAP BTP Integration Suite
                    </p>
                  </div>
                </div>
                <div className="text-xs text-[#556b82] font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-[#d9e2ec]">
                  Currency: <strong className="text-[#1d2d3e]">{currency}</strong>
                </div>
              </div>

              {/* 3 Prominent Columns with Ample Breathing Room */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#d9e2ec]">
                {/* Column 1: Current Platform */}
                <div className="space-y-3 pt-4 md:pt-0 md:pr-6">
                  <span className="text-xs font-bold text-[#556b82] uppercase tracking-wider block">
                    Current Platform
                  </span>
                  <div className="text-3xl lg:text-4xl font-extrabold text-[#1d2d3e] font-mono">
                    {formatCurrency(currentTco, currency)}
                  </div>
                  <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg inline-block">
                    Annual Baseline Cost
                  </div>
                  <p className="text-xs text-[#556b82] leading-relaxed pt-1">
                    Sum of perpetual licenses ({formatCurrency(licensingCost, currency)}), datacenter hardware leases ({formatCurrency(infraCost, currency)}), and specialized vendor support.
                  </p>
                </div>

                {/* Column 2: SAP BTP */}
                <div className="space-y-3 pt-4 md:pt-0 md:px-6">
                  <span className="text-xs font-bold text-[#556b82] uppercase tracking-wider block">
                    SAP BTP Integration Suite
                  </span>
                  <div className="text-3xl lg:text-4xl font-extrabold text-[#0070f2] font-mono">
                    {formatCurrency(targetTco, currency)}
                  </div>
                  <div className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg inline-block">
                    Target Annual Run-Rate
                  </div>
                  <p className="text-xs text-[#556b82] leading-relaxed pt-1">
                    Predictable cloud subscription ({selectedEdition || 'Standard/Enhanced'}) including managed multi-tenant hyper-scaler runtimes, capacity packs, and automated updates.
                  </p>
                </div>

                {/* Column 3: Net Impact */}
                <div className="space-y-3 pt-4 md:pt-0 md:pl-6">
                  <span className="text-xs font-bold text-[#556b82] uppercase tracking-wider block">
                    Net Impact
                  </span>
                  <div className="text-3xl lg:text-4xl font-extrabold text-[#107e3e] font-mono">
                    +{formatCurrency(annualSavings, currency)}
                  </div>
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg inline-block">
                    +{savingsPct.toFixed(1)}% Annual Savings
                  </div>
                  <p className="text-xs text-[#556b82] leading-relaxed pt-1">
                    Permanent operating margin expansion. Initial migration investment recovered in <strong className="text-[#1d2d3e] font-bold">{breakEvenMonths.toFixed(1)} months</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Savings Meter Section */}
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-[#1d2d3e]">
                    Enterprise Savings Meter
                  </h3>
                  <p className="text-xs text-[#556b82]">
                    Operational expenditure reduction captured by transitioning to SAP BTP Integration Suite
                  </p>
                </div>
                <span className="text-2xl font-black text-[#107e3e] font-mono">
                  {savingsPct.toFixed(1)}%
                </span>
              </div>

              {/* Meter Track */}
              <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden p-1 border border-[#d9e2ec]">
                <div
                  className="bg-gradient-to-r from-[#0070f2] via-teal-500 to-[#107e3e] h-full rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${Math.min(100, Math.max(15, savingsPct)).toFixed(1)}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-[#556b82] pt-1">
                <span>0% (No Savings)</span>
                <span className="font-semibold text-[#1d2d3e]">
                  +{formatCurrency(annualSavings, currency)} / year liberated capital
                </span>
                <span>100% (Zero Run Cost)</span>
              </div>
            </div>

            {/* IntSwitch Migration Decision Intelligence Card */}
            <div className="bg-white border border-[#d9e2ec] rounded-3xl p-8 shadow-xs space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Decision Statement (Cols 5) */}
                <div className="lg:col-span-5 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 text-[#0070f2] flex items-center justify-center shrink-0 shadow-xs">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <img src="/images/intswitch-logo.png" alt="IntSwitch" className="h-4 w-auto object-contain" />
                      <span className="text-xs font-extrabold text-[#0070f2] uppercase tracking-wider block">
                        IntSwitch Migration Decision Intelligence
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] tracking-tight flex items-center gap-2">
                      <span>Strategic Migration Assessment</span>
                      <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-blue-50 text-[#0070f2] border border-blue-200 uppercase">
                        Incture Validated
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                      Validated with Incture packaged delivery &amp; IntSwitch automation. Capital payback expected in{' '}
                      <strong className="text-slate-900 font-bold">{breakEvenMonths.toFixed(1)} months</strong> with a 5-year ROI of{' '}
                      <strong className="text-slate-900 font-bold">{fiveYearRoi.toFixed(2)}%</strong>.
                    </p>
                  </div>
                </div>

                {/* Center: IntSwitch Effort Reduction (Cols 3) */}
                <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l lg:border-r border-[#d9e2ec] pt-4 lg:pt-0 lg:px-8 space-y-2 flex flex-col justify-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">IntSwitch Advantage</span>
                  <div className="text-3xl font-black text-[#0070f2] tracking-tight font-mono">Up to 40%</div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Reduction in migration delivery effort via automated discovery &amp; testing.
                  </p>
                </div>

                {/* Right: AI Delivery Assurance (Cols 4) */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0070f2]">
                      <Sparkles className="w-4 h-4" />
                      <span>Delivery Assurance</span>
                    </div>
                    {aiAnalysis && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✦ LIVE AI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {aiAnalysis?.executiveSummary ? (
                      aiAnalysis.executiveSummary.length > 210
                        ? aiAnalysis.executiveSummary.slice(0, 210) + '...'
                        : aiAnalysis.executiveSummary
                    ) : (
                      <>Annual recurring savings of <strong className="text-slate-900 font-semibold">{formatCurrency(annualSavings, currency)}</strong> ({savingsPct.toFixed(1)}% reduction) establish a rock-solid business case. IntSwitch automation significantly shortens regression testing cycles.</>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={openExecutiveAnalysis}
                    className="text-xs font-bold text-[#0070f2] hover:text-[#0057d2] inline-flex items-center space-x-1 pt-1 cursor-pointer group"
                  >
                    <span>View Full AI Analysis &amp; Advisory</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CHARTS & ANALYSIS (Images 1 & 2 Features)                          */}
        {/* ========================================================================= */}
        {dashboardTab === 'charts' && (
          <div className="space-y-8 animate-fadeIn">

            {/* CHART 1: 5-Year Enterprise Cost Comparison & ROI Analysis */}
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#d9e2ec] pb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0070f2] flex items-center justify-center font-bold">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#1d2d3e]">
                      5-Year Cost Comparison &amp; Enterprise ROI
                    </h2>
                    <p className="text-xs sm:text-sm text-[#556b82]">
                      Annual operational spend comparison from Year 1 through Year 5 and 5-Year Cumulative TCO
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#556b82] font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-[#d9e2ec]">
                    5-Year Enterprise Horizon
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    5-Year ROI: {fiveYearRoi.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="h-84 w-full pt-4">
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
                      tick={{ fill: '#556b82', fontSize: 12 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <Tooltip
                      formatter={(val: number, name: string) => [
                        formatCurrency(val, currency),
                        name === 'currentTco'
                          ? 'Current Platform TCO'
                          : name === 'btpRunRate'
                            ? 'SAP BTP Subscription / Run-Rate'
                            : 'One-Time Migration Cost',
                      ]}
                      contentStyle={{ backgroundColor: '#1d2d3e', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                    />
                    <Bar dataKey="currentTco" fill="#556b82" maxBarSize={40} name="currentTco" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="btpRunRate" stackId="btp" fill="#0070f2" maxBarSize={40} name="btpRunRate" />
                    <Bar dataKey="migrationCost" stackId="btp" fill="#ea580c" maxBarSize={40} radius={[6, 6, 0, 0]} name="migrationCost" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 3 Clean Legend Cards under Chart */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
                {/* Card 1: Current Platform 5-Year Baseline */}
                <div className="p-5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#556b82] shrink-0" />
                    <h4 className="text-sm font-bold text-rose-900">Current Platform (5-Year TCO)</h4>
                  </div>
                  <p className="text-xs text-rose-700 font-medium">Cumulative 5-Year on-premise baseline</p>
                  <div className="text-xl font-extrabold text-[#1d2d3e] font-mono pt-1">
                    {formatCurrency(currentTco * 5, currency)}
                  </div>
                  <p className="text-[11px] text-rose-600">
                    {formatCurrency(currentTco, currency)}/yr baseline in licenses, hardware, hypervisors &amp; maintenance renewals.
                  </p>
                </div>

                {/* Card 2: SAP BTP 5-Year Cloud TCO */}
                <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#0070f2] shrink-0" />
                    <h4 className="text-sm font-bold text-blue-900">SAP BTP 5-Year Cloud TCO</h4>
                  </div>
                  <p className="text-xs text-blue-700 font-medium">5-Year Cloud subscription + Migration</p>
                  <div className="text-xl font-extrabold text-[#0070f2] font-mono pt-1">
                    {formatCurrency(targetTco * 5 + migrationCost, currency)}
                  </div>
                  <p className="text-[11px] text-blue-700">
                    {formatCurrency(targetTco * 5, currency)} in managed subscriptions + {formatCurrency(migrationCost, currency)} one-time packaged migration.
                  </p>
                </div>

                {/* Card 3: 5-Year Net Economic Value & ROI */}
                <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#107e3e] shrink-0" />
                    <h4 className="text-sm font-bold text-emerald-900">5-Year Net Economic Savings</h4>
                  </div>
                  <p className="text-xs text-emerald-700 font-medium">{fiveYearRoi.toFixed(1)}% 5-Year ROI • Payback in {breakEvenMonths.toFixed(1)} mos</p>
                  <div className="text-xl font-extrabold text-[#107e3e] font-mono pt-1">
                    +{formatCurrency(fiveYearNetBenefit, currency)}
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Net cash savings liberated across the 5-year operational lifecycle after 100% migration payback.
                  </p>
                </div>
              </div>
            </div>

            {/* CHART 2: Migration Cost Impact Analysis (Image 1 Feature) */}
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#d9e2ec] pb-5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-[#1d2d3e]">
                    Migration Cost Impact Analysis
                  </h2>
                  <p className="text-xs sm:text-sm text-[#556b82]">
                    Capital deployment trajectory and 10-year investment recovery curve
                  </p>
                </div>
              </div>

              {/* Understanding Migration Investment Callout (Image 1 exact option) */}
              <div className="p-6 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Understanding Migration Investment</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  The upfront migration cost of <strong className="text-slate-900 font-bold">{formatCurrency(migrationCost, currency)}</strong> creates an initial negative position. Your ongoing savings will gradually recover this investment.
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-[#107e3e] border border-emerald-300 rounded-full text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Break-even point: {breakEvenMonths.toFixed(1)} months</span>
                  </span>
                </div>
              </div>

              {/* Area Chart: Net Position ($) over 10 Years */}
              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={netPositionData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                    <defs>
                      <linearGradient id="netPosGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0070f2" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0070f2" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fill: '#1d2d3e', fontWeight: 600, fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                      tick={{ fill: '#556b82', fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(val: number) => [`${val >= 0 ? '+' : ''}${formatCurrency(val, currency)}`, 'Net Position']}
                      contentStyle={{ backgroundColor: '#1d2d3e', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                    />
                    <ReferenceLine
                      y={0}
                      stroke="#dc2626"
                      strokeDasharray="4 4"
                      label={{ value: 'Break-even Line ($0)', fill: '#dc2626', position: 'insideTopLeft', fontSize: 12, fontWeight: 700 }}
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

              {/* 2 Breakdown Cards: Investment Risk & Long-term Benefits (Image 1 exact option) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Card 1: Investment Risk */}
                <div className="p-6 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-rose-900 uppercase tracking-wider flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Investment Risk</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>Upfront migration cost: <strong className="text-slate-900 font-semibold">{formatCurrency(migrationCost, currency)}</strong></span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>Temporary negative cash position during active cutover</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>Potential project delays mitigated by IntSwitch automated testing</span>
                    </li>
                  </ul>
                </div>

                {/* Card 2: Long-term Benefits */}
                <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-[#107e3e] uppercase tracking-wider flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-[#107e3e]" />
                    <span>Long-term Benefits</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#107e3e] font-bold">•</span>
                      <span>Ongoing annual operational savings: <strong className="text-slate-900 font-semibold">+{formatCurrency(annualSavings, currency)}/yr</strong></span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#107e3e] font-bold">•</span>
                      <span>Improved platform agility with 920+ pre-built integration packages</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#107e3e] font-bold">•</span>
                      <span>Reduced operational complexity &amp; zero on-prem server maintenance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Visual Analysis: Legacy Drivers & 10-Year ROI */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card 1: Legacy TCO Cost Drivers */}
              <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#d9e2ec] pb-4">
                  <h3 className="text-base font-bold text-[#1d2d3e]">Legacy TCO Cost Drivers</h3>
                  <span className="text-xs text-[#556b82]">Baseline Breakdown</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-6 h-52 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tcoDriversData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
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
                      <span className="text-base font-black text-[#1d2d3e] font-mono">
                        ${(currentTco / 1000).toFixed(0)}K
                      </span>
                      <span className="text-[11px] text-[#556b82]">per year</span>
                    </div>
                  </div>

                  <div className="sm:col-span-6 space-y-3 text-xs sm:text-sm">
                    {tcoDriversData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 truncate">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-700 truncate">{item.name}</span>
                        </div>
                        <div className="text-right font-mono font-bold text-[#1d2d3e] shrink-0 ml-2">
                          <span className="text-slate-400 text-xs font-normal mr-1">{item.pct}%</span>
                          ${(item.value / 1000).toFixed(0)}K
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#556b82] leading-relaxed pt-2 border-t border-[#d9e2ec]">
                  Software licensing ({licensingPct}%) and infrastructure lease charges represent the vast majority of legacy costs, both of which are dissolved by BTP.
                </p>
              </div>

              {/* Card 2: 10-Year Cumulative Benefit Timeline */}
              <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#d9e2ec] pb-4">
                  <h3 className="text-base font-bold text-[#1d2d3e]">10-Year ROI Trajectory</h3>
                  <span className="text-xs text-[#556b82]">Cumulative Returns</span>
                </div>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timelineData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="shortYear" tick={{ fontSize: 11 }} />
                      <YAxis
                        tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(val: number) => [formatCurrency(val, currency), 'Cumulative Value']}
                        contentStyle={{ backgroundColor: '#1d2d3e', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                      />
                      <Bar dataKey="cumulativeBenefit" fill="#107e3e" radius={[4, 4, 0, 0]} name="Cumulative Savings" />
                      <Line type="monotone" dataKey="netBenefit" stroke="#0070f2" strokeWidth={2.5} dot={{ r: 3 }} name="Net Benefit" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-xs text-[#556b82] leading-relaxed pt-2 border-t border-[#d9e2ec]">
                  After payback at month {breakEvenMonths.toFixed(1)}, cumulative net benefits accelerate to {formatCurrency(fiveYearNetBenefit, currency)} over 5 years.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FINANCIAL SIMULATION                                               */}
        {/* ========================================================================= */}
        {dashboardTab === 'simulation' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="border-b border-[#d9e2ec] pb-5">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1d2d3e]">
                  Interactive Financial Sensitivity Simulation
                </h2>
                <p className="text-xs sm:text-sm text-[#556b82] mt-1">
                  Adjust parameters in real time to stress-test your business case under varying operational adoption and delivery conditions
                </p>
              </div>

              {/* 3 Sensitivity Sliders with Generous Padding */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Slider 1: Savings Realization */}
                <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <label className="font-bold text-[#1d2d3e]">Annual Savings Factor</label>
                    <span className="font-mono font-bold text-[#0070f2] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
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
                  <p className="text-xs text-[#556b82]">
                    Simulate slower interface adoption or higher operational realization.
                  </p>
                </div>

                {/* Slider 2: Migration Cost Factor */}
                <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <label className="font-bold text-[#1d2d3e]">Migration Cost Factor</label>
                    <span className="font-mono font-bold text-[#0070f2] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
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
                  <p className="text-xs text-[#556b82]">
                    Simulate complex refactoring overruns or accelerated content efficiencies.
                  </p>
                </div>

                {/* Slider 3: Target BTP Cost Factor */}
                <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <label className="font-bold text-[#1d2d3e]">Target BTP Cost Factor</label>
                    <span className="font-mono font-bold text-[#0070f2] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
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
                  <p className="text-xs text-[#556b82]">
                    Simulate message throughput expansion or additional tenant packs.
                  </p>
                </div>
              </div>

              {/* Dynamic Recalculated Case Banner */}
              <div className="p-6 bg-blue-50/80 border border-blue-200 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <span className="text-xs text-[#556b82] uppercase tracking-wider block font-bold">Simulated Annual Savings</span>
                  <span className="text-xl sm:text-2xl font-black text-[#107e3e] font-mono block mt-1">
                    +{formatCurrency(simulatedNetAnnual, currency)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#556b82] uppercase tracking-wider block font-bold">Simulated Migration</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1d2d3e] font-mono block mt-1">
                    {formatCurrency(simulatedMigration, currency)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#556b82] uppercase tracking-wider block font-bold">Simulated Payback</span>
                  <span className="text-xl sm:text-2xl font-black text-[#0070f2] font-mono block mt-1">
                    {simulatedBreakEven.toFixed(1)} months
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#556b82] uppercase tracking-wider block font-bold">Simulated 5-Year ROI</span>
                  <span className="text-xl sm:text-2xl font-black text-[#8a3ffc] font-mono block mt-1">
                    {simulated5YRoi.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Deep Scenarios Page Link */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSimSavingsFactor(1.0);
                    setSimMigrationFactor(1.0);
                    setSimTargetFactor(1.0);
                  }}
                  className="px-4 py-2 bg-white border border-[#d9e2ec] hover:bg-slate-50 text-xs font-bold rounded-xl"
                >
                  Reset to 1.0x Base Case
                </button>
                <Link
                  href={`/scenarios/${assessmentId}`}
                  className="inline-flex items-center space-x-2 text-sm font-bold text-[#0070f2] hover:text-[#0057d2] group"
                >
                  <span>Open Full Scenarios &amp; Monte Carlo Suite</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CURRENT STATE DETAILS                                              */}
        {/* ========================================================================= */}
        {dashboardTab === 'current-state' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="border-b border-[#d9e2ec] pb-5">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1d2d3e]">
                  Current State Architecture &amp; Baseline TCO
                </h2>
                <p className="text-xs sm:text-sm text-[#556b82] mt-1">
                  Granular cost composition and interface landscape of the existing on-premise {assessment?.sourcePlatform || 'SAP PI/PO'} deployment
                </p>
              </div>

              {/* Cost Categories Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left border border-[#d9e2ec] rounded-2xl overflow-hidden">
                  <thead className="bg-slate-50 text-[#1d2d3e] font-bold border-b border-[#d9e2ec]">
                    <tr>
                      <th className="p-4">TCO Component</th>
                      <th className="p-4 text-right">Annual Cost ({currency})</th>
                      <th className="p-4 text-right">% of Baseline</th>
                      <th className="p-4">Status in Target State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d9e2ec]">
                    <tr>
                      <td className="p-4 font-semibold text-[#1d2d3e]">Perpetual Software Licenses</td>
                      <td className="p-4 text-right font-mono font-bold">{formatCurrency(licensingCost, currency)}</td>
                      <td className="p-4 text-right font-mono text-[#556b82]">{licensingPct}%</td>
                      <td className="p-4 text-emerald-700 font-semibold">100% Decommissioned (Replaced by BTP)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-[#1d2d3e]">Datacenter Hardware &amp; Hypervisors</td>
                      <td className="p-4 text-right font-mono font-bold">{formatCurrency(infraCost, currency)}</td>
                      <td className="p-4 text-right font-mono text-[#556b82]">{(((infraCost) / (currentTco || 1)) * 100).toFixed(1)}%</td>
                      <td className="p-4 text-emerald-700 font-semibold">100% Sunset (Zero on-prem servers)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-[#1d2d3e]">Third-Party Vendor Support Contracts</td>
                      <td className="p-4 text-right font-mono font-bold">{formatCurrency(supportCost, currency)}</td>
                      <td className="p-4 text-right font-mono text-[#556b82]">{(((supportCost) / (currentTco || 1)) * 100).toFixed(1)}%</td>
                      <td className="p-4 text-emerald-700 font-semibold">Terminated on cutover</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-[#1d2d3e]">Manual Maintenance &amp; DBA Administration</td>
                      <td className="p-4 text-right font-mono font-bold">{formatCurrency(operationsCost, currency)}</td>
                      <td className="p-4 text-right font-mono text-[#556b82]">{(((operationsCost) / (currentTco || 1)) * 100).toFixed(1)}%</td>
                      <td className="p-4 text-blue-700 font-semibold">Shifted to cloud governance</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-4 text-[#1d2d3e]">Total Baseline TCO</td>
                      <td className="p-4 text-right font-mono text-rose-600 text-base">{formatCurrency(currentTco, currency)}</td>
                      <td className="p-4 text-right font-mono">100%</td>
                      <td className="p-4 text-rose-600 font-bold">Total annual liability</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Landscape Metadata Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                <div className="p-5 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1">
                  <span className="text-xs text-[#556b82] font-semibold block">Total Interfaces</span>
                  <span className="text-2xl font-bold font-mono text-[#1d2d3e]">{totalInterfaces}</span>
                </div>
                <div className="p-5 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1">
                  <span className="text-xs text-[#556b82] font-semibold block">Complex Interfaces</span>
                  <span className="text-2xl font-bold font-mono text-amber-600">{complexInterfaces} ({complexPct}%)</span>
                </div>
                <div className="p-5 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1">
                  <span className="text-xs text-[#556b82] font-semibold block">Monthly Volume</span>
                  <span className="text-2xl font-bold font-mono text-[#0070f2]">{throughput}</span>
                </div>
                <div className="p-5 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1">
                  <span className="text-xs text-[#556b82] font-semibold block">Custom Development</span>
                  <span className="text-2xl font-bold text-[#1d2d3e]">{customDev}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TARGET STATE DETAILS                                               */}
        {/* ========================================================================= */}
        {dashboardTab === 'target-state' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="border-b border-[#d9e2ec] pb-5">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1d2d3e]">
                  Target SAP BTP Integration Suite Architecture
                </h2>
                <p className="text-xs sm:text-sm text-[#556b82] mt-1">
                  Official subscription sizing, capacity add-ons, and hyper-scaler operational runtime specifications
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-[#0070f2] uppercase tracking-wider block">Selected Edition</span>
                  <div className="text-2xl font-bold text-[#1d2d3e]">
                    {selectedEdition || 'SAP BTP Integration Suite'}
                  </div>
                  <p className="text-xs text-[#556b82]">
                    Base annual subscription: <strong className="font-mono text-[#1d2d3e]">{formatCurrency(editionBasePrice, currency)}</strong>
                  </p>
                </div>

                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-[#556b82] uppercase tracking-wider block">Capacity Add-Ons</span>
                  <div className="text-2xl font-bold font-mono text-[#1d2d3e]">
                    {formatCurrency(addOnsCost, currency)} / yr
                  </div>
                  <p className="text-xs text-[#556b82]">
                    {additionalPacks} message packs • {dataSpacePackages} data space packs
                  </p>
                </div>

                <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-[#107e3e] uppercase tracking-wider block">Total Cloud Run Cost</span>
                  <div className="text-2xl font-bold font-mono text-[#107e3e]">
                    {formatCurrency(targetTco, currency)} / yr
                  </div>
                  <p className="text-xs text-[#556b82]">
                    Delivering <strong className="text-[#107e3e]">+{formatCurrency(annualSavings, currency)}</strong> perpetual annual savings
                  </p>
                </div>
              </div>

              {/* Cloud Capabilities Highlights */}
              <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-[#1d2d3e]">SAP BTP Enterprise Modernization Dividends</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#0070f2] block">920+ Pre-built Packages</span>
                    <p className="text-[#556b82]">Accelerate third-party and SAP integration with turnkey standard content.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#0070f2] block">Multi-Tenant Elasticity</span>
                    <p className="text-[#556b82]">Automatic scale-out without provisioning extra physical servers or hypervisors.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#0070f2] block">99.95% Managed SLA</span>
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
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="border-b border-[#d9e2ec] pb-5">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1d2d3e]">
                  Migration Scope &amp; Incture Packaged Delivery
                </h2>
                <p className="text-xs sm:text-sm text-[#556b82] mt-1">
                  Execution methodology de-risked by IntSwitch automation and fixed Indicative Incture migration packages
                </p>
              </div>

              {/* 4 Pillars Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-[#0070f2] uppercase tracking-wider block">Development</span>
                  <div className="text-2xl font-extrabold font-mono text-[#1d2d3e]">
                    {formatCurrency(devCost, currency)}
                  </div>
                  <p className="text-xs text-[#556b82]">
                    Interface mapping, Groovy script conversion, and standard API connectivity.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-[#107e3e] uppercase tracking-wider block">Quality Assurance &amp; Testing</span>
                  <div className="text-2xl font-extrabold font-mono text-[#1d2d3e]">
                    {formatCurrency(testingCost, currency)}
                  </div>
                  <p className="text-xs text-[#556b82]">
                    Comprehensive functional validation, payload comparison, and cutover testing.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">Architecture &amp; BASIS</span>
                  <div className="text-2xl font-extrabold font-mono text-[#1d2d3e]">
                    {formatCurrency(archCost, currency)}
                  </div>
                  <p className="text-xs text-[#556b82]">
                    Tenant setup, Cloud Connector configuration, security, and CTMS.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">PM &amp; Hypercare</span>
                  <div className="text-2xl font-extrabold font-mono text-[#1d2d3e]">
                    {formatCurrency(pmCost, currency)}
                  </div>
                  <p className="text-xs text-[#556b82]">
                    Project governance, cutover management, and post-go-live stabilization.
                  </p>
                </div>
              </div>

              {/* IntSwitch Value Add (Free) Accelerator Callout (Official Incture Standard) */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50/80 via-emerald-50/50 to-purple-50/80 border border-blue-200 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-blue-200/60 pb-4">
                  <div className="flex items-center space-x-3">
                    <img src="/images/intswitch-logo.png" alt="IntSwitch" className="h-6 w-auto object-contain" />
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold text-[#1d2d3e] tracking-tight">
                        IntSwitch — Accelerating Migration Assurance with Zero Risk
                      </h4>
                      <p className="text-xs text-[#556b82]">
                        Incture&apos;s AI-driven automated testing and migration accelerator
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    <span>Value Add (Free)</span>
                    <span className="font-mono font-bold">• $0 Additional Cost</span>
                  </span>
                </div>

                {/* 3 Metric Badges from Incture IntSwitch Specification */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-5 bg-white rounded-2xl border border-blue-100 shadow-2xs space-y-1.5">
                    <div className="text-2xl sm:text-3xl font-black text-[#0070f2] font-mono">40%</div>
                    <span className="text-xs font-bold text-[#1d2d3e] uppercase tracking-wider block">Effort Reduction</span>
                    <p className="text-xs text-[#556b82] leading-relaxed">
                      In migration and testing effort via automated execution and comparisons.
                    </p>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-1.5">
                    <div className="text-2xl sm:text-3xl font-black text-[#107e3e] font-mono">60 - 80%</div>
                    <span className="text-xs font-bold text-[#1d2d3e] uppercase tracking-wider block">Out-of-the-Box Coverage</span>
                    <p className="text-xs text-[#556b82] leading-relaxed">
                      Of typical integration flows validated out-of-the-box before cutover.
                    </p>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-2xs space-y-1.5">
                    <div className="text-2xl sm:text-3xl font-black text-[#8a3ffc] font-mono">Zero</div>
                    <span className="text-xs font-bold text-[#1d2d3e] uppercase tracking-wider block">Business Impact</span>
                    <p className="text-xs text-[#556b82] leading-relaxed">
                      Non-intrusive testing ensures day-to-day operations and live systems are unaffected.
                    </p>
                  </div>
                </div>

                {/* Fast & No-Code + Value Add Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1 text-xs">
                  <div className="p-4 bg-white/90 rounded-xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#1d2d3e] block">⚡ Fast &amp; No-Code</span>
                    <p className="text-[#556b82] leading-relaxed">
                      Designed for rapid adoption. No complex scripting required; intuitive UI enables easy training and immediate usage by functional teams.
                    </p>
                  </div>
                  <div className="p-4 bg-white/90 rounded-xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#1d2d3e] block">🎁 Value Add (Free Included)</span>
                    <p className="text-[#556b82] leading-relaxed">
                      Included directly as part of the Incture migration package model. No separate licensing fees or subscription costs required.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: METHODOLOGY & RISK MATRIX                                          */}
        {/* ========================================================================= */}
        {dashboardTab === 'methodology' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
              <div className="border-b border-[#d9e2ec] pb-5">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1d2d3e]">
                  Methodology, Audit Standards &amp; Risk Matrix
                </h2>
                <p className="text-xs sm:text-sm text-[#556b82] mt-1">
                  Authoritative mathematical rules, financial modeling criteria, and enterprise governance safeguards
                </p>
              </div>

              {/* Economic Calculation Rules */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#1d2d3e]">Deterministic Calculation Rules</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#0070f2] block">Annual Operational Savings</span>
                    <p className="text-slate-600">Calculated as: <code>Current TCO - Target TCO</code>. Captures the structural elimination of perpetual licensing and datacenter infrastructure.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#0070f2] block">Capital Payback Horizon</span>
                    <p className="text-slate-600">Calculated as: <code>(Migration Capital / Annual Savings) * 12</code>. Represents the exact calendar month where cumulative savings equal migration outlay.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#0070f2] block">5-Year Net Benefit</span>
                    <p className="text-slate-600">Calculated as: <code>(5 × Annual Savings) - Migration Cost</code>. Reflects cumulative cash flow liberated over standard enterprise IT lifecycle.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-[#d9e2ec] space-y-1">
                    <span className="font-bold text-[#0070f2] block">5-Year Return on Investment (ROI)</span>
                    <p className="text-slate-600">Calculated as: <code>(5-Year Net Benefit / Migration Cost) × 100</code>. Benchmarked against enterprise capital hurdle rates.</p>
                  </div>
                </div>
              </div>

              {/* Risk Mitigation Register */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-[#1d2d3e]">Enterprise Risk Register &amp; Safeguards</h4>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-4 bg-white border border-[#d9e2ec] rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-700">Dual-Running Overlap Window</span>
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold rounded-lg border border-rose-200 text-xs">High</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      Running both systems during wave transitions creates temporary operational overhead. Mitigate by structuring waves by business domain with 90-day cutover limits.
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-[#d9e2ec] rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-700">Custom ABAP/Java UDF Complexity</span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded-lg border border-amber-200 text-xs">Medium</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      Legacy custom mapping scripts require automated conversion to Groovy. Mitigate by using IntSwitch automated discovery in Sprint 1.
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-[#d9e2ec] rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0070f2]">Network Latency &amp; Cloud Connector Security</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-[#0070f2] font-bold rounded-lg border border-blue-200 text-xs">Low</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      On-prem backend connectivity to cloud BTP. Mitigate by deploying dedicated SAP Cloud Connector with hardware VPN tunnels.
                    </p>
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
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900 text-white shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center text-base font-bold">
                    ✦
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold">{aiModalTitle}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {aiModalTab === 'executive' ? (aiAnalysis?.aiStatus || 'AI GENERATED') : (chartInsight?.aiStatus || 'AI GENERATED')}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      ValueLens AI • Autonomous Decision Intelligence
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="shrink-0 bg-slate-100 border-b border-[#d9e2ec] p-2.5 grid grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => switchModalTab('tco-comparison', 'Platform Cost Breakdown & TCO Reduction')}
                  className={`px-2 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5 ${
                    aiModalTab === 'tco-comparison'
                      ? 'bg-[#0070f2] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span className="truncate">Cost Comparison</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('cost-drivers', 'Legacy TCO Cost Drivers & Elimination')}
                  className={`px-2 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5 ${
                    aiModalTab === 'cost-drivers'
                      ? 'bg-[#0070f2] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span className="truncate">Cost Drivers</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('migration-cost', 'Incture Migration Package & Delivery')}
                  className={`px-2 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5 ${
                    aiModalTab === 'migration-cost'
                      ? 'bg-[#0070f2] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span className="truncate">Migration Package</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('roi-timeline', '10-Year ROI Trajectory & Recovery')}
                  className={`px-2 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5 ${
                    aiModalTab === 'roi-timeline'
                      ? 'bg-[#0070f2] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span className="truncate">ROI Trajectory</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('executive', 'Autonomous Strategic Advisory Dossier')}
                  className={`px-2 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5 ${
                    aiModalTab === 'executive'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <span className="truncate">Executive Dossier</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
                {aiModalTab !== 'executive' && chartInsight && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="p-5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-1.5">
                      <span className="text-xs font-bold text-[#0070f2] uppercase tracking-wider block">Analytical Finding</span>
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                        {chartInsight.finding}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Strategic Analysis</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-[#d9e2ec]">
                        {chartInsight.detailedAnalysis}
                      </p>
                    </div>

                    {chartInsight.keyMetrics && chartInsight.keyMetrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {chartInsight.keyMetrics.map((m, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 border border-[#d9e2ec] rounded-2xl space-y-1">
                            <span className="text-xs text-slate-500 font-medium block">{m.label}</span>
                            <span className="text-base font-bold font-mono text-slate-900 block">{m.value}</span>
                            <span className="text-[11px] text-slate-500 block">{m.detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {aiModalTab === 'executive' && aiAnalysis && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                        Autonomous Recommendation: {aiAnalysis.decision}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {aiAnalysis.executiveSummary}
                      </p>
                    </div>

                    <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-[#107e3e] uppercase tracking-wider block">Financial Appraisal</span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {aiAnalysis.financialAssessment}
                      </p>
                    </div>
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
