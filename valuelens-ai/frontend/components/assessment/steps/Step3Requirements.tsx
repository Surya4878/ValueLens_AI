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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          STEP 3 OF 7
        </span>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Target Integration Requirements
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Select the enterprise capabilities required for your target architecture to determine the recommended SAP BTP Integration Suite edition.
        </p>
      </div>

      {/* Live Explainable Recommendation Banner */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-purple-50/70 rounded-2xl border border-blue-200/90 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Recommended SAP BTP Target
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
                Determined by Requirements
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              {recommendedEdition}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              {recommendationReason}
            </p>
          </div>
        </div>

        <div className="shrink-0 bg-white/90 rounded-xl px-4 py-3 border border-blue-100 text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Annualized Base Rate
          </span>
          <span className="text-lg font-black text-indigo-900 font-mono">
            {recommendedEdition === 'Enhanced Edition'
              ? '$92,256 / yr'
              : recommendedEdition === 'Standard Edition'
                ? '$64,068 / yr'
                : '$20,736 / yr'}
          </span>
        </div>
      </div>

      {/* 13 Common Requirements Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Enterprise Integration Capabilities Checklist
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {Object.values(requirements).filter(Boolean).length} of {COMMON_REQUIREMENTS_QUESTIONS.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {COMMON_REQUIREMENTS_QUESTIONS.map((q) => {
            const isChecked = !!requirements[q.id];
            return (
              <div
                key={q.id}
                onClick={() => onToggleRequirement(q.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start space-x-3.5 ${
                  isChecked
                    ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-300 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-snug">
                      {q.question}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        q.mapsToEdition === 'Enhanced'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {q.mapsToEdition}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
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
          className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back</span>
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5"
        >
          <span>Continue to Sizing →</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
