'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeId = localStorage.getItem('valuelens_active_assessment_id');
      const activeAsmt = localStorage.getItem('valuelens_active_assessment');
      if (activeId && activeId !== 'demo-assessment-1') {
        router.replace(`/dashboard/${activeId}`);
        return;
      }
      if (activeAsmt) {
        try {
          const parsed = JSON.parse(activeAsmt);
          if (parsed?.id && parsed.id !== 'demo-assessment-1') {
            router.replace(`/dashboard/${parsed.id}`);
            return;
          }
        } catch {
          // ignore error
        }
      }
      // If user has no custom assessment, open clean initial zero-state dashboard
      router.replace('/dashboard/initial');
    }
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] text-slate-500 font-medium">Loading Dashboard...</p>
      </div>
    </div>
  );
}
