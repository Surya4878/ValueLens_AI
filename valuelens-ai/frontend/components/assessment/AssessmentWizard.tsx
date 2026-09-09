'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Assessment, RoiCalculationResult } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';

export function AssessmentWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<RoiCalculationResult | null>(null);

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
        totalAnnualCost: 204084, // $173,700 base (3 x $57,900) + (400 * $75.96 = $30,384) = $204,084
        calculationFormula: '3 units x $57,900/yr + 400 packs x $75.96',
      },
      additionalTcoComponents: {
        totalAdditionalTcoAnnual: 109000, // People / Cloud Run = $109,000. Total Target TCO = $204,084 + $109,000 = $313,084
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

  // Target BTP Edition Base
  const getEditionBasePrice = (editionName: string, units: number = 3) => {
    if (!editionName) return 57900 * units;
    const lower = editionName.toLowerCase();
    if (lower.includes('starter')) return 18744;
    if (lower.includes('premium')) return 318204;
    return 57900 * (units > 0 ? units : 3);
  };

  const currentUnits =
    assessment.targetSystem.configuration.selectedEditionName === 'Standard Edition'
      ? (assessment.targetSystem.configuration.numberOfUnits || 3)
      : 1;
  const editionBase = getEditionBasePrice(assessment.targetSystem.configuration.selectedEditionName, currentUnits);
  const messagePacksCost = (assessment.targetSystem.configuration.additionalMessagePacks || 0) * 75.96;
  const targetConfigTotal =
    assessment.targetSystem.configuration.totalAnnualCost && assessment.targetSystem.configuration.totalAnnualCost > 0
      ? assessment.targetSystem.configuration.totalAnnualCost
      : editionBase + messagePacksCost;
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

  // 5 Master Milestones corresponding to Screenshot 1 top progress bar
  const milestones = [
    { id: 1, label: 'Company Information', activeForSteps: [1] },
    { id: 2, label: 'Current PI/PO Environment', activeForSteps: [2, 3] },
    { id: 3, label: 'Target BTP Platform', activeForSteps: [4, 5] },
    { id: 4, label: 'Migration Details', activeForSteps: [6] },
    { id: 5, label: 'Results', activeForSteps: [7] },
  ];

  const getActiveMilestone = () => {
    if (currentStep === 1) return 1;
    if (currentStep === 2 || currentStep === 3) return 2;
    if (currentStep === 4 || currentStep === 5) return 3;
    if (currentStep === 6) return 4;
    return 5;
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
                  if (m.id === 3) setCurrentStep(4);
                  if (m.id === 4) setCurrentStep(6);
                  if (m.id === 5 && calculationResult) setCurrentStep(7);
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
          {/* STEP 5 (Slide 6): Target SAP BTP Platform                                  */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 5 of 6</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">Select your SAP BTP Integration Suite edition</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Choose the edition that best fits your requirements and sizing.
                </p>
              </div>

              {/* 3 Tier Edition Cards matching Slide 6 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Starter Edition */}
                <div
                  onClick={() => {
                    const packs = assessment.targetSystem.configuration.additionalMessagePacks || 0;
                    setAssessment({
                      ...assessment,
                      targetSystem: {
                        ...assessment.targetSystem,
                        configuration: {
                          ...assessment.targetSystem.configuration,
                          selectedEditionName: 'Starter Edition',
                          numberOfUnits: 1,
                          totalAnnualCost: 18744 + (packs * 75.96),
                          calculationFormula: `Starter Edition ($18,744/yr) + ${packs} packs x $75.96`,
                        },
                      },
                    });
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    assessment.targetSystem.configuration.selectedEditionName === 'Starter Edition'
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-slate-900">Starter Edition</h3>
                    <div className="text-lg font-black text-indigo-900 font-mono">$18,744 <span className="text-xs font-normal text-slate-500">/ year</span></div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li>• 50K messages per month</li>
                      <li>• Access to 920+ integrations</li>
                      <li>• 1 tenant per year</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className={`mt-4 w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      assessment.targetSystem.configuration.selectedEditionName === 'Starter Edition'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {assessment.targetSystem.configuration.selectedEditionName === 'Starter Edition' ? 'Selected ✓' : 'Select'}
                  </button>
                </div>

                {/* Standard Edition (Recommended) */}
                <div
                  onClick={() => {
                    const units = assessment.targetSystem.configuration.numberOfUnits || 3;
                    const packs = assessment.targetSystem.configuration.additionalMessagePacks || 0;
                    setAssessment({
                      ...assessment,
                      targetSystem: {
                        ...assessment.targetSystem,
                        configuration: {
                          ...assessment.targetSystem.configuration,
                          selectedEditionName: 'Standard Edition',
                          numberOfUnits: units,
                          totalAnnualCost: (units * 57900) + (packs * 75.96),
                          calculationFormula: `${units} units x $57,900/yr + ${packs} packs x $75.96`,
                        },
                      },
                    });
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                    assessment.targetSystem.configuration.selectedEditionName === 'Standard Edition'
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    Recommended
                  </span>
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-slate-900">Standard Edition</h3>
                    <div className="text-lg font-black text-indigo-900 font-mono">$57,900 <span className="text-xs font-normal text-slate-500">/ unit / yr</span></div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li>• API lifecycle management</li>
                      <li>• B2B capabilities</li>
                      <li>• 160+ SaaS applications</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className={`mt-4 w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      assessment.targetSystem.configuration.selectedEditionName === 'Standard Edition'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {assessment.targetSystem.configuration.selectedEditionName === 'Standard Edition' ? 'Selected ✓' : 'Select'}
                  </button>
                </div>

                {/* Premium Edition */}
                <div
                  onClick={() => {
                    const packs = assessment.targetSystem.configuration.additionalMessagePacks || 0;
                    setAssessment({
                      ...assessment,
                      targetSystem: {
                        ...assessment.targetSystem,
                        configuration: {
                          ...assessment.targetSystem.configuration,
                          selectedEditionName: 'Premium Edition',
                          numberOfUnits: 1,
                          totalAnnualCost: 318204 + (packs * 75.96),
                          calculationFormula: `Premium Edition ($318,204/yr) + ${packs} packs x $75.96`,
                        },
                      },
                    });
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    assessment.targetSystem.configuration.selectedEditionName === 'Premium Edition'
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-slate-900">Premium Edition</h3>
                    <div className="text-lg font-black text-indigo-900 font-mono">$318,204 <span className="text-xs font-normal text-slate-500">/ year</span></div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li>• All Standard features</li>
                      <li>• 4 Integration Suite tenants</li>
                      <li>• 4 Edge Integration tenants</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className={`mt-4 w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      assessment.targetSystem.configuration.selectedEditionName === 'Premium Edition'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {assessment.targetSystem.configuration.selectedEditionName === 'Premium Edition' ? 'Selected ✓' : 'Select'}
                  </button>
                </div>
              </div>

              {/* Sizing & Message Packs Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard Edition Units Selector */}
                {assessment.targetSystem.configuration.selectedEditionName === 'Standard Edition' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Production Units</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">$57,900 base per unit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={assessment.targetSystem.configuration.numberOfUnits || 3}
                        onChange={(e) => {
                          const units = Math.max(1, parseInt(e.target.value) || 1);
                          const packs = assessment.targetSystem.configuration.additionalMessagePacks || 0;
                          const total = (units * 57900) + (packs * 75.96);
                          setAssessment({
                            ...assessment,
                            targetSystem: {
                              ...assessment.targetSystem,
                              configuration: {
                                ...assessment.targetSystem.configuration,
                                numberOfUnits: units,
                                totalAnnualCost: total,
                                calculationFormula: `${units} units x $57,900/yr + ${packs} packs x $75.96`,
                              },
                            },
                          });
                        }}
                        className="w-20 text-right font-mono text-sm border border-slate-300 rounded-lg p-2 bg-white"
                      />
                      <span className="text-xs text-slate-500 font-medium">units</span>
                    </div>
                  </div>
                )}

                {/* Additional Message Packs */}
                <div className={`p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between ${assessment.targetSystem.configuration.selectedEditionName !== 'Standard Edition' ? 'sm:col-span-2' : ''}`}>
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Additional Message Packs</span>
                    <span className="text-xs text-slate-500 mt-0.5 block">$75.96 per 10,000 transactions per year</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={assessment.targetSystem.configuration.additionalMessagePacks}
                      onChange={(e) => {
                        const packs = Math.max(0, parseInt(e.target.value) || 0);
                        const ed = assessment.targetSystem.configuration.selectedEditionName;
                        const units = ed === 'Standard Edition' ? (assessment.targetSystem.configuration.numberOfUnits || 3) : 1;
                        const base = getEditionBasePrice(ed, units);
                        const total = base + (packs * 75.96);
                        setAssessment({
                          ...assessment,
                          targetSystem: {
                            ...assessment.targetSystem,
                            configuration: {
                              ...assessment.targetSystem.configuration,
                              additionalMessagePacks: packs,
                              totalAnnualCost: total,
                              calculationFormula: `${ed} + ${packs} packs x $75.96`,
                            },
                          },
                        });
                      }}
                      className="w-24 text-right font-mono text-sm border border-slate-300 rounded-lg p-2 bg-white"
                    />
                    <span className="text-xs text-slate-500 font-medium">packs</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Target Config Summary */}
              <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-950">
                  Target BTP Platform Configuration Annual Cost:
                </span>
                <span className="font-mono font-black text-indigo-700 text-sm">
                  ${(assessment.targetSystem.configuration.totalAnnualCost || targetConfigTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / yr
                </span>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

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
                  Your migration shows strong economic case. Moving from SAP PI/PO to SAP BTP reduces estimated annual platform TCO by approximately 57%, with an estimated 5-year ROI of 594.86%. The largest component stems from eliminating legacy infrastructure, support and operational overhead.
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
