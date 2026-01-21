"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AccountHome() {
  const { backendUser } = useAuth();

  const isSeller = backendUser?.role && [
    'BUSINESS_OWNER',
    'BUSINESS_MANAGER',
    'BUSINESS_STAFF'
  ].includes(backendUser.role);

  const isInfluencer = backendUser?.role === 'INFLUENCER';

  return (
    <div className="min-h-screen bg-[#f6f8f8] font-['Manrope'] pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-[#141e1e] text-3xl font-extrabold tracking-tight mb-2">My Account</h1>
          <p className="text-neutral-500 font-medium">Manage your personal information, orders, and security.</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Orders Card */}
          <Link href="/account/orders" className="group">
            <div className="h-full bg-white rounded-xl border border-neutral-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04),0_2px_10px_-2px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-[#2c7b7d]">shopping_bag</span>
              </div>
              <div className="relative z-10">
                <div className="size-12 rounded-full bg-[#2c7b7d]/10 flex items-center justify-center mb-6 group-hover:bg-[#2c7b7d] transition-colors">
                  <span className="material-symbols-outlined text-[#2c7b7d] group-hover:text-white transition-colors">package_2</span>
                </div>
                <h2 className="text-xl font-bold text-[#141e1e] mb-2">My Orders</h2>
                <p className="text-neutral-500 text-sm leading-relaxed">Track active orders, buy again, and download invoices.</p>
              </div>
            </div>
          </Link>

          {/* Wishlist Card */}
          <Link href="/account/wishlist" className="group">
            <div className="h-full bg-white rounded-xl border border-neutral-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04),0_2px_10px_-2px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-rose-500">favorite</span>
              </div>
              <div className="relative z-10">
                <div className="size-12 rounded-full bg-rose-50 flex items-center justify-center mb-6 group-hover:bg-rose-500 transition-colors">
                  <span className="material-symbols-outlined text-rose-500 group-hover:text-white transition-colors">favorite</span>
                </div>
                <h2 className="text-xl font-bold text-[#141e1e] mb-2">Wishlist</h2>
                <p className="text-neutral-500 text-sm leading-relaxed">Save items you love for later. Monitor price drops.</p>
              </div>
            </div>
          </Link>

          {/* Addresses Card */}
          <Link href="/account/addresses" className="group">
            <div className="h-full bg-white rounded-xl border border-neutral-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04),0_2px_10px_-2px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-orange-500">location_on</span>
              </div>
              <div className="relative z-10">
                <div className="size-12 rounded-full bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
                  <span className="material-symbols-outlined text-orange-500 group-hover:text-white transition-colors">location_on</span>
                </div>
                <h2 className="text-xl font-bold text-[#141e1e] mb-2">Addresses</h2>
                <p className="text-neutral-500 text-sm leading-relaxed">Manage your shipping and billing addresses.</p>
              </div>
            </div>
          </Link>

          {/* Cart Card */}
          <Link href="/cart" className="group">
            <div className="h-full bg-white rounded-xl border border-neutral-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04),0_2px_10px_-2px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-neutral-800">shopping_cart</span>
              </div>
              <div className="relative z-10">
                <div className="size-12 rounded-full bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-neutral-800 transition-colors">
                  <span className="material-symbols-outlined text-neutral-600 group-hover:text-white transition-colors">shopping_cart</span>
                </div>
                <h2 className="text-xl font-bold text-[#141e1e] mb-2">My Cart</h2>
                <p className="text-neutral-500 text-sm leading-relaxed">View and checkout items currently in your cart.</p>
              </div>
            </div>
          </Link>

          {/* Returns Card */}
          <Link href="/account/returns" className="group">
            <div className="h-full bg-white rounded-xl border border-neutral-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04),0_2px_10px_-2px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-amber-500">assignment_return</span>
              </div>
              <div className="relative z-10">
                <div className="size-12 rounded-full bg-amber-50 flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                  <span className="material-symbols-outlined text-amber-500 group-hover:text-white transition-colors">assignment_return</span>
                </div>
                <h2 className="text-xl font-bold text-[#141e1e] mb-2">My Returns</h2>
                <p className="text-neutral-500 text-sm leading-relaxed">Track your return requests and status.</p>
              </div>
            </div>
          </Link>

          {/* Profile Card */}
          <div className="group cursor-pointer">
            <div className="h-full bg-white rounded-xl border border-neutral-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04),0_2px_10px_-2px_rgba(0,0,0,0.02)] relative overflow-hidden bg-opacity-60">
              <div className="relative z-10">
                <div className="size-12 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-neutral-400">person</span>
                </div>
                <h2 className="text-xl font-bold text-[#141e1e]/60 mb-2">Profile Details</h2>
                <p className="text-neutral-400 text-sm leading-relaxed">Edit your name, email and password. (Coming Soon)</p>
              </div>
            </div>
          </div>

          {/* Role Based: Seller Dashboard */}
          {isSeller && (
            <Link href="/business" className="group">
              <div className="h-full bg-linear-to-br from-indigo-600 to-blue-700 rounded-xl border border-indigo-500/20 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-lg relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-30 transition-opacity">
                  <span className="material-symbols-outlined text-8xl text-white">storefront</span>
                </div>
                <div className="relative z-10">
                  <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                    <span className="material-symbols-outlined text-white group-hover:text-indigo-600 transition-colors">analytics</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Seller Dashboard</h2>
                  <p className="text-indigo-100 text-sm leading-relaxed">Manage your store, products, orders, and analytics.</p>
                </div>
              </div>
            </Link>
          )}

          {/* Role Based: Influencer Dashboard */}
          {isInfluencer && (
            <Link href="/influencer" className="group">
              <div className="h-full bg-linear-to-br from-fuchsia-600 to-purple-700 rounded-xl border border-fuchsia-500/20 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-lg relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-30 transition-opacity">
                  <span className="material-symbols-outlined text-8xl text-white">campaign</span>
                </div>
                <div className="relative z-10">
                  <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-fuchsia-600 transition-all">
                    <span className="material-symbols-outlined text-white group-hover:text-fuchsia-600 transition-colors">verified</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Influencer Portal</h2>
                  <p className="text-fuchsia-100 text-sm leading-relaxed">Track earnings, manage affiliate links, and campaigns.</p>
                </div>
              </div>
            </Link>
          )}

        </div>

        {/* Support Section */}
        <div className="mt-12 bg-[#2c7b7d] rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <svg className="w-64 h-64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
          </div>
          <div className="relative z-10 max-w-2xl text-white">
            <h2 className="text-2xl font-bold mb-4">Need help with an order?</h2>
            <p className="text-white/80 mb-8 leading-relaxed">Our support team is available 24/7 to assist you with any questions or issues you might have.</p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-[#2c7b7d] rounded-lg font-bold text-sm tracking-wide shadow-md hover:bg-neutral-50 transition-colors">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-[#2c7b7d] border border-white/30 text-white rounded-lg font-bold text-sm tracking-wide hover:bg-[#25696a] transition-colors">
                FAQs
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
