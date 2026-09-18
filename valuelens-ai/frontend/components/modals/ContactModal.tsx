'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  defaultRequestType?: 'Request a Demo' | 'Contact Us' | 'IntSwitch Demo';
  sourcePage?: string;
}

export function ContactModal({
  isOpen,
  onClose,
  title,
  defaultRequestType = 'Request a Demo',
  sourcePage = 'Website',
}: ContactModalProps) {
  const { user, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [requestType, setRequestType] = useState(defaultRequestType);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill logged-in user details if available
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.fullName && !fullName) setFullName(user.fullName);
      if (user.email && !email) setEmail(user.email);
      if (user.companyName && !companyName) setCompanyName(user.companyName);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    setRequestType(defaultRequestType);
    setSubmitted(false);
    setErrorMessage('');
  }, [isOpen, defaultRequestType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    setLoading(true);
    try {
      if (requestType.toLowerCase().includes('demo')) {
        await api.requestDemo({
          fullName: fullName.trim(),
          email: email.trim(),
          companyName: companyName.trim() || undefined,
          phone: phone.trim() || undefined,
          message: message.trim() || undefined,
          requestType,
          sourcePage,
        });
      } else {
        await api.sendContactInquiry({
          fullName: fullName.trim(),
          email: email.trim(),
          companyName: companyName.trim() || undefined,
          phone: phone.trim() || undefined,
          message: message.trim() || undefined,
          requestType,
          sourcePage,
        });
      }
      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message || 'Failed to submit request. Please try again.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-[22px] font-black text-slate-900">
              Request Received!
            </h3>

            <p className="text-[14px] sm:text-[15px] text-slate-600 leading-relaxed max-w-md mx-auto">
              Thank you, <strong className="text-slate-900">{fullName}</strong>. Your details have been sent directly to our Migration Specialists at <strong className="text-[#0070f2]">Incture</strong>. We will reach out to you at <strong className="text-slate-900">{email}</strong> shortly.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#0070f2] text-white font-bold text-[15px] hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070f2] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[20px] font-bold text-slate-900">
                  {title || (requestType.includes('Demo') ? 'Schedule a Product Demo' : 'Contact Our Team')}
                </h3>
                <p className="text-[13px] text-slate-500">
                  Connect with Incture integration migration specialists
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center space-x-2">
                <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surya Prakash"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0070f2] focus:ring-2 focus:ring-blue-100 outline-none text-[14px] text-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0070f2] focus:ring-2 focus:ring-blue-100 outline-none text-[14px] text-slate-800 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Incture Technologies"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0070f2] focus:ring-2 focus:ring-blue-100 outline-none text-[14px] text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0070f2] focus:ring-2 focus:ring-blue-100 outline-none text-[14px] text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                  Landscape / Project Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your current integration platform (e.g. SAP PO/PI, MuleSoft), interface volume, or target timeline..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0070f2] focus:ring-2 focus:ring-blue-100 outline-none text-[14px] text-slate-800 transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-semibold text-[14px] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#0070f2] hover:bg-blue-700 text-white font-bold text-[14px] shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading && (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                  )}
                  <span>{loading ? 'Sending...' : 'Submit Request'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
