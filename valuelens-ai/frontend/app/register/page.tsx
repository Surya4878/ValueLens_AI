import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Your Account — Business ValueLens AI',
  description: 'Create your Business ValueLens AI account and start your migration assessment.',
};

export default function RegisterPage() {
  return (
    <AuthLayout
      headerLink={{
        text: 'Already have an account?',
        actionText: 'Sign in',
        href: '/login',
      }}
    >
      <Suspense fallback={<div className="py-12 text-center text-[#556b82]">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
