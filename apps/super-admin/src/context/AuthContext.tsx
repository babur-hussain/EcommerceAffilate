"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onIdTokenChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firestore";
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { AdminRole } from "@/types";
import {
  isSuperAdmin,
  SUPER_ADMIN_EMAIL,
  DEFAULT_PERMISSIONS,
  PermissionKey,
} from "@/lib/permissions";
import toast from "react-hot-toast";

// ─── Context Type ────────────────────────────────────────────────────
interface AuthContextType {
  user: FirebaseUser | null;
  adminRole: AdminRole | null;
  permissions: PermissionKey[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  userName: string;
  userEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [permissions, setPermissions] = useState<PermissionKey[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Look up the admin user in Firestore.
   * - If super admin email → auto-create record + full permissions
   * - If found in adminUsers with isActive → load role + permissions
   * - Otherwise → deny access
   */
  const resolveAdminUser = async (firebaseUser: FirebaseUser) => {
    const email = firebaseUser.email?.toLowerCase() || "";

    // ── Super Admin (hard-coded email) ──
    if (isSuperAdmin(email)) {
      // Ensure Firestore record exists for super admin
      const ref = doc(db, "adminUsers", firebaseUser.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: firebaseUser.uid,
          email,
          name: firebaseUser.displayName || "Super Admin",
          role: "super_admin" as AdminRole,
          permissions: [...DEFAULT_PERMISSIONS.super_admin],
          isActive: true,
          createdAt: new Date().toISOString(),
          createdBy: "system",
        });
      }
      setAdminRole("super_admin");
      setPermissions([...DEFAULT_PERMISSIONS.super_admin]);
      return true;
    }

    // ── Other admin users (manager / staff) ──
    // First try by UID
    const ref = doc(db, "adminUsers", firebaseUser.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      if (data.isActive) {
        setAdminRole(data.role as AdminRole);
        setPermissions((data.permissions || []) as PermissionKey[]);
        return true;
      } else {
        throw new Error("Your account has been deactivated. Contact the super admin.");
      }
    }

    // Fallback: search by email (for users added by Super Admin before they logged in)
    const emailQuery = query(
      collection(db, "adminUsers"),
      where("email", "==", email)
    );
    const emailSnap = await getDocs(emailQuery);

    if (!emailSnap.empty) {
      const existingDoc = emailSnap.docs[0];
      const data = existingDoc.data();

      if (!data.isActive) {
        throw new Error("Your account has been deactivated. Contact the super admin.");
      }

      // Migrate: create a new doc with real UID and delete the old placeholder
      await setDoc(doc(db, "adminUsers", firebaseUser.uid), {
        ...data,
        uid: firebaseUser.uid,
        name: data.name || firebaseUser.displayName || "Admin",
        updatedAt: new Date().toISOString(),
      });
      if (existingDoc.id !== firebaseUser.uid) {
        await deleteDoc(doc(db, "adminUsers", existingDoc.id));
      }

      setAdminRole(data.role as AdminRole);
      setPermissions((data.permissions || []) as PermissionKey[]);
      return true;
    }

    // Not an authorized admin
    throw new Error("Access denied: You are not an authorized admin user.");
  };

  // ── Auth state listener ──
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("authToken", token);

        try {
          await resolveAdminUser(firebaseUser);
          setUser(firebaseUser);
        } catch (error: any) {
          console.error("Admin auth error:", error);
          // Only show toast if this wasn't the initial page load silently failing
          if (error.message?.includes("Access denied") || error.message?.includes("deactivated")) {
            toast.error(error.message);
          }
          await firebaseSignOut(auth);
          setUser(null);
          setAdminRole(null);
          setPermissions([]);
        }
      } else {
        setUser(null);
        setAdminRole(null);
        setPermissions([]);
        localStorage.removeItem("authToken");
      }
      setLoading(false);
    });

    // Auto-refresh token every 10 minutes
    const intervalId = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
          localStorage.setItem("authToken", token);
        } catch (error) {
          console.error("Token auto-refresh failed:", error);
        }
      }
    }, 10 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sign In ──
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("authToken", token);

      try {
        await resolveAdminUser(userCredential.user);
        setUser(userCredential.user);
        toast.success("Signed in successfully!");
      } catch (profileError: any) {
        await firebaseSignOut(auth);
        toast.error(profileError.message || "Access denied");
        throw profileError;
      }
    } catch (error: any) {
      if (error.message?.includes("Access denied") || error.message?.includes("deactivated")) {
        throw error; // Already handled above
      }

      let errorMessage = "Failed to sign in";
      if (error.code === "auth/invalid-credential") {
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

  // ── Sign Out ──
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem("authToken");
      setUser(null);
      setAdminRole(null);
      setPermissions([]);
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      throw error;
    }
  };

  const userName = user?.displayName || "Admin";
  const userEmail = user?.email || "";

  return (
    <AuthContext.Provider
      value={{
        user,
        adminRole,
        permissions,
        loading,
        signIn,
        signOut,
        userName,
        userEmail,
      }}
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
