"use client";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import AuthModal from "../auth/AuthModal";
import BusinessRegisterForm from "../business/BusinessRegisterForm";

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [businessRegisterOpen, setBusinessRegisterOpen] = useState(false);
  const { firebaseUser, backendUser, logout } = useAuth();
  const { cartCount } = useCart();

  const isLoggedIn = !!firebaseUser;
  const isBusiness =
    backendUser?.role === "BUSINESS_OWNER" ||
    backendUser?.role === "BUSINESS_MANAGER" ||
    backendUser?.role === "BUSINESS_STAFF" ||
    backendUser?.role === "SELLER_OWNER";

  return (
    <header className="sticky top-0 z-50 bg-slate-700 text-white shadow h-16">
      <div className="max-w-300 mx-auto px-6 h-full">
        <div className="flex items-center justify-between gap-6 h-full">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold whitespace-nowrap hover:opacity-90"
            aria-label="ShopPlatform logo"
          >
            ShopPlatform
          </Link>

          {/* Search Bar */}
          <SearchBar />

          {/* Right Side Actions */}
          <div className="hidden sm:flex items-center gap-6 whitespace-nowrap text-sm">
            {isLoggedIn ? (
              <>
                <Link
                  href="/cart"
                  className="hover:opacity-90 flex items-center gap-1.5 relative"
                  aria-label="Cart"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 min-w-[24px] text-center">
                    {cartCount}
                  </span>
                  Cart
                </Link>

                {/* Become a Seller button for non-business users */}
                {!isBusiness && (
                  <button
                    onClick={() => setBusinessRegisterOpen(true)}
                    className="hover:opacity-90 text-yellow-300 font-medium"
                  >
                    Become a Seller
                  </button>
                )}

                {isBusiness && (
                  <a
                    href="http://localhost:3001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-90 text-yellow-200 font-medium"
                  >
                    Dashboard
                  </a>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 hover:opacity-90 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                    aria-label="Profile menu"
                  >
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 font-bold">
                      {firebaseUser?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-xs">
                      {firebaseUser?.email?.split("@")[0] || "Profile"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-20">
                      <div className="px-4 py-2 border-b text-xs text-gray-500">
                        {firebaseUser?.email}
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => setProfileOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/order"
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => setProfileOpen(false)}
                      >
                        My Orders
                      </Link>
                      {isBusiness && (
                        <a
                          href="http://localhost:3001"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 hover:bg-gray-100 text-sm"
                          onClick={() => setProfileOpen(false)}
                        >
                          Business Dashboard
                        </a>
                      )}
                      <button
                        onClick={async () => {
                          setProfileOpen(false);
                          await logout();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 border-t"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="hover:opacity-90"
                >
                  Login
                </button>
                <Link
                  href="/cart"
                  className="hover:opacity-90 flex items-center gap-1.5 relative"
                  aria-label="Cart"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 min-w-[24px] text-center">
                    {cartCount}
                  </span>
                  Cart
                </Link>
                <button
                  onClick={() => {
                    if (!firebaseUser) {
                      setAuthOpen(true);
                    } else {
                      setBusinessRegisterOpen(true);
                    }
                  }}
                  className="hover:opacity-90"
                >
                  Become a Seller
                </button>
              </>
            )}
          </div>
          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
          {businessRegisterOpen && (
            <BusinessRegisterForm
              onClose={() => setBusinessRegisterOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
