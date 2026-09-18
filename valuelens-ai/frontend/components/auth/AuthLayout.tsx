'use client';

import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  headerLink?: {
    text: string;
    actionText: string;
    href: string;
  };
}

export function AuthLayout({ children, headerLink }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 py-12">
      {/* Main Centered Enterprise Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-[#d9e2ec] overflow-hidden p-8 sm:p-10 lg:p-12">
        {/* Top Brand Header */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-[#eef2f6]">
          {/* Incture + Business ValueLens AI Brand */}
          <div className="flex items-center space-x-3">
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
            <Link href="/" className="flex items-center">
              <img
                src="/images/business-valuelens-ai-logo.png?v=newlogo"
                alt="Business ValueLens AI"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Alternate Page Switcher Link */}
          {headerLink && (
            <div className="text-[13px] sm:text-[14px] text-[#556b82] text-right">
              <span className="hidden sm:inline">{headerLink.text} </span>
              <Link
                href={headerLink.href}
                className="font-semibold text-[#0070f2] hover:text-[#0057d2] transition-colors"
              >
                {headerLink.actionText}
              </Link>
            </div>
          )}
        </div>

        {/* Form Content Slot */}
        <div className="w-full">{children}</div>

        {/* Bottom Disclaimer */}
        {/* <div className="pt-8 mt-8 border-t border-[#eef2f6] text-center text-[12px] sm:text-[13px] text-[#556b82]">
          By continuing, you agree to our{' '}
          <a href="https://incture.com/terms-of-service/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0070f2]">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="https://incture.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0070f2]">
            Privacy Policy
          </a>
          .
          <p className="text-[11px] text-[#8c9ba5] mt-2">
            Incture Technologies • Business ValueLens AI • All rights reserved
          </p>
        </div> */}
      </div>
    </div>
  );
}
