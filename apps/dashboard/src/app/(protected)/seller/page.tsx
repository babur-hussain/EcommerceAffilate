// @ts-nocheck
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { AnalyticsData } from '@/types';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Package, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';

// Account Under Review Component
function AccountUnderReview({ businessData }: { businessData?: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 animate-ping">
                  <Clock className="w-20 h-20 text-white opacity-30" />
                </div>
                <Clock className="w-20 h-20 text-white relative" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Account Under Review
            </h1>
            <p className="text-amber-50 text-lg">
              Your seller application is being processed
            </p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <p className="text-slate-600 text-lg leading-relaxed">
                Thank you for registering as a seller! Our team is currently reviewing your application
                to ensure the quality and security of our marketplace.
              </p>
            </div>

            {/* Business Info */}
            {businessData?.tradeName && (
              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Business Name
                </h3>
                <p className="text-xl font-bold text-slate-900">{businessData.tradeName}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Application Submitted</h4>
                  <p className="text-slate-600 text-sm">Your seller account registration was received successfully</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Under Review</h4>
                  <p className="text-slate-600 text-sm">Our team is verifying your business details and documents</p>
                </div>
              </div>

              <div className="flex items-start gap-4 opacity-40">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Account Approved</h4>
                  <p className="text-slate-600 text-sm">You'll get access to your seller dashboard</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 mb-8">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">What happens next?</h4>
                  <ul className="text-blue-800 text-sm space-y-2">
                    <li>• Our team will review your application within 24-48 hours</li>
                    <li>• You'll receive an email notification once approved</li>
                    <li>• After approval, you can access the full seller dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-slate-600 mb-4">Need help or have questions?</p>
              <a
                href="mailto:support@localforvocalstartup.com"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-500 text-sm mt-6">
          This review process helps maintain the quality and trust of our marketplace
        </p>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessStatus, setBusinessStatus] = useState<{
    status: string;
    businessId?: string;
    tradeName?: string;
  } | null>(null);

  useEffect(() => {
    checkBusinessStatus();
  }, []);

  const checkBusinessStatus = async () => {
    try {
      // Check if user has business status
      const statusResponse = await apiClient.get('/api/business/status');
      setBusinessStatus(statusResponse.data);

      // If approved, fetch analytics
      if (statusResponse.data.status === 'APPROVED') {
        fetchAnalytics();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to check business status:', error);
      setLoading(false);
    }
  };

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

  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show under review if status is PENDING
  if (businessStatus?.status === 'PENDING') {
    return <AccountUnderReview businessData={businessStatus} />;
  }

  // Show rejection message if rejected
  if (businessStatus?.status === 'REJECTED') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Application Not Approved</h1>
          <p className="text-slate-600 text-lg mb-8">
            Unfortunately, your seller application was not approved at this time.
          </p>
          <a
            href="mailto:support@localforvocalstartup.com"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            Contact Support for Details
          </a>
        </div>
      </div>
    );
  }

  // Show main dashboard if approved
  return (
    <ProtectedRoute allowedRoles={['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-1">Your business performance overview</p>
        </div>

        {analytics ? (
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
