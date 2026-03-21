'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { MoodModal } from '@/components/mood-modal';

export interface User {
  _id?: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  provider?: 'local' | 'google';
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMoodModal, setShowMoodModal] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user || !token) return;

    const scheduleRandomMoodCheck = () => {
      const minMinutes = 5;
      const maxMinutes = 15;
      const randomMinutes = Math.random() * (maxMinutes - minMinutes) + minMinutes;
      const randomMs = randomMinutes * 60 * 1000;

      return setTimeout(() => {
        setShowMoodModal(true);
        scheduleRandomMoodCheck();
      }, randomMs);
    };

    const timeoutId = scheduleRandomMoodCheck();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, token]);

  const API_URL = "http://localhost:4000";

  const submitMood = async (mood: string) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_URL}/mood/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id, mood }),
      });

      if (!response.ok) {
        console.error('Failed to update mood');
      }
    } catch (error) {
      console.error('Error submitting mood:', error);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setTimeout(() => setShowMoodModal(true), 500);
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setTimeout(() => setShowMoodModal(true), 500);
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (googleToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Google login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setTimeout(() => setShowMoodModal(true), 500);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        googleLogin,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
      <MoodModal
        open={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        onMoodSelect={submitMood}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
