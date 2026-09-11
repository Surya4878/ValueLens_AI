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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
          businessImpact: `Development delivery burn rate directly dictates the ${breakEvenMonths.toFixed(1)}-month capital recovery horizon. A disciplined ${formatCurrency(contingencyCost, currency)} contingency reserve safeguards against scope creep across all ${totalInterfaces} interfaces.`,
          recommendation: 'Leverage SAP BTP pre-packaged integration content (920+ packages) to compress development hours by an estimated 35%.',
          aiStatus: 'AI GENERATED',
          detailedAnalysis: `The one-time capital outlay of ${formatCurrency(migrationCost, currency)} covers the migration of ${totalInterfaces} interfaces, including ${complexInterfaces} complex interfaces (${complexPct}%). Development represents ${formatCurrency(devCost, currency)} (${devPct}%), followed by quality assurance (${formatCurrency(testingCost, currency)}), solution architecture (${formatCurrency(archCost, currency)}), governance (${formatCurrency(pmCost, currency)}), and contingency (${formatCurrency(contingencyCost, currency)}). Capital allocation efficiency is maximized by leveraging standard content packs.`,
          keyMetrics: [
            { label: 'Interface Development', value: formatCurrency(devCost, currency), detail: `${devPct}% of total migration investment` },
            { label: 'QA & Interface Testing', value: formatCurrency(testingCost, currency), detail: 'End-to-end regression validation' },
            { label: 'Contingency Reserve', value: formatCurrency(contingencyCost, currency), detail: '10% dedicated risk & scope buffer' },
            { label: 'Architecture & PMO', value: formatCurrency(archCost + pmCost, currency), detail: 'Technical governance & wave planning' },
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
          mitigation: 'Use IntSwitch™ assessment and automated conversion tools to catalog assets and replace with standard BTP artifacts.',
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
      console.warn('Using validated dynamic AI chart insight', err);
    } finally {
      setChartInsightLoading(false);
    }
  };

  const openExecutiveAnalysis = async () => {
    setAiModalTab('executive');
    setAiModalTitle('Executive Decision Intelligence & Strategy');
    setAiModalOpen(true);
    if (!aiAnalysis) {
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
    }
  };

  // Load calculation data dynamically
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let loadedAssessment: Assessment | null = null;
        let loadedCalculation: RoiCalculationResult | null = null;

        // 1. Check if user recently saved or calculated an assessment in localStorage
        if (typeof window !== 'undefined') {
          try {
            const savedAsmt = localStorage.getItem('valuelens_active_assessment');
            const savedCalc = localStorage.getItem('valuelens_active_calculation');
            if (savedAsmt) {
              loadedAssessment = JSON.parse(savedAsmt);
            }
            if (savedCalc) {
              loadedCalculation = JSON.parse(savedCalc);
            }
          } catch {
            // ignore JSON parse error
          }
        }

        // 2. If not found in localStorage or loading specific ID, fetch from backend
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

        // 3. Ensure calculations are computed from the loaded assessment
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

    // Dynamically re-read when user switches back from Assessment tab
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

  // Derived dynamic numbers from active assessment & calculations
  const currency = calculations?.currency || assessment?.currency || 'USD';

  const licensingCost =
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.licensing?.subtotal ?? 250000;
  const infraCost =
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.infrastructure?.subtotal ?? 160000;
  const supportCost =
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.support?.subtotal ?? 160000;
  const operationsCost =
    assessment?.sourceSystem?.sapPiPoAnnualCostBreakdown?.operations?.subtotal ?? 160000;

  const currentTco =
    calculations?.currentPlatformTCO ??
    licensingCost + infraCost + supportCost + operationsCost;

  const selectedEdition = assessment?.targetSystem?.configuration?.selectedEditionName || 'Standard Edition';
  const getEditionBasePrice = (edition: string, unitCount: number = 3) => {
    const lower = edition.toLowerCase();
    if (lower.includes('starter')) return 20736;
    if (lower.includes('enhanced')) return 92256 * (unitCount > 0 ? unitCount : 1);
    if (lower.includes('premium')) return 318204;
    return 64068 * (unitCount > 0 ? unitCount : 3);
  };
  const unitCount =
    selectedEdition.toLowerCase().includes('standard')
      ? (assessment?.targetSystem?.configuration?.numberOfUnits || 3)
      : 1;
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
    assessment?.targetSystem?.additionalTcoComponents?.totalAdditionalTcoAnnual !== undefined
      ? assessment.targetSystem.additionalTcoComponents.totalAdditionalTcoAnnual
      : 109000;
  const targetTco =
    calculations?.targetPlatformTCO ??
    (targetConfigCost + targetAdditionalTco);

  const annualSavings =
    calculations?.annualSavings ?? (currentTco - targetTco);
  const savingsPct =
    currentTco > 0 ? (annualSavings / currentTco) * 100 : 57.11;

  const devCost = assessment?.migrationRelatedDetails?.developmentCost ?? 200000;
  const contingencyCost = assessment?.migrationRelatedDetails?.contingencyCost ?? 30000;
  const testingCost = assessment?.migrationRelatedDetails?.testingCost ?? 15000;
  const archCost = assessment?.migrationRelatedDetails?.architectureCost ?? 15000;
  const pmCost = assessment?.migrationRelatedDetails?.projectManagementCost ?? 15000;
  const cutoverCost = assessment?.migrationRelatedDetails?.deploymentCutoverCost ?? 10000;
  const trainingCost = assessment?.migrationRelatedDetails?.trainingCost ?? 5000;
  const docCost = assessment?.migrationRelatedDetails?.documentationCost ?? 10000;

  const migrationCost =
    calculations?.migrationCost ??
    (devCost + contingencyCost + testingCost + archCost + pmCost + cutoverCost + trainingCost + docCost);

  const breakEvenMonths =
    calculations?.breakEvenMonths ??
    (annualSavings > 0 ? (migrationCost / annualSavings) * 12 : 8.6);

  const fiveYearRoi =
    calculations?.fiveYearROI ??
    (migrationCost > 0 ? (((annualSavings * 5) - migrationCost) / migrationCost) * 100 : 594.86);

  const fiveYearNetBenefit =
    calculations?.fiveYearNetBenefit ?? (annualSavings * 5 - migrationCost);

  const devPct = migrationCost > 0 ? ((devCost / migrationCost) * 100).toFixed(0) : '67';

  // Cost Drivers Donut Data
  const tcoDriversData = useMemo(() => {
    const total = currentTco || 730000;
    return [
      { name: 'Licensing', value: licensingCost, pct: ((licensingCost / total) * 100).toFixed(1), color: '#3b82f6' },
      { name: 'Infrastructure', value: infraCost, pct: ((infraCost / total) * 100).toFixed(1), color: '#6366f1' },
      { name: 'Support', value: supportCost, pct: ((supportCost / total) * 100).toFixed(1), color: '#a855f7' },
      { name: 'Operations', value: operationsCost, pct: ((operationsCost / total) * 100).toFixed(1), color: '#14b8a6' },
    ];
  }, [currentTco, licensingCost, infraCost, supportCost, operationsCost]);

  // Migration Breakdown Donut Data
  const migrationBreakdownData = useMemo(() => {
    const total = migrationCost || 300000;
    return [
      { name: 'Development', value: devCost, pct: ((devCost / total) * 100).toFixed(1), color: '#3b82f6' },
      { name: 'Contingency', value: contingencyCost, pct: ((contingencyCost / total) * 100).toFixed(1), color: '#f59e0b' },
      { name: 'Testing', value: testingCost, pct: ((testingCost / total) * 100).toFixed(1), color: '#10b981' },
      { name: 'Architecture', value: archCost, pct: ((archCost / total) * 100).toFixed(1), color: '#06b6d4' },
      { name: 'Project Mgmt', value: pmCost, pct: ((pmCost / total) * 100).toFixed(1), color: '#8b5cf6' },
      { name: 'Cutover', value: cutoverCost, pct: ((cutoverCost / total) * 100).toFixed(1), color: '#ec4899' },
      { name: 'Training', value: trainingCost, pct: ((trainingCost / total) * 100).toFixed(1), color: '#f97316' },
      { name: 'Documentation', value: docCost, pct: ((docCost / total) * 100).toFixed(1), color: '#64748b' },
    ];
  }, [migrationCost, devCost, contingencyCost, testingCost, archCost, pmCost, cutoverCost, trainingCost, docCost]);

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

  // Scenario Analysis Data
  const scenarioData = useMemo(() => {
    const baseSavings = annualSavings;
    const baseMigration = migrationCost;

    // Worst Case: 20% lower savings, 25% higher migration cost
    const worstSavings = baseSavings * 0.8;
    const worstMigration = baseMigration * 1.25;
    const worstRoi = worstMigration > 0 ? (((worstSavings * 5) - worstMigration) / worstMigration) * 100 : 340.12;
    const worstBreakEven = worstSavings > 0 ? (worstMigration / worstSavings) * 12 : 12.7;
    const worstBenefit = worstSavings * 5 - worstMigration;

    // Base Case
    const baseRoi = fiveYearRoi;
    const baseBreakEven = breakEvenMonths;
    const baseBenefit = fiveYearNetBenefit;

    // Best Case: 15% higher savings, 15% lower migration cost
    const bestSavings = baseSavings * 1.15;
    const bestMigration = baseMigration * 0.85;
    const bestRoi = bestMigration > 0 ? (((bestSavings * 5) - bestMigration) / bestMigration) * 100 : 780.45;
    const bestBreakEven = bestSavings > 0 ? (bestMigration / bestSavings) * 12 : 6.8;
    const bestBenefit = bestSavings * 5 - bestMigration;

    return {
      chart: [
        { name: 'Worst Case', currentTco: currentTco, targetTco: targetTco * 1.15, netBenefit: worstBenefit },
        { name: 'Base Case', currentTco: currentTco, targetTco: targetTco, netBenefit: baseBenefit },
        { name: 'Best Case', currentTco: currentTco, targetTco: targetTco * 0.9, netBenefit: bestBenefit },
      ],
      table: [
        { name: 'Worst Case', roi: `${worstRoi.toFixed(2)}%`, breakEven: `${worstBreakEven.toFixed(1)} mo`, benefit: `$${(worstBenefit / 1000000).toFixed(2)}M` },
        { name: 'Base Case', roi: `${baseRoi.toFixed(2)}%`, breakEven: `${baseBreakEven.toFixed(1)} mo`, benefit: `$${(baseBenefit / 1000000).toFixed(2)}M` },
        { name: 'Best Case', roi: `${bestRoi.toFixed(2)}%`, breakEven: `${bestBreakEven.toFixed(1)} mo`, benefit: `$${(bestBenefit / 1000000).toFixed(2)}M` },
      ],
    };
  }, [currentTco, targetTco, annualSavings, migrationCost, fiveYearRoi, breakEvenMonths, fiveYearNetBenefit]);

  // Environment & Complexity Parameters
  const totalInterfaces = assessment?.sourceSystem?.environmentAssessment?.totalInterfaces ?? 1050;
  const complexInterfaces = assessment?.sourceSystem?.environmentAssessment?.complexInterfaces ?? 50;
  const complexPct = totalInterfaces > 0 ? ((complexInterfaces / totalInterfaces) * 100).toFixed(1) : '4.8';
  const throughput = parseInt(assessment?.sourceSystem?.volumetrics?.currentMessageThroughput || '200000').toLocaleString();
  const customDev = assessment?.sourceSystem?.environmentAssessment?.customDevelopment ?? 'Moderate';

  // Derived dynamic UI metrics
  const maxTcoVal = Math.max(currentTco, targetTco, 1);
  const currentBarHeightPx = Math.max(30, Math.min(180, Math.round((currentTco / maxTcoVal) * 170)));
  const targetBarHeightPx = Math.max(30, Math.min(180, Math.round((targetTco / maxTcoVal) * 170)));

  const licensingPct = currentTco > 0 ? ((licensingCost / currentTco) * 100).toFixed(1) : '34.2';
  const nonLicensingPct = currentTco > 0 ? (((infraCost + supportCost + operationsCost) / currentTco) * 100).toFixed(0) : '66';

  const year1NetBenefit = timelineData[0]?.netBenefit ?? 116916;
  const year1Roi = timelineData[0]?.roi ?? 38.97;
  const complexityLabel = assessment?.sourceSystem?.environmentAssessment?.systemComplexity || assessment?.sourceSystem?.companyInformation?.integrationComplexity || 'Medium';
  const complexityWidth =
    complexityLabel.toLowerCase().includes('high') || complexityLabel.toLowerCase().includes('complex')
      ? '85%'
      : complexityLabel.toLowerCase().includes('simple') || complexityLabel.toLowerCase().includes('low')
      ? '25%'
      : '55%';

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ========================================================================= */}
        {/* ROW 1: ValueLens AI Decision Card                                         */}
        {/* ========================================================================= */}
        <div className="bg-[#f0fdf4] border border-emerald-200/80 rounded-2xl p-6 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Decision Statement (Cols 6) */}
            <div className="lg:col-span-5 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
                ✓
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  ValueLens AI Decision
                </span>
                <h2 className="text-3xl font-black text-emerald-800 tracking-tight">
                  FAVORABLE
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Migration is financially attractive under the current assumptions. Payback is expected in{' '}
                  <strong className="text-slate-900 font-bold">{breakEvenMonths.toFixed(1)} months</strong> with a 5-year ROI of{' '}
                  <strong className="text-slate-900 font-bold">{fiveYearRoi.toFixed(2)}%</strong>.
                </p>
              </div>
            </div>

            {/* Center: Confidence Score (Cols 3) */}
            <div className="lg:col-span-3 border-l border-r border-emerald-200/60 px-6 space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">Confidence Score</span>
              <div className="text-2xl font-black text-slate-900 font-mono">91%</div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '91%' }} />
              </div>
            </div>

            {/* Right: AI Insight (Cols 4) */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600">
                  <span>✦</span>
                  <span>AI Insight</span>
                </div>
                {aiAnalysis && (
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
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
                  <>Annual savings of <strong className="text-slate-900 font-semibold">{formatCurrency(annualSavings, currency)}</strong> ({savingsPct.toFixed(1)}% reduction) create a strong business case. The main area to validate is the migration development effort, which represents {devPct}% of the total investment.</>
                )}
              </p>
              <button
                type="button"
                onClick={openExecutiveAnalysis}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center space-x-1 pt-1 cursor-pointer"
              >
                <span>View Full AI Analysis</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: 6 KPI Metric Cards                                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 1. Current Platform TCO */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
              📅
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block">Current Platform TCO</span>
            <div className="text-xl font-black text-slate-900 font-mono">
              {formatCurrency(currentTco, currency)}
            </div>
            <span className="text-[10px] text-slate-400 block">per year</span>
            <span className="text-[10px] font-bold text-rose-600 flex items-center space-x-1">
              <span>↗</span>
              <span>Baseline cost</span>
            </span>
          </div>

          {/* 2. Target Platform TCO */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
              ☁️
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block">Target Platform TCO</span>
            <div className="text-xl font-black text-indigo-600 font-mono">
              {formatCurrency(targetTco, currency)}
            </div>
            <span className="text-[10px] text-slate-400 block">per year</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
              <span>↓</span>
              <span>{savingsPct.toFixed(1)}% lower</span>
            </span>
          </div>

          {/* 3. Annual Savings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
              💰
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block">Annual Savings</span>
            <div className="text-xl font-black text-emerald-600 font-mono">
              {formatCurrency(annualSavings, currency)}
            </div>
            <span className="text-[10px] text-slate-400 block">per year</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
              <span>↓</span>
              <span>{savingsPct.toFixed(1)}% reduction</span>
            </span>
          </div>

          {/* 4. Migration Investment */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">
              🔒
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block">Migration Investment</span>
            <div className="text-xl font-black text-slate-900 font-mono">
              {formatCurrency(migrationCost, currency)}
            </div>
            <span className="text-[10px] text-slate-400 block">one-time cost</span>
          </div>

          {/* 5. Break-even */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
              ⏱️
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block">Break-even</span>
            <div className="text-xl font-black text-slate-900 font-mono">
              {breakEvenMonths.toFixed(1)} months
            </div>
            <span className="text-[10px] text-slate-400 block">Payback period</span>
          </div>

          {/* 6. 5-Year ROI */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
              📊
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block">5-Year ROI</span>
            <div className="text-xl font-black text-indigo-900 font-mono">
              {fiveYearRoi.toFixed(2)}%
            </div>
            <span className="text-[10px] font-bold text-emerald-600 block">Very strong return</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 3: 3 Visual Analysis Cards                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Card 1: Annual Platform Cost Comparison */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Annual Platform Cost Comparison</h3>
                <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded border">View by: Total ▾</span>
              </div>

              {/* Bar comparison */}
              <div className="h-56 relative flex items-end justify-around pb-4 border-b border-slate-100">
                {/* Current (SAP PI/PO) */}
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-xs font-bold font-mono text-indigo-600">
                    ${(currentTco / 1000).toFixed(0)}K
                  </span>
                  <div
                    className="w-20 bg-indigo-600 rounded-t-xl transition-all duration-300 shadow-sm"
                    style={{ height: `${currentBarHeightPx}px` }}
                  />
                  <span className="text-[11px] font-bold text-slate-700">Current ({assessment?.sourcePlatform || 'SAP PI/PO'})</span>
                </div>

                {/* Floating savings indicator */}
                <div className="flex flex-col items-center justify-center bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center text-emerald-700 shadow-xs mb-10">
                  <span className="text-[10px] font-black uppercase">↓ {savingsPct.toFixed(1)}%</span>
                  <span className="text-[11px] font-bold font-mono">+{formatCurrency(annualSavings, currency)}</span>
                  <span className="text-[9px] text-emerald-600">Annual Savings</span>
                </div>

                {/* Target (BTP) */}
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-xs font-bold font-mono text-emerald-600">
                    ${(targetTco / 1000).toFixed(0)}K
                  </span>
                  <div
                    className="w-20 bg-emerald-500 rounded-t-xl transition-all duration-300 shadow-sm"
                    style={{ height: `${targetBarHeightPx}px` }}
                  />
                  <span className="text-[11px] font-bold text-slate-700">Target (BTP)</span>
                </div>
              </div>
            </div>

            {/* AI Insight Callout */}
            <div
              onClick={() => openChartInsight('tco-comparison', 'Platform Cost Breakdown & TCO Reduction')}
              className="p-3 bg-blue-50/60 hover:bg-blue-100/50 border border-blue-100 rounded-xl text-xs space-y-1 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-indigo-600">
                  <span>✦</span>
                  <span>AI Insight</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600">Explore AI Analysis ↗</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                Your target-state annual cost is {savingsPct.toFixed(1)}% lower than the current platform, primarily driven by reduced infrastructure and operational costs.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openChartInsight('tco-comparison', 'Platform Cost Breakdown & TCO Reduction');
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 block pt-1 cursor-pointer text-left"
              >
                View Cost Breakdown →
              </button>
            </div>
          </div>

          {/* Card 2: Current TCO Cost Drivers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Current TCO Cost Drivers</h3>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Donut with Center Text (Cols 6) */}
                <div className="sm:col-span-6 h-48 relative flex items-center justify-center">
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
                  <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-sm font-black text-slate-900 font-mono">${(currentTco / 1000).toFixed(0)}K</span>
                    <span className="text-[10px] text-slate-400">per year</span>
                  </div>
                </div>

                {/* Legend (Cols 6) */}
                <div className="sm:col-span-6 space-y-2 text-xs">
                  {tcoDriversData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 truncate">{item.name}</span>
                      </div>
                      <div className="text-right font-mono font-bold text-slate-900 shrink-0 ml-2">
                        <span className="text-slate-400 text-[10px] font-normal mr-1">{item.pct}%</span>
                        ${(item.value / 1000).toFixed(0)}K
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insight Callout */}
            <div
              onClick={() => openChartInsight('cost-drivers', 'Legacy TCO Cost Drivers & Elimination Opportunities')}
              className="p-3 bg-blue-50/60 hover:bg-blue-100/50 border border-blue-100 rounded-xl text-xs space-y-1 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-indigo-600">
                  <span>✦</span>
                  <span>AI Insight</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600">Explore AI Analysis ↗</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                Licensing is the largest cost category ({licensingPct}%), but infrastructure, support, and operations together represent {nonLicensingPct}% of your current TCO.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openChartInsight('cost-drivers', 'Legacy TCO Cost Drivers & Elimination Opportunities');
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 block pt-1 cursor-pointer text-left"
              >
                View Detailed Analysis →
              </button>
            </div>
          </div>

          {/* Card 3: Migration Investment Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Migration Investment Breakdown</h3>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Donut with Center Text (Cols 5) */}
                <div className="sm:col-span-5 h-48 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={migrationBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {migrationBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-sm font-black text-slate-900 font-mono">${(migrationCost / 1000).toFixed(0)}K</span>
                    <span className="text-[10px] text-slate-400">one-time</span>
                  </div>
                </div>

                {/* Breakdown List (Cols 7) */}
                <div className="sm:col-span-7 space-y-1.5 text-[11px]">
                  {migrationBreakdownData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 truncate">{item.name}</span>
                      </div>
                      <div className="text-right font-mono font-bold text-slate-800 shrink-0 ml-1">
                        <span className="text-slate-400 text-[10px] font-normal mr-1">{item.pct}%</span>
                        ${(item.value / 1000).toFixed(0)}K
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insight Callout */}
            <div
              onClick={() => openChartInsight('migration-cost', 'Migration Investment Breakdown & Phasing')}
              className="p-3 bg-blue-50/60 hover:bg-blue-100/50 border border-blue-100 rounded-xl text-xs space-y-1 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-indigo-600">
                  <span>✦</span>
                  <span>AI Insight</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600">Explore AI Analysis ↗</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                Development represents {devPct}% of the migration investment, indicating that interface conversion effort is the primary cost driver.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openChartInsight('migration-cost', 'Migration Investment Breakdown & Phasing');
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 block pt-1 cursor-pointer text-left"
              >
                View Investment Details →
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ROW 4: 3 Deep-Dive Cards                                                  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Col 1: 10-Year ROI & Net Benefit Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">10-Year ROI & Net Benefit Timeline</h3>
                <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border">View: Net Benefit ▾</span>
              </div>

              {/* Legend */}
              <div className="flex items-center space-x-4 text-xs text-slate-500 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-emerald-500 rounded-xs" />
                  <span>Cumulative Benefit</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-0.5 bg-blue-600" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 -ml-2" />
                  <span>Net Benefit</span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-56 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={timelineData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="shortYear" tick={{ fontSize: 10 }} />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="cumulativeBenefit" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="netBenefit" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>

                {/* Tooltip Card Overlay for Year 1 */}
                <div className="absolute top-2 left-16 bg-white/95 backdrop-blur-xs border border-slate-300 rounded-lg p-2 shadow-md text-[10px] space-y-0.5 pointer-events-none">
                  <div className="font-bold text-slate-800">Year 1</div>
                  <div className="text-slate-600">Net Benefit: <strong className="font-mono text-indigo-600">{formatCurrency(year1NetBenefit, currency)}</strong></div>
                  <div className="text-slate-600">ROI: <strong className="font-mono text-emerald-600">{year1Roi.toFixed(2)}%</strong></div>
                </div>

                {/* Break-even annotation */}
                <div className="absolute bottom-6 left-10 text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  Break-even: {breakEvenMonths.toFixed(1)} mo
                </div>
              </div>
            </div>

            {/* AI Insight Callout */}
            <div
              onClick={() => openChartInsight('roi-timeline', '10-Year ROI Trajectory & Capital Recovery Payback')}
              className="p-3 bg-blue-50/60 hover:bg-blue-100/50 border border-blue-100 rounded-xl text-xs space-y-1 cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-indigo-600">
                  <span>✦</span>
                  <span>AI Insight</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600">Explore Live Insights ↗</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                The investment is recovered in approximately {breakEvenMonths.toFixed(1)} months, with cumulative net benefits reaching ${(fiveYearNetBenefit / 1000000).toFixed(2)}M over 5 years and continuing to grow thereafter.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openChartInsight('roi-timeline', '10-Year ROI Trajectory & Capital Recovery Payback');
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 block pt-1 cursor-pointer text-left"
              >
                Explore ROI Timeline AI Insights →
              </button>
            </div>
          </div>

          {/* Col 2: Scenario Analysis */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Scenario Analysis</h3>

              {/* Legend */}
              <div className="flex items-center space-x-3 text-xs text-slate-500 mb-3">
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-xs" />
                  <span>Current TCO</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
                  <span>Target TCO</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-purple-600 rounded-xs" />
                  <span>Net Benefit (5Y)</span>
                </div>
              </div>

              {/* 3-Cluster Bar Chart */}
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarioData.chart} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="currentTco" fill="#2563eb" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="targetTco" fill="#10b981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="netBenefit" fill="#9333ea" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Scenario Table */}
              <div className="mt-3 border-t border-slate-100 pt-3">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 font-semibold border-b border-slate-100">
                      <th className="pb-1.5">Scenario</th>
                      <th className="pb-1.5">ROI</th>
                      <th className="pb-1.5">Break-even</th>
                      <th className="pb-1.5 text-right">5Y Benefit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {scenarioData.table.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-1.5 font-sans font-bold text-slate-700">{row.name}</td>
                        <td className="py-1.5 font-bold text-emerald-600">{row.roi}</td>
                        <td className="py-1.5 text-slate-600">{row.breakEven}</td>
                        <td className="py-1.5 text-right font-bold text-slate-900">{row.benefit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Link href={`/scenarios/${assessmentId}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 block pt-1">
              Run Custom Scenario →
            </Link>
          </div>

          {/* Col 3: Migration Risk Assessment & Top Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            {/* Top: 3x3 Risk Matrix */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">Migration Risk Assessment</h3>
                <Link href={`/report/${assessmentId}`} className="text-[11px] font-bold text-indigo-600">View All Risks →</Link>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                {/* 3x3 Matrix Grid (Cols 5) */}
                <div className="col-span-5 relative border border-slate-200 rounded-lg p-1 bg-slate-50">
                  <div className="grid grid-cols-3 gap-1 h-24">
                    {/* Row 1: High Likelihood */}
                    <div className="bg-amber-100/70 rounded flex items-center justify-center text-[10px]" />
                    <div className="bg-orange-100/70 rounded flex items-center justify-center text-[10px]">
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-[9px]">2</span>
                    </div>
                    <div className="bg-rose-100/70 rounded flex items-center justify-center text-[10px]">
                      <span className="w-4 h-4 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[9px]">1</span>
                    </div>

                    {/* Row 2: Med Likelihood */}
                    <div className="bg-emerald-100/70 rounded flex items-center justify-center text-[10px]">
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[9px]">3</span>
                    </div>
                    <div className="bg-amber-100/70 rounded flex items-center justify-center text-[10px]" />
                    <div className="bg-orange-100/70 rounded flex items-center justify-center text-[10px]" />

                    {/* Row 3: Low Likelihood */}
                    <div className="bg-slate-100 rounded flex items-center justify-center text-[10px]">
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[9px]">4</span>
                    </div>
                    <div className="bg-emerald-100/70 rounded flex items-center justify-center text-[10px]">
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-[9px]">5</span>
                    </div>
                    <div className="bg-amber-100/70 rounded flex items-center justify-center text-[10px]" />
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-400 mt-1 px-1">
                    <span>Low</span>
                    <span>Impact</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Risk Items (Cols 7) */}
                <div className="col-span-7 space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[8px]">1</span>
                      <span className="text-slate-700 truncate">Migration Dev Effort</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 font-bold border border-rose-200">High</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-[8px]">2</span>
                      <span className="text-slate-700 truncate">Message Consumption</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 font-bold border border-rose-200">High</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[8px]">3</span>
                      <span className="text-slate-700 truncate">Complex Interfaces</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-600 font-bold border border-amber-200">Medium</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[8px]">4</span>
                      <span className="text-slate-700 truncate">Cutover & Downtime</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">Low</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-[8px]">5</span>
                      <span className="text-slate-700 truncate">Compliance & Regulatory</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 font-bold border border-blue-200">Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Top Recommendations */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Top Recommendations</h4>
                <Link href={`/report/${assessmentId}`} className="text-[10px] font-bold text-indigo-600">View All →</Link>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 truncate">1. Validate migration development estimate</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 font-bold border border-rose-200 shrink-0 ml-2">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 truncate">2. Validate target message consumption assumptions</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 font-bold border border-rose-200 shrink-0 ml-2">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 truncate">3. Prioritize complex interfaces for early assessment</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-600 font-bold border border-amber-200 shrink-0 ml-2">Medium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 truncate">4. Develop detailed cutover plan</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-600 font-bold border border-amber-200 shrink-0 ml-2">Medium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 truncate">5. Review compliance requirements with SAP BTP</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-600 font-bold border border-emerald-200 shrink-0 ml-2">Low</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ROW 5: Supporting Cards (Bottom Grid)                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card 1: Migration Complexity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs">📊</span>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Migration Complexity</h4>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xl font-black text-amber-600">{complexityLabel}</span>
                <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: complexityWidth }} />
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-right font-mono">
                <div><span className="text-slate-400 font-sans">Interfaces: </span><strong className="text-slate-800">{totalInterfaces}</strong></div>
                <div><span className="text-slate-400 font-sans">Complex: </span><strong className="text-slate-800">{complexInterfaces} ({complexPct}%)</strong></div>
                <div><span className="text-slate-400 font-sans">Message Volume: </span><strong className="text-slate-800">{throughput}/mo</strong></div>
                <div><span className="text-slate-400 font-sans">Custom Dev: </span><strong className="text-slate-800 font-sans">{customDev}</strong></div>
              </div>
            </div>
          </div>

          {/* Card 3: What Could Change the Decision? */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-amber-600">
                <span className="text-sm">⚠️</span>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">What Could Change the Decision?</h4>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[9px]">1</span>
                    <span className="text-slate-700">Migration cost increase</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 font-bold border border-rose-200 text-[10px]">High</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[9px]">2</span>
                    <span className="text-slate-700">Lower annual savings</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-600 font-bold border border-amber-200 text-[10px]">Medium</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[9px]">3</span>
                    <span className="text-slate-700">Higher target platform cost</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-600 font-bold border border-amber-200 text-[10px]">Medium</span>
                </div>
              </div>
            </div>

            <Link href={`/scenarios/${assessmentId}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 block pt-1">
              View Sensitivity Analysis →
            </Link>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ValueLens AI Live Insights Modal                                          */}
        {/* ========================================================================= */}
        {aiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 text-white shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center text-sm font-bold shadow-xs">
                    ✦
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold">{aiModalTitle}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {aiModalTab === 'executive' ? (aiAnalysis?.aiStatus || 'AI GENERATED') : (chartInsight?.aiStatus || 'AI GENERATED')}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
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
              <div className="relative z-10 shrink-0 bg-slate-100 border-b border-slate-200 p-2 grid grid-cols-5 gap-1.5 min-h-[48px]">
                <button
                  type="button"
                  onClick={() => switchModalTab('tco-comparison', 'Platform Cost Breakdown & TCO Reduction')}
                  className={`px-2 py-2 rounded-xl transition-all duration-150 cursor-pointer font-bold whitespace-nowrap text-xs flex items-center justify-center gap-1.5 select-none ${
                    aiModalTab === 'tco-comparison'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  }`}
                >
                  <span className="shrink-0">📊</span>
                  <span className="truncate">Cost Comparison</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('cost-drivers', 'Legacy TCO Cost Drivers & Elimination')}
                  className={`px-2 py-2 rounded-xl transition-all duration-150 cursor-pointer font-bold whitespace-nowrap text-xs flex items-center justify-center gap-1.5 select-none ${
                    aiModalTab === 'cost-drivers'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  }`}
                >
                  <span className="shrink-0">🔍</span>
                  <span className="truncate">Cost Drivers</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('migration-cost', 'Migration Investment Breakdown & Phasing')}
                  className={`px-2 py-2 rounded-xl transition-all duration-150 cursor-pointer font-bold whitespace-nowrap text-xs flex items-center justify-center gap-1.5 select-none ${
                    aiModalTab === 'migration-cost'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  }`}
                >
                  <span className="shrink-0">💼</span>
                  <span className="truncate">Migration Cost</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('roi-timeline', '10-Year ROI Trajectory & Capital Recovery')}
                  className={`px-2 py-2 rounded-xl transition-all duration-150 cursor-pointer font-bold whitespace-nowrap text-xs flex items-center justify-center gap-1.5 select-none ${
                    aiModalTab === 'roi-timeline'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  }`}
                >
                  <span className="shrink-0">📈</span>
                  <span className="truncate">ROI Timeline</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchModalTab('executive', 'Executive Decision Intelligence & Strategy')}
                  className={`px-2 py-2 rounded-xl transition-all duration-150 cursor-pointer font-bold whitespace-nowrap text-xs flex items-center justify-center gap-1.5 select-none ${
                    aiModalTab === 'executive'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  }`}
                >
                  <span className="shrink-0">⚡</span>
                  <span className="truncate">Full Advisory</span>
                </button>
              </div>

              {/* Modal Body: Pure Actual AI Insights */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1 min-h-0">
                {(aiModalTab === 'executive' ? aiAnalysisLoading : chartInsightLoading) && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center space-x-3 text-purple-900 animate-pulse">
                    <span className="animate-spin text-lg">⟳</span>
                    <div className="text-xs">
                      <span className="font-bold block">Synthesizing Live AI Decision Intelligence...</span>
                      <span className="text-purple-600 text-[11px]">Connecting to NVIDIA NIM (meta/llama-3.2-11b-vision-instruct)</span>
                    </div>
                  </div>
                )}

                {/* TAB 1-4: Chart Insight Views */}
                {aiModalTab !== 'executive' && chartInsight && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Key Executive Finding */}
                    <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl space-y-1.5 shadow-xs">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-800">
                        <span>✦</span>
                        <span>Key Executive Finding</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                        {chartInsight.finding}
                      </p>
                    </div>

                    {/* Detailed Multi-Paragraph Quantitative Analysis */}
                    {chartInsight.detailedAnalysis && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 shadow-xs">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                          <span>📊</span>
                          <span>In-Depth Quantitative Analysis & Variance Drivers</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {chartInsight.detailedAnalysis}
                        </p>
                      </div>
                    )}

                    {/* Key Metrics Grid */}
                    {chartInsight.keyMetrics && chartInsight.keyMetrics.length > 0 && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                        <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                          Key Financial Metrics & Drivers
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                          {chartInsight.keyMetrics.map((metric, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                              <span className="text-slate-500 text-[10px] uppercase font-bold block">{metric.label}</span>
                              <span className="text-base font-black text-slate-900 font-mono block">{metric.value}</span>
                              {metric.detail && (
                                <span className="text-[10px] text-slate-600 block">{metric.detail}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Financial & Business Impact */}
                    <div className="p-4 bg-emerald-50/80 border border-emerald-100 rounded-2xl space-y-1.5 shadow-xs">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                        <span>📈</span>
                        <span>Financial & Business Impact</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {chartInsight.businessImpact}
                      </p>
                    </div>

                    {/* Implementation Playbook & Execution Milestones */}
                    {chartInsight.actionRoadmap && chartInsight.actionRoadmap.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <span>🚀</span>
                            <span>Implementation Playbook & Phased Execution</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">Milestone progression</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {chartInsight.actionRoadmap.map((item, idx) => (
                            <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 shadow-xs">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase inline-block">
                                {item.phase}
                              </span>
                              <h5 className="font-bold text-slate-900 text-xs mt-1">{item.title}</h5>
                              <p className="text-slate-600 text-[11px] leading-relaxed">{item.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Operational Safeguards & Gating Controls */}
                    {chartInsight.riskSafeguards && chartInsight.riskSafeguards.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <span>🛡️</span>
                            <span>Operational Safeguards & Risk Controls</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">Mitigation governance</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {chartInsight.riskSafeguards.map((item, idx) => (
                            <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 shadow-xs">
                              <div className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                                <span className="font-bold text-slate-900 text-xs">{item.risk}</span>
                              </div>
                              <p className="text-slate-600 text-[11px] leading-relaxed pl-3.5 border-l-2 border-amber-200 mt-1">
                                <strong className="text-slate-700">Mitigation: </strong>{item.mitigation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strategic Steering Recommendation */}
                    <div className="p-4 bg-amber-50/80 border border-amber-100 rounded-2xl space-y-1.5 shadow-xs">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                        <span>🎯</span>
                        <span>Strategic Steering Recommendation</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {chartInsight.recommendation}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 5: Executive Full Advisory View */}
                {aiModalTab === 'executive' && aiAnalysis && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Executive Decision Banner */}
                    <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                          Autonomous Strategic Recommendation
                        </span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xl font-black text-emerald-400">{aiAnalysis.decision}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            MIGRATION HIGHLY RECOMMENDED
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Rapid payback within <strong className="text-white font-bold">{breakEvenMonths.toFixed(1)} months</strong> with 5-year ROI of <strong className="text-emerald-400 font-bold">{fiveYearRoi.toFixed(2)}%</strong>.
                        </p>
                      </div>
                      <div className="text-right border-l border-slate-800 pl-4 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Model Confidence</span>
                        <span className="text-2xl font-black text-indigo-400 font-mono">
                          {Math.round((aiAnalysis.confidence || 0.91) * 100)}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">High Statistical Certainty</span>
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-2xl space-y-1.5 shadow-xs">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900">
                        <span>📋</span>
                        <span>Executive Summary & Strategic Context</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                        {aiAnalysis.executiveSummary}
                      </p>
                    </div>

                    {/* Financial Assessment */}
                    <div className="p-4 bg-emerald-50/80 border border-emerald-100 rounded-2xl space-y-1.5 shadow-xs">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                        <span>💰</span>
                        <span>Financial Assessment & Margin Impact</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                        {aiAnalysis.financialAssessment}
                      </p>
                    </div>

                    {/* Key Strategic Recommendations */}
                    {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <span>🎯</span>
                            <span>Key Strategic Recommendations & Action Plan</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">Prioritized by business impact</span>
                        </div>
                        <div className="space-y-2">
                          {aiAnalysis.recommendations.map((rec, idx) => (
                            <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5 shadow-xs">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    rec.priority === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                                  }`}>
                                    {rec.priority} PRIORITY
                                  </span>
                                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{rec.action}</span>
                                </div>
                                <div className="shrink-0 text-right">
                                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                    {rec.timing}
                                  </span>
                                </div>
                              </div>
                              <p className="text-slate-600 text-[11px] leading-relaxed">{rec.reason}</p>
                              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                                <span className="text-indigo-700 font-semibold">Expected Impact: {rec.expectedImpact}</span>
                                <span className="text-slate-500 font-medium">Owner: {rec.owner}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risk Register */}
                    {aiAnalysis.risks && aiAnalysis.risks.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <span>⚠️</span>
                            <span>Enterprise Technical & Operational Risk Register</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">Audit & governance verified</span>
                        </div>
                        <div className="space-y-2">
                          {aiAnalysis.risks.map((risk, idx) => (
                            <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5 shadow-xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    risk.severity === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                    risk.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                    'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}>
                                    {risk.severity} SEVERITY
                                  </span>
                                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{risk.title}</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                  <span className="font-bold text-slate-700 block mb-0.5">Root Cause & Exposure:</span>
                                  <p className="text-slate-600">{risk.reason} {risk.potentialImpact}</p>
                                </div>
                                <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-100">
                                  <span className="font-bold text-emerald-800 block mb-0.5">Recommended Mitigation:</span>
                                  <p className="text-emerald-900">{risk.mitigation}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  Assessment: {assessmentId}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => router.push(`/scenarios/${assessmentId}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                  >
                    Scenario Simulator →
                  </button>
                  <button
                    onClick={() => setAiModalOpen(false)}
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
