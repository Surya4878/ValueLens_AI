import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — Business ValueLens AI',
  description: 'Sign in to continue your integration migration journey with Business ValueLens AI.',
};

export default function LoginPage() {
  return (
    <AuthLayout
      headerLink={{
        text: 'New to ValueLens AI?',
        actionText: 'Create an account',
        href: '/register',
      }}
    >
      <Suspense fallback={<div className="py-12 text-center text-[#556b82]">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
