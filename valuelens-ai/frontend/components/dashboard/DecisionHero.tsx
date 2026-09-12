'use client';

import React, { useState } from 'react';
import { AiAnalysisResult, DecisionType } from '@/types';
import { designTokens } from '@/lib/design-tokens';
import { ValueOriginChip } from '@/components/ui/ValueOriginChip';

interface DecisionHeroProps {
  aiAnalysis?: AiAnalysisResult;
  annualSavings?: number;
  breakEvenMonths?: number | null;
  fiveYearRoi?: number;
  loading?: boolean;
}

export function DecisionHero({
  aiAnalysis,
  annualSavings = 416916,
  breakEvenMonths = 8.64,
  fiveYearRoi = 594.86,
  loading = false,
}: DecisionHeroProps) {
  const [showSensitivity, setShowSensitivity] = useState(false);

  const decision: DecisionType = aiAnalysis?.decision || 'FAVORABLE';
  const token = designTokens.decisions[decision] || designTokens.decisions.FAVORABLE;
  const confidence = aiAnalysis?.confidence ? Math.round(aiAnalysis.confidence * 100) : 91;

  const topReasons = aiAnalysis?.whatTheNumbersSay?.slice(0, 3) || [
    `Annual run-rate savings of $${Math.round(annualSavings).toLocaleString()} (57.1% cost reduction).`,
    `Rapid capital payback within ${breakEvenMonths?.toFixed(1) || '8.6'} months of cutover.`,
    `Compelling 5-Year ROI of ${fiveYearRoi.toFixed(1)}% totaling over $1.78M in net benefit.`
  ];

  const topRisks = aiAnalysis?.risks?.slice(0, 3) || [
    {
      title: 'Custom Adapter Dependency',
      severity: 'MEDIUM',
      mitigation: 'Catalog existing SAP PI/PO custom adapters early; utilize standard BTP Integration Suite adapters.'
    },
    {
      title: 'Parallel Run Operational Cost',
      severity: 'LOW',
      mitigation: 'Limit dual-running period to maximum 45 days with automated interface regression testing.'
    },
    {
      title: 'Developer Skill Transition',
      severity: 'LOW',
      mitigation: 'Allocate $20,000 developer training budget upfront during sprint zero.'
    }
  ];

  const topActions = aiAnalysis?.recommendations?.slice(0, 3) || [
    {
      action: 'Secure SAP BTP Enterprise Agreement',
      timing: 'Weeks 1-2',
      owner: 'Enterprise Architecture & Procurement'
    },
    {
      action: 'Perform Automated Interface Inventory Scan',
      timing: 'Weeks 3-4',
      owner: 'Integration Lead'
    },
    {
      action: 'Initiate Wave 1 Pilot (Low-Risk Interfaces)',
      timing: 'Month 2',
      owner: 'Migration Project Manager'
    }
  ];

  const sensitivityFactors = aiAnalysis?.decisionFactors || [
    'Migration cost expansion exceeding +139% (above $718,000) would lengthen payback beyond 24 months.',
    'BTP message volume exceeding 3x initial baseline without pack tier discounts.',
    'Dual-licensing overlap extending beyond 12 calendar months.'
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Top Banner Header */}
      <div className="p-6 lg:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-md ${token.bg} ${token.text}`}>
              {token.label}
            </span>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-xs border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Up to 40% Effort Reduction via IntSwitch</span>
            </div>
            <ValueOriginChip origin="AI_INTERPRETED" className="bg-purple-950/60 text-purple-200 border-purple-800" />
          </div>

          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span>Advisory Engine:</span>
            <span className="font-mono text-purple-300 font-semibold">ValueLens AI Decision Engine</span>
          </div>
        </div>

        {/* Executive Headline & Summary */}
        <div className="max-w-4xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Executive Decision: Strategic Migration to SAP BTP Integration Suite
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {aiAnalysis?.executiveSummary ||
              `The business case demonstrates a strong payback of ${breakEvenMonths?.toFixed(1) || '8.6'} months, with annual operating costs reducing from $730,000 to $313,084. Net economic value delivered over 5 years is projected at $1,784,580. Immediate migration planning is recommended.`}
          </p>
        </div>
      </div>

      {/* 3 Pillars Grid: Reasons / Risks / Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50/50">
        {/* Pillar 1: Top 3 Reasons */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Top Reasons to Migrate
            </h3>
          </div>
          <ul className="space-y-3">
            {topReasons.map((reason, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="leading-snug">{typeof reason === 'string' ? reason : String(reason)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 2: Top 3 Risks & Mitigations */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Critical Risk Mitigations
            </h3>
          </div>
          <div className="space-y-3">
            {topRisks.map((risk, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 truncate pr-2">{risk.title}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                    {risk.severity}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-tight">{risk.mitigation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 3: Top 3 Next Actions */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Immediate Next Actions
            </h3>
          </div>
          <div className="space-y-3">
            {topActions.map((act, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-900">{act.action}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Target: {act.timing}</span>
                  <span className="truncate max-w-[140px]">{act.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable: What Would Change This Decision? */}
      <div className="border-t border-slate-200 bg-white">
        <button
          onClick={() => setShowSensitivity(!showSensitivity)}
          className="w-full px-6 py-3.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>What Would Change This Decision? (Boundary Conditions & Sensitivity Triggers)</span>
          </div>
          <span className="text-indigo-600 hover:underline">
            {showSensitivity ? 'Hide Sensitivity Analysis ▲' : 'Inspect Boundary Triggers ▼'}
          </span>
        </button>

        {showSensitivity && (
          <div className="px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-100 text-xs space-y-3">
            <p className="text-slate-600 font-medium">
              The favorable recommendation remains mathematically robust under standard operational bounds. The recommendation degrades toward Neutral or Unfavorable only if:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sensitivityFactors.map((factor, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">Trigger {idx + 1}:</span>
                  <p className="text-slate-600 leading-relaxed">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
