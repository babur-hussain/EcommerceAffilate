import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decodeJwtPayload } from '@/utils/auth';

const AUTH_COOKIE_NAME = 'auth_token';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { email, role, exp } = payload;
  return NextResponse.json({ user: { email, role, exp } });
}
