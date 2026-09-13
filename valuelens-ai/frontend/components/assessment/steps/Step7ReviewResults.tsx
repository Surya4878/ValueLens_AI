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

  const savingsPct = displayCurrentTco > 0 ? (displaySavings / displayCurrentTco) * 100 : 0;

  // Chart height calculations (normalized to max 170px)
  const maxVal = Math.max(displayCurrentTco, displayTargetTco, 1);
  const currentBarHeight = displayCurrentTco > 0 ? Math.max(20, Math.round((displayCurrentTco / maxVal) * 160)) : 12;
  const targetBarHeight = displayTargetTco > 0 ? Math.max(20, Math.round((displayTargetTco / maxVal) * 160)) : 12;

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
    <div className="bg-white rounded-2xl border border-[#d9e2ec] p-7 sm:p-8 md:p-10 shadow-xs space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-[#e5e9f0] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[13px] font-bold text-emerald-600 uppercase tracking-wider">
            Results Analysis • Step 7 of 7
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] mt-1.5 font-['72',sans-serif] flex items-center gap-2">
            <span>Your {config.name}</span>
            <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 10h13m-4-4l4 4-4 4" />
            </svg>
            <span>SAP BTP Migration Analysis</span>
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#556b82] mt-2 leading-relaxed">
            Based on your inputs, here are the calculated economic results.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleGoToDashboard}
            className="h-11 px-5 text-[14px] sm:text-[15px] font-semibold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <BarChart2 className="w-4 h-4" />
            <span>View Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => router.push(assessment.id ? `/report/${assessment.id}` : '/report/demo-assessment-1')}
            className="h-11 px-5 text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] bg-white border border-[#d9e2ec] rounded-xl hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="h-11 px-5 text-[14px] sm:text-[15px] font-semibold text-[#0070f2] bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Start New Assessment
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards matching Slide 8 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 sm:p-7 bg-slate-50/70 rounded-2xl border border-[#d9e2ec]">
          <span className="text-[13px] font-bold text-[#556b82] uppercase block tracking-wider">Current Platform TCO</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] font-mono block mt-2">
            ${displayCurrentTco.toLocaleString()}
          </span>
          <span className="text-[13px] text-[#556b82] mt-1.5 block font-medium">per year ({config.name})</span>
        </div>

        <div className="p-6 sm:p-7 bg-slate-50/70 rounded-2xl border border-[#d9e2ec]">
          <span className="text-[13px] font-bold text-[#556b82] uppercase block tracking-wider">Target Platform TCO</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#0070f2] font-mono block mt-2">
            ${displayTargetTco.toLocaleString()}
          </span>
          <span className="text-[13px] text-[#556b82] mt-1.5 block font-medium">per year (SAP BTP)</span>
        </div>

        <div className="p-6 sm:p-7 bg-emerald-50/70 rounded-2xl border border-emerald-200">
          <span className="text-[13px] font-bold text-emerald-800 uppercase block tracking-wider">Annual Savings</span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono block mt-2">
            ${displaySavings.toLocaleString()}
          </span>
          <span className="text-[13px] text-emerald-700 font-bold mt-1.5 block">
            {savingsPct.toFixed(2)}% Reduction
          </span>
        </div>

        <div className="p-6 sm:p-7 bg-indigo-50/70 rounded-2xl border border-indigo-200">
          <span className="text-[13px] font-bold text-indigo-800 uppercase block tracking-wider">5-Year ROI</span>
          <span className="text-2xl sm:text-3xl font-bold text-indigo-900 font-mono block mt-2">
            {displayRoi.toFixed(2)}%
          </span>
          <span className="text-[13px] text-indigo-600 font-bold mt-1.5 block">
            Break-even: {displayPayback.toFixed(1)} Months
          </span>
        </div>
      </div>

      {/* Main Analysis Grid: Visual Bar Chart & 5-Year Projection Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Platform Cost Comparison Bar Chart */}
        <div className="bg-slate-50/70 border border-[#d9e2ec] rounded-3xl p-7 sm:p-8 space-y-6">
          <h3 className="text-[14px] sm:text-[15px] font-bold text-[#1d2d3e] font-['72',sans-serif] uppercase tracking-wider">
            Annual Platform Cost Comparison
          </h3>

          <div className="flex items-end justify-around h-52 pt-6 border-b border-[#d9e2ec] pb-4">
            {/* Current Platform Bar */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[14px] sm:text-[15px] font-bold font-mono text-[#1d2d3e]">
                ${(displayCurrentTco / 1000).toFixed(0)}K
              </span>
              <div
                className="w-20 bg-indigo-500 rounded-t-xl transition-all duration-300 shadow-sm"
                style={{ height: `${currentBarHeight}px` }}
              />
              <span className="text-[13px] sm:text-[14px] font-bold text-[#556b82] text-center">
                Current ({config.name})
              </span>
            </div>

            {/* Target Platform Bar */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[14px] sm:text-[15px] font-bold font-mono text-emerald-600">
                ${(displayTargetTco / 1000).toFixed(0)}K
              </span>
              <div
                className="w-20 bg-emerald-500 rounded-t-xl transition-all duration-300 shadow-sm"
                style={{ height: `${targetBarHeight}px` }}
              />
              <span className="text-[13px] sm:text-[14px] font-bold text-[#556b82] text-center">
                Target (SAP BTP)
              </span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[13px] sm:text-[14px] font-bold text-emerald-700 bg-emerald-100/60 px-5 py-2 rounded-full border border-emerald-300 inline-block">
              ${displaySavings.toLocaleString()} Annual Run-Rate Efficiency
            </span>
          </div>
        </div>

        {/* Right: 5-Year Value Projection Table */}
        <div className="bg-slate-50/70 border border-[#d9e2ec] rounded-2xl p-7 sm:p-8 space-y-4">
          <h3 className="text-[14px] sm:text-[15px] font-bold text-[#1d2d3e] font-['72',sans-serif] uppercase tracking-wider">
            5-Year Value Projection
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-[14px] text-left">
              <thead>
                <tr className="border-b border-[#d9e2ec] text-[#556b82] text-[14px] sm:text-[15px]">
                  <th className="py-3.5 px-3 font-bold">Year</th>
                  <th className="py-3.5 px-3 font-bold">Annual Savings</th>
                  <th className="py-3.5 px-3 text-right font-bold">Cumulative Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e9f0] font-mono text-[14px]">
                <tr>
                  <td className="py-3.5 px-3 font-bold text-[#1d2d3e]">Year 1</td>
                  <td className="py-3.5 px-3 text-[#556b82]">${displaySavings.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-[#1d2d3e]">${(displaySavings * 1).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-bold text-[#1d2d3e]">Year 2</td>
                  <td className="py-3.5 px-3 text-[#556b82]">${displaySavings.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-[#1d2d3e]">${(displaySavings * 2).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-bold text-[#1d2d3e]">Year 3</td>
                  <td className="py-3.5 px-3 text-[#556b82]">${displaySavings.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-[#1d2d3e]">${(displaySavings * 3).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-bold text-[#1d2d3e]">Year 4</td>
                  <td className="py-3.5 px-3 text-[#556b82]">${displaySavings.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-[#1d2d3e]">${(displaySavings * 4).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-bold text-[#1d2d3e]">Year 5</td>
                  <td className="py-3.5 px-3 text-[#556b82]">${displaySavings.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-[#1d2d3e]">${(displaySavings * 5).toLocaleString()}</td>
                </tr>
                <tr className="bg-emerald-100/60">
                  <td className="py-4 px-3.5 font-bold text-emerald-900 rounded-l-lg text-[14px] sm:text-[15px]" colSpan={2}>
                    Net 5-Year Benefit (After ${displayMigrationCost.toLocaleString()} Migration)
                  </td>
                  <td className="py-4 px-3.5 text-right font-bold text-emerald-700 rounded-r-lg text-[14px] sm:text-[15px]">
                    ${displayNetBenefit.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* IntSwitch Value Metrics & Acceleration Container (Calculated Economics) */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-sky-50/80 rounded-2xl border border-blue-200 p-7 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-200/70 pb-4">
          <div className="flex items-center space-x-3.5">
            <img
              src="/images/intswitch-logo.png"
              alt="IntSwitch"
              className="h-8 w-auto object-contain"
            />
            <span className="h-6 w-px bg-blue-300"></span>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-[13px] font-bold text-[#0070f2] uppercase tracking-wider">
                  Incture IntSwitch Business Value &amp; ROI
                </span>
                <span className="text-[13px] px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  Value Add (Free) • $0 Cost
                </span>
              </div>
              <h4 className="text-[19px] sm:text-[20px] font-bold text-[#1d2d3e] font-['72',sans-serif] mt-1">
                {config.name} to SAP BTP Migration Value Metrics
              </h4>
            </div>
          </div>
          <a
            href="/intswitch"
            className="inline-flex items-center space-x-2 text-[14px] sm:text-[15px] font-semibold text-[#0070f2] hover:text-blue-800 transition-colors group"
          >
            <span>Explore IntSwitch Platform</span>
            <svg className="w-4 h-4 text-[#0070f2] transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
            </svg>
          </a>
        </div>

        {/* 4 Calculated Value Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-2xs">
            <span className="text-[13px] font-bold text-[#556b82] uppercase tracking-wider block">
              Potential Annual Savings
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono block mt-1.5">
              {savingsPct.toFixed(1)}%
            </span>
            <span className="text-[13px] sm:text-[14px] text-[#556b82] mt-1.5 block">
              Save ${displaySavings.toLocaleString()} / year
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-2xs">
            <span className="text-[13px] font-bold text-[#556b82] uppercase tracking-wider block">
              Estimated Payback
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#0070f2] font-mono block mt-1.5">
              {displaySavings > 0 && displayMigrationCost > 0
                ? `< ${Math.max(1, Math.ceil(displayPayback))} Months`
                : '—'}
            </span>
            <span className="text-[13px] sm:text-[14px] text-[#556b82] mt-1.5 block">
              {displaySavings > 0 && displayMigrationCost > 0
                ? `Break-even in ${displayPayback.toFixed(1)} Months`
                : 'Awaiting inputs'}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-2xs">
            <span className="text-[13px] font-bold text-[#556b82] uppercase tracking-wider block">
              5-Year Cumulative ROI
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-indigo-700 font-mono block mt-1.5">
              {displaySavings > 0 && displayMigrationCost > 0 ? `${displayRoi.toFixed(1)}%` : '0.0%'}
            </span>
            <span className="text-[13px] sm:text-[14px] text-[#556b82] mt-1.5 block">
              ${displayNetBenefit.toLocaleString()} Net Benefit
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-2xs">
            <span className="text-[13px] font-bold text-[#556b82] uppercase tracking-wider block">
              IntSwitch Advantage
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono block mt-1.5">
              -40%
            </span>
            <span className="text-[13px] text-emerald-700 mt-1.5 block font-semibold">
              Effort Reduction • Free ($0)
            </span>
          </div>
        </div>

        {/* Calculated Run-Rate Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[14px] bg-white/95 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center space-x-3.5">
            <span className="font-semibold text-[#556b82]">Current Run-Rate:</span>
            <span className="font-bold text-[#1d2d3e] font-mono text-[15px]">${displayCurrentTco.toLocaleString()} / yr</span>
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h10m-3-3l3 3-3 3" />
            </svg>
            <span className="font-semibold text-[#556b82]">Target SAP BTP TCO:</span>
            <span className="font-bold text-[#0070f2] font-mono text-[15px]">${displayTargetTco.toLocaleString()} / yr</span>
          </div>
          <div className="text-[14px] text-[#556b82] font-medium">
            <span className="text-[#0070f2] font-bold">IntSwitch Scope:</span> {config.intSwitch.automationScope} (Included at zero additional cost)
          </div>
        </div>

        {/* Grounded IntSwitch Scope Description & 4 Specific Capabilities */}
        <div className="space-y-3 pt-1">
          <p className="text-[14px] sm:text-[15px] text-[#556b82] leading-relaxed">{config.intSwitch.scopeDescription}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {config.intSwitch.capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-[14px] text-[#1d2d3e] bg-white/90 p-4 rounded-xl border border-blue-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0 mt-2" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Strategic Insights */}
      <div className="p-7 sm:p-8 bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white rounded-2xl border border-indigo-100 space-y-3">
        <div className="flex items-center space-x-3">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4" />
          </span>
          <h4 className="text-[14px] sm:text-[15px] font-bold text-indigo-950 uppercase tracking-wider">
            AI Strategic Synthesis
          </h4>
        </div>
        <p className="text-[15px] text-[#1d2d3e] leading-relaxed">
          Your migration presents a compelling business case. Moving from {config.name} to SAP BTP Integration Suite reduces estimated annual platform TCO by approximately {savingsPct.toFixed(1)}%, unlocking ${displaySavings.toLocaleString()} in annual operating savings with an estimated 5-year ROI of {displayRoi.toFixed(1)}% and break-even in {displayPayback.toFixed(1)} months.
        </p>
      </div>

      {/* Key Opportunities */}
      <div className="p-7 sm:p-8 bg-slate-50/70 rounded-2xl border border-[#d9e2ec] space-y-4">
        <h4 className="text-[14px] sm:text-[15px] font-bold text-[#1d2d3e] font-['72',sans-serif] uppercase tracking-wider">Key Modernization Opportunities</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[14px] sm:text-[15px] text-[#556b82]">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0" />
            <span>Reduce infrastructure &amp; host server dependency</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0" />
            <span>Modernize to cloud-native integration runtime</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0" />
            <span>Unified API lifecycle management &amp; developer portal</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0" />
            <span>Decommission legacy middleware licensing &amp; technical debt</span>
          </div>
          <div className="flex items-center space-x-2.5 sm:col-span-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0070f2] shrink-0" />
            <span>Establish foundation for AI-assisted mapping and automated testing</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#e5e9f0]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 h-12 px-7 text-[15px] font-semibold text-[#1d2d3e] bg-white border border-[#d9e2ec] rounded-xl hover:bg-slate-50 transition-colors group shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-500 group-hover:text-[#1d2d3e] transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 12.5l-4.5-4.5 4.5-4.5" />
          </svg>
          <span>Back to Inputs</span>
        </button>

        <button
          type="button"
          onClick={handleGoToDashboard}
          className="h-12 px-7 text-[15px] font-semibold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Explore Full Analytics Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
