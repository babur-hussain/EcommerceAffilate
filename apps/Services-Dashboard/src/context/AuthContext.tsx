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
            // Fetch user profile from your backend
            const response = await apiClient.get<{ user: User }>('/api/me');
            setUser(response.data.user);
        } catch (error) {
            console.error('[AuthContext] Failed to fetch user profile:', error);
            // Optional: Set mock user if strictly verifying UI without backend role support yet
            // But user wanted "Live Data", so we trust the API or fallback to restricted
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);
            if (fbUser) {
                await fetchUserProfile(fbUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await fetchUserProfile(userCredential.user);
    };

    const loginWithGoogle = async () => {
        const userCredential = await signInWithPopup(auth, googleProvider);
        await fetchUserProfile(userCredential.user);
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setFirebaseUser(null);
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
