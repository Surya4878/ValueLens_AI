'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { OFFERINGS_DATA, PlatformOffering } from '@/data/offeringsData';

function highlightIntSwitch(text: string | undefined): React.ReactNode {
  if (!text) return text;
  if (!text.includes('IntSwitch')) return text;
  const parts = text.split(/(IntSwitch)/g);
  return parts.map((part, i) =>
    part === 'IntSwitch' ? (
      <span key={i} className="text-[#0070f2] font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function OfferingDetailPage() {
  const params = useParams();
  const platformSlug = (params?.platform as string) || 'sap-pipo';
  const offering: PlatformOffering | undefined = OFFERINGS_DATA[platformSlug];

  const [activeTab, setActiveTab] = useState<
    'packages' | 'whats-included' | 'approach' | 'enablement' | 'faqs'
  >('packages');

  if (!offering) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Offering not found</h2>
        <p className="text-sm text-slate-500">The requested migration offering does not exist.</p>
        <Link
          href="/offerings"
          className="inline-block px-4 py-2 rounded-lg bg-[#0070f2] text-white font-bold text-sm"
        >
          View all offerings
        </Link>
      </div>
    );
  }

  const { packages, pleaseNotes, whatsIncluded, migrationApproach, enablementAndSupport, faqs } = offering;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#556b82] font-medium">
        <Link href="/" className="hover:text-[#0070f2] transition-colors">
          Home
        </Link>
        <span>›</span>
        <Link href="/offerings" className="hover:text-[#0070f2] transition-colors">
          Packages
        </Link>
        <span>›</span>
        <span className="text-[#1d2d3e] font-semibold">{offering.shortTitle}</span>
      </nav>

      {/* 2. Hero Banner Section */}
      <section className="relative rounded-2xl bg-gradient-to-r from-[#eef5fc] via-[#f2f7fc] to-[#e8f2fa] border border-[#d9e2ec] p-6 sm:p-7 shadow-xs overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Architecture Transformation Graphic Lockup */}
          <div className="shrink-0 flex items-center">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-blue-200/80 p-4 sm:p-5 shadow-xs flex items-center space-x-4 w-full sm:w-[320px]">
              {/* Source Middleware Platform */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <img src={offering.logo} alt={offering.name} className="h-10 max-w-[80px] object-contain mb-1.5" />
                <span className="text-xs font-bold text-[#1d2d3e] tracking-tight leading-tight">
                  {offering.shortTitle}
                </span>
              </div>

              {/* SAP Directional Transition Arrow */}
              <div className="text-[#0070f2] shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 10h13m-4-4l4 4-4 4" />
                </svg>
              </div>

              {/* Target SAP Integration Suite */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <img src={offering.cloudLogo} alt="SAP Integration Suite" className="h-10 max-w-[80px] object-contain mb-1.5" />
                <span className="text-[11px] font-bold text-[#0070f2] tracking-tight leading-tight">
                  SAP Integration<br />Suite
                </span>
              </div>
            </div>
          </div>

          {/* Middle: Title & Subtitle */}
          <div className="flex-1 space-y-2 max-w-xl">
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#1d2d3e] tracking-tight leading-tight">
              {offering.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#556b82] leading-relaxed font-normal">
              {offering.heroSubtitle}
            </p>
          </div>

          {/* Right: Slogan & Building Graphic matching Reference Image 1 */}
          <div className="shrink-0 hidden lg:block">
            <img
              src="/images/offerings-detail-banner-right.png"
              alt="Modernize. Simplify. Create Value."
              className="h-28 lg:h-32 w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* 3. Interactive Tabs Navigation Bar with Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
        {/* Left: 5 Nav Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'packages'
              ? 'bg-[#0070f2] text-white shadow-xs'
              : 'bg-white text-[#556b82] hover:text-[#1d2d3e] hover:bg-slate-50 border border-[#d9e2ec]'
              }`}
          >
            Packages
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whats-included')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'whats-included'
              ? 'bg-[#0070f2] text-white shadow-xs'
              : 'bg-white text-[#556b82] hover:text-[#1d2d3e] hover:bg-slate-50 border border-[#d9e2ec]'
              }`}
          >
            What&apos;s Included
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approach')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'approach'
              ? 'bg-[#0070f2] text-white shadow-xs'
              : 'bg-white text-[#556b82] hover:text-[#1d2d3e] hover:bg-slate-50 border border-[#d9e2ec]'
              }`}
          >
            Migration Approach
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('enablement')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'enablement'
              ? 'bg-[#0070f2] text-white shadow-xs'
              : 'bg-white text-[#556b82] hover:text-[#1d2d3e] hover:bg-slate-50 border border-[#d9e2ec]'
              }`}
          >
            Enablement & Support
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'faqs'
              ? 'bg-[#0070f2] text-white shadow-xs'
              : 'bg-white text-[#556b82] hover:text-[#1d2d3e] hover:bg-slate-50 border border-[#d9e2ec]'
              }`}
          >
            FAQs
          </button>
        </div>

        {/* Right: Action Buttons (Download PDF & Discover Business Value) */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Button 1: Download Offering (PDF) */}
          <a
            href="/documents/Incture-Migration-Offering-SAP-Integration-Suite.pdf"
            download="Incture-Migration-Offering-SAP-Integration-Suite.pdf"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#0070f2] border border-[#0070f2]/40 hover:bg-blue-50/50 shadow-2xs transition-colors cursor-pointer"
            title="Download full 10-page Incture Migration Offering Report"
          >
            <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Offering (PDF)</span>
          </a>

          {/* Button 2: Discover Business Value (links to /assessment) */}
          <Link
            href="/assessment"
            className="group inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0070f2] hover:bg-[#0057d2] text-white shadow-xs transition-colors cursor-pointer"
          >
            <span>Discover Business Value</span>
            <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: PACKAGES (COMPARISON TABLE) */}
      {activeTab === 'packages' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#d9e2ec] overflow-hidden shadow-xs">
            <div className="p-5 border-b border-[#d9e2ec] bg-white">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1d2d3e] tracking-tight">
                Package Comparison
              </h2>
              <p className="text-xs text-[#556b82] mt-0.5">
                Detailed scope, deliverables, and commercial pricing model for {offering.name} migration.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#d9e2ec] text-xs">
                <thead className="bg-[#eef5fc]">
                  <tr>
                    <th scope="col" className="py-3 px-4 text-left font-bold text-[#1d2d3e] min-w-[200px]">
                      Features
                    </th>
                    {packages.hasStarter && (
                      <th scope="col" className="py-3 px-4 text-left font-bold text-[#1d2d3e] min-w-[150px]">
                        {packages.packageNames.starter}
                      </th>
                    )}
                    <th scope="col" className="py-3 px-4 text-left font-bold text-[#1d2d3e] min-w-[180px]">
                      {packages.packageNames.silver}
                    </th>
                    <th scope="col" className="py-3 px-4 text-left font-bold text-[#1d2d3e] min-w-[200px]">
                      {packages.packageNames.gold}
                    </th>
                    <th scope="col" className="py-3 px-4 text-left font-bold text-[#0070f2] min-w-[220px]">
                      {packages.packageNames.platinum}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {packages.rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={
                        row.highlight
                          ? 'bg-blue-50/40 font-semibold'
                          : idx % 2 === 0
                            ? 'bg-white'
                            : 'bg-slate-50/40'
                      }
                    >
                      {/* Feature Name */}
                      <td className="py-3 px-4 font-bold text-[#1d2d3e] align-top">
                        {highlightIntSwitch(row.feature)}
                      </td>

                      {/* Starter Package (if applicable) */}
                      {packages.hasStarter && (
                        <td className="py-3 px-4 text-[#556b82] align-top leading-relaxed">
                          {highlightIntSwitch(row.starter || '-')}
                        </td>
                      )}

                      {/* Silver Package */}
                      <td className="py-3 px-4 text-[#556b82] align-top leading-relaxed">
                        {highlightIntSwitch(row.silver)}
                      </td>

                      {/* Gold Package */}
                      <td className="py-3 px-4 text-[#556b82] align-top leading-relaxed">
                        {highlightIntSwitch(row.gold)}
                      </td>

                      {/* Platinum Package */}
                      <td
                        className={`py-3 px-4 align-top leading-relaxed ${row.highlight
                          ? 'text-[#0070f2] font-bold'
                          : 'text-[#1d2d3e] font-semibold'
                          }`}
                      >
                        {highlightIntSwitch(row.platinum)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Please Note Box */}
          <div className="rounded-2xl bg-[#f0f7ff] border border-blue-200/80 p-4 sm:p-5 shadow-2xs flex items-start space-x-3.5">
            <div className="w-6 h-6 rounded-full bg-[#0070f2] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              i
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="text-xs font-bold text-[#1d2d3e]">
                Please Note :
              </h4>
              <ul className="space-y-1 text-xs text-[#556b82] list-disc list-inside leading-relaxed font-normal">
                {pleaseNotes.map((note, nIdx) => (
                  <li key={nIdx}>{highlightIntSwitch(note)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: WHAT'S INCLUDED */}
      {activeTab === 'whats-included' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#d9e2ec] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1d2d3e] tracking-tight">
                {whatsIncluded.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#556b82] mt-1">
                {whatsIncluded.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whatsIncluded.items.map((item, iIdx) => (
                <div key={iIdx} className="bg-slate-50/70 rounded-xl p-5 border border-[#d9e2ec] space-y-3">
                  <h3 className="text-sm font-bold text-[#0070f2] flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#0070f2]" />
                    <span>{highlightIntSwitch(item.category)}</span>
                  </h3>
                  <ul className="space-y-2">
                    {item.details.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start space-x-2 text-xs text-[#1d2d3e] leading-relaxed">
                        <span className="text-[#107e3e] font-bold shrink-0">✓</span>
                        <span>{highlightIntSwitch(d)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: MIGRATION APPROACH */}
      {activeTab === 'approach' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#d9e2ec] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1d2d3e] tracking-tight">
                Proven 5-Phase Migration Methodology
              </h2>
              <p className="text-xs sm:text-sm text-[#556b82] mt-1">
                A predictable, accelerated path to SAP Integration Suite cutover.
              </p>
            </div>

            <div className="space-y-4">
              {migrationApproach.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-slate-50/70 rounded-xl p-4 sm:p-5 border border-[#d9e2ec] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0070f2] text-white font-bold text-sm flex items-center justify-center shrink-0">
                      0{step.stepNumber}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-[#1d2d3e]">{step.title}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0070f2]">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-xs text-[#556b82] mt-1 max-w-xl leading-relaxed">
                        {highlightIntSwitch(step.description)}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] font-bold text-[#556b82] uppercase tracking-wider block">
                      Key Deliverables
                    </span>
                    <p className="text-xs font-semibold text-[#0070f2] mt-0.5">
                      {step.deliverables.map((deliv, dIdx) => (
                        <React.Fragment key={dIdx}>
                          {dIdx > 0 && ' • '}
                          {highlightIntSwitch(deliv)}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: ENABLEMENT & SUPPORT */}
      {activeTab === 'enablement' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#d9e2ec] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1d2d3e] tracking-tight">
                Enablement &amp; Hypercare Support
              </h2>
              <p className="text-xs sm:text-sm text-[#556b82] mt-1">
                Ensuring your internal teams are fully self-sufficient post-migration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enablementAndSupport.map((cat, eIdx) => (
                <div key={eIdx} className="bg-slate-50/70 rounded-xl p-5 border border-[#d9e2ec] space-y-3">
                  <h3 className="text-sm font-bold text-[#1d2d3e]">{cat.category}</h3>
                  <p className="text-xs text-[#556b82] leading-relaxed font-normal">{cat.summary}</p>
                  <ul className="space-y-2 pt-1">
                    {cat.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start space-x-2 text-xs text-[#1d2d3e]">
                        <svg className="w-3.5 h-3.5 text-[#0070f2] shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
                        </svg>
                        <span>{highlightIntSwitch(h)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: FAQS */}
      {activeTab === 'faqs' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#d9e2ec] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1d2d3e] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-[#556b82] mt-1">
                Common questions regarding {offering.name} migration scoping and execution.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, fIdx) => (
                <div key={fIdx} className="bg-slate-50/60 rounded-xl p-5 border border-[#d9e2ec] space-y-2">
                  <h3 className="text-sm font-bold text-[#1d2d3e] flex items-start space-x-2">
                    <span className="text-[#0070f2] font-bold">Q:</span>
                    <span>{highlightIntSwitch(faq.question)}</span>
                  </h3>
                  <p className="text-xs text-[#556b82] leading-relaxed pl-5 font-normal">
                    {highlightIntSwitch(faq.answer)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
