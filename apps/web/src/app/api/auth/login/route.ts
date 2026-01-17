import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const backendRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok || !data?.token) {
      const error = data?.error ?? 'Login failed';
      return NextResponse.json({ error }, { status: backendRes.status || 400 });
    }

    const response = NextResponse.json({ role: data.role ?? 'CUSTOMER' });
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: data.token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
