"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  ConfirmationResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

type Props = { open: boolean; onClose: () => void; initialMode?: Mode };

type Mode = "login" | "signup";
type Method = "email" | "phone";

export default function AuthModal({
  open,
  onClose,
  initialMode = "login",
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  // Default to email as per new design, though phone logic is preserved if needed or switchable
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Phone Auth States
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useAuth provides user state, but not actions in this codebase
  const { } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setMode(initialMode);
    // Reset fields on open
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setPhone("");
    setOtp("");
    setStep("phone");
    setConfirmation(null);
  }, [open, initialMode]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      // Check for mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // DEBUG: Force popup to debug redirect issues
        // alert("Attempting Mobile Login via Popup...");
        await signInWithPopup(auth, googleProvider);
        onClose();
        return;
      }

      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError("Google sign-in failed.");
      setLoading(false);
    } finally {
      // Only stop loading if not redirecting (or if error occurred)
      if (!(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))) {
        setLoading(false);
      }
    }
  };

  const calculateRecaptcha = (): RecaptchaVerifier => {
    const key = "__recaptcha";
    const anyWindow = window as unknown as Record<string, any>;
    if (anyWindow[key]) return anyWindow[key];
    const verifier = new RecaptchaVerifier(auth, recaptchaRef.current!, {
      size: "invisible",
    });
    anyWindow[key] = verifier;
    return verifier;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (step === "phone") {
        const e164 = phone.replace(/[^\d+]/g, "");
        if (!e164 || e164.length < 8) throw new Error("Enter a valid phone number with country code");

        const verifier = calculateRecaptcha();
        const conf = await signInWithPhoneNumber(auth, e164, verifier);
        setConfirmation(conf);
        setStep("otp");
      } else {
        if (!confirmation) return;
        await confirmation.confirm(otp);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Phone authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === "phone") {
      handlePhoneSubmit(e);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center isolate">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[480px] p-4 flex items-center justify-center pointer-events-none">
        {/* Card - Pointer events auto */}
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[85vh] overflow-y-auto">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-neutral-400 hover:text-neutral-600 transition-colors p-2 bg-white/80 rounded-full hover:bg-neutral-100"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <div className="p-6 sm:p-10">
            {/* Headline Text */}
            <div className="text-center mb-6">
              <h1 className="text-neutral-900 tracking-tight text-3xl font-extrabold leading-tight mb-2">
                {mode === "login" ? "Welcome Back" : "Join Startup Betul"}
              </h1>
              <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                {mode === "login"
                  ? "Enter your details to access your premium shopping experience."
                  : "Create an account to start your journey."}
              </p>
            </div>

            {/* Social Login */}
            <div className="space-y-4 mb-6">
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex cursor-pointer items-center justify-center rounded-xl h-14 px-5 bg-white border border-neutral-200 text-neutral-800 gap-3 text-base font-semibold transition-all hover:bg-neutral-50 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-400 font-medium italic">
                  or {mode === "login" ? "sign in" : "sign up"} with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {method === 'email' ? (
                <>
                  {mode === "signup" && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-1" htmlFor="fullName">Full Name</label>
                      <input
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl h-14 px-4 text-base text-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-neutral-400"
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-1" htmlFor="email">Email Address</label>
                    <input
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl h-14 px-4 text-base text-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-neutral-400"
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-neutral-500" htmlFor="password">Password</label>
                      {mode === "login" && (
                        <button type="button" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <input
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl h-14 px-4 text-base text-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-neutral-400"
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  {mode === "signup" && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-1" htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl h-14 px-4 text-base text-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-neutral-400"
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-center text-sm text-red-500">Phone Auth styling pending design match. using email.</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-primary text-white text-lg font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    mode === "login" ? "Sign In" : "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center bg-neutral-50 rounded-xl p-4 border border-neutral-100">
              <p className="text-neutral-500 text-sm font-medium">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-primary font-bold hover:underline underline-offset-4 ml-1.5"
                >
                  {mode === "login" ? "Create one" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div ref={recaptchaRef} id="recaptcha-container" />
    </div>,
    document.body
  );
}
