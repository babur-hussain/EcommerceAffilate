import { getAuth } from 'firebase/auth';

const LOCAL_API_URL = 'http://localhost:4000/api';
const LIVE_API_URL = 'http://3.208.16.32/api';

// State to hold the current base URL
let currentBaseUrl: string | null = null;
let isCheckingHealth = false;

/**
 * Determines the API base URL to use.
 * Checks if local server is available, otherwise falls back to live.
 */
async function getBaseUrl(): Promise<string> {
  // If we already determined the URL, use it
  if (currentBaseUrl) return currentBaseUrl;

  // If we are already checking, wait a bit (simple simplistic approach)
  // In a real app we might want a promise queue, but this is sufficient for now
  if (isCheckingHealth) {
    // Wait for up to 1 second
    await new Promise(resolve => setTimeout(resolve, 500));
    if (currentBaseUrl) return currentBaseUrl;
  }

  isCheckingHealth = true;
  try {
    // Check local health
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s timeout

    // We try to fetch the health endpoint (assuming /api/health or just root /api response)
    // Actually typically health is at /health not /api/health based on backend app.ts
    // app.use(healthRouter) -> router.get("/health"...)
    // So we should check http://localhost:4000/health

    const checkUrl = 'http://localhost:4000/health';
    await fetch(checkUrl, { signal: controller.signal, method: 'GET' });
    clearTimeout(timeoutId);

    console.log('✅ Web configured to use LOCAL API:', LOCAL_API_URL);
    currentBaseUrl = LOCAL_API_URL;
  } catch (error) {
    console.log('⚠️ Local API unavailable, falling back to LIVE API:', LIVE_API_URL);
    currentBaseUrl = LIVE_API_URL;
  } finally {
    isCheckingHealth = false;
  }

  return currentBaseUrl!;
}

/**
 * Fetch helper that automatically includes Firebase ID token in Authorization header
 * Use this in client components to make authenticated API calls
 */
async function syncAuthCookie(idToken: string) {
  try {
    await fetch('/api/auth/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken }),
    });
  } catch (_) {
    // ignore sync errors; backend will handle 401 on next request
  }
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get cached ID token first
    let idToken = await user.getIdToken();

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${idToken}`);
    headers.set('Content-Type', 'application/json');

    const baseUrl = await getBaseUrl();
    let url = `${baseUrl}${endpoint}`;

    // Handle case where endpoint might already be a full URL (though unlikely with this util usage)
    if (endpoint.startsWith('http')) {
      url = endpoint;
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized, try one silent refresh and retry once
    if (response.status === 401) {
      try {
        idToken = await user.getIdToken(true);
        await syncAuthCookie(idToken);
        headers.set('Authorization', `Bearer ${idToken}`);
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (_) {
        // fall through, return original 401 response
      }
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    // If we had a connection error and were using local, we could try to switch to live here
    // But for now, we rely on the initial check functionality
    throw error;
  }
}

/**
 * Parse JSON response and handle common errors
 */
export async function parseApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      // Session expired
      throw new Error('Unauthorized - please login again');
    }
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Convenience function combining fetchWithAuth + parseApiResponse
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(endpoint, options);
  return parseApiResponse<T>(response);
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request
 */
export async function apiPut<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request
 */
export async function apiPatch<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}
