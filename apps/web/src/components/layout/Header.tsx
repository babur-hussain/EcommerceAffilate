"use client";

import Link from "next/link";
import { useState } from "react";
import GlobalSearch from "@/components/search/GlobalSearch";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import AuthModal from "@/components/auth/AuthModal";
import BusinessRegisterForm from "@/components/business/BusinessRegisterForm";
import CartPopup from "@/components/cart/CartPopup";

export default function Header() {
    const [authOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "signup">("login");
    const [profileOpen, setProfileOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [businessRegisterOpen, setBusinessRegisterOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const { firebaseUser, backendUser, logout } = useAuth();
    const { cartCount } = useCart();

    const isLoggedIn = !!firebaseUser;
    const isBusiness =
        backendUser?.role === "BUSINESS_OWNER" ||
        backendUser?.role === "BUSINESS_MANAGER" ||
        backendUser?.role === "BUSINESS_STAFF";
    const isInfluencer = backendUser?.role === "INFLUENCER";

    const openAuth = (mode: "login" | "signup") => {
        setAuthMode(mode);
        setAuthOpen(true);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
            <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pb-2 mb-0">
                <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8 h-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform duration-300">
                            <span className="material-symbols-outlined text-[20px]">
                                shopping_bag
                            </span>
                        </div>
                        <h1 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                            Local For Vocal Startup
                        </h1>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-2xl">
                        <GlobalSearch />
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="md:hidden flex items-center justify-center size-10 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                {mobileSearchOpen ? 'close' : 'search'}
                            </span>
                        </button>

                        {/* Static Links / Wishlist */}
                        <Link
                            href={isLoggedIn ? "/account/wishlist" : "#"}
                            onClick={() => !isLoggedIn && openAuth("login")}
                            className="hidden sm:flex flex-col items-center gap-1 group text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <span className="material-symbols-outlined group-hover:fill-1">
                                favorite
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wide hidden lg:block">
                                Saved
                            </span>
                        </Link>

                        {/* Cart */}
                        <div className="relative" onMouseLeave={() => setCartOpen(false)}>
                            <button
                                onClick={() => setCartOpen(!cartOpen)}
                                onMouseEnter={() => setCartOpen(true)}
                                className="relative flex items-center justify-center size-10 bg-slate-900 text-white rounded-full shadow-lg hover:bg-primary transition-colors group"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    shopping_cart
                                </span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Cart Popup */}
                            {cartOpen && (
                                <>
                                    <div className="fixed inset-0 z-40 bg-transparent md:hidden" onClick={() => setCartOpen(false)} />
                                    <CartPopup onClose={() => setCartOpen(false)} />
                                </>
                            )}
                        </div>

                        {/* Account / Login Section */}
                        {isLoggedIn ? (
                            <div className="relative" onMouseLeave={() => setProfileOpen(false)}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    onMouseEnter={() => setProfileOpen(true)}
                                    className="flex flex-col items-center gap-1 group text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    <div className="size-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 group-hover:border-primary/50 transition-colors overflow-hidden">
                                        {backendUser?.name ? (
                                            <span className="font-bold text-xs text-primary">
                                                {backendUser.name.charAt(0).toUpperCase()}
                                            </span>
                                        ) : (
                                            <span className="material-symbols-outlined text-[20px]">person</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wide hidden lg:block">
                                        Account
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {profileOpen && (
                                    <>
                                        {/* Overlay to close on click outside - works on mobile and desktop */}
                                        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setProfileOpen(false)} />

                                        <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl ring-1 ring-slate-900/5 py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-left">
                                            {/* User Info Header */}
                                            <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
                                                <p className="font-bold text-slate-900 truncate">
                                                    {backendUser?.name || 'User'}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate font-medium mt-0.5">
                                                    {firebaseUser?.email}
                                                </p>
                                                {isBusiness && (
                                                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                                                        <span className="material-symbols-outlined text-[12px]">verified</span>
                                                        Business Account
                                                    </span>
                                                )}
                                            </div>

                                            {/* Navigation Links */}
                                            <div className="py-2">
                                                <Link
                                                    href="/account"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
                                                >
                                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">person</span>
                                                    My Profile
                                                </Link>
                                                <Link
                                                    href="/account/orders"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
                                                >
                                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">package_2</span>
                                                    My Orders
                                                </Link>
                                                <Link
                                                    href="/account/wishlist"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
                                                >
                                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">favorite</span>
                                                    My Wishlist
                                                </Link>
                                                <Link
                                                    href="/account/addresses"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
                                                >
                                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">location_on</span>
                                                    Addresses
                                                </Link>
                                                {!isBusiness && (
                                                    <button
                                                        onClick={() => {
                                                            setProfileOpen(false);
                                                            setBusinessRegisterOpen(true);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group text-left"
                                                    >
                                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">storefront</span>
                                                        Become a Seller
                                                    </button>
                                                )}
                                                {isBusiness && (
                                                    <button
                                                        onClick={() => {
                                                            setProfileOpen(false);
                                                            window.location.href = 'https://www.seller.localforvocalstartup.com/login';
                                                        }}
                                                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group text-left"
                                                    >
                                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">dashboard</span>
                                                        Seller Dashboard
                                                    </button>
                                                )}
                                            </div>

                                            {/* Role Specific Portals */}
                                            {(isBusiness || isInfluencer) && (
                                                <div className="border-t border-slate-50 py-2">
                                                    {isBusiness && (
                                                        <button
                                                            onClick={() => {
                                                                setProfileOpen(false);
                                                                window.location.href = 'https://www.seller.localforvocalstartup.com/login';
                                                            }}
                                                            className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors text-left"
                                                        >
                                                            <span className="material-symbols-outlined">storefront</span>
                                                            Seller Dashboard
                                                        </button>
                                                    )}
                                                    {isInfluencer && (
                                                        <Link
                                                            href="/influencer"
                                                            onClick={() => setProfileOpen(false)}
                                                            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-fuchsia-600 hover:bg-fuchsia-50 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined">campaign</span>
                                                            Influencer Portal
                                                        </Link>
                                                    )}
                                                </div>
                                            )}

                                            {/* Logout */}
                                            <div className="border-t border-slate-50 pt-2 pb-1">
                                                <button
                                                    onClick={async () => {
                                                        setProfileOpen(false);
                                                        await logout();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                                                >
                                                    <span className="material-symbols-outlined">logout</span>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openAuth("login")}
                                    className="hidden sm:inline-flex px-3 py-1.5 text-sm font-bold text-slate-600 hover:text-primary transition-colors"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => openAuth("signup")}
                                    className="px-3 sm:px-4 py-2 bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-full hover:bg-primary hover:shadow-lg transition-all"
                                >
                                    Join
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Overlay */}
                {mobileSearchOpen && (
                    <div className="md:hidden mt-4 pb-2 animate-in slide-in-from-top-2 fade-in duration-200">
                        <GlobalSearch />
                    </div>
                )}
            </div>

            <AuthModal
                open={authOpen}
                onClose={() => setAuthOpen(false)}
                initialMode={authMode}
            />
            {businessRegisterOpen && (
                <BusinessRegisterForm
                    onClose={() => setBusinessRegisterOpen(false)}
                />
            )}
        </header>
    );
}
