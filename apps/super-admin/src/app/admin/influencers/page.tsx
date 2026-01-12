"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatPercentage,
  getStatusColor,
} from "@/lib/utils";
import { Influencer } from "@/types";
import {
  Search,
  Filter,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  MousePointerClick,
  ShoppingCart,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import toast from "react-hot-toast";

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchInfluencers();
    const interval = setInterval(fetchInfluencers, 60000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const fetchInfluencers = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await api.get(`/api/super-admin/influencers?${params}`);
      setInfluencers(response.data);
    } catch (error) {
      console.error("Error fetching influencers:", error);
      toast.error("Failed to fetch influencers");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (
    influencerId: string,
    isActive: boolean
  ) => {
    try {
      await api.patch(`/api/super-admin/influencers/${influencerId}/status`, {
        isActive: !isActive,
      });
      toast.success(
        `Influencer ${!isActive ? "activated" : "suspended"} successfully`
      );
      fetchInfluencers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredInfluencers = influencers.filter(
    (inf) =>
      inf.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.referralCode.toLowerCase().includes(searchQuery.toLowerCase())
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
            Influencer Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all influencer accounts and performance
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
                placeholder="Search by name, email, or referral code..."
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
            </select>
          </div>
        </div>
      </div>

      {/* Influencers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Influencer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Referral Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Social
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInfluencers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No influencers found</p>
                  </td>
                </tr>
              ) : (
                filteredInfluencers.map((influencer) => (
                  <tr key={influencer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {influencer.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Mail className="h-3 w-3" />
                          {influencer.email}
                        </div>
                        {influencer.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            {influencer.phoneNumber}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <Calendar className="h-3 w-3" />
                          Joined {formatDate(influencer.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-lg font-mono font-semibold">
                        {influencer.referralCode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MousePointerClick className="h-4 w-4" />
                          {formatNumber(influencer.stats.totalClicks)} clicks
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <ShoppingCart className="h-4 w-4" />
                          {formatNumber(influencer.stats.totalConversions)}{" "}
                          conversions
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          {formatPercentage(
                            influencer.stats.conversionRate
                          )}{" "}
                          rate
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(influencer.stats.totalEarnings)}
                        </div>
                        <div className="text-yellow-600">
                          {formatCurrency(influencer.stats.pendingEarnings)}{" "}
                          pending
                        </div>
                        <div className="text-green-600">
                          {formatCurrency(influencer.stats.paidEarnings)} paid
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {influencer.socialMedia?.instagram && (
                          <a
                            href={influencer.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-700"
                            title="Instagram"
                          >
                            <Instagram className="h-4 w-4" />
                          </a>
                        )}
                        {influencer.socialMedia?.youtube && (
                          <a
                            href={influencer.socialMedia.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700"
                            title="YouTube"
                          >
                            <Youtube className="h-4 w-4" />
                          </a>
                        )}
                        {influencer.socialMedia?.twitter && (
                          <a
                            href={influencer.socialMedia.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                            title="Twitter"
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                        )}
                        {!influencer.socialMedia && (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          influencer.isActive ? "active" : "inactive"
                        )}`}
                      >
                        {influencer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          handleToggleStatus(
                            influencer._id,
                            influencer.isActive
                          )
                        }
                        className={`px-3 py-1 text-sm font-medium rounded-lg ${
                          influencer.isActive
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                      >
                        {influencer.isActive ? "Suspend" : "Activate"}
                      </button>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Influencers</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(influencers.length)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {formatNumber(influencers.filter((i) => i.isActive).length)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Clicks</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatNumber(
                influencers.reduce((sum, i) => sum + i.stats.totalClicks, 0)
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Conversions</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatNumber(
                influencers.reduce(
                  (sum, i) => sum + i.stats.totalConversions,
                  0
                )
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                influencers.reduce((sum, i) => sum + i.stats.totalEarnings, 0)
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
