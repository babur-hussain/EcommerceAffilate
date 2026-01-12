"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";
import { User, InfluencerProfile } from "@/types";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  profile: InfluencerProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token: string, firebaseUser?: FirebaseUser) => {
    try {
      console.log("Fetching profile...");
      const response = await api.get("/api/influencers/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile fetched:", response.data);
      setProfile(response.data);

      // If profile exists but no referral code, trigger profile update
      if (!response.data.referralCode && firebaseUser) {
        console.log("Profile exists but no referral code, creating one...");
        await api.post(
          "/api/influencers/register",
          {
            name:
              firebaseUser.displayName ||
              firebaseUser.email?.split("@")[0] ||
              "Influencer",
            email: firebaseUser.email,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Fetch again
        const newResponse = await api.get("/api/influencers/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(newResponse.data);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);

      // If profile doesn't exist (404), auto-create it
      if (error.response?.status === 404 && firebaseUser) {
        try {
          console.log("Auto-creating influencer profile...");
          const registerResponse = await api.post(
            "/api/influencers/register",
            {
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                "Influencer",
              email: firebaseUser.email,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Registration response:", registerResponse.data);

          // Fetch profile again after creation
          const newResponse = await api.get("/api/influencers/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("New profile fetched:", newResponse.data);
          setProfile(newResponse.data);
          toast.success(
            `Welcome! Your referral code is ${newResponse.data.referralCode}`
          );
        } catch (createError) {
          console.error("Error creating profile:", createError);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    }
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      await fetchProfile(token);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            localStorage.setItem("authToken", token);

            const userData: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: "influencer",
            };

            setUser(userData);
            await fetchProfile(token, firebaseUser);
          } catch (error) {
            console.error("Error setting up user:", error);
            setUser(null);
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
          localStorage.removeItem("authToken");
        }
        setLoading(false);
      }
    );

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

      // Check if profile exists, if not create one (auto-register)
      try {
        await api.get("/api/influencers/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Create profile automatically
          await api.post(
            "/api/influencers/register",
            {
              name: userCredential.user.displayName || email.split("@")[0],
              email: email,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      }

      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      // Create influencer profile
      await api.post(
        "/api/influencers/register",
        {
          name,
          email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      // Check if profile exists, if not create one
      try {
        await api.get("/api/influencers/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Create profile
          await api.post(
            "/api/influencers/register",
            {
              name: result.user.displayName || "Influencer",
              email: result.user.email,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      }

      toast.success("Signed in with Google!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem("authToken");
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
