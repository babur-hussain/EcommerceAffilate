import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, Mail, Package, Truck, CreditCard, CheckCircle, Clock, FileText, DollarSign, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface CourierRate {
    courier_company_id: number;
    courier_name: string;
    rate: number;
    etd: string;
    estimated_delivery_days: number;
    cod: number;
    rating: number;
    is_recommended_courier?: boolean;
}

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
    shippingMethod?: 'INTERNAL' | 'SHIPROCKET';
    shiprocket?: {
        orderId: number;
        shipmentId: number;
        awbCode?: string;
        courierName?: string;
        labelUrl?: string;
        pickupScheduled?: boolean;
        actualShippingCost?: number;
    };
}

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

export default function OrderDetailsModal({ order: initialOrder, onClose }: OrderDetailsModalProps) {
    const [order, setOrder] = useState(initialOrder);
    const [loading, setLoading] = useState(false);
    const [ratesLoading, setRatesLoading] = useState(false);
    const [estimatedRates, setEstimatedRates] = useState<CourierRate[]>([]);
    const [selectedCourier, setSelectedCourier] = useState<CourierRate | null>(null);

    // Fetch shipping rates when modal opens for Shiprocket orders
    useEffect(() => {
        if (order.shippingMethod === 'SHIPROCKET' && !order.shiprocket?.orderId) {
            fetchRates();
        }
    }, [order._id]);

    const fetchRates = async () => {
        try {
            setRatesLoading(true);
            const res = await apiClient.get<any>(`/api/orders/${order._id}/shiprocket/rates`);
            const couriers = res.data.data?.available_courier_companies || [];
            setEstimatedRates(couriers);
            // Auto-select recommended or cheapest
            const recommended = couriers.find((c: CourierRate) => c.is_recommended_courier) || couriers[0];
            setSelectedCourier(recommended);
        } catch (e: any) {
            console.error('Failed to fetch rates:', e);
            toast.error(e.response?.data?.error || 'Failed to fetch shipping rates');
        } finally {
            setRatesLoading(false);
        }
    };

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
                    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex flex-wrap items-center gap-3">
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

                            {/* Standard Process for Internal Or Non-Shiprocket */}
                            {order.status === 'PROCESSING' && order.shippingMethod !== 'SHIPROCKET' && (
                                <button
                                    onClick={() => updateStatus('SHIPPED', 'PENDING_PICKUP')}
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Package className="w-4 h-4" /> Mark Ready for Pickup
                                </button>
                            )}

                            {order.status === 'SHIPPED' && order.shippingMethod !== 'SHIPROCKET' && (
                                <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <Clock className="w-4 h-4" /> Waiting for Pickup
                                </div>
                            )}
                        </div>

                        {/* Shiprocket Actions */}
                        {order.shippingMethod === 'SHIPROCKET' && (
                            <div className="pt-3 border-t border-gray-200">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Shiprocket Fulfillment</h4>
                                <div className="flex flex-wrap gap-3">

                                    {/* Estimated Rates Display */}
                                    {!order.shiprocket?.orderId && (
                                        <div className="w-full space-y-3">
                                            {/* Rates Section */}
                                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4" /> Shipping Rates
                                                    </h5>
                                                    <button
                                                        onClick={fetchRates}
                                                        disabled={ratesLoading}
                                                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    >
                                                        <RefreshCw className={`w-3 h-3 ${ratesLoading ? 'animate-spin' : ''}`} />
                                                        Refresh
                                                    </button>
                                                </div>

                                                {ratesLoading ? (
                                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                        Fetching rates...
                                                    </div>
                                                ) : estimatedRates.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {/* Selected Courier Display */}
                                                        {selectedCourier && (
                                                            <div className="p-2 bg-white border-2 border-blue-400 rounded-lg">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <span className="font-semibold text-gray-900">
                                                                            {selectedCourier.courier_name}
                                                                        </span>
                                                                        {selectedCourier.is_recommended_courier && (
                                                                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                                                                Recommended
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-lg font-bold text-blue-600">
                                                                        ₹{selectedCourier.rate}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Delivery: {selectedCourier.etd || `${selectedCourier.estimated_delivery_days} days`}
                                                                    {selectedCourier.rating > 0 && ` • Rating: ${selectedCourier.rating}/5`}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Other Couriers (collapsed) */}
                                                        {estimatedRates.length > 1 && (
                                                            <details className="text-xs">
                                                                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                                                    View {estimatedRates.length - 1} more options
                                                                </summary>
                                                                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                                                                    {estimatedRates
                                                                        .filter(c => c.courier_company_id !== selectedCourier?.courier_company_id)
                                                                        .map(courier => (
                                                                            <button
                                                                                key={courier.courier_company_id}
                                                                                onClick={() => setSelectedCourier(courier)}
                                                                                className="w-full p-2 text-left bg-gray-50 hover:bg-blue-50 rounded border border-gray-200 hover:border-blue-300 transition"
                                                                            >
                                                                                <div className="flex justify-between">
                                                                                    <span className="font-medium text-gray-800">{courier.courier_name}</span>
                                                                                    <span className="font-semibold text-gray-900">₹{courier.rate}</span>
                                                                                </div>
                                                                                <div className="text-gray-500">
                                                                                    {courier.etd || `${courier.estimated_delivery_days} days`}
                                                                                </div>
                                                                            </button>
                                                                        ))}
                                                                </div>
                                                            </details>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">No rates available. Click refresh to try again.</p>
                                                )}
                                            </div>

                                            {/* Ship Button */}
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        setLoading(true);
                                                        const res = await apiClient.post<Order>(`/api/orders/${order._id}/shiprocket/create`);
                                                        setOrder(res.data);
                                                        toast.success('Order created in Shiprocket!');
                                                    } catch (e: any) {
                                                        toast.error(e.response?.data?.error || 'Failed to create Shiprocket order');
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                }}
                                                disabled={loading || estimatedRates.length === 0}
                                                className="w-full px-4 py-3 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                {loading ? (
                                                    <><RefreshCw className="w-4 h-4 animate-spin" /> Creating Order...</>
                                                ) : (
                                                    <><Truck className="w-4 h-4" /> Ship via Shiprocket {selectedCourier && `(₹${selectedCourier.rate})`}</>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {/* 2. Generate AWB */}
                                    {order.shiprocket?.shipmentId && !order.shiprocket?.awbCode && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    setLoading(true);
                                                    const res = await apiClient.post<Order>(`/api/orders/${order._id}/shiprocket/awb`, { courierId: 1 }); // Mock courier ID
                                                    setOrder(res.data);
                                                    toast.success('AWB Assigned');
                                                } catch (e: any) {
                                                    toast.error(e.response?.data?.error || 'Failed to assign AWB');
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <FileText className="w-4 h-4" /> Generate AWB
                                        </button>
                                    )}

                                    {/* 3. Request Pickup */}
                                    {order.shiprocket?.awbCode && !order.shiprocket?.pickupScheduled && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    setLoading(true);
                                                    const res = await apiClient.post<Order>(`/api/orders/${order._id}/shiprocket/pickup`);
                                                    setOrder(res.data);
                                                    toast.success('Pickup Scheduled');
                                                } catch (e: any) {
                                                    toast.error(e.response?.data?.error || 'Failed to schedule pickup');
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            disabled={loading}
                                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <Truck className="w-4 h-4" /> Request Pickup
                                        </button>
                                    )}

                                    {/* 4. Download Label */}
                                    {order.shiprocket?.pickupScheduled && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    setLoading(true);
                                                    const res = await apiClient.get<{ url: string }>(`/api/orders/${order._id}/shiprocket/label`);
                                                    window.open(res.data.url, '_blank');
                                                } catch (e: any) {
                                                    toast.error(e.response?.data?.error || 'Failed to get label');
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            disabled={loading}
                                            className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <FileText className="w-4 h-4" /> Download Label
                                        </button>
                                    )}

                                    {order.shiprocket?.actualShippingCost && (
                                        <div className="px-3 py-2 bg-orange-50 text-orange-700 text-sm font-medium rounded border border-orange-100 flex items-center gap-2">
                                            <span>Est. Cost: ₹{order.shiprocket.actualShippingCost}</span>
                                        </div>
                                    )}
                                </div>
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
                                <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${['SUCCESS', 'PAID', 'COMPLETED', 'captured'].includes(order.paymentStatus || '')
                                        ? 'text-green-600 bg-green-50'
                                        : ['FAILED', 'CANCELLED', 'REFUNDED'].includes(order.paymentStatus || '')
                                            ? 'text-red-600 bg-red-50'
                                            : 'text-yellow-600 bg-yellow-50'
                                    }`}>
                                    {order.paymentStatus === 'captured' ? 'PAID' :
                                        order.paymentStatus === 'SUCCESS' ? 'PAID' :
                                            order.paymentStatus || 'PENDING'}
                                </span>
                                {order.paymentProvider && (
                                    <span className="text-xs text-gray-400">via {order.paymentProvider.toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Shipping Method</span>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${order.shippingMethod === 'INTERNAL' ? 'text-teal-700 bg-teal-50 border border-teal-100' : 'text-orange-700 bg-orange-50 border border-orange-100'}`}>
                                    {order.shippingMethod === 'INTERNAL' ? 'Internal Delivery' : 'Shiprocket'}
                                </span>
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
