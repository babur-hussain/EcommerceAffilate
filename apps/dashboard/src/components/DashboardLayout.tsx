'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={user.role} />
      
      <div className="ml-64">
        <Topbar />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
