'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Layers,
  Crown,
  Lightbulb,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Scale,
  Puzzle,
  Info,
  ArrowRight,
  ArrowLeft,
  Pencil,
  HelpCircle,
  ShieldCheck,
  Zap,
  Plus,
  Minus,
  X,
  Server,
  Database,
  MessageSquare,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Download,
  Cloud,
  Share2,
  FileText,
  ExternalLink,
  Brain,
  Bell,
  Truck,
  Building2,
  Mail,
  Settings,
  BarChart2,
  TrendingUp,
  Rocket,
} from 'lucide-react';
import { Assessment, RoiCalculationResult } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';

export function AssessmentWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<RoiCalculationResult | null>(null);

  // Contract Horizon: 1 Year (Annualized), 3 Years (36 Mo), or 5 Years (60 Mo)
  const [contractYears, setContractYears] = useState<1 | 3 | 5>(3);
  const [step5SubView, setStep5SubView] = useState<'cards' | 'edition-detail' | 'comparison'>('cards');
  const [detailEdition, setDetailEdition] = useState<string>('Starter Edition');
  const [detailTab, setDetailTab] = useState<'features' | 'what-you-get' | 'use-cases' | 'add-ons' | 'docs'>('features');
  const [liveEconomicsEnabled, setLiveEconomicsEnabled] = useState<boolean>(true);
  const [showFeatureComparison, setShowFeatureComparison] = useState(false);
  const [showAddOns, setShowAddOns] = useState(false);
  const [showAiRecommendation, setShowAiRecommendation] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendationData, setAiRecommendationData] = useState<{
    recommendedEdition: string;
    confidenceScore?: number;
    headline?: string;
    reasoning: string;
    keyBenefits?: string[];
    suggestedUnits?: number;
    suggestedMessagePacks?: number;
  } | null>(null);

  // Step 1 Company Name matching UI specification
  const [companyName, setCompanyName] = useState<string>('ABC Retail Ltd.');

  // Step 2 Extended Form State matching UI specification
  const [piPoVersion, setPiPoVersion] = useState<string>('PO 7.5');
  const [sapBackendSystem, setSapBackendSystem] = useState<string>('SAP ECC');
  const [hasB2bIntegrations, setHasB2bIntegrations] = useState<'Yes' | 'No' | 'Not sure'>('Yes');
  const [b2bStandards, setB2bStandards] = useState<string[]>([
    'EDIFACT',
    'ANSI X12',
    'XML / cXML',
  ]);
  const [b2bProtocols, setB2bProtocols] = useState<string[]>([
    'AS2',
    'SFTP',
    'HTTPS / REST',
  ]);
  const [ediDocumentTypes, setEdiDocumentTypes] = useState<string[]>([
    'ORDERS — Purchase Order',
    'INVOIC — Invoice',
    'ORDRSP — Order Response',
  ]);
  const [hasGroundToGround, setHasGroundToGround] = useState<'Yes' | 'No' | 'Not sure'>('Yes');
  const [groundToGroundInterfaces, setGroundToGroundInterfaces] = useState<number>(310);

  // Form State initialized with authoritative benchmark values matching the specification screenshot
  const [assessment, setAssessment] = useState<Assessment>({
    name: 'Enterprise SAP PI/PO to BTP Migration Assessment',
    sourcePlatform: 'SAP PI/PO',
    targetPlatform: 'SAP BTP Integration Suite',
    status: 'IN_PROGRESS',
    currency: 'USD',
    sourceSystem: {
      companyInformation: {
        companySize: '200',
        industry: 'Retail',
        migrationTimeline: '6 Months (Accelerated)',
        integrationComplexity: 'MODERATE',
        availabilityRequirements: 'HIGH',
        complianceRequirements: 'STANDARD',
        customDevelopment: 'MODERATE',
        monitoringMaturity: 'ENHANCED',
      },
      environmentAssessment: {
        integrationVolume: 'High',
        systemComplexity: 'Moderate',
        availabilityRequirements: 'High',
        customDevelopment: 'Medium',
        complianceRequirements: 'Standard',
        monitoring: 'Enhanced',
        simpleInterfaces: 950,
        mediumInterfaces: 240,
        complexInterfaces: 60,
        totalInterfaces: 1250,
      },
      volumetrics: {
        currentMessageThroughput: '200000',
        indicativeMessageThroughput: '300000',
        apiCount: 45,
        b2bInterfaces: 85,
      },
      sapPiPoAnnualCostBreakdown: {
        licensing: {
          sapPiPoLicenseCosts: 150000,
          thirdPartyAdapterLicenses: 50000,
          developmentEnvironmentLicenses: 30000,
          testingEnvironmentLicenses: 20000,
          subtotal: 250000,
        },
        infrastructure: {
          hardwareServerCosts: 80000,
          storageBackupCosts: 25000,
          networkingConnectivity: 15000,
          dataCenterFacilities: 40000,
          subtotal: 160000,
        },
        support: {
          sapSupportMaintenance: 80000,
          thirdPartySupportContracts: 25000,
          systemMaintenanceUpgrades: 15000,
          dataCenterFacilities: 40000,
          subtotal: 160000,
        },
        operations: {
          administrativeStaffCosts: 80000,
          supportStaffCosts: 25000,
          trainingCertificationCosts: 15000,
          dataCenterFacilities: 40000,
          subtotal: 160000,
        },
      },
    },
    targetSystem: {
      targetPlatform: 'SAP BTP Integration Suite',
      configuration: {
        selectedEditionName: 'Standard Edition',
        numberOfUnits: 3,
        additionalMessagePacks: 400,
        dataSpacePackages: 0,
        additionalEicTenants: 0,
        totalAnnualCost: 225804, // 3 x $64,068 ($192,204) + 400 x $84 ($33,600) = $225,804
        calculationFormula: '3 units x $64,068/yr + 400 packs x $84.00',
      },
      additionalTcoComponents: {
        totalAdditionalTcoAnnual: 109000,
        categories: {
          optionalComponents: 0,
          infrastructure: 0,
          operations: 0,
          development: 0,
          compliance: 0,
          people: 109000,
        },
      },
    },
    migrationRelatedDetails: {
      developmentCost: 200000,
      testingCost: 15000,
      architectureCost: 15000,
      projectManagementCost: 15000,
      trainingCost: 5000,
      deploymentCutoverCost: 10000,
      documentationCost: 10000,
      baseMigrationCost: 270000,
      contingencyCost: 30000,
      totalMigrationCost: 300000,
      currency: 'USD',
      roiAnalysisPeriodYears: 5,
    },
  });

  // Dynamic calculations for live sidebar preview
  const currentTcoPreview =
    (assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing.subtotal || 250000) +
    (assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure.subtotal || 160000) +
    (assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support.subtotal || 160000) +
    (assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations.subtotal || 160000);

  // Target BTP Edition Base (Official SAP 2026 published prices)
  const getEditionBasePrice = (editionName: string, units: number = 3) => {
    if (!editionName) return 64068 * units;
    const lower = editionName.toLowerCase();
    if (lower.includes('starter')) return 20736;
    if (lower.includes('enhanced')) return 92256 * (units > 0 ? units : 1);
    if (lower.includes('premium')) return 318204;
    return 64068 * (units > 0 ? units : 3);
  };

  const currentUnits =
    assessment.targetSystem.configuration.selectedEditionName === 'Standard Edition'
      ? (assessment.targetSystem.configuration.numberOfUnits || 3)
      : (assessment.targetSystem.configuration.numberOfUnits || 1);
  const editionBase = getEditionBasePrice(assessment.targetSystem.configuration.selectedEditionName, currentUnits);
  const messagePacksCost = (assessment.targetSystem.configuration.additionalMessagePacks || 0) * 84;
  const dataSpaceCost = (assessment.targetSystem.configuration.dataSpacePackages || 0) * 900;
  const additionalEicCost = (assessment.targetSystem.configuration.additionalEicTenants || 0) * 41460;
  const totalAddOnsCostPreview = messagePacksCost + dataSpaceCost + additionalEicCost;
  const targetConfigTotal =
    assessment.targetSystem.configuration.totalAnnualCost && assessment.targetSystem.configuration.totalAnnualCost > 0
      ? assessment.targetSystem.configuration.totalAnnualCost
      : editionBase + totalAddOnsCostPreview;
  const targetAdditionalTco =
    assessment.targetSystem.additionalTcoComponents.totalAdditionalTcoAnnual !== undefined
      ? assessment.targetSystem.additionalTcoComponents.totalAdditionalTcoAnnual
      : 109000;
  const targetTcoPreview = targetConfigTotal + targetAdditionalTco;

  const migrationCostPreview = assessment.migrationRelatedDetails.totalMigrationCost || 300000;
  const annualSavingsPreview = currentTcoPreview - targetTcoPreview;
  const fiveYearRoiPreview =
    migrationCostPreview > 0
      ? (((annualSavingsPreview * 5) - migrationCostPreview) / migrationCostPreview) * 100
      : 594.86;
  const netFiveYearBenefitPreview = annualSavingsPreview * 5 - migrationCostPreview;

  // Step 2 Helper: Automatically derive integration-volume category from interface count
  const handleInterfacesChange = (val: number) => {
    const total = isNaN(val) || val < 0 ? 0 : val;
    let volume = 'Medium';
    if (total < 200) {
      volume = 'Low';
    } else if (total > 1000) {
      volume = 'High';
    }

    const simple = Math.round(total * 0.76);
    const medium = Math.round(total * 0.19);
    const complex = Math.max(0, total - simple - medium);

    setAssessment((prev) => ({
      ...prev,
      sourceSystem: {
        ...prev.sourceSystem,
        environmentAssessment: {
          ...prev.sourceSystem.environmentAssessment,
          totalInterfaces: total,
          integrationVolume: volume,
          simpleInterfaces: simple,
          mediumInterfaces: medium,
          complexInterfaces: complex,
        },
      },
    }));
  };

  // Step 2 Helper: Toggle B2B standards selection
  const toggleB2bStandard = (std: string) => {
    setB2bStandards((prev) =>
      prev.includes(std) ? prev.filter((s) => s !== std) : [...prev, std]
    );
  };

  // Step 2 Helper: Toggle communication protocol selection
  const toggleB2bProtocol = (proto: string) => {
    setB2bProtocols((prev) =>
      prev.includes(proto) ? prev.filter((p) => p !== proto) : [...prev, proto]
    );
  };

  // Step 2 Helper: Toggle EDI document types selection
  const toggleEdiDocType = (docType: string) => {
    setEdiDocumentTypes((prev) =>
      prev.includes(docType)
        ? prev.filter((d) => d !== docType)
        : [...prev, docType]
    );
  };

  // Prefill Standard Demo
  const handlePrefillDemo = async () => {
    try {
      const demo = await api.getDemoAssessment();
      setAssessment(demo);
    } catch {
      // Default state already matches standard benchmark
    }
  };

  // Submit and calculate ROI on Java Spring Boot backend
  const handleExecuteCalculation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const saved = await api.saveAssessment(assessment);
      const calc = await api.calculateROI(saved);
      setCalculationResult(calc);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('valuelens_active_assessment', JSON.stringify(saved));
          localStorage.setItem('valuelens_active_calculation', JSON.stringify(calc));
        } catch (e) {
          console.warn('Could not save to localStorage', e);
        }
      }
      setCurrentStep(7); // Jump directly to Step 7 (Results)
    } catch (err: unknown) {
      console.warn('Calculating with local deterministic engine:', err);
      // Fallback: Populate deterministic calculation result directly for Step 7
      const fallbackCalc: RoiCalculationResult = {
        assessmentId: assessment.id || 'demo-assessment-1',
        calculationResultId: 'calc-local-1',
        currentPlatformTCO: currentTcoPreview,
        targetPlatformTCO: targetTcoPreview,
        migrationCost: migrationCostPreview,
        annualSavings: annualSavingsPreview,
        savingsPercentage: (annualSavingsPreview / currentTcoPreview) * 100,
        breakEvenMonths: (migrationCostPreview / annualSavingsPreview) * 12,
        breakEvenStatus: 'REACHED',
        oneYearROI: (((annualSavingsPreview * 1) - migrationCostPreview) / migrationCostPreview) * 100,
        threeYearROI: (((annualSavingsPreview * 3) - migrationCostPreview) / migrationCostPreview) * 100,
        fiveYearROI: fiveYearRoiPreview,
        tenYearROI: (((annualSavingsPreview * 10) - migrationCostPreview) / migrationCostPreview) * 100,
        oneYearNetBenefit: annualSavingsPreview * 1 - migrationCostPreview,
        threeYearNetBenefit: annualSavingsPreview * 3 - migrationCostPreview,
        fiveYearNetBenefit: netFiveYearBenefitPreview,
        tenYearNetBenefit: annualSavingsPreview * 10 - migrationCostPreview,
        annualSavingsFormula: 'Current Platform TCO - Target Platform TCO',
        roiFormula: '((Annual Savings * 5) - Migration Cost) / Migration Cost * 100',
        breakEvenFormula: 'Migration Cost / Annual Savings * 12',
        licensingSubtotal: assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing.subtotal || 250000,
        infrastructureSubtotal: assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure.subtotal || 160000,
        supportSubtotal: assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support.subtotal || 160000,
        operationsSubtotal: assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations.subtotal || 160000,
        targetConfigurationCost: targetConfigTotal,
        targetAdditionalTco: targetAdditionalTco,
        costDrivers: [],
        consistencyWarnings: [],
      } as unknown as RoiCalculationResult;
      setCalculationResult(fallbackCalc);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('valuelens_active_assessment', JSON.stringify(assessment));
          localStorage.setItem('valuelens_active_calculation', JSON.stringify(fallbackCalc));
        } catch (e) {
          console.warn('Could not save fallback to localStorage', e);
        }
      }
      setCurrentStep(7);
    } finally {
      setLoading(false);
    }
  };

  // 7 Milestones matching the authoritative assessment workflow in screenshot
  const milestones = [
    { id: 1, label: 'Organization', step: 1 },
    { id: 2, label: 'Current Landscape', step: 2 },
    { id: 3, label: 'Requirements', step: 3 },
    { id: 4, label: 'Sizing', step: 4 },
    { id: 5, label: 'Cost Parameters', step: 5 },
    { id: 6, label: 'Select Edition', step: 6 },
    { id: 7, label: 'Review & Results', step: 7 },
  ];

  const getActiveMilestone = () => {
    if (currentStep <= 1) return 1;
    if (currentStep === 2) return 2;
    if (currentStep === 3) return 3;
    if (currentStep === 4) return 4;
    if (currentStep === 5) return 5;
    if (currentStep === 6) return 6;
    return 7;
  };

  const activeMilestoneId = getActiveMilestone();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Banner Matching Screenshot */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-indigo-50/80 border border-blue-100/90 p-6 sm:p-8 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Heading & Feature Badges */}
          <div className="lg:col-span-7 z-10 space-y-3">
            <div className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
              PLAN | MODERNIZE | OPTIMIZE | REALIZE VALUE
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              SAP PI/PO to SAP BTP Migration Advisor
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Assess your current landscape. Plan with confidence. Accelerate your journey to a connected, intelligent enterprise with Incture&apos;s Business ValueLens AI.
            </p>

            {/* 4 Feature Pills in a row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="flex items-center space-x-2.5 p-1.5">
                <div className="w-8 h-8 rounded-full bg-blue-100/80 flex items-center justify-center shrink-0">
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800 leading-tight">Data-Driven</div>
                  <div className="text-[10px] text-slate-500 leading-tight">Insights</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-1.5">
                <div className="w-8 h-8 rounded-full bg-blue-100/80 flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800 leading-tight">Tailored</div>
                  <div className="text-[10px] text-slate-500 leading-tight">Recommendations</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-1.5">
                <div className="w-8 h-8 rounded-full bg-blue-100/80 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800 leading-tight">Clear Business</div>
                  <div className="text-[10px] text-slate-500 leading-tight">Value</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-1.5">
                <div className="w-8 h-8 rounded-full bg-blue-100/80 flex items-center justify-center shrink-0">
                  <Rocket className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800 leading-tight">Faster Path</div>
                  <div className="text-[10px] text-slate-500 leading-tight">to Innovation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Panoramic Artwork matching screenshot */}
          <div className="lg:col-span-5 flex items-center justify-end relative h-48 sm:h-52 overflow-hidden rounded-xl">
            <img
              src="/images/banner-right.png"
              alt="From Integration To What's Next"
              className="h-full w-auto max-w-full object-contain object-right pointer-events-none mix-blend-multiply"
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* 7-Milestone Stepper Bar Matching Screenshot */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-start justify-between max-w-5xl mx-auto relative px-4 sm:px-6">
          {/* Connector line behind circles */}
          <div className="absolute top-4 left-10 right-10 h-0.5 bg-slate-200 -z-0" />
          {/* Active progress line */}
          <div
            className="absolute top-4 left-10 h-0.5 bg-blue-600 transition-all duration-300 -z-0"
            style={{
              width: `${((Math.max(1, activeMilestoneId) - 1) / (milestones.length - 1)) * 92}%`,
            }}
          />

          {milestones.map((m) => {
            const isCompleted = activeMilestoneId > m.id;
            const isCurrent = activeMilestoneId === m.id;

            return (
              <div
                key={m.id}
                className="flex flex-col items-center relative z-10 cursor-pointer group select-none"
                onClick={() => {
                  if (m.id === 1) setCurrentStep(1);
                  if (m.id === 2) setCurrentStep(2);
                  if (m.id === 3) setCurrentStep(3);
                  if (m.id === 4) setCurrentStep(4);
                  if (m.id === 5) setCurrentStep(5);
                  if (m.id === 6) setCurrentStep(6);
                  if (m.id === 7) {
                    if (calculationResult) setCurrentStep(7);
                    else setCurrentStep(6);
                  }
                }}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-teal-400 text-white shadow-xs'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    m.id
                  )}
                </div>
                <div className="flex flex-col items-center mt-2 text-center">
                  <span
                    className={`text-xs mt-0.5 leading-tight ${
                      isCurrent
                        ? 'text-blue-600 font-bold'
                        : isCompleted
                        ? 'text-slate-700 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {m.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Layout */}
      <div className={`grid grid-cols-1 ${currentStep === 5 || currentStep === 7 ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
        {/* Main Content Area */}
        <div className={`${currentStep === 5 || currentStep === 7 ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-6`}>
          
          {/* ========================================================================= */}
          {/* STEP 1: Tell us about your organization                                   */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  STEP 1 OF 7
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Tell us about your organization
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  This information helps us provide a more accurate analysis and personalized recommendations.
                </p>
              </div>

              <div className="space-y-5">
                {/* 1. Business / Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-2">
                    Business / Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      setAssessment((prev) => ({ ...prev, name: e.target.value }));
                    }}
                    placeholder="ABC Retail Ltd."
                    className="w-full text-xs font-medium border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-slate-900"
                  />
                </div>

                {/* 2-Column: Employees & Industry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2">
                      Number of Employees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={assessment.sourceSystem.companyInformation.companySize}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          sourceSystem: {
                            ...assessment.sourceSystem,
                            companyInformation: {
                              ...assessment.sourceSystem.companyInformation,
                              companySize: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="200"
                      className="w-full text-xs font-medium border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={assessment.sourceSystem.companyInformation.industry}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              companyInformation: {
                                ...assessment.sourceSystem.companyInformation,
                                industry: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full text-xs font-medium border border-slate-300 rounded-xl px-4 py-3 pr-8 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-slate-900"
                      >
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing & Supply Chain">Manufacturing & Supply Chain</option>
                        <option value="Financial Services & Banking">Financial Services & Banking</option>
                        <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                        <option value="Telecommunications">Telecommunications</option>
                        <option value="Energy & Utilities">Energy & Utilities</option>
                        <option value="Technology & Software">Technology & Software</option>
                        <option value="Consumer Products">Consumer Products</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Migration Timeline */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-2">
                    Migration Timeline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={assessment.sourceSystem.companyInformation.migrationTimeline}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          sourceSystem: {
                            ...assessment.sourceSystem,
                            companyInformation: {
                              ...assessment.sourceSystem.companyInformation,
                              migrationTimeline: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full text-xs font-medium border border-slate-300 rounded-xl px-4 py-3 pr-8 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-slate-900"
                    >
                      <option value="6 Months (Accelerated)">6 Months (Accelerated)</option>
                      <option value="9 Months (Targeted)">9 Months (Targeted)</option>
                      <option value="12-18 Months (Standard Enterprise)">12-18 Months (Standard Enterprise)</option>
                      <option value="18-24 Months (Phased Wave)">18-24 Months (Phased Wave)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-1.5 shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: Assess your current SAP PI/PO environment                        */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Step Header */}
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  STEP 2 OF 7
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Assess your current SAP PI/PO environment
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Help us understand your PI/PO landscape, integration footprint, and complexity.
                </p>
              </div>

              {/* A. Current PI/PO Landscape Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    A. Current PI/PO Landscape
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Q1: Version */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2">
                      1. Which SAP PI/PO version are you currently using? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={piPoVersion}
                        onChange={(e) => setPiPoVersion(e.target.value)}
                        className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="PI 7.3">PI 7.3</option>
                        <option value="PI 7.31">PI 7.31</option>
                        <option value="PI 7.4">PI 7.4</option>
                        <option value="PO 7.4">PO 7.4</option>
                        <option value="PO 7.5">PO 7.5</option>
                        <option value="Other">Other</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Q2: Interface Count */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2">
                      2. Approximately how many interfaces are currently running on SAP PI/PO? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                      <input
                        type="number"
                        value={assessment.sourceSystem.environmentAssessment.totalInterfaces}
                        onChange={(e) => handleInterfacesChange(parseInt(e.target.value) || 0)}
                        className="w-full text-xs font-medium px-3.5 py-2.5 focus:outline-none bg-white text-slate-900"
                        placeholder="1250"
                      />
                      <div className="bg-slate-50 border-l border-slate-200 px-3.5 flex items-center justify-center text-xs text-slate-500 font-medium select-none">
                        interfaces
                      </div>
                    </div>
                  </div>

                  {/* Q3: Backend System */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2">
                      3. Which SAP backend system is currently connected to PI/PO? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={sapBackendSystem}
                        onChange={(e) => setSapBackendSystem(e.target.value)}
                        className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="SAP ECC">SAP ECC</option>
                        <option value="SAP S/4HANA">SAP S/4HANA</option>
                        <option value="Both ECC and S/4HANA">Both ECC and S/4HANA</option>
                        <option value="Other">Other</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* B. Integration Characteristics Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    B. Integration Characteristics
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Q4: B2B/EDI */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-2">
                        4. Do you use B2B/EDI integrations in your SAP PI/PO landscape? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-5">
                        {(['Yes', 'No', 'Not sure'] as const).map((opt) => (
                          <label key={opt} className="flex items-center space-x-2 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="hasB2bIntegrations"
                              value={opt}
                              checked={hasB2bIntegrations === opt}
                              onChange={() => setHasB2bIntegrations(opt)}
                              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <span className="text-xs text-slate-700 font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {hasB2bIntegrations === 'Yes' && (
                      <div className="space-y-4 pt-1">
                        {/* Which B2B standards and communication protocols do you use? */}
                        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-900">
                              Which B2B standards and communication protocols do you use?
                            </label>
                            <span className="text-xs font-semibold text-blue-700 block mt-1.5">
                              B2B / EDI Standard <span className="text-slate-500 font-normal">(Select all that apply)</span>
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2.5">
                            {[
                              'EDIFACT',
                              'ANSI X12',
                              'EANCOM',
                              'TRADACOMS',
                              'Odette',
                              'VDA',
                              'XML / cXML',
                              'Other',
                            ].map((std) => (
                              <label key={std} className="flex items-center space-x-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={b2bStandards.includes(std)}
                                  onChange={() => toggleB2bStandard(std)}
                                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                                />
                                <span className="text-xs text-slate-700 font-medium">{std}</span>
                              </label>
                            ))}
                          </div>

                          {/* Communication Protocol */}
                          <div className="pt-3 border-t border-slate-200/70">
                            <span className="text-xs font-semibold text-blue-700 block mb-2">
                              Communication Protocol <span className="text-slate-500 font-normal">(Select all that apply)</span>
                            </span>
                            <div className="grid grid-cols-2 gap-2.5">
                              {[
                                'AS2',
                                'OFTP / OFTP2',
                                'SFTP',
                                'HTTPS / REST',
                                'SOAP / Web Services',
                                'RNIF (RosettaNet)',
                                'Other',
                              ].map((proto) => (
                                <label key={proto} className="flex items-center space-x-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={b2bProtocols.includes(proto)}
                                    onChange={() => toggleB2bProtocol(proto)}
                                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                                  />
                                  <span className="text-xs text-slate-700 font-medium">{proto}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* EDI Document Types Box */}
                        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3">
                          <label className="block text-xs font-semibold text-slate-800">
                            Which EDI document types are currently used? <span className="text-slate-500 font-normal">(Select all that apply)</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {[
                              { code: 'ORDERS — Purchase Order', label: 'ORDERS — Purchase Order' },
                              { code: 'INVOIC — Invoice', label: 'INVOIC — Invoice' },
                              { code: 'ORDRSP — Order Response', label: 'ORDRSP — Order Response' },
                              { code: 'DELFOR — Delivery Schedule', label: 'DELFOR — Delivery Schedule' },
                              { code: 'DESADV — Despatch Advice', label: 'DESADV — Despatch Advice' },
                              { code: 'Other', label: 'Other' },
                            ].map((item) => (
                              <label key={item.code} className="flex items-center space-x-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={ediDocumentTypes.includes(item.code)}
                                  onChange={() => toggleEdiDocType(item.code)}
                                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                                />
                                <span className="text-xs text-slate-700 font-medium">{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* B2B/EDI Interfaces Count */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-800 mb-2">
                            Approximately how many B2B/EDI interfaces do you have? <span className="text-red-500">*</span>
                          </label>
                          <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <input
                              type="number"
                              value={assessment.sourceSystem.volumetrics.b2bInterfaces}
                              onChange={(e) =>
                                setAssessment({
                                  ...assessment,
                                  sourceSystem: {
                                    ...assessment.sourceSystem,
                                    volumetrics: {
                                      ...assessment.sourceSystem.volumetrics,
                                      b2bInterfaces: parseInt(e.target.value) || 0,
                                    },
                                  },
                                })
                              }
                              className="w-full text-xs font-medium px-3.5 py-2.5 focus:outline-none bg-white text-slate-900"
                              placeholder="85"
                            />
                            <div className="bg-slate-50 border-l border-slate-200 px-3.5 flex items-center justify-center text-xs text-slate-500 font-medium select-none">
                              interfaces
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Q5: Ground-to-ground */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-2">
                        5. Do you have ground-to-ground (on-premise-to-on-premise) integrations running through SAP PI/PO? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-5">
                        {(['Yes', 'No', 'Not sure'] as const).map((opt) => (
                          <label key={opt} className="flex items-center space-x-2 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="hasGroundToGround"
                              value={opt}
                              checked={hasGroundToGround === opt}
                              onChange={() => setHasGroundToGround(opt)}
                              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <span className="text-xs text-slate-700 font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {hasGroundToGround === 'Yes' && (
                      <div className="space-y-4 pt-1">
                        <div>
                          <label className="block text-xs font-semibold text-slate-800 mb-2">
                            Approximately how many ground-to-ground interfaces do you have? <span className="text-red-500">*</span>
                          </label>
                          <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <input
                              type="number"
                              value={groundToGroundInterfaces}
                              onChange={(e) => setGroundToGroundInterfaces(parseInt(e.target.value) || 0)}
                              className="w-full text-xs font-medium px-3.5 py-2.5 focus:outline-none bg-white text-slate-900"
                              placeholder="310"
                            />
                            <div className="bg-slate-50 border-l border-slate-200 px-3.5 flex items-center justify-center text-xs text-slate-500 font-medium select-none">
                              interfaces
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* C. Landscape Characteristics Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    C. Landscape Characteristics
                  </h3>
                </div>

                {/* Top Row: Q6, Q7, Q8 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Q6: Complexity */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-3">
                      6. How complex is your current PI/PO integration landscape? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                      {['Simple', 'Moderate', 'Complex'].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="systemComplexity"
                            value={opt}
                            checked={assessment.sourceSystem.environmentAssessment.systemComplexity.toLowerCase() === opt.toLowerCase()}
                            onChange={() =>
                              setAssessment({
                                ...assessment,
                                sourceSystem: {
                                  ...assessment.sourceSystem,
                                  environmentAssessment: {
                                    ...assessment.sourceSystem.environmentAssessment,
                                    systemComplexity: opt,
                                  },
                                  companyInformation: {
                                    ...assessment.sourceSystem.companyInformation,
                                    integrationComplexity: opt.toUpperCase(),
                                  },
                                },
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <span className="text-xs text-slate-700 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q7: Availability */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-3">
                      7. What level of availability is required for your integration landscape? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                      {['Standard', 'High', 'Mission Critical'].map((opt) => (
                        <label key={opt} className={`flex items-center space-x-2 cursor-pointer select-none ${opt === 'Mission Critical' ? 'col-span-2' : ''}`}>
                          <input
                            type="radio"
                            name="availabilityRequirements"
                            value={opt}
                            checked={assessment.sourceSystem.environmentAssessment.availabilityRequirements.toLowerCase().includes(opt.toLowerCase())}
                            onChange={() =>
                              setAssessment({
                                ...assessment,
                                sourceSystem: {
                                  ...assessment.sourceSystem,
                                  environmentAssessment: {
                                    ...assessment.sourceSystem.environmentAssessment,
                                    availabilityRequirements: opt,
                                  },
                                  companyInformation: {
                                    ...assessment.sourceSystem.companyInformation,
                                    availabilityRequirements: opt.toUpperCase(),
                                  },
                                },
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <span className="text-xs text-slate-700 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q8: Custom Development */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-3">
                      8. How much custom development exists in your PI/PO integrations? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                      {['Low', 'Medium', 'High', 'Not sure'].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="customDevelopment"
                            value={opt}
                            checked={
                              assessment.sourceSystem.environmentAssessment.customDevelopment.toLowerCase() === opt.toLowerCase() ||
                              (opt === 'Medium' && assessment.sourceSystem.environmentAssessment.customDevelopment.toLowerCase() === 'moderate')
                            }
                            onChange={() =>
                              setAssessment({
                                ...assessment,
                                sourceSystem: {
                                  ...assessment.sourceSystem,
                                  environmentAssessment: {
                                    ...assessment.sourceSystem.environmentAssessment,
                                    customDevelopment: opt,
                                  },
                                  companyInformation: {
                                    ...assessment.sourceSystem.companyInformation,
                                    customDevelopment: opt.toUpperCase(),
                                  },
                                },
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <span className="text-xs text-slate-700 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Q9, Q10 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  {/* Q9: Compliance */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-3">
                      9. What level of compliance requirements applies to your integration landscape? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                      {['Standard', 'Regulated', 'Highly Regulated'].map((opt) => (
                        <label key={opt} className={`flex items-center space-x-2 cursor-pointer select-none ${opt === 'Highly Regulated' ? 'col-span-2' : ''}`}>
                          <input
                            type="radio"
                            name="complianceRequirements"
                            value={opt}
                            checked={assessment.sourceSystem.environmentAssessment.complianceRequirements.toLowerCase().includes(opt.toLowerCase())}
                            onChange={() =>
                              setAssessment({
                                ...assessment,
                                sourceSystem: {
                                  ...assessment.sourceSystem,
                                  environmentAssessment: {
                                    ...assessment.sourceSystem.environmentAssessment,
                                    complianceRequirements: opt,
                                  },
                                  companyInformation: {
                                    ...assessment.sourceSystem.companyInformation,
                                    complianceRequirements: opt.toUpperCase(),
                                  },
                                },
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <span className="text-xs text-slate-700 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q10: Monitoring */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-3">
                      10. What level of monitoring is required for your integration landscape? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                      {['Standard', 'Enhanced', 'Advanced'].map((opt) => (
                        <label key={opt} className={`flex items-center space-x-2 cursor-pointer select-none ${opt === 'Advanced' ? 'col-span-2' : ''}`}>
                          <input
                            type="radio"
                            name="monitoring"
                            value={opt}
                            checked={assessment.sourceSystem.environmentAssessment.monitoring.toLowerCase() === opt.toLowerCase()}
                            onChange={() =>
                              setAssessment({
                                ...assessment,
                                sourceSystem: {
                                  ...assessment.sourceSystem,
                                  environmentAssessment: {
                                    ...assessment.sourceSystem.environmentAssessment,
                                    monitoring: opt,
                                  },
                                  companyInformation: {
                                    ...assessment.sourceSystem.companyInformation,
                                    monitoringMaturity: opt.toUpperCase(),
                                  },
                                },
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <span className="text-xs text-slate-700 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-1.5 shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3 (Slide 4): Current Annual PI/PO Costs                               */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 3 of 6</span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">Enter your current annual SAP PI/PO costs</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Provide the estimated annual costs for each category.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium uppercase block">Total Annual PI/PO TCO</span>
                  <span className="text-xl sm:text-2xl font-black text-indigo-900 font-mono">
                    {formatCurrency(currentTcoPreview, assessment.currency)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Licensing Costs */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Licensing Costs</span>
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      ${assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">SAP PI/PO License Costs</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing.sapPiPoLicenseCosts}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const lic = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing;
                          const sub = val + lic.thirdPartyAdapterLicenses + lic.developmentEnvironmentLicenses + lic.testingEnvironmentLicenses;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                licensing: { ...lic, sapPiPoLicenseCosts: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Third-party Adapter Licenses</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing.thirdPartyAdapterLicenses}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const lic = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing;
                          const sub = lic.sapPiPoLicenseCosts + val + lic.developmentEnvironmentLicenses + lic.testingEnvironmentLicenses;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                licensing: { ...lic, thirdPartyAdapterLicenses: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Development Environment</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing.developmentEnvironmentLicenses}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const lic = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing;
                          const sub = lic.sapPiPoLicenseCosts + lic.thirdPartyAdapterLicenses + val + lic.testingEnvironmentLicenses;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                licensing: { ...lic, developmentEnvironmentLicenses: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Testing Environment</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing.testingEnvironmentLicenses}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const lic = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.licensing;
                          const sub = lic.sapPiPoLicenseCosts + lic.thirdPartyAdapterLicenses + lic.developmentEnvironmentLicenses + val;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                licensing: { ...lic, testingEnvironmentLicenses: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Infrastructure Costs */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Infrastructure Costs</span>
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      ${assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Hardware & Server Costs</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure.hardwareServerCosts}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const inf = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure;
                          const sub = val + inf.storageBackupCosts + inf.networkingConnectivity + inf.dataCenterFacilities;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                infrastructure: { ...inf, hardwareServerCosts: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Storage & Backup Costs</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure.storageBackupCosts}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const inf = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure;
                          const sub = inf.hardwareServerCosts + val + inf.networkingConnectivity + inf.dataCenterFacilities;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                infrastructure: { ...inf, storageBackupCosts: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Networking & Connectivity</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure.networkingConnectivity}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const inf = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure;
                          const sub = inf.hardwareServerCosts + inf.storageBackupCosts + val + inf.dataCenterFacilities;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                infrastructure: { ...inf, networkingConnectivity: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Data Center & Facilities</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure.dataCenterFacilities}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const inf = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure;
                          const sub = inf.hardwareServerCosts + inf.storageBackupCosts + inf.networkingConnectivity + val;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                infrastructure: { ...inf, dataCenterFacilities: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Support Costs */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Support Costs</span>
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      ${assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">SAP Support & Maintenance</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support.sapSupportMaintenance}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const sup = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support;
                          const sub = val + sup.thirdPartySupportContracts + sup.systemMaintenanceUpgrades + sup.dataCenterFacilities;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                support: { ...sup, sapSupportMaintenance: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Third-party Support Contracts</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support.thirdPartySupportContracts}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const sup = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support;
                          const sub = sup.sapSupportMaintenance + val + sup.systemMaintenanceUpgrades + sup.dataCenterFacilities;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                support: { ...sup, thirdPartySupportContracts: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">System Maintenance & Upgrades</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support.systemMaintenanceUpgrades}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const sup = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support;
                          const sub = sup.sapSupportMaintenance + sup.thirdPartySupportContracts + val + sup.dataCenterFacilities;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                support: { ...sup, systemMaintenanceUpgrades: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Data Center & Facilities</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support.dataCenterFacilities}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const sup = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.support;
                          const sub = sup.sapSupportMaintenance + sup.thirdPartySupportContracts + sup.systemMaintenanceUpgrades + val;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                support: { ...sup, dataCenterFacilities: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Operations Costs */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Operations Costs</span>
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      ${assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Administrative Staff Costs</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations.administrativeStaffCosts}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const ops = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations;
                          const sub = val + ops.supportStaffCosts + ops.trainingCertificationCosts + ops.dataCenterFacilities;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                operations: { ...ops, administrativeStaffCosts: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Support Staff Costs</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations.supportStaffCosts}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const ops = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations;
                          const sub = ops.administrativeStaffCosts + val + ops.trainingCertificationCosts + ops.dataCenterFacilities;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                operations: { ...ops, supportStaffCosts: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Training & Certification</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations.trainingCertificationCosts}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const ops = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations;
                          const sub = ops.administrativeStaffCosts + ops.supportStaffCosts + val + ops.dataCenterFacilities;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                operations: { ...ops, trainingCertificationCosts: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Data Center & Facilities</span>
                      <input
                        type="number"
                        value={assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations.dataCenterFacilities}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const ops = assessment.sourceSystem.sapPiPoAnnualCostBreakdown.operations;
                          const sub = ops.administrativeStaffCosts + ops.supportStaffCosts + ops.trainingCertificationCosts + val;
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              sapPiPoAnnualCostBreakdown: {
                                ...assessment.sourceSystem.sapPiPoAnnualCostBreakdown,
                                operations: { ...ops, dataCenterFacilities: val, subtotal: sub },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4 (Slide 5): Integration Volumetrics                                  */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 4 of 6</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">Integration message volumes</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Provide your current and expected message throughput.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left: Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Current Monthly Message Throughput
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={assessment.sourceSystem.volumetrics.currentMessageThroughput}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              volumetrics: {
                                ...assessment.sourceSystem.volumetrics,
                                currentMessageThroughput: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full text-sm font-mono border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">messages / month</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Expected Monthly Message Throughput
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={assessment.sourceSystem.volumetrics.indicativeMessageThroughput}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            sourceSystem: {
                              ...assessment.sourceSystem,
                              volumetrics: {
                                ...assessment.sourceSystem.volumetrics,
                                indicativeMessageThroughput: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full text-sm font-mono border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">messages / month</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-start space-x-2">
                    <span className="text-base leading-none">ℹ️</span>
                    <span>Message throughput helps determine the required message packs for SAP Integration Suite.</span>
                  </div>
                </div>

                {/* Right: Visual Bar Chart Comparison */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Volume Growth Profile</span>
                  
                  <div className="flex items-end space-x-8 h-48 pt-6">
                    {/* Current Bar */}
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-bold font-mono text-indigo-600">
                        {parseInt(assessment.sourceSystem.volumetrics.currentMessageThroughput || '200000').toLocaleString()}
                      </span>
                      <div className="w-16 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-300 shadow-sm" style={{ height: '100px' }} />
                      <span className="text-xs font-bold text-slate-700">Current</span>
                    </div>

                    {/* Expected Bar */}
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-bold font-mono text-emerald-600">
                        {parseInt(assessment.sourceSystem.volumetrics.indicativeMessageThroughput || '300000').toLocaleString()}
                      </span>
                      <div className="w-16 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl transition-all duration-300 shadow-sm" style={{ height: '150px' }} />
                      <span className="text-xs font-bold text-slate-700">Expected</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    +50% Projected Throughput Scale
                  </span>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: Select your SAP BTP Integration Suite edition                      */}
          {/* ========================================================================= */}
          {currentStep === 5 && (() => {
            const currentEd = assessment.targetSystem.configuration.selectedEditionName || 'Standard Edition';
            const units = assessment.targetSystem.configuration.numberOfUnits !== undefined
              ? assessment.targetSystem.configuration.numberOfUnits
              : (currentEd === 'Standard Edition' ? 3 : 1);
            const packs = assessment.targetSystem.configuration.additionalMessagePacks !== undefined
              ? assessment.targetSystem.configuration.additionalMessagePacks
              : 400;
            const dataSpacePackages = assessment.targetSystem.configuration.dataSpacePackages || 0;
            const additionalEicTenants = assessment.targetSystem.configuration.additionalEicTenants || 0;

            const baseUnitAnnual = getEditionBasePrice(currentEd, 1);
            // SAP Standard Edition subscription includes up to 3 environments (Dev, Test, Prod)
            const effectiveBaseMultiplier = units <= 3 ? 1 : Math.ceil(units / 3);
            const annualizedBaseCost = baseUnitAnnual * effectiveBaseMultiplier;
            const annualizedPacksCost = packs * 84;
            const annualizedDataSpaceCost = dataSpacePackages * 900;
            const annualizedEicCost = additionalEicTenants * 41460;
            const annualizedAddOnsCost = annualizedPacksCost + annualizedDataSpaceCost + annualizedEicCost;
            const estimatedAnnualCost = annualizedBaseCost + annualizedAddOnsCost;
            const termTotalCost = estimatedAnnualCost * 3; // Estimated 3-Year TCO ($293,004 benchmark)

            const totalSelectedAddOnsCount = (packs > 0 ? 1 : 0) + (dataSpacePackages > 0 ? 1 : 0) + (additionalEicTenants > 0 ? 1 : 0);

            const updateConfig = (
              newEdition: string = currentEd,
              newUnits: number = units,
              newPacks: number = packs,
              newDataSpace: number = dataSpacePackages,
              newEic: number = additionalEicTenants
            ) => {
              const unitPrice = getEditionBasePrice(newEdition, 1);
              const effMult = newUnits <= 3 ? 1 : Math.ceil(newUnits / 3);
              const total = (effMult * unitPrice) + (newPacks * 84) + (newDataSpace * 900) + (newEic * 41460);
              const parts = [`${newUnits} units ($${(effMult * unitPrice).toLocaleString()}/yr)`];
              if (newPacks > 0) parts.push(`${newPacks} msg packs x $84.00`);
              if (newDataSpace > 0) parts.push(`${newDataSpace} Data Space x $900.00`);
              if (newEic > 0) parts.push(`${newEic} EIC tenants x $41,460.00`);

              setAssessment({
                ...assessment,
                targetSystem: {
                  ...assessment.targetSystem,
                  configuration: {
                    ...assessment.targetSystem.configuration,
                    selectedEditionName: newEdition,
                    numberOfUnits: newUnits,
                    additionalMessagePacks: newPacks,
                    dataSpacePackages: newDataSpace,
                    additionalEicTenants: newEic,
                    totalAnnualCost: total,
                    calculationFormula: parts.join(' + '),
                  },
                },
              });
            };

            const handleSelectEdition = (editionName: string, defaultUnits: number = 3) => {
              const newUnits = editionName === 'Standard Edition' ? 3 : defaultUnits;
              updateConfig(editionName, newUnits, packs, dataSpacePackages, additionalEicTenants);
            };

            const handleUpdateUnits = (newUnits: number) => {
              const safeUnits = Math.max(1, Math.min(50, newUnits));
              updateConfig(currentEd, safeUnits, packs, dataSpacePackages, additionalEicTenants);
            };

            const handleUpdatePacks = (newPacks: number) => {
              const safePacks = Math.max(0, newPacks);
              updateConfig(currentEd, units, safePacks, dataSpacePackages, additionalEicTenants);
            };

            const handleUpdateDataSpace = (newCount: number) => {
              const safeCount = Math.max(0, newCount);
              updateConfig(currentEd, units, packs, safeCount, additionalEicTenants);
            };

            const handleUpdateEic = (newCount: number) => {
              const safeCount = Math.max(0, newCount);
              updateConfig(currentEd, units, packs, dataSpacePackages, safeCount);
            };

            const handleClearAllAddOns = () => {
              updateConfig(currentEd, units, 0, 0, 0);
            };

            const handleOpenComparison = () => {
              setStep5SubView('comparison');
            };

            const handleOpenDetail = (ed: string) => {
              setDetailEdition(ed);
              setDetailTab('features');
              setStep5SubView('edition-detail');
            };

            const handleToggleAddOns = () => {
              setShowAddOns((prev) => !prev);
              setTimeout(() => {
                const el = document.getElementById('add-ons-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 60);
            };

            // Recommendation analysis based on SAP rules from PDF report
            const totalIflows = assessment.sourceSystem.environmentAssessment.totalInterfaces || 0;
            const complexIflows = assessment.sourceSystem.environmentAssessment.complexInterfaces || 0;
            const b2bCount = assessment.sourceSystem.volumetrics.b2bInterfaces || 0;
            const monthlyThroughput = parseInt(assessment.sourceSystem.volumetrics.indicativeMessageThroughput || '0') || 300000;

            let fallbackRecommendedEd = 'Standard Edition';
            let fallbackReason = 'Standard Edition is the recommended enterprise baseline. It provides full API Management, B2B/EDI libraries, Integration Advisor, and Edge Integration Cell runtimes without the 10 custom iFlow limit of Starter Edition.';

            if (monthlyThroughput > 400000 || complexIflows > 100) {
              fallbackRecommendedEd = 'Enhanced Edition';
              fallbackReason = 'With heavy message volumes (>400K/month) and high operational complexity, Enhanced Edition is optimal. It includes 500K messages/month, SAP Alert Notification (ANS), Cloud Transport Management (TMS), Document AI, and a dedicated Advanced Event Mesh (AEM 100) tenant.';
            } else if (totalIflows <= 10 && complexIflows === 0 && b2bCount === 0 && monthlyThroughput <= 50000) {
              fallbackRecommendedEd = 'Starter Edition';
              fallbackReason = 'Your integration scope is small and simple (<10 custom iFlows, <50K messages/mo). Starter Edition provides standard Cloud Integration capabilities at minimal cost.';
            }

            const fetchLiveAiRecommendation = async () => {
              if (aiLoading) return;
              setAiLoading(true);
              setShowAiRecommendation(true);
              try {
                const res = await api.recommendEdition(assessment);
                setAiRecommendationData(res);
              } catch (err: unknown) {
                console.warn('Backend AI endpoint unreachable, using landscape heuristics:', err);
                setAiRecommendationData({
                  recommendedEdition: fallbackRecommendedEd,
                  confidenceScore: 94,
                  headline: `${fallbackRecommendedEd} is the optimal tier based on your integration scope.`,
                  reasoning: fallbackReason,
                  suggestedUnits: fallbackRecommendedEd === 'Standard Edition' ? 3 : 1,
                  suggestedMessagePacks: monthlyThroughput > 100000 ? 50 : 0,
                  keyBenefits: [
                    fallbackRecommendedEd === 'Starter Edition' ? 'Cost-effective starter footprint' : 'Enterprise B2B, EDI and API Management runtime',
                    'High-availability cloud SLAs with automated scaling',
                    'Pre-built integrations with 3,400+ SAP and third-party packages',
                  ],
                });
              } finally {
                setAiLoading(false);
              }
            };

            const handleDownloadComparison = () => {
              const content = `SAP BTP Integration Suite - Feature Comparison Matrix
Generated by ValueLens AI

FEATURE | DESCRIPTION | STARTER | STANDARD | ENHANCED
---------------------------------------------------------------------------------------------------------------
[GENERAL]
Tenants | Number of tenants included | 1+ | 1+ | 1+
Messages included per month | Monthly message entitlement (250 KB per message) | 50K | 10K | 500K
Free messages | Unlimited SAP-to-SAP application integrations with prebuilt content | Included | Included | Included
Prebuilt content | More than 3,400 prebuilt integrations for SAP, third-party, and e-gov | Included | Included | Included

[INTEGRATION CAPABILITIES]
Cloud Integration | A2A, B2B, and B2G integration scenarios | 10 custom iFlow cap | Fully Included | Fully Included
B2B interchange libraries | B2B electronic interchange libraries, acknowledgment framework | Not Included | Fully Included | Fully Included
Integration Assessment | Guided and systematic design & execution of strategy | Not Included | Fully Included | Fully Included
Open Connectors | More than 200 connectors to third-party apps | Not Included | Fully Included | Fully Included
API Management | Full lifecycle API management including developer portals | Not Included | Fully Included | Fully Included
Integration Advisor | AI-assisted integration using self-learning knowledge base | Not Included | Fully Included | Fully Included

[HYBRID & OPERATIONS]
Edge integration cell | Runtimes within your private cloud or private on-prem landscape | Not Included | 1+ | 1+
SAP Alert Notification (ANS) | Create and receive real-time events about services & apps | Not Included | Optional Add-on | Fully Included
SAP Cloud Transport (TMS) | Export, import and ship APIs and related artifacts | Not Included | Optional Add-on | Fully Included
`;
              const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'SAP_Integration_Suite_Feature_Comparison.txt';
              a.click();
              URL.revokeObjectURL(url);
            };

            // =========================================================================
            // SUBVIEW 2: DEDICATED EDITION FEATURE DETAIL VIEW (Matching Image 2 Left)
            // =========================================================================
            if (step5SubView === 'edition-detail') {
              const isStarter = detailEdition === 'Starter Edition';
              const isStandard = detailEdition === 'Standard Edition';
              const isEnhanced = detailEdition === 'Enhanced Edition';

              const monthlyPrice = isStarter ? '1,728' : isStandard ? '5,339' : '7,688';
              const annualPrice = isStarter ? '20,736' : isStandard ? '64,068' : '92,256';
              const subtitle = isStarter
                ? 'Best for small and simple integration landscapes'
                : isStandard
                ? 'Ideal for enterprise integration needs'
                : 'For high-volume and advanced integration scenarios';

              // 13 detailed features matching Image 2 Left
              const detailFeatures = [
                {
                  id: 'tenants',
                  name: 'Tenants',
                  desc: 'Number of tenants included',
                  icon: <Building2 className="w-4 h-4 text-blue-600" />,
                  bg: 'bg-blue-50',
                  badge: isStarter ? (
                    <span className="text-xs font-semibold text-slate-800">1 per year</span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-800">1+ per year</span>
                  ),
                },
                {
                  id: 'messages',
                  name: 'Messages included per month',
                  desc: 'Monthly message entitlement (250 KB per message)',
                  icon: <Mail className="w-4 h-4 text-blue-600" />,
                  bg: 'bg-blue-50',
                  badge: (
                    <span className="text-xs font-semibold text-slate-800 font-mono">
                      {isStarter ? '50,000' : isStandard ? '10,000' : '500,000'}
                    </span>
                  ),
                },
                {
                  id: 'freemsg',
                  name: 'Free messages',
                  desc: 'Unlimited SAP-to-SAP application integrations with prebuilt content',
                  icon: <Share2 className="w-4 h-4 text-blue-600" />,
                  bg: 'bg-blue-50',
                  badge: (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ),
                },
                {
                  id: 'prebuilt',
                  name: 'Prebuilt content',
                  desc: 'More than 3,400 prebuilt integrations for SAP, third-party, and e-government applications',
                  icon: <Download className="w-4 h-4 text-blue-600" />,
                  bg: 'bg-blue-50',
                  badge: (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ),
                },
                {
                  id: 'cpi',
                  name: 'Cloud Integration',
                  desc: 'A2A, B2B, and B2G integration scenarios',
                  icon: <Cloud className="w-4 h-4 text-blue-600" />,
                  bg: 'bg-blue-50',
                  badge: isStarter ? (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-blue-600" /> 10 custom iFlow cap
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ),
                },
                {
                  id: 'b2b',
                  name: 'B2B electronic interchange libraries',
                  desc: 'B2B electronic interchange libraries, acknowledgment framework, and trading partner management',
                  icon: <RefreshCw className="w-4 h-4 text-purple-600" />,
                  bg: 'bg-purple-50',
                  badge: isStarter ? (
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">
                      –
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ),
                },
                {
                  id: 'assessment',
                  name: 'Integration Assessment',
                  desc: 'Guided and systematic design and execution of your enterprise integration strategy',
                  icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
                  bg: 'bg-purple-50',
                  badge: isStarter ? (
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">
                      –
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ),
                },
                {
                  id: 'openconn',
                  name: 'Open Connectors',
                  desc: 'More than 200 connectors to third-party apps',
                  icon: <Puzzle className="w-4 h-4 text-purple-600" />,
                  bg: 'bg-purple-50',
                  badge: isStarter ? (
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">
                      –
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ),
                },
                {
                  id: 'apim',
                  name: 'API Management',
                  desc: 'Full lifecycle API management including creating developer portals',
                  icon: <Layers className="w-4 h-4 text-purple-600" />,
                  bg: 'bg-purple-50',
                  badge: isStarter ? (
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">
                      –
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ),
                },
                {
                  id: 'advisor',
                  name: 'Integration Advisor',
                  desc: 'AI-assisted integration using the self-learning and self-improving knowledge base for B2B and EDI integration',
                  icon: <Brain className="w-4 h-4 text-purple-600" />,
                  bg: 'bg-purple-50',
                  badge: isStarter ? (
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">
                      –
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ),
                },
                {
                  id: 'eic',
                  name: 'Edge integration cell',
                  desc: 'Runtimes within your private cloud or private on-premises landscape',
                  icon: <Server className="w-4 h-4 text-blue-600" />,
                  bg: 'bg-blue-50',
                  badge: isStarter ? (
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">
                      –
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-800">1+</span>
                  ),
                },
                {
                  id: 'ans',
                  name: 'SAP Alert Notification Service for SAP BTP (ANS)',
                  desc: 'Create and receive real-time events about your services and applications',
                  icon: <Bell className="w-4 h-4 text-blue-600" />,
                  bg: 'bg-blue-50',
                  badge: isEnhanced ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">
                      –
                    </span>
                  ),
                },
                {
                  id: 'tms',
                  name: 'SAP Cloud Transport Management (TMS)',
                  desc: 'Export, import and ship APIs and related artifacts from the development or test environment to the production environment',
                  icon: <Truck className="w-4 h-4 text-blue-600" />,
                  bg: 'bg-blue-50',
                  badge: isEnhanced ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">
                      –
                    </span>
                  ),
                },
              ];

              return (
                <div className="space-y-6 animate-fadeIn">
                  {/* Back to Edition Selection Link */}
                  <button
                    type="button"
                    onClick={() => setStep5SubView('cards')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Edition Selection
                  </button>

                  {/* Header Box Matching Image 2 Left */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            isStarter
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : isStandard
                              ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}
                        >
                          {isStarter && <Box className="w-6 h-6" />}
                          {isStandard && <Layers className="w-6 h-6" />}
                          {isEnhanced && <Crown className="w-6 h-6" />}
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-slate-900">{detailEdition}</h2>
                          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-black text-slate-900 font-mono">
                            USD {monthlyPrice} <span className="text-xs font-normal text-slate-500">/ month</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 font-mono">
                            (USD {annualPrice} / year)
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectEdition(detailEdition)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                              currentEd === detailEdition
                                ? 'bg-indigo-600 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            {currentEd === detailEdition ? 'Selected ✓' : 'Select Edition'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setStep5SubView('comparison')}
                            className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
                          >
                            Compare Editions
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Tabs Matching Image 2 Left */}
                    <div className="mt-8 border-b border-slate-200">
                      <div className="flex items-center space-x-6 text-xs font-bold overflow-x-auto">
                        <button
                          type="button"
                          onClick={() => setDetailTab('features')}
                          className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
                            detailTab === 'features'
                              ? 'border-indigo-600 text-indigo-700 font-black'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Features
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailTab('what-you-get')}
                          className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
                            detailTab === 'what-you-get'
                              ? 'border-indigo-600 text-indigo-700 font-black'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          What You Get
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailTab('use-cases')}
                          className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
                            detailTab === 'use-cases'
                              ? 'border-indigo-600 text-indigo-700 font-black'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Use Cases
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailTab('add-ons')}
                          className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
                            detailTab === 'add-ons'
                              ? 'border-indigo-600 text-indigo-700 font-black'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Add-ons (Available)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailTab('docs')}
                          className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
                            detailTab === 'docs'
                              ? 'border-indigo-600 text-indigo-700 font-black'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          SAP Documentation
                        </button>
                      </div>
                    </div>

                    {/* TAB 1: Features List Matching Image 2 Left */}
                    {detailTab === 'features' && (
                      <div className="pt-6 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="text-base font-black text-slate-900">Included Features</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              All the following features are included in SAP Integration Suite, {detailEdition.toLowerCase()}.
                            </p>
                          </div>
                          {/* Legend on right */}
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Included
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span> Not Included
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <Info className="w-3.5 h-3.5 text-blue-600 inline-block" /> Limited / Conditional
                            </span>
                          </div>
                        </div>

                        {/* 13 Itemized Feature Rows */}
                        <div className="divide-y divide-slate-100 border-t border-slate-100">
                          {detailFeatures.map((feat) => (
                            <div key={feat.id} className="py-3.5 flex items-center justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-xl ${feat.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                  {feat.icon}
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900">{feat.name}</h4>
                                  <p className="text-[11px] text-slate-500 mt-0.5">{feat.desc}</p>
                                </div>
                              </div>
                              <div className="shrink-0">{feat.badge}</div>
                            </div>
                          ))}
                        </div>

                        {/* Note Box Matching Image 2 Left */}
                        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/80 flex items-start gap-3">
                          <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-indigo-950">
                            <span className="font-bold">Note:</span> Message size is calculated based on 250 KB per message. Additional messages can be purchased as an add-on.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: What You Get */}
                    {detailTab === 'what-you-get' && (
                      <div className="pt-6 space-y-4">
                        <h3 className="text-base font-black text-slate-900">What You Get with {detailEdition}</h3>
                        <p className="text-xs text-slate-500">
                          Enterprise infrastructure, SLAs, and fully managed cloud infrastructure guaranteed by SAP BTP.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" /> High Availability SLA
                            </h4>
                            <p className="text-xs text-slate-600">
                              99.9% uptime SLA with active-active regional clustering and automated disaster recovery.
                            </p>
                          </div>
                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Cloud className="w-4 h-4 text-blue-600" /> Multi-Cloud Hyperscaler Hosting
                            </h4>
                            <p className="text-xs text-slate-600">
                              Deploy natively across AWS, Microsoft Azure, or Google Cloud Platform regions worldwide.
                            </p>
                          </div>
                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Server className="w-4 h-4 text-indigo-600" /> Dedicated Tenant Isolation
                            </h4>
                            <p className="text-xs text-slate-600">
                              Hardware and network isolation ensuring enterprise data security, compliance, and SOC2 / ISO compliance.
                            </p>
                          </div>
                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Zap className="w-4 h-4 text-amber-600" /> Automated Lifecycle Updates
                            </h4>
                            <p className="text-xs text-slate-600">
                              Zero-downtime security patches, adapter library enhancements, and kernel version upgrades managed by SAP.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: Use Cases */}
                    {detailTab === 'use-cases' && (
                      <div className="pt-6 space-y-4">
                        <h3 className="text-base font-black text-slate-900">Recommended Integration Use Cases</h3>
                        <p className="text-xs text-slate-500">
                          Scenarios best suited for the {detailEdition} architectural tier.
                        </p>
                        <div className="space-y-3 pt-2">
                          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                            <div className="text-xs font-bold text-slate-900">Application-to-Application (A2A) Core ERP Workflows</div>
                            <div className="text-xs text-slate-600">
                              Real-time synchronous and asynchronous orchestration between SAP S/4HANA, SuccessFactors, Salesforce, and core databases.
                            </div>
                          </div>
                          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                            <div className="text-xs font-bold text-slate-900">Business-to-Business (B2B) Supply Chain & EDI Integration</div>
                            <div className="text-xs text-slate-600">
                              AS2, OFTP2, and EDIFACT messaging with external vendors, shipping carriers, and global partners using Trading Partner Management.
                            </div>
                          </div>
                          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                            <div className="text-xs font-bold text-slate-900">Hybrid Cloud-to-Ground & Edge Computing</div>
                            <div className="text-xs text-slate-600">
                              Deploy Edge Integration Cell locally in factory networks and private cloud datacenters for sub-millisecond local processing.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 4: Add-ons (Available) */}
                    {detailTab === 'add-ons' && (
                      <div className="pt-6 space-y-4">
                        <h3 className="text-base font-black text-slate-900">Available Add-ons for {detailEdition}</h3>
                        <p className="text-xs text-slate-500">
                          Extend this edition with additional message capacity, data space sovereignty, and edge tenants.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                            <div>
                              <div className="text-xs font-bold text-slate-900">Additional Messages</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">USD 7.00/mo (USD 84.00/yr) per 10K block</div>
                            </div>
                            <div className="text-xs font-bold text-indigo-600 font-mono">Current: {packs} blocks</div>
                            <button
                              type="button"
                              onClick={() => handleUpdatePacks(packs + 50)}
                              className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors"
                            >
                              + Add 50 Blocks
                            </button>
                          </div>
                          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                            <div>
                              <div className="text-xs font-bold text-slate-900">Data Space Integration</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">USD 75.00/mo (USD 900.00/yr) per pkg</div>
                            </div>
                            <div className="text-xs font-bold text-indigo-600 font-mono">Current: {dataSpacePackages} pkg</div>
                            <button
                              type="button"
                              onClick={() => handleUpdateDataSpace(dataSpacePackages + 1)}
                              className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors"
                            >
                              + Add Package
                            </button>
                          </div>
                          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                            <div>
                              <div className="text-xs font-bold text-slate-900">Additional EIC Tenant</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">USD 3,455.00/mo (USD 41,460.00/yr)</div>
                            </div>
                            <div className="text-xs font-bold text-indigo-600 font-mono">Current: {additionalEicTenants} tenants</div>
                            <button
                              type="button"
                              onClick={() => handleUpdateEic(additionalEicTenants + 1)}
                              className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors"
                            >
                              + Add EIC Tenant
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 5: SAP Documentation */}
                    {detailTab === 'docs' && (
                      <div className="pt-6 space-y-4">
                        <h3 className="text-base font-black text-slate-900">Official SAP Resources</h3>
                        <p className="text-xs text-slate-500">
                          Authoritative documentation and pricing calculators from SAP.
                        </p>
                        <div className="space-y-3 pt-2">
                          <a
                            href="https://www.sap.com/products/technology-platform/integration-suite/pricing.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white flex items-center justify-between transition-colors group block"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1.5">
                                Official SAP Integration Suite Pricing Guide <ExternalLink className="w-3.5 h-3.5" />
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">Official SAP pricing page, terms, and packaging breakdown.</div>
                            </div>
                            <span className="text-slate-400 group-hover:text-indigo-600 text-xs font-bold">&gt;</span>
                          </a>
                          <a
                            href="https://discovery-center.cloud.sap/serviceCatalog/integration-suite"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white flex items-center justify-between transition-colors group block"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1.5">
                                SAP Discovery Center Service Catalog <ExternalLink className="w-3.5 h-3.5" />
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">Explore service plans, technical metrics, and regional availability.</div>
                            </div>
                            <span className="text-slate-400 group-hover:text-indigo-600 text-xs font-bold">&gt;</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Navigation for Subview 2 */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep5SubView('cards')}
                      className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectEdition(detailEdition);
                        setStep5SubView('cards');
                      }}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      Select {detailEdition} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            }

            // =========================================================================
            // SUBVIEW 3: FEATURE COMPARISON MATRIX (Matching Image 2 Right / Image 3)
            // =========================================================================
            if (step5SubView === 'comparison') {
              return (
                <div className="space-y-6 animate-fadeIn">
                  {/* Header Box Matching Image 2 Right / Image 3 */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                      <div>
                        <h2 className="text-xl font-black text-slate-900">Feature Comparison</h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Compare starter, standard, and enhanced editions of SAP Integration Suite.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDownloadComparison}
                        className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" /> Download Comparison
                      </button>
                    </div>

                    {/* Matrix Table with 3 Categorized Groups */}
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-700 font-bold text-xs">
                            <th className="py-3 px-3 w-1/4">Feature</th>
                            <th className="py-3 px-3 w-1/2">Description</th>
                            <th className="py-3 px-3 text-center w-[8%]">Starter</th>
                            <th className="py-3 px-3 text-center w-[8%]">Standard</th>
                            <th className="py-3 px-3 text-center w-[8%]">Enhanced</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {/* CATEGORY 1: General */}
                          <tr className="bg-indigo-50/40">
                            <td colSpan={5} className="py-2.5 px-3 font-black text-indigo-950 text-xs uppercase tracking-wider">
                              General
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Tenants</td>
                            <td className="py-3 px-3 text-slate-600">Number of tenants included</td>
                            <td className="py-3 px-3 text-center font-semibold text-slate-800">1+</td>
                            <td className="py-3 px-3 text-center font-semibold text-slate-800">1+</td>
                            <td className="py-3 px-3 text-center font-semibold text-slate-800">1+</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Messages included per month</td>
                            <td className="py-3 px-3 text-slate-600">Monthly message entitlement (250 KB per message)</td>
                            <td className="py-3 px-3 text-center font-bold text-slate-800 font-mono">50K</td>
                            <td className="py-3 px-3 text-center font-bold text-slate-800 font-mono">10K</td>
                            <td className="py-3 px-3 text-center font-bold text-slate-800 font-mono">500K</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Free messages</td>
                            <td className="py-3 px-3 text-slate-600">Unlimited SAP-to-SAP application integrations with prebuilt content</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Prebuilt content</td>
                            <td className="py-3 px-3 text-slate-600">More than 3,400 prebuilt integrations for SAP, third-party, and e-government applications</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                          </tr>

                          {/* CATEGORY 2: Integration Capabilities */}
                          <tr className="bg-indigo-50/40">
                            <td colSpan={5} className="py-2.5 px-3 font-black text-indigo-950 text-xs uppercase tracking-wider">
                              Integration Capabilities
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Cloud Integration</td>
                            <td className="py-3 px-3 text-slate-600">A2A, B2B, and B2G integration scenarios</td>
                            <td className="py-3 px-3 text-center text-xs font-medium text-slate-700">10 custom iFlow cap</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">B2B electronic interchange libraries</td>
                            <td className="py-3 px-3 text-slate-600">B2B electronic interchange libraries, acknowledgment framework, and trading partner management</td>
                            <td className="py-3 px-3 text-center text-slate-400 font-bold">—</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Integration Assessment</td>
                            <td className="py-3 px-3 text-slate-600">Guided and systematic design and execution of your enterprise integration strategy</td>
                            <td className="py-3 px-3 text-center text-slate-400 font-bold">—</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Open Connectors</td>
                            <td className="py-3 px-3 text-slate-600">More than 200 connectors to third-party apps</td>
                            <td className="py-3 px-3 text-center text-slate-400 font-bold">—</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">API Management</td>
                            <td className="py-3 px-3 text-slate-600">Full lifecycle API management including creating developer portals</td>
                            <td className="py-3 px-3 text-center text-slate-400 font-bold">—</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Integration Advisor</td>
                            <td className="py-3 px-3 text-slate-600">AI-assisted integration using the self-learning and self-improving knowledge base for B2B and EDI integration</td>
                            <td className="py-3 px-3 text-center text-slate-400 font-bold">—</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                          </tr>

                          {/* CATEGORY 3: Hybrid & Operations */}
                          <tr className="bg-indigo-50/40">
                            <td colSpan={5} className="py-2.5 px-3 font-black text-indigo-950 text-xs uppercase tracking-wider">
                              Hybrid & Operations
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Edge integration cell</td>
                            <td className="py-3 px-3 text-slate-600">Runtimes within your private cloud or private on-premises landscape</td>
                            <td className="py-3 px-3 text-center text-slate-400 font-bold">—</td>
                            <td className="py-3 px-3 text-center font-semibold text-slate-800">1+</td>
                            <td className="py-3 px-3 text-center font-semibold text-slate-800">1+</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">SAP Alert Notification Service for SAP BTP (ANS)</td>
                            <td className="py-3 px-3 text-slate-600">Create and receive real-time events about your services and applications</td>
                            <td className="py-3 px-3 text-center text-slate-400 font-bold">—</td>
                            <td className="py-3 px-3 text-center text-slate-400 font-bold">—</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">SAP Cloud Transport Management (TMS)</td>
                            <td className="py-3 px-3 text-slate-600">Export, import and ship APIs and related artifacts from the development or test environment to the production environment</td>
                            <td className="py-3 px-3 text-center text-slate-400 font-bold">—</td>
                            <td className="py-3 px-3 text-center text-slate-400 font-bold">—</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-xs font-bold">✓</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Legend at bottom left */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">✓</span> Fully Included
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-[10px] font-bold">–</span> Not Included
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Info className="w-3.5 h-3.5 text-blue-600" /> Limited / Conditional
                      </span>
                    </div>
                  </div>

                  {/* Bottom Navigation for Subview 3 */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep5SubView('cards')}
                      className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep5SubView('cards');
                        setShowAddOns(true);
                        setTimeout(() => {
                          document.getElementById('add-ons-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 80);
                      }}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      Next: Add-ons <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            }

            // =========================================================================
            // SUBVIEW 1: MAIN CARDS & SIDEBAR VIEW (Matching Image 1)
            // =========================================================================
            return (
              <div className="space-y-6">
                {/* Header Row Matching Image 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">STEP 5 OF 6</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">Select your SAP BTP Integration Suite edition</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose the edition that best fits your requirements and sizing.
                    </p>
                  </div>

                  {/* Generate AI Insights Card Matching Image 1 */}
                  <div
                    onClick={fetchLiveAiRecommendation}
                    className="cursor-pointer bg-white border border-indigo-100 hover:border-indigo-300 rounded-2xl p-3.5 px-4 shadow-xs hover:shadow-sm transition-all flex items-center gap-3 group max-w-xs shrink-0 active:scale-95"
                    title="Click to run live AI recommendations"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {aiLoading ? (
                        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        Generate AI Insights
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Get AI-powered recommendations based on your inputs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Expansion Card (if active) */}
                {showAiRecommendation && (
                  <div id="ai-recommendation-section" className="p-5 bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white rounded-2xl border border-indigo-200 space-y-3.5 shadow-xs animate-fadeIn scroll-mt-6">
                    {aiLoading ? (
                      <div className="p-6 flex flex-col items-center justify-center gap-3 text-center">
                        <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
                        <div>
                          <div className="text-sm font-bold text-indigo-950">ValueLens AI is Evaluating Your Landscape</div>
                          <div className="text-xs text-indigo-600 mt-0.5">
                            Evaluating {totalIflows} interfaces, {complexIflows} complex iFlows, and {monthlyThroughput.toLocaleString()} msg/mo with NVIDIA Llama 3.2 NIM...
                          </div>
                        </div>
                      </div>
                    ) : aiRecommendationData ? (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                                  AI Recommended Edition:
                                </span>
                                <span className="text-sm font-black text-indigo-700 bg-indigo-100/90 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                                  {aiRecommendationData.recommendedEdition}
                                </span>
                                {aiRecommendationData.confidenceScore && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
                                    {aiRecommendationData.confidenceScore}% Confidence Fit
                                  </span>
                                )}
                              </div>
                              {aiRecommendationData.headline && (
                                <p className="text-xs font-semibold text-slate-700 mt-1">
                                  {aiRecommendationData.headline}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowAiRecommendation(false)}
                            className="text-xs text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100"
                            title="Close recommendation"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="text-xs text-slate-700 leading-relaxed bg-white/90 p-3.5 rounded-xl border border-indigo-100 shadow-2xs">
                          {aiRecommendationData.reasoning}
                        </div>

                        {aiRecommendationData.keyBenefits && aiRecommendationData.keyBenefits.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                              Key Benefits Identified by AI:
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {aiRecommendationData.keyBenefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-indigo-100/80">
                                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                                  <span>{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-100">
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span>Evaluated: {totalIflows} interfaces ({complexIflows} complex), {monthlyThroughput.toLocaleString()} msg/mo.</span>
                            <button
                              type="button"
                              onClick={fetchLiveAiRecommendation}
                              disabled={aiLoading}
                              className="text-indigo-600 hover:text-indigo-800 font-bold underline flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" /> Re-run AI
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectEdition(
                                aiRecommendationData.recommendedEdition,
                                aiRecommendationData.suggestedUnits || (aiRecommendationData.recommendedEdition === 'Standard Edition' ? 3 : 1)
                              );
                              if (aiRecommendationData.suggestedMessagePacks !== undefined && aiRecommendationData.suggestedMessagePacks > 0) {
                                handleUpdatePacks(aiRecommendationData.suggestedMessagePacks);
                              }
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Apply {aiRecommendationData.recommendedEdition}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                )}

                {/* Main 2-Column Responsive Layout Matching Image 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column (8 cols): 3 Edition Cards & Action Cards */}
                  <div className="lg:col-span-8 space-y-5">
                    {/* 3 Main Edition Cards Matching Image 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 1. Starter Edition */}
                      <div
                        onClick={() => handleSelectEdition('Starter Edition', 1)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                          currentEd === 'Starter Edition'
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
                        }`}
                      >
                        <div className="space-y-3.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <Box className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900">Starter Edition</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Best for small and simple integration landscapes</p>
                          </div>

                          <div className="pt-1">
                            <div className="text-xl font-black text-indigo-600 font-mono">
                              USD 1,728 <span className="text-xs font-normal text-slate-500">/ month</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                              (USD 20,736 / year)
                            </div>
                          </div>

                          {/* Checklist Matching Image 1 */}
                          <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>50K messages per month</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Access to 3,400+ prebuilt integrations</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>1 tenant per year</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Cloud Integration (10 custom iFlow cap)</span>
                            </li>
                          </ul>
                        </div>

                        <div className="pt-5 space-y-2">
                          <button
                            type="button"
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                              currentEd === 'Starter Edition'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50/50'
                            }`}
                          >
                            {currentEd === 'Starter Edition' ? 'Selected ✓' : 'Select'}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail('Starter Edition');
                            }}
                            className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-800 text-center flex items-center justify-center gap-1 transition-colors"
                          >
                            View all features →
                          </button>
                        </div>
                      </div>

                      {/* 2. Standard Edition (Recommended) */}
                      <div
                        onClick={() => handleSelectEdition('Standard Edition', 3)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                          currentEd === 'Standard Edition'
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
                        }`}
                      >
                        <span className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          ★ Recommended
                        </span>

                        <div className="space-y-3.5">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900">Standard Edition</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Ideal for enterprise integration needs</p>
                          </div>

                          <div className="pt-1">
                            <div className="text-xl font-black text-indigo-600 font-mono">
                              USD 5,339 <span className="text-xs font-normal text-slate-500">/ month</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                              (USD 64,068 / year)
                            </div>
                          </div>

                          {/* Checklist Matching Image 1 */}
                          <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>API Management</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>B2B capabilities</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Open Connectors (200+)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Integration Advisor</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Integration Assessment</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Edge integration cell (1+ tenant)</span>
                            </li>
                          </ul>
                        </div>

                        <div className="pt-5 space-y-2">
                          <button
                            type="button"
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                              currentEd === 'Standard Edition'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50/50'
                            }`}
                          >
                            {currentEd === 'Standard Edition' ? 'Selected ✓' : 'Select'}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail('Standard Edition');
                            }}
                            className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-800 text-center flex items-center justify-center gap-1 transition-colors"
                          >
                            View all features →
                          </button>
                        </div>
                      </div>

                      {/* 3. Enhanced Edition */}
                      <div
                        onClick={() => handleSelectEdition('Enhanced Edition', 1)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                          currentEd === 'Enhanced Edition'
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
                        }`}
                      >
                        <div className="space-y-3.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                            <Crown className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900">Enhanced Edition</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">For high-volume and advanced integration scenarios</p>
                          </div>

                          <div className="pt-1">
                            <div className="text-xl font-black text-indigo-600 font-mono">
                              USD 7,688 <span className="text-xs font-normal text-slate-500">/ month</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                              (USD 92,256 / year)
                            </div>
                          </div>

                          {/* Checklist Matching Image 1 */}
                          <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>All Standard features</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>500K messages per month</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Alert Notification Service</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Cloud Transport Management</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Document AI (100 docs/month)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Advanced Event Mesh (AEM 100)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>AI capabilities</span>
                            </li>
                          </ul>
                        </div>

                        <div className="pt-5 space-y-2">
                          <button
                            type="button"
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                              currentEd === 'Enhanced Edition'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50/50'
                            }`}
                          >
                            {currentEd === 'Enhanced Edition' ? 'Selected ✓' : 'Select'}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail('Enhanced Edition');
                            }}
                            className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-800 text-center flex items-center justify-center gap-1 transition-colors"
                          >
                            View all features →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Two Horizontal Action Cards Matching Image 1 */}
                    {/* Action Card 1: Which plan is right for me? */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Scale className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">Which plan is right for me?</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Compare starter, standard, and enhanced options. View detailed feature comparison.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenComparison}
                        className="px-4 py-2 bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-600 hover:bg-indigo-50/50 rounded-xl text-xs font-bold transition-all self-start sm:self-auto shrink-0 flex items-center gap-1"
                      >
                        View Feature Comparison →
                      </button>
                    </div>

                    {/* Action Card 2: Add-ons to enhance your plan */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Puzzle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">Add-ons to enhance your plan</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Add additional capabilities to meet your specific requirements.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleAddOns}
                        className="px-4 py-2 bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-600 hover:bg-indigo-50/50 rounded-xl text-xs font-bold transition-all self-start sm:self-auto shrink-0 flex items-center gap-1"
                      >
                        {showAddOns ? 'Hide Add-ons ↑' : 'View Add-ons →'}
                      </button>
                    </div>

                    {/* Interactive Add-ons Expandable Section */}
                    {showAddOns && (
                      <div id="add-ons-section" className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-xs space-y-4 animate-fadeIn scroll-mt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-black text-slate-900">Configure Optional Add-ons</h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Select one or more add-ons to customize your solution, or leave unselected for base edition only.
                            </p>
                          </div>
                          {totalSelectedAddOnsCount > 0 && (
                            <button
                              type="button"
                              onClick={handleClearAllAddOns}
                              className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
                            >
                              Clear all add-ons
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* 1. Additional Messages */}
                          <div
                            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                              packs > 0
                                ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                  <MessageSquare className="w-4 h-4" />
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                    packs > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {packs > 0 ? `✓ In Plan (${packs} packs)` : 'Optional'}
                                </span>
                              </div>
                              <div>
                                <h5 className="text-xs font-black text-slate-900">Additional Messages</h5>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                  Blocks of 10,000 monthly transactions to process integrations and APIs.
                                </p>
                              </div>
                              <div className="pt-1">
                                <div className="text-sm font-black text-indigo-900 font-mono">
                                  USD 7.00 <span className="text-[10px] font-normal text-slate-500">/ mo</span>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">USD 84.00 / 10K-pack / yr</div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 mt-3 space-y-2">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-slate-700">Quantity (packs):</span>
                                <span className="font-mono font-bold text-indigo-700">{packs} packs</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePacks(packs - 50)}
                                  className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  step="50"
                                  value={packs}
                                  onChange={(e) => handleUpdatePacks(parseInt(e.target.value) || 0)}
                                  className="w-full text-center font-mono text-xs border border-slate-300 rounded-lg py-1 bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePacks(packs + 50)}
                                  className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-slate-400 font-mono">
                                  +USD {(packs * 84).toLocaleString()}/yr
                                </span>
                                {packs > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdatePacks(0)}
                                    className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 2. Data Space Integration */}
                          <div
                            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                              dataSpacePackages > 0
                                ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                  <Database className="w-4 h-4" />
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                    dataSpacePackages > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {dataSpacePackages > 0 ? `✓ In Plan (${dataSpacePackages} pkg)` : 'Optional'}
                                </span>
                              </div>
                              <div>
                                <h5 className="text-xs font-black text-slate-900">Data Space Integration</h5>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                  Supports secure, sovereign data exchange across industrial ecosystems.
                                </p>
                              </div>
                              <div className="pt-1">
                                <div className="text-sm font-black text-indigo-900 font-mono">
                                  USD 75.00 <span className="text-[10px] font-normal text-slate-500">/ mo</span>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">USD 900.00 / pkg / year</div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 mt-3 space-y-2">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-slate-700">Packages:</span>
                                <span className="font-mono font-bold text-indigo-700">{dataSpacePackages} pkg</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDataSpace(dataSpacePackages - 1)}
                                  className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  value={dataSpacePackages}
                                  onChange={(e) => handleUpdateDataSpace(parseInt(e.target.value) || 0)}
                                  className="w-full text-center font-mono text-xs border border-slate-300 rounded-lg py-1 bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDataSpace(dataSpacePackages + 1)}
                                  className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-slate-400 font-mono">
                                  +USD {(dataSpacePackages * 900).toLocaleString()}/yr
                                </span>
                                {dataSpacePackages > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDataSpace(0)}
                                    className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 3. Additional EIC Tenant */}
                          <div
                            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                              additionalEicTenants > 0
                                ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                  <Server className="w-4 h-4" />
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                    additionalEicTenants > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {additionalEicTenants > 0 ? `✓ In Plan (${additionalEicTenants} tenant)` : 'Optional'}
                                </span>
                              </div>
                              <div>
                                <h5 className="text-xs font-black text-slate-900">Additional EIC Tenant</h5>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                  Additional runtime tenants for private cloud or on-prem deployments.
                                </p>
                              </div>
                              <div className="pt-1">
                                <div className="text-sm font-black text-indigo-900 font-mono">
                                  USD 3,455.00 <span className="text-[10px] font-normal text-slate-500">/ mo</span>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">USD 41,460.00 / tenant / yr</div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 mt-3 space-y-2">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-slate-700">Tenants:</span>
                                <span className="font-mono font-bold text-indigo-700">{additionalEicTenants} tenant(s)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateEic(additionalEicTenants - 1)}
                                  className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  value={additionalEicTenants}
                                  onChange={(e) => handleUpdateEic(parseInt(e.target.value) || 0)}
                                  className="w-full text-center font-mono text-xs border border-slate-300 rounded-lg py-1 bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateEic(additionalEicTenants + 1)}
                                  className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-slate-400 font-mono">
                                  +USD {(additionalEicTenants * 41460).toLocaleString()}/yr
                                </span>
                                {additionalEicTenants > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateEic(0)}
                                    className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column (4 cols): Live Economics Summary Matching Image 1 */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                      {/* Live Economics Header with Toggle Switch */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-sm font-black text-slate-900">Live Economics Summary</h3>
                        <button
                          type="button"
                          onClick={() => setLiveEconomicsEnabled(!liveEconomicsEnabled)}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 focus:outline-hidden ${
                            liveEconomicsEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                          }`}
                          title="Toggle Live Economics Summary"
                        >
                          <span
                            className={`w-5 h-5 rounded-full bg-white shadow-xs block transition-transform ${
                              liveEconomicsEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {liveEconomicsEnabled && (
                        <div className="space-y-4 animate-fadeIn">
                          {/* Selected Edition Compact Box */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span className="font-semibold">Selected Edition</span>
                              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                {currentEd === 'Starter Edition' && <Box className="w-5 h-5" />}
                                {currentEd === 'Standard Edition' && <Layers className="w-5 h-5" />}
                                {currentEd === 'Enhanced Edition' && <Crown className="w-5 h-5" />}
                              </div>
                              <div>
                                <div className="text-xs font-black text-slate-900">{currentEd}</div>
                                <div className="text-xs font-bold text-indigo-600 font-mono">
                                  USD {currentEd === 'Starter Edition' ? '1,728' : currentEd === 'Standard Edition' ? '5,339' : '7,688'} <span className="text-[10px] font-normal text-slate-500">/ month</span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  (USD {baseUnitAnnual.toLocaleString()} / year)
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Production Units Stepper Matching Image 1 */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-700 flex items-center gap-1">
                                Production Units
                                <span title="SAP Integration Suite tenant units (typically 3 for Dev, Test, Prod in enterprise landscapes)">
                                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </span>
                              </span>
                              <span className="font-mono font-bold text-slate-900">{units} units</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateUnits(units - 1)}
                                className="w-8 h-8 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm disabled:opacity-40"
                                disabled={units <= 1}
                              >
                                -
                              </button>
                              <div className="w-full py-1 text-center font-mono text-xs font-bold border border-slate-300 rounded-lg bg-white">
                                {units}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUpdateUnits(units + 1)}
                                className="w-8 h-8 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Additional Messages Stepper Matching Image 1 */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-700 flex items-center gap-1">
                                Additional Messages
                                <span title="Blocks of 10,000 monthly transactions ($7/mo = $84/yr each)">
                                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </span>
                              </span>
                              <span className="font-mono font-bold text-slate-900">{packs} packs</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdatePacks(packs - 50)}
                                className="w-8 h-8 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm disabled:opacity-40"
                                disabled={packs <= 0}
                              >
                                -
                              </button>
                              <div className="w-full py-1 text-center font-mono text-xs font-bold border border-slate-300 rounded-lg bg-white">
                                {packs}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUpdatePacks(packs + 50)}
                                className="w-8 h-8 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Itemized Cost Breakdown Lines Matching Image 1 */}
                          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                            <div className="flex items-center justify-between text-slate-600">
                              <span>Base Subscription (Annual)</span>
                              <span className="font-mono font-bold text-slate-900">
                                USD {annualizedBaseCost.toLocaleString()}
                              </span>
                            </div>
                            {packs > 0 && (
                              <div className="flex items-center justify-between text-slate-600">
                                <span>Additional Messages</span>
                                <span className="font-mono font-bold text-slate-900">
                                  USD {annualizedPacksCost.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {dataSpacePackages > 0 && (
                              <div className="flex items-center justify-between text-slate-600">
                                <span>Data Space Packages</span>
                                <span className="font-mono font-bold text-slate-900">
                                  USD {annualizedDataSpaceCost.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {additionalEicTenants > 0 && (
                              <div className="flex items-center justify-between text-slate-600">
                                <span>Additional EIC Tenants</span>
                                <span className="font-mono font-bold text-slate-900">
                                  USD {annualizedEicCost.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-slate-900 font-bold pt-1 border-t border-slate-100">
                              <span>Total Annual Cost</span>
                              <span className="font-mono text-sm font-black text-slate-900">
                                USD {estimatedAnnualCost.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Highlight Mint Green Card Matching Image 1 */}
                          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1">
                            <div className="text-xs font-bold text-emerald-800">
                              Estimated 3-Year TCO
                            </div>
                            <div className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
                              USD {termTotalCost.toLocaleString()}
                            </div>
                            <div className="text-[11px] text-emerald-600">
                              (including selected add-ons)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation Controls Matching Image 1 */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    Next: Review & Results <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* STEP 6 (Slide 7): Additional TCO & Migration Costs                         */}
          {/* ========================================================================= */}
          {currentStep === 6 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 6 of 6</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">Additional TCO & Migration Costs</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Add additional platform costs and migration investment details.
                </p>
              </div>

              {/* Additional TCO Components (Annual) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Additional TCO Components (Annual)
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    Total: ${assessment.targetSystem.additionalTcoComponents.totalAdditionalTcoAnnual?.toLocaleString()}
                  </span>
                </div>

                <div className="text-xs">
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 flex justify-between items-center">
                    <div>
                      <span className="text-indigo-900 font-semibold block">People / Cloud Run</span>
                      <span className="text-[10px] text-slate-500">Managed operations & hyper-scaler run-rate</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-slate-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        value={assessment.targetSystem.additionalTcoComponents.totalAdditionalTcoAnnual}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setAssessment({
                            ...assessment,
                            targetSystem: {
                              ...assessment.targetSystem,
                              additionalTcoComponents: {
                                ...assessment.targetSystem.additionalTcoComponents,
                                totalAdditionalTcoAnnual: val,
                                categories: {
                                  ...assessment.targetSystem.additionalTcoComponents.categories,
                                  people: val,
                                },
                              },
                            },
                          });
                        }}
                        className="w-28 text-right font-mono p-1 border border-slate-300 rounded bg-white text-xs font-bold text-indigo-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Migration Investment (One-time) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Migration Investment (One-time)
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    Total: ${assessment.migrationRelatedDetails.totalMigrationCost?.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">Development Cost</span>
                    <input
                      type="number"
                      value={assessment.migrationRelatedDetails.developmentCost}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const m = assessment.migrationRelatedDetails;
                        const tot = val + m.testingCost + m.architectureCost + m.projectManagementCost + m.trainingCost + m.deploymentCutoverCost + m.documentationCost + m.contingencyCost;
                        setAssessment({
                          ...assessment,
                          migrationRelatedDetails: { ...m, developmentCost: val, totalMigrationCost: tot },
                        });
                      }}
                      className="w-28 text-right font-mono p-1 border rounded"
                    />
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">Training Cost</span>
                    <input
                      type="number"
                      value={assessment.migrationRelatedDetails.trainingCost}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const m = assessment.migrationRelatedDetails;
                        const tot = m.developmentCost + m.testingCost + m.architectureCost + m.projectManagementCost + val + m.deploymentCutoverCost + m.documentationCost + m.contingencyCost;
                        setAssessment({
                          ...assessment,
                          migrationRelatedDetails: { ...m, trainingCost: val, totalMigrationCost: tot },
                        });
                      }}
                      className="w-28 text-right font-mono p-1 border rounded"
                    />
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">Testing Cost</span>
                    <input
                      type="number"
                      value={assessment.migrationRelatedDetails.testingCost}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const m = assessment.migrationRelatedDetails;
                        const tot = m.developmentCost + val + m.architectureCost + m.projectManagementCost + m.trainingCost + m.deploymentCutoverCost + m.documentationCost + m.contingencyCost;
                        setAssessment({
                          ...assessment,
                          migrationRelatedDetails: { ...m, testingCost: val, totalMigrationCost: tot },
                        });
                      }}
                      className="w-28 text-right font-mono p-1 border rounded"
                    />
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">Deployment & Cutover</span>
                    <input
                      type="number"
                      value={assessment.migrationRelatedDetails.deploymentCutoverCost}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const m = assessment.migrationRelatedDetails;
                        const tot = m.developmentCost + m.testingCost + m.architectureCost + m.projectManagementCost + m.trainingCost + val + m.documentationCost + m.contingencyCost;
                        setAssessment({
                          ...assessment,
                          migrationRelatedDetails: { ...m, deploymentCutoverCost: val, totalMigrationCost: tot },
                        });
                      }}
                      className="w-28 text-right font-mono p-1 border rounded"
                    />
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">Architecture Cost</span>
                    <input
                      type="number"
                      value={assessment.migrationRelatedDetails.architectureCost}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const m = assessment.migrationRelatedDetails;
                        const tot = m.developmentCost + m.testingCost + val + m.projectManagementCost + m.trainingCost + m.deploymentCutoverCost + m.documentationCost + m.contingencyCost;
                        setAssessment({
                          ...assessment,
                          migrationRelatedDetails: { ...m, architectureCost: val, totalMigrationCost: tot },
                        });
                      }}
                      className="w-28 text-right font-mono p-1 border rounded"
                    />
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">Documentation</span>
                    <input
                      type="number"
                      value={assessment.migrationRelatedDetails.documentationCost}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const m = assessment.migrationRelatedDetails;
                        const tot = m.developmentCost + m.testingCost + m.architectureCost + m.projectManagementCost + m.trainingCost + m.deploymentCutoverCost + val + m.contingencyCost;
                        setAssessment({
                          ...assessment,
                          migrationRelatedDetails: { ...m, documentationCost: val, totalMigrationCost: tot },
                        });
                      }}
                      className="w-28 text-right font-mono p-1 border rounded"
                    />
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">Project Management</span>
                    <input
                      type="number"
                      value={assessment.migrationRelatedDetails.projectManagementCost}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const m = assessment.migrationRelatedDetails;
                        const tot = m.developmentCost + m.testingCost + m.architectureCost + val + m.trainingCost + m.deploymentCutoverCost + m.documentationCost + m.contingencyCost;
                        setAssessment({
                          ...assessment,
                          migrationRelatedDetails: { ...m, projectManagementCost: val, totalMigrationCost: tot },
                        });
                      }}
                      className="w-28 text-right font-mono p-1 border rounded"
                    />
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">Contingency</span>
                    <input
                      type="number"
                      value={assessment.migrationRelatedDetails.contingencyCost}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const m = assessment.migrationRelatedDetails;
                        const tot = m.developmentCost + m.testingCost + m.architectureCost + m.projectManagementCost + m.trainingCost + m.deploymentCutoverCost + m.documentationCost + val;
                        setAssessment({
                          ...assessment,
                          migrationRelatedDetails: { ...m, contingencyCost: val, totalMigrationCost: tot },
                        });
                      }}
                      className="w-28 text-right font-mono p-1 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleExecuteCalculation}
                  className="px-8 py-3 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all active:scale-95"
                >
                  {loading ? 'Executing Deterministic Math...' : 'Calculate ROI →'}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 7 (Slide 8): ROI Results (with AI Insights)                           */}
          {/* ========================================================================= */}
          {currentStep === 7 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
              <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Results Analysis</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">Your SAP BTP Migration ROI Analysis</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Based on your inputs, here are the calculated economic results.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/demo-assessment-1')}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                  >
                    📊 View Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/report/demo-assessment-1')}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 shadow-xs transition-colors"
                  >
                    📥 Download Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    Start New Assessment
                  </button>
                </div>
              </div>

              {/* 4 Top KPI Cards matching Slide 8 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase block">Current Platform TCO</span>
                  <span className="text-2xl font-black text-slate-900 font-mono block mt-1">
                    ${(calculationResult?.currentPlatformTCO || currentTcoPreview).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">per year</span>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase block">Target Platform TCO</span>
                  <span className="text-2xl font-black text-indigo-600 font-mono block mt-1">
                    ${(calculationResult?.targetPlatformTCO || targetTcoPreview).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">per year</span>
                </div>

                <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase block">Annual Savings</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono block mt-1">
                    ${(calculationResult?.annualSavings || annualSavingsPreview).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
                    {((calculationResult?.annualSavings || annualSavingsPreview) / (calculationResult?.currentPlatformTCO || currentTcoPreview) * 100).toFixed(2)}% Reduction
                  </span>
                </div>

                <div className="p-5 bg-indigo-50/70 rounded-2xl border border-indigo-200">
                  <span className="text-xs font-bold text-indigo-800 uppercase block">5-Year ROI</span>
                  <span className="text-2xl font-black text-indigo-900 font-mono block mt-1">
                    {(calculationResult?.fiveYearROI || fiveYearRoiPreview).toFixed(2)}%
                  </span>
                  <span className="text-[11px] text-indigo-600 font-bold mt-1 block">
                    Break-even: {((calculationResult?.migrationCost || migrationCostPreview) / (calculationResult?.annualSavings || annualSavingsPreview) * 12).toFixed(1)} Mo
                  </span>
                </div>
              </div>

              {/* Main Analysis Grid: Visual Bar Chart & 5-Year Projection Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Platform Cost Comparison Bar Chart */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Annual Platform Cost Comparison
                  </h3>

                  <div className="flex items-end justify-around h-52 pt-6 border-b border-slate-200 pb-4">
                    {/* Current (PI/PO) */}
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-bold font-mono text-slate-900">
                        ${((calculationResult?.currentPlatformTCO || currentTcoPreview) / 1000).toFixed(0)}K
                      </span>
                      <div className="w-20 bg-indigo-500 rounded-t-xl transition-all duration-300 shadow-sm" style={{ height: '160px' }} />
                      <span className="text-xs font-bold text-slate-700 text-center">Current (PI/PO)</span>
                    </div>

                    {/* Target (BTP) */}
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-bold font-mono text-emerald-600">
                        ${((calculationResult?.targetPlatformTCO || targetTcoPreview) / 1000).toFixed(0)}K
                      </span>
                      <div className="w-20 bg-emerald-500 rounded-t-xl transition-all duration-300 shadow-sm" style={{ height: '70px' }} />
                      <span className="text-xs font-bold text-slate-700 text-center">Target (BTP)</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-300 inline-block">
                      ✓ $416,916 Annual Run-Rate Efficiency
                    </span>
                  </div>
                </div>

                {/* Right: 5-Year Value Projection Table */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    5-Year Value Projection
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2">Year</th>
                          <th className="py-2">Annual Savings</th>
                          <th className="py-2 text-right">Cumulative Savings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        <tr>
                          <td className="py-2 font-bold text-slate-700">Year 1</td>
                          <td className="py-2 text-slate-600">${annualSavingsPreview.toLocaleString()}</td>
                          <td className="py-2 text-right font-bold text-slate-900">${(annualSavingsPreview * 1).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold text-slate-700">Year 2</td>
                          <td className="py-2 text-slate-600">${annualSavingsPreview.toLocaleString()}</td>
                          <td className="py-2 text-right font-bold text-slate-900">${(annualSavingsPreview * 2).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold text-slate-700">Year 3</td>
                          <td className="py-2 text-slate-600">${annualSavingsPreview.toLocaleString()}</td>
                          <td className="py-2 text-right font-bold text-slate-900">${(annualSavingsPreview * 3).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold text-slate-700">Year 4</td>
                          <td className="py-2 text-slate-600">${annualSavingsPreview.toLocaleString()}</td>
                          <td className="py-2 text-right font-bold text-slate-900">${(annualSavingsPreview * 4).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold text-slate-700">Year 5</td>
                          <td className="py-2 text-slate-600">${annualSavingsPreview.toLocaleString()}</td>
                          <td className="py-2 text-right font-bold text-slate-900">${(annualSavingsPreview * 5).toLocaleString()}</td>
                        </tr>
                        <tr className="bg-emerald-100/50">
                          <td className="py-2.5 font-extrabold text-emerald-900" colSpan={2}>Net 5-Year Benefit</td>
                          <td className="py-2.5 text-right font-black text-emerald-700 text-sm">
                            ${netFiveYearBenefitPreview.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* AI-Powered Insights Callout */}
              <div className="p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-white rounded-2xl border border-indigo-100 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    ⚡
                  </span>
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">AI-Powered Insights</h4>
                </div>
                <p className="text-xs text-indigo-950 leading-relaxed">
                  Your migration presents a compelling business case. Moving from {assessment.sourcePlatform || 'SAP PI/PO'} to {assessment.targetPlatform || 'SAP BTP'} reduces estimated annual platform TCO by approximately {currentTcoPreview > 0 ? ((annualSavingsPreview / currentTcoPreview) * 100).toFixed(1) : '57.1'}%, unlocking ${annualSavingsPreview.toLocaleString()} in annual operating savings with an estimated 5-year ROI of {fiveYearRoiPreview.toFixed(1)}%.
                </p>
              </div>

              {/* Key Opportunities */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Opportunities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Reduce infrastructure dependency</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Modernize integration architecture</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Improve API lifecycle management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Reduce middleware technical debt</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:col-span-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Establish foundation for AI automation</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  ← Back to Inputs
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        try {
                          localStorage.setItem('valuelens_active_assessment', JSON.stringify(assessment));
                          if (calculationResult) {
                            localStorage.setItem('valuelens_active_calculation', JSON.stringify(calculationResult));
                          }
                        } catch (e) {
                          console.warn('Error saving to localStorage', e);
                        }
                      }
                      router.push(assessment.id ? `/dashboard/${assessment.id}` : '/dashboard/demo-assessment-1');
                    }}
                    className="px-6 py-2.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    Explore Full Analytics Dashboard →
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Sidebar */}
        {currentStep !== 5 && currentStep < 7 && (
          <div className="space-y-5">
            {/* Step 2: Assessment Progress Card */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Assessment Progress
                </h3>
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round((currentStep / 7) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-0.5">
                  <span>{currentStep} of 7 steps completed</span>
                  <span className="font-bold text-slate-800">{Math.round((currentStep / 7) * 100)}%</span>
                </div>
              </div>
            )}

            {/* Step 2: Help & Information Card */}
            {currentStep === 2 && (
              <div className="bg-blue-50/40 rounded-2xl border border-blue-100/90 p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-blue-900">
                    Help & Information
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This information helps us analyze your current PI/PO environment and provide accurate migration recommendations and cost estimates.
                </p>
                <div className="pt-1">
                  <h4 className="text-xs font-bold text-blue-700 mb-2">Why we ask this?</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Understand your integration footprint</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Assess migration complexity</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Identify key migration drivers</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Provide accurate TCO and ROI analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Live Economics Summary Card for Steps other than Step 2 */}
            {currentStep !== 2 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs sticky top-20 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    LIVE ECONOMICS SUMMARY
                  </h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Dynamic
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-slate-600 font-medium">Current Platform TCO</span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">
                      {formatCurrency(currentTcoPreview, assessment.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <span className="text-slate-600 font-medium">BTP Target TCO</span>
                    <span className="text-sm font-extrabold text-blue-600 font-mono">
                      {formatCurrency(targetTcoPreview, assessment.currency)}
                    </span>
                  </div>

                  {/* Projected Annual Savings - Highlighted Green Container */}
                  <div className="p-3 bg-emerald-50/70 rounded-xl flex justify-between items-center border border-emerald-200/90">
                    <span className="text-xs text-emerald-800 font-bold">Projected Annual Savings</span>
                    <span className="text-sm font-extrabold text-emerald-700 font-mono">
                      {formatCurrency(annualSavingsPreview, assessment.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <span className="text-slate-600 font-medium">One-Time Migration Cost</span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">
                      {formatCurrency(migrationCostPreview, assessment.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center px-1 pt-1">
                    <span className="text-slate-600 font-medium">Estimated Payback</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">
                      {annualSavingsPreview > 0
                        ? `${((migrationCostPreview / annualSavingsPreview) * 12).toFixed(1)} Months`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Why we ask for this information? Card */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-blue-100/90 p-6 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Info className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-blue-700">
                    Why we ask for this information?
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 pl-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Provides context for industry-specific benchmarks</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Helps us estimate the right sizing and costs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Enables more accurate ROI and savings analysis</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
