'use client';

import React from 'react';
import {
  BarChart2,
  ArrowRight,
  ArrowLeft,
  Mail,
} from 'lucide-react';

export interface Step4Props {
  currentThroughput: string;
  setCurrentThroughput: (v: string) => void;
  expectedThroughput: string;
  setExpectedThroughput: (v: string) => void;
  recommendedEdition?: string;
  additionalMessagePacks?: number;
  additionalEicTenants?: number;
  needsAem?: boolean;
  onBack: () => void;
  onContinue: () => void;
}

export const Step4Sizing: React.FC<Step4Props> = ({
  currentThroughput,
  setCurrentThroughput,
  expectedThroughput,
  setExpectedThroughput,
  onBack,
  onContinue,
}) => {
  const currentNum = parseInt(currentThroughput || '0', 10);
  const expectedNum = parseInt(expectedThroughput || '0', 10);
  const growthPct = currentNum > 0 ? Math.round(((expectedNum - currentNum) / currentNum) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          STEP 4 OF 7
        </span>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Integration Message Volumes &amp; Sizing
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Provide your current and expected monthly throughput to size SAP BTP Integration Suite entitlements, message blocks, and runtime tenants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Message Throughput Parameters
            </h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Current Monthly Message Throughput
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={currentThroughput}
                  onKeyDown={(e) => {
                    if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                  }}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '');
                    setCurrentThroughput(v);
                  }}
                  className="w-full text-sm font-mono border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
                <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-medium">
                  messages / month
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Standard message size: up to 250 KB per billable message unit.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Expected Monthly Message Throughput (Future Scale)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={expectedThroughput}
                  onKeyDown={(e) => {
                    if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                  }}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '');
                    setExpectedThroughput(v);
                  }}
                  className="w-full text-sm font-mono border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
                <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-medium">
                  messages / month
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Projects your message volume across new APIs, B2B partners, and business events.
              </span>
            </div>
          </div>


        </div>

        {/* Right Visual Comparison Bar Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Throughput Scale Profile
            </h3>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center space-y-6">
            <div className="flex items-end space-x-8 h-48 pt-4">
              {/* Current Bar */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-xs font-bold font-mono text-indigo-600">
                  {currentNum.toLocaleString()}
                </span>
                <div
                  className="w-16 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-300 shadow-xs"
                  style={{
                    height: currentNum > 0
                      ? `${Math.min(160, Math.max(20, (currentNum / Math.max(expectedNum, currentNum, 1)) * 140))}px`
                      : '12px',
                    opacity: currentNum > 0 ? 1 : 0.3
                  }}
                />
                <span className="text-xs font-bold text-slate-700">Current</span>
              </div>

              {/* Expected Bar */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-xs font-bold font-mono text-emerald-600">
                  {expectedNum.toLocaleString()}
                </span>
                <div
                  className="w-16 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl transition-all duration-300 shadow-xs"
                  style={{
                    height: expectedNum > 0 ? '140px' : '12px',
                    opacity: expectedNum > 0 ? 1 : 0.3
                  }}
                />
                <span className="text-xs font-bold text-slate-700">Expected</span>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              {currentNum === 0 && expectedNum === 0
                ? 'Enter throughput to model scale'
                : growthPct >= 0
                  ? `+${growthPct}% Projected Scale`
                  : `${growthPct}% Throughput Ratio`}
            </span>
          </div>
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
          <span>Continue to Cost Parameters →</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
