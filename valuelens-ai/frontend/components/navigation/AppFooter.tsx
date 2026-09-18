'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function AppFooter() {
  const pathname = usePathname();

  // Hide footer completely on authentication pages
  const isAuthPage =
    pathname === '/login' ||
    pathname?.startsWith('/login') ||
    pathname === '/register' ||
    pathname?.startsWith('/register') ||
    pathname === '/forgot-password' ||
    pathname?.startsWith('/forgot-password');

  if (isAuthPage) {
    return null;
  }

  return (
    <footer className="no-print bg-white border-t border-[#d9e2ec] py-6 sm:py-7 text-[#556b82]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand Identity (15px-17px scale) */}
        <div className="flex items-center space-x-4">
          <a
            href="https://incture.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-85 transition-opacity"
            title="Visit Incture.com"
          >
            <img
              src="/images/incture-logo.png"
              alt="Incture"
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </a>
          <span className="h-5 w-px bg-[#d9e2ec]"></span>
          <img
            src="/images/business-valuelens-ai-logo.png?v=newlogo"
            alt="Business ValueLens AI"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </div>

        {/* Middle: Powered by IntSwitch (14px-15px) */}
        <div className="flex items-center space-x-2.5 text-[#556b82] font-medium text-[14px] sm:text-[15px]">
          <span className="font-semibold text-[#556b82]">Powered by</span>
          <a
            href="/intswitch"
            className="inline-flex items-center hover:opacity-85 transition-opacity"
            title="Powered by Incture IntSwitch"
          >
            <img
              src="/images/intswitch-logo.png"
              alt="IntSwitch"
              className="h-6 w-auto object-contain"
            />
          </a>
        </div>

        {/* Right: Legal & Copyright (14px) */}
        <div className="flex flex-wrap items-center justify-center space-x-3.5 text-[14px] text-[#556b82]">
          <span className="hover:text-[#0070f2] cursor-pointer transition-colors font-medium">Privacy</span>
          <span className="text-[#d9e2ec]">|</span>
          <span className="hover:text-[#0070f2] cursor-pointer transition-colors font-medium">Terms</span>
          <span className="text-[#d9e2ec]">|</span>
          <span className="hover:text-[#0070f2] cursor-pointer transition-colors font-medium">Support</span>
          <span className="text-[#d9e2ec]">|</span>
          <span className="text-[14px] text-[#556b82] font-normal">© 2026 Incture. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
