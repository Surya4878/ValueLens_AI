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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#d9e2ec] pb-5">
        <span className="text-xs font-bold text-[#0070f2] uppercase tracking-wider">
          STEP 4 OF 7
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1d2d3e] mt-1 tracking-tight">
          Integration Message Volumes &amp; Sizing
        </h2>
        <p className="text-sm text-[#556b82] mt-1 font-normal">
          Provide your current and expected monthly throughput to size SAP BTP Integration Suite entitlements, message blocks, and runtime tenants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-[#d9e2ec] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0070f2]">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1d2d3e]">
              Message Throughput Parameters
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#1d2d3e] mb-2">
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
                  className="w-full text-sm font-mono border border-[#d9e2ec] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0070f2] focus:border-[#0070f2] focus:outline-none bg-white text-[#1d2d3e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
                <span className="absolute right-4 top-3.5 text-xs text-[#556b82] font-semibold">
                  messages / month
                </span>
              </div>
              <span className="text-xs text-[#556b82] mt-1.5 block">
                Standard message size: up to 250 KB per billable message unit.
              </span>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1d2d3e] mb-2">
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
                  className="w-full text-sm font-mono border border-[#d9e2ec] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0070f2] focus:border-[#0070f2] focus:outline-none bg-white text-[#1d2d3e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
                <span className="absolute right-4 top-3.5 text-xs text-[#556b82] font-semibold">
                  messages / month
                </span>
              </div>
              <span className="text-xs text-[#556b82] mt-1.5 block">
                Projected throughput for high-frequency periods or business expansion.
              </span>
            </div>
          </div>
        </div>

        {/* Right Scale Visualizer (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#d9e2ec] p-8 shadow-xs flex flex-col items-center justify-between text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0070f2] uppercase tracking-wider block">
              Throughput Scale Dynamic Preview
            </span>
            <h4 className="text-base font-extrabold text-[#1d2d3e]">
              Scale Progression Ratio
            </h4>
          </div>

          <div className="w-full flex items-end justify-center space-x-8 py-6 h-52">
            {/* Current Bar */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-bold font-mono text-[#0070f2]">
                {currentNum.toLocaleString()}
              </span>
              <div
                className="w-16 bg-gradient-to-t from-[#0070f2] to-sky-400 rounded-t-xl transition-all duration-300 shadow-xs"
                style={{
                  height: currentNum > 0
                    ? `${Math.min(160, Math.max(20, (currentNum / Math.max(expectedNum, currentNum, 1)) * 140))}px`
                    : '12px',
                  opacity: currentNum > 0 ? 1 : 0.3
                }}
              />
              <span className="text-xs font-bold text-[#1d2d3e]">Current</span>
            </div>

            {/* Expected Bar */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-bold font-mono text-[#107e3e]">
                {expectedNum.toLocaleString()}
              </span>
              <div
                className="w-16 bg-gradient-to-t from-[#107e3e] to-teal-400 rounded-t-xl transition-all duration-300 shadow-xs"
                style={{
                  height: expectedNum > 0 ? '140px' : '12px',
                  opacity: expectedNum > 0 ? 1 : 0.3
                }}
              />
              <span className="text-xs font-bold text-[#1d2d3e]">Expected</span>
            </div>
          </div>

          <span className="text-xs font-bold text-[#107e3e] bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
            {currentNum === 0 && expectedNum === 0
              ? 'Enter throughput to model scale'
              : growthPct >= 0
                ? `+${growthPct}% Projected Scale`
                : `${growthPct}% Throughput Ratio`}
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-[#d9e2ec]">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-sm font-semibold text-[#556b82] bg-white border border-[#d9e2ec] rounded-xl hover:bg-slate-50 hover:text-[#1d2d3e] transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-8 py-3 text-sm font-bold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
        >
          <span>Continue to Cost Parameters</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
