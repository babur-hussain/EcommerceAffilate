'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

import { SellerAlarm } from './SellerAlarm';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
            <SellerAlarm />
            <Toaster position="top-right" />
        </AuthProvider>
    );
}
