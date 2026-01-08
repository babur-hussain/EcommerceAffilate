'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { apiClient } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (fbUser: FirebaseUser) => {
    try {
      console.log('[AuthContext] Fetching user profile for:', fbUser.email);
      const response = await apiClient.get<{ user: User }>('/api/me');
      console.log('[AuthContext] User profile fetched:', response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.error('[AuthContext] Failed to fetch user profile:', error);
      // Don't set user to null if API fails - keep Firebase user authenticated
      // This prevents infinite loops when backend is down
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!mounted) return;
      
      setFirebaseUser(fbUser);
      if (fbUser) {
        await fetchUserProfile(fbUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Logging in with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('[AuthContext] Firebase auth successful');
      await fetchUserProfile(userCredential.user);
      console.log('[AuthContext] Login complete');
    } catch (error) {
      console.error('[AuthContext] Login failed:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('[AuthContext] Logging in with Google');
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log('[AuthContext] Google auth successful');
      await fetchUserProfile(userCredential.user);
      console.log('[AuthContext] Google login complete');
    } catch (error) {
      console.error('[AuthContext] Google login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      await fetchUserProfile(firebaseUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
