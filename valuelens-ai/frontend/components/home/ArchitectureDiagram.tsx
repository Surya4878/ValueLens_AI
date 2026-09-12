'use client';

import React from 'react';

export function ArchitectureDiagram() {
  const sourceCards = [
    {
      name: 'SAP Neo CPI',
      subtitle: 'Migrate. Modernize.',
      logo: '/images/logos/logo_neo_cpi.png',
      logoClass: 'h-6 sm:h-7 w-auto object-contain',
    },
    {
      name: 'SAP PI/PO',
      subtitle: 'Simplify. Transform.',
      logo: '/images/logos/logo_sap_pipo.png',
      logoClass: 'h-5 sm:h-6 w-auto object-contain',
    },
    {
      name: 'MuleSoft',
      subtitle: 'Integrate. Accelerate.',
      logo: '/images/logos/logo_mulesoft.png',
      logoClass: 'h-6 sm:h-7 w-auto object-contain',
    },
    {
      name: 'Boomi',
      subtitle: 'Connect. Grow.',
      logo: '/images/logos/logo_boomi.png',
      logoClass: 'h-6 sm:h-7 w-auto object-contain',
    },
  ];

  const targetCards = [
    {
      title: 'Lower TCO with AI Insights',
      icon: (
        <svg className="w-5 h-5 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <ellipse cx="12" cy="6" rx="8" ry="3" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6v5c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5" />
        </svg>
      ),
    },
    {
      title: 'Faster Time to Value',
      icon: (
        <svg className="w-5 h-5 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
        </svg>
      ),
    },
    {
      title: 'Informed AI-Driven Decisions',
      icon: (
        <svg className="w-5 h-5 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" strokeWidth={2} />
        </svg>
      ),
    },
    {
      title: 'Quantifiable Business Value',
      icon: (
        <svg className="w-5 h-5 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 19v-4m5 4V9m5 4V5m4 14H4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full relative rounded-3xl overflow-hidden border border-blue-100/90 shadow-lg bg-cover bg-right bg-no-repeat" style={{ backgroundImage: "url('/images/hero-building-bg.jpg')" }}>
      {/* Soft gradient wash overlay to guarantee high-contrast legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#eef5fc]/95 via-[#f0f6fc]/85 to-blue-50/60 pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-5 lg:p-6 space-y-5">
        {/* Main 3-Column Diagram Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-11 gap-2.5 sm:gap-3 items-center">
          
          {/* SVG Dotted Connectors Overlay (Visible on md+ screens) */}
          <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Left Cards to Center */}
            <path d="M 34,13 C 41,13 42,42 45,46" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 34,38 C 39,38 41,47 45,49" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 34,62 C 39,62 41,53 45,51" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 34,87 C 41,87 42,58 45,54" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2,2" />

            {/* Center to Right Cards */}
            <path d="M 55,46 C 58,42 59,13 66,13" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 55,49 C 59,47 61,38 66,38" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 55,51 C 59,53 61,62 66,62" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 55,54 C 58,58 59,87 66,87" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2,2" />
          </svg>

          {/* Left Column: 4 Source Platforms */}
          <div className="md:col-span-4 space-y-2.5 z-10">
            {sourceCards.map((card, i) => (
              <div
                key={i}
                className="bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex items-center space-x-2.5 group"
              >
                <div className="w-10 h-8 sm:w-11 sm:h-8 flex items-center justify-center shrink-0">
                  <img src={card.logo} alt={card.name} className={card.logoClass} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight group-hover:text-[#0070f2] transition-colors">
                    {card.name}
                  </h4>
                  <p className="text-[10px] sm:text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Center Column: SAP BTP Integration Suite */}
          <div className="md:col-span-3 flex justify-center z-10 py-2 md:py-0">
            <div className="w-full max-w-[195px] bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-md hover:shadow-lg hover:border-blue-400 transition-all flex flex-col items-center justify-center text-center space-y-2 group">
              <div className="w-14 h-11 flex items-center justify-center">
                <img
                  src="/images/logos/logo_btp_cloud.png"
                  alt="SAP BTP Cloud"
                  className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h3 className="text-xs sm:text-[13px] font-black text-slate-950 leading-tight">
                  SAP BTP<br />Integration Suite
                </h3>
                <p className="text-[9px] sm:text-[9.5px] text-slate-500 font-semibold mt-1">
                  Modernize | Simplify | Create Value
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Target Outcomes (Texts fully visible, no truncate!) */}
          <div className="md:col-span-4 space-y-2.5 z-10">
            {targetCards.map((card, i) => (
              <div
                key={i}
                className="bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex items-center space-x-2.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50/90 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  {card.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight group-hover:text-[#0070f2] transition-colors">
                    {card.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner Row: Modernize Faster | Reduce Costs | Accelerate Outcomes */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
          {/* Pillar 1 */}
          <div className="flex items-center space-x-2.5 px-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#0070f2] shrink-0">
              <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84" />
              </svg>
            </div>
            <div>
              <h5 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Modernize Faster</h5>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium">with AI</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-center space-x-2.5 px-2 sm:border-l border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#0070f2] shrink-0">
              <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <ellipse cx="12" cy="6" rx="8" ry="3" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
              </svg>
            </div>
            <div>
              <h5 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Reduce Costs</h5>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium">with Confidence</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-center space-x-2.5 px-2 sm:border-l border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#0070f2] shrink-0">
              <svg className="w-4 h-4 text-[#0070f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18h2v-4H6v4zm5 0h2V9h-2v9zm5 0h2V5h-2v13z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18" />
              </svg>
            </div>
            <div>
              <h5 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Accelerate</h5>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium">Business Outcomes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
