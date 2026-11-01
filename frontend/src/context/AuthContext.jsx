import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState('');

  useEffect(() => {
    // 1. Check existing session without blocking guest navigation
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (err) {
        console.warn('Session check fallback to guest:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 2. Listen to real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.access_token) {
        localStorage.setItem('token', newSession.access_token);
      } else {
        localStorage.removeItem('token');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const openAuthModal = (reason = '') => {
    setAuthPromptReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthPromptReason('');
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.session) {
      setSession(data.session);
      setUser(data.user);
      localStorage.setItem('token', data.session.access_token);
    }
    closeAuthModal();
    return data;
  };

  const register = async (username, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    if (error) throw error;
    if (data.session) {
      setSession(data.session);
      setUser(data.user);
      localStorage.setItem('token', data.session.access_token);
      closeAuthModal();
    }
    return data;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('SignOut warning:', e);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    session,
    isGuest: !user,
    loading,
    isAuthModalOpen,
    authPromptReason,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
