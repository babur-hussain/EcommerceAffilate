"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import {
  Users,
  Store,
  UserCheck,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  AlertCircle,
} from "lucide-react";
import { PlatformMetrics } from "@/types";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchMetrics();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchMetrics();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await api.get("/api/super-admin/metrics");
      setMetrics(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const overview = metrics?.overview || {
    totalUsers: 0,
    totalSellers: 0,
    totalInfluencers: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCommissions: 0,
  };

  const growth = metrics?.growth || {
    usersGrowth: 0,
    sellersGrowth: 0,
    influencersGrowth: 0,
    revenueGrowth: 0,
  };

  const recent = metrics?.recent || {
    newUsers: 0,
    newOrders: 0,
    pendingApprovals: 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Platform Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time metrics and system status
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {/* User Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={formatNumber(overview.totalUsers)}
            icon={<Users className="h-6 w-6 text-primary-600" />}
            subtitle={`${recent.newUsers} new this week`}
            trend={{
              value: growth.usersGrowth,
              isPositive: growth.usersGrowth >= 0,
            }}
          />
          <StatCard
            title="Sellers"
            value={formatNumber(overview.totalSellers)}
            icon={<Store className="h-6 w-6 text-blue-600" />}
            subtitle="Active seller accounts"
            trend={{
              value: growth.sellersGrowth,
              isPositive: growth.sellersGrowth >= 0,
            }}
          />
          <StatCard
            title="Influencers"
            value={formatNumber(overview.totalInfluencers)}
            icon={<UserCheck className="h-6 w-6 text-green-600" />}
            subtitle="Active influencers"
            trend={{
              value: growth.influencersGrowth,
              isPositive: growth.influencersGrowth >= 0,
            }}
          />
          <StatCard
            title="Customers"
            value={formatNumber(overview.totalCustomers)}
            icon={<Users className="h-6 w-6 text-purple-600" />}
            subtitle="Registered customers"
          />
        </div>
      </div>

      {/* Business Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Business Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={formatNumber(overview.totalProducts)}
            icon={<Package className="h-6 w-6 text-orange-600" />}
            subtitle="Listed on platform"
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(overview.totalOrders)}
            icon={<ShoppingCart className="h-6 w-6 text-blue-600" />}
            subtitle={`${recent.newOrders} new today`}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(overview.totalRevenue)}
            icon={<DollarSign className="h-6 w-6 text-green-600" />}
            subtitle="Platform lifetime revenue"
            trend={{
              value: growth.revenueGrowth,
              isPositive: growth.revenueGrowth >= 0,
            }}
          />
          <StatCard
            title="Total Commissions"
            value={formatCurrency(overview.totalCommissions)}
            icon={<TrendingUp className="h-6 w-6 text-primary-600" />}
            subtitle="Paid to influencers"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pending Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-900">
                  {recent.pendingApprovals}
                </p>
                <p className="text-sm text-yellow-700">Pending Approvals</p>
              </div>
            </div>
            <a
              href="/admin/sellers?status=pending"
              className="text-sm text-yellow-700 hover:text-yellow-800 font-medium"
            >
              Review now →
            </a>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {recent.newUsers}
                </p>
                <p className="text-sm text-blue-700">New Users This Week</p>
              </div>
            </div>
            <a
              href="/admin/users"
              className="text-sm text-blue-700 hover:text-blue-800 font-medium"
            >
              View all →
            </a>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {recent.newOrders}
                </p>
                <p className="text-sm text-green-700">New Orders Today</p>
              </div>
            </div>
            <a
              href="/admin/reports"
              className="text-sm text-green-700 hover:text-green-800 font-medium"
            >
              View report →
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Database</span>
            </div>
            <span className="text-sm font-medium text-green-600">
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">API Services</span>
            </div>
            <span className="text-sm font-medium text-green-600">
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Last Updated</span>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {Math.floor(
                (new Date().getTime() - lastUpdated.getTime()) / 1000
              )}
              s ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
