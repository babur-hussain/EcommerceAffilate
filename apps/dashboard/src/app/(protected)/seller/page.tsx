// @ts-nocheck
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { AnalyticsData } from '@/types';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.get<AnalyticsData>('/api/business/analytics/overview');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueBreakdown = analytics ? [
    { name: 'Sponsored', value: analytics.sponsoredRevenue },
    { name: 'Organic', value: analytics.organicRevenue },
  ] : [];

  const COLORS = ['#0ea5e9', '#10b981'];

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-1">Your business performance overview</p>
        </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : analytics ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Revenue"
                  value={`$${analytics.revenue.toLocaleString()}`}
                  icon={DollarSign}
                />
                <StatCard
                  title="Total Orders"
                  value={analytics.orders.toLocaleString()}
                  icon={ShoppingCart}
                />
                <StatCard
                  title="Sponsored Sales"
                  value={`$${analytics.sponsoredRevenue.toLocaleString()}`}
                  icon={TrendingUp}
                />
                <StatCard
                  title="Organic Sales"
                  value={`$${analytics.organicRevenue.toLocaleString()}`}
                  icon={Package}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.revenueTimeSeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#0ea5e9" />
                    <Bar dataKey="orders" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No analytics data available</p>
            </div>
          )}
        </div>
      </ProtectedRoute>
    );
}
