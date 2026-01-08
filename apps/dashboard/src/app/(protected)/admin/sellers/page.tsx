'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Business } from '@/types';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSellersPage() {
  const { user } = useAuth();
  const [sellers, setSellers] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await apiClient.get<Business[]>('/api/admin/businesses');
      setSellers(response.data);
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (businessId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    try {
      await apiClient.patch(`/api/admin/businesses/${businessId}/status`, { status });
      toast.success(`Seller ${status.toLowerCase()} successfully`);
      fetchSellers();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update seller status');
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sellers</h1>
            <p className="text-gray-600 mt-1">Manage all sellers on the platform</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellers.map((seller) => (
                    <tr key={seller._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{seller.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{seller.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            seller.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : seller.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {seller.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {seller.status !== 'ACTIVE' && (
                            <button
                              onClick={() => updateStatus(seller._id, 'ACTIVE')}
                              className="text-green-600 hover:text-green-900"
                              title="Activate"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          )}
                          {seller.status === 'ACTIVE' && (
                            <button
                              onClick={() => updateStatus(seller._id, 'SUSPENDED')}
                              className="text-red-600 hover:text-red-900"
                              title="Suspend"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sellers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No sellers found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
