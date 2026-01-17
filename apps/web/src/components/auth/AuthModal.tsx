"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

type Props = { open: boolean; onClose: () => void };

type Mode = "login" | "signup";
type Method = "email" | "phone";

export default function AuthModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null
  );
  const recaptchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setError(null);
  }, [open, mode, method]);

  if (!open) return null;

  const headerTitle = mode === "login" ? "Welcome back" : "Create your account";

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (e: any) {
      setError(e?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      onClose();
    } catch (e: any) {
      setError(e?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const ensureRecaptcha = (): RecaptchaVerifier => {
    const key = "__recaptcha";
    const anyWindow = window as unknown as Record<string, any>;
    if (anyWindow[key]) return anyWindow[key];
    const verifier = new RecaptchaVerifier(auth, recaptchaRef.current!, {
      size: "invisible",
    });
    anyWindow[key] = verifier;
    return verifier;
  };

  const startPhoneSignIn = async () => {
    setError(null);
    setSendingCode(true);
    try {
      const e164 = phone.replace(/[^\d+]/g, "");
      if (!e164)
        throw new Error("Enter a valid phone number including country code");
      const verifier = ensureRecaptcha();
      const conf = await signInWithPhoneNumber(auth, e164, verifier);
      setConfirmation(conf);
    } catch (e: any) {
      setError(e?.message || "Failed to send code");
    } finally {
      setSendingCode(false);
    }
  };

  const confirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmation) return;
    setLoading(true);
    try {
      await confirmation.confirm(otp);
      onClose();
    } catch (e: any) {
      setError(e?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md mx-4 sm:mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 pointer-events-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition z-10"
        >
          ✕
        </button>

        <div className="flex justify-center mx-auto mb-4">
          <img
            className="w-auto h-7 sm:h-8"
            src="https://merakiui.com/images/logo.svg"
            alt="Brand"
          />
        </div>

        {error && (
          <div
            className="mt-2 bg-red-50 text-red-700 border border-red-200 rounded p-3 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {method === "email" ? (
          <form className="mt-6" onSubmit={handleEmailSubmit}>
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm text-gray-800 dark:text-gray-200"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={mode === "signup"}
                  className="block w-full px-4 py-2 mt-2 text-slate-900 placeholder:text-slate-400 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className={mode === "signup" ? "mt-4" : ""}>
              <label
                htmlFor="email"
                className="block text-sm text-gray-800 dark:text-gray-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-slate-900 placeholder:text-slate-400 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-800 dark:text-gray-200"
                >
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    Forget Password?
                  </button>
                )}
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-slate-900 placeholder:text-slate-400 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            {mode === "signup" && (
              <div className="mt-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm text-gray-800 dark:text-gray-200"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-4 py-2 mt-2 text-slate-900 placeholder:text-slate-400 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-60"
              >
                {mode === "login"
                  ? loading
                    ? "Signing In..."
                    : "Sign In"
                  : loading
                  ? "Creating..."
                  : "Create Account"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            {!confirmation ? (
              <>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm text-gray-800 dark:text-gray-200"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full px-4 py-2 mt-2 text-slate-900 placeholder:text-slate-400 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="+1 555 000 1234"
                  />
                </div>
                <div ref={recaptchaRef} id="recaptcha-container" />
                <button
                  type="button"
                  onClick={startPhoneSignIn}
                  disabled={sendingCode}
                  className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-60"
                >
                  {sendingCode ? "Sending Code..." : "Send Verification Code"}
                </button>
              </>
            ) : (
              <form onSubmit={confirmOtp} className="space-y-4">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm text-gray-800 dark:text-gray-200"
                  >
                    Enter Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full px-4 py-2 mt-2 text-slate-900 placeholder:text-slate-400 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="6-digit code"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>
          <span className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
            or login with Social Media
          </span>
          <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
        </div>

        <div className="flex items-center mt-6 -mx-2">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-slate-500 rounded-lg hover:bg-slate-400 focus:bg-blue-400 focus:outline-none disabled:opacity-60"
          >
            <svg className="w-4 h-4 mx-2 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path>
            </svg>
            <span className="hidden mx-2 sm:inline">Sign in with Google</span>
          </button>

          <button
            type="button"
            className="p-2 mx-2 text-sm font-medium text-gray-500 transition-colors duration-300 transform bg-gray-300 rounded-lg hover:bg-gray-200"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center mt-6 gap-2">
          <button
            type="button"
            onClick={() => setMethod(method === "email" ? "phone" : "email")}
            className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
          >
            {method === "email" ? "Use Phone instead" : "Use Email instead"}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-gray-500">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="font-medium text-slate-900 placeholder:text-slate-400 dark:text-gray-200 hover:underline"
          >
            {mode === "login" ? "Create One" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
