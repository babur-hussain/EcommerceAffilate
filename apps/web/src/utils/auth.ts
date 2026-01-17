const AUTH_COOKIE_NAME = 'auth_token';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';

const decodeBase64 = (input: string) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  if (typeof window === 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf8');
  }
  return atob(padded);
};

export const decodeJwtPayload = (token: string) => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = decodeBase64(payload);
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
};

/**
 * Get current user from Firebase auth context (client-side only)
 * Use this in client components with useAuth() hook
 */
export const getCurrentUser = async () => {
  try {
    if (typeof window === 'undefined') {
      // Server-side: use cookie-based auth (legacy)
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
      if (!token) return null;
      return decodeJwtPayload(token);
    }

    // Client-side: use Firebase auth context
    // Components should use useAuth() hook directly
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated (client-side)
 */
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return Boolean(user);
};

/**
 * Logout (client-side)
 * Requires AuthContext provider
 */
export const logout = async () => {
  if (typeof window !== 'undefined') {
    try {
      // Sign out from Firebase
      const { auth } = await import('@/lib/firebase');
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Redirect to login
    window.location.href = '/login';
  }
};

export { AUTH_COOKIE_NAME, API_BASE };
