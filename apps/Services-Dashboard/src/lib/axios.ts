import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
    (config) => {
        // You can retrieve the token from localStorage or cookies here
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized errors (e.g., redirect to login)
        if (error.response && error.response.status === 401) {
            // Potentially dispatch a logout action or redirect
            if (typeof window !== 'undefined') {
                // window.location.href = '/login'; // Uncomment to auto-redirect
            }
        }
        return Promise.reject(error);
    }
);

export default api;
