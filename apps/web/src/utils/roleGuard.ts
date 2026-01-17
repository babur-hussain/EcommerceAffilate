import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type Role = 'ADMIN' | 'BUSINESS_OWNER' | 'BUSINESS_MANAGER' | 'BUSINESS_STAFF' | 'INFLUENCER' | 'CUSTOMER';

export interface UserPayload {
  email?: string;
  role: Role;
  businessId?: string;
  exp?: number;
  iat?: number;
  sub?: string;
  id?: string;
}

const AUTH_COOKIE_NAME = 'auth_token';

const decodeBase64Url = (input: string) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
};

const parseJwt = (token: string): UserPayload | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const decoded = decodeBase64Url(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

// Returns the user payload if authorized for any of the roles; otherwise null
export async function requireRole(roles: Role[]): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = parseJwt(token);
  if (!payload?.role) return null;

  return roles.includes(payload.role) ? payload : null;
}

// Redirects unauthenticated/unauthorized users to login (or home).
export function redirectUnauthorized(target?: string) {
  if (target) {
    redirect(`/login?redirect=${encodeURIComponent(target)}`);
  }
  redirect('/');
}
