'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function IntSwitchPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // 7 Migration Lifecycle Steps
  // 7 Migration Lifecycle Steps with chevron ribbon styling
  const lifecycleSteps = [
    {
      step: 1,
      name: 'Discover',
      descLine1: 'Inventory integrations',
      descLine2: 'and metadata',
      bgColor: '#edf5fe',
      isFirst: true,
      isLast: false,
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#0066cc]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="7" strokeWidth={2.4} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M16.5 16.5L21.5 21.5" />
        </svg>
      ),
    },
    {
      step: 2,
      name: 'Assess',
      descLine1: 'Evaluate complexity',
      descLine2: 'and resources',
      bgColor: '#e2eefc',
      isFirst: false,
      isLast: false,
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#0066cc]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12h6m-6 4h4m5-10v14a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2h7l5 5z" />
        </svg>
      ),
    },
    {
      step: 3,
      name: 'Plan',
      descLine1: 'Group scenarios and',
      descLine2: 'estimate effort',
      bgColor: '#d6e7fb',
      isFirst: false,
      isLast: false,
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#0066cc]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="18" cy="5" r="3" strokeWidth={2.2} />
          <circle cx="6" cy="12" r="3" strokeWidth={2.2} />
          <circle cx="18" cy="19" r="3" strokeWidth={2.2} />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeWidth={2.2} />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeWidth={2.2} />
        </svg>
      ),
    },
    {
      step: 4,
      name: 'Migrate',
      descLine1: 'Automate migration',
      descLine2: 'activities',
      bgColor: '#c8e2fb',
      isFirst: false,
      isLast: false,
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#0066cc]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" strokeWidth={2.2} />
        </svg>
      ),
    },
    {
      step: 5,
      name: 'Validate',
      descLine1: 'Compare source and',
      descLine2: 'target behavior',
      bgColor: '#b8d7f8',
      isFirst: false,
      isLast: false,
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#0066cc]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth={2.2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M8.5 12l2.5 2.5 5-5" />
        </svg>
      ),
    },
    {
      step: 6,
      name: 'Regress',
      descLine1: 'Run tests and',
      descLine2: 'inspect outcomes',
      bgColor: '#a5ccf6',
      isFirst: false,
      isLast: false,
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#0066cc]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="5" y="14" width="3" height="6" rx="0.8" strokeWidth={2.2} />
          <rect x="11" y="10" width="3" height="10" rx="0.8" strokeWidth={2.2} />
          <rect x="17" y="6" width="3" height="14" rx="0.8" strokeWidth={2.2} />
        </svg>
      ),
    },
    {
      step: 7,
      name: 'Transition',
      descLine1: 'Support cutover',
      descLine2: 'readiness',
      bgColor: 'linear-gradient(135deg, #3b82f6 0%, #1d6fe9 50%, #0052cc 100%)',
      isFirst: false,
      isLast: true,
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 21V4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} fill="currentColor" d="M5 4c3-1.5 6 1.5 9 0s5-1 6-1v9c-1 0-3 1-6 1s-6-1.5-9 0V4z" />
        </svg>
      ),
    },
  ];

  // AI Difference Comparison Table
  const comparisonRows = [
    { param: 'Person-days', without: 'Higher', with: 'Lower (AI-assisted)' },
    { param: 'Cost', without: 'Higher', with: 'Lower (optimized)' },
    { param: 'Timeline', without: 'Longer', with: 'Shorter' },
    { param: 'Testing cycles', without: 'Multiple', with: 'Reduced (optimized)' },
    { param: 'Specialist review load', without: 'High', with: 'Lower' },
    { param: 'Automation candidates', without: 'Manually identified', with: 'AI-driven insights' },
    { param: 'Assisted effort', without: 'Minimal', with: 'Higher' },
    { param: 'Validation scope', without: 'Limited', with: 'Broader (source vs target)' },
    { param: 'Expert review load', without: 'High', with: 'Optimized' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-r from-[#eef5fc] via-[#f2f7fc] to-[#e8f2fa] border border-blue-100/80 p-6 sm:p-8 lg:p-10 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Back to Business ValueLens AI Button */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/80 hover:bg-white text-[#0066cc] border border-blue-200/80 shadow-2xs transition-all w-fit group"
              >
                <span className="text-sm group-hover:-translate-x-0.5 transition-transform">←</span>
                <span>Back to Business ValueLens AI</span>
              </Link>
            </div>

            {/* Logo Lockup */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-[#0066cc] shrink-0 shadow-2xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M12 2v9" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M18.36 6.64a9 9 0 11-12.73 0" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#0066cc] tracking-tight leading-tight">
                  IntSwitch
                </h2>
                <p className="text-xs font-semibold text-slate-500 tracking-wide">
                  Incture Migration Tool
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#0b1b36] leading-[1.14] tracking-tight">
              Accelerate Integration<br />
              Migration with <span className="text-[#0066cc]">IntSwitch</span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
              An AI-driven integration migration tool for assessment, migration, validation and regression testing — simplifying your journey to SAP Integration Suite.
            </p>

            {/* 2 Buttons: Request a Demo (Dummy) & View IntSwitch on SAP (Redirects) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {/* Button 1: Request a Demo */}
              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-[#7928ca] hover:bg-[#6820b0] text-white shadow-xs transition-colors cursor-pointer"
              >
                <span>Request a Demo</span>
                <span className="text-sm">→</span>
              </button>

              {/* Button 2: View IntSwitch on SAP */}
              <a
                href="https://www.sap.com/india/products/technology-platform/partners/incture-technologies-private-limited-intswitch-incture-migration-tool.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-[#0066cc] border border-[#0066cc]/40 shadow-xs transition-colors cursor-pointer"
              >
                <span>View <span className="text-[#0066cc] font-black">IntSwitch</span> on SAP</span>
                <span className="text-sm">→</span>
              </a>
            </div>

            {/* 3 Mini Feature Badges - Evenly Spaced */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 items-center">
              {/* Badge 1: Proven approach */}
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100/90 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-700 font-semibold leading-tight">
                  Proven approach<br />and best practices
                </p>
              </div>

              {/* Badge 2: Simplify complex migrations */}
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100/90 text-[#0066cc] flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-700 font-semibold leading-tight">
                  Simplify complex<br />migrations
                </p>
              </div>

              {/* Badge 3: Move with confidence */}
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100/90 text-[#0066cc] flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-700 font-semibold leading-tight">
                  Move to SAP Integration<br />Suite with confidence
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Architecture Diagram Graphic Card */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="w-full bg-white rounded-2xl border border-blue-100/90 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {/* High-Definition Architecture Diagram Graphic */}
              <img
                src="/images/intswitch-hero-diagram.png?v=new"
                alt="Different Platforms. A Smarter Path. A Greater Tomorrow. IntSwitch Integration Migration"
                className="w-full h-auto object-contain block"
              />

              {/* Bottom Info Note Bar inside the graphic card */}
              <div className="bg-[#f0f7ff] border-t border-blue-100/90 px-4 py-2.5 flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-[#0066cc] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  i
                </div>
                <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-snug">
                  SAP PI/PO migration is addressed through Incture&apos;s separate Integration Workbench where appropriate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Capabilities */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            Core Capabilities
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            End-to-End Migration, Powered by AI and Automation
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Key capabilities to simplify your integration migration journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: AI-Driven Assessment */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">
              AI-Driven Assessment
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyze integration landscapes, identify complexity, estimate effort, and recommend target adapters.
            </p>
          </div>

          {/* Card 2: Migration Automation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">
              Migration Automation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automate applicable migration activities from connectivity setup through payload testing using design-time artifacts and templates.
            </p>
          </div>

          {/* Card 3: Functional Validation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">
              Functional Validation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare source and target platform responses using API calls to establish functional equivalence.
            </p>
          </div>

          {/* Card 4: Regression Testing */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">
              Regression Testing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Run regression tests with visual outcomes (true, false, failed) to identify issues before business cutover.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Migration Lifecycle (7 Steps Chevron Ribbon Flow) */}
      <section className="bg-white border border-blue-100/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0b1b36] tracking-tight">
            Migration Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
            A structured, end-to-end journey from assessment to cutover.
          </p>
        </div>

        {/* 7 Chevron Steps Flow */}
        <div className="overflow-x-auto pb-4 pt-1 -mx-2 px-2">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 min-w-[760px] lg:min-w-full items-start">
            {lifecycleSteps.map((step) => {
              // Custom clip-path polygon based on chevron position
              const clipPathStyle = step.isFirst
                ? 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%)'
                : step.isLast
                ? 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%, 16px 50%)'
                : 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%, 16px 50%)';

              return (
                <div key={step.step} className="flex flex-col items-center text-center group">
                  {/* Chevron Arrow Block */}
                  <div
                    className={`w-full h-16 sm:h-20 flex items-center justify-center transition-all group-hover:brightness-95 group-hover:scale-[1.02] cursor-default shadow-2xs ${
                      step.isFirst ? 'rounded-l-lg' : ''
                    }`}
                    style={{
                      background: step.bgColor,
                      clipPath: clipPathStyle,
                      WebkitClipPath: clipPathStyle,
                    }}
                  >
                    <div className={`${step.isFirst ? 'pr-2' : 'pl-2 pr-1'}`}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Title & 2-Line Subtitle */}
                  <div className="mt-3 sm:mt-4 px-1">
                    <h4 className="text-xs sm:text-[13px] font-extrabold text-[#0b1b36] leading-tight">
                      {step.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-1">
                      {step.descLine1}<br />{step.descLine2}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Two-Column Layout: Left (Table + Why IntSwitch) | Right (Supported + Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Span 6) */}
        <div className="lg:col-span-6 space-y-10">
          {/* A. Comparison Table */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                See the AI Difference Before You Migrate
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                From manual effort to an accelerated, more efficient migration journey.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-[#eef5fc]">
                  <tr>
                    <th scope="col" className="py-2.5 px-3.5 text-left font-extrabold text-slate-800">
                      Parameter
                    </th>
                    <th scope="col" className="py-2.5 px-3.5 text-left font-extrabold text-slate-800">
                      Without <span className="text-[#0066cc]">IntSwitch</span>
                    </th>
                    <th scope="col" className="py-2.5 px-3.5 text-left font-extrabold text-slate-800">
                      With <span className="text-[#0066cc]">IntSwitch</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {comparisonRows.map((r, i) => (
                    <tr key={r.param} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="py-2.5 px-3.5 text-slate-900 font-semibold">{r.param}</td>
                      <td className="py-2.5 px-3.5 text-slate-500">{r.without}</td>
                      <td className="py-2.5 px-3.5 text-[#0066cc] font-bold">{r.with}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* B. Why IntSwitch? 4 Cards Grid */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Why <span className="text-[#0066cc]">IntSwitch</span>?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Real outcomes for a more efficient and predictable migration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Faster Planning */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066cc] flex items-center justify-center mb-2.5">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">Faster Planning</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get clearer visibility into complexity, effort, and recommended adapters.
                </p>
              </div>

              {/* Lower Migration Effort */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066cc] flex items-center justify-center mb-2.5">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">Lower Migration Effort</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automate repeatable migration activities with design-time artifacts.
                </p>
              </div>

              {/* Reduced Migration Risk */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066cc] flex items-center justify-center mb-2.5">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">Reduced Migration Risk</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Validate and test to identify issues before business cutover.
                </p>
              </div>

              {/* Better Visibility */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066cc] flex items-center justify-center mb-2.5">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">Better Visibility</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track progress across assessment, migration, and testing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 6) */}
        <div className="lg:col-span-6 space-y-8">
          {/* C. Supported Migration Landscapes */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Supported Migration Landscapes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Migrate from leading integration platforms to SAP Integration Suite.
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* SAP BTP Neo */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 text-center shadow-2xs hover:border-blue-300 transition-colors flex flex-col items-center">
                <img src="/images/logos/logo_neo_cpi.png" alt="SAP BTP Neo" className="w-9 h-9 object-contain mb-2" />
                <span className="text-xs font-black text-slate-900">SAP BTP Neo</span>
              </div>

              {/* MuleSoft */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 text-center shadow-2xs hover:border-blue-300 transition-colors flex flex-col items-center">
                <img src="/images/logos/logo_mulesoft.png" alt="MuleSoft" className="w-9 h-9 object-contain mb-2" />
                <span className="text-xs font-black text-slate-900">MuleSoft</span>
              </div>

              {/* Dell Boomi */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 text-center shadow-2xs hover:border-blue-300 transition-colors flex flex-col items-center">
                <img src="/images/logos/logo_boomi.png" alt="Dell Boomi" className="w-9 h-9 object-contain mb-2" />
                <span className="text-xs font-black text-slate-900">Dell Boomi</span>
              </div>

              {/* SAP PI/PO */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 text-center shadow-2xs hover:border-blue-300 transition-colors flex flex-col items-center">
                <img src="/images/logos/logo_sap_pipo.png" alt="SAP PI/PO" className="w-9 h-9 object-contain mb-2" />
                <span className="text-xs font-black text-slate-900">SAP PI/PO</span>
              </div>
            </div>

            {/* Callout Info */}
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#0066cc] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                i
              </span>
              <p className="text-xs text-slate-700 leading-snug">
                SAP PI/PO migration is addressed through Incture&apos;s separate Integration Workbench where appropriate.
              </p>
            </div>
          </div>

          {/* D. Product Preview (Illustrative) Mock Dashboard */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Product Preview (Illustrative)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                A unified view to assess, migrate, validate, and track progress.
              </p>
            </div>

            {/* Mock Dashboard Window */}
            <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
              {/* Header Bar */}
              <div className="bg-[#f8fafc] border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 text-[#0066cc] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 2v9" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M18.36 6.64a9 9 0 11-12.73 0" />
                    </svg>
                  </div>
                  <span className="text-xs font-black text-[#0066cc]">IntSwitch</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 grid grid-cols-12 gap-4">
                {/* Left Mini Sidebar */}
                <div className="col-span-3 border-r border-slate-100 pr-3 space-y-1.5 text-[10px] font-semibold text-slate-600">
                  <div className="bg-[#0066cc] text-white rounded-md px-2 py-1 flex items-center space-x-1 font-bold">
                    <span>Overview</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 rounded cursor-pointer">Assessment</div>
                  <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 rounded cursor-pointer">Migration</div>
                  <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 rounded cursor-pointer">Validation</div>
                  <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 rounded cursor-pointer">Testing</div>
                  <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 rounded cursor-pointer">Reports</div>
                </div>

                {/* Right Analytics Area */}
                <div className="col-span-9 space-y-3">
                  {/* Top Stats Row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {/* Stat 1 */}
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-500 block truncate">Integrations Analyzed</span>
                      <div className="flex items-center justify-center space-x-1 mt-0.5">
                        <span className="text-xs text-[#0066cc]">👥</span>
                        <span className="text-sm font-black text-slate-900">248</span>
                      </div>
                    </div>

                    {/* Stat 2: Readiness Donut */}
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-slate-500 block truncate mb-1">Readiness</span>
                      <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="45 100" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="-45" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-75" />
                      </svg>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-500 block truncate">Automation</span>
                      <div className="flex items-center justify-center space-x-1 mt-0.5">
                        <span className="text-xs text-purple-600">⚡</span>
                        <span className="text-sm font-black text-slate-900">186</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Progress & Charts Row */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Migration Stepper Preview */}
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-500 block mb-1">Migration Progress</span>
                      <div className="flex items-center justify-between px-1 py-2">
                        <div className="w-2 h-2 rounded-full bg-[#0066cc]"></div>
                        <div className="h-0.5 flex-1 bg-[#0066cc]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#0066cc]"></div>
                        <div className="h-0.5 flex-1 bg-[#0066cc]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#0066cc]"></div>
                        <div className="h-0.5 flex-1 bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      </div>
                      <div className="flex justify-between text-[7px] text-slate-400 font-bold uppercase">
                        <span>Disc</span>
                        <span>Plan</span>
                        <span>Migr</span>
                        <span>Cut</span>
                      </div>
                    </div>

                    {/* Validation Bar Chart Preview */}
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-slate-500 block">Validation Results</span>
                      <div className="flex items-end justify-center space-x-1.5 h-8 pt-1">
                        <div className="w-2 bg-blue-300 rounded-t h-3"></div>
                        <div className="w-2 bg-blue-400 rounded-t h-5"></div>
                        <div className="w-2 bg-blue-500 rounded-t h-7"></div>
                        <div className="w-2 bg-[#0066cc] rounded-t h-8"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom CTA Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-[#0052cc] via-[#1d4ed8] to-[#2563eb] text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Ready to Accelerate Your Migration?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
                Book a personalized demo and see how <span className="text-sky-200 font-black">IntSwitch</span> can simplify assessment, migration, validation, and testing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDemoModalOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#0066cc] hover:bg-blue-50 shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <span>Request a Demo</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </section>

      {/* Demo Modal (Dummy Action as requested) */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7928ca] flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Request Received!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thank you for your interest in <strong className="text-[#0066cc] font-extrabold">IntSwitch</strong>. Our Incture Migration Specialists will reach out shortly to arrange a customized demonstration for your landscape.
            </p>

            <button
              type="button"
              onClick={() => setDemoModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#0066cc] text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
