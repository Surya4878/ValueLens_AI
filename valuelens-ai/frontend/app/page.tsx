'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  const steps = [
    {
      num: '01',
      title: 'Landscape & Inventory Discovery',
      desc: 'Catalog source middleware platform interfaces, monthly message volumes, third-party adapters, and legacy ABAP/Java mapping complexity.',
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Baseline TCO Modeling',
      desc: 'Quantify current operational run-rate across perpetual licensing, on-premise hardware, vendor maintenance, and support teams.',
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Target SAP BTP Sizing',
      desc: 'Configure optimal SAP Integration Suite editions, tenant allocations, and annual message pack capacities tailored to workload demand.',
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <circle cx="12" cy="12" r="5" strokeWidth={2} />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Financial ROI & Payback Analysis',
      desc: 'Project multi-year cost reductions, net economic benefit, capital requirements, and verified break-even payback timelines.',
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      num: '05',
      title: 'AI Decision Intelligence',
      desc: 'Synthesize migration feasibility, identify risk drivers, evaluate architectural trade-offs, and recommend executive actions.',
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      num: '06',
      title: 'Executive Investment Business Case',
      desc: 'Deliver audit-ready board presentations, interactive scenario simulations, and verifiable business cases for C-level sign-off.',
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-r from-[#eef5fc] via-[#f2f7fc] to-[#e8f2fa] rounded-3xl border border-blue-100/80 p-6 sm:p-8 lg:p-10 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Headings, Subtitle & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Tagline */}
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase">
              ASSESS &nbsp;|&nbsp; PLAN &nbsp;|&nbsp; MIGRATE &nbsp;|&nbsp; REALIZE VALUE
            </p>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 leading-[1.14] tracking-tight">
              Turn Your Integration<br />
              Migration into<br />
              <span className="text-[#0070f2]">Business Value.</span>
            </h1>

            {/* Paragraph */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Simplify migration from SAP PI/PO, SAP BTP Neo environment, and third-party platforms to SAP Integration Suite with IntSwitch — an AI-driven integration tool. Streamline assessment, migration, and testing to reduce costs, minimize risks, and ensure seamless integration with SAP systems for enhanced scalability and agility.
            </p>

            {/* Powered by IntSwitch Card -> Links to /intswitch */}
            <div className="pt-0.5">
              <Link
                href="/intswitch"
                title="IntSwitch — Incture Migration Tool"
                className="group inline-flex flex-col bg-white/95 backdrop-blur-md rounded-xl p-2.5 sm:py-2.5 sm:px-3.5 border border-blue-100/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer w-fit max-w-[420px]"
              >
                {/* Powered by label */}
                <div className="text-[10.5px] font-bold text-purple-600 tracking-wide mb-1">
                  Powered by
                </div>

                <div className="flex items-center space-x-3">
                  {/* Left: Power Icon + IntSwitch & Incture Migration Tool */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50/90 border border-blue-100 flex items-center justify-center text-[#0070f2] shrink-0 group-hover:scale-105 transition-transform">
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 2v9" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M18.36 6.64a9 9 0 11-12.73 0" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#0070f2] leading-none group-hover:text-blue-700 transition-colors">
                        IntSwitch
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                        Incture Migration And <br />Automation Tool
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-7 w-px bg-slate-200 shrink-0 mx-1" />

                  {/* Middle Text: Accelerate your migration journey */}
                  <div className="shrink-0 pr-1">
                    <p className="text-[11.5px] sm:text-xs font-semibold text-slate-700 leading-tight">
                      Accelerate your<br />migration journey
                    </p>
                  </div>

                  {/* Right Circle Arrow Button */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 border border-blue-100 text-[#0070f2] group-hover:bg-[#0070f2] group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs">
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3.5l4.5 4.5-4.5 4.5" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* 3 Action Buttons strictly in ONE Row with Subtext */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 w-full">
              {/* Button 1: Explore Package Offerings (Navigates to /offerings) */}
              <div className="flex flex-col">
                <Link
                  href="/offerings"
                  className="group inline-flex items-center justify-center space-x-1 px-2 sm:px-2.5 py-2 min-h-[46px] rounded-xl text-[11px] sm:text-[11.5px] lg:text-xs font-bold bg-[#0070f2] hover:bg-[#0057d2] text-white shadow-xs transition-all cursor-pointer text-center leading-tight"
                >
                  <span>Explore Package Offerings</span>
                  <svg className="w-3 h-3 shrink-0 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
                  </svg>
                </Link>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1.5 text-center leading-tight">
                  Discover how Incture can help
                </span>
              </div>

              {/* Button 2: Customer Success (Redirects to https://incture.com/case-studies/) */}
              <div className="flex flex-col">
                <a
                  href="https://incture.com/case-studies/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center space-x-1 px-2 sm:px-2.5 py-2 min-h-[46px] rounded-xl text-[11px] sm:text-[11.5px] lg:text-xs font-bold bg-white hover:bg-slate-50 text-[#0070f2] border border-[#0070f2]/40 shadow-xs transition-all cursor-pointer text-center leading-tight"
                >
                  <span>Customer Success</span>
                  <svg className="w-3 h-3 shrink-0 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
                  </svg>
                </a>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1.5 text-center leading-tight">
                  See real-world transformation stories
                </span>
              </div>

              {/* Button 3: Start Custom Assessment */}
              <div className="flex flex-col">
                <Link
                  href="/assessment"
                  className="group inline-flex items-center justify-center space-x-1 px-2 sm:px-2.5 py-2 min-h-[46px] rounded-xl text-[11px] sm:text-[11.5px] lg:text-xs font-bold bg-[#7928ca] hover:bg-[#6820b0] text-white shadow-xs transition-all cursor-pointer text-center leading-tight"
                >
                  <span>Discover Business Value</span>
                  <svg className="w-3 h-3 shrink-0 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
                  </svg>
                </Link>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1.5 text-center leading-tight">
                  Get your personalized business case
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Architecture Diagram */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end items-center">
            <div className="w-full rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white hover:shadow-lg transition-all">
              <img
                src="/images/hero-architecture-diagram.jpg?v=platforms"
                alt="Integration Migration Architecture to SAP BTP Integration Suite"
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Badges (4 Horizontal Badges in White Card) */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Badge 1 */}
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0070f2] shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">Lower TCO with AI Insights</h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">Identify cost savings and optimize investments</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0070f2] shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">Faster Time to Value</h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">Accelerate migration planning and execution</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0070f2] shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <circle cx="12" cy="12" r="3" strokeWidth={2} />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">Informed AI-Driven Decisions</h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">Leverage AI for accurate recommendations</p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0070f2] shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">Quantifiable Business Value</h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">Measure ROI, payback and long-term business impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 6-Step ValueLens Process */}
      <section className="space-y-6">
        <div className="text-center space-y-1 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            The 6-Step ValueLens Process
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            From raw interface telemetry to audit-ready executive investment proposals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg font-black text-indigo-600 font-mono">{step.num}</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Migration Scenario: SAP PI/PO to SAP BTP */}
      <section className="relative rounded-3xl overflow-hidden shadow-xs border border-slate-200/90 bg-white hover:shadow-md transition-shadow">
        <img
          src="/images/featured-sap-pipo-scenario.png?v=2"
          alt="Featured Migration Scenario: SAP PI/PO to SAP BTP"
          className="w-full h-auto object-contain block select-none"
        />
        {/* Exact Clickable Overlay for 'Assess Your SAP PI/PO Landscape' Button */}
        <Link
          href="/assessment"
          style={{
            left: '73.34%',
            top: '81.77%',
            width: '22.27%',
            height: '9.38%',
          }}
          className="absolute rounded-lg cursor-pointer transition-all hover:bg-white/10 active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          title="Assess Your SAP PI/PO Landscape"
        />
      </section>
    </div>
  );
}
