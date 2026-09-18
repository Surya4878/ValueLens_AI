'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { ContactModal } from '@/components/modals/ContactModal';

export function TopNavbar() {
  const pathname = usePathname();
  const [contactModalOpen, setContactModalOpen] = React.useState(false);

  // Hide TopNavbar completely on authentication routes per user requirement
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

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Packages', href: '/offerings' },
    { label: 'Business Value', href: '/assessment' },
    { label: 'Dashboard', href: '/dashboard' },
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
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-1">
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

          {/* Right: Authenticated User Profile Badge OR Sign In / Register */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="text-[13px] sm:text-[14px] font-semibold text-[#556b82] hover:text-[#0070f2] transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
            >
              Contact Us
            </button>
            <UserProfileNav />
          </div>
        </div>
      </div>
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultRequestType="Request a Demo"
        sourcePage="TopNavbar"
        title="Request a Demo / Contact Us"
      />
    </header>
  );
}

function UserProfileNav() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />;
  }

  if (isAuthenticated && user) {
    // Generate initials (e.g. "SP" for Surya Prakash)
    const initials = user.fullName
      ? user.fullName
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'VL';

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2.5 p-1.5 pl-2.5 rounded-full border border-[#d9e2ec] hover:border-[#0070f2] bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          aria-expanded={dropdownOpen}
        >
          <span className="text-[13px] sm:text-[14px] font-semibold text-[#1d2d3e] hidden sm:inline max-w-[140px] truncate">
            {user.fullName}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#0070f2] text-white flex items-center justify-center font-bold text-[13px] tracking-wide shadow-xs">
            {initials}
          </div>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#d9e2ec] py-2 z-50 animate-fadeIn text-[#1d2d3e]">
            <div className="px-4 py-3 border-b border-[#e2e8f0]">
              <p className="text-[14px] font-bold truncate">{user.fullName}</p>
              <p className="text-[12px] text-[#556b82] truncate mt-0.5">{user.email}</p>
              {user.companyName && (
                <p className="text-[11px] text-[#0070f2] font-semibold tracking-wide uppercase mt-1 truncate">
                  {user.companyName}
                </p>
              )}
            </div>

            {/* My Assessments and Executive Dashboard links hidden per user request */}

            <div className="border-t border-[#e2e8f0] pt-1 mt-1">
              <button
                type="button"
                onClick={async () => {
                  setDropdownOpen(false);
                  await logout();
                  window.location.href = '/login';
                }}
                className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link
        href="/login"
        className="px-4 py-1.5 text-[13px] sm:text-[14px] font-bold rounded-xl bg-[#0070f2] hover:bg-[#0057d2] text-white shadow-2xs hover:shadow transition-all"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="px-3.5 py-1.5 text-[13px] sm:text-[14px] font-semibold text-[#556b82] hover:text-[#0070f2] transition-colors"
      >
        Create Account
      </Link>
    </div>
  );
}
