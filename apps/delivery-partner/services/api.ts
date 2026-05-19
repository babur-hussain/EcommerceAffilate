import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For physical devices on local network, use your machine's IP
// For Android emulator, use 10.0.2.2
// For iOS simulator, use localhost
// Use the IP address identified in the codebase as the default
export const API_URL = 'http://192.168.29.193:4000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('partnerToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token is invalid/expired. Clear it out.
            await AsyncStorage.removeItem('partnerToken');
            await AsyncStorage.removeItem('partnerUser');
            // We should ideally dispatch an event here to trigger logout in the UI,
            // but the next app start or protected route check will handle it.
        }
        return Promise.reject(error);
    }
);

export default api;
