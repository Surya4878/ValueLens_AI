'use client';

import React from 'react';
import Link from 'next/link';
import { OFFERINGS_DATA } from '@/data/offeringsData';

export default function OfferingsPage() {
  const platforms = Object.values(OFFERINGS_DATA);

  // Helper to render bullet icons matching Reference Image 2
  const renderBulletIcon = (iconType: string) => {
    switch (iconType) {
      case 'chart':
        return (
          <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12h6m-6 4h4m5-10v14a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2h7l5 5z" />
          </svg>
        );
      case 'wrench':
        return (
          <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" strokeWidth={2.2} />
          </svg>
        );
      case 'nodes':
        return (
          <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="18" cy="5" r="3" strokeWidth={2.2} />
            <circle cx="6" cy="12" r="3" strokeWidth={2.2} />
            <circle cx="18" cy="19" r="3" strokeWidth={2.2} />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeWidth={2.2} />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeWidth={2.2} />
          </svg>
        );
      case 'gear':
        return (
          <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth={2.2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        );
      case 'database':
        return (
          <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth={2.2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        );
      case 'link':
        return (
          <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth={2.2} />
          </svg>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-[#0070f2] transition-colors">
          Home
        </Link>
        <span>›</span>
        <span className="text-slate-900 font-semibold">Packages</span>
      </nav>

      {/* Hero Header Section */}
      <section className="relative rounded-3xl bg-gradient-to-r from-[#eef5fc] via-[#f2f7fc] to-[#e8f2fa] border border-blue-100/80 p-6 sm:p-8 lg:p-8 shadow-xs overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Title & Subtitle */}
          <div className="space-y-3 max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0b1b36] tracking-tight leading-tight">
              Migration Packages
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Choose your current integration platform to explore our migration packages and accelerate your journey to SAP Integration Suite.
            </p>
          </div>

          {/* Right Slogan & Building Graphic matching Reference Image 2 */}
          <div className="shrink-0 hidden sm:block">
            <img
              src="/images/offerings-hub-banner-right.png"
              alt="Different Platforms. A Smarter Path. A Greater Tomorrow."
              className="h-28 sm:h-32 lg:h-36 w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* 2x2 Grid of Middleware Options (4 Options) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {platforms.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 group"
          >
            {/* Left: Architecture Flow Lockup (Source Logo -> Target Cloud) */}
            <div className="flex items-center justify-center sm:justify-start space-x-3 bg-gradient-to-br from-slate-50/80 to-blue-50/40 p-4 rounded-xl border border-slate-100 shrink-0 min-w-[210px]">
              {/* Source Platform Logo Box */}
              <div className="w-20 h-20 bg-white rounded-xl border border-slate-200/80 p-2 flex flex-col items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <img src={p.logo} alt={p.name} className="h-8 max-w-[60px] object-contain mb-1" />
                <span className="text-[10.5px] font-extrabold text-slate-800 text-center leading-tight">
                  {p.shortTitle}
                </span>
              </div>

              {/* Directional Transition Arrow */}
              <div className="flex items-center px-1 text-[#0070f2]">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h13m-4-4l4 4-4 4" />
                </svg>
              </div>

              {/* Target: SAP Integration Suite Cloud Box */}
              <div className="w-20 h-20 bg-white rounded-xl border border-blue-200/80 p-2 flex flex-col items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <img src={p.cloudLogo} alt="SAP Integration Suite" className="h-8 max-w-[60px] object-contain mb-1" />
                <span className="text-[9.5px] font-extrabold text-[#0070f2] text-center leading-tight">
                  SAP Integration<br />Suite
                </span>
              </div>
            </div>

            {/* Right: Key Bullets & View Offering Action */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {/* Bullets List */}
              <ul className="space-y-2.5">
                {p.cardBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-50/90 border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
                      {renderBulletIcon(bullet.iconType)}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 leading-snug">
                      {bullet.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* View Offering Button */}
              <div className="pt-1">
                <Link
                  href={`/offerings/${p.slug}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold text-[#0070f2] bg-blue-50/60 hover:bg-[#0070f2] hover:text-white border border-[#0070f2]/40 hover:border-[#0070f2] shadow-2xs transition-all w-fit group/btn cursor-pointer"
                >
                  <span>View Offering</span>
                  <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover/btn:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3.5l4.5 4.5-4.5 4.5" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA Banner (Matching Reference Image 2) */}
      <section className="rounded-2xl bg-white border border-blue-100/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center space-x-4">
          {/* Blue Circle Icon */}
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0070f2] border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>

          {/* Text */}
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#0b1b36]">
              Not sure which offering fits your landscape?
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Use Business ValueLens AI to assess your current environment and get a personalized migration recommendation.
            </p>
          </div>
        </div>

        {/* Action Button: Discover Business Value -> /assessment */}
        <Link
          href="/assessment"
          className="group inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#7928ca] hover:bg-[#6820b0] text-white shadow-xs transition-colors shrink-0 whitespace-nowrap cursor-pointer"
        >
          <span>Discover Business Value</span>
          <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
