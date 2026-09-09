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
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Brand */}
          <div className="flex items-center space-x-3 w-64 shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900">ValueLens</span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs">
                    AI
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 tracking-wide uppercase">Migration Economics</p>
              </div>
            </Link>
          </div>

          {/* Center: Centered Navigation Links */}
          <nav className="hidden md:flex items-center justify-center space-x-1.5 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href.split('/')[1] ? `/${link.href.split('/')[1]}` : ''));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Optical Balancer (maintains centered navigation) */}
          <div className="hidden md:block w-64 shrink-0" />
        </div>
      </div>
    </header>
  );
}
