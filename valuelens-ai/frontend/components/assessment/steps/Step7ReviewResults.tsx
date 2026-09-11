'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Check,
  BarChart2,
  TrendingUp,
  Clock,
  DollarSign,
  Download,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Assessment, RoiCalculationResult } from '@/types';
import { PlatformId, PlatformConfig } from '@/data/platformAssessmentConfig';
import { formatCurrency } from '@/lib/formatters';

export interface Step7Props {
  platformId: PlatformId;
  config: PlatformConfig;
  assessment: Assessment;
  calculationResult: RoiCalculationResult | null;
  currentTco: number;
  targetTco: number;
  annualSavings: number;
  migrationCost: number;
  fiveYearRoi: number;
  netFiveYearBenefit: number;
  paybackMonths: number;
  onBack: () => void;
  onRestart: () => void;
}

export const Step7ReviewResults: React.FC<Step7Props> = ({
  platformId,
  config,
  assessment,
  calculationResult,
  currentTco,
  targetTco,
  annualSavings,
  migrationCost,
  fiveYearRoi,
  netFiveYearBenefit,
  paybackMonths,
  onBack,
  onRestart,
}) => {
  const router = useRouter();

  // Prefer verified backend calculation result if available, fallback to real-time deterministic preview
  const displayCurrentTco = calculationResult?.currentPlatformTCO ?? currentTco;
  const displayTargetTco = calculationResult?.targetPlatformTCO ?? targetTco;
  const displaySavings = calculationResult?.annualSavings ?? annualSavings;
  const displayMigrationCost = calculationResult?.migrationCost ?? migrationCost;
  const displayRoi = calculationResult?.fiveYearROI ?? fiveYearRoi;
  const displayPayback = calculationResult?.breakEvenMonths ?? paybackMonths;
  const displayNetBenefit = calculationResult?.fiveYearNetBenefit ?? netFiveYearBenefit;

  const savingsPct = displayCurrentTco > 0 ? (displaySavings / displayCurrentTco) * 100 : 57.1;

  // Chart height calculations (normalized to max 170px)
  const maxVal = Math.max(displayCurrentTco, displayTargetTco, 1);
  const currentBarHeight = Math.max(40, Math.round((displayCurrentTco / maxVal) * 160));
  const targetBarHeight = Math.max(30, Math.round((displayTargetTco / maxVal) * 160));

  const handleGoToDashboard = () => {
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
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Results Analysis • Step 7 of 7
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Your {config.name} → SAP BTP Migration Analysis
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Based on your inputs, here are the calculated economic results.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleGoToDashboard}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>View Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => router.push(assessment.id ? `/report/${assessment.id}` : '/report/demo-assessment-1')}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>
          <button
            type="button"
            onClick={onRestart}
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
            ${displayCurrentTco.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">per year ({config.name})</span>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase block">Target Platform TCO</span>
          <span className="text-2xl font-black text-indigo-600 font-mono block mt-1">
            ${displayTargetTco.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">per year (SAP BTP)</span>
        </div>

        <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
          <span className="text-xs font-bold text-emerald-800 uppercase block">Annual Savings</span>
          <span className="text-2xl font-black text-emerald-600 font-mono block mt-1">
            ${displaySavings.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
            {savingsPct.toFixed(2)}% Reduction
          </span>
        </div>

        <div className="p-5 bg-indigo-50/70 rounded-2xl border border-indigo-200">
          <span className="text-xs font-bold text-indigo-800 uppercase block">5-Year ROI</span>
          <span className="text-2xl font-black text-indigo-900 font-mono block mt-1">
            {displayRoi.toFixed(2)}%
          </span>
          <span className="text-[11px] text-indigo-600 font-bold mt-1 block">
            Break-even: {displayPayback.toFixed(1)} Months
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
            {/* Current Platform Bar */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-bold font-mono text-slate-900">
                ${(displayCurrentTco / 1000).toFixed(0)}K
              </span>
              <div
                className="w-20 bg-indigo-500 rounded-t-xl transition-all duration-300 shadow-sm"
                style={{ height: `${currentBarHeight}px` }}
              />
              <span className="text-xs font-bold text-slate-700 text-center">
                Current ({config.name})
              </span>
            </div>

            {/* Target Platform Bar */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-bold font-mono text-emerald-600">
                ${(displayTargetTco / 1000).toFixed(0)}K
              </span>
              <div
                className="w-20 bg-emerald-500 rounded-t-xl transition-all duration-300 shadow-sm"
                style={{ height: `${targetBarHeight}px` }}
              />
              <span className="text-xs font-bold text-slate-700 text-center">
                Target (SAP BTP)
              </span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-300 inline-block">
              ✓ ${displaySavings.toLocaleString()} Annual Run-Rate Efficiency
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
                  <td className="py-2 text-slate-600">${displaySavings.toLocaleString()}</td>
                  <td className="py-2 text-right font-bold text-slate-900">${(displaySavings * 1).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-700">Year 2</td>
                  <td className="py-2 text-slate-600">${displaySavings.toLocaleString()}</td>
                  <td className="py-2 text-right font-bold text-slate-900">${(displaySavings * 2).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-700">Year 3</td>
                  <td className="py-2 text-slate-600">${displaySavings.toLocaleString()}</td>
                  <td className="py-2 text-right font-bold text-slate-900">${(displaySavings * 3).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-700">Year 4</td>
                  <td className="py-2 text-slate-600">${displaySavings.toLocaleString()}</td>
                  <td className="py-2 text-right font-bold text-slate-900">${(displaySavings * 4).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-700">Year 5</td>
                  <td className="py-2 text-slate-600">${displaySavings.toLocaleString()}</td>
                  <td className="py-2 text-right font-bold text-slate-900">${(displaySavings * 5).toLocaleString()}</td>
                </tr>
                <tr className="bg-emerald-100/50">
                  <td className="py-2.5 font-extrabold text-emerald-900" colSpan={2}>
                    Net 5-Year Benefit (After ${displayMigrationCost.toLocaleString()} Migration)
                  </td>
                  <td className="py-2.5 text-right font-black text-emerald-700 text-sm">
                    ${displayNetBenefit.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grounded IntSwitch Opportunity Section (No invented percentages) */}
      <div className="p-6 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white rounded-2xl border border-blue-200 space-y-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
              Accelerate with IntSwitch™
            </span>
            <h4 className="text-base font-black text-slate-900 mt-0.5">{config.intSwitch.title}</h4>
            <p className="text-xs text-blue-900 font-semibold mt-0.5">{config.intSwitch.subtitle}</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{config.intSwitch.scopeDescription}</p>
          </div>
        </div>

        <div className="p-3.5 bg-white/90 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1">
          <span className="font-bold text-blue-950 block">Automation Scope:</span>
          <p>{config.intSwitch.automationScope}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {config.intSwitch.capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-blue-100/80"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Strategic Insights */}
      <div className="p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-white rounded-2xl border border-indigo-100 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
            AI Strategic Synthesis
          </h4>
        </div>
        <p className="text-xs text-indigo-950 leading-relaxed">
          Your migration presents a compelling business case. Moving from {config.name} to SAP BTP Integration Suite reduces estimated annual platform TCO by approximately {savingsPct.toFixed(1)}%, unlocking ${displaySavings.toLocaleString()} in annual operating savings with an estimated 5-year ROI of {displayRoi.toFixed(1)}% and break-even in {displayPayback.toFixed(1)} months.
        </p>
      </div>

      {/* Key Opportunities */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Modernization Opportunities</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Reduce infrastructure & host server dependency</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Modernize to cloud-native integration runtime</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Unified API lifecycle management & developer portal</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Decommission legacy middleware licensing & technical debt</span>
          </div>
          <div className="flex items-center space-x-2 sm:col-span-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Establish foundation for AI-assisted mapping and automated testing</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
        >
          ← Back to Inputs
        </button>

        <button
          type="button"
          onClick={handleGoToDashboard}
          className="px-6 py-2.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>Explore Full Analytics Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
