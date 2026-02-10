'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Product } from '@/types';
import { Plus, Edit, Trash2, Eye, EyeOff, Package, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

type FilterType = 'all' | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';

const getApprovalBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return (
        <span className="px-2 py-0.5 inline-flex items-center gap-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
          <Clock className="h-3 w-3" />
          Pending Review
        </span>
      );
    case 'approved':
      return (
        <span className="px-2 py-0.5 inline-flex items-center gap-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3" />
          Approved
        </span>
      );
    case 'rejected':
      return (
        <span className="px-2 py-0.5 inline-flex items-center gap-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
          <XCircle className="h-3 w-3" />
          Rejected
        </span>
      );
    default:
      return null;
  }
};

export default function SellerProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [groceryProducts, setGroceryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeTab, setActiveTab] = useState<'regular' | 'grocery'>('regular');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [user]);

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!selectedProductId) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            await processAndUploadImage(blob, selectedProductId);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [selectedProductId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productsRes, groceryRes] = await Promise.all([
        apiClient.get<Product[]>('/api/business/products'),
        apiClient.get<Product[]>('/api/business/grocery-products')
      ]);

      const allProducts = productsRes.data || [];
      const grocery = groceryRes.data || [];

      // Filter out grocery items from standard products list if they accidentally appear there
      // We assume grocery items might have 'Grocery' category or specific parentCategory
      const regular = allProducts.filter(p => p.category !== 'Grocery' && (p as any).parentCategory !== '695f88c75f463eeb3c42e765');

      setProducts(regular);
      setGroceryProducts(grocery);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const processAndUploadImage = async (file: File, productId: string) => {
    const toastId = toast.loading('Processing & Uploading image...');
    try {
      // 1. Resize and Convert to WebP (500x500)
      const imageBitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context failed');

      // Draw resized
      ctx.drawImage(imageBitmap, 0, 0, 500, 500);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/webp', 0.9)
      );

      if (!blob) throw new Error('Image conversion failed');

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('image', blob, 'pasted-product.webp');

      const uploadRes = await apiClient.post<{ imageUrl: string }>('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newImageUrl = uploadRes.data.imageUrl;

      // 3. Update Product
      await apiClient.patch(`/api/products/${productId}/image`, { imageUrl: newImageUrl });

      // 4. Update Local State
      const updateList = (list: Product[]) =>
        list.map(p => {
          if (p._id === productId) {
            return {
              ...p,
              images: [newImageUrl, ...(p.images || [])],
              image: newImageUrl
            };
          }
          return p;
        });

      setProducts(prev => updateList(prev));
      setGroceryProducts(prev => updateList(prev));

      toast.success('Image updated successfully!', { id: toastId });
      setSelectedProductId(null); // Deselect after success

    } catch (error) {
      console.error('Paste upload failed:', error);
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const toggleProductStatus = async (product: Product, isActive: boolean) => {
    // Prevent activation of unapproved products
    if (isActive && product.approvalStatus !== 'approved') {
      toast.error('Product must be approved before it can be activated');
      return;
    }

    try {
      await apiClient.patch(`/api/products/${product._id}/status`, { isActive });
      toast.success(`Product ${isActive ? 'activated' : 'deactivated'}`);
      fetchProducts();
    } catch (error: any) {
      console.error('Failed to update product:', error);
      const message = error.response?.data?.error || 'Failed to update product';
      toast.error(message);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await apiClient.delete(`/api/products/${productId}`);
      toast.success('Product deleted');

      // Update local state instead of re-fetching
      setProducts(prev => prev.filter(p => p._id !== productId));
      setGroceryProducts(prev => prev.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const resubmitProduct = async (productId: string) => {
    try {
      await apiClient.patch(`/api/products/${productId}/resubmit`);
      toast.success('Product resubmitted for review!');
      fetchProducts();
    } catch (error: any) {
      console.error('Failed to resubmit product:', error);
      const message = error.response?.data?.error || 'Failed to resubmit product';
      toast.error(message);
    }
  };

  const currentList = activeTab === 'regular' ? products : groceryProducts;

  const filteredProducts = currentList.filter((product) => {
    if (filter === 'all') return true;
    if (filter === 'active') return product.isActive;
    if (filter === 'pending') return product.approvalStatus === 'pending';
    if (filter === 'approved') return product.approvalStatus === 'approved';
    if (filter === 'rejected') return product.approvalStatus === 'rejected';
    return true;
  });

  const pendingCount = currentList.filter(p => p.approvalStatus === 'pending').length;
  const rejectedCount = currentList.filter(p => p.approvalStatus === 'rejected').length;

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product listings</p>
          </div>
          <Link
            href="/seller/products/new"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Link>
        </div>

        {/* Grocery Tab Switcher */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('regular')}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'regular'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Standard Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('grocery')}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'grocery'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Grocery Products ({groceryProducts.length})
          </button>
        </div>

        {/* Pending Alert */}
        {pendingCount > 0 && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-amber-800">
              <strong>{pendingCount} product{pendingCount !== 1 ? 's' : ''}</strong> pending review.
              Products must be approved by admin before they can be made live.
            </p>
          </div>
        )}

        {/* Rejected Alert */}
        {rejectedCount > 0 && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">
              <strong>{rejectedCount} product{rejectedCount !== 1 ? 's' : ''}</strong> rejected.
              Please review and update rejected products to resubmit for approval.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All ({currentList.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'approved'
              ? 'bg-green-600 text-white'
              : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
          >
            Approved ({currentList.filter(p => p.approvalStatus === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'rejected'
              ? 'bg-red-600 text-white'
              : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
          >
            Rejected ({rejectedCount})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'active'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Live ({currentList.filter(p => p.isActive).length})
          </button>
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
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-10 w-10 flex-shrink-0 cursor-pointer p-0.5 rounded transition-all ${selectedProductId === product._id
                            ? 'ring-2 ring-blue-500 shadow-md scale-110'
                            : 'hover:ring-2 hover:ring-gray-300'
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProductId(selectedProductId === product._id ? null : product._id);
                            if (selectedProductId !== product._id) {
                              toast('Paste an image now to update', { icon: '📋' });
                            }
                          }}
                          title="Click to select and paste new image"
                        >
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-full w-full rounded object-cover"
                              src={product.images[0]}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-full w-full rounded bg-gray-200 flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.title || product.name}
                          </div>
                          <div className="text-xs text-gray-500">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{product.price}</div>
                      {product.discountPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          ₹{product.discountPrice}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {product.stock}
                      </div>
                      {product.stock < 10 && (
                        <div className="text-xs text-red-500">Low stock</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getApprovalBadge(product.approvalStatus)}
                        {product.approvalStatus === 'rejected' && product.approvalNote && (
                          <div className="text-xs text-red-600 max-w-[200px]" title={product.approvalNote}>
                            <span className="font-medium">Reason:</span> {product.approvalNote}
                          </div>
                        )}
                        {product.approvalStatus === 'rejected' && (
                          <button
                            onClick={() => resubmitProduct(product._id)}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Resubmit for Review
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {product.isActive ? 'Live' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Activate/Deactivate button - disabled for non-approved products */}
                        <button
                          onClick={() => toggleProductStatus(product, !product.isActive)}
                          disabled={product.approvalStatus !== 'approved'}
                          className={`${product.approvalStatus !== 'approved'
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                          title={
                            product.approvalStatus !== 'approved'
                              ? 'Product must be approved first'
                              : product.isActive
                                ? 'Deactivate'
                                : 'Activate'
                          }
                        >
                          {product.isActive ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                        <Link
                          href={`/seller/products/${product._id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        {(user.role === 'SELLER_OWNER' || user.role === 'SELLER_MANAGER') && (
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {filter === 'all'
                    ? 'No products found. Add your first product.'
                    : `No ${filter} products found.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
