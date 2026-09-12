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
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          STEP 1 OF 7
        </span>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Tell us about your organization
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          This information helps us provide a more accurate analysis and personalized recommendations.
        </p>
      </div>

      <div className="space-y-5">
        {/* 1. Business / Company Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Business / Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder="ABC Retail Ltd."
            className="w-full text-sm font-normal border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0070f2] focus:border-[#0070f2] focus:outline-none bg-white text-slate-900"
          />
        </div>

        {/* 2-Column: Employees & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Number of Employees <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={companySize}
              onChange={(e) => onCompanySizeChange(e.target.value)}
              placeholder="200"
              className="w-full text-sm font-normal border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0070f2] focus:border-[#0070f2] focus:outline-none bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Industry <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={industry}
                onChange={(e) => onIndustryChange(e.target.value)}
                className="w-full text-sm font-normal border border-slate-300 rounded-xl px-4 py-2.5 pr-9 appearance-none focus:ring-2 focus:ring-[#0070f2] focus:border-[#0070f2] focus:outline-none bg-white text-slate-900"
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
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 3: Migration Timeline */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Migration Timeline <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={migrationTimeline}
              onChange={(e) => onMigrationTimelineChange(e.target.value)}
              className="w-full text-sm font-normal border border-slate-300 rounded-xl px-4 py-2.5 pr-9 appearance-none focus:ring-2 focus:ring-[#0070f2] focus:border-[#0070f2] focus:outline-none bg-white text-slate-900"
            >
              <option value="">Select Target Timeline</option>
              <option value="2 Months (Incture Starter Package)">2 Months (Incture Starter Package)</option>
              <option value="4 Months (Incture Silver Scope)">4 Months (Incture Silver Scope)</option>
              <option value="7 Months (Incture Gold Scope)">7 Months (Incture Gold Scope)</option>
              <option value="9 Months (Incture Platinum Scope)">9 Months (Incture Platinum Scope)</option>
              <option value="6 Months (Accelerated)">6 Months (Accelerated)</option>
              <option value="12-18 Months (Standard Enterprise)">12-18 Months (Standard Enterprise)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platform Selection</span>
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
