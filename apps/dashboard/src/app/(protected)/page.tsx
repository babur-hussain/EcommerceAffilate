'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function HomePage() {
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[HomePage] Setting up auth listener...');

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[HomePage] Auth state changed:', firebaseUser?.email || 'no user');

      if (!firebaseUser) {
        console.log('[HomePage] No Firebase user, redirecting to login');
        window.location.href = '/login';
        return;
      }

      try {
        // Get the Firebase ID token
        const token = await firebaseUser.getIdToken(true); // Force refresh token
        console.log('[HomePage] Got token, length:', token.length);

        // Fetch user profile through Next.js API route (avoids CORS issues)
        const response = await fetch('/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('[HomePage] API response:', response.status, data);

        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch user: ${response.status}`);
        }

        const userData = data.user;
        console.log('[HomePage] User profile fetched:', userData);

        // Redirect based on role
        let redirectPath = '/login';
        switch (userData.role) {
          case 'ADMIN':
            redirectPath = '/admin';
            break;
          case 'BUSINESS_OWNER':
          case 'BUSINESS_MANAGER':
          case 'BUSINESS_STAFF':
            redirectPath = '/seller';
            break;
          case 'SELLER_OWNER':
          case 'SELLER_MANAGER':
          case 'SELLER_STAFF':
            redirectPath = '/seller';
            break;
          case 'INFLUENCER':
            redirectPath = '/seller';
            break;
          default:
            setError(`No dashboard access for role: ${userData.role}`);
            setChecking(false);
            return;
        }

        console.log('[HomePage] Redirecting to:', redirectPath);
        window.location.href = redirectPath;
      } catch (err: any) {
        console.error('[HomePage] Error:', err);
        setError(err.message || 'Failed to load user profile');
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );
}
