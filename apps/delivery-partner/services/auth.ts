import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    profileImage?: string;
}

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    login: (token: string, userData: User) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    async function loadStorageData() {
        try {
            const token = await AsyncStorage.getItem('partnerToken');
            const userStr = await AsyncStorage.getItem('partnerUser');

            if (token && userStr) {
                // We have a token and user, let's set them in state
                // To be safe, we could also verify the token with the backend here,
                // but setting it immediately is faster for offline support/fast launch
                setUser(JSON.parse(userStr));
            }
        } catch (error) {
            console.error('Failed to load auth data from storage:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(token: string, userData: User) {
        setIsLoading(true);
        try {
            await AsyncStorage.setItem('partnerToken', token);
            await AsyncStorage.setItem('partnerUser', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Failed to save auth data to storage:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    async function logout() {
        setIsLoading(true);
        try {
            await AsyncStorage.removeItem('partnerToken');
            await AsyncStorage.removeItem('partnerUser');
            setUser(null);
        } catch (error) {
            console.error('Failed to remove auth data from storage:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
