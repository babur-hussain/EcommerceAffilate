"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  formatCurrency,
  formatNumber,
  formatDate,
  getStatusColor,
} from "@/lib/utils";
import { Seller } from "@/types";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  MoreVertical,
  Store,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchSellers();
    const interval = setInterval(fetchSellers, 60000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const fetchSellers = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await api.get(`/api/super-admin/sellers?${params}`);
      setSellers(response.data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast.error("Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId: string) => {
    try {
      await api.patch(`/api/super-admin/sellers/${sellerId}/approve`);
      toast.success("Seller approved successfully");
      fetchSellers();
    } catch (error) {
      toast.error("Failed to approve seller");
    }
  };

  const handleSuspend = async (sellerId: string) => {
    try {
      await api.patch(`/api/super-admin/sellers/${sellerId}/suspend`);
      toast.success("Seller suspended");
      fetchSellers();
    } catch (error) {
      toast.error("Failed to suspend seller");
    }
  };

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.business?.businessName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

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
            Seller Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all seller accounts and businesses
          </p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-medium">LIVE</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sellers by name, email, or business..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Store className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No sellers found</p>
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {seller.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Mail className="h-3 w-3" />
                          {seller.email}
                        </div>
                        {seller.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            {seller.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {seller.business ? (
                        <div>
                          <p className="font-medium text-gray-900">
                            {seller.business.businessName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {seller.business.businessType}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(
                              seller.business.status
                            )}`}
                          >
                            {seller.business.status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No business
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="text-gray-600">
                          {formatNumber(seller.stats.totalProducts)} products
                        </div>
                        <div className="text-gray-600">
                          {formatNumber(seller.stats.totalOrders)} orders
                        </div>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(seller.stats.totalRevenue)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          seller.isActive ? "active" : "inactive"
                        )}`}
                      >
                        {seller.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(seller.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {seller.business?.status === "PENDING" && (
                          <button
                            onClick={() => handleApprove(seller._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Approve"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                        <a
                          href={`/admin/sellers/${seller._id}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="Manage Details"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </a>
                        {seller.isActive ? (
                          <button
                            onClick={() => handleSuspend(seller._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Suspend"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(seller._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Activate"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Sellers</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(sellers.length)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {formatNumber(sellers.filter((s) => s.isActive).length)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {formatNumber(
                sellers.filter((s) => s.business?.status === "PENDING").length
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                sellers.reduce((sum, s) => sum + s.stats.totalRevenue, 0)
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
