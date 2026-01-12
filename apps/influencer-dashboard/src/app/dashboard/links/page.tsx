"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  formatNumber,
  copyToClipboard,
  generateAffiliateUrl,
} from "@/lib/utils";
import { AffiliateLink } from "@/types";
import {
  Link2,
  Copy,
  ExternalLink,
  Plus,
  Search,
  MousePointerClick,
  ShoppingCart,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function LinksPage() {
  const { profile } = useAuth();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLinks();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchLinks();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await api.get("/api/influencers/affiliate-links");
      setLinks(response.data);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    if (!query || query.length < 2) {
      setProducts([]);
      return;
    }

    try {
      const response = await api.get(`/api/products?search=${query}&limit=10`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleCreateLink = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/influencers/affiliate-links", {
        productId: selectedProduct,
      });

      toast.success("Affiliate link created successfully!");
      setShowCreateModal(false);
      setSelectedProduct("");
      setSearchQuery("");
      setProducts([]);
      await fetchLinks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create link");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = async (link: AffiliateLink) => {
    const url = generateAffiliateUrl(
      process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000",
      profile?.referralCode || "",
      link.productId
    );

    try {
      await copyToClipboard(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleToggleStatus = async (linkId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/api/influencers/affiliate-links/${linkId}`, {
        isActive: !currentStatus,
      });

      toast.success(`Link ${!currentStatus ? "activated" : "deactivated"}`);
      await fetchLinks();
    } catch (error) {
      toast.error("Failed to update link status");
    }
  };

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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Affiliate Links
            </h1>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">LIVE</span>
            </div>
          </div>
          <p className="text-gray-600 mt-1">
            Create and manage your product affiliate links
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          Create New Link
        </button>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No affiliate links yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first affiliate link to start earning commissions
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              Create Link
            </button>
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link._id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              {/* Product Info */}
              <div className="flex items-start gap-4 mb-4">
                {link.product?.images?.[0] && (
                  <img
                    src={link.product.images[0]}
                    alt={link.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {link.product?.name || "Unknown Product"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Price: ₹{link.product?.price || 0}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleStatus(link._id, link.isActive)}
                  className={`p-2 rounded-lg ${
                    link.isActive
                      ? "text-green-600 bg-green-50"
                      : "text-gray-400 bg-gray-50"
                  }`}
                  title={link.isActive ? "Active" : "Inactive"}
                >
                  {link.isActive ? (
                    <ToggleRight className="h-6 w-6" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MousePointerClick className="h-4 w-4" />
                    <span>Clicks</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(link.clicks)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Conversions</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(link.conversions)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyLink(link)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100"
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </button>
                <a
                  href={generateAffiliateUrl(
                    process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000",
                    profile?.referralCode || "",
                    link.productId
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Create Affiliate Link
            </h3>

            {/* Product Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Product
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchProducts(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Search products..."
                />
              </div>
            </div>

            {/* Product Results */}
            {products.length > 0 && (
              <div className="mb-4 space-y-2 max-h-64 overflow-y-auto">
                {products.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => {
                      setSelectedProduct(product._id);
                      setSearchQuery(product.name);
                      setProducts([]);
                    }}
                    className={`w-full flex items-center gap-3 p-3 border rounded-lg text-left ${
                      selectedProduct === product._id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">₹{product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedProduct("");
                  setSearchQuery("");
                  setProducts([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLink}
                disabled={submitting || !selectedProduct}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
