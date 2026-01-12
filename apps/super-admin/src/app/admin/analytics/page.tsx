"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
  UserCheck,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
} from "lucide-react";

interface AnalyticsData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    growth: number;
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
  };
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await api.get(
        `/api/super-admin/analytics?range=${dateRange}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAnalytics(response.data);
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      // Use mock data for now
      setAnalytics({
        revenue: {
          total: 125000,
          thisMonth: 45000,
          lastMonth: 38000,
          growth: 18.4,
        },
        users: {
          total: 1250,
          active: 890,
          new: 45,
          growth: 12.5,
        },
        orders: {
          total: 3420,
          pending: 125,
          completed: 3180,
          growth: 8.9,
        },
        products: {
          total: 450,
          active: 425,
          outOfStock: 25,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Platform performance and insights
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div
              className={`flex items-center text-sm ${
                analytics?.revenue.growth! >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {analytics?.revenue.growth! >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(analytics?.revenue.growth || 0).toFixed(1)}%
            </div>
          </div>
          <h3 className="text-gray-600 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${analytics?.revenue.total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This month: ${analytics?.revenue.thisMonth.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div
              className={`flex items-center text-sm ${
                analytics?.users.growth! >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {analytics?.users.growth! >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(analytics?.users.growth || 0).toFixed(1)}%
            </div>
          </div>
          <h3 className="text-gray-600 text-sm">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {analytics?.users.total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Active: {analytics?.users.active.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <div
              className={`flex items-center text-sm ${
                analytics?.orders.growth! >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {analytics?.orders.growth! >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(analytics?.orders.growth || 0).toFixed(1)}%
            </div>
          </div>
          <h3 className="text-gray-600 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {analytics?.orders.total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Completed: {analytics?.orders.completed.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm">Total Products</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {analytics?.products.total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Active: {analytics?.products.active.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h3>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization coming soon</p>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization coming soon</p>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Products
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-medium">
                    {i}
                  </div>
                  <span className="ml-3 text-sm text-gray-700">
                    Product {i}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ${(Math.random() * 1000).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Sellers
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    S{i}
                  </div>
                  <span className="ml-3 text-sm text-gray-700">
                    Seller {i}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Math.floor(Math.random() * 100)} sales
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Influencers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Influencers
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-600">
                    I{i}
                  </div>
                  <span className="ml-3 text-sm text-gray-700">
                    Influencer {i}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Math.floor(Math.random() * 50)} refs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
