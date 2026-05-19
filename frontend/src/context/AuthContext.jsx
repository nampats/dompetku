import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authClient } from '../lib/auth-client';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current session on mount
  const fetchSession = useCallback(async () => {
    try {
      const res = await authClient.getSession();
      if (res?.data?.user) {
        setUser(res.data.user);
        setSession(res.data.session);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch {
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Sign Up
  const signUp = async ({ name, email, password }) => {
    const res = await authClient.signUp.email({
      name,
      email,
      password,
    });
    if (res?.data?.user) {
      setUser(res.data.user);
      setSession(res.data.session);
    }
    return res;
  };

  // Sign In
  const signIn = async ({ email, password }) => {
    const res = await authClient.signIn.email({
      email,
      password,
    });
    if (res?.data?.user) {
      setUser(res.data.user);
      setSession(res.data.session);
    }
    return res;
  };

  // Sign Out
  const signOut = async () => {
    await authClient.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    refreshSession: fetchSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
