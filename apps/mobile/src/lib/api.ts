import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  /*
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }
  */

  // Hardcode IP to ensure connectivity during dev
  return 'http://192.168.29.193:4000';

  /*
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) {
    return 'http://localhost:4000';
  }

  const ip = hostUri.split(':')[0];
  return `http://${ip}:4000`;
  */
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

// Cache key generator
const getCacheKey = (url: string, params: any) => {
  return `CACHE_${url}_${JSON.stringify(params || {})}`;
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

    // Enhanced error logging for debugging
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || isOffline) {
      console.log('⚠️ Network issue or offline. Attempting to fetch from cache...');

      if (error.config && error.config.method === 'get' && error.config.url) {
        try {
          const key = getCacheKey(error.config.url, error.config.params);
          const cachedData = await AsyncStorage.getItem(key);

          if (cachedData) {
            console.log('✅ Serving cached data for:', error.config.url);
            return {
              data: JSON.parse(cachedData),
              status: 200,
              statusText: 'OK',
              headers: {},
              config: error.config,
              request: {}
            };
          } else {
            console.log('ℹ️ No cached data found for:', error.config.url);
          }
        } catch (e) {
          console.error('Failed to retrieve cached response', e);
        }
      }

      console.warn('❌ Request failed/timed out and no cache available.');
    } else if (error.message === 'Network Error') {
      console.warn('❌ Network Error - Cannot reach server');
    }

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Navigation will be handled by auth context
    }
    return Promise.reject(error);
  }
);

export default api;
