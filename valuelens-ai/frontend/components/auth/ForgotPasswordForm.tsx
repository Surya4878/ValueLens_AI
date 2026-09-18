'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { authClient } from '@/lib/auth/authClient';

export function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Mode 1: Request Reset Link
  const [email, setEmail] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');

  // Mode 2: Reset Password (when token is in URL)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your work email.');
      return;
    }

    setLoading(true);
    try {
      const res = await authClient.forgotPassword(email.trim());
      setRequestMsg(res.message);
      setRequestSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authClient.resetPassword(token!, newPassword);
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  // State: Reset Success
  if (resetSuccess) {
    return (
      <div className="text-center space-y-6 py-4 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1d2d3e]">Password Updated</h2>
          <p className="text-[15px] text-[#556b82] mt-2">
            Your password has been changed successfully. You can now sign in with your new credentials.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full h-[46px] flex items-center justify-center space-x-2 rounded-xl bg-[#0070f2] hover:bg-[#0057d2] text-white font-bold text-[14px] shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <span>Sign In →</span>
        </button>
      </div>
    );
  }

  // State: Request Email Sent
  if (requestSent) {
    return (
      <div className="text-center space-y-6 py-4 animate-fadeIn">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#0070f2]">
          <Mail className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1d2d3e]">Check Your Inbox</h2>
          <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-2 leading-relaxed">
            {requestMsg}
          </p>
        </div>
        <Link
          href="/login"
          className="w-full h-[46px] flex items-center justify-center space-x-2 rounded-xl border border-[#d9e2ec] hover:bg-slate-50 text-[#1d2d3e] font-semibold text-[14px] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    );
  }

  // State: Has Token -> Enter New Password Form
  if (token) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] tracking-tight">
            Reset Password
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1.5 font-normal">
            Enter and confirm your new secure password below.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] sm:text-[14px] font-semibold text-[#1d2d3e] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556b82]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full h-[46px] pl-10 pr-11 rounded-xl border border-[#d9e2ec] bg-white text-[#1d2d3e] text-[14px] focus:outline-none focus:border-[#0070f2] focus:ring-2 focus:ring-[#0070f2]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#556b82] hover:text-[#1d2d3e]"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[13px] sm:text-[14px] font-semibold text-[#1d2d3e] mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556b82]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full h-[46px] pl-10 pr-4 rounded-xl border border-[#d9e2ec] bg-white text-[#1d2d3e] text-[14px] focus:outline-none focus:border-[#0070f2] focus:ring-2 focus:ring-[#0070f2]/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] flex items-center justify-center space-x-2 rounded-xl bg-[#0070f2] hover:bg-[#0057d2] text-white font-bold text-[14px] shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Default: Request Reset Link Form
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] tracking-tight">
          Forgot Password?
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1.5 font-normal">
          Enter your registered work email and we&apos;ll send you a password reset link.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRequestSubmit} className="space-y-4">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[46px] flex items-center justify-center space-x-2 rounded-xl bg-[#0070f2] hover:bg-[#0057d2] text-white font-bold text-[14px] shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
        >
          <span>{loading ? 'Sending Instructions...' : 'Send Reset Link'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center space-x-1.5 text-[13px] sm:text-[14px] font-semibold text-[#0070f2] hover:text-[#0057d2] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
