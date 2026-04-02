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
    FolderTree,
    Layers,
    UserCheck,
    Shield,
    Sparkles,
    Wrench,
} from 'lucide-react';
import { Role } from '@/types/auth';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    roles: Role[];
    section?: string;
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT', 'SERVICE_MANAGER'],
    },
    {
        title: 'Services',
        href: '/services',
        icon: Package,
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER'],
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: FolderTree,
        roles: ['SUPER_ADMIN', 'SERVICE_MANAGER'],
        section: 'Marketplace',
    },
    {
        title: 'Sub-Categories',
        href: '/sub-categories',
        icon: Layers,
        roles: ['SUPER_ADMIN', 'SERVICE_MANAGER'],
        section: 'Marketplace',
    },
    {
        title: 'Service Types',
        href: '/service-types',
        icon: Wrench,
        roles: ['SUPER_ADMIN', 'SERVICE_MANAGER'],
        section: 'Marketplace',
    },
    {
        title: 'Providers',
        href: '/providers',
        icon: UserCheck,
        roles: ['SUPER_ADMIN', 'SERVICE_MANAGER'],
        section: 'Marketplace',
    },
    {
        title: 'Availability',
        href: '/availability',
        icon: Calendar,
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER'],
    },
    {
        title: 'Bookings',
        href: '/bookings',
        icon: FileText,
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT', 'SERVICE_MANAGER'],
    },
    {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart,
        roles: ['SUPER_ADMIN', 'COUNTRY_ADMIN', 'SERVICE_MANAGER'],
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
        icon: Shield,
        roles: ['SUPER_ADMIN'],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const filteredNavItems = navItems.filter((item) =>
        user && item.roles.includes(user.role)
    );

    // Group items by section
    let lastSection: string | undefined = undefined;

    return (
        <div
            className="flex h-screen w-64 flex-col"
            style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)' }}
        >
            {/* Logo */}
            <div className="flex h-16 items-center gap-2.5 px-6 border-b border-white/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                    <Sparkles className="h-4.5 w-4.5 text-cyan-300" />
                </div>
                <h1 className="text-lg font-bold text-white tracking-tight">Local For Vocal</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {filteredNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    const showSectionHeader = item.section && item.section !== lastSection;
                    lastSection = item.section;

                    return (
                        <React.Fragment key={item.href}>
                            {showSectionHeader && (
                                <div className="pt-5 pb-1.5 px-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-300/60">
                                        {item.section}
                                    </p>
                                </div>
                            )}
                            <Link
                                href={item.href}
                                className={cn(
                                    'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-white/15 text-white shadow-sm shadow-black/10 backdrop-blur-sm'
                                        : 'text-indigo-200 hover:bg-white/8 hover:text-white'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'mr-3 h-[18px] w-[18px] shrink-0',
                                        isActive ? 'text-cyan-300' : 'text-indigo-300 group-hover:text-indigo-100'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.title}
                                {isActive && (
                                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                                )}
                            </Link>
                        </React.Fragment>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 px-2 pb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-400 text-sm font-bold text-white">
                        {(user?.name?.[0] || 'A').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                        <p className="text-[11px] text-indigo-300 truncate">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-all"
                >
                    <LogOut className="mr-3 h-[18px] w-[18px] shrink-0 text-red-400 group-hover:text-red-300" aria-hidden="true" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
