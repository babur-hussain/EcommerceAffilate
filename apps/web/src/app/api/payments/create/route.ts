import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

// Server-side API routes need the full backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function POST(req: Request) {
  try {
    // Get Authorization header from request (priority) or fall back to cookie
    const headersList = await headers();
    let token = headersList.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('auth_token')?.value;
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const res = await fetch(`${BACKEND_URL}/api/payments/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const error = data?.error || 'Failed to create payment order';
      return NextResponse.json({ error }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error('Payment create proxy error:', e);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
