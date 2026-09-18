'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

interface SocialAuthProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export function SocialAuthButtons({ mode, onSuccess, onError }: SocialAuthProps) {
  const { loginWithGoogle, loginWithMicrosoft } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [googleAvailable, setGoogleAvailable] = useState<boolean>(false);
  const [msLoading, setMsLoading] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const msClientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || '';

  // Initialize official Google Identity Services
  useEffect(() => {
    if (!googleClientId) {
      setGoogleAvailable(false);
      return;
    }

    const scriptId = 'google-identity-services-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initGsi = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        setGoogleAvailable(true);
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response: any) => {
              if (response.credential) {
                try {
                  await loginWithGoogle(response.credential);
                  if (onSuccess) onSuccess();
                } catch (err: any) {
                  if (onError) onError(err.message || 'Google sign-in failed');
                }
              }
            },
            auto_select: false,
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: mode === 'signup' ? 'signup_with' : 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: '100%',
            });
          }
        } catch (e) {
          console.error('Google Identity initialization error', e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    } else {
      initGsi();
    }
  }, [googleClientId, mode, loginWithGoogle, onSuccess, onError]);

  const handleMicrosoftAuth = async () => {
    setMsLoading(true);
    try {
      if (!msClientId) {
        if (onError) {
          onError('Microsoft sign-in requires MICROSOFT_CLIENT_ID in configuration.');
        }
        return;
      }
      const redirectUri = window.location.origin + '/login';
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${msClientId}&response_type=token&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=openid%20profile%20email%20User.Read`;

      window.location.href = authUrl;
    } catch (err: any) {
      if (onError) onError(err.message || 'Microsoft sign-in failed');
    } finally {
      setMsLoading(false);
    }
  };

  const handleGoogleFallbackClick = () => {
    if (!googleClientId) {
      if (onError) {
        onError('Google sign-in requires NEXT_PUBLIC_GOOGLE_CLIENT_ID in configuration.');
      }
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* 1. Official Microsoft Sign-In Button */}
      <button
        type="button"
        onClick={handleMicrosoftAuth}
        disabled={msLoading}
        className="w-full h-[46px] flex items-center justify-center space-x-3 px-4 rounded-xl border border-[#d9e2ec] bg-white hover:bg-slate-50 text-[#1d2d3e] font-semibold text-[14px] shadow-xs hover:border-[#0070f2] transition-all cursor-pointer disabled:opacity-50"
      >
        {/* Microsoft 4-square icon */}
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
          <path fill="#f25022" d="M1 1h9v9H1z" />
          <path fill="#00a4ef" d="M1 11h9v9H1z" />
          <path fill="#7fba00" d="M11 1h9v9H11z" />
          <path fill="#ffb900" d="M11 11h9v9H11z" />
        </svg>
        <span>
          {msLoading
            ? 'Connecting to Microsoft...'
            : mode === 'signup'
            ? 'Sign up with Microsoft'
            : 'Sign in with Microsoft'}
        </span>
      </button>

      {/* 2. Official Google Sign-In Button (Full Width, Perfectly Aligned) */}
      <div className="w-full">
        {googleAvailable && googleClientId ? (
          <div ref={googleBtnRef} className="w-full flex justify-center [&>div]:!w-full [&_iframe]:!w-full" />
        ) : (
          <button
            type="button"
            onClick={handleGoogleFallbackClick}
            className="w-full h-[46px] flex items-center justify-center space-x-3 px-4 rounded-xl border border-[#d9e2ec] bg-white hover:bg-slate-50 text-[#1d2d3e] font-semibold text-[14px] shadow-xs hover:border-[#0070f2] transition-all cursor-pointer"
          >
            {/* Google G logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
