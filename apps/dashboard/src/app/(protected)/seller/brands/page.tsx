"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAuth } from "firebase/auth";
import { Tag, Plus, Edit, Trash2, X } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  businessId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const getAuthToken = async (): Promise<string | null> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return null;
      return await user.getIdToken();
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return null;
    }
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("http://localhost:4000/api/brands", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch brands");
      }

      const data = await response.json();
      setBrands(data);
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      setError(error.message || "Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brandName.trim()) {
      setError("Brand name is required");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("http://localhost:4000/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: brandName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create brand");
      }

      const newBrand = await response.json();
      setBrands([...brands, newBrand]);
      setBrandName("");
      setShowModal(false);
    } catch (error: any) {
      console.error("Error creating brand:", error);
      setError(error.message || "Failed to create brand");
    } finally {
      setCreating(false);
    }
  };

  const activeBrandsCount = brands.filter((b) => b.isActive).length;
  const totalProducts = brands.reduce(
    (sum, b) => sum + (b.productCount || 0),
    0
  );

  return (
    <ProtectedRoute
      allowedRoles={["SELLER_OWNER", "SELLER_MANAGER", "SELLER_STAFF"]}
    >
      <div className="space-y-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
            <p className="text-gray-600">Manage your product brands</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
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
                <p className="text-2xl font-bold text-gray-900">
                  {brands.length}
                </p>
              </div>
              <Tag className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Brands</p>
                <p className="text-2xl font-bold text-green-600">
                  {activeBrandsCount}
                </p>
              </div>
              <Tag className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalProducts}
                </p>
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
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading brands...</p>
              </div>
            ) : brands.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No brands created yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Create your first brand to organize your products
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Brand
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <div
                    key={brand._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Tag className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {brand.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {brand.isActive ? (
                              <span className="text-green-600">Active</span>
                            ) : (
                              <span className="text-gray-400">Inactive</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        {brand.productCount || 0}{" "}
                        {brand.productCount === 1 ? "product" : "products"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Brand Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Brand
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setBrandName("");
                  setError("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="brandName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  disabled={creating}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setBrandName("");
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !brandName.trim()}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? "Creating..." : "Create Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
