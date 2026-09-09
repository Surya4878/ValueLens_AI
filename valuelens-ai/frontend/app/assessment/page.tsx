'use client';

import React from 'react';
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard';

export default function AssessmentPage() {
  return (
    <div className="py-6 bg-slate-50 min-h-screen">
      <AssessmentWizard />
    </div>
  );
}
