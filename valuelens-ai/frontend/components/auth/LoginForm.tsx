'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const { login, loginWithMicrosoft, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle OAuth redirect fragments (Microsoft / Google)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    // 'state' param is set to 'google' in Google redirect URL so we can
    // distinguish it from a Microsoft redirect (which also returns access_token)
    const state = params.get('state') || '';

    // Google always returns an id_token (JWT). Prefer it over access_token.
    // Microsoft implicit flow returns only access_token (no id_token by default).
    if (idToken) {
      // Google redirect: id_token is the signed JWT we need to verify
      setLoading(true);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      loginWithGoogle(idToken)
        .then(() => router.push(returnUrl))
        .catch((err) => setError(err.message || 'Google sign-in failed'))
        .finally(() => setLoading(false));
    } else if (accessToken && !state.startsWith('google')) {
      // Microsoft redirect: opaque access_token, no id_token
      setLoading(true);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      loginWithMicrosoft(accessToken)
        .then(() => router.push(returnUrl))
        .catch((err) => setError(err.message || 'Microsoft sign-in failed'))
        .finally(() => setLoading(false));
    }
  }, [loginWithMicrosoft, loginWithGoogle, returnUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both work email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password, rememberMe);
      router.push(returnUrl);
    } catch (err: any) {
      const errMsg = err.message || 'Invalid email or password.';
      if (errMsg.includes('UNVERIFIED_EMAIL') || errMsg.toLowerCase().includes('not been verified')) {
        // Redirect to OTP verification screen with email prefilled
        router.push(`/register/verify?email=${encodeURIComponent(email.trim())}`);
        return;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] tracking-tight">
          Welcome Back
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1.5 font-normal">
          Sign in to continue your integration migration journey with Business ValueLens AI.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Work Email */}
        <div>
          <label className="block text-[13px] sm:text-[14px] font-semibold text-[#1d2d3e] mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556b82]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              className="w-full h-[46px] pl-10 pr-4 rounded-xl border border-[#d9e2ec] bg-white text-[#1d2d3e] text-[14px] placeholder-[#8c9ba5] focus:outline-none focus:border-[#0070f2] focus:ring-2 focus:ring-[#0070f2]/20 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[13px] sm:text-[14px] font-semibold text-[#1d2d3e] mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556b82]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full h-[46px] pl-10 pr-11 rounded-xl border border-[#d9e2ec] bg-white text-[#1d2d3e] text-[14px] placeholder-[#8c9ba5] focus:outline-none focus:border-[#0070f2] focus:ring-2 focus:ring-[#0070f2]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#556b82] hover:text-[#1d2d3e] cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-[13px]">
          <label className="flex items-center space-x-2 cursor-pointer select-none text-[#556b82]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-[#0070f2] rounded border-[#d9e2ec] focus:ring-[#0070f2] cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-medium text-[#0070f2] hover:text-[#0057d2] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[46px] flex items-center justify-center space-x-2 rounded-xl bg-[#0070f2] hover:bg-[#0057d2] text-white font-bold text-[14px] shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
        >
          <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#d9e2ec] w-full" />
        <span className="bg-white px-3 text-[12px] uppercase text-[#8c9ba5] font-medium tracking-wider absolute">
          or continue with
        </span>
      </div>

      {/* Official Social Buttons */}
      <SocialAuthButtons
        mode="signin"
        onSuccess={() => router.push(returnUrl)}
        onError={(err) => setError(err)}
      />

      {/* Bottom Switcher */}
      <div className="pt-2 text-center text-[13px] sm:text-[14px] text-[#556b82]">
        Don&apos;t have an account?{' '}
        <Link
          href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`}
          className="font-semibold text-[#0070f2] hover:text-[#0057d2] hover:underline"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
