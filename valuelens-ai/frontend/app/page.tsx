'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  const steps = [
    {
      num: '01',
      title: 'Landscape & Inventory Discovery',
      desc: 'Catalog SAP PI/PO interfaces, monthly message volumes, third-party adapters, and legacy ABAP/Java mapping complexity.',
    },
    {
      num: '02',
      title: 'Baseline TCO Modeling',
      desc: 'Quantify current operational run-rate across perpetual licensing, on-premise hardware, vendor maintenance, and support teams.',
    },
    {
      num: '03',
      title: 'Target SAP BTP Sizing',
      desc: 'Configure optimal SAP Integration Suite editions, tenant allocations, and annual message pack capacities tailored to workload demand.',
    },
    {
      num: '04',
      title: 'Financial ROI & Payback Analysis',
      desc: 'Project multi-year cost reductions, net economic benefit, capital requirements, and verified break-even payback timelines.',
    },
    {
      num: '05',
      title: 'AI Decision Intelligence',
      desc: 'Synthesize strategic migration feasibility, identify risk drivers, evaluate architectural trade-offs, and recommend executive actions.',
    },
    {
      num: '06',
      title: 'Executive Investment Business Case',
      desc: 'Deliver audit-ready board presentations, interactive scenario simulations, and verifiable business cases for C-level sign-off.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white">
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200">ValueLens AI • SAP PI/PO to SAP BTP Migration Economics</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            The Executive Standard for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
              SAP PI/PO to BTP Economics
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Authoritative, deterministic financial modeling combined with autonomous AI decision intelligence.
            Evaluate your transition from legacy SAP PI/PO NetWeaver dual-stack to SAP BTP Integration Suite with zero financial hallucinations.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard/demo-assessment-1"
              className="px-7 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
            >
              <span>Explore SAP PI/PO Case Study</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/assessment"
              className="px-7 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors"
            >
              Start Custom Assessment
            </Link>
          </div>


        </div>
      </section>

      {/* Featured Proof Point / Case Study Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200/80 p-8 shadow-xl shadow-slate-200/50">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Benchmark Production Case Study
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Global Enterprise Migration from SAP PI/PO 7.5
              </h2>
            </div>
            <Link
              href="/dashboard/demo-assessment-1"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>View Full Interactive Dashboard</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium uppercase block">Current TCO</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono block mt-1">
                $730,000
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Annual Run-Rate</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium uppercase block">BTP Target TCO</span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono block mt-1">
                $313,084
              </span>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">-57.11% Cost Reduction</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium uppercase block">Break-Even Horizon</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono block mt-1">
                8.64 Mo
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">$300,000 Migration Cost</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium uppercase block">5-Year Net Benefit</span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-900 font-mono block mt-1">
                $1,784,580
              </span>
              <span className="text-[11px] text-indigo-600 font-bold mt-1 block">594.86% 5-Yr ROI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized SAP PI/PO Platform Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Specialized Architecture
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            SAP PI/PO to SAP BTP Migration Architecture
          </h2>
          <p className="text-sm text-slate-500">
            Calibrated specifically for NetWeaver dual-stack and AEX migration to cloud-native SAP Integration Suite.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">SAP PI/PO (NetWeaver Dual-Stack & AEX)</h3>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block mt-0.5">
                  End-of-Life: Standard Support Ends 2027 / 2030
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Eliminate expensive on-premise hardware footprints, high third-party adapter contracts, and legacy ABAP/Java user-defined function bottlenecks by modernizing to SAP BTP Integration Suite.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Expected TCO Reduction</span>
                <span className="text-xl font-black text-emerald-600 font-mono mt-1 block">57.11% Annual Savings</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Average Payback</span>
                <span className="text-xl font-black text-indigo-600 font-mono mt-1 block">&lt; 9 Months Payback</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            The 6-Step ValueLens Process
          </h2>
          <p className="text-sm text-slate-500">
            From raw interface telemetry to audit-ready executive investment proposals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-2xl font-black text-indigo-600 font-mono">{step.num}</span>
              <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
