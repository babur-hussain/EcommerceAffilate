import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('[API /me] No authorization header');
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    // Log token info (first/last few chars only for security)
    const token = authHeader.replace('Bearer ', '');
    console.log('[API /me] Token length:', token.length);
    console.log('[API /me] Token preview:', token.substring(0, 20) + '...' + token.substring(token.length - 20));
    console.log('[API /me] Calling backend:', `${BACKEND_URL}/api/me`);
    
    const response = await fetch(`${BACKEND_URL}/api/me`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    console.log('[API /me] Backend response status:', response.status);
    console.log('[API /me] Backend response body:', text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Invalid backend response', details: text }, { status: 500 });
    }
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API /me] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile', details: error.message }, { status: 500 });
  }
}
