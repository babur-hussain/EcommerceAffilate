'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function BusinessPortal() {
  const { firebaseUser, backendUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser || !backendUser) {
      window.location.href = '/login';
      return;
    }

    const target = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:4000/admin';
    window.location.href = target;
  }, [firebaseUser, backendUser, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading Business Console...</p>
      </div>
    </div>
  );
}
