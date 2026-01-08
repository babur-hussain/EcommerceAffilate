'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DebugPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard Debug Info</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Auth State</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Firebase User:</strong> {firebaseUser ? firebaseUser.email : 'Not logged in'}</p>
            <p><strong>Firebase UID:</strong> {firebaseUser?.uid || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Database User</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{user.role}</span></p>
              <p><strong>Business ID:</strong> {user.businessId || 'None'}</p>
            </div>
          ) : (
            <p className="text-gray-500">No user data loaded from database</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Expected Redirect</h2>
          {user && (
            <div>
              <p className="mb-2">Based on role <strong>{user.role}</strong>, you should be redirected to:</p>
              {user.role === 'ADMIN' && <p className="text-green-600 font-semibold">→ /admin</p>}
              {['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF'].includes(user.role) && <p className="text-green-600 font-semibold">→ /seller</p>}
              {user.role === 'INFLUENCER' && <p className="text-green-600 font-semibold">→ /influencer</p>}
              {user.role === 'CUSTOMER' && <p className="text-red-600 font-semibold">Access Denied (CUSTOMER role)</p>}
            </div>
          )}
        </div>

        <div className="space-x-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Redirect
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
