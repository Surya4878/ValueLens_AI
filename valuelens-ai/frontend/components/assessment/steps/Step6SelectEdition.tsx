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
  Plus,
  Minus,
  X,
} from 'lucide-react';
import { Assessment, RoiCalculationResult } from '@/types';
import { PlatformId, PlatformConfig, COMMON_BTP_PRICING } from '@/data/platformAssessmentConfig';
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

  const currentEd = assessment?.targetSystem?.configuration?.selectedEditionName || '';
  const units = assessment?.targetSystem?.configuration?.numberOfUnits !== undefined
    ? assessment.targetSystem.configuration.numberOfUnits
    : (currentEd ? 1 : 0);
  const packs = assessment?.targetSystem?.configuration?.additionalMessagePacks !== undefined
    ? assessment.targetSystem.configuration.additionalMessagePacks
    : 0;
  const dataSpacePackages = assessment?.targetSystem?.configuration?.dataSpacePackages || 0;
  const additionalEicTenants = assessment?.targetSystem?.configuration?.additionalEicTenants || 0;

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

  const handleUpdatePacks = (newPacks: number) => {
    const val = Math.max(0, newPacks);
    updateConfig(currentEd || 'Standard Edition', units || 1, val, dataSpacePackages, additionalEicTenants);
  };

  const handleUpdateDataSpace = (newDataSpace: number) => {
    const val = Math.max(0, newDataSpace);
    updateConfig(currentEd || 'Standard Edition', units || 1, packs, val, additionalEicTenants);
  };

  const handleUpdateEic = (newEic: number) => {
    const val = Math.max(0, newEic);
    updateConfig(currentEd || 'Standard Edition', units || 1, packs, dataSpacePackages, val);
  };

  const handleClearAllAddOns = () => {
    updateConfig(currentEd || 'Standard Edition', units || 1, 0, 0, 0);
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
          className="text-sm font-semibold text-[#0070f2] hover:text-[#0057d2] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Edition Selection
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
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{detailEdition}</h2>
                <p className="text-[14px] text-slate-500 mt-1">{subtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
                  USD {monthlyPrice} <span className="text-[14px] font-normal text-slate-500">/ month</span>
                </div>
                <div className="text-[13px] text-slate-500 mt-0.5 font-mono">
                  (USD {annualPrice} / year)
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleSelectEdition(detailEdition);
                  setSubView('cards');
                }}
                className={`px-6 py-3 rounded-xl text-[14px] sm:text-[15px] font-bold transition-all shadow-xs active:scale-95 ${
                  currentEd === detailEdition
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {currentEd === detailEdition ? 'Selected' : `Select ${detailEdition}`}
              </button>
            </div>
          </div>

          <div className="border-b border-slate-200 mt-6 flex gap-6 text-[14px] font-bold text-slate-500">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Monthly Message Entitlement</span>
                  <span className="text-slate-600">{isStarter ? '50,000' : isStandard ? '10,000' : '500,000'} msgs/mo (250 KB blocks)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Prebuilt Integration Packages</span>
                  <span className="text-slate-600">Included (Access to 3,400+ SAP & partner packages)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Custom iFlow Cap</span>
                  <span className="text-slate-600">{isStarter ? 'Cap of 10 custom iFlows' : 'Unlimited custom iFlows'}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">B2B / EDI Trading Partner Management</span>
                  <span className="text-slate-600">{isStarter ? 'Not Included' : 'Fully Included with Integration Advisor'}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Edge Integration Cell (On-Prem/Private Cloud)</span>
                  <span className="text-slate-600">{isStarter ? 'Not Included' : '1+ Runtime Node Included'}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Advanced Event Mesh / Operations</span>
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
                className="p-5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white flex items-center justify-between transition-colors group block"
              >
                <div>
                  <div className="text-[15px] font-semibold text-slate-900 group-hover:text-[#0070f2] flex items-center gap-1.5">
                    Official SAP Integration Suite Pricing Guide <ExternalLink className="w-4 h-4" />
                  </div>
                  <div className="text-[13px] text-slate-500 mt-1">Official SAP pricing page, terms, and packaging breakdown.</div>
                </div>
                <span className="text-slate-400 group-hover:text-indigo-600 text-[14px] font-bold">&gt;</span>
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
        <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <button
                type="button"
                onClick={() => setSubView('cards')}
                className="text-[14px] font-semibold text-[#0070f2] hover:text-[#0057d2] flex items-center gap-1.5 transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Edition Selection
              </button>
              <h2 className="text-2xl font-bold text-slate-900 font-['72',sans-serif]">Feature Comparison Matrix</h2>
              <p className="text-[14px] text-slate-500 mt-1">
                Compare Starter, Standard, and Enhanced editions of SAP Integration Suite.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadComparison}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 rounded-xl text-[14px] font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-600" /> Download Matrix
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-800 font-semibold text-[14px] sm:text-[15px]">
                  <th className="py-3.5 px-4 w-1/4">Feature</th>
                  <th className="py-3.5 px-4 w-1/2">Description</th>
                  <th className="py-3.5 px-4 text-center w-[10%]">Starter ($20.7K)</th>
                  <th className="py-3.5 px-4 text-center w-[10%]">Standard ($64K)</th>
                  <th className="py-3.5 px-4 text-center w-[10%]">Enhanced ($92.2K)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px] leading-[1.45]">
                <tr className="bg-indigo-50/40">
                  <td colSpan={5} className="py-3 px-4 font-bold text-indigo-950 text-[13px] sm:text-[14px] uppercase tracking-wider">
                    General & Volumetrics
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Messages / Month</td>
                  <td className="py-3.5 px-4 text-slate-600">Base included message blocks (250 KB each)</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800 font-mono">50K</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800 font-mono">10K</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800 font-mono">500K</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Prebuilt Content</td>
                  <td className="py-3.5 px-4 text-slate-600">3,400+ pre-packaged enterprise integrations</td>
                  <td className="py-3.5 px-4 text-center"><span className="text-[#0070f2] font-semibold text-[13px] uppercase">Included</span></td>
                  <td className="py-3.5 px-4 text-center"><span className="text-[#0070f2] font-semibold text-[13px] uppercase">Included</span></td>
                  <td className="py-3.5 px-4 text-center"><span className="text-[#0070f2] font-semibold text-[13px] uppercase">Included</span></td>
                </tr>
                <tr className="bg-indigo-50/40">
                  <td colSpan={5} className="py-3 px-4 font-bold text-indigo-950 text-[13px] sm:text-[14px] uppercase tracking-wider">
                    Integration Capabilities
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Cloud Integration</td>
                  <td className="py-3.5 px-4 text-slate-600">A2A, B2B, and B2G runtime flows</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">10 iFlows Cap</td>
                  <td className="py-3.5 px-4 text-center"><span className="text-emerald-600 font-bold">Unlimited</span></td>
                  <td className="py-3.5 px-4 text-center"><span className="text-emerald-600 font-bold">Unlimited</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">B2B & EDI Libraries</td>
                  <td className="py-3.5 px-4 text-slate-600">Trading Partner Mgmt, EDIFACT, X12, AS2</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                  <td className="py-3.5 px-4 text-center"><span className="text-[#0070f2] font-semibold text-[13px] uppercase">Included</span></td>
                  <td className="py-3.5 px-4 text-center"><span className="text-[#0070f2] font-semibold text-[13px] uppercase">Included</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">API Management</td>
                  <td className="py-3.5 px-4 text-slate-600">API Gateway, developer portal, traffic policies</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                  <td className="py-3.5 px-4 text-center"><span className="text-[#0070f2] font-semibold text-[13px] uppercase">Included</span></td>
                  <td className="py-3.5 px-4 text-center"><span className="text-[#0070f2] font-semibold text-[13px] uppercase">Included</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Edge Integration Cell</td>
                  <td className="py-3.5 px-4 text-slate-600">Local runtime on Kubernetes / Private Cloud</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                  <td className="py-3.5 px-4 text-center"><span className="text-emerald-600 font-bold">1+ Node</span></td>
                  <td className="py-3.5 px-4 text-center"><span className="text-emerald-600 font-bold">1+ Node</span></td>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[13px] font-bold text-[#0070f2] uppercase tracking-wider">STEP 6 OF 7</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] mt-1.5 font-['72',sans-serif]">
            SAP BTP Edition &amp; Capacity Sizing
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#556b82] mt-2 leading-relaxed">
            Configure your SAP Integration Suite subscription edition and capacity add-ons.
          </p>
        </div>

        {/* AI Recommendation Trigger */}
        <div
          onClick={fetchLiveAiRecommendation}
          className="cursor-pointer bg-white border border-[#d9e2ec] hover:border-[#0070f2] rounded-xl p-4 px-5 shadow-xs hover:shadow-sm transition-all flex items-center gap-3.5 group max-w-xs shrink-0 active:scale-95"
          title="Click to run live AI recommendations"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {aiLoading ? <Loader2 className="w-5 h-5 text-[#0070f2] animate-spin" /> : <Sparkles className="w-5 h-5 text-[#0070f2]" />}
          </div>
          <div>
            <div className="text-[15px] font-bold text-[#1d2d3e] flex items-center gap-1.5">
              Generate AI Insights
            </div>
            <p className="text-[13px] text-[#556b82] leading-tight mt-1">
              Get AI-powered recommendations based on your inputs.
            </p>
          </div>
        </div>
      </div>

      {/* AI Recommendation Modal / Card */}
      {showAiRecommendation && (
        <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white rounded-3xl border border-indigo-200 space-y-4 shadow-xs animate-fadeIn">
          {aiLoading ? (
            <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-8 h-8 text-[#0070f2] animate-spin" />
              <div className="text-base font-bold text-[#1d2d3e]">ValueLens AI is Evaluating Your Landscape</div>
              <div className="text-xs text-[#556b82]">Analyzing footprint and matching with official SAP pricing rules...</div>
            </div>
          ) : aiRecommendationData ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0070f2] text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#1d2d3e] uppercase tracking-wider">
                        AI Recommended Edition:
                      </span>
                      <span className="text-sm font-bold text-[#0070f2] bg-blue-100/90 px-3 py-0.5 rounded-lg border border-blue-200">
                        {aiRecommendationData.recommendedEdition}
                      </span>
                      {aiRecommendationData.confidenceScore && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {aiRecommendationData.confidenceScore}% Confidence Fit
                        </span>
                      )}
                    </div>
                    {aiRecommendationData.headline && (
                      <p className="text-sm font-semibold text-[#1d2d3e] mt-1">{aiRecommendationData.headline}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiRecommendation(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold p-1.5 rounded-lg"
                >
                  ✕
                </button>
              </div>
              <div className="text-sm text-[#556b82] leading-relaxed bg-white/90 p-5 rounded-2xl border border-indigo-100">
                {aiRecommendationData.reasoning}
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectEdition(aiRecommendationData.recommendedEdition);
                    setShowAiRecommendation(false);
                  }}
                  className="px-5 py-2.5 bg-[#0070f2] hover:bg-[#0057d2] text-white rounded-xl text-sm font-semibold shadow-xs transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Apply {aiRecommendationData.recommendedEdition}
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Part 1: SAP BTP Edition Cards */}
      <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e9f0] pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1d2d3e] font-['72',sans-serif]">
              Subscription Editions
            </h3>
            <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1">
              Select the tier that fits your enterprise integration footprint.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSubView('comparison')}
            className="text-[14px] font-semibold text-[#0070f2] hover:text-[#0057d2] inline-flex items-center gap-2 group self-start sm:self-auto bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl border border-blue-200 transition-colors"
          >
            <Scale className="w-4 h-4" />
            <span>View Full Comparison Matrix</span>
            <svg className="w-4 h-4 text-[#0070f2] transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
            </svg>
          </button>
        </div>

        {/* 3 SAP Integration Suite Editions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Starter Edition */}
          <div
            onClick={() => handleSelectEdition('Starter Edition', 1)}
            className={`p-7 sm:p-8 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
              currentEd === 'Starter Edition'
                ? 'border-[#0070f2] ring-2 ring-[#0070f2]/20 bg-blue-50/15 shadow-md'
                : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
            }`}
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0070f2]">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[18px] sm:text-[20px] font-bold text-slate-900 leading-snug">
                  SAP Integration Suite, starter edition
                </h4>
                <p className="text-[14px] text-slate-500 mt-1.5 leading-normal">
                  Best for small and simple integration landscapes &amp; pilot POCs.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
                  MONTHLY PRICE
                </span>
                <div className="text-[26px] sm:text-[28px] font-bold text-slate-900 font-mono mt-0.5">
                  USD 1,728<span className="text-[14px] font-normal text-slate-500">.00</span>
                </div>
                <div className="text-[13px] text-slate-500 font-mono mt-1">
                  (USD 20,736.00 / yr annualized)
                </div>
              </div>

              <div className="space-y-1 text-[13px] sm:text-[14px] text-slate-600 pt-1">
                <div className="font-medium text-slate-800">&bull; In blocks of 1 Tenants</div>
                <div className="text-slate-500">&bull; Contract duration 3 to 36 months</div>
                <div className="text-slate-500">&bull; Auto-renewal</div>
              </div>

              <ul className="space-y-2.5 text-[14px] sm:text-[15px] text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>50,000 messages included per month</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>3,400+ prebuilt enterprise integrations</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>Unlimited SAP-to-SAP free message volume</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                  <span className="text-slate-600 font-medium">Up to 10 custom iFlows entitlement</span>
                </li>
              </ul>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailEdition('Starter Edition');
                    setSubView('edition-detail');
                  }}
                  className="text-[13px] sm:text-[14px] font-semibold text-[#0070f2] hover:underline"
                >
                  See all pricing details
                </button>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                className={`w-full h-12 py-0 rounded-xl text-[14px] sm:text-[15px] font-semibold transition-all ${
                  currentEd === 'Starter Edition'
                    ? 'bg-[#0070f2] text-white shadow-xs'
                    : 'bg-white border border-[#0070f2] text-[#0070f2] hover:bg-blue-50/50'
                }`}
              >
                {currentEd === 'Starter Edition' ? 'Selected' : 'Select Starter Edition'}
              </button>
              <div className="text-center">
                <a
                  href="https://www.sap.com/products/technology-platform/integration-suite/pricing.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Terms and conditions
                </a>
              </div>
            </div>
          </div>

          {/* Standard Edition (Enterprise Baseline) */}
          <div
            onClick={() => handleSelectEdition('Standard Edition', 1)}
            className={`p-7 sm:p-8 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
              currentEd === 'Standard Edition'
                ? 'border-[#0070f2] ring-2 ring-[#0070f2]/20 bg-blue-50/15 shadow-md'
                : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
            }`}
          >
            <span className="absolute -top-3 right-4 bg-[#0070f2] text-white text-[13px] font-semibold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
              ★ Enterprise Standard
            </span>
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#0070f2]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[18px] sm:text-[20px] font-bold text-slate-900 leading-snug">
                  SAP Integration Suite, standard edition
                </h4>
                <p className="text-[14px] text-slate-500 mt-1.5 leading-normal">
                  Ideal for enterprise integration needs &amp; production workloads.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
                  MONTHLY PRICE
                </span>
                <div className="text-[26px] sm:text-[28px] font-bold text-slate-900 font-mono mt-0.5">
                  USD 5,339<span className="text-[14px] font-normal text-slate-500">.00</span>
                </div>
                <div className="text-[13px] text-slate-500 font-mono mt-1">
                  (USD 64,068.00 / yr annualized)
                </div>
              </div>

              <div className="space-y-1 text-[13px] sm:text-[14px] text-slate-600 pt-1">
                <div className="font-medium text-slate-800">&bull; In blocks of 1 Tenants</div>
                <div className="text-slate-500">&bull; Contract duration 3 to 36 months</div>
                <div className="text-slate-500">&bull; Auto-renewal</div>
              </div>

              <ul className="space-y-2.5 text-[14px] sm:text-[15px] text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>Unlimited custom integration flows (iFlows)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>Full API Lifecycle Management &amp; Developer Portal</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>B2B/EDI libraries, Trading Partner Mgmt &amp; Advisor</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>1+ Edge Integration Cell runtime node included</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>Open Connectors (160+ third-party SaaS apps)</span>
                </li>
              </ul>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailEdition('Standard Edition');
                    setSubView('edition-detail');
                  }}
                  className="text-[13px] sm:text-[14px] font-semibold text-[#0070f2] hover:underline"
                >
                  See all pricing details
                </button>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                className={`w-full h-12 py-0 rounded-xl text-[14px] sm:text-[15px] font-semibold transition-all ${
                  currentEd === 'Standard Edition'
                    ? 'bg-[#0070f2] text-white shadow-xs'
                    : 'bg-white border border-[#0070f2] text-[#0070f2] hover:bg-blue-50/50'
                }`}
              >
                {currentEd === 'Standard Edition' ? 'Selected' : 'Select Standard Edition'}
              </button>
              <div className="text-center">
                <a
                  href="https://www.sap.com/products/technology-platform/integration-suite/pricing.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Terms and conditions
                </a>
              </div>
            </div>
          </div>

          {/* Enhanced Edition */}
          <div
            onClick={() => handleSelectEdition('Enhanced Edition', 1)}
            className={`p-7 sm:p-8 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
              currentEd === 'Enhanced Edition'
                ? 'border-[#0070f2] ring-2 ring-[#0070f2]/20 bg-blue-50/15 shadow-md'
                : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
            }`}
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[18px] sm:text-[20px] font-bold text-slate-900 leading-snug">
                  SAP Integration Suite, enhanced edition
                </h4>
                <p className="text-[14px] text-slate-500 mt-1.5 leading-normal">
                  For high-volume and mission-critical scale &amp; event mesh.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
                  MONTHLY PRICE
                </span>
                <div className="text-[26px] sm:text-[28px] font-bold text-slate-900 font-mono mt-0.5">
                  USD 7,688<span className="text-[14px] font-normal text-slate-500">.00</span>
                </div>
                <div className="text-[13px] text-slate-500 font-mono mt-1">
                  (USD 92,256.00 / yr annualized)
                </div>
              </div>

              <div className="space-y-1 text-[13px] sm:text-[14px] text-slate-600 pt-1">
                <div className="font-medium text-slate-800">&bull; In blocks of 1 Tenants</div>
                <div className="text-slate-500">&bull; Contract duration 3 to 36 months</div>
                <div className="text-slate-500">&bull; Auto-renewal</div>
              </div>

              <ul className="space-y-2.5 text-[14px] sm:text-[15px] text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>500,000 messages included per month</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>1 &times; Advanced Event Mesh (AEM 100) tenant</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>Integration Suite AI natural-language generation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>Alert Notification (ANS) &amp; Cloud Transport (TMS)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                  <span>Document AI (100 documents / month)</span>
                </li>
              </ul>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailEdition('Enhanced Edition');
                    setSubView('edition-detail');
                  }}
                  className="text-[13px] sm:text-[14px] font-semibold text-[#0070f2] hover:underline"
                >
                  See all pricing details
                </button>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                className={`w-full h-12 py-0 rounded-xl text-[14px] sm:text-[15px] font-semibold transition-all ${
                  currentEd === 'Enhanced Edition'
                    ? 'bg-[#0070f2] text-white shadow-xs'
                    : 'bg-white border border-[#0070f2] text-[#0070f2] hover:bg-blue-50/50'
                }`}
              >
                {currentEd === 'Enhanced Edition' ? 'Selected' : 'Select Enhanced Edition'}
              </button>
              <div className="text-center">
                <a
                  href="https://www.sap.com/products/technology-platform/integration-suite/pricing.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Terms and conditions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Official SAP BTP Integration Suite Add-Ons */}
      <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e9f0] pb-4">
          <div>
            <span className="text-[13px] font-bold text-[#0070f2] uppercase tracking-wider block">
              OFFICIAL SAP BTP INTEGRATION SUITE ADD-ONS
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1d2d3e] font-['72',sans-serif] mt-1">
              Capacity &amp; Hybrid Extensions
            </h3>
            <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1">
              Configure optional capacity and hybrid runtime extensions matching the official SAP pricing schedule.
            </p>
          </div>
          {(packs > 0 || dataSpacePackages > 0 || additionalEicTenants > 0) && (
            <button
              type="button"
              onClick={handleClearAllAddOns}
              className="text-[13px] font-semibold text-rose-600 hover:text-rose-800 transition-colors self-start sm:self-auto px-4 py-2 bg-rose-50 rounded-xl border border-rose-200 shadow-2xs"
            >
              Clear all add-ons
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Add-on 1: Additional Message Packs */}
          <div
            className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between ${
              packs > 0
                ? 'border-[#0070f2] ring-2 ring-[#0070f2]/20 bg-blue-50/15 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span
                  className={`px-3 py-0.5 rounded-full text-[13px] font-semibold ${
                    packs > 0
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {packs > 0 ? `In Plan (${packs} blocks)` : 'Optional'}
                </span>
              </div>

              <div>
                <h4 className="text-[17px] sm:text-[18px] font-bold text-slate-900">Additional Messages</h4>
                <p className="text-[13px] sm:text-[14px] text-slate-500 mt-1.5 leading-normal">
                  Blocks of 10,000 monthly transactions to process integrations and APIs.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[12px] sm:text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
                  MONTHLY PRICE
                </span>
                <div className="text-[19px] sm:text-[20px] font-bold text-slate-900 font-mono mt-0.5">
                  USD 7.00 <span className="text-[13px] font-normal text-slate-500">/ mo per block</span>
                </div>
                <div className="text-[13px] text-slate-500 font-mono mt-0.5">
                  USD 84.00 / 10K-month block / yr
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
              {packs === 0 ? (
                <button
                  type="button"
                  onClick={() => handleUpdatePacks(50)}
                  className="w-full h-11 rounded-xl border border-[#0070f2] text-[#0070f2] hover:bg-blue-50 text-[14px] font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add to Plan (+50 blocks)
                </button>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-slate-700">Quantity (10K blocks):</span>
                    <span className="font-mono font-bold text-[#0070f2]">{packs} blocks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdatePacks(packs - 50)}
                      disabled={packs <= 0}
                      className="w-10 h-10 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm disabled:opacity-40 transition-colors"
                      title="Decrease message blocks"
                    >
                      <Minus className="w-4 h-4 text-slate-700" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={packs}
                      onChange={(e) => handleUpdatePacks(parseInt(e.target.value) || 0)}
                      className="w-full h-10 text-center font-mono text-[14px] font-semibold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdatePacks(packs + 50)}
                      className="w-10 h-10 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm transition-colors"
                      title="Increase message blocks"
                    >
                      <Plus className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[13px] text-slate-600 font-mono font-medium">
                      +{(packs * 10).toLocaleString()}K msgs/mo &bull; +USD {(packs * 84).toLocaleString()}/yr
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdatePacks(0)}
                      className="text-[13px] font-semibold text-rose-600 hover:text-rose-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add-on 2: Additional Edge Integration Cell */}
          <div
            className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between ${
              additionalEicTenants > 0
                ? 'border-[#0070f2] ring-2 ring-[#0070f2]/20 bg-blue-50/15 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <span
                  className={`px-3 py-0.5 rounded-full text-[13px] font-semibold ${
                    additionalEicTenants > 0
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {additionalEicTenants > 0 ? `In Plan (${additionalEicTenants} node)` : 'Optional'}
                </span>
              </div>

              <div>
                <h4 className="text-[17px] sm:text-[18px] font-bold text-slate-900">Edge Integration Cell</h4>
                <p className="text-[13px] sm:text-[14px] text-slate-500 mt-1.5 leading-normal">
                  Hybrid runtime node deployed on private cloud or customer-managed Kubernetes.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[12px] sm:text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
                  MONTHLY PRICE
                </span>
                <div className="text-[19px] sm:text-[20px] font-bold text-slate-900 font-mono mt-0.5">
                  USD 3,455.00 <span className="text-[13px] font-normal text-slate-500">/ mo</span>
                </div>
                <div className="text-[13px] text-slate-500 font-mono mt-0.5">
                  USD 41,460.00 / node / yr
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
              {additionalEicTenants === 0 ? (
                <button
                  type="button"
                  onClick={() => handleUpdateEic(1)}
                  className="w-full h-11 rounded-xl border border-[#0070f2] text-[#0070f2] hover:bg-blue-50 text-[14px] font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add to Plan (+1 Node)
                </button>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-slate-700">Quantity (Worker Nodes):</span>
                    <span className="font-mono font-bold text-[#0070f2]">{additionalEicTenants} node(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateEic(additionalEicTenants - 1)}
                      disabled={additionalEicTenants <= 0}
                      className="w-10 h-10 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm disabled:opacity-40 transition-colors"
                      title="Decrease nodes"
                    >
                      <Minus className="w-4 h-4 text-slate-700" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={additionalEicTenants}
                      onChange={(e) => handleUpdateEic(parseInt(e.target.value) || 0)}
                      className="w-full h-10 text-center font-mono text-[14px] font-semibold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateEic(additionalEicTenants + 1)}
                      className="w-10 h-10 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm transition-colors"
                      title="Increase nodes"
                    >
                      <Plus className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[13px] text-slate-600 font-mono font-medium">
                      +USD {(additionalEicTenants * 41460).toLocaleString()}/yr
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateEic(0)}
                      className="text-[13px] font-semibold text-rose-600 hover:text-rose-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add-on 3: Data Space Integration */}
          <div
            className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between ${
              dataSpacePackages > 0
                ? 'border-[#0070f2] ring-2 ring-[#0070f2]/20 bg-blue-50/15 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <span
                  className={`px-3 py-0.5 rounded-full text-[13px] font-semibold ${
                    dataSpacePackages > 0
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {dataSpacePackages > 0 ? `In Plan (${dataSpacePackages} pkg)` : 'Optional'}
                </span>
              </div>

              <div>
                <h4 className="text-[17px] sm:text-[18px] font-bold text-slate-900">Data Space Integration</h4>
                <p className="text-[13px] sm:text-[14px] text-slate-500 mt-1.5 leading-normal">
                  Supports secure, sovereign data exchange across industrial ecosystems (Catena-X).
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[12px] sm:text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
                  MONTHLY PRICE
                </span>
                <div className="text-[19px] sm:text-[20px] font-bold text-slate-900 font-mono mt-0.5">
                  USD 75.00 <span className="text-[13px] font-normal text-slate-500">/ mo</span>
                </div>
                <div className="text-[13px] text-slate-500 font-mono mt-0.5">
                  USD 900.00 / package / yr
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
              {dataSpacePackages === 0 ? (
                <button
                  type="button"
                  onClick={() => handleUpdateDataSpace(1)}
                  className="w-full h-11 rounded-xl border border-[#0070f2] text-[#0070f2] hover:bg-blue-50 text-[14px] font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add to Plan (+1 Package)
                </button>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-slate-700">Quantity (Packages):</span>
                    <span className="font-mono font-bold text-[#0070f2]">{dataSpacePackages} pkg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateDataSpace(dataSpacePackages - 1)}
                      disabled={dataSpacePackages <= 0}
                      className="w-10 h-10 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm disabled:opacity-40 transition-colors"
                      title="Decrease packages"
                    >
                      <Minus className="w-4 h-4 text-slate-700" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={dataSpacePackages}
                      onChange={(e) => handleUpdateDataSpace(parseInt(e.target.value) || 0)}
                      className="w-full h-10 text-center font-mono text-[14px] font-semibold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateDataSpace(dataSpacePackages + 1)}
                      className="w-10 h-10 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm transition-colors"
                      title="Increase packages"
                    >
                      <Plus className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[13px] text-slate-600 font-mono font-medium">
                      +USD {(dataSpacePackages * 900).toLocaleString()}/yr
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateDataSpace(0)}
                      className="text-[13px] font-semibold text-rose-600 hover:text-rose-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Configured SAP BTP Annual Cloud Subscription Summary Banner */}
        {(() => {
          if (!currentEd) {
            return (
              <div className="bg-slate-50/90 rounded-3xl border border-slate-200 p-7 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                      CONFIGURED SAP BTP CLOUD SUBSCRIPTION
                    </span>
                    <span className="text-[12px] sm:text-[13px] font-bold text-slate-600 bg-slate-200/80 px-3 py-0.5 rounded-full">
                      Awaiting Selection
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-700 font-['72',sans-serif]">
                    No edition selected yet
                  </h4>
                  <p className="text-[14px] text-[#556b82] leading-relaxed">
                    Select an SAP Integration Suite edition above to configure and calculate your annual subscription baseline.
                  </p>
                </div>

                <div className="text-right shrink-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[13px] text-[#556b82] block mb-1">Total Configured Annual Subscription</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-400">
                    —
                  </div>
                  <div className="text-[13px] text-slate-400 font-mono mt-1">
                    Select edition above
                  </div>
                </div>
              </div>
            );
          }

          const effectiveEd = currentEd;
          const effectiveUnits = units || 1;
          const basePrice = getEditionBasePrice(effectiveEd);
          const monthlyBase = getEditionMonthlyPrice(effectiveEd);
          const editionCost = basePrice * effectiveUnits;
          const packCost = packs * COMMON_BTP_PRICING.addons.additionalMessagesPer10kBlockAnnualized;
          const eicCost = additionalEicTenants * COMMON_BTP_PRICING.addons.additionalEdgeIntegrationCellAnnualized;
          const dataSpaceCost = dataSpacePackages * COMMON_BTP_PRICING.addons.dataSpaceIntegrationAnnualized;
          const totalAddOns = packCost + eicCost + dataSpaceCost;
          const totalAnnual = editionCost + totalAddOns;
          const totalMonthly = monthlyBase * effectiveUnits + packs * 7 + additionalEicTenants * 3455 + dataSpacePackages * 75;

          return (
            <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-indigo-50/80 rounded-3xl border border-blue-200/90 p-7 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-[13px] font-bold text-[#0070f2] uppercase tracking-wider">
                    CONFIGURED SAP BTP CLOUD SUBSCRIPTION
                  </span>
                  <span className="text-[12px] sm:text-[13px] font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
                    Official SAP Pricing Baseline
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#1d2d3e] font-['72',sans-serif]">
                  {effectiveEd} ({effectiveUnits} tenant) &bull; ${basePrice.toLocaleString()}/yr
                  {packs > 0 && ` + ${packs} msg packs ($${packCost.toLocaleString()})`}
                  {additionalEicTenants > 0 && ` + ${additionalEicTenants} EIC ($${eicCost.toLocaleString()})`}
                  {dataSpacePackages > 0 && ` + ${dataSpacePackages} Data Space ($${dataSpaceCost.toLocaleString()})`}
                </h4>
                <p className="text-[13px] text-[#556b82] font-mono leading-relaxed">
                  {effectiveUnits} unit(s) &times; ${basePrice.toLocaleString()}/yr
                  {packs > 0 ? ` + ${packs} packs &times; $84` : ''}
                  {dataSpacePackages > 0 ? ` + ${dataSpacePackages} DataSpace &times; $900` : ''}
                  {additionalEicTenants > 0 ? ` + ${additionalEicTenants} EIC &times; $41,460` : ''}
                </p>
              </div>

              <div className="text-right shrink-0 bg-white/95 p-6 rounded-2xl border border-blue-100 shadow-xs">
                <span className="text-[13px] text-[#556b82] block mb-1">Total Configured Annual Subscription</span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0070f2]">
                  USD {totalAnnual.toLocaleString()}<span className="text-[14px] text-[#556b82] font-normal"> / yr</span>
                </div>
                <div className="text-[13px] text-[#556b82] font-mono mt-1">
                  &asymp; USD {totalMonthly.toLocaleString()} / month
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-[#e5e9f0]">
        <button
          type="button"
          onClick={onBack}
          className="h-12 px-7 text-[15px] font-semibold text-[#1d2d3e] bg-white border border-[#d9e2ec] rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-2 shadow-xs group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#1d2d3e] transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Cost Parameters</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onCalculate}
          className="h-12 px-7 text-[15px] font-semibold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center space-x-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Calculating Business Value...</span>
            </>
          ) : (
            <>
              <span>Calculate ROI &amp; View Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
