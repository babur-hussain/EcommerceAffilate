'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const BusinessRegistrationModal = dynamic(() => import('@/components/business/BusinessRegistrationModal'), { ssr: false });
const InfluencerRegistrationModal = dynamic(() => import('@/components/influencer/InfluencerRegistrationModal'), { ssr: false });

export default function Footer() {
  const { firebaseUser, backendUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showInfluencerModal, setShowInfluencerModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [sellerStatus, setSellerStatus] = useState<'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'>('NONE');
  const [influencerStatus, setInfluencerStatus] = useState<'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'>('NONE');
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Fetch seller status
  useEffect(() => {
    const fetchSellerStatus = async () => {
      if (!backendUser || !firebaseUser) {
        setSellerStatus('NONE');
        return;
      }

      if (backendUser.role === 'BUSINESS_OWNER' || backendUser.role === 'BUSINESS_MANAGER' || backendUser.role === 'BUSINESS_STAFF') {
        setSellerStatus('APPROVED');
        return;
      }

      try {
        setLoadingStatus(true);
        const token = await firebaseUser.getIdToken();
        const response = await fetch('/api/business/status', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setSellerStatus(data.status || 'NONE');
        } else {
          setSellerStatus('NONE');
        }
      } catch (error) {
        console.error('Error fetching seller status:', error);
        setSellerStatus('NONE');
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchSellerStatus();
  }, [backendUser, firebaseUser]);

  // Fetch influencer status (independent from seller)
  useEffect(() => {
    const fetchInfluencerStatus = async () => {
      if (!backendUser || !firebaseUser) {
        setInfluencerStatus('NONE');
        return;
      }

      if (backendUser.role === 'INFLUENCER') {
        setInfluencerStatus('APPROVED');
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        const response = await fetch('/api/influencer/status', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setInfluencerStatus(data.status || 'NONE');
        } else {
          setInfluencerStatus('NONE');
        }
      } catch (error) {
        console.error('Error fetching influencer status:', error);
        setInfluencerStatus('NONE');
      }
    };

    fetchInfluencerStatus();
  }, [backendUser, firebaseUser]);

  const handleSellerRegistrationClick = () => {
    if (firebaseUser) {
      setShowSellerModal(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleCheckStatus = () => {
    router.push('/account/business-status');
  };

  const handleGoToDashboard = () => {
    window.location.href = 'https://influencers.localforvocalstartup.com';
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

  const isSeller = backendUser?.role === 'BUSINESS_OWNER' || backendUser?.role === 'BUSINESS_MANAGER' || backendUser?.role === 'BUSINESS_STAFF';
  const isInfluencer = backendUser?.role === 'INFLUENCER';

  return (
    <>
      {/* Seller Registration Modal */}
      <BusinessRegistrationModal
        open={showSellerModal}
        onClose={() => setShowSellerModal(false)}
        onSuccess={() => setSellerStatus('PENDING')}
      />

      {/* Influencer Registration Modal */}
      <InfluencerRegistrationModal
        open={showInfluencerModal}
        onClose={() => setShowInfluencerModal(false)}
        onSuccess={() => setInfluencerStatus('PENDING')}
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
              <div className="w-16 h-16 bg-linear-to-br from-primary to-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
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
                className="w-full px-6 py-3 bg-linear-to-r from-primary to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">login</span>
                Login to Continue
              </button>
              <button
                onClick={() => router.push('/register?type=seller')}
                className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">person_add</span>
                Create New Account
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative bg-linear-to-br from-[#023047] via-slate-800 to-[#023047] text-slate-300 mt-auto overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Influencer CTA Section - Hidden for Sellers */}
        {!isSeller && (
          <div className="relative border-b border-slate-800/50 bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-linear-to-r from-accent-dark/10 to-accent-dark/10 border border-accent-dark/20 rounded-full text-accent text-sm font-semibold mb-4">
                    <span className="material-symbols-outlined text-lg">campaign</span>
                    Join Our Creator Network
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                    Monetize Your Influence
                  </h3>
                  <p className="text-slate-400 text-base sm:text-lg mb-4 sm:mb-6 max-w-2xl">
                    Partner with premium brands, share products you love, and earn competitive commissions. No limits on what you can earn.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8 justify-center lg:justify-start text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent">check_circle</span>
                      <span className="text-slate-300">High Commissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent">check_circle</span>
                      <span className="text-slate-300">Exclusive Perks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent">check_circle</span>
                      <span className="text-slate-300">Partner Support</span>
                    </div>
                  </div>
                </div>

                {/* Right CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  {influencerStatus === 'NONE' && (
                    <button
                      onClick={() => {
                        if (firebaseUser) {
                          setShowInfluencerModal(true);
                        } else {
                          setShowLoginPrompt(true);
                        }
                      }}
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-accent to-accent-dark text-white font-bold rounded-xl shadow-lg shadow-accent-dark/30 hover:shadow-xl hover:shadow-accent-dark/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined">stars</span>
                      Register as Influencer
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  )}
                  {influencerStatus === 'PENDING' && (
                    <button
                      onClick={() => setShowInfluencerModal(true)}
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-accent to-accent-dark text-white font-bold rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined">pending</span>
                      Registration Under Review
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  )}
                  {influencerStatus === 'APPROVED' && (
                    <button
                      onClick={() => window.location.href = 'https://influencers.localforvocalstartup.com/login'}
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined">dashboard</span>
                      Influencer Dashboard
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  )}
                  {influencerStatus === 'REJECTED' && (
                    <button
                      onClick={() => setShowInfluencerModal(true)}
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined">cancel</span>
                      Application Rejected — Reapply
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  )}
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-accent text-sm transition-colors flex items-center gap-1 justify-center"
                  >
                    Learn more
                    <span className="material-symbols-outlined text-sm">help</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seller CTA Section - Hidden for Influencers */}
        {!isInfluencer && (
          <div className="relative border-b border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-linear-to-r from-primary/10 to-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-4">
                    <span className="material-symbols-outlined text-lg">trending_up</span>
                    Join Our Seller Community
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                    Start Selling Today
                  </h3>
                  <p className="text-slate-400 text-base sm:text-lg mb-4 sm:mb-6 max-w-2xl">
                    Reach millions of customers and grow your business with our powerful e-commerce platform. Zero setup fees, easy onboarding.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8 justify-center lg:justify-start text-sm">
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  {sellerStatus === 'NONE' && (
                    <button
                      onClick={handleSellerRegistrationClick}
                      disabled={loadingStatus}
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-primary to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined">storefront</span>
                      Register as Seller
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  )}
                  {sellerStatus === 'PENDING' && (
                    <button
                      onClick={() => setShowSellerModal(true)}
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-accent to-accent-dark text-white font-bold rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined">pending</span>
                      Registration Under Review
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  )}
                  {sellerStatus === 'APPROVED' && (
                    <button
                      onClick={() => window.location.href = 'https://www.seller.localforvocalstartup.com/'}
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined">dashboard</span>
                      Seller Dashboard
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  )}
                  {sellerStatus === 'REJECTED' && (
                    <button
                      onClick={() => setShowSellerModal(true)}
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined">cancel</span>
                      Application Rejected — Reapply
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  )}
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-primary text-sm transition-colors flex items-center gap-1"
                  >
                    Learn more
                    <span className="material-symbols-outlined text-sm">help</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Footer Content */}
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8">
          {/* Top Section */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
            {/* Brand Section */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-white text-2xl">shopping_bag</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Local For Vocal Startup</h3>
              </div>
              <p className="text-slate-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Your premier destination for quality products. From tech essentials to home décor, discover everything you need.
              </p>
              {/* Social Media */}
              <div className="flex items-center gap-3">
                <Link
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-xl">link</span>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-xl">tag</span>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-xl">photo_camera</span>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-xl">play_circle</span>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1 lg:col-span-2">
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Shop</h4>
              <ul className="space-y-3">
                {[
                  { name: 'New Arrivals', href: '/new-arrivals' },
                  { name: 'Best Sellers', href: '/best-sellers' },
                  { name: 'Sale', href: '/sale' },
                  { name: 'Collections', href: '/collections' },
                  { name: 'Gift Cards', href: '/gift-cards' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-primary hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div className="col-span-1 lg:col-span-2">
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Help Center', href: '/help-center' },
                  { name: 'Track Order', href: '/track-order' },
                  { name: 'Returns', href: '/returns' },
                  { name: 'Shipping Info', href: '/shipping-info' },
                  { name: 'Size Guide', href: '/size-guide' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-primary hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="col-span-1 lg:col-span-2">
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Press', 'Blog', 'Contact', 'Join as Influencer', 'Commission Structure']
                  .filter(item => !(item === 'Join as Influencer' && isSeller))
                  .map((item) => (
                    <li key={item}>
                      {item === 'Join as Influencer' ? (
                        <button
                          onClick={() => {
                            if (influencerStatus === 'APPROVED') {
                              window.location.href = 'https://influencers.localforvocalstartup.com/login';
                              return;
                            }
                            if (influencerStatus === 'PENDING' || influencerStatus === 'REJECTED') {
                              setShowInfluencerModal(true);
                              return;
                            }
                            if (firebaseUser) {
                              setShowInfluencerModal(true);
                            } else {
                              setShowLoginPrompt(true);
                            }
                          }}
                          className="text-slate-400 hover:text-primary hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group text-left"
                        >
                          <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                          {influencerStatus === 'PENDING' ? 'Registration Under Review' : influencerStatus === 'APPROVED' ? 'Go to Dashboard' : item}
                        </button>
                      ) : (
                        <Link
                          href={
                            item === 'Commission Structure' ? '/commission-structure'
                              : item === 'About Us' ? '/about'
                                : item === 'Careers' ? '/careers'
                                  : item === 'Press' ? '/press'
                                    : item === 'Blog' ? '/blog'
                                      : item === 'Contact' ? '/contact'
                                        : '#'
                          }
                          className="text-slate-400 hover:text-primary hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                        >
                          <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                          {item}
                        </Link>
                      )}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 sm:col-span-1 lg:col-span-2">
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
                  className="absolute right-1 top-1 bottom-1 px-4 bg-linear-to-r from-primary to-primary text-white rounded-md hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
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
                  className="w-12 h-8 rounded bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:border-primary transition-colors"
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
                <Link href="#" className="text-slate-500 hover:text-primary text-xs transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-slate-700">•</span>
                <Link href="#" className="text-slate-500 hover:text-primary text-xs transition-colors">
                  Terms of Service
                </Link>
                <span className="text-slate-700">•</span>
                <Link href="#" className="text-slate-500 hover:text-primary text-xs transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-accent to-accent-dark" />
      </footer>
    </>
  );
}
