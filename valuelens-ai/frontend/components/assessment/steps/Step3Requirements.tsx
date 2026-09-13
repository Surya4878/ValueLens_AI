'use client';

import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
  ArrowLeft,
  Crown,
  Zap,
} from 'lucide-react';
import { COMMON_REQUIREMENTS_QUESTIONS } from '@/data/platformAssessmentConfig';

export interface Step3Props {
  requirements: Record<string, boolean>;
  onToggleRequirement: (id: string) => void;
  recommendedEdition: string;
  recommendationReason: string;
  onBack: () => void;
  onContinue: () => void;
}

export const Step3Requirements: React.FC<Step3Props> = ({
  requirements,
  onToggleRequirement,
  recommendedEdition,
  recommendationReason,
  onBack,
  onContinue,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[12px] font-bold text-[#0070f2] uppercase tracking-wider">
          STEP 3 OF 7
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] mt-1 font-['72',sans-serif]">
          Target Integration Requirements
        </h2>
        <p className="text-[15px] sm:text-[16px] text-[#556b82] mt-1.5 leading-relaxed">
          Select the enterprise capabilities required for your target architecture to determine the recommended SAP BTP Integration Suite edition.
        </p>
      </div>

      {/* Live Explainable Recommendation Banner */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-purple-50/70 rounded-2xl border border-blue-200/90 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#0070f2] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[12px] font-bold uppercase tracking-wider text-blue-700">
                Recommended SAP BTP Target
              </span>
              <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
                Determined by Requirements
              </span>
            </div>
            <h3 className="text-[20px] font-bold text-[#1d2d3e] mt-1 font-['72',sans-serif]">
              {recommendedEdition}
            </h3>
            <p className="text-[14px] text-[#556b82] mt-1.5 leading-relaxed max-w-2xl">
              {recommendationReason}
            </p>
          </div>
        </div>

        <div className="shrink-0 bg-white/95 rounded-xl px-5 py-3.5 border border-blue-100 text-right shadow-xs">
          <span className="text-[12px] font-bold text-[#556b82] uppercase tracking-wider block">
            Annualized Base Rate
          </span>
          <span className="text-[22px] font-bold text-[#1d2d3e] font-mono">
            {recommendedEdition === 'Enhanced Edition'
              ? '$92,256 / yr'
              : recommendedEdition === 'Standard Edition'
                ? '$64,068 / yr'
                : '$20,736 / yr'}
          </span>
        </div>
      </div>

      {/* 13 Common Requirements Grid */}
      <div className="bg-white rounded-2xl border border-[#d9e2ec] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#e5e9f0] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0070f2] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-[17px] sm:text-[18px] font-bold text-[#1d2d3e] font-['72',sans-serif]">
              Enterprise Integration Capabilities Checklist
            </h3>
          </div>
          <span className="text-[12px] font-semibold px-3 py-1 bg-slate-100 text-[#556b82] rounded-full border border-slate-200">
            {Object.values(requirements).filter(Boolean).length} of {COMMON_REQUIREMENTS_QUESTIONS.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {COMMON_REQUIREMENTS_QUESTIONS.map((q) => {
            const isChecked = !!requirements[q.id];
            return (
              <div
                key={q.id}
                onClick={() => onToggleRequirement(q.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer select-none flex items-start space-x-4 ${
                  isChecked
                    ? 'bg-blue-50/50 border-[#0070f2] ring-1 ring-[#0070f2] shadow-2xs'
                    : 'bg-white border-[#d9e2ec] hover:border-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                    isChecked
                      ? 'border-[#0070f2] bg-blue-50/50'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <div className="w-2.5 h-2.5 rounded-xs bg-[#0070f2]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] leading-snug">
                      {q.question}
                    </span>
                    <span
                      className={`text-[12px] font-bold uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                        q.mapsToEdition === 'Enhanced'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {q.mapsToEdition}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#556b82] mt-1.5 leading-relaxed">
                    {q.tooltip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="h-[44px] px-6 text-[14px] font-semibold text-[#1d2d3e] bg-white border border-[#d9e2ec] rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-2 shadow-xs group"
        >
          <svg className="w-4 h-4 text-slate-500 group-hover:text-[#1d2d3e] transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 12.5l-4.5-4.5 4.5-4.5" />
          </svg>
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="h-[44px] px-6 text-[14px] font-semibold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-lg shadow-xs transition-all flex items-center space-x-2 group"
        >
          <span>Continue to Sizing</span>
          <svg className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};
