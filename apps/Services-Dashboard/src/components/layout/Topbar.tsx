'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

const pageTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/services': 'Services',
    '/categories': 'Service Categories',
    '/sub-categories': 'Sub-Categories',
    '/service-types': 'Service Types',
    '/providers': 'Service Providers',
    '/availability': 'Availability',
    '/bookings': 'Bookings',
    '/analytics': 'Analytics',
    '/users': 'Users',
    '/settings': 'Settings',
    '/rbac': 'Roles & Permissions',
};

export function Topbar() {
    const { user } = useAuth();
    const pathname = usePathname();
    const title = pageTitles[pathname] || 'Overview';

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/80 backdrop-blur-md px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <div className="flex items-center gap-3">
                {/* Search */}
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                    <Search className="h-[18px] w-[18px]" />
                </button>
                {/* Notifications */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
                {/* Divider */}
                <div className="h-8 w-px bg-gray-200" />
                {/* User */}
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
                        {(user?.name?.[0] || 'A').toUpperCase()}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name || 'User'}</p>
                        <p className="text-[11px] text-gray-500 leading-tight">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
