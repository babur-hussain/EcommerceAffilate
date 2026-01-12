"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import toast from "react-hot-toast";
import {
  TrendingUp,
  DollarSign,
  MousePointerClick,
  ShoppingCart,
  Eye,
  Link2,
  ArrowUpRight,
  Copy,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { DashboardMetrics, TopProduct, ClicksOverTime } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [clicksData, setClicksData] = useState<ClicksOverTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  const [copiedCode, setCopiedCode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }
      const [metricsRes, productsRes, clicksRes] = await Promise.all([
        api.get("/api/influencers/metrics"),
        api.get("/api/influencers/top-products"),
        api.get("/api/influencers/clicks-over-time?days=30"),
      ]);

      setMetrics(metricsRes.data);
      setTopProducts(productsRes.data);
      setClicksData(clicksRes.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
      if (showRefreshIndicator) {
        setIsRefreshing(false);
      }
    }
  };

  const copyReferralCode = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      setCopiedCode(true);
      toast.success("Referral code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Log profile for debugging
  useEffect(() => {
    console.log("Profile data:", profile);
    console.log("Referral code:", profile?.referralCode);
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const currentMetrics = metrics?.[period] || {
    clicks: 0,
    conversions: 0,
    earnings: 0,
  };

  const allTimeMetrics = metrics?.allTime || {
    totalClicks: 0,
    totalConversions: 0,
    conversionRate: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    averageOrderValue: 0,
    totalOrders: 0,
  };

  return (
    <div className="space-y-6">
      {/* Referral Code Highlight Banner */}
      {profile?.referralCode && (
        <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-1">
                  Your Unique Referral Code
                </h3>
                <p className="text-white/80 text-sm">
                  Share this code to earn commissions on sales
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg border-2 border-white/30">
                <span className="text-white text-2xl font-bold tracking-widest">
                  {profile.referralCode}
                </span>
              </div>
              <button
                onClick={copyReferralCode}
                className="bg-white text-primary-600 px-4 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.name || "Influencer"}!
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-600">Here's your performance overview</p>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">LIVE DATA</span>
              </div>
              {isRefreshing && (
                <span className="text-gray-500 italic">Refreshing...</span>
              )}
              {!isRefreshing && (
                <span className="text-gray-400">
                  Updated{" "}
                  {Math.floor(
                    (new Date().getTime() - lastUpdated.getTime()) / 1000
                  )}
                  s ago
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-50"
            title="Refresh data"
          >
            {isRefreshing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                Refreshing...
              </div>
            ) : (
              "🔄 Refresh"
            )}
          </button>
          <button
            onClick={() => setPeriod("today")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === "today"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod("week")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === "week"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === "month"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earnings"
          value={formatCurrency(currentMetrics.earnings)}
          icon={<DollarSign className="h-6 w-6 text-primary-600" />}
          subtitle={`${formatCurrency(allTimeMetrics.pendingEarnings)} pending`}
        />
        <StatCard
          title="Clicks"
          value={formatNumber(currentMetrics.clicks)}
          icon={<MousePointerClick className="h-6 w-6 text-blue-600" />}
          subtitle={`${formatNumber(allTimeMetrics.totalClicks)} all-time`}
        />
        <StatCard
          title="Conversions"
          value={formatNumber(currentMetrics.conversions)}
          icon={<ShoppingCart className="h-6 w-6 text-green-600" />}
          subtitle={`${formatPercentage(
            allTimeMetrics.conversionRate
          )} conversion rate`}
        />
        <StatCard
          title="Avg Order Value"
          value={formatCurrency(allTimeMetrics.averageOrderValue)}
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          subtitle={`${formatNumber(allTimeMetrics.totalOrders)} total orders`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clicks Over Time */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Clicks & Conversions (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clicksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Clicks"
              />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#10b981"
                strokeWidth={2}
                name="Conversions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Products
          </h3>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No product data yet
              </p>
            ) : (
              topProducts.slice(0, 5).map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.clicks} clicks · {product.conversions}{" "}
                      conversions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(product.commission)}
                    </p>
                    <p className="text-xs text-gray-500">earned</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/links"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Link2 className="h-6 w-6 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">Create New Link</p>
              <p className="text-sm text-gray-500">Generate affiliate link</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 ml-auto" />
          </a>
          <a
            href="/dashboard/performance"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Eye className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">View Performance</p>
              <p className="text-sm text-gray-500">Detailed analytics</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 ml-auto" />
          </a>
          <a
            href="/dashboard/earnings"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <DollarSign className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Request Payout</p>
              <p className="text-sm text-gray-500">Withdraw earnings</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}
