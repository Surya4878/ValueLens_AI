'use client';

import React from 'react';
import { ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';

export interface Step1Props {
  companyName: string;
  onCompanyNameChange: (name: string) => void;
  companySize: string;
  onCompanySizeChange: (size: string) => void;
  industry: string;
  onIndustryChange: (ind: string) => void;
  migrationTimeline: string;
  onMigrationTimelineChange: (timeline: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const Step1Organization: React.FC<Step1Props> = ({
  companyName,
  onCompanyNameChange,
  companySize,
  onCompanySizeChange,
  industry,
  onIndustryChange,
  migrationTimeline,
  onMigrationTimelineChange,
  onBack,
  onContinue,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 sm:p-8 lg:p-10 shadow-xs space-y-8">
      <div className="border-b border-[#d9e2ec] pb-5">
        <span className="text-[12px] sm:text-[13px] font-semibold text-[#0070f2] uppercase tracking-wider">
          STEP 1 OF 7
        </span>
        <h2 className="text-2xl md:text-[28px] font-bold text-[#1d2d3e] mt-1 tracking-tight">
          Tell us about your organization
        </h2>
        <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1.5 font-normal leading-normal">
          This information helps us provide a more accurate analysis and personalized recommendations.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Business / Company Name */}
        <div>
          <label className="block text-[14px] font-semibold text-[#1d2d3e] mb-2">
            Business / Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder="ABC Retail Ltd."
            className="w-full h-[44px] text-[14px] font-normal border border-[#d9e2ec] rounded-lg px-4 focus:ring-2 focus:ring-[#0070f2] focus:border-[#0070f2] focus:outline-none bg-white text-[#1d2d3e]"
          />
        </div>

        {/* 2-Column: Employees & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[14px] font-semibold text-[#1d2d3e] mb-2">
              Number of Employees <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={companySize}
              onChange={(e) => onCompanySizeChange(e.target.value)}
              placeholder="200"
              className="w-full h-[44px] text-[14px] font-normal border border-[#d9e2ec] rounded-lg px-4 focus:ring-2 focus:ring-[#0070f2] focus:border-[#0070f2] focus:outline-none bg-white text-[#1d2d3e]"
            />
          </div>

          <div>
            <label className="block text-[14px] font-semibold text-[#1d2d3e] mb-2">
              Industry <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={industry}
                onChange={(e) => onIndustryChange(e.target.value)}
                className="w-full h-[44px] text-[14px] font-normal border border-[#d9e2ec] rounded-lg px-4 pr-10 appearance-none focus:ring-2 focus:ring-[#0070f2] focus:border-[#0070f2] focus:outline-none bg-white text-[#1d2d3e]"
              >
                <option value="">Select Industry</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing & Supply Chain">Manufacturing & Supply Chain</option>
                <option value="Financial Services & Banking">Financial Services & Banking</option>
                <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Energy & Utilities">Energy & Utilities</option>
                <option value="Technology & Software">Technology & Software</option>
                <option value="Consumer Products">Consumer Products</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#556b82] absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 3: Migration Timeline */}
        <div>
          <label className="block text-[14px] font-semibold text-[#1d2d3e] mb-2">
            Migration Timeline <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={migrationTimeline}
              onChange={(e) => onMigrationTimelineChange(e.target.value)}
              className="w-full h-[44px] text-[14px] font-normal border border-[#d9e2ec] rounded-lg px-4 pr-10 appearance-none focus:ring-2 focus:ring-[#0070f2] focus:border-[#0070f2] focus:outline-none bg-white text-[#1d2d3e]"
            >
              <option value="">Select Target Timeline</option>
              <option value="2 Months (Incture Starter Package)">2 Months (Incture Starter Package)</option>
              <option value="4 Months (Incture Silver Scope)">4 Months (Incture Silver Scope)</option>
              <option value="7 Months (Incture Gold Scope)">7 Months (Incture Gold Scope)</option>
              <option value="9 Months (Incture Platinum Scope)">9 Months (Incture Platinum Scope)</option>
              <option value="6 Months (Accelerated)">6 Months (Accelerated)</option>
              <option value="12-18 Months (Standard Enterprise)">12-18 Months (Standard Enterprise)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#556b82] absolute right-3.5 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-[#d9e2ec]">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 h-[44px] text-[14px] font-semibold text-[#556b82] bg-white border border-[#d9e2ec] rounded-lg hover:bg-slate-50 hover:text-[#1d2d3e] transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platform Selection</span>
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-8 py-2.5 h-[44px] text-[14px] font-semibold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-lg shadow-xs transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
