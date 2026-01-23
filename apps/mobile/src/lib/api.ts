import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';
import { router } from 'expo-router';

const LIVE_URL = 'http://3.208.16.32';

const getLocalUrl = () => {
  if (!__DEV__) {
    return LIVE_URL;
  }

  // Use Expo's hostUri to determine local IP (works for Expo Go and builds if configured)
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) {
    // Fallback to localhost/emulator specific IPs or a specific local IP if needed
    // For Android Emulator: 10.0.2.2
    // For iOS Simulator: localhost
    // For iOS Simulator: localhost
    return 'http://localhost:4000'; // Default fallback for Simulator
  }

  // Use the same IP as the Expo Bundler
  const ip = hostUri.split(':')[0];
  return `http://${ip}:4000`;
};

const LOCAL_URL = getLocalUrl();

// Default to Local URL initially, but we will check health
let currentBaseUrl = LOCAL_URL;
let isLive = false;

console.log('🚀 Initializing API with Default Local URL:', currentBaseUrl);

const api = axios.create({
  baseURL: currentBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to check which server to use
const initializeApi = async () => {
  try {
    console.log(`Checking connection to LOCAL: ${LOCAL_URL}/health...`);
    // Create a temporary instance to avoid interceptors for this check
    const checkApi = axios.create({ timeout: 2000 });
    await checkApi.get(`${LOCAL_URL}/health`);

    currentBaseUrl = LOCAL_URL;
    isLive = false;
    api.defaults.baseURL = LOCAL_URL;
    console.log('✅ Connected to Local Server:', LOCAL_URL);
  } catch (error) {
    console.log('⚠️ Local Server unreachable. Switching to LIVE URL.');
    currentBaseUrl = LIVE_URL;
    isLive = true;
    api.defaults.baseURL = LIVE_URL;
    console.log('✅ Connected to Live Server:', LIVE_URL);
  }
};

// Start initialization
initializeApi();

// Cache key generator with sorted keys for determinism
const getCacheKey = (url: string, params: any) => {
  const sortedParams = params
    ? Object.keys(params).sort().reduce((obj: any, key) => {
      obj[key] = params[key];
      return obj;
    }, {})
    : {};
  return `CACHE_${url}_${JSON.stringify(sortedParams)}`;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Ensure we are using the current base URL if not already set specifically
    if (!config.baseURL || config.baseURL === LOCAL_URL || config.baseURL === LIVE_URL) {
      config.baseURL = currentBaseUrl;
    }

    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and caching
api.interceptors.response.use(
  async (response) => {
    // Cache successful GET requests
    if (response.config.method === 'get' && response.config.url) {
      try {
        const key = getCacheKey(response.config.url, response.config.params);
        await AsyncStorage.setItem(key, JSON.stringify(response.data));
      } catch (e) {
        console.error('Failed to cache response', e);
      }
    }
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // Handle Network Errors (Connection Refused, Timeout, etc.) - Fallback logic
    if (!error.response && error.message === 'Network Error' && !isLive && !originalRequest._retry) {
      console.warn('⚠️ Local API died/unreachable during request. Switching to LIVE URL fallback...');

      originalRequest._retry = true;

      // Switch Global State
      currentBaseUrl = LIVE_URL;
      isLive = true;
      api.defaults.baseURL = LIVE_URL;

      // Update this request
      originalRequest.baseURL = LIVE_URL;

      console.log('🚀 API_URL switched to:', currentBaseUrl);
      return api(originalRequest);
    }

    // Check network status
    const netInfo = await NetInfo.fetch();
    const isOffline = !netInfo.isConnected || !netInfo.isInternetReachable;

    // We check for a special header or config property to bypass cache on refresh
    const skipCache =
      error.config?.skipErrorCache ||
      (error.config?.headers && error.config.headers['x-skip-error-cache']);

    const shouldTryCache =
      error.config &&
      error.config.method === 'get' &&
      error.config.url &&
      !skipCache &&
      (!error.response || error.response.status !== 401);

    if (shouldTryCache) {
      console.log(`⚠️ Request failed (${error.message}). Attempting to fetch from device cache for:`, error.config.url);

      try {
        const key = getCacheKey(error.config.url, error.config.params);
        const cachedData = await AsyncStorage.getItem(key);

        if (cachedData) {
          console.log('✅ Serving cached data from device for:', error.config.url);
          return {
            data: JSON.parse(cachedData),
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config,
            request: {}
          };
        } else {
          console.log('ℹ️ No cached data found in device for:', error.config.url);
        }
      } catch (e) {
        console.error('Failed to retrieve cached response from device', e);
      }
    }

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Force navigation to login
      try {
        if (router.canDismiss()) {
          router.dismissAll();
        }
        router.replace('/login');
      } catch (e) {
        console.log("Navigation error on 401", e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
