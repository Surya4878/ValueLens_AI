'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TopNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Assessment', href: '/assessment' },
    { label: 'Dashboard', href: '/dashboard/demo-assessment-1' },
    { label: 'Scenarios', href: '/scenarios/demo-assessment-1' },
    { label: 'Insights', href: '/dashboard/demo-assessment-1#insights' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
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
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-1 leading-none">
                  <span className="text-xs sm:text-sm font-normal text-slate-800">Business</span>
                  <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900">ValueLens</span>
                  <span className="text-[10px] px-1 py-0.2 rounded font-bold uppercase tracking-wider bg-purple-600 text-white shadow-xs ml-0.5">
                    AI
                  </span>
                </div>
                <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">Migration Economics</p>
              </div>
            </Link>
          </div>

          {/* Right: Navigation Links */}
          <nav className="hidden md:flex items-center justify-end space-x-1.5 flex-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && !link.href.includes('#') && pathname?.startsWith(link.href.split('/')[1] ? `/${link.href.split('/')[1]}` : ''));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/90 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
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
