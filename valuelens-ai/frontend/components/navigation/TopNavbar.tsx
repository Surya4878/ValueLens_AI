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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left: Incture Logo (redirects to incture.com) | Business ValueLens AI */}
          <div className="flex items-center space-x-3 shrink-0">
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
            <span className="h-5 w-px bg-slate-300"></span>
            <Link href="/" className="flex items-center group">
              <img
                src="/images/business-valuelens-ai-logo.png?v=newlogo"
                alt="Business ValueLens AI"
                className="h-8 sm:h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          {/* Nav Links: SAP Standard Fiori Horizon Tab Bar */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-8 ml-8 sm:ml-12 lg:ml-16">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && !link.href.includes('#') && pathname?.startsWith(link.href.split('/')[1] ? `/${link.href.split('/')[1]}` : ''));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-all pb-1.5 pt-1 ${
                    isActive
                      ? 'text-[#0070f2] font-bold border-b-2 border-[#0070f2]'
                      : 'text-[#556b82] font-semibold hover:text-[#0070f2] border-b-2 border-transparent'
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
