"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { Attribution, InfluencerStats } from "@/types";
import {
  TrendingUp,
  MousePointerClick,
  ShoppingCart,
  DollarSign,
  Calendar,
  Filter,
  Download,
} from "lucide-react";

export default function PerformancePage() {
  const [attributions, setAttributions] = useState<Attribution[]>([]);
  const [stats, setStats] = useState<InfluencerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "click" | "conversion" | "paid">(
    "all"
  );
  const [dateRange, setDateRange] = useState("30");

  useEffect(() => {
    fetchPerformanceData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchPerformanceData();
    }, 60000);
    return () => clearInterval(interval);
  }, [dateRange, filter]);

  const fetchPerformanceData = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      params.append("days", dateRange);

      const [attributionsRes, statsRes] = await Promise.all([
        api.get(`/api/influencers/attributions?${params}`),
        api.get("/api/influencers/stats"),
      ]);

      setAttributions(attributionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const csvContent = [
      [
        "Date",
        "Product",
        "Status",
        "Clicks",
        "Order Amount",
        "Commission",
      ].join(","),
      ...attributions.map((attr) =>
        [
          formatDate(attr.createdAt),
          attr.product?.name || "N/A",
          attr.status,
          "1",
          attr.orderAmount || "0",
          attr.commissionAmount || "0",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Performance Analytics
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600">
              Track your clicks, conversions, and earnings
            </p>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">LIVE</span>
            </div>
          </div>
        </div>
        <button
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MousePointerClick className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Total Clicks
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(stats.totalClicks)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Conversions</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(stats.totalConversions)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.conversionRate.toFixed(2)}% conversion rate
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Total Earnings
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(stats.totalEarnings)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Avg Order Value
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(stats.averageOrderValue)}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <div className="flex gap-2">
            {["all", "click", "conversion", "paid"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attributions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attributions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No attributions found for the selected filters
                  </td>
                </tr>
              ) : (
                attributions.map((attr) => (
                  <tr key={attr._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(attr.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        {attr.product?.images?.[0] && (
                          <img
                            src={attr.product.images[0]}
                            alt={attr.product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <span className="font-medium text-gray-900">
                          {attr.product?.name || "Unknown Product"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          attr.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : attr.status === "conversion"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {attr.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {attr.orderAmount
                        ? formatCurrency(attr.orderAmount)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-primary-600">
                      {attr.commissionAmount
                        ? formatCurrency(attr.commissionAmount)
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
