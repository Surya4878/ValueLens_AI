'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Mail,
  Building2,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Circle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/assessment';

  const { registerStart } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live password validation checklist
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !companyName.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isPasswordValid) {
      setError('Password must satisfy all security requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerStart({
        fullName: fullName.trim(),
        email: email.trim(),
        companyName: companyName.trim(),
        password,
      });

      // Redirect to OTP verification screen with email prefilled
      const targetUrl = `/register/verify?email=${encodeURIComponent(
        email.trim()
      )}&returnUrl=${encodeURIComponent(returnUrl)}`;
      router.push(targetUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to start registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] tracking-tight">
          Create Your Account
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1.5 font-normal">
          Create your Business ValueLens AI account and start your migration assessment.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-[13px] sm:text-[14px] font-semibold text-[#1d2d3e] mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556b82]">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full h-[44px] pl-10 pr-4 rounded-xl border border-[#d9e2ec] bg-white text-[#1d2d3e] text-[14px] placeholder-[#8c9ba5] focus:outline-none focus:border-[#0070f2] focus:ring-2 focus:ring-[#0070f2]/20 transition-all"
            />
          </div>
        </div>

        {/* Work Email */}
        <div>
          <label className="block text-[13px] sm:text-[14px] font-semibold text-[#1d2d3e] mb-1">
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
              className="w-full h-[44px] pl-10 pr-4 rounded-xl border border-[#d9e2ec] bg-white text-[#1d2d3e] text-[14px] placeholder-[#8c9ba5] focus:outline-none focus:border-[#0070f2] focus:ring-2 focus:ring-[#0070f2]/20 transition-all"
            />
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-[13px] sm:text-[14px] font-semibold text-[#1d2d3e] mb-1">
            Company Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556b82]">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              required
              className="w-full h-[44px] pl-10 pr-4 rounded-xl border border-[#d9e2ec] bg-white text-[#1d2d3e] text-[14px] placeholder-[#8c9ba5] focus:outline-none focus:border-[#0070f2] focus:ring-2 focus:ring-[#0070f2]/20 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[13px] sm:text-[14px] font-semibold text-[#1d2d3e] mb-1">
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
              placeholder="Create a password"
              required
              className="w-full h-[44px] pl-10 pr-11 rounded-xl border border-[#d9e2ec] bg-white text-[#1d2d3e] text-[14px] placeholder-[#8c9ba5] focus:outline-none focus:border-[#0070f2] focus:ring-2 focus:ring-[#0070f2]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#556b82] hover:text-[#1d2d3e] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Criteria Checklist */}
        <div className="bg-slate-50 p-3 rounded-xl border border-[#e2e8f0] space-y-1.5 text-[12px] text-[#556b82]">
          <div className="flex items-center space-x-2">
            {hasMinLength ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className={hasMinLength ? 'text-emerald-700 font-medium' : ''}>
              At least 8 characters
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {hasUppercase ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className={hasUppercase ? 'text-emerald-700 font-medium' : ''}>
              Include an uppercase letter
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {hasNumber ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className={hasNumber ? 'text-emerald-700 font-medium' : ''}>
              Include a number
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {hasSpecial ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className={hasSpecial ? 'text-emerald-700 font-medium' : ''}>
              Include a special character
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[13px] sm:text-[14px] font-semibold text-[#1d2d3e] mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556b82]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full h-[44px] pl-10 pr-11 rounded-xl border border-[#d9e2ec] bg-white text-[#1d2d3e] text-[14px] placeholder-[#8c9ba5] focus:outline-none focus:border-[#0070f2] focus:ring-2 focus:ring-[#0070f2]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#556b82] hover:text-[#1d2d3e] cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terms Agreement Checkbox */}
        <label className="flex items-start space-x-2.5 cursor-pointer select-none text-[13px] text-[#556b82] pt-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-[#0070f2] rounded border-[#d9e2ec] focus:ring-[#0070f2] cursor-pointer"
          />
          <span>
            I agree to the{' '}
            <a
              href="https://incture.com/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0070f2] hover:underline"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://incture.com/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0070f2] hover:underline"
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>

        {/* Create Account Primary Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[46px] flex items-center justify-center space-x-2 rounded-xl bg-[#0070f2] hover:bg-[#0057d2] text-white font-bold text-[14px] shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 mt-2"
        >
          <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#d9e2ec] w-full" />
        <span className="bg-white px-3 text-[12px] uppercase text-[#8c9ba5] font-medium tracking-wider absolute">
          or sign up with
        </span>
      </div>

      {/* Official Social Buttons */}
      <SocialAuthButtons
        mode="signup"
        onSuccess={() => router.push(returnUrl)}
        onError={(err) => setError(err)}
      />

      {/* Bottom Switcher */}
      <div className="pt-2 text-center text-[13px] sm:text-[14px] text-[#556b82]">
        Already have an account?{' '}
        <Link
          href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
          className="font-semibold text-[#0070f2] hover:text-[#0057d2] hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
