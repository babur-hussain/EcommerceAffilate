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

  // Refresh ID token
  const refreshToken = async (): Promise<string | null> => {
    try {
      if (!firebaseUser) return null;
      const token = await firebaseUser.getIdToken(true);
      setIdToken(token);
      // Sync server cookie for SSR/middleware
      try {
        await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      } catch (_) {}
      return token;
    } catch (err) {
      console.error("Failed to refresh token:", err);
      setError("Session expired. Please login again.");
      return null;
    }
  };

  // Fetch backend user info
  const fetchBackendUser = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api"}/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try refresh once
          const refreshed = await refreshToken();
          if (refreshed) {
            return fetchBackendUser(refreshed);
          }
          // If refresh fails, clear everything
          setFirebaseUser(null);
          setIdToken(null);
          setBackendUser(null);
          setError(null);
          return;
        }
        if (response.status === 403) {
          // User forbidden or inactive - sign them out completely
          console.warn("User forbidden or inactive, logging out");
          await signOut(auth);
          setFirebaseUser(null);
          setIdToken(null);
          setBackendUser(null);
          setError(null);
          return;
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.user) {
        if (
          data.user.isActive === false ||
          data.user.businessActive === false
        ) {
          await handleLogout();
          return;
        }

        // Get custom claims from Firebase token to read accountType
        let accountType = data.user.accountType;
        if (!accountType && firebaseUser) {
          try {
            const tokenResult = await firebaseUser.getIdTokenResult();
            accountType = tokenResult.claims.accountType;
          } catch (e) {
            console.error("Error reading custom claims:", e);
          }
        }

        setBackendUser({
          id: data.user.id || data.user._id,
          email: data.user.email,
          role: data.user.role,
          businessId: data.user.businessId,
          accountType: accountType, // Include accountType from Firebase custom claims
        });
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching backend user:", err);
      // Gracefully degrade on network failures
      setError("Unable to reach backend. Retrying shortly.");
      setBackendUser(null);
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        if (user) {
          // User is signed in
          const token = await user.getIdToken();
          setFirebaseUser(user);
          setIdToken(token);
          // Sync server cookie on sign-in
          try {
            await fetch("/api/auth/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });
          } catch (_) {}

          // Fetch backend user info
          await fetchBackendUser(token);
        } else {
          // User is signed out
          setFirebaseUser(null);
          setIdToken(null);
          setBackendUser(null);
          setError(null);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError(err instanceof Error ? err.message : "Authentication error");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Refresh token every 50 minutes (ID tokens expire in 1 hour)
  useEffect(() => {
    if (!firebaseUser) return;

    const interval = setInterval(() => {
      refreshToken().then((token) => {
        if (token) {
          fetchBackendUser(token);
        }
      });
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, [firebaseUser]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setFirebaseUser(null);
      setIdToken(null);
      setBackendUser(null);
      setError(null);
      // Clear server cookie
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (_) {}
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError(err instanceof Error ? err.message : "Failed to logout");
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
