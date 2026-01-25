import axios from "axios";

// Use environment variable if available, otherwise fallback to localhost
const LOCAL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const LIVE_API_URL = "http://3.208.16.32";

const api = axios.create({
  baseURL: LOCAL_API_URL, // Default to local initially
  headers: {
    "Content-Type": "application/json",
  },
});

const checkConnection = async (url: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    // Attempt to hit the health endpoint
    const response = await fetch(`${url}/health`, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (e) {
    return false;
  }
};

const initializeApi = async () => {
  // Only run on client side
  if (typeof window === 'undefined') return;

  console.log("🚀 Initializing API...");
  const isLocalAlive = await checkConnection(LOCAL_API_URL);

  if (isLocalAlive) {
    console.log(`✅ Connected to Local Server: ${LOCAL_API_URL}`);
    api.defaults.baseURL = LOCAL_API_URL;
  } else {
    console.warn(`⚠️ Local Server unreachable. Switching to LIVE URL: ${LIVE_API_URL}`);
    api.defaults.baseURL = LIVE_API_URL;
  }
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
