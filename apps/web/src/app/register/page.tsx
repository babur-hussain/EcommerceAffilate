'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error ?? 'Registration failed');
        setLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#d4eef6] via-[#c8e8f2] to-[#9dd4e6] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Decorative blurred shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-96 w-96 bg-[#a8dff0]/60 blur-[100px] rounded-full" />
        <div className="absolute -right-20 top-0 h-[500px] w-[500px] bg-[#7ecce5]/50 blur-[120px] rounded-full" />
        <div className="absolute left-1/4 -bottom-20 h-80 w-80 bg-[#b4e4f3]/70 blur-[80px] rounded-full" />
      </div>

      <div className="relative w-full max-w-[900px]">
        <div className="grid md:grid-cols-2 rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(0,100,150,0.25)]">
          {/* Left Panel - Sign In CTA */}
          <div className="relative bg-[#20a8d8] text-white px-10 py-12 flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-[32px] font-bold leading-tight mb-4">
                Welcome<br />Back!
              </h2>
              <p className="text-[14px] text-white/80 mb-6 max-w-[220px]">
                Already have an account? Sign in to continue ...
              </p>
              <Link
                href="/login"
                className="rounded-full border-2 border-white/70 px-8 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-white/10 hover:border-white transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Panel - Create Account Form */}
          <div className="relative bg-white px-10 py-12 flex flex-col">
            <h1 className="text-[28px] font-bold text-gray-800 mb-6">Create account</h1>

            <p className="text-[13px] text-gray-400 mb-6">Sign up with your email to get started</p>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-2xl px-4 py-3 text-sm mb-4" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full bg-[#ebebeb] border-none px-5 py-3.5 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#1da1f2]/30 outline-none transition"
                placeholder="Email"
              />

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full bg-[#ebebeb] border-none px-5 py-3.5 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#1da1f2]/30 outline-none transition"
                placeholder="Password"
              />

              <p className="text-[13px] text-gray-400">Use a mix of letters, numbers & symbols</p>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-44 rounded-full bg-gradient-to-r from-[#20b5e8] to-[#1a8fc9] text-white py-3 font-semibold text-xs tracking-widest uppercase shadow-[0_8px_25px_rgba(32,181,232,0.4)] hover:shadow-[0_12px_35px_rgba(32,181,232,0.5)] hover:translate-y-[-1px] active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
