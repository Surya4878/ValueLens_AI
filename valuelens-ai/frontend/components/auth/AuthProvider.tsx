'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, RegisterStartResponse, AuthContextType } from '@/types/auth';
import { authClient } from '@/lib/auth/authClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function clearUserLocalCache() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('valuelens_active_assessment');
      localStorage.removeItem('valuelens_active_assessment_id');
      localStorage.removeItem('valuelens_active_calculation');
      localStorage.removeItem('valuelens_assessment_draft');
      localStorage.removeItem('valuelens_active_user_id');
      localStorage.removeItem('valuelens_active_user_email');
    } catch {
      // ignore
    }
  }
}

function syncAuthCookie(isAuthenticated: boolean, currentUser?: UserProfile | null) {
  if (typeof document !== 'undefined') {
    if (isAuthenticated && currentUser) {
      document.cookie = 'valuelens_client_auth=true; path=/; max-age=604800; SameSite=Lax';
      localStorage.setItem('valuelens_auth_status', 'authenticated');

      // If switching accounts on the same machine, wipe the other user's draft assessment inputs
      const previousUserId = localStorage.getItem('valuelens_active_user_id');
      if (previousUserId && previousUserId !== currentUser.id) {
        clearUserLocalCache();
      }
      localStorage.setItem('valuelens_active_user_id', currentUser.id);
      localStorage.setItem('valuelens_active_user_email', currentUser.email);
    } else {
      document.cookie = 'valuelens_client_auth=; path=/; max-age=0; SameSite=Lax';
      localStorage.removeItem('valuelens_auth_status');
      clearUserLocalCache();
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authClient.getMe();
      setUser(me);
      syncAuthCookie(!!me, me);
      return me;
    } catch {
      setUser(null);
      syncAuthCookie(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, pass: string, rememberMe = false) => {
    const loggedInUser = await authClient.login(email, pass, rememberMe);
    setUser(loggedInUser);
    syncAuthCookie(true, loggedInUser);
    return loggedInUser;
  };

  const registerStart = async (data: {
    fullName: string;
    email: string;
    companyName: string;
    password: string;
  }): Promise<RegisterStartResponse> => {
    return await authClient.registerStart(data);
  };

  const verifyOtp = async (email: string, otp: string) => {
    const verifiedUser = await authClient.registerVerify(email, otp);
    setUser(verifiedUser);
    syncAuthCookie(true, verifiedUser);
    return verifiedUser;
  };

  const resendOtp = async (email: string) => {
    return await authClient.resendOtp(email);
  };

  const loginWithGoogle = async (credential: string) => {
    const googleUser = await authClient.googleAuth(credential);
    setUser(googleUser);
    syncAuthCookie(true, googleUser);
    return googleUser;
  };

  const loginWithMicrosoft = async (token: string, email?: string, name?: string) => {
    const msUser = await authClient.microsoftAuth(token, email, name);
    setUser(msUser);
    syncAuthCookie(true, msUser);
    return msUser;
  };

  const logout = async () => {
    try {
      await authClient.logout();
    } finally {
      setUser(null);
      syncAuthCookie(false);
      clearUserLocalCache();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        registerStart,
        verifyOtp,
        resendOtp,
        loginWithGoogle,
        loginWithMicrosoft,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      login: async () => { throw new Error('Not within AuthProvider'); },
      registerStart: async () => { throw new Error('Not within AuthProvider'); },
      verifyOtp: async () => { throw new Error('Not within AuthProvider'); },
      resendOtp: async () => { throw new Error('Not within AuthProvider'); },
      loginWithGoogle: async () => { throw new Error('Not within AuthProvider'); },
      loginWithMicrosoft: async () => { throw new Error('Not within AuthProvider'); },
      logout: async () => {},
      refreshUser: async () => null,
    };
  }
  return context;
}
