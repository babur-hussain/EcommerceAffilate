import axios, { AxiosInstance } from 'axios';
import { auth } from './firebase';

const LOCAL_API_URL = 'http://localhost:4000';
const LIVE_API_URL = 'http://3.208.16.32';

let currentBaseUrl = LOCAL_API_URL;
let isLive = false;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: currentBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.initialize();

    // Add auth interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Ensure we use the current base URL
        config.baseURL = currentBaseUrl;

        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const originalRequest = error.config;

        // Handle Network Errors - Fallback logic
        if (!error.response && error.message === 'Network Error' && !isLive && !originalRequest._retry) {
          console.warn('⚠️ Dashboard Local API unreachable. Switching to LIVE URL...');
          originalRequest._retry = true;

          currentBaseUrl = LIVE_API_URL;
          isLive = true;
          this.client.defaults.baseURL = LIVE_API_URL;
          originalRequest.baseURL = LIVE_API_URL;

          return this.client(originalRequest);
        }

        if (error.response?.status === 401) {
          // Handle unauthorized
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Initialize: Check Local Health
  private async initialize() {
    console.log('🚀 Initializing Dashboard API...');
    try {
      // Check local health
      const checkApi = axios.create({ timeout: 2000 });
      await checkApi.get(`${LOCAL_API_URL}/health`);

      console.log('✅ Dashboard connected to Local Server:', LOCAL_API_URL);
      currentBaseUrl = LOCAL_API_URL;
      isLive = false;
      this.client.defaults.baseURL = LOCAL_API_URL;
    } catch (e) {
      console.log('⚠️ Local Server unreachable. Dashboard switching to LIVE URL.');
      currentBaseUrl = LIVE_API_URL;
      isLive = true;
      this.client.defaults.baseURL = LIVE_API_URL;
    }
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
