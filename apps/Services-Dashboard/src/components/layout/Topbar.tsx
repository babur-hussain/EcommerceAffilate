'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon } from 'lucide-react';

export function Topbar() {
    const { user } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div className="flex items-center">
                {/* Breadcrumbs or Page Title could go here */}
                <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.role || 'Guest'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
