'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    // Basic client-side protection (Server-side middleware should also be used)
    React.useEffect(() => {
        // Small delay to allow auth state to hydrate
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                // router.push('/login'); 
                // Commenting out redirect for now to allow dev verification of layout without login flow fully active yet
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [isAuthenticated, router]);

    if (!user) {
        // Return null or loading spinner while checking auth
        // For development visualization, we might want to show layout with mock data if needed
        // but strictly speaking should return null
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
