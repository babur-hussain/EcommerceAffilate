"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading: authLoading, firebaseUser, idToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const didSync = useRef(false);

  const getRedirectTarget = useCallback(() => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      try {
        const decoded = decodeURIComponent(redirectParam);
        // Prevent redirect loops - don't redirect back to login
        if (decoded.startsWith("/login")) {
          return "/";
        }
        return decoded;
      } catch {
        return "/";
      }
    }
    return "/";
  }, [searchParams]);

  // Single effect to handle auth state
  useEffect(() => {
    // Still loading, wait
    if (authLoading) return;

    // User is not logged in - show modal
    if (!firebaseUser) {
      setShowModal(true);
      return;
    }

    // User IS logged in - need to sync cookie first, then redirect
    if (!idToken) return; // Wait for token

    // Already synced/syncing, don't repeat
    if (didSync.current || syncing) return;

    const syncAndRedirect = async () => {
      didSync.current = true;
      setSyncing(true);

      try {
        // Sync the token to cookie - WAIT for it to complete
        const res = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: idToken }),
        });

        if (res.ok) {
          // Cookie is now set - redirect
          const target = getRedirectTarget();
          // Use window.location to ensure full page reload with new cookie
          window.location.href = target;
        } else {
          // Sync failed - try redirect anyway
          console.warn("Sync failed, redirecting anyway");
          window.location.href = getRedirectTarget();
        }
      } catch (err) {
        console.error("Sync error:", err);
        // On error, still redirect
        window.location.href = getRedirectTarget();
      }
    };

    syncAndRedirect();
  }, [authLoading, firebaseUser, idToken, syncing, getRedirectTarget]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    // If user closes without logging in, go home
    if (!firebaseUser) {
      router.push("/");
    }
  }, [router, firebaseUser]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // User is logged in - show syncing/redirecting state
  if (firebaseUser || syncing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {syncing ? "Setting up your session..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  // Show login modal for unauthenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthModal open={showModal} onClose={handleModalClose} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
