'use client';

import React from 'react';
import Link from 'next/link';
import { ValueOriginChip } from '@/components/ui/ValueOriginChip';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-slate-200">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Governance & Transparency
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            Financial Methodology & AI Architectural Standards
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Documentation of deterministic formulas, data lineage tagging, and AI advisory boundaries in ValueLens AI.
          </p>
        </div>

        {/* Section 1: The Core Principle */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              The Prime Architectural Principle: Zero Financial Hallucinations
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Large Language Models are probabilistic text generators; they are strictly prohibited from performing financial arithmetic or modifying calculation results in ValueLens AI. All financial calculations, TCO summations, payback horizons, and multi-period ROI equations are executed exclusively within a deterministic Java 21 LTS Spring Boot backend engine utilizing pure <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">BigDecimal</code> arithmetic.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Frontend (Next.js)</span>
              <p className="text-slate-500">Presentation, visualization, and interactive scenario sliders only. Does not compute financial math.</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-900 block">Backend (Java 21)</span>
              <p className="text-emerald-800">Sole authoritative source of truth. Produces verified arithmetic traces for all metrics.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-1">
              <span className="font-bold text-purple-900 block">AI Advisory Layer</span>
              <p className="text-purple-800">Advisory synthesis, risk register creation, and strategic narrative. Never mutates numbers.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Deterministic Financial Formulas */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h2 className="text-lg font-bold text-slate-900">Authoritative Financial Formulas</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 uppercase">1. Current Platform TCO</span>
              <code className="block font-mono text-indigo-600 bg-white p-2 rounded border border-slate-200">
                CurrentTCO = LicensingSubtotal + InfrastructureSubtotal + SupportSubtotal + OperationsSubtotal
              </code>
              <p className="text-slate-500 pt-1">
                Sum of itemized perpetual/subscription licenses, hardware leasing, support contracts, and administrative staffing.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 uppercase">2. Target Platform TCO (SAP BTP Integration Suite)</span>
              <code className="block font-mono text-indigo-600 bg-white p-2 rounded border border-slate-200">
                TargetTCO = (BtpTenantUnits × MonthlyUnitRate × 12) + AdditionalMessagePacksCost + AdditionalCloudRunTco
              </code>
              <p className="text-slate-500 pt-1">
                Standard Edition is priced at $1,595/mo ($19,140/yr) per tenant unit; Enterprise Edition at $4,000/mo ($48,000/yr).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 uppercase">3. Annual Operational Savings</span>
              <code className="block font-mono text-emerald-600 bg-white p-2 rounded border border-slate-200">
                AnnualSavings = CurrentTCO - TargetTCO
              </code>
              <p className="text-slate-500 pt-1">
                Net annual recurring run-rate reduction realized immediately upon legacy cutover and decommissioning.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 uppercase">4. Capital Break-Even Payback Period</span>
              <code className="block font-mono text-indigo-600 bg-white p-2 rounded border border-slate-200">
                BreakEvenMonths = (TotalMigrationCost / AnnualSavings) × 12
              </code>
              <p className="text-slate-500 pt-1">
                Calculated with 4-decimal precision ratio rounding to yield the exact payback horizon in months.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 uppercase">5. Multi-Period Net Economic Benefit & ROI</span>
              <code className="block font-mono text-indigo-600 bg-white p-2 rounded border border-slate-200">
                NetBenefit(N) = (AnnualSavings × N) - TotalMigrationCost
                <br />
                ROI(N) = (NetBenefit(N) / TotalMigrationCost) × 100
              </code>
              <p className="text-slate-500 pt-1">
                Computed across standard enterprise capital investment horizons of 1, 3, 5, and 10 years.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Data Lineage Tags */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h2 className="text-lg font-bold text-slate-900">Data Lineage & Origin Taxonomy</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every metric presented throughout ValueLens AI is tagged with a visual Data Origin Chip to ensure auditability:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">User Provided: Customer survey entry</span>
              <ValueOriginChip origin="USER_PROVIDED" />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">Calculated: Deterministic financial fact</span>
              <ValueOriginChip origin="CALCULATED" />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">Derived: Combined mathematical ratio</span>
              <ValueOriginChip origin="DERIVED" />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">Catalog: Published SAP list price</span>
              <ValueOriginChip origin="CATALOG" />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">AI Interpreted: Advisory opinion by ValueLens AI</span>
              <ValueOriginChip origin="AI_INTERPRETED" />
            </div>
          </div>
        </div>

        {/* Back CTA */}
        <div className="text-center pt-4">
          <Link
            href="/dashboard/demo-assessment-1"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <span>Return to ROI Dashboard</span>
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 16 16" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
