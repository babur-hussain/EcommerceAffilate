'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { DollarSign, Link as LinkIcon, MousePointerClick, ShoppingCart } from 'lucide-react';

interface InfluencerStats {
  totalEarnings: number;
  pendingPayouts: number;
  totalClicks: number;
  totalOrders: number;
  conversionRate: number;
  activeLinks: number;
}

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
          {trend && <p className="text-sm text-green-600 mt-1">{trend}</p>}
        </div>
        <div className="p-3 bg-primary-100 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </div>
  );
}

export default function InfluencerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<InfluencerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get<InfluencerStats>('/api/influencer/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={['INFLUENCER']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Influencer Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your performance and earnings</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  title="Total Earnings"
                  value={`$${stats.totalEarnings.toLocaleString()}`}
                  icon={DollarSign}
                />
                <StatCard
                  title="Pending Payouts"
                  value={`$${stats.pendingPayouts.toLocaleString()}`}
                  icon={DollarSign}
                />
                <StatCard
                  title="Active Links"
                  value={stats.activeLinks.toString()}
                  icon={LinkIcon}
                />
                <StatCard
                  title="Total Clicks"
                  value={stats.totalClicks.toLocaleString()}
                  icon={MousePointerClick}
                />
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders.toLocaleString()}
                  icon={ShoppingCart}
                />
                <StatCard
                  title="Conversion Rate"
                  value={`${stats.conversionRate.toFixed(2)}%`}
                  icon={ShoppingCart}
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="/influencer/links"
                    className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <LinkIcon className="h-8 w-8 text-primary-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Generate Links</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Create affiliate links for products
                    </p>
                  </a>
                  <a
                    href="/influencer/earnings"
                    className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <DollarSign className="h-8 w-8 text-primary-600 mb-2" />
                    <h3 className="font-medium text-gray-900">View Earnings</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Track your commissions and payouts
                    </p>
                  </a>
                  <a
                    href="/influencer/performance"
                    className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <MousePointerClick className="h-8 w-8 text-primary-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Performance</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Analyze clicks and conversions
                    </p>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No stats data available</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
