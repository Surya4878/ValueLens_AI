'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export function OtpVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const returnUrl = searchParams.get('returnUrl') || '/';

  const { verifyOtp, resendOtp } = useAuth();

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Masked email display helper
  const maskedEmail = React.useMemo(() => {
    if (!email || !email.includes('@')) return email || 'your email';
    const [name, domain] = email.split('@');
    if (name.length <= 1) return name + '****@' + domain;
    return name[0] + '******@' + domain;
  }, [email]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numeric
    const cleanVal = val.replace(/[^0-9]/g, '');
    if (!cleanVal) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    // Single digit input
    const updated = [...otpDigits];
    updated[index] = cleanVal[cleanVal.length - 1];
    setOtpDigits(updated);

    // Auto advance
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (pasted.length > 0) {
      const updated = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        updated[i] = pasted[i] || '';
      }
      setOtpDigits(updated);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, fullOtp);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    setError(null);
    try {
      await resendOtp(email);
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6 py-4 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1d2d3e]">
            Email verified successfully.
          </h2>
          <p className="text-[15px] text-[#556b82] mt-2">
            Your Business ValueLens AI account is ready.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(returnUrl)}
          className="w-full h-[48px] flex items-center justify-center space-x-2 rounded-xl bg-[#0070f2] hover:bg-[#0057d2] text-white font-bold text-[14px] shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <span>Continue to Business ValueLens AI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1d2d3e] tracking-tight">
          Verify Your Email
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1.5 font-normal">
          We&apos;ve sent a 6-digit verification code to your email address:
        </p>
        <p className="font-semibold text-[#0070f2] text-[15px] mt-1 tracking-wide">
          {maskedEmail}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 6 Digit Input Boxes */}
        <div className="flex justify-between items-center gap-2 sm:gap-3">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl border border-[#d9e2ec] bg-white text-[#1d2d3e] focus:outline-none focus:border-[#0070f2] focus:ring-4 focus:ring-[#0070f2]/15 transition-all shadow-xs"
            />
          ))}
        </div>

        {/* Primary Verify Button */}
        <button
          type="submit"
          disabled={loading || otpDigits.join('').length !== 6}
          className="w-full h-[46px] flex items-center justify-center space-x-2 rounded-xl bg-[#0070f2] hover:bg-[#0057d2] text-white font-bold text-[14px] shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
        >
          <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Resend & Change Email Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#556b82] pt-2">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center space-x-1.5 font-semibold text-[#0070f2] hover:text-[#0057d2] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Sending code...' : 'Resend OTP'}</span>
            </button>
          ) : (
            <span className="text-[#8c9ba5]">
              Resend code in <strong className="text-[#556b82]">{countdown}s</strong>
            </span>
          )}

          <Link
            href="/register"
            className="font-medium text-[#556b82] hover:text-[#0070f2] transition-colors"
          >
            Change Email
          </Link>
        </div>
      </form>
    </div>
  );
}
