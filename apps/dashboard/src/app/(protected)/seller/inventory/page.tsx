"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Package, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  title: string;
  image: string;
  stock: number;
  lowStockThreshold?: number;
  price: number;
  sku?: string;
  category: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/products/seller/my-products");
      const allProducts = response.data;

      setProducts(allProducts);

      // Calculate stats
      const total = allProducts.length;
      const outOfStock = allProducts.filter(
        (p: Product) => p.stock === 0
      ).length;
      const lowStock = allProducts.filter((p: Product) => {
        const threshold = p.lowStockThreshold || 10;
        return p.stock > 0 && p.stock <= threshold;
      }).length;
      const inStock = total - outOfStock - lowStock;

      setStats({
        total,
        inStock,
        lowStock,
        outOfStock,
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0)
      return { label: "Out of Stock", color: "text-red-600", bg: "bg-red-100" };
    const threshold = product.lowStockThreshold || 10;
    if (product.stock <= threshold)
      return {
        label: "Low Stock",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    return { label: "In Stock", color: "text-green-600", bg: "bg-green-100" };
  };

  const lowStockProducts = products.filter((p) => {
    const threshold = p.lowStockThreshold || 10;
    return p.stock > 0 && p.stock <= threshold;
  });

  return (
    <ProtectedRoute
      allowedRoles={["SELLER_OWNER", "SELLER_MANAGER", "SELLER_STAFF"]}
    >
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-gray-600">
            Track and manage your product stock levels
          </p>
        </div>

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800">
                  Low Stock Alert
                </h3>
                <p className="text-sm text-yellow-700">
                  {lowStockProducts.length} product
                  {lowStockProducts.length !== 1 ? "s are" : " is"} running low
                  on stock
                </p>
                <div className="mt-2 space-y-1">
                  {lowStockProducts.slice(0, 3).map((p) => (
                    <p key={p._id} className="text-xs text-yellow-600">
                      • {p.title} - {p.stock} units remaining
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stats.total}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? "..." : stats.inStock}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {loading ? "..." : stats.lowStock}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {loading ? "..." : stats.outOfStock}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Inventory List</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading inventory...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No inventory data available</p>
                <p className="text-sm text-gray-400 mt-2">
                  Start by adding products to see inventory levels
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const status = getStockStatus(product);
                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-10 w-10 rounded object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.sku || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {product.stock} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.bg} ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
