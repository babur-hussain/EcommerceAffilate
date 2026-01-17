import React, { useState } from 'react';
import { X, MapPin, Phone, Mail, Package, Truck, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface OrderItem {
    productId: {
        _id: string;
        title: string;
        image: string;
        price: number;
        businessId: string;
        brand?: string;
        category?: string;
        shortDescription?: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    userId: {
        name: string;
        email: string;
        phone?: string;
    };
    shippingAddress?: {
        name: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    shippingCharges?: number;
    discountAmount?: number;
    couponCode?: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    deliveryStatus?: string;
    paymentStatus?: string;
    paymentProvider?: string;
    createdAt: string;
}

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

export default function OrderDetailsModal({ order: initialOrder, onClose }: OrderDetailsModalProps) {
    const [order, setOrder] = useState(initialOrder);
    const [loading, setLoading] = useState(false);

    const updateStatus = async (newStatus: string, newDeliveryStatus?: string) => {
        try {
            setLoading(true);
            const res = await apiClient.patch(`/api/business/orders/${order._id}/status`, {
                status: newStatus,
                deliveryStatus: newDeliveryStatus
            });
            setOrder(res.data as Order);
            toast.success(`Order status updated to ${newStatus}`);
        } catch (err) {
            console.error('Failed to update status:', err);
            toast.error('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CREATED': return 'text-yellow-600 bg-yellow-50';
            case 'PAID': return 'text-blue-600 bg-blue-50';
            case 'PROCESSING': return 'text-purple-600 bg-purple-50';
            case 'SHIPPED': return 'text-indigo-600 bg-indigo-50';
            case 'DELIVERED': return 'text-green-600 bg-green-50';
            case 'CANCELLED': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getDeliveryStatusColor = (status?: string) => {
        switch (status) {
            case 'PENDING_PICKUP': return 'text-orange-600 bg-orange-50';
            case 'OUT_FOR_DELIVERY': return 'text-blue-600 bg-blue-50';
            case 'DELIVERED': return 'text-green-600 bg-green-50';
            case 'FAILED': return 'text-red-600 bg-red-50';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                        <p className="text-sm text-gray-500">#{order._id.toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-sm font-medium text-gray-700 mr-auto">Actions:</span>

                        {order.status === 'CREATED' && (
                            <button
                                onClick={() => updateStatus('PROCESSING')}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" /> Accept Order
                            </button>
                        )}

                        {order.status === 'PROCESSING' && (
                            <button
                                onClick={() => updateStatus('SHIPPED', 'PENDING_PICKUP')}
                                disabled={loading}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <Package className="w-4 h-4" /> Mark Ready for Pickup
                            </button>
                        )}

                        {order.status === 'SHIPPED' && (
                            <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                <Clock className="w-4 h-4" /> Waiting for Pickup
                            </div>
                        )}
                    </div>

                    {/* Status Bar */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Order Status</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        {order.deliveryStatus && (
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 mb-1">Delivery Status</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getDeliveryStatusColor(order.deliveryStatus)}`}>
                                    {order.deliveryStatus.replace(/_/g, ' ')}
                                </span>
                            </div>
                        )}

                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Payment</span>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${order.paymentStatus === 'SUCCESS' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'}`}>
                                    {order.paymentStatus || 'PENDING'}
                                </span>
                                <span className="text-xs text-gray-400">via {order.paymentProvider || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><Phone className="w-4 h-4" /></span>
                                Customer Information
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{order.userId.name}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                        <Mail className="w-3 h-3" /> {order.userId.email}
                                    </p>
                                    {order.userId.phone && (
                                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <Phone className="w-3 h-3" /> {order.userId.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <span className="p-1.5 bg-purple-50 text-purple-600 rounded-md"><MapPin className="w-4 h-4" /></span>
                                Shipping Address
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                {order.shippingAddress ? (
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                                        <p>{order.shippingAddress.addressLine1}</p>
                                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                        <p className="mt-2 flex items-center gap-2"><Phone className="w-3 h-3" /> {order.shippingAddress.phone}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No shipping address available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <span className="p-1.5 bg-orange-50 text-orange-600 rounded-md"><Package className="w-4 h-4" /></span>
                            Order Items
                        </h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Product</th>
                                        <th className="px-4 py-3 font-medium text-center">Qty</th>
                                        <th className="px-4 py-3 font-medium text-right">Price</th>
                                        <th className="px-4 py-3 font-medium text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {order.items.map((item, idx) => (
                                        <tr key={idx} className="bg-white">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                                        {item.productId.image && <img src={item.productId.image} alt={item.productId.title} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-1">{item.productId.title}</p>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {item.productId.brand && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{item.productId.brand}</span>}
                                                            {item.productId.category && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{item.productId.category}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-gray-600">₹{item.price.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 border-t">
                                    <tr>
                                        <td colSpan={3} className="px-4 py-2 text-right text-gray-500">Subtotal</td>
                                        <td className="px-4 py-2 text-right font-medium text-gray-900">
                                            ₹{order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()}
                                        </td>
                                    </tr>
                                    {order.discountAmount ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2 text-right text-green-600">Discount {order.couponCode && `(${order.couponCode})`}</td>
                                            <td className="px-4 py-2 text-right font-medium text-green-600">-₹{order.discountAmount}</td>
                                        </tr>
                                    ) : null}
                                    <tr>
                                        <td colSpan={3} className="px-4 py-2 text-right text-gray-500">Shipping</td>
                                        <td className="px-4 py-2 text-right font-medium text-gray-900">
                                            {order.shippingCharges && order.shippingCharges > 0 ? `₹${order.shippingCharges}` : 'Free'}
                                        </td>
                                    </tr>
                                    <tr className="border-t border-gray-200 bg-gray-100">
                                        <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">Total Amount</td>
                                        <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg">₹{order.totalAmount.toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Track Order
                    </button>
                </div>

            </div>
        </div>
    );
}
