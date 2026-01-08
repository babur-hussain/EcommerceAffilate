// @ts-nocheck
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { AnalyticsData } from '@/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">{trend}</p>
          )}
        </div>
        <div className="p-3 bg-primary-100 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.get<AnalyticsData>('/api/admin/analytics/overview');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout userRole={user.role}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Platform overview and analytics</p>
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
                  title="Sponsored Revenue"
                  value={`$${analytics.sponsoredRevenue.toLocaleString()}`}
                  icon={TrendingUp}
                />
                <StatCard
                  title="Influencer Payouts"
                  value={`$${analytics.influencerPayouts.toLocaleString()}`}
                  icon={Users}
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="productName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Sponsored Sales</p>
                    <p className="text-2xl font-bold text-primary-600">
                      ${analytics.sponsoredRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {((analytics.sponsoredRevenue / analytics.revenue) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Organic Sales</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${analytics.organicRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {((analytics.organicRevenue / analytics.revenue) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No analytics data available</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
