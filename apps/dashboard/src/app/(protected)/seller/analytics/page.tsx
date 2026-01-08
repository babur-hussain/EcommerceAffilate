'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['SELLER_OWNER', 'SELLER_MANAGER']}>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>

        {/* Time Period Filter */}
        <div className="mb-6 flex gap-2">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Last 7 Days</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Last 30 Days</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Last 90 Days</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Custom</button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₹0</p>
            <p className="text-xs text-green-600 mt-1">+0% from last period</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Orders</p>
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">+0% from last period</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₹0</p>
            <p className="text-xs text-gray-500 mt-1">+0% from last period</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0%</p>
            <p className="text-xs text-gray-500 mt-1">+0% from last period</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart will appear here</p>
              </div>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Orders Trend</h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Orders chart will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
