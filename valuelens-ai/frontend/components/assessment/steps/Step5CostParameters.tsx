'use client';

import React from 'react';
import {
  DollarSign,
  Server,
  Layers,
  ArrowRight,
  ArrowLeft,
  Shield,
  Users,
  Code2,
  HelpCircle,
} from 'lucide-react';
import { PlatformId, PlatformConfig } from '@/data/platformAssessmentConfig';
import { formatCurrency } from '@/lib/formatters';

export interface Step5CostsState {
  licensing: number;
  infrastructure: number;
  support: number;
  operations: number;
  development: number;
  other: number;
}

export interface Step5Props {
  platformId: PlatformId;
  config: PlatformConfig;
  costs: Step5CostsState;
  onUpdateCost: (category: keyof Step5CostsState, value: number) => void;
  currency: string;
  onBack: () => void;
  onContinue: () => void;
}

export const Step5CostParameters: React.FC<Step5Props> = ({
  platformId,
  config,
  costs,
  onUpdateCost,
  currency,
  onBack,
  onContinue,
}) => {
  const currentTotalTco =
    (costs.licensing || 0) +
    (costs.infrastructure || 0) +
    (costs.support || 0) +
    (costs.operations || 0) +
    (costs.development || 0) +
    (costs.other || 0);

  // Platform-tailored category names & descriptions
  const getCategoryDetails = () => {
    switch (platformId) {
      case 'mulesoft':
        return {
          licensing: { label: 'Licensing / Subscription', desc: 'Anypoint Platform base subscription, vCore licensing, Titanium & API Manager' },
          infrastructure: { label: 'Infrastructure & CloudHub', desc: 'CloudHub VPCs, Dedicated Load Balancers, RTF clusters, on-prem servers' },
          support: { label: 'Enterprise Support', desc: 'MuleSoft Platinum/Gold support contracts and vendor maintenance' },
          operations: { label: 'Operations & CoE (C4E)', desc: 'MuleSoft certified developers, platform architects, administration staff' },
          development: { label: 'Development / API Maintenance', desc: 'Ongoing API enhancements, RAML updates, and DataWeave maintenance' },
          other: { label: 'Other Operational Expenses', desc: 'Third-party monitoring, training, certification, and miscellaneous tools' },
        };
      case 'sap-neo':
        return {
          licensing: { label: 'Neo Tenant Subscriptions', desc: 'SAP Neo tenant subscription fees, worker compute quotas, and memory blocks' },
          infrastructure: { label: 'Hosting & Infrastructure', desc: 'SAP Neo cloud hosting fees, egress bandwidth, and on-prem Cloud Connector gateways' },
          support: { label: 'Support & Maintenance', desc: 'SAP Enterprise Support maintenance and premium engagement contracts' },
          operations: { label: 'Operations & Administration', desc: 'CPI Neo administrators, security monitoring, and operations personnel' },
          development: { label: 'Custom Script Maintenance', desc: 'Groovy scripts, value mappings, and partner adapter maintenance' },
          other: { label: 'Other Indirect Costs', desc: 'Third-party monitoring tools, archiving, and compliance overhead' },
        };
      case 'boomi':
        return {
          licensing: { label: 'Licensing / Subscription', desc: 'Boomi Enterprise Edition base subscription and standard/custom connector fees' },
          infrastructure: { label: 'Infrastructure & Atom Hosting', desc: 'Molecule cluster VMs, Local Atom on-prem hardware, and cloud storage' },
          support: { label: 'Support & Services', desc: 'Boomi Premier Support, maintenance contracts, and consulting support' },
          operations: { label: 'Operations & Platform Admin', desc: 'Boomi developers, platform administrators, and release operations staff' },
          development: { label: 'Process & Map Maintenance', desc: 'Boomi process enhancements, custom map functions, and JavaScript maintenance' },
          other: { label: 'Other Integration Costs', desc: 'Trading partner setup, external EDI networks, and runtime tooling' },
        };
      default:
        return {
          licensing: { label: 'SAP PI/PO Licensing', desc: 'SAP PI/PO perpetual license maintenance, third-party adapters, and test licenses' },
          infrastructure: { label: 'Server Hardware & Datacenter', desc: 'Physical/virtual servers, storage, backup, networking, and datacenter facilities' },
          support: { label: 'SAP Support & Maintenance', desc: 'SAP standard/enterprise maintenance contracts and vendor support' },
          operations: { label: 'Administration & Operations Staff', desc: 'System administrators, basis team, interface support, and operations personnel' },
          development: { label: 'Custom Development & Maintenance', desc: 'Custom Java mappings, XSLT, UDF, and ccBPM script maintenance' },
          other: { label: 'Other Middleware Overhead', desc: 'Third-party adapter contracts, disaster recovery, and compliance auditing' },
        };
    }
  };

  const details = getCategoryDetails();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#d9e2ec] pb-5">
        <span className="text-xs font-bold text-[#0070f2] uppercase tracking-wider">
          STEP 5 OF 7
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1d2d3e] mt-1 tracking-tight">
          {config.step5Title}
        </h2>
        <p className="text-sm text-[#556b82] mt-1 font-normal">
          {config.step5Description}
        </p>
      </div>

      {/* Total Baseline TCO Banner */}
      <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-indigo-50/80 rounded-3xl border border-[#d9e2ec] p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#0070f2] uppercase tracking-wider block">
            Total Annual Current Platform TCO
          </span>
          <p className="text-xs sm:text-sm text-[#556b82] mt-1">
            Sum of all customer-entered annual operating costs for {config.name}.
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#1d2d3e] font-mono">
            {formatCurrency(currentTotalTco, currency)}
          </span>
          <span className="text-xs text-[#556b82] block font-semibold">per year baseline</span>
        </div>
      </div>

      {/* 6 Category Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Licensing */}
        <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#d9e2ec] pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070f2]">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#1d2d3e]">
              1. {details.licensing.label}
            </h3>
          </div>
          <p className="text-xs text-[#556b82] leading-relaxed">
            {details.licensing.desc}
          </p>
          <div className="flex rounded-xl border border-[#d9e2ec] overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
            <div className="bg-slate-50 border-r border-[#d9e2ec] px-4 flex items-center text-sm font-bold text-[#556b82]">
              $
            </div>
            <input
              type="number"
              min="0"
              value={costs.licensing === 0 ? '' : costs.licensing}
              onKeyDown={(e) => {
                if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
              }}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '') {
                  onUpdateCost('licensing', 0);
                } else {
                  const n = Math.max(0, parseFloat(v) || 0);
                  onUpdateCost('licensing', n);
                }
              }}
              className="w-full text-sm font-mono font-semibold p-3 focus:outline-none bg-white text-[#1d2d3e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <div className="bg-slate-50 border-l border-[#d9e2ec] px-4 flex items-center text-sm text-[#556b82] font-medium">
              / yr
            </div>
          </div>
        </div>

        {/* 2. Infrastructure */}
        <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#d9e2ec] pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070f2]">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#1d2d3e]">
              2. {details.infrastructure.label}
            </h3>
          </div>
          <p className="text-xs text-[#556b82] leading-relaxed">
            {details.infrastructure.desc}
          </p>
          <div className="flex rounded-xl border border-[#d9e2ec] overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
            <div className="bg-slate-50 border-r border-[#d9e2ec] px-4 flex items-center text-sm font-bold text-[#556b82]">
              $
            </div>
            <input
              type="number"
              min="0"
              value={costs.infrastructure === 0 ? '' : costs.infrastructure}
              onKeyDown={(e) => {
                if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
              }}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '') {
                  onUpdateCost('infrastructure', 0);
                } else {
                  const n = Math.max(0, parseFloat(v) || 0);
                  onUpdateCost('infrastructure', n);
                }
              }}
              className="w-full text-sm font-mono font-semibold p-3 focus:outline-none bg-white text-[#1d2d3e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <div className="bg-slate-50 border-l border-[#d9e2ec] px-4 flex items-center text-sm text-[#556b82] font-medium">
              / yr
            </div>
          </div>
        </div>

        {/* 3. Support & Maintenance */}
        <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#d9e2ec] pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070f2]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#1d2d3e]">
              3. {details.support.label}
            </h3>
          </div>
          <p className="text-xs text-[#556b82] leading-relaxed">
            {details.support.desc}
          </p>
          <div className="flex rounded-xl border border-[#d9e2ec] overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
            <div className="bg-slate-50 border-r border-[#d9e2ec] px-4 flex items-center text-sm font-bold text-[#556b82]">
              $
            </div>
            <input
              type="number"
              min="0"
              value={costs.support === 0 ? '' : costs.support}
              onKeyDown={(e) => {
                if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
              }}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '') {
                  onUpdateCost('support', 0);
                } else {
                  const n = Math.max(0, parseFloat(v) || 0);
                  onUpdateCost('support', n);
                }
              }}
              className="w-full text-sm font-mono font-semibold p-3 focus:outline-none bg-white text-[#1d2d3e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <div className="bg-slate-50 border-l border-[#d9e2ec] px-4 flex items-center text-sm text-[#556b82] font-medium">
              / yr
            </div>
          </div>
        </div>

        {/* 4. Operations & Staffing */}
        <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#d9e2ec] pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070f2]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#1d2d3e]">
              4. {details.operations.label}
            </h3>
          </div>
          <p className="text-xs text-[#556b82] leading-relaxed">
            {details.operations.desc}
          </p>
          <div className="flex rounded-xl border border-[#d9e2ec] overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
            <div className="bg-slate-50 border-r border-[#d9e2ec] px-4 flex items-center text-sm font-bold text-[#556b82]">
              $
            </div>
            <input
              type="number"
              min="0"
              value={costs.operations === 0 ? '' : costs.operations}
              onKeyDown={(e) => {
                if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
              }}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '') {
                  onUpdateCost('operations', 0);
                } else {
                  const n = Math.max(0, parseFloat(v) || 0);
                  onUpdateCost('operations', n);
                }
              }}
              className="w-full text-sm font-mono font-semibold p-3 focus:outline-none bg-white text-[#1d2d3e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <div className="bg-slate-50 border-l border-[#d9e2ec] px-4 flex items-center text-sm text-[#556b82] font-medium">
              / yr
            </div>
          </div>
        </div>

        {/* 5. Development & Maintenance */}
        <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#d9e2ec] pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070f2]">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#1d2d3e]">
              5. {details.development.label}
            </h3>
          </div>
          <p className="text-xs text-[#556b82] leading-relaxed">
            {details.development.desc}
          </p>
          <div className="flex rounded-xl border border-[#d9e2ec] overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
            <div className="bg-slate-50 border-r border-[#d9e2ec] px-4 flex items-center text-sm font-bold text-[#556b82]">
              $
            </div>
            <input
              type="number"
              min="0"
              value={costs.development === 0 ? '' : costs.development}
              onKeyDown={(e) => {
                if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
              }}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '') {
                  onUpdateCost('development', 0);
                } else {
                  const n = Math.max(0, parseFloat(v) || 0);
                  onUpdateCost('development', n);
                }
              }}
              className="w-full text-sm font-mono font-semibold p-3 focus:outline-none bg-white text-[#1d2d3e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <div className="bg-slate-50 border-l border-[#d9e2ec] px-4 flex items-center text-sm text-[#556b82] font-medium">
              / yr
            </div>
          </div>
        </div>

        {/* 6. Other Operational Expenses */}
        <div className="bg-white rounded-3xl border border-[#d9e2ec] p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#d9e2ec] pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070f2]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#1d2d3e]">
              6. {details.other.label}
            </h3>
          </div>
          <p className="text-xs text-[#556b82] leading-relaxed">
            {details.other.desc}
          </p>
          <div className="flex rounded-xl border border-[#d9e2ec] overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
            <div className="bg-slate-50 border-r border-[#d9e2ec] px-4 flex items-center text-sm font-bold text-[#556b82]">
              $
            </div>
            <input
              type="number"
              min="0"
              value={costs.other === 0 ? '' : costs.other}
              onKeyDown={(e) => {
                if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
              }}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '') {
                  onUpdateCost('other', 0);
                } else {
                  const n = Math.max(0, parseFloat(v) || 0);
                  onUpdateCost('other', n);
                }
              }}
              className="w-full text-sm font-mono font-semibold p-3 focus:outline-none bg-white text-[#1d2d3e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <div className="bg-slate-50 border-l border-[#d9e2ec] px-4 flex items-center text-sm text-[#556b82] font-medium">
              / yr
            </div>
          </div>
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
          <span>Continue to Select Edition</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
