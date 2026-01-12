"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";
import { User, SuperAdminProfile } from "@/types";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  profile: SuperAdminProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SuperAdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token: string, firebaseUser: FirebaseUser) => {
    try {
      console.log("Fetching profile for:", firebaseUser.email);
      const response = await api.get("/api/super-admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Profile fetched:", response.data);
      
      // Verify the user has SUPER_ADMIN role
      if (response.data.role !== "SUPER_ADMIN") {
        throw new Error("Access denied: Not a super admin");
      }
      
      setProfile(response.data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      console.log("Error status:", error.response?.status);

      // If user is not a super admin (403) or not found (404), deny access
      if (error.response?.status === 403 || error.response?.status === 404) {
        throw new Error("Access denied: Not a super admin");
      }
      
      throw error;
    }
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem("authToken");
    const currentUser = auth.currentUser;
    if (token && currentUser) {
      await fetchProfile(token, currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("authToken", token);

        // Fetch profile to verify if user is a super admin
        try {
          await fetchProfile(token, firebaseUser);
          
          // Set user only if profile fetch succeeds (meaning user is SUPER_ADMIN)
          const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || undefined,
            role: "SUPER_ADMIN",
            isActive: true,
          };
          setUser(userData);
        } catch (error: any) {
          console.error("Profile fetch error:", error);
          
          // If not a super admin, sign out
          if (error.message?.includes("Not a super admin")) {
            toast.error("Access denied: Not a super admin");
            await firebaseSignOut(auth);
          }
          
          setUser(null);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem("authToken");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("authToken", token);

      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "Failed to sign in";

      if (error.message?.includes("Not a super admin")) {
        errorMessage = "Access denied: Not a super admin";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "User not found";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      }

      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem("authToken");
      setUser(null);
      setProfile(null);
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
