'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BusinessRegistrationModal from '@/components/business/BusinessRegistrationModal';

export default function Footer() {
  const { firebaseUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleSellerRegistrationClick = () => {
    if (firebaseUser) {
      setShowSellerModal(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <>
      {/* Seller Registration Modal */}
      <BusinessRegistrationModal
        open={showSellerModal}
        onClose={() => setShowSellerModal(false)}
      />

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowLoginPrompt(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/30">
                <span className="material-symbols-outlined text-white text-3xl">lock</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Login Required</h3>
              <p className="text-slate-600">
                Please log in to your account to register as a seller and start growing your business.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/login?redirect=/&action=seller-register')}
                className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">login</span>
                Login to Continue
              </button>
              <button
                onClick={() => router.push('/register?type=seller')}
                className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">person_add</span>
                Create New Account
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 mt-auto overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Seller CTA Section */}
        <div className="relative border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 rounded-full text-sky-400 text-sm font-semibold mb-4">
                  <span className="material-symbols-outlined text-lg">trending_up</span>
                  Join Our Seller Community
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Start Selling Today
                </h3>
                <p className="text-slate-400 text-lg mb-6 max-w-2xl">
                  Reach millions of customers and grow your business with our powerful e-commerce platform. Zero setup fees, easy onboarding.
                </p>
                <div className="flex flex-wrap items-center gap-8 justify-center lg:justify-start text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-400">check_circle</span>
                    <span className="text-slate-300">Low Commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-400">check_circle</span>
                    <span className="text-slate-300">Fast Payouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-400">check_circle</span>
                    <span className="text-slate-300">Free Tools</span>
                  </div>
                </div>
              </div>

              {/* Right CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleSellerRegistrationClick}
                  className="group relative px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">storefront</span>
                  Register as Seller
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-sky-400 text-sm transition-colors flex items-center gap-1"
                >
                  Learn more
                  <span className="material-symbols-outlined text-sm">help</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
                  <span className="material-symbols-outlined text-white text-2xl">shopping_bag</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Local For Vocal Startup</h3>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Your premier destination for quality products. From tech essentials to home décor, discover everything you need.
              </p>
              {/* Social Media */}
              <div className="flex items-center gap-3">
                <Link
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:scale-110 transition-all duration-300 group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-xl">link</span>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:scale-110 transition-all duration-300 group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-xl">tag</span>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:scale-110 transition-all duration-300 group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-xl">photo_camera</span>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:scale-110 transition-all duration-300 group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-xl">play_circle</span>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Shop</h4>
              <ul className="space-y-3">
                {['New Arrivals', 'Best Sellers', 'Sale', 'Collections', 'Gift Cards'].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Track Order', 'Returns', 'Shipping Info', 'Size Guide'].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Press', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Stay Updated</h4>
              <p className="text-slate-400 text-sm mb-4">
                Get exclusive deals and early access to new arrivals.
              </p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-md hover:shadow-lg hover:shadow-sky-500/50 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  disabled={subscribed}
                >
                  {subscribed ? (
                    <span className="material-symbols-outlined text-xl">check</span>
                  ) : (
                    <span className="material-symbols-outlined text-xl">send</span>
                  )}
                </button>
              </form>
              {subscribed && (
                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Successfully subscribed!
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800/50" />

          {/* Bottom Section */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Payment Methods */}
            <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
              <span className="text-slate-500 text-sm">We Accept:</span>
              {['credit_card', 'account_balance', 'qr_code_2', 'wallet'].map((icon) => (
                <div
                  key={icon}
                  className="w-12 h-8 rounded bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:border-sky-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-400 text-lg">{icon}</span>
                </div>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-slate-500 text-sm">
                © 2026 <span className="text-white font-semibold">Local For Vocal Startup</span>. All rights reserved.
              </p>
              <div className="flex items-center justify-center md:justify-end gap-4 mt-2">
                <Link href="#" className="text-slate-500 hover:text-sky-400 text-xs transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-slate-700">•</span>
                <Link href="#" className="text-slate-500 hover:text-sky-400 text-xs transition-colors">
                  Terms of Service
                </Link>
                <span className="text-slate-700">•</span>
                <Link href="#" className="text-slate-500 hover:text-sky-400 text-xs transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500" />
      </footer>
    </>
  );
}
