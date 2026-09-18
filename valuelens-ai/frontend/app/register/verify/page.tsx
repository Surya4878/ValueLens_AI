import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OtpVerification } from '@/components/auth/OtpVerification';

export const metadata: Metadata = {
  title: 'Verify Your Email — Business ValueLens AI',
  description: 'Verify your email with your 6-digit verification code to complete your registration.',
};

export default function RegisterVerifyPage() {
  return (
    <AuthLayout
      headerLink={{
        text: 'Need help?',
        actionText: 'Contact support',
        href: 'mailto:support@valuelens.incture.com',
      }}
    >
      <Suspense fallback={<div className="py-12 text-center text-[#556b82]">Loading verification...</div>}>
        <OtpVerification />
      </Suspense>
    </AuthLayout>
  );
}
