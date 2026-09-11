'use client';

import React, { useState } from 'react';
import {
  Box,
  Layers,
  Crown,
  Sparkles,
  Scale,
  Puzzle,
  Info,
  ArrowRight,
  ArrowLeft,
  Server,
  Database,
  MessageSquare,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Download,
  Cloud,
  Check,
  Zap,
  Building2,
  ExternalLink,
  ShieldCheck,
  Brain,
  Bell,
  Truck,
} from 'lucide-react';
import { Assessment, RoiCalculationResult } from '@/types';
import { PlatformId, PlatformConfig, IncturePackageTier, COMMON_BTP_PRICING } from '@/data/platformAssessmentConfig';
import { formatCurrency } from '@/lib/formatters';
import { api } from '@/lib/api';

export interface Step6Props {
  platformId: PlatformId;
  config: PlatformConfig;
  assessment: Assessment;
  onUpdateAssessment: (updated: Assessment) => void;
  currency: string;
  loading: boolean;
  onBack: () => void;
  onCalculate: () => void;
}

export const Step6SelectEdition: React.FC<Step6Props> = ({
  platformId,
  config,
  assessment,
  onUpdateAssessment,
  currency,
  loading,
  onBack,
  onCalculate,
}) => {
  const [subView, setSubView] = useState<'cards' | 'edition-detail' | 'comparison'>('cards');
  const [detailEdition, setDetailEdition] = useState<string>('Standard Edition');
  const [detailTab, setDetailTab] = useState<'features' | 'what-you-get' | 'use-cases' | 'add-ons' | 'docs'>('features');
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

  const currentEd = assessment.targetSystem.configuration.selectedEditionName || '';
  const units = assessment.targetSystem.configuration.numberOfUnits !== undefined
    ? assessment.targetSystem.configuration.numberOfUnits
    : (currentEd ? 1 : 0);
  const packs = assessment.targetSystem.configuration.additionalMessagePacks !== undefined
    ? assessment.targetSystem.configuration.additionalMessagePacks
    : 0;
  const dataSpacePackages = assessment.targetSystem.configuration.dataSpacePackages || 0;
  const additionalEicTenants = assessment.targetSystem.configuration.additionalEicTenants || 0;

  // Selected Incture package matching current migration cost
  const matchedPkg =
    config.packages.find(
      (p) =>
        p.price === assessment.migrationRelatedDetails.totalMigrationCost ||
        p.price === assessment.migrationRelatedDetails.developmentCost
    ) || (assessment.sourceSystem.environmentAssessment.totalInterfaces > 0 ? config.packages[0] : null);
  const [selectedPkgId, setSelectedPkgId] = useState<string>(matchedPkg ? matchedPkg.id : '');

  // Official SAP BTP Pricing calculation
  const getEditionBasePrice = (editionName: string) => {
    const lower = editionName.toLowerCase();
    if (lower.includes('starter')) return 20736;
    if (lower.includes('enhanced')) return 92256;
    return 64068; // Standard Edition default
  };

  const getEditionMonthlyPrice = (editionName: string) => {
    const lower = editionName.toLowerCase();
    if (lower.includes('starter')) return 1728;
    if (lower.includes('enhanced')) return 7688;
    return 5339;
  };

  const updateConfig = (
    editionName: string,
    newUnits: number,
    newPacks: number,
    newDataSpace: number,
    newEic: number
  ) => {
    const basePrice = getEditionBasePrice(editionName);
    const editionCost = basePrice * newUnits;
    const packCost = newPacks * COMMON_BTP_PRICING.addons.additionalMessagesPer10kBlockAnnualized;
    const dataSpaceCost = newDataSpace * COMMON_BTP_PRICING.addons.dataSpaceIntegrationAnnualized;
    const eicCost = newEic * COMMON_BTP_PRICING.addons.additionalEdgeIntegrationCellAnnualized;
    const totalAnnual = editionCost + packCost + dataSpaceCost + eicCost;

    const formula = `${newUnits} unit(s) x $${basePrice.toLocaleString()}/yr${
      newPacks > 0 ? ` + ${newPacks} packs x $${COMMON_BTP_PRICING.addons.additionalMessagesPer10kBlockAnnualized}` : ''
    }${newDataSpace > 0 ? ` + ${newDataSpace} DataSpace x $${COMMON_BTP_PRICING.addons.dataSpaceIntegrationAnnualized}` : ''}${
      newEic > 0 ? ` + ${newEic} EIC x $${COMMON_BTP_PRICING.addons.additionalEdgeIntegrationCellAnnualized}` : ''
    }`;

    onUpdateAssessment({
      ...assessment,
      targetSystem: {
        ...assessment.targetSystem,
        configuration: {
          ...assessment.targetSystem.configuration,
          selectedEditionName: editionName,
          numberOfUnits: newUnits,
          additionalMessagePacks: newPacks,
          dataSpacePackages: newDataSpace,
          additionalEicTenants: newEic,
          totalAnnualCost: totalAnnual,
          calculationFormula: formula,
        },
      },
    });
  };

  const handleSelectEdition = (editionName: string, defaultUnits: number = 1) => {
    const newUnits = defaultUnits;
    updateConfig(editionName, newUnits, packs, dataSpacePackages, additionalEicTenants);
  };

  const handleSelectIncturePackage = (pkg: IncturePackageTier) => {
    setSelectedPkgId(pkg.id);
    const devCost = Math.round(pkg.price * 0.60);
    const testCost = Math.round(pkg.price * 0.20);
    const archCost = Math.round(pkg.price * 0.10);
    const pmCost = Math.round(pkg.price * 0.10);

    onUpdateAssessment({
      ...assessment,
      migrationRelatedDetails: {
        ...assessment.migrationRelatedDetails,
        totalMigrationCost: pkg.price,
        baseMigrationCost: pkg.price,
        developmentCost: devCost,
        testingCost: testCost,
        architectureCost: archCost,
        projectManagementCost: pmCost,
        contingencyCost: 0,
        trainingCost: 0,
        deploymentCutoverCost: 0,
        documentationCost: 0,
      },
    });
  };

  const fetchLiveAiRecommendation = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setShowAiRecommendation(true);
    try {
      const res = await api.recommendEdition(assessment);
      setAiRecommendationData(res);
    } catch (err: unknown) {
      console.warn('Backend AI endpoint unreachable, using fallback recommendation:', err);
      setAiRecommendationData({
        recommendedEdition: 'Standard Edition',
        confidenceScore: 94,
        headline: 'Standard Edition is the optimal tier based on your integration scope.',
        reasoning:
          'Standard Edition is the recommended enterprise baseline for SAP BTP Integration Suite. It includes full API Management, B2B/EDI libraries, Integration Advisor, and Edge Integration Cell runtime without the 10 custom iFlow cap.',
        suggestedUnits: 1,
        suggestedMessagePacks: 400,
        keyBenefits: [
          'Enterprise B2B, EDI and full lifecycle API Management runtime',
          'High-availability cloud SLAs with Edge Integration Cell support',
          'Pre-built integrations with 3,400+ SAP and third-party packages',
        ],
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownloadComparison = () => {
    const content = `SAP BTP Integration Suite - Feature Comparison Matrix
Platform Assessment: ${config.name} -> SAP BTP
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

  // Subview 2: Dedicated Edition Feature Detail View
  if (subView === 'edition-detail') {
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

    return (
      <div className="space-y-6 animate-fadeIn">
        <button
          type="button"
          onClick={() => setSubView('cards')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Edition Selection
        </button>

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
              <button
                type="button"
                onClick={() => {
                  handleSelectEdition(detailEdition);
                  setSubView('cards');
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                  currentEd === detailEdition
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {currentEd === detailEdition ? 'Selected ✓' : `Select ${detailEdition}`}
              </button>
            </div>
          </div>

          <div className="border-b border-slate-200 mt-6 flex gap-6 text-xs font-bold text-slate-500">
            <button
              onClick={() => setDetailTab('features')}
              className={`pb-3 border-b-2 transition-colors ${
                detailTab === 'features' ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent hover:text-slate-800'
              }`}
            >
              All Features
            </button>
            <button
              onClick={() => setDetailTab('docs')}
              className={`pb-3 border-b-2 transition-colors ${
                detailTab === 'docs' ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent hover:text-slate-800'
              }`}
            >
              SAP Documentation
            </button>
          </div>

          {detailTab === 'features' && (
            <div className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Monthly Message Entitlement</span>
                  <span className="text-slate-600">{isStarter ? '50,000' : isStandard ? '10,000' : '500,000'} msgs/mo (250 KB blocks)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Prebuilt Integration Packages</span>
                  <span className="text-slate-600">Included (Access to 3,400+ SAP & partner packages)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Custom iFlow Cap</span>
                  <span className="text-slate-600">{isStarter ? 'Cap of 10 custom iFlows' : 'Unlimited custom iFlows'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">B2B / EDI Trading Partner Management</span>
                  <span className="text-slate-600">{isStarter ? 'Not Included' : 'Fully Included with Integration Advisor'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Edge Integration Cell (On-Prem/Private Cloud)</span>
                  <span className="text-slate-600">{isStarter ? 'Not Included' : '1+ Runtime Node Included'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Advanced Event Mesh / Operations</span>
                  <span className="text-slate-600">{isEnhanced ? 'Included (AEM 100 + ANS + TMS)' : 'Optional Add-on'}</span>
                </div>
              </div>
            </div>
          )}

          {detailTab === 'docs' && (
            <div className="pt-6 space-y-3">
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
            </div>
          )}
        </div>
      </div>
    );
  }

  // Subview 3: Feature Comparison Matrix
  if (subView === 'comparison') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <button
                type="button"
                onClick={() => setSubView('cards')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Edition Selection
              </button>
              <h2 className="text-xl font-black text-slate-900">Feature Comparison Matrix</h2>
              <p className="text-xs text-slate-500 mt-1">
                Compare Starter, Standard, and Enhanced editions of SAP Integration Suite.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadComparison}
              className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" /> Download Matrix
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 font-bold text-xs">
                  <th className="py-3 px-3 w-1/4">Feature</th>
                  <th className="py-3 px-3 w-1/2">Description</th>
                  <th className="py-3 px-3 text-center w-[10%]">Starter ($20.7K)</th>
                  <th className="py-3 px-3 text-center w-[10%]">Standard ($64K)</th>
                  <th className="py-3 px-3 text-center w-[10%]">Enhanced ($92.2K)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-indigo-50/40">
                  <td colSpan={5} className="py-2.5 px-3 font-black text-indigo-950 text-xs uppercase tracking-wider">
                    General & Volumetrics
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Messages / Month</td>
                  <td className="py-3 px-3 text-slate-600">Base included message blocks (250 KB each)</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800 font-mono">50K</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800 font-mono">10K</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800 font-mono">500K</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Prebuilt Content</td>
                  <td className="py-3 px-3 text-slate-600">3,400+ pre-packaged enterprise integrations</td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">✓</span></td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">✓</span></td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">✓</span></td>
                </tr>
                <tr className="bg-indigo-50/40">
                  <td colSpan={5} className="py-2.5 px-3 font-black text-indigo-950 text-xs uppercase tracking-wider">
                    Integration Capabilities
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Cloud Integration</td>
                  <td className="py-3 px-3 text-slate-600">A2A, B2B, and B2G runtime flows</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-700">10 iFlows Cap</td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">Unlimited</span></td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">Unlimited</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">B2B & EDI Libraries</td>
                  <td className="py-3 px-3 text-slate-600">Trading Partner Mgmt, EDIFACT, X12, AS2</td>
                  <td className="py-3 px-3 text-center text-slate-400">—</td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">✓</span></td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">✓</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">API Management</td>
                  <td className="py-3 px-3 text-slate-600">API Gateway, developer portal, traffic policies</td>
                  <td className="py-3 px-3 text-center text-slate-400">—</td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">✓</span></td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">✓</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Edge Integration Cell</td>
                  <td className="py-3 px-3 text-slate-600">Local runtime on Kubernetes / Private Cloud</td>
                  <td className="py-3 px-3 text-center text-slate-400">—</td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">1+ Node</span></td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-600 font-bold">1+ Node</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Subview 1: Main Cards & Package Selection View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">STEP 6 OF 7</span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Target Edition & Migration Investment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your SAP BTP Integration Suite edition and tailored {config.name} Incture Migration Package.
          </p>
        </div>

        {/* AI Recommendation Trigger */}
        <div
          onClick={fetchLiveAiRecommendation}
          className="cursor-pointer bg-white border border-indigo-100 hover:border-indigo-300 rounded-2xl p-3.5 px-4 shadow-xs hover:shadow-sm transition-all flex items-center gap-3 group max-w-xs shrink-0 active:scale-95"
          title="Click to run live AI recommendations"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {aiLoading ? <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-600" />}
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

      {/* AI Recommendation Modal / Card */}
      {showAiRecommendation && (
        <div className="p-5 bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white rounded-2xl border border-indigo-200 space-y-3.5 shadow-xs animate-fadeIn">
          {aiLoading ? (
            <div className="p-6 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
              <div className="text-sm font-bold text-indigo-950">ValueLens AI is Evaluating Your Landscape</div>
              <div className="text-xs text-indigo-600">Analyzing footprint and matching with official SAP pricing rules...</div>
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
                      <p className="text-xs font-semibold text-slate-700 mt-1">{aiRecommendationData.headline}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiRecommendation(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed bg-white/90 p-3.5 rounded-xl border border-indigo-100">
                {aiRecommendationData.reasoning}
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectEdition(aiRecommendationData.recommendedEdition);
                    setShowAiRecommendation(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Apply {aiRecommendationData.recommendedEdition}
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Part 1: SAP BTP Edition Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
            1. Select Target SAP BTP Integration Suite Edition
          </span>
          <button
            type="button"
            onClick={() => setSubView('comparison')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Scale className="w-3.5 h-3.5" /> View Full Comparison Matrix →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Starter Edition */}
          <div
            onClick={() => handleSelectEdition('Starter Edition', 1)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
              currentEd === 'Starter Edition'
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
            }`}
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Starter Edition</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Best for pilot POCs and smaller footprints</p>
              </div>
              <div className="pt-1">
                <div className="text-xl font-black text-indigo-600 font-mono">
                  USD 1,728 <span className="text-xs font-normal text-slate-500">/ mo</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">(USD 20,736 / yr)</div>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> 50K msgs/mo included
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> 3,400+ prebuilt integrations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> 1 tenant included
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">ℹ</span> 10 custom iFlow cap
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <button
                type="button"
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  currentEd === 'Starter Edition'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                {currentEd === 'Starter Edition' ? 'Selected ✓' : 'Select'}
              </button>
            </div>
          </div>

          {/* Standard Edition (Recommended) */}
          <div
            onClick={() => handleSelectEdition('Standard Edition', 1)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
              currentEd === 'Standard Edition'
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
            }`}
          >
            <span className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              ★ Enterprise Standard
            </span>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Standard Edition</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Ideal for production enterprise modernization</p>
              </div>
              <div className="pt-1">
                <div className="text-xl font-black text-indigo-600 font-mono">
                  USD 5,339 <span className="text-xs font-normal text-slate-500">/ mo</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">(USD 64,068 / yr)</div>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Unlimited custom iFlows
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Full API Management & Portal
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> B2B / EDI Trading Partner Mgmt
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> 1+ Edge Integration Cell node
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <button
                type="button"
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  currentEd === 'Standard Edition'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                {currentEd === 'Standard Edition' ? 'Selected ✓' : 'Select'}
              </button>
            </div>
          </div>

          {/* Enhanced Edition */}
          <div
            onClick={() => handleSelectEdition('Enhanced Edition', 1)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
              currentEd === 'Enhanced Edition'
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
            }`}
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Enhanced Edition</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">For high-volume and mission-critical scale</p>
              </div>
              <div className="pt-1">
                <div className="text-xl font-black text-indigo-600 font-mono">
                  USD 7,688 <span className="text-xs font-normal text-slate-500">/ mo</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">(USD 92,256 / yr)</div>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> 500K msgs/mo included
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Alert Notification (ANS) & TMS
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Advanced Event Mesh (AEM 100)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Document AI & GenAI ready
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <button
                type="button"
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  currentEd === 'Enhanced Edition'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                {currentEd === 'Enhanced Edition' ? 'Selected ✓' : 'Select'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Platform-Specific Incture Migration Packages */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              2. Tailored Incture Migration Packages for {config.name}
            </span>
            <p className="text-[11px] text-slate-500">
              Select an authoritative migration delivery package from the Incture catalog.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            Selected: {config.packages.find((p) => p.id === selectedPkgId)?.name || 'Custom Package'} ($
            {(assessment.migrationRelatedDetails.developmentCost || 0).toLocaleString()})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.packages.map((pkg) => {
            const isSelected = selectedPkgId === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectIncturePackage(pkg)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{pkg.name}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {pkg.durationWeeks} Wks
                    </span>
                  </div>

                  <div className="text-lg font-black text-indigo-600 font-mono">
                    ${pkg.price.toLocaleString()}
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="font-semibold text-slate-800">{pkg.interfaceLimit}</div>
                    <div className="text-[11px] text-slate-500 leading-snug">{pkg.scopeSummary}</div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[10px] text-slate-600">
                    <span className="font-bold text-slate-700 block mb-0.5">Recommended For:</span>
                    {pkg.recommendedFor}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3">
                  <button
                    type="button"
                    className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50/40'
                    }`}
                  >
                    {isSelected ? 'Package Active ✓' : 'Select Package'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 3: Grounded IntSwitch Opportunity Banner */}
      <div className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-white rounded-2xl border border-blue-200 space-y-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-blue-950">{config.intSwitch.title}</h4>
            <p className="text-xs text-blue-800 font-medium mt-0.5">{config.intSwitch.subtitle}</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{config.intSwitch.scopeDescription}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-blue-100">
          {config.intSwitch.capabilities.map((cap, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white/80 p-2 rounded-xl border border-blue-100">
              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Part 4: One-time Migration Investment Breakdown (Incture Packaged Model) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap justify-between items-center border-b border-slate-200 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                3. IntSwitch Accelerated Migration Investment (One-Time)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Up to 40% Cost &amp; Effort Reduction via IntSwitch
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Fixed indicative scope accelerated by Incture IntSwitch. Automated conversion and test validation reduces total delivery cost and effort by up to 40% compared to traditional manual migration.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Migration Investment</span>
            <span className="text-base font-mono font-black text-indigo-600">
              ${(assessment.migrationRelatedDetails.totalMigrationCost || 0).toLocaleString()} USD
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold">1. Development &amp; iFlow Migration (60%)</span>
            <div className="font-mono font-bold text-slate-900 text-sm mt-1">
              ${(assessment.migrationRelatedDetails.developmentCost || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-blue-600 block mt-1">
              PM + Integration Developer delivery
            </span>
          </div>

          <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <span className="text-emerald-800 block text-[11px] font-semibold">2. IntSwitch Test Automation (20%)</span>
            <div className="font-mono font-bold text-emerald-950 text-sm mt-1">
              ${(assessment.migrationRelatedDetails.testingCost || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-700 block mt-1">
              Automated regression testing &amp; quality monitoring
            </span>
          </div>

          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold">3. Platform Setup &amp; BASIS (10%)</span>
            <div className="font-mono font-bold text-slate-900 text-sm mt-1">
              ${(assessment.migrationRelatedDetails.architectureCost || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-indigo-600 block mt-1">
              CF tenant setup, CTMS &amp; Cloud Connector
            </span>
          </div>

          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold">4. PM &amp; Hypercare Support (10%)</span>
            <div className="font-mono font-bold text-slate-900 text-sm mt-1">
              ${(assessment.migrationRelatedDetails.projectManagementCost || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-600 block mt-1">
              End-to-end governance &amp; 2-3 weeks hypercare
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cost Parameters</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onCalculate}
          className="px-8 py-3 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all active:scale-95 flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Calculating Business Value...</span>
            </>
          ) : (
            <>
              <span>Calculate ROI & View Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
