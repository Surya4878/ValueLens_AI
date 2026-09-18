'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

interface RouteGuardProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/packages',
  '/offerings',
  '/intswitch',
  '/methodology',
  '/terms',
  '/privacy',
];

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.some((path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  });

  useEffect(() => {
    if (!loading && !isAuthenticated && !isPublic) {
      // Preserve intended return destination and replace history entry so back button doesn't loop
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?returnUrl=${returnUrl}`);
    }
  }, [loading, isAuthenticated, isPublic, pathname, router]);

  // If page is protected and still loading authentication or unauthenticated, show elegant loader
  if (!isPublic && (loading || !isAuthenticated)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#0070f2]/30 border-t-[#0070f2] rounded-full animate-spin" />
        <p className="text-[14px] text-[#556b82] font-medium">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
