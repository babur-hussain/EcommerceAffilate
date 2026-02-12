'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Settings,
    Users,
    Package,
    Calendar,
    BarChart,
    LogOut,
    FileText,
    Briefcase
} from 'lucide-react';
import { Role } from '@/types/auth';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    roles: Role[];
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'],
    },
    {
        title: 'Services',
        href: '/services',
        icon: Package,
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER'],
    },
    {
        title: 'Services',
        href: '/services',
        icon: Briefcase,
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER'],
    },
    {
        title: 'Availability',
        href: '/availability',
        icon: Calendar,
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER'],
    },
    {
        title: 'Bookings',
        href: '/bookings', // Re-using Booking icon or using a different one
        icon: FileText, // Swapped icon just to differentiate visually if needed, but keeping Calendar is fine if distinct
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'],
    },
    {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart,
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN'],
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
        roles: ['SUPER_ADMIN'],
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        roles: ['SUPER_ADMIN'],
    },
    {
        title: 'Roles & Permissions',
        href: '/rbac',
        icon: Users,
        roles: ['SUPER_ADMIN'],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const filteredNavItems = navItems.filter((item) =>
        user && item.roles.includes(user.role)
    );

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-white">
            <div className="flex h-16 items-center justify-center border-b px-6">
                <h1 className="text-xl font-bold text-gray-900">ServiceDash</h1>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {filteredNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'mr-3 h-5 w-5 flex-shrink-0',
                                    isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'
                                )}
                                aria-hidden="true"
                            />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t p-4">
                <button
                    onClick={logout}
                    className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    <LogOut
                        className="mr-3 h-5 w-5 flex-shrink-0 text-red-500 group-hover:text-red-600"
                        aria-hidden="true"
                    />
                    Sign out
                </button>
            </div>
        </div>
    );
}
