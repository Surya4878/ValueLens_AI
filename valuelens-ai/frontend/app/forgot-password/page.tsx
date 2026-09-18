import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password — Business ValueLens AI',
  description: 'Reset your Business ValueLens AI password.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      headerLink={{
        text: 'Remember your password?',
        actionText: 'Sign in',
        href: '/login',
      }}
    >
      <Suspense fallback={<div className="py-12 text-center text-[#556b82]">Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
