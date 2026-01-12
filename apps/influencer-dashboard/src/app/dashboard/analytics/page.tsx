"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, Download } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    clicksOverTime: [],
    revenueOverTime: [],
    topCategories: [],
    deviceBreakdown: [],
    sourceBreakdown: [],
    hourlyPerformance: [],
    trends: null,
  });

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 60000);
    return () => clearInterval(interval);
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(
        `/api/influencers/analytics?days=${period}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const report = {
      period: `Last ${period} days`,
      generated: new Date().toISOString(),
      data: data,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { trends } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600">Deep insights into your performance</p>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">LIVE</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Trends */}
      {trends && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Click Growth
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(trends.clicks.current)}
              </p>
              <div
                className={`flex items-center text-sm font-medium ${
                  trends.clicks.growth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trends.clicks.growth >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(trends.clicks.growth).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Conversion Growth
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(trends.conversions.current)}
              </p>
              <div
                className={`flex items-center text-sm font-medium ${
                  trends.conversions.growth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {trends.conversions.growth >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(trends.conversions.growth).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Revenue Growth
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(trends.revenue.current)}
              </p>
              <div
                className={`flex items-center text-sm font-medium ${
                  trends.revenue.growth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trends.revenue.growth >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(trends.revenue.growth).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Conversion Rate
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(trends.conversionRate.current)}
              </p>
              <div
                className={`flex items-center text-sm font-medium ${
                  trends.conversionRate.growth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {trends.conversionRate.growth >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(trends.conversionRate.growth).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clicks & Conversions Over Time */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.clicksOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
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

        {/* Revenue Over Time */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Categories
          </h3>
          {data.topCategories.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.topCategories.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {data.topCategories
                  .slice(0, 5)
                  .map((cat: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-sm text-gray-700">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {cat.value}
                      </span>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Device Breakdown
          </h3>
          {data.deviceBreakdown.length > 0 ? (
            <div className="space-y-3">
              {data.deviceBreakdown.map((device: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{device.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {device.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Traffic Sources
          </h3>
          {data.sourceBreakdown.length > 0 ? (
            <div className="space-y-3">
              {data.sourceBreakdown.map((source: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{source.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {source.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (source.count /
                            Math.max(
                              ...data.sourceBreakdown.map((s: any) => s.count)
                            )) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Hourly Performance */}
      {data.hourlyPerformance.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance by Hour of Day
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.hourlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="clicks" fill="#3b82f6" name="Clicks" />
              <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
