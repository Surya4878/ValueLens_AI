'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, RegisterStartResponse, AuthContextType } from '@/types/auth';
import { authClient } from '@/lib/auth/authClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function syncAuthCookie(isAuthenticated: boolean) {
  if (typeof document !== 'undefined') {
    if (isAuthenticated) {
      document.cookie = 'valuelens_client_auth=true; path=/; max-age=604800; SameSite=Lax';
      localStorage.setItem('valuelens_auth_status', 'authenticated');
    } else {
      document.cookie = 'valuelens_client_auth=; path=/; max-age=0; SameSite=Lax';
      localStorage.removeItem('valuelens_auth_status');
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
      syncAuthCookie(!!me);
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
    syncAuthCookie(true);
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
    syncAuthCookie(true);
    return verifiedUser;
  };

  const resendOtp = async (email: string) => {
    return await authClient.resendOtp(email);
  };

  const loginWithGoogle = async (credential: string) => {
    const googleUser = await authClient.googleAuth(credential);
    setUser(googleUser);
    syncAuthCookie(true);
    return googleUser;
  };

  const loginWithMicrosoft = async (token: string, email?: string, name?: string) => {
    const msUser = await authClient.microsoftAuth(token, email, name);
    setUser(msUser);
    syncAuthCookie(true);
    return msUser;
  };

  const logout = async () => {
    await authClient.logout();
    setUser(null);
    syncAuthCookie(false);
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
