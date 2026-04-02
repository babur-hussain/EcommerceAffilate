import axios, { AxiosInstance } from 'axios';
import { auth } from './firebase';

// Always use the API URL from environment variable (live backend only)
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.lfvs.in';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });

        // Add auth interceptor
        this.client.interceptors.request.use(
            async (config) => {
                // Try Firebase auth first
                const user = auth.currentUser;
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    // Fallback: use stored token from localStorage if available
                    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
                    if (storedUser) {
                        try {
                            const parsed = JSON.parse(storedUser);
                            if (parsed.token) {
                                config.headers.Authorization = `Bearer ${parsed.token}`;
                            }
                        } catch { /* ignore parse errors */ }
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                // Don't auto-redirect on 401 — just reject the promise
                // so the calling code can handle the error gracefully
                if (error.response?.status === 401) {
                    console.warn('API returned 401 Unauthorized');
                }
                return Promise.reject(error);
            }
        );
    }

    get<T>(url: string, config?: any) {
        return this.client.get<T>(url, config);
    }

    post<T>(url: string, data?: any, config?: any) {
        return this.client.post<T>(url, data, config);
    }

    put<T>(url: string, data?: any, config?: any) {
        return this.client.put<T>(url, data, config);
    }

    delete<T>(url: string, config?: any) {
        return this.client.delete<T>(url, config);
    }

    patch<T>(url: string, data?: any, config?: any) {
        return this.client.patch<T>(url, data, config);
    }
}

export const apiClient = new ApiClient();
