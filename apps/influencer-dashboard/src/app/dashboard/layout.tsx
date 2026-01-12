"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Link2,
  User,
  LogOut,
  Menu,
  X,
  BarChart3,
  Copy,
  CheckCircle,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Performance", href: "/dashboard/performance", icon: TrendingUp },
  { name: "Earnings", href: "/dashboard/earnings", icon: DollarSign },
  { name: "Affiliate Links", href: "/dashboard/links", icon: Link2 },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const copyReferralCode = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
            <div>
              <h1 className="text-xl font-bold text-white">Influencer Hub</h1>
              <p className="text-xs text-gray-400">Creator Dashboard</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Profile section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {profile?.profileImage || user.photoURL ? (
                  <img
                    src={profile?.profileImage || user.photoURL || ""}
                    alt={profile?.name || user.displayName || "User"}
                    className="h-12 w-12 rounded-full ring-2 ring-primary-500"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ring-2 ring-primary-500">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {profile?.name || user.displayName || "Influencer"}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            {/* Referral Code Badge */}
            {profile?.referralCode && (
              <div className="mt-3 bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg p-3">
                <div className="text-center">
                  <span className="text-xs text-white/80 font-medium block mb-1">
                    Your Referral Code
                  </span>
                  <div className="flex items-center justify-between space-x-2">
                    <span className="text-lg font-bold text-white tracking-wider">
                      {profile.referralCode}
                    </span>
                    <button
                      onClick={copyReferralCode}
                      className="p-1.5 hover:bg-white/20 rounded transition-colors"
                      title="Copy code"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <Copy className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-900/50"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center h-16 bg-white shadow-sm px-4 lg:px-8 border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {navigation.find((item) => item.href === pathname)?.name ||
                "Dashboard"}
            </h2>
            <div className="flex items-center space-x-4">
              {/* Referral Code Display in Header */}
              {profile?.referralCode && (
                <button
                  onClick={copyReferralCode}
                  className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 group"
                  title="Click to copy"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs opacity-90 font-medium">
                      Referral Code
                    </span>
                    <span className="text-sm font-bold tracking-wider">
                      {profile.referralCode}
                    </span>
                  </div>
                  {copied ? (
                    <CheckCircle className="h-5 w-5 ml-2" />
                  ) : (
                    <Copy className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
