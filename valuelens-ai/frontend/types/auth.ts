export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  companyName?: string;
  provider: 'EMAIL' | 'GOOGLE' | 'MICROSOFT';
  emailVerified: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface RegisterStartResponse {
  success: boolean;
  verificationRequired: boolean;
  email: string;
  expiresInMinutes?: number;
  cooldownSeconds?: number;
}

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<UserProfile>;
  registerStart: (data: {
    fullName: string;
    email: string;
    companyName: string;
    password: string;
  }) => Promise<RegisterStartResponse>;
  verifyOtp: (email: string, otp: string) => Promise<UserProfile>;
  resendOtp: (email: string) => Promise<{ success: boolean; cooldownSeconds?: number }>;
  loginWithGoogle: (credential: string) => Promise<UserProfile>;
  loginWithMicrosoft: (token: string, email?: string, name?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<UserProfile | null>;
}
