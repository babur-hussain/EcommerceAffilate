import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';
import { router } from 'expo-router';

const getBaseUrl = () => {
  // Check for EXPO_PUBLIC_API_URL or fallback to dynamic host
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;
  if (configuredUrl) return configuredUrl;

  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) {
    // Fallback to localhost if no hostUri (e.g. simulator)
    return 'http://192.168.29.193:4000';
  }

  // Use the same IP as the Expo Bundler
  const ip = hostUri.split(':')[0];
  return `http://${ip}:4000`;
};

const API_URL = getBaseUrl();
console.log('🚀 API_URL configured as:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  async (error) => {
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
      console.log('⚠️ Request failed. Attempting to fetch from device cache for:', error.config.url);

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

      console.warn('❌ Request failed/timed out and no cache available in device.');
    } else if (error.message === 'Network Error') {
      console.warn('❌ Network Error - Cannot reach server');
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
