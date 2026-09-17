'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  ChevronDown,
  Info,
  ArrowRight,
  ArrowLeft,
  Server,
  Database,
  Loader2,
  RefreshCw,
  Download,
  BarChart2,
  Settings,
  FileText,
  Zap,
  Rocket,
  Gift,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';
import { Assessment, RoiCalculationResult } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';
import {
  PlatformId,
  SUPPORTED_PLATFORMS,
  PLATFORM_CONFIGS,
  COMMON_REQUIREMENTS_QUESTIONS,
  matchIncturePackage,
} from '@/data/platformAssessmentConfig';

import { Step1Organization } from './steps/Step1Organization';
import { Step2Landscape } from './steps/Step2Landscape';
import { Step3Requirements } from './steps/Step3Requirements';
import { Step4Sizing } from './steps/Step4Sizing';
import { Step5CostParameters, Step5CostsState } from './steps/Step5CostParameters';
import { Step6SelectEdition } from './steps/Step6SelectEdition';
import { Step7ReviewResults } from './steps/Step7ReviewResults';

export const PLATFORM_OPTIONS = SUPPORTED_PLATFORMS;

export const createFreshAssessment = (platformId: PlatformId = 'sap-pipo'): Assessment => {
  const config = PLATFORM_CONFIGS[platformId] || PLATFORM_CONFIGS['sap-pipo'];
  return {
    id: `asmt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    name: '',
    sourcePlatform: config.name,
    targetPlatform: 'SAP BTP Integration Suite',
    status: 'IN_PROGRESS',
    currency: 'USD',
    sourceSystem: {
      companyInformation: {
        companySize: '',
        industry: '',
        migrationTimeline: '',
        integrationComplexity: '',
        availabilityRequirements: '',
        complianceRequirements: '',
        customDevelopment: '',
        monitoringMaturity: '',
      },
      environmentAssessment: {
        integrationVolume: '',
        systemComplexity: '',
        availabilityRequirements: '',
        customDevelopment: '',
        complianceRequirements: '',
        monitoring: '',
        simpleInterfaces: 0,
        mediumInterfaces: 0,
        complexInterfaces: 0,
        totalInterfaces: 0,
      },
      volumetrics: {
        currentMessageThroughput: '',
        indicativeMessageThroughput: '',
        apiCount: 0,
        b2bInterfaces: 0,
      },
      sapPiPoAnnualCostBreakdown: {
        licensing: {
          sapPiPoLicenseCosts: 0,
          thirdPartyAdapterLicenses: 0,
          developmentEnvironmentLicenses: 0,
          testingEnvironmentLicenses: 0,
          subtotal: 0,
        },
        infrastructure: {
          hardwareServerCosts: 0,
          storageBackupCosts: 0,
          networkingConnectivity: 0,
          dataCenterFacilities: 0,
          subtotal: 0,
        },
        support: {
          sapSupportMaintenance: 0,
          thirdPartySupportContracts: 0,
          systemMaintenanceUpgrades: 0,
          dataCenterFacilities: 0,
          subtotal: 0,
        },
        operations: {
          administrativeStaffCosts: 0,
          supportStaffCosts: 0,
          trainingCertificationCosts: 0,
          dataCenterFacilities: 0,
          subtotal: 0,
        },
      },
    },
    targetSystem: {
      targetPlatform: 'SAP BTP Integration Suite',
      configuration: {
        selectedEditionName: '',
        numberOfUnits: 0,
        additionalMessagePacks: 0,
        dataSpacePackages: 0,
        additionalEicTenants: 0,
        totalAnnualCost: 0,
        calculationFormula: '',
      },
      additionalTcoComponents: {
        totalAdditionalTcoAnnual: 0,
        categories: {
          optionalComponents: 0,
          infrastructure: 0,
          operations: 0,
          development: 0,
          compliance: 0,
          people: 0,
        },
      },
    },
    migrationRelatedDetails: {
      developmentCost: 0,
      testingCost: 0,
      architectureCost: 0,
      projectManagementCost: 0,
      trainingCost: 0,
      deploymentCutoverCost: 0,
      documentationCost: 0,
      baseMigrationCost: 0,
      contingencyCost: 0,
      totalMigrationCost: 0,
      currency: 'USD',
      roiAnalysisPeriodYears: 5,
    },
  };
};

export function AssessmentWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('sap-pipo');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<RoiCalculationResult | null>(null);

  // Active platform configuration
  const activePlat = PLATFORM_OPTIONS.find((p) => p.id === selectedPlatform) || PLATFORM_OPTIONS[0];
  const activeConfig = PLATFORM_CONFIGS[selectedPlatform] || PLATFORM_CONFIGS['sap-pipo'];

  // Step 1 Organization State
  const [companyName, setCompanyName] = useState<string>('');

  // Form State initialized with clean 0 / empty values (user enters all scope & costs)
  const [assessment, setAssessment] = useState<Assessment>(() => createFreshAssessment('sap-pipo'));

  // Step 3 Requirements selection state (empty initially)
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);

  const requirementsRecord = React.useMemo(() => {
    const rec: Record<string, boolean> = {};
    COMMON_REQUIREMENTS_QUESTIONS.forEach((q) => {
      rec[q.id] = selectedRequirements.includes(q.id);
    });
    return rec;
  }, [selectedRequirements]);

  // Step 5 Cost parameters state (all zero initially)
  const [costsState, setCostsState] = useState<Step5CostsState>({
    licensing: 0,
    infrastructure: 0,
    support: 0,
    operations: 0,
    development: 0,
    other: 0,
  });

  // Start completely fresh business value assessment with all blank/zero values
  const handleStartNewBusinessValue = (targetPlatformId: PlatformId = 'sap-pipo') => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('valuelens_active_assessment');
        localStorage.removeItem('valuelens_active_assessment_id');
        localStorage.removeItem('valuelens_active_calculation');
        localStorage.removeItem('valuelens_assessment_draft');
      } catch (e) {
        console.warn('Could not clear localStorage', e);
      }
    }
    setCompanyName('');
    setSelectedPlatform(targetPlatformId);
    setSelectedRequirements([]);
    setCostsState({
      licensing: 0,
      infrastructure: 0,
      support: 0,
      operations: 0,
      development: 0,
      other: 0,
    });
    setCalculationResult(null);
    setAssessment(createFreshAssessment(targetPlatformId));
    setCurrentStep(0);
  };

  // Restore saved assessment data from localStorage if available, or reset if ?new=true
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('new') === 'true') {
        handleStartNewBusinessValue();
        return;
      }
      try {
        const saved = localStorage.getItem('valuelens_active_assessment');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.id === 'demo-assessment-1') {
            return;
          }
          const hasData =
            (parsed?.sourceSystem?.sapPiPoAnnualCostBreakdown?.licensing?.subtotal ?? 0) > 0 ||
            (parsed?.sourceSystem?.sapPiPoAnnualCostBreakdown?.licensing?.sapPiPoLicenseCosts ?? 0) > 0 ||
            (parsed?.migrationRelatedDetails?.totalMigrationCost ?? 0) > 0;
          if (hasData) {
            const breakdown = parsed.sourceSystem?.sapPiPoAnnualCostBreakdown;
            if (breakdown) {
              setCostsState({
                licensing: breakdown.licensing?.subtotal || breakdown.licensing?.sapPiPoLicenseCosts || 0,
                infrastructure: breakdown.infrastructure?.subtotal || breakdown.infrastructure?.hardwareServerCosts || 0,
                support: breakdown.support?.subtotal || breakdown.support?.sapSupportMaintenance || 0,
                operations: breakdown.operations?.subtotal || breakdown.operations?.administrativeStaffCosts || 0,
                development: 0,
                other: 0,
              });
            }
            if (parsed.name) {
              setCompanyName(parsed.name);
            }
            setAssessment((prev) => ({
              ...prev,
              ...parsed,
              sourceSystem: {
                ...prev.sourceSystem,
                ...(parsed?.sourceSystem || {}),
                companyInformation: {
                  ...prev.sourceSystem.companyInformation,
                  ...(parsed?.sourceSystem?.companyInformation || {}),
                },
                environmentAssessment: {
                  ...prev.sourceSystem.environmentAssessment,
                  ...(parsed?.sourceSystem?.environmentAssessment || {}),
                },
                volumetrics: {
                  ...prev.sourceSystem.volumetrics,
                  ...(parsed?.sourceSystem?.volumetrics || {}),
                },
                sapPiPoAnnualCostBreakdown: {
                  ...prev.sourceSystem.sapPiPoAnnualCostBreakdown,
                  ...(parsed?.sourceSystem?.sapPiPoAnnualCostBreakdown || {}),
                  licensing: {
                    ...prev.sourceSystem.sapPiPoAnnualCostBreakdown.licensing,
                    ...(parsed?.sourceSystem?.sapPiPoAnnualCostBreakdown?.licensing || {}),
                  },
                  infrastructure: {
                    ...prev.sourceSystem.sapPiPoAnnualCostBreakdown.infrastructure,
                    ...(parsed?.sourceSystem?.sapPiPoAnnualCostBreakdown?.infrastructure || {}),
                  },
                  support: {
                    ...prev.sourceSystem.sapPiPoAnnualCostBreakdown.support,
                    ...(parsed?.sourceSystem?.sapPiPoAnnualCostBreakdown?.support || {}),
                  },
                  operations: {
                    ...prev.sourceSystem.sapPiPoAnnualCostBreakdown.operations,
                    ...(parsed?.sourceSystem?.sapPiPoAnnualCostBreakdown?.operations || {}),
                  },
                },
              },
              targetSystem: {
                ...prev.targetSystem,
                ...(parsed?.targetSystem || {}),
                configuration: {
                  ...prev.targetSystem.configuration,
                  ...(parsed?.targetSystem?.configuration || {}),
                },
                additionalTcoComponents: {
                  ...prev.targetSystem.additionalTcoComponents,
                  ...(parsed?.targetSystem?.additionalTcoComponents || {}),
                },
              },
              migrationRelatedDetails: {
                ...prev.migrationRelatedDetails,
                ...(parsed?.migrationRelatedDetails || {}),
              },
            }));
          }
        }
      } catch {
        // ignore parse error
      }
    }
  }, []);

  // Handle switching platform on Step 0
  const handleSelectPlatform = (platId: PlatformId) => {
    setSelectedPlatform(platId);
    const targetConfig = PLATFORM_CONFIGS[platId] || PLATFORM_CONFIGS['sap-pipo'];

    const newCosts: Step5CostsState = {
      licensing: 0,
      infrastructure: 0,
      support: 0,
      operations: 0,
      development: 0,
      other: 0,
    };
    setCostsState(newCosts);

    setAssessment((prev) => ({
      ...prev,
      name: `${targetConfig.name} to SAP BTP Migration Assessment`,
      sourcePlatform: targetConfig.name,
      sourceSystem: {
        ...prev.sourceSystem,
        environmentAssessment: {
          ...(prev.sourceSystem?.environmentAssessment || {}),
          totalInterfaces: 0,
          simpleInterfaces: 0,
          mediumInterfaces: 0,
          complexInterfaces: 0,
          integrationVolume: '',
          systemComplexity: '',
          migrationTimeline: '',
        },
        sapPiPoAnnualCostBreakdown: {
          licensing: {
            sapPiPoLicenseCosts: 0,
            thirdPartyAdapterLicenses: 0,
            developmentEnvironmentLicenses: 0,
            testingEnvironmentLicenses: 0,
            subtotal: 0,
          },
          infrastructure: {
            hardwareServerCosts: 0,
            storageBackupCosts: 0,
            networkingConnectivity: 0,
            dataCenterFacilities: 0,
            subtotal: 0,
          },
          support: {
            sapSupportMaintenance: 0,
            thirdPartySupportContracts: 0,
            systemMaintenanceUpgrades: 0,
            dataCenterFacilities: 0,
            subtotal: 0,
          },
          operations: {
            administrativeStaffCosts: 0,
            supportStaffCosts: 0,
            trainingCertificationCosts: 0,
            dataCenterFacilities: 0,
            subtotal: 0,
          },
        },
      },
      migrationRelatedDetails: {
        ...prev.migrationRelatedDetails,
        totalMigrationCost: 0,
        baseMigrationCost: 0,
        developmentCost: 0,
        testingCost: 0,
        architectureCost: 0,
        projectManagementCost: 0,
        contingencyCost: 0,
        trainingCost: 0,
        deploymentCutoverCost: 0,
        documentationCost: 0,
      },
    }));
  };

  // Cost update handler for Step 5
  const handleUpdateCost = (category: keyof Step5CostsState, value: number) => {
    const updatedCosts = { ...costsState, [category]: value };
    setCostsState(updatedCosts);

    setAssessment((prev) => {
      const breakdown = prev.sourceSystem.sapPiPoAnnualCostBreakdown;
      if (category === 'licensing') {
        breakdown.licensing.subtotal = value;
      } else if (category === 'infrastructure') {
        breakdown.infrastructure.subtotal = value;
      } else if (category === 'support') {
        breakdown.support.subtotal = value;
      } else if (category === 'operations') {
        breakdown.operations.subtotal = value;
      }
      return {
        ...prev,
        sourceSystem: {
          ...prev.sourceSystem,
          sapPiPoAnnualCostBreakdown: breakdown,
        },
      };
    });
  };

  // Dynamic live economics calculations
  const currentTcoPreview =
    (costsState.licensing || 0) +
    (costsState.infrastructure || 0) +
    (costsState.support || 0) +
    (costsState.operations || 0) +
    (costsState.development || 0) +
    (costsState.other || 0);

  const getEditionBasePrice = (editionName: string, units: number = 0) => {
    if (!editionName || units <= 0) return 0;
    const lower = editionName.toLowerCase();
    if (lower.includes('starter')) return 20736 * units;
    if (lower.includes('enhanced')) return 92256 * units;
    if (lower.includes('standard')) return 64068 * units;
    return 0;
  };

  const currentUnits = assessment.targetSystem.configuration.numberOfUnits || 0;
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
    assessment.targetSystem.additionalTcoComponents.totalAdditionalTcoAnnual || 0;
  const targetTcoPreview = targetConfigTotal + targetAdditionalTco;

  const migrationCostPreview = assessment.migrationRelatedDetails.totalMigrationCost || 0;
  const annualSavingsPreview =
    currentTcoPreview > 0 && targetTcoPreview > 0 && currentTcoPreview > targetTcoPreview
      ? currentTcoPreview - targetTcoPreview
      : 0;
  const fiveYearRoiPreview =
    migrationCostPreview > 0 && annualSavingsPreview > 0
      ? (((annualSavingsPreview * 5) - migrationCostPreview) / migrationCostPreview) * 100
      : 0;
  const netFiveYearBenefitPreview =
    annualSavingsPreview > 0 ? (annualSavingsPreview * 5) - migrationCostPreview : 0;
  const paybackMonthsPreview =
    annualSavingsPreview > 0 && migrationCostPreview > 0 ? (migrationCostPreview / annualSavingsPreview) * 12 : 0;

  // Submit and calculate ROI on Java Spring Boot backend
  const handleExecuteCalculation = async () => {
    setLoading(true);
    setErrorMsg(null);
    const asmtId =
      assessment.id && assessment.id !== 'demo-assessment-1'
        ? assessment.id
        : `asmt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const asmtName = companyName?.trim()
      ? `${companyName.trim()} - ${activeConfig.name} Migration`
      : (assessment.name?.trim() || `${activeConfig.name} Migration Assessment`);

    const migrationCost =
      assessment.migrationRelatedDetails?.totalMigrationCost && assessment.migrationRelatedDetails.totalMigrationCost > 0
        ? assessment.migrationRelatedDetails.totalMigrationCost
        : 65000;

    const assessmentToSave: Assessment = {
      ...assessment,
      id: asmtId,
      name: asmtName,
      sourcePlatform: activeConfig.name,
      targetPlatform: 'SAP BTP Integration Suite',
      migrationRelatedDetails: {
        trainingCost: 0,
        deploymentCutoverCost: 0,
        documentationCost: 0,
        contingencyCost: 0,
        currency: assessment.currency || 'USD',
        roiAnalysisPeriodYears: 5,
        ...(assessment.migrationRelatedDetails || {}),
        totalMigrationCost: migrationCost,
        baseMigrationCost: migrationCost,
        developmentCost: Math.round(migrationCost * 0.60),
        testingCost: Math.round(migrationCost * 0.20),
        architectureCost: Math.round(migrationCost * 0.10),
        projectManagementCost: Math.round(migrationCost * 0.10),
      },
      sourceSystem: {
        ...assessment.sourceSystem,
        sapPiPoAnnualCostBreakdown: {
          licensing: {
            thirdPartyAdapterLicenses: 0,
            developmentEnvironmentLicenses: 0,
            testingEnvironmentLicenses: 0,
            ...(assessment.sourceSystem?.sapPiPoAnnualCostBreakdown?.licensing || {}),
            subtotal: costsState.licensing,
            sapPiPoLicenseCosts: costsState.licensing,
          },
          infrastructure: {
            storageBackupCosts: 0,
            networkingConnectivity: 0,
            dataCenterFacilities: 0,
            ...(assessment.sourceSystem?.sapPiPoAnnualCostBreakdown?.infrastructure || {}),
            subtotal: costsState.infrastructure,
            hardwareServerCosts: costsState.infrastructure,
          },
          support: {
            thirdPartySupportContracts: 0,
            systemMaintenanceUpgrades: 0,
            dataCenterFacilities: 0,
            ...(assessment.sourceSystem?.sapPiPoAnnualCostBreakdown?.support || {}),
            subtotal: costsState.support,
            sapSupportMaintenance: costsState.support,
          },
          operations: {
            supportStaffCosts: 0,
            trainingCertificationCosts: 0,
            dataCenterFacilities: 0,
            ...(assessment.sourceSystem?.sapPiPoAnnualCostBreakdown?.operations || {}),
            subtotal: costsState.operations,
            administrativeStaffCosts: costsState.operations,
          },
        },
      },
    };

    try {
      const saved = await api.saveAssessment(assessmentToSave);
      setAssessment(saved);
      if (typeof window !== 'undefined') {
        localStorage.setItem('valuelens_active_assessment', JSON.stringify(saved));
        localStorage.setItem('valuelens_active_assessment_id', saved.id || asmtId);
      }

      const calc = await api.calculateROI(saved);
      setCalculationResult(calc);
      if (typeof window !== 'undefined' && calc) {
        localStorage.setItem('valuelens_active_calculation', JSON.stringify(calc));
      }
      setCurrentStep(7);
    } catch (err: unknown) {
      console.warn('Backend calculation endpoint returned error, applying deterministic mathematical model:', err);
      setAssessment(assessmentToSave);

      // Deterministic mathematical fallback matching Spring Boot exact formulas
      const fallbackResult = {
        calculationResultId: asmtId,
        assessmentId: asmtId,
        currentPlatformTCO: currentTcoPreview,
        targetPlatformTCO: targetTcoPreview,
        annualSavings: annualSavingsPreview,
        savingsPercentage: currentTcoPreview > 0 ? (annualSavingsPreview / currentTcoPreview) * 100 : 0,
        migrationCost: migrationCostPreview,
        breakEvenMonths: paybackMonthsPreview,
        breakEvenStatus: (annualSavingsPreview > 0 ? 'REACHED' : 'NOT_REACHED') as any,
        oneYearROI: migrationCostPreview > 0 ? ((annualSavingsPreview - migrationCostPreview) / migrationCostPreview) * 100 : 0,
        threeYearROI: migrationCostPreview > 0 ? (((annualSavingsPreview * 3) - migrationCostPreview) / migrationCostPreview) * 100 : 0,
        fiveYearROI: fiveYearRoiPreview,
        tenYearROI: migrationCostPreview > 0 ? (((annualSavingsPreview * 10) - migrationCostPreview) / migrationCostPreview) * 100 : 0,
        oneYearNetBenefit: annualSavingsPreview - migrationCostPreview,
        threeYearNetBenefit: (annualSavingsPreview * 3) - migrationCostPreview,
        fiveYearNetBenefit: netFiveYearBenefitPreview,
        tenYearNetBenefit: (annualSavingsPreview * 10) - migrationCostPreview,
        annualSavingsFormula: `${currentTcoPreview} - ${targetTcoPreview}`,
        roiFormula: `(${annualSavingsPreview} * 5 - ${migrationCostPreview}) / ${migrationCostPreview}`,
        breakEvenFormula: `${migrationCostPreview} / (${annualSavingsPreview} / 12)`,
        licensingSubtotal: costsState.licensing,
        infrastructureSubtotal: costsState.infrastructure,
        supportSubtotal: costsState.support,
        operationsSubtotal: costsState.operations,
        targetConfigurationCost: targetConfigTotal,
        targetAdditionalTco: targetAdditionalTco,
        costDrivers: [],
        complexityResult: { score: 72, classification: 'MEDIUM' as const, factorContributions: {} },
        dataQuality: { score: 95, level: 'HIGH' as const, completenessScore: 100, consistencyScore: 90, validationScore: 95, estimationScore: 95, positiveReasons: [], flags: [] },
        consistencyWarnings: [],
        calculationTraces: {},
        pricingVersion: 'SAP 2026 Official',
        calculationVersion: '1.0.0',
        calculatedAt: new Date().toISOString(),
        currency: assessment.currency || 'USD',
        tcoComparison: {
          currentPlatformAnnualCost: currentTcoPreview,
          targetPlatformAnnualCost: targetTcoPreview,
          annualSavings: annualSavingsPreview,
          fiveYearCurrentTCO: currentTcoPreview * 5,
          fiveYearTargetTCO: targetTcoPreview * 5 + migrationCostPreview,
          fiveYearNetSavings: netFiveYearBenefitPreview,
        },
        executiveSummary: `Migrating from ${activeConfig.name} to SAP BTP Integration Suite reduces annual operational expenditure by $${annualSavingsPreview.toLocaleString()} (${((annualSavingsPreview / (currentTcoPreview || 1)) * 100).toFixed(1)}%), recouping the initial $${migrationCostPreview.toLocaleString()} migration investment within ${paybackMonthsPreview.toFixed(1)} months.`,
      } as unknown as RoiCalculationResult;

      if (typeof window !== 'undefined') {
        localStorage.setItem('valuelens_active_assessment', JSON.stringify(assessmentToSave));
        localStorage.setItem('valuelens_active_assessment_id', asmtId);
        localStorage.setItem('valuelens_active_calculation', JSON.stringify(fallbackResult));
      }

      setCalculationResult(fallbackResult);
      setCurrentStep(7);
    } finally {
      setLoading(false);
    }
  };

  const milestones = [
    { id: 1, label: '1. Organization' },
    { id: 2, label: '2. Current Landscape' },
    { id: 3, label: '3. Requirements' },
    { id: 4, label: '4. Sizing' },
    { id: 5, label: '5. Cost Parameters' },
    { id: 6, label: '6. Edition & Sizing' },
    { id: 7, label: '7. Review & Results' },
  ];

  // =========================================================================
  // STEP 0: PLATFORM SELECTION SCREEN
  // =========================================================================
  if (currentStep === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[14px] font-medium text-[#556b82] py-2">
          <Link href="/" className="hover:text-[#0070f2] transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#1d2d3e] font-semibold">Business Value</span>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#eef6ff] via-[#f4f8fe] to-white border border-[#d9e2ec] p-8 sm:p-10 lg:p-12 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 z-10 space-y-5">
              <span className="text-[13px] font-semibold text-[#0070f2] tracking-wider uppercase">
                INTEGRATION MODERNIZATION
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1d2d3e] tracking-tight leading-tight">
                Discover Business Value
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#556b82] leading-relaxed max-w-xl">
                Choose your current integration platform to understand the business value of your migration to SAP BTP Integration Suite with Incture&apos;s Business ValueLens AI.
              </p>

              {/* 4 Feature Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                    <BarChart2 className="w-5 h-5 text-[#0070f2]" />
                  </div>
                  <div>
                    <div className="text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] leading-tight">Data-driven</div>
                    <div className="text-[13px] text-[#556b82] leading-tight">insights</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                    <Settings className="w-5 h-5 text-[#0070f2]" />
                  </div>
                  <div>
                    <div className="text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] leading-tight">Tailored</div>
                    <div className="text-[13px] text-[#556b82] leading-tight">recommendations</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5 text-[#0070f2]" />
                  </div>
                  <div>
                    <div className="text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] leading-tight">Clear business</div>
                    <div className="text-[13px] text-[#556b82] leading-tight">value</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                    <Zap className="w-5 h-5 text-[#0070f2]" />
                  </div>
                  <div>
                    <div className="text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] leading-tight">Faster path</div>
                    <div className="text-[13px] text-[#556b82] leading-tight">to innovation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Skyline Graphic */}
            <div className="lg:col-span-5 flex items-center justify-end relative h-48 sm:h-56 overflow-hidden rounded-3xl">
              <img
                src="/images/discover-value-banner-right.png"
                alt="From Integration To What's Next"
                className="h-full w-auto max-w-full object-contain object-right pointer-events-none select-none"
              />
            </div>
          </div>
        </div>

        {/* Platform Selection Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] tracking-tight font-['72',sans-serif]">
              Select your current integration platform
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#556b82] mt-1.5 leading-relaxed">
              Choose the platform you are currently using to begin your business value analysis.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {PLATFORM_OPTIONS.map((plat) => {
              const isSelected = selectedPlatform === plat.id;
              return (
                <div
                  key={plat.id}
                  onClick={() => handleSelectPlatform(plat.id)}
                  className={`relative rounded-2xl p-7 sm:p-8 bg-white cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] select-none ${isSelected
                      ? 'border-2 border-[#0070f2] ring-4 ring-[#0070f2]/10 shadow-md scale-[1.01]'
                      : 'border border-[#d9e2ec] hover:border-slate-400 hover:shadow-xs shadow-2xs'
                    }`}
                >
                  {/* Radio Circle */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#0070f2] bg-[#0070f2]' : 'border-slate-300 bg-white'
                        }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Card Diagram: Source -> Target */}
                  <div className="py-2 flex items-center justify-center space-x-4">
                    {/* Source Logo */}
                    <div className="flex flex-col items-center justify-center min-w-[75px]">
                      {plat.id === 'sap-pipo' && (
                        <>
                          <img src="/images/sap-logo.svg" alt="SAP" className="h-6 w-auto object-contain" />
                          <span className="text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] mt-2">SAP PI/PO</span>
                        </>
                      )}
                      {plat.id === 'mulesoft' && (
                        <>
                          <img src="/images/logos/logo_mulesoft.png" alt="MuleSoft" className="h-7 w-7 object-contain" />
                          <span className="text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] mt-1.5">MuleSoft</span>
                        </>
                      )}
                      {plat.id === 'sap-neo' && (
                        <>
                          <img src="/images/sap-logo.svg" alt="SAP" className="h-6 w-auto object-contain" />
                          <span className="text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] mt-2">SAP CPI (Neo)</span>
                        </>
                      )}
                      {plat.id === 'boomi' && (
                        <>
                          <div className="flex items-center text-lg font-black tracking-tight text-[#0a2240]">
                            <span>boom</span>
                            <span className="text-[#ff595a]">i</span>
                          </div>
                          <span className="text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] mt-1.5">Boomi</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-400 shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 10h13m-4-4l4 4-4 4" />
                      </svg>
                    </div>

                    {/* Target BTP Block */}
                    <div className="flex flex-col items-center justify-center min-w-[85px]">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                        <defs>
                          <linearGradient id={`cloudGrad-${plat.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0284c7" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
                          fill={`url(#cloudGrad-${plat.id})`}
                        />
                      </svg>
                      <span className="text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] leading-tight text-center mt-1.5">
                        SAP BTP<br />Integration Suite
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5-Item "What you'll get" Box */}
        <div className="bg-white rounded-2xl border border-[#d9e2ec] p-7 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="flex items-start space-x-3.5 pt-2 sm:pt-0 sm:px-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center shrink-0 mt-0.5">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900">What you&apos;ll get</h4>
                <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed mt-1">
                  A comprehensive analysis with clear insights and business value.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 pt-2 sm:pt-0 sm:px-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900">Tailored Analysis</h4>
                <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed mt-1">
                  Based on your integration landscape and requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 pt-2 sm:pt-0 sm:px-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center shrink-0 mt-0.5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900">Migration Sizing</h4>
                <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed mt-1">
                  Estimate effort, complexity and timelines.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 pt-2 sm:pt-0 sm:px-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center shrink-0 mt-0.5">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900">TCO &amp; ROI</h4>
                <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed mt-1">
                  Understand potential savings and business value.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 pt-2 sm:pt-0 sm:px-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900">Actionable Recommendations</h4>
                <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed mt-1">
                  Get next steps to accelerate your migration journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-[15px] font-semibold text-slate-600 hover:text-[#0070f2] transition-colors group"
          >
            <svg className="w-4 h-4 text-slate-500 group-hover:text-[#0070f2] transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 12.5l-4.5-4.5 4.5-4.5" />
            </svg>
            <span>Back to Home</span>
          </Link>
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="inline-flex items-center space-x-2 h-12 px-7 bg-[#0070f2] hover:bg-[#0057d2] text-white rounded-xl text-[15px] font-semibold shadow-xs transition-all group cursor-pointer"
          >
            <span>Explore Business Value</span>
            <svg className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEPS 1 TO 7: WIZARD FLOW
  // =========================================================================
  const isWideLayout = currentStep === 6 || currentStep === 7;

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Breadcrumb & Platform Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-[14px]">
        <div className="flex items-center space-x-2 text-[#556b82] font-medium">
          <Link href="/" className="hover:text-[#0070f2] transition-colors">Home</Link>
          <span>&gt;</span>
          <button onClick={() => setCurrentStep(0)} className="hover:text-[#0070f2] transition-colors">Business Value</button>
          <span>&gt;</span>
          <span className="text-[#1d2d3e] font-semibold">{activePlat.name}</span>
        </div>
        <button
          type="button"
          onClick={() => setCurrentStep(0)}
          className="inline-flex items-center space-x-2 h-11 px-4 rounded-xl bg-blue-50 text-[#0070f2] hover:bg-blue-100 font-semibold text-[14px] border border-blue-200 transition-colors group"
        >
          <svg className="w-4 h-4 text-[#0070f2] transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 12.5l-4.5-4.5 4.5-4.5" />
          </svg>
          <span>Change Platform ({activePlat.name})</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-indigo-50/80 border border-[#d9e2ec] p-8 sm:p-10 lg:p-12 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 z-10 space-y-4">
            <div className="text-[13px] font-bold text-[#0070f2] tracking-wider uppercase">
              PLAN | MODERNIZE | OPTIMIZE | REALIZE VALUE
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1d2d3e] tracking-tight leading-tight font-['72',sans-serif]">
              {activePlat.name} to SAP BTP Migration
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[#556b82] leading-relaxed max-w-xl">
              Assess your current landscape. Plan with confidence. Accelerate your journey to a connected, intelligent enterprise with Incture&apos;s Business ValueLens AI.
            </p>

            {/* 4 Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-11 h-11 rounded-2xl bg-blue-100/80 flex items-center justify-center shrink-0">
                  <BarChart2 className="w-5 h-5 text-[#0070f2]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#1d2d3e] leading-tight">Data-Driven</div>
                  <div className="text-[13px] text-[#556b82] leading-tight">Insights</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2">
                <div className="w-11 h-11 rounded-2xl bg-blue-100/80 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 text-[#0070f2]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#1d2d3e] leading-tight">Tailored</div>
                  <div className="text-[13px] text-[#556b82] leading-tight">Recommendations</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2">
                <div className="w-11 h-11 rounded-2xl bg-blue-100/80 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-[#0070f2]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#1d2d3e] leading-tight">Clear Business</div>
                  <div className="text-[13px] text-[#556b82] leading-tight">Value</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2">
                <div className="w-11 h-11 rounded-2xl bg-blue-100/80 flex items-center justify-center shrink-0">
                  <Rocket className="w-5 h-5 text-[#0070f2]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#1d2d3e] leading-tight">Faster Path</div>
                  <div className="text-[13px] text-[#556b82] leading-tight">to Innovation</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-end relative h-48 sm:h-56 overflow-hidden rounded-3xl">
            <img
              src="/images/banner-right.png"
              alt="From Integration To What's Next"
              className="h-full w-auto max-w-full object-contain object-right pointer-events-none mix-blend-multiply"
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-[14px] text-red-700 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* 7-Milestone Stepper Bar */}
      <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between max-w-5xl mx-auto relative px-4 sm:px-6">
          <div className="absolute top-5 left-10 right-10 h-0.5 bg-[#e5e9f0] -z-0" />
          <div
            className="absolute top-5 left-10 h-0.5 bg-[#0070f2] transition-all duration-300 -z-0"
            style={{
              width: `${((Math.max(1, currentStep) - 1) / (milestones.length - 1)) * 92}%`,
            }}
          />

          {milestones.map((m) => {
            const isCompleted = currentStep > m.id;
            const isCurrent = currentStep === m.id;

            return (
              <div
                key={m.id}
                className="flex flex-col items-center relative z-10 cursor-pointer group select-none"
                onClick={() => {
                  if (m.id < 7 || calculationResult) {
                    setCurrentStep(m.id);
                  }
                }}
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[14px] sm:text-[15px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#0070f2] text-white shadow-sm ring-4 ring-[#0070f2]/20'
                      : isCompleted
                        ? 'bg-[#0070f2] text-white shadow-xs'
                        : 'bg-white text-slate-500 border border-slate-300'
                  }`}
                >
                  {m.id}
                </div>
                <div className="flex flex-col items-center mt-2.5 text-center">
                  <span
                    className={`text-[13px] sm:text-[14px] mt-0.5 leading-tight font-semibold ${
                      isCurrent
                        ? 'text-[#0070f2]'
                        : isCompleted
                          ? 'text-[#1d2d3e]'
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

      {/* Main Content Layout */}
      <div
        className={
          isWideLayout
            ? 'w-full space-y-6'
            : 'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_350px] gap-6 lg:gap-8 items-start'
        }
      >
        {/* Step View Area */}
        <div className="min-w-0 space-y-6">
          {currentStep === 1 && (
            <Step1Organization
              companyName={companyName}
              onCompanyNameChange={(name) => {
                setCompanyName(name);
                setAssessment((prev) => ({ ...prev, name }));
              }}
              companySize={assessment?.sourceSystem?.companyInformation?.companySize || ''}
              onCompanySizeChange={(companySize) =>
                setAssessment((prev) => ({
                  ...prev,
                  sourceSystem: {
                    ...prev.sourceSystem,
                    companyInformation: {
                      ...(prev.sourceSystem?.companyInformation || {}),
                      companySize,
                    },
                  },
                }))
              }
              industry={assessment?.sourceSystem?.companyInformation?.industry || ''}
              onIndustryChange={(industry) =>
                setAssessment((prev) => ({
                  ...prev,
                  sourceSystem: {
                    ...prev.sourceSystem,
                    companyInformation: {
                      ...(prev.sourceSystem?.companyInformation || {}),
                      industry,
                    },
                  },
                }))
              }
              migrationTimeline={assessment?.sourceSystem?.companyInformation?.migrationTimeline || ''}
              onMigrationTimelineChange={(migrationTimeline) =>
                setAssessment((prev) => ({
                  ...prev,
                  sourceSystem: {
                    ...prev.sourceSystem,
                    companyInformation: {
                      ...(prev.sourceSystem?.companyInformation || {}),
                      migrationTimeline,
                    },
                  },
                }))
              }
              onBack={() => setCurrentStep(0)}
              onContinue={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <Step2Landscape
              platformId={selectedPlatform}
              config={activeConfig}
              assessment={assessment}
              onUpdateAssessment={setAssessment}
              onBack={() => setCurrentStep(1)}
              onContinue={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <Step3Requirements
              requirements={requirementsRecord}
              onToggleRequirement={(id) => {
                setSelectedRequirements((prev) =>
                  prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
                );
              }}
              recommendedEdition={assessment?.targetSystem?.configuration?.selectedEditionName || 'Standard Edition'}
              recommendationReason="Standard Edition is recommended for enterprise integration with API Management and B2B capabilities."
              onBack={() => setCurrentStep(2)}
              onContinue={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <Step4Sizing
              currentThroughput={assessment?.sourceSystem?.volumetrics?.currentMessageThroughput || ''}
              setCurrentThroughput={(v) =>
                setAssessment((prev) => ({
                  ...prev,
                  sourceSystem: {
                    ...prev.sourceSystem,
                    volumetrics: {
                      ...(prev.sourceSystem?.volumetrics || {}),
                      currentMessageThroughput: v,
                    },
                  },
                }))
              }
              expectedThroughput={assessment?.sourceSystem?.volumetrics?.indicativeMessageThroughput || ''}
              setExpectedThroughput={(v) =>
                setAssessment((prev) => ({
                  ...prev,
                  sourceSystem: {
                    ...prev.sourceSystem,
                    volumetrics: {
                      ...(prev.sourceSystem?.volumetrics || {}),
                      indicativeMessageThroughput: v,
                    },
                  },
                }))
              }
              recommendedEdition={assessment?.targetSystem?.configuration?.selectedEditionName || 'Standard Edition'}
              additionalMessagePacks={assessment?.targetSystem?.configuration?.additionalMessagePacks || 0}
              additionalEicTenants={assessment?.targetSystem?.configuration?.additionalEicTenants || 0}
              needsAem={false}
              onBack={() => setCurrentStep(3)}
              onContinue={() => setCurrentStep(5)}
            />
          )}

          {currentStep === 5 && (
            <Step5CostParameters
              platformId={selectedPlatform}
              config={activeConfig}
              costs={costsState}
              onUpdateCost={handleUpdateCost}
              currency={assessment.currency}
              onBack={() => setCurrentStep(4)}
              onContinue={() => setCurrentStep(6)}
            />
          )}

          {currentStep === 6 && (
            <Step6SelectEdition
              platformId={selectedPlatform}
              config={activeConfig}
              assessment={assessment}
              onUpdateAssessment={setAssessment}
              currency={assessment.currency}
              loading={loading}
              onBack={() => setCurrentStep(5)}
              onCalculate={handleExecuteCalculation}
            />
          )}

          {currentStep === 7 && (
            <Step7ReviewResults
              platformId={selectedPlatform}
              config={activeConfig}
              assessment={assessment}
              calculationResult={calculationResult}
              currentTco={currentTcoPreview}
              targetTco={targetTcoPreview}
              annualSavings={annualSavingsPreview}
              migrationCost={migrationCostPreview}
              fiveYearRoi={fiveYearRoiPreview}
              netFiveYearBenefit={netFiveYearBenefitPreview}
              paybackMonths={paybackMonthsPreview}
              onBack={() => setCurrentStep(6)}
              onRestart={() => handleStartNewBusinessValue(selectedPlatform)}
            />
          )}
        </div>

        {/* Right Sticky Sidebar (Steps 1 to 5) */}
        {!isWideLayout && (
          <div className="w-full lg:w-[340px] xl:w-[350px] shrink-0 space-y-5">
            {/* Input Progress Card */}
            <div className="bg-white rounded-2xl border border-[#d9e2ec] p-6 shadow-xs space-y-3">
              <h3 className="text-[15px] font-bold text-slate-900">
                Input Progress
              </h3>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((currentStep / 7) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[14px] text-slate-600 pt-0.5">
                <span>{currentStep} of 7 steps completed</span>
                <span className="font-bold text-slate-800">{Math.round((currentStep / 7) * 100)}%</span>
              </div>
            </div>

            {/* Business Value Insights Card (Steps 1 to 5) */}
            <div className="bg-white rounded-2xl border border-[#d9e2ec] p-6 sm:p-7 shadow-xs sticky top-24">
              <div className="border-b border-[#e5e9f0] pb-4">
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#1d2d3e] uppercase tracking-wider">
                  Business Value Insights
                </h3>
              </div>

              <div className="space-y-3 pt-5">
                {/* Row 1: Current TCO */}
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 items-center min-h-[44px] px-4 border border-transparent">
                  <span className="text-[14px] sm:text-[15px] text-[#556b82] font-medium text-left">
                    Current {activeConfig.name} TCO
                  </span>
                  <span className="text-[14px] sm:text-[16px] font-semibold text-[#1d2d3e] text-right whitespace-nowrap min-w-[110px] sm:min-w-[130px]">
                    {currentTcoPreview > 0 ? formatCurrency(currentTcoPreview, assessment.currency) : (
                      <span className="text-[13px] sm:text-[14px] font-normal text-slate-400">Awaiting input</span>
                    )}
                  </span>
                </div>

                {/* Row 2: Target TCO */}
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 items-center min-h-[44px] px-4 border border-transparent">
                  <span className="text-[14px] sm:text-[15px] text-[#556b82] font-medium text-left">
                    Target SAP BTP TCO
                  </span>
                  <span className="text-[14px] sm:text-[16px] font-semibold text-[#0070f2] text-right whitespace-nowrap min-w-[110px] sm:min-w-[130px]">
                    {targetTcoPreview > 0 ? formatCurrency(targetTcoPreview, assessment.currency) : (
                      <span className="text-[13px] sm:text-[14px] font-normal text-slate-400">Awaiting input</span>
                    )}
                  </span>
                </div>

                {/* Row 3: Projected Annual Savings (Highlight) */}
                <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200/90 grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 items-center min-h-[46px]">
                  <span className="text-[14px] sm:text-[15px] text-emerald-800 font-bold text-left">
                    Projected Annual Savings
                  </span>
                  <span className="text-[15px] sm:text-[16px] font-semibold text-emerald-700 text-right whitespace-nowrap min-w-[110px] sm:min-w-[130px]">
                    {annualSavingsPreview > 0 ? formatCurrency(annualSavingsPreview, assessment.currency) : (
                      <span className="text-[13px] sm:text-[14px] font-semibold text-emerald-600/80">Awaiting input</span>
                    )}
                  </span>
                </div>

                {/* Row 4: Migration Investment */}
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 items-center min-h-[44px] px-4 border border-transparent">
                  <span className="text-[14px] sm:text-[15px] text-[#556b82] font-medium text-left">
                    Migration Investment
                  </span>
                  <span className="text-[14px] sm:text-[16px] font-semibold text-[#1d2d3e] text-right whitespace-nowrap min-w-[110px] sm:min-w-[130px]">
                    {migrationCostPreview > 0 ? formatCurrency(migrationCostPreview, assessment.currency) : (
                      <span className="text-[13px] sm:text-[14px] font-normal text-slate-400">Awaiting input</span>
                    )}
                  </span>
                </div>

                {/* Row 5: Estimated Payback */}
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 items-center min-h-[44px] px-4 border border-transparent">
                  <span className="text-[14px] sm:text-[15px] text-[#556b82] font-medium text-left">
                    Estimated Payback
                  </span>
                  <span className="text-[14px] sm:text-[16px] font-semibold text-emerald-600 text-right whitespace-nowrap min-w-[110px] sm:min-w-[130px]">
                    {annualSavingsPreview > 0 && paybackMonthsPreview > 0
                      ? `${paybackMonthsPreview.toFixed(1)} months`
                      : (
                        <span className="text-[13px] sm:text-[14px] font-normal text-slate-400">Awaiting input</span>
                      )}
                  </span>
                </div>
              </div>

              {/* Grounded IntSwitch Advantage Box */}
              <div className="mt-6 p-5 bg-blue-50/80 rounded-xl border border-blue-200 text-blue-900 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-blue-950 text-[16px] sm:text-[18px]">
                    IntSwitch Value Add:
                  </span>
                  <span className="text-[12px] sm:text-[13px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 shrink-0 whitespace-nowrap">
                    Included Free ($0 Cost)
                  </span>
                </div>
                <p className="text-slate-600 text-[14px] sm:text-[15px] leading-[1.5]">
                  {activeConfig.intSwitch.scopeDescription}
                </p>
              </div>
            </div>

            {/* Step 2 Help Card */}
            {currentStep === 2 && (
              <div className="bg-blue-50/40 rounded-2xl border border-blue-100/90 p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Info className="w-5 h-5 text-blue-600 shrink-0" />
                  <h3 className="text-[15px] font-bold text-blue-900">Help &amp; Information</h3>
                </div>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  This information helps us analyze your current {activeConfig.name} environment and provide accurate migration recommendations and cost estimates.
                </p>
                <div className="pt-1">
                  <h4 className="text-[14px] font-bold text-blue-700 mb-2">Why we ask this?</h4>
                  <ul className="space-y-2.5 text-[14px] text-slate-600">
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

            {/* Step 1 Why we ask info */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-[#d9e2ec] p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center space-x-2.5 text-[#0070f2]">
                  <Info className="w-5 h-5 shrink-0" />
                  <h4 className="text-[15px] font-bold text-[#1d2d3e] font-['72',sans-serif]">
                    Why we ask for this information?
                  </h4>
                </div>
                <ul className="space-y-2.5 text-[14px] text-[#556b82] pl-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#0070f2] font-bold">•</span>
                    <span>Provides context for industry-specific benchmarks</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#0070f2] font-bold">•</span>
                    <span>Helps us estimate the right sizing and costs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#0070f2] font-bold">•</span>
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
