'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger menu - mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>

        {/* Logo text for mobile (since sidebar is hidden) */}
        <span className="lg:hidden text-lg font-bold text-gray-900">ShopPlatform</span>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.email} className="w-8 h-8 rounded-full" />
            ) : (
              <UserIcon className="h-5 w-5 text-primary-600" />
            )}
          </div>
          <div className="text-sm hidden sm:block">
            <div className="font-medium text-gray-900">
              {user?.firstName || user?.email}
            </div>
            <div className="text-xs text-gray-500">{user?.role}</div>
            <div className="text-[10px] text-gray-400">
              ID: {user?.businessId || user?.id}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
