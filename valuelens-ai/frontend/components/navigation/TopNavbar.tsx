'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TopNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Packages', href: '/offerings' },
    { label: 'Business Value', href: '/assessment' },
    { label: 'Dashboard', href: '/dashboard/demo-assessment-1' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#d9e2ec] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center space-x-8 sm:space-x-10 lg:space-x-12 h-[68px]">
          {/* Left: Incture Logo (redirects to incture.com) | Business ValueLens AI */}
          <div className="flex items-center space-x-3.5 shrink-0">
            <a
              href="https://incture.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-85 transition-opacity"
              title="Visit Incture.com"
            >
              <img
                src="/images/incture-logo.png"
                alt="Incture"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </a>
            <span className="h-5 w-px bg-[#d9e2ec]"></span>
            <Link href="/" className="flex items-center group">
              <img
                src="/images/business-valuelens-ai-logo.png?v=newlogo"
                alt="Business ValueLens AI"
                className="h-8 sm:h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          {/* Nav Links: SAP Standard Enterprise Tab Bar immediately following brand */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && !link.href.includes('#') && pathname?.startsWith(link.href.split('/')[1] ? `/${link.href.split('/')[1]}` : ''));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[14px] lg:text-[15px] transition-all px-3.5 sm:px-4 py-2 rounded-lg ${
                    isActive
                      ? 'text-[#0070f2] font-semibold bg-[#e5f0ff]/50 border-b-2 border-[#0070f2]'
                      : 'text-[#556b82] font-medium hover:text-[#0070f2] hover:bg-slate-50 border-b-2 border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
