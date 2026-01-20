"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export type UserRole =
  | "ADMIN"
  | "BUSINESS_OWNER"
  | "BUSINESS_MANAGER"
  | "BUSINESS_STAFF"
  | "INFLUENCER"
  | "CUSTOMER";

export interface BackendUser {
  id: string;
  email: string;
  role: UserRole;
  businessId?: string;
  accountType?: string; // 'new' or 'convert' - from Firebase custom claims
  name?: string;
  phone?: string;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  idToken: string | null;
  backendUser: BackendUser | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cached user on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("auth_user");
      if (cached) {
        try {
          setBackendUser(JSON.parse(cached));
        } catch (e) {
          localStorage.removeItem("auth_user");
        }
      }
    }
  }, []);

  // Update cache whenever backendUser changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (backendUser) {
        localStorage.setItem("auth_user", JSON.stringify(backendUser));
      } else if (firebaseUser === null) {
        // Only clear cache if explicitly logged out (firebaseUser null)
        localStorage.removeItem("auth_user");
      }
    }
  }, [backendUser, firebaseUser]);

  // Refresh ID token
  const refreshToken = async (): Promise<string | null> => {
    try {
      if (!auth.currentUser) return null;
      const token = await auth.currentUser.getIdToken(true);
      setIdToken(token);
      // Sync server cookie for SSR/middleware silently
      fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).catch(() => { }); // Ignore sync errors
      return token;
    } catch (err) {
      console.warn("Failed to refresh token:", err);
      return null;
    }
  };

  // Fetch backend user info with retries
  const fetchBackendUser = async (token: string, retryCount = 0) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || "/api"}/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Handle Token Expiry (401)
        if (response.status === 401) {
          if (retryCount < 2) {
            console.log("Token expired, attempting refresh...");
            const refreshed = await refreshToken();
            if (refreshed) {
              return fetchBackendUser(refreshed, retryCount + 1);
            }
          }
          // If refresh fails or retries exhausted, only then log out
          console.error("Authentication failed permanently.");
          await handleLogout();
          return;
        }

        // Handle Banned/Inactive (403)
        if (response.status === 403) {
          console.warn("User forbidden, logging out.");
          await handleLogout();
          return;
        }

        // For 500s or other errors, DO NOT LOG OUT.
        // Keep the existing (cached) user if available.
        console.error(`Backend error: ${response.status}. Keeping cached session.`);
        // We throw here so the catch block handles "graceful degradation"
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.user) {
        // Check active status
        if (data.user.isActive === false || data.user.businessActive === false) {
          await handleLogout();
          return;
        }

        // Get custom claims
        let accountType = data.user.accountType;
        if (!accountType && auth.currentUser) {
          try {
            const tokenResult = await auth.currentUser.getIdTokenResult();
            accountType = tokenResult.claims.accountType;
          } catch (e) { }
        }

        // Success - Update State
        setBackendUser({
          id: data.user.id || data.user._id,
          email: data.user.email,
          role: data.user.role,
          businessId: data.user.businessId,
          accountType: accountType,
          name: data.user.name,
          phone: data.user.phone
        });
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching backend user:", err);
      // NETWORK ERROR: Do NOT log out.
      // If we have a cached user, we are fine.
      if (!backendUser) {
        setError("Offline mode / Network error");
      }
      // If we have backendUser, we just stay "logged in" with stale data.
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    // DEBUG: Version Check (Removed to reduce noise)
    // alert("SYSTEM CHECK: v3 (Redirect Debug)");

    // Check for redirect errors (Mobile)
    getRedirectResult(auth)
      .then((result) => {
        if (result) alert(`Redirect Success: ${result.user.email}`);
      })
      .catch((error) => {
        alert(`Redirect Error: ${error.code} - ${error.message}`);
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        if (user) {
          setFirebaseUser(user);
          const token = await user.getIdToken();
          setIdToken(token);

          // Initial fetch
          await fetchBackendUser(token);
        } else {
          // Explicit logout from Firebase
          setFirebaseUser(null);
          setIdToken(null);
          setBackendUser(null);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Silent Token Refresh Loop (Every 45 mins)
  useEffect(() => {
    if (!firebaseUser) return;
    const interval = setInterval(async () => {
      const token = await refreshToken();
      if (token) fetchBackendUser(token);
    }, 45 * 60 * 1000);
    return () => clearInterval(interval);
  }, [firebaseUser]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      // Clears state via onAuthStateChanged listener
      // Also manually clear to be instant
      setFirebaseUser(null);
      setBackendUser(null);
      localStorage.removeItem("auth_user");

      await fetch("/api/auth/logout", { method: "POST" }).catch(() => { });
      if (typeof window !== "undefined") window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    firebaseUser,
    idToken,
    backendUser,
    loading,
    error,
    logout: handleLogout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
