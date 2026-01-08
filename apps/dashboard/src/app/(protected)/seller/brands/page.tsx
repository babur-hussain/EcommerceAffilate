'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';

export default function BrandsPage() {
  return (
    <ProtectedRoute allowedRoles={['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF']}>
      <div className="space-y-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
            <p className="text-gray-600">Manage your product brands</p>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Brand
          </button>
        </div>

        {/* Brand Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Brands</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Tag className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Brands</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <Tag className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Tag className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Your Brands</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No brands created yet</p>
              <p className="text-sm text-gray-400 mt-2">Create your first brand to organize your products</p>
              <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Brand
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
