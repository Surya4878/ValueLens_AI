import { UserProfile, RegisterStartResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

async function fetchAuthJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Essential for HttpOnly session cookie
  });

  const responseText = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(responseText);
  } catch {
    // raw text
  }

  if (!res.ok) {
    const errorMsg =
      json?.message ||
      json?.error?.message ||
      (typeof json === 'string' ? json : null) ||
      responseText ||
      `HTTP error ${res.status}`;
    throw new Error(errorMsg);
  }

  return json?.data !== undefined ? json.data : json;
}

export const authClient = {
  async registerStart(payload: {
    fullName: string;
    email: string;
    companyName: string;
    password: string;
  }): Promise<RegisterStartResponse> {
    return await fetchAuthJson<RegisterStartResponse>('/api/auth/register/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async registerVerify(email: string, otp: string): Promise<UserProfile> {
    return await fetchAuthJson<UserProfile>('/api/auth/register/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  async resendOtp(email: string): Promise<{ success: boolean; cooldownSeconds?: number; message?: string }> {
    return await fetchAuthJson<{ success: boolean; cooldownSeconds?: number; message?: string }>(
      '/api/auth/otp/resend',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
  },

  async login(email: string, password: string, rememberMe = false): Promise<UserProfile> {
    return await fetchAuthJson<UserProfile>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    });
  },

  async googleAuth(credential: string): Promise<UserProfile> {
    return await fetchAuthJson<UserProfile>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  },

  async microsoftAuth(token: string, email?: string, name?: string): Promise<UserProfile> {
    return await fetchAuthJson<UserProfile>('/api/auth/microsoft', {
      method: 'POST',
      body: JSON.stringify({ token, email, name }),
    });
  },

  async getMe(): Promise<UserProfile | null> {
    try {
      return await fetchAuthJson<UserProfile>('/api/auth/me');
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetchAuthJson('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return await fetchAuthJson<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return await fetchAuthJson<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};
