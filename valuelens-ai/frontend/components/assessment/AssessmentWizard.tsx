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
  const [contractYears, setContractYears] = useState<1 | 3 | 5>(1);
  const [showFeatureComparison, setShowFeatureComparison] = useState(false);
  const [showAddOns, setShowAddOns] = useState(false);
  const [showAiRecommendation, setShowAiRecommendation] = useState(false);

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
        migrationTimeline: '6 Months',
        integrationComplexity: 'MODERATE',
        availabilityRequirements: 'HIGH',
        complianceRequirements: 'REGULATED',
        customDevelopment: 'MODERATE',
        monitoringMaturity: 'ENHANCED',
      },
      environmentAssessment: {
        integrationVolume: 'Medium',
        systemComplexity: 'Moderate',
        availabilityRequirements: 'High',
        customDevelopment: 'Moderate',
        complianceRequirements: 'Regulated',
        monitoring: 'Enhanced',
        simpleInterfaces: 800,
        mediumInterfaces: 200,
        complexInterfaces: 50,
        totalInterfaces: 1050,
      },
      volumetrics: {
        currentMessageThroughput: '200000',
        indicativeMessageThroughput: '300000',
        apiCount: 45,
        b2bInterfaces: 20,
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

  // 6 Milestones corresponding to the official SAP BTP edition selection workflow
  const milestones = [
    { id: 1, label: 'Current Landscape', step: 1 },
    { id: 2, label: 'Requirements', step: 2 },
    { id: 3, label: 'Sizing', step: 3 },
    { id: 4, label: 'Cost Parameters', step: 4 },
    { id: 5, label: 'Select Edition', step: 5 },
    { id: 6, label: 'Review & Results', step: 6 },
  ];

  const getActiveMilestone = () => {
    if (currentStep <= 1) return 1;
    if (currentStep === 2) return 2;
    if (currentStep === 3) return 3;
    if (currentStep === 4) return 4;
    if (currentStep === 5) return 5;
    return 6;
  };

  const activeMilestoneId = getActiveMilestone();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              SAP BTP Migration ROI Calculator
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold uppercase tracking-wider">
              SAP PI/PO to BTP
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Modernize. Integrate. Automate. Realize Value. Your journey to a connected, intelligent enterprise.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handlePrefillDemo}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 shadow-xs transition-colors"
          >
            Prefill Standard Demo Case
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* 5-Milestone Stepper Bar Matching Screenshot 1 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between max-w-4xl mx-auto relative">
          {/* Connector line behind circles */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute top-4 left-6 h-0.5 bg-indigo-600 transition-all duration-300 -z-0"
            style={{
              width: `${((activeMilestoneId - 1) / (milestones.length - 1)) * 95}%`,
            }}
          />

          {milestones.map((m) => {
            const isCompleted = activeMilestoneId > m.id;
            const isCurrent = activeMilestoneId === m.id;

            return (
              <div
                key={m.id}
                className="flex flex-col items-center relative z-10 cursor-pointer group"
                onClick={() => {
                  // Direct navigation to milestone's primary step
                  if (m.id === 1) setCurrentStep(1);
                  if (m.id === 2) setCurrentStep(2);
                  if (m.id === 3) setCurrentStep(3);
                  if (m.id === 4) setCurrentStep(4);
                  if (m.id === 5) setCurrentStep(5);
                  if (m.id === 6) {
                    if (calculationResult) setCurrentStep(7);
                    else setCurrentStep(6);
                  }
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 scale-110'
                      : isCompleted
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? '✓' : m.id}
                </div>
                <span
                  className={`text-[11px] mt-2 font-medium tracking-tight text-center max-w-[110px] leading-tight ${
                    isCurrent
                      ? 'text-indigo-600 font-bold'
                      : isCompleted
                      ? 'text-slate-800 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Layout */}
      <div className={`grid grid-cols-1 ${currentStep === 7 ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
        {/* Main Content Area */}
        <div className={`${currentStep === 7 ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-6`}>
          
          {/* ========================================================================= */}
          {/* STEP 1 (Slide 2): Company Information                                     */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 1 of 6</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">Tell us about your organization</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  This information helps us provide a more accurate ROI analysis.
                </p>
              </div>

              <div className="space-y-5 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Number of Employees <span className="text-rose-500">*</span>
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
                    placeholder="e.g. 200"
                    className="w-full text-sm border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Industry <span className="text-rose-500">*</span>
                  </label>
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
                    className="w-full text-sm border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Migration Timeline <span className="text-rose-500">*</span>
                  </label>
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
                    className="w-full text-sm border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="6 Months">6 Months (Accelerated)</option>
                    <option value="9 Months">9 Months (Targeted)</option>
                    <option value="12-18 Months">12-18 Months (Standard Enterprise)</option>
                    <option value="18-24 Months">18-24 Months (Phased Wave)</option>
                  </select>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <Link
                  href="/"
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  ← Back to Overview
                </Link>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2 (Slide 3): Current SAP PI/PO Environment                            */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 2 of 6</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">Assess your current SAP PI/PO environment</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Help us understand your integration landscape and complexity drivers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. Integration Volume */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Integration Volume
                  </label>
                  <div className="flex items-center space-x-4">
                    {['Low', 'Medium', 'High'].map((opt) => (
                      <label key={opt} className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="integrationVolume"
                          value={opt}
                          checked={assessment.sourceSystem.environmentAssessment.integrationVolume.toLowerCase() === opt.toLowerCase()}
                          onChange={() =>
                            setAssessment({
                              ...assessment,
                              sourceSystem: {
                                ...assessment.sourceSystem,
                                environmentAssessment: {
                                  ...assessment.sourceSystem.environmentAssessment,
                                  integrationVolume: opt,
                                },
                              },
                            })
                          }
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. System Complexity */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    System Complexity
                  </label>
                  <div className="flex items-center space-x-4">
                    {['Simple', 'Moderate', 'Complex'].map((opt) => (
                      <label key={opt} className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
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
                              },
                            })
                          }
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Availability Requirements */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Availability Requirements
                  </label>
                  <div className="flex items-center space-x-4">
                    {['Standard', 'High', 'Mission Critical'].map((opt) => (
                      <label key={opt} className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
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
                              },
                            })
                          }
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 4. Custom Development */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Custom Development
                  </label>
                  <div className="flex items-center space-x-4">
                    {['Low', 'Moderate', 'High'].map((opt) => (
                      <label key={opt} className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="customDevelopment"
                          value={opt}
                          checked={assessment.sourceSystem.environmentAssessment.customDevelopment.toLowerCase() === opt.toLowerCase()}
                          onChange={() =>
                            setAssessment({
                              ...assessment,
                              sourceSystem: {
                                ...assessment.sourceSystem,
                                environmentAssessment: {
                                  ...assessment.sourceSystem.environmentAssessment,
                                  customDevelopment: opt,
                                },
                              },
                            })
                          }
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 5. Compliance Requirements */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Compliance Requirements
                  </label>
                  <div className="flex items-center space-x-4">
                    {['Standard', 'Regulated', 'Highly Regulated'].map((opt) => (
                      <label key={opt} className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
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
                              },
                            })
                          }
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 6. Monitoring */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Monitoring
                  </label>
                  <div className="flex items-center space-x-4">
                    {['Standard', 'Enhanced', 'Advanced'].map((opt) => (
                      <label key={opt} className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
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
                              },
                            })
                          }
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  Continue →
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
            const units = currentEd === 'Standard Edition'
              ? (assessment.targetSystem.configuration.numberOfUnits || 3)
              : (assessment.targetSystem.configuration.numberOfUnits || 1);
            const packs = assessment.targetSystem.configuration.additionalMessagePacks || 0;
            const dataSpacePackages = assessment.targetSystem.configuration.dataSpacePackages || 0;
            const additionalEicTenants = assessment.targetSystem.configuration.additionalEicTenants || 0;

            const baseUnitAnnual = getEditionBasePrice(currentEd, 1);
            const annualizedBaseCost = baseUnitAnnual * units;
            const annualizedPacksCost = packs * 84;
            const annualizedDataSpaceCost = dataSpacePackages * 900;
            const annualizedEicCost = additionalEicTenants * 41460;
            const annualizedAddOnsCost = annualizedPacksCost + annualizedDataSpaceCost + annualizedEicCost;
            const estimatedAnnualCost = annualizedBaseCost + annualizedAddOnsCost;
            const termTotalCost = estimatedAnnualCost * contractYears;

            const totalSelectedAddOnsCount = (packs > 0 ? 1 : 0) + (dataSpacePackages > 0 ? 1 : 0) + (additionalEicTenants > 0 ? 1 : 0);

            const updateConfig = (
              newEdition: string = currentEd,
              newUnits: number = units,
              newPacks: number = packs,
              newDataSpace: number = dataSpacePackages,
              newEic: number = additionalEicTenants
            ) => {
              const unitPrice = getEditionBasePrice(newEdition, 1);
              const total = (newUnits * unitPrice) + (newPacks * 84) + (newDataSpace * 900) + (newEic * 41460);
              const parts = [`${newUnits} units x $${unitPrice.toLocaleString()}/yr`];
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

            const handleSelectEdition = (editionName: string, defaultUnits: number = 1) => {
              const newUnits = editionName === 'Standard Edition' ? (assessment.targetSystem.configuration.numberOfUnits || 3) : defaultUnits;
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

            // Recommendation analysis based on SAP rules from PDF report
            const totalIflows = assessment.sourceSystem.environmentAssessment.totalInterfaces || 0;
            const complexIflows = assessment.sourceSystem.environmentAssessment.complexInterfaces || 0;
            const b2bCount = assessment.sourceSystem.volumetrics.b2bInterfaces || 0;
            const monthlyThroughput = parseInt(assessment.sourceSystem.volumetrics.indicativeMessageThroughput || '0') || 300000;

            let recommendedEd = 'Standard Edition';
            let recommendationReason = 'Standard Edition is the recommended enterprise baseline. It provides full API Management, B2B/EDI libraries, Integration Advisor, and Edge Integration Cell runtimes without the 10 custom iFlow limit of Starter Edition.';

            if (monthlyThroughput > 400000 || complexIflows > 100) {
              recommendedEd = 'Enhanced Edition';
              recommendationReason = 'With heavy message volumes (>400K/month) and high operational complexity, Enhanced Edition is optimal. It includes 500K messages/month, SAP Alert Notification (ANS), Cloud Transport Management (TMS), Document AI, and a dedicated Advanced Event Mesh (AEM 100) tenant.';
            } else if (totalIflows <= 10 && complexIflows === 0 && b2bCount === 0 && monthlyThroughput <= 50000) {
              recommendedEd = 'Starter Edition';
              recommendationReason = 'Your integration scope is small and simple (<10 custom iFlows, <50K messages/mo). Starter Edition provides standard Cloud Integration capabilities at minimal cost.';
            }

            return (
              <div className="space-y-6">
                {/* Header Card with Years Commitment Switcher */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 5 of 6</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">Select your SAP BTP Integration Suite edition</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Choose the edition that best fits your requirements and sizing. Each edition includes different features and capabilities.
                    </p>
                  </div>

                  {/* Commitment Term Switcher (Years while selecting) */}
                  <div className="flex items-center space-x-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-black text-slate-500 px-2.5 uppercase tracking-wider flex items-center gap-1">
                      Term:
                    </span>
                    <button
                      type="button"
                      onClick={() => setContractYears(1)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        contractYears === 1
                          ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200/80 font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      1 Year (Annual)
                    </button>
                    <button
                      type="button"
                      onClick={() => setContractYears(3)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        contractYears === 3
                          ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200/80 font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      3 Years (36 Mo)
                    </button>
                    <button
                      type="button"
                      onClick={() => setContractYears(5)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        contractYears === 5
                          ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200/80 font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      5 Years (60 Mo)
                    </button>
                  </div>
                </div>

                {/* 2-Column Responsive Layout Matching Reference Screenshot */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column (8 cols): Cards, Accordions, AI Callout */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* AI Recommendation Callout Banner */}
                    <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                          <Lightbulb className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-indigo-950">Not sure which edition to choose?</h4>
                          <p className="text-[11px] text-indigo-700">Get AI-based recommendations based on your inputs.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAiRecommendation(!showAiRecommendation)}
                        className="px-3.5 py-1.5 bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-700 hover:bg-indigo-50/60 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Get Recommendation
                      </button>
                    </div>

                    {/* AI Recommendation Expansion Card */}
                    {showAiRecommendation && (
                      <div className="p-5 bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white rounded-2xl border border-indigo-200 space-y-3 shadow-xs animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                              AI Recommendation: {recommendedEd}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowAiRecommendation(false)}
                            className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {recommendationReason}
                        </p>
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-100">
                          <span className="text-[11px] text-slate-500">
                            Evaluated against: {totalIflows} interfaces, {complexIflows} complex iFlows, and {monthlyThroughput.toLocaleString()} msg/mo.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectEdition(recommendedEd, recommendedEd === 'Standard Edition' ? 3 : 1);
                              setShowAiRecommendation(false);
                            }}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
                          >
                            Apply {recommendedEd}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3 Main Edition Cards */}
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
                        <div className="space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <Box className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900">Starter Edition</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Best for small and simple integration landscapes</p>
                          </div>

                          <div className="pt-1">
                            <div className="text-xl font-black text-slate-900 font-mono">
                              USD 1,728 <span className="text-xs font-normal text-slate-500">/ month</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {contractYears === 1 && '(USD 20,736 / year)'}
                              {contractYears === 3 && 'USD 62,208 total (36-mo term)'}
                              {contractYears === 5 && 'USD 103,680 total (60-mo term)'}
                            </div>
                          </div>

                          <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
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
                              setShowFeatureComparison(true);
                            }}
                            className="w-full text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 text-center flex items-center justify-center gap-1"
                          >
                            View all features &gt;
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

                        <div className="space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900">Standard Edition</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Ideal for enterprise integration needs</p>
                          </div>

                          <div className="pt-1">
                            <div className="text-xl font-black text-slate-900 font-mono">
                              USD 5,339 <span className="text-xs font-normal text-slate-500">/ month</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {contractYears === 1 && '(USD 64,068 / year)'}
                              {contractYears === 3 && 'USD 192,204 total (36-mo term)'}
                              {contractYears === 5 && 'USD 320,340 total (60-mo term)'}
                            </div>
                          </div>

                          <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
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
                              setShowFeatureComparison(true);
                            }}
                            className="w-full text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 text-center flex items-center justify-center gap-1"
                          >
                            View all features &gt;
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
                        <div className="space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                            <Crown className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900">Enhanced Edition</h3>
                            <p className="text-xs text-slate-500 mt-0.5">For high-volume and advanced integration scenarios</p>
                          </div>

                          <div className="pt-1">
                            <div className="text-xl font-black text-slate-900 font-mono">
                              USD 7,688 <span className="text-xs font-normal text-slate-500">/ month</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {contractYears === 1 && '(USD 92,256 / year)'}
                              {contractYears === 3 && 'USD 276,768 total (36-mo term)'}
                              {contractYears === 5 && 'USD 461,280 total (60-mo term)'}
                            </div>
                          </div>

                          <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
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
                              <span>Alert Notification Service (ANS)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                              <span>Cloud Transport Management (TMS)</span>
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
                              <span>Integration Suite AI capabilities</span>
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
                              setShowFeatureComparison(true);
                            }}
                            className="w-full text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 text-center flex items-center justify-center gap-1"
                          >
                            View all features &gt;
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Accordion 1: Which plan is right for me? */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Scale className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">Which plan is right for me?</h4>
                            <p className="text-xs text-slate-500">Compare starter, standard, and enhanced options. View detailed feature comparison.</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowFeatureComparison(!showFeatureComparison)}
                          className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                        >
                          <span>{showFeatureComparison ? 'Hide Comparison' : 'View Feature Comparison'}</span>
                          {showFeatureComparison ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {showFeatureComparison && (
                        <div className="mt-5 pt-5 border-t border-slate-100 overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                                <th className="py-2.5 px-3">Capability / Feature</th>
                                <th className="py-2.5 px-3">Starter Edition</th>
                                <th className="py-2.5 px-3 bg-indigo-50/50 text-indigo-950 font-black">Standard Edition (Recommended)</th>
                                <th className="py-2.5 px-3">Enhanced Edition</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Target Fit</td>
                                <td className="py-2.5 px-3 text-slate-600">Small, simple landscapes</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-indigo-900 font-medium">Enterprise integration core</td>
                                <td className="py-2.5 px-3 text-slate-600">High-volume & advanced AI/AEM</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Included Messages</td>
                                <td className="py-2.5 px-3 text-slate-600">50K / month</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-indigo-900 font-medium">10K / month</td>
                                <td className="py-2.5 px-3 text-slate-600">500K / month</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Free SAP-to-SAP Messages</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Unlimited</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-emerald-600 font-bold">✓ Unlimited</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Unlimited</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Prebuilt Integrations</td>
                                <td className="py-2.5 px-3 text-slate-600">3,400+ packages</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-indigo-900 font-medium">3,400+ packages</td>
                                <td className="py-2.5 px-3 text-slate-600">3,400+ packages</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Custom iFlow Entitlement</td>
                                <td className="py-2.5 px-3 text-amber-700 font-bold">Cap of 10 custom iFlows</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-emerald-600 font-bold">✓ Unlimited</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Unlimited</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">API Lifecycle Management</td>
                                <td className="py-2.5 px-3 text-slate-400">✕ Not included</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-emerald-600 font-bold">✓ Fully included</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Fully included</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">B2B / EDI Trading Partner Mgmt</td>
                                <td className="py-2.5 px-3 text-slate-400">✕ Not included</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-emerald-600 font-bold">✓ Fully included</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Fully included</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Open Connectors (200+ SaaS)</td>
                                <td className="py-2.5 px-3 text-slate-400">✕ Not included</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-emerald-600 font-bold">✓ Fully included</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Fully included</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Integration Advisor (AI-assisted)</td>
                                <td className="py-2.5 px-3 text-slate-400">✕ Not included</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-emerald-600 font-bold">✓ Fully included</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Fully included</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Edge Integration Cell</td>
                                <td className="py-2.5 px-3 text-slate-400">✕ Not included</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-indigo-900 font-medium">✓ 1+ runtime tenant</td>
                                <td className="py-2.5 px-3 text-indigo-900 font-medium">✓ 1+ runtime tenant</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Alert Notification (ANS)</td>
                                <td className="py-2.5 px-3 text-slate-400">✕ Not included</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-slate-500">Optional Add-on</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ 100K API calls/mo</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Cloud Transport Mgmt (TMS)</td>
                                <td className="py-2.5 px-3 text-slate-400">✕ Not included</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-slate-500">Optional Add-on</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ 25 GB/month</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">SAP Document AI</td>
                                <td className="py-2.5 px-3 text-slate-400">✕ Not included</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-slate-500">Optional Add-on</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ 100 docs/month</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Advanced Event Mesh (AEM)</td>
                                <td className="py-2.5 px-3 text-slate-400">✕ Not included</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-slate-500">Separate subscription</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ 1 x AEM 100 tenant</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">Integration Suite AI</td>
                                <td className="py-2.5 px-3 text-slate-400">✕ Not included</td>
                                <td className="py-2.5 px-3 bg-indigo-50/30 text-slate-500">Fair-use waiver</td>
                                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ iFlow Gen & Optimization</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Expandable Accordion 2: Add-ons to enhance your plan */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Puzzle className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">Add-ons to enhance your plan</h4>
                            <p className="text-xs text-slate-500">Add additional capabilities to meet your specific requirements.</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddOns(!showAddOns)}
                          className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                        >
                          <span>{showAddOns ? 'Hide Add-ons' : 'View Add-ons'}</span>
                          {showAddOns ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {showAddOns && (
                        <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Select one or more add-ons to customize your solution, or leave unselected for base edition only.
                            </span>
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
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4" />
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                      packs > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                    }`}
                                  >
                                    {packs > 0 ? `✓ In Plan (${packs} blocks)` : 'Optional'}
                                  </span>
                                </div>

                                <div>
                                  <h5 className="text-xs font-black text-slate-900">Additional Messages</h5>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    Blocks of 10,000 monthly transactions to process integrations and APIs.
                                  </p>
                                </div>

                                <div className="pt-1">
                                  <div className="text-sm font-black text-indigo-900 font-mono">
                                    USD 7.00 <span className="text-[10px] font-normal text-slate-500">/ mo</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">
                                    {contractYears === 1 && 'USD 84.00 / 10K-month block / yr'}
                                    {contractYears === 3 && 'USD 252.00 total / block (3-yr term)'}
                                    {contractYears === 5 && 'USD 420.00 total / block (5-yr term)'}
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-slate-100 mt-3 space-y-2">
                                {packs === 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdatePacks(50)}
                                    className="w-full py-1.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add to Plan
                                  </button>
                                ) : (
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="font-semibold text-slate-700">Quantity (10K blocks):</span>
                                      <span className="font-mono font-bold text-indigo-700">{packs} blocks</span>
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
                                        +{(packs * 10).toLocaleString()}K msgs/mo
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdatePacks(0)}
                                        className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                )}
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
                              <div className="space-y-2.5">
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
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    Supports secure, sovereign data exchange across industrial ecosystems (DSI & DIV).
                                  </p>
                                </div>

                                <div className="pt-1">
                                  <div className="text-sm font-black text-indigo-900 font-mono">
                                    USD 75.00 <span className="text-[10px] font-normal text-slate-500">/ mo</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">
                                    {contractYears === 1 && 'USD 900.00 / pkg / year'}
                                    {contractYears === 3 && 'USD 2,700.00 total / pkg (3-yr term)'}
                                    {contractYears === 5 && 'USD 4,500.00 total / pkg (5-yr term)'}
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-slate-100 mt-3 space-y-2">
                                {dataSpacePackages === 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDataSpace(1)}
                                    className="w-full py-1.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add to Plan
                                  </button>
                                ) : (
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="font-semibold text-slate-700">Tenants / Packages:</span>
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
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateDataSpace(0)}
                                        className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                )}
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
                              <div className="space-y-2.5">
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
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    Additional runtime tenants for private cloud or on-prem deployment landscapes.
                                  </p>
                                </div>

                                <div className="pt-1">
                                  <div className="text-sm font-black text-indigo-900 font-mono">
                                    USD 3,455.00 <span className="text-[10px] font-normal text-slate-500">/ mo</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">
                                    {contractYears === 1 && 'USD 41,460.00 / tenant / yr'}
                                    {contractYears === 3 && 'USD 124,380.00 total / tenant (3-yr term)'}
                                    {contractYears === 5 && 'USD 207,300.00 total / tenant (5-yr term)'}
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-slate-100 mt-3 space-y-2">
                                {additionalEicTenants === 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateEic(1)}
                                    className="w-full py-1.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add to Plan
                                  </button>
                                ) : (
                                  <div className="space-y-1.5">
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
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateEic(0)}
                                        className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column (4 cols): Your Selection Sidebar & Quick Links */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Your Selection Card Matching Reference UI */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-base font-black text-slate-900">Your Selection</h3>
                        <button
                          type="button"
                          onClick={() => setShowFeatureComparison(true)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>

                      {/* Selected Edition Summary */}
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                          {currentEd === 'Starter Edition' && <Box className="w-5 h-5" />}
                          {currentEd === 'Standard Edition' && <Layers className="w-5 h-5" />}
                          {currentEd === 'Enhanced Edition' && <Crown className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{currentEd}</div>
                          <div className="text-xs font-black text-indigo-900 font-mono mt-0.5">
                            USD {currentEd === 'Starter Edition' ? '1,728' : currentEd === 'Standard Edition' ? '5,339' : '7,688'} <span className="text-[10px] font-normal text-slate-500">/ month</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            (USD {baseUnitAnnual.toLocaleString()} / year)
                          </div>
                        </div>
                      </div>

                      {/* Production Units Interactive Stepper */}
                      <div className="space-y-1.5 pt-1">
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
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={units}
                            onChange={(e) => handleUpdateUnits(parseInt(e.target.value) || 1)}
                            className="w-full text-center font-mono text-sm border border-slate-300 rounded-lg py-1 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateUnits(units + 1)}
                            className="w-8 h-8 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400">USD {baseUnitAnnual.toLocaleString()} per unit per year</p>
                      </div>

                      {/* Selected Add-ons Itemized Breakdown */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                            Add-ons
                            {totalSelectedAddOnsCount > 0 && (
                              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">
                                {totalSelectedAddOnsCount}
                              </span>
                            )}
                          </span>
                          {totalSelectedAddOnsCount > 0 ? (
                            <button
                              type="button"
                              onClick={handleClearAllAddOns}
                              className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                            >
                              Clear all
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">None selected ($0)</span>
                          )}
                        </div>

                        {totalSelectedAddOnsCount === 0 ? (
                          <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">No add-ons selected</span>
                            <button
                              type="button"
                              onClick={() => setShowAddOns(true)}
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-white px-2 py-1 rounded-lg border border-indigo-200 hover:bg-indigo-50/50 transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Select Add-ons
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {/* Messages in Sidebar */}
                            {packs > 0 && (
                              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    Additional Messages
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    {packs} blocks ({contractYears === 1 ? `+$${(packs * 84).toLocaleString()}/yr` : `+$${(packs * 84 * contractYears).toLocaleString()} total`})
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdatePacks(packs - 50)}
                                    className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-[10px] font-bold"
                                    disabled={packs <= 0}
                                  >
                                    -
                                  </button>
                                  <span className="text-[10px] font-mono font-bold w-6 text-center">{packs}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdatePacks(packs + 50)}
                                    className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-[10px] font-bold"
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdatePacks(0)}
                                    className="w-5 h-5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center text-xs ml-0.5"
                                    title="Remove add-on"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Data Space in Sidebar */}
                            {dataSpacePackages > 0 && (
                              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    Data Space Integration
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    {dataSpacePackages} pkg ({contractYears === 1 ? `+$${(dataSpacePackages * 900).toLocaleString()}/yr` : `+$${(dataSpacePackages * 900 * contractYears).toLocaleString()} total`})
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDataSpace(dataSpacePackages - 1)}
                                    className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-[10px] font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="text-[10px] font-mono font-bold w-5 text-center">{dataSpacePackages}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDataSpace(dataSpacePackages + 1)}
                                    className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-[10px] font-bold"
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDataSpace(0)}
                                    className="w-5 h-5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center text-xs ml-0.5"
                                    title="Remove add-on"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* EIC Tenant in Sidebar */}
                            {additionalEicTenants > 0 && (
                              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    Additional EIC Tenant
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    {additionalEicTenants} tenant(s) ({contractYears === 1 ? `+$${(additionalEicTenants * 41460).toLocaleString()}/yr` : `+$${(additionalEicTenants * 41460 * contractYears).toLocaleString()} total`})
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateEic(additionalEicTenants - 1)}
                                    className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-[10px] font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="text-[10px] font-mono font-bold w-5 text-center">{additionalEicTenants}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateEic(additionalEicTenants + 1)}
                                    className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-[10px] font-bold"
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateEic(0)}
                                    className="w-5 h-5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center text-xs ml-0.5"
                                    title="Remove add-on"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="text-[10px] font-mono text-indigo-700 font-bold text-right pt-0.5">
                              Add-ons Total: {contractYears === 1 ? `USD ${annualizedAddOnsCost.toLocaleString()} / yr` : `USD ${(annualizedAddOnsCost * contractYears).toLocaleString()} (${contractYears}-yr)`}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Estimated Annual Cost / Term Cost Box */}
                      <div className="pt-4 border-t border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span className="font-medium flex items-center gap-1">
                            {contractYears === 1 ? 'Estimated Annual Cost' : `${contractYears}-Year Total Commitment`}
                            <span title="Total cloud configuration cost including base edition units and message packs">
                              <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </span>
                          </span>
                        </div>
                        <div className="text-2xl font-black text-indigo-700 font-mono tracking-tight">
                          USD {contractYears === 1 ? estimatedAnnualCost.toLocaleString() : termTotalCost.toLocaleString()}
                        </div>
                        {contractYears > 1 && (
                          <div className="text-[11px] text-slate-500 font-mono">
                            (Annualized: USD {estimatedAnnualCost.toLocaleString()} / year)
                          </div>
                        )}
                      </div>

                      {/* Primary CTA Button */}
                      <button
                        type="button"
                        onClick={() => setCurrentStep(6)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        Next: Review & Results <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Links Card Matching Reference Screenshot */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Links</h4>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setShowFeatureComparison(true)}
                          className="w-full p-3 rounded-xl border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/30 flex items-center justify-between text-left transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                              <Scale className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">Compare Editions</div>
                              <div className="text-[10px] text-slate-500">Side-by-side feature comparison</div>
                            </div>
                          </div>
                          <span className="text-slate-400 group-hover:text-indigo-600 text-xs">&gt;</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowAddOns(true)}
                          className="w-full p-3 rounded-xl border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/30 flex items-center justify-between text-left transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                              <Puzzle className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">View Add-ons</div>
                              <div className="text-[10px] text-slate-500">Enhance your plan with additional services</div>
                            </div>
                          </div>
                          <span className="text-slate-400 group-hover:text-indigo-600 text-xs">&gt;</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowAiRecommendation(true)}
                          className="w-full p-3 rounded-xl border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/30 flex items-center justify-between text-left transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">Get AI Recommendation</div>
                              <div className="text-[10px] text-slate-500">Let AI suggest the best edition for your needs</div>
                            </div>
                          </div>
                          <span className="text-slate-400 group-hover:text-indigo-600 text-xs">&gt;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation Controls */}
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

        {/* Right Sticky Sidebar: Live Economics Summary (Visible for input steps 1 to 6) */}
        {currentStep < 7 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-20 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Live Economics Summary
                </h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Dynamic
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-medium">Current Platform TCO</span>
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    {formatCurrency(currentTcoPreview, assessment.currency)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-medium">BTP Target TCO</span>
                  <span className="text-sm font-extrabold text-indigo-600 font-mono">
                    {formatCurrency(targetTcoPreview, assessment.currency)}
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl flex justify-between items-center border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-bold">Projected Annual Savings</span>
                  <span className="text-sm font-extrabold text-emerald-700 font-mono">
                    {formatCurrency(annualSavingsPreview, assessment.currency)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-medium">One-Time Migration Cost</span>
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    {formatCurrency(migrationCostPreview, assessment.currency)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Estimated Payback:</span>
                  <span className="font-bold text-emerald-600 font-mono">
                    {annualSavingsPreview > 0
                      ? `${((migrationCostPreview / annualSavingsPreview) * 12).toFixed(1)} Months`
                      : 'N/A'}
                  </span>
                </div>
              </div>


            </div>
          </div>
        )}
      </div>
    </div>
  );
}
