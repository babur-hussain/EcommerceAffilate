import axios from "axios";

// Use API proxy route to bypass CORS (requests go through Next.js server to live API)
const API_BASE = "/api-proxy";

// Create instance with proxy base URL
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

const initializeApi = async () => {
  if (typeof window === 'undefined') return;
  console.log("🚀 API Initialized via Proxy -> https://api.lfvs.in");
};

// Start initialization
initializeApi();

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
// Note: Don't redirect on 401 for profile/register endpoints - let the AuthContext handle it
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect for super-admin endpoints - AuthContext handles this
    const url = error.config?.url || "";
    if (url.includes("/super-admin/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
