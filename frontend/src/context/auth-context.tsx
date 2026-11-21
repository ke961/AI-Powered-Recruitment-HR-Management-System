'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  demoLogin: (role: 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER' | 'CANDIDATE') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_CREDENTIALS = {
  ADMIN: { email: 'admin@hireflow.ai', pass: 'Password123!', label: 'Admin (Sarah Vance)' },
  RECRUITER: { email: 'recruiter@hireflow.ai', pass: 'Password123!', label: 'Recruiter (Marcus Sterling)' },
  HIRING_MANAGER: { email: 'manager@hireflow.ai', pass: 'Password123!', label: 'Manager (Elena Rostova)' },
  CANDIDATE: { email: 'alex.chen@hireflow.ai', pass: 'Password123!', label: 'Candidate (Alex Chen)' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('hireflow_token');
    const savedUser = localStorage.getItem('hireflow_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // fallback
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password: pass });
      localStorage.setItem('hireflow_token', res.accessToken);
      localStorage.setItem('hireflow_user', JSON.stringify(res.user));
      setToken(res.accessToken);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER' | 'CANDIDATE') => {
    const creds = DEMO_CREDENTIALS[role];
    if (creds) {
      await login(creds.email, creds.pass);
    }
  };

  const logout = () => {
    localStorage.removeItem('hireflow_token');
    localStorage.removeItem('hireflow_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    try {
      const u = await api.getProfile();
      setUser(u);
      localStorage.setItem('hireflow_user', JSON.stringify(u));
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        demoLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
