'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';
import {
    RotateCcw,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    DollarSign,
    Eye,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Filter,
    AlertCircle,
    Calendar,
    User,
    MapPin,
    Phone
} from 'lucide-react';

interface ReturnItem {
    productId: string;
    productTitle: string;
    productImage: string;
    quantity: number;
    price: number;
    reason: string;
    condition: string;
}

interface TimelineEvent {
    status: string;
    timestamp: string;
    note?: string;
    actor?: string;
}

interface ReturnRequest {
    _id: string;
    returnRequestNumber: string;
    orderId: {
        _id: string;
        orderNumber: string;
    };
    userId: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
    };
    items: ReturnItem[];
    status: string;
    customerNote?: string;
    sellerNote?: string;
    rejectionReason?: string;
    images?: string[];
    refundAmount: number;
    refundMethod?: string;
    refundStatus?: string;
    pickupDetails?: {
        scheduledDate?: string;
        address?: string;
        contactNumber?: string;
        instructions?: string;
    };
    timeline: TimelineEvent[];
    createdAt: string;
    updatedAt: string;
}

interface ReturnStats {
    pending: number;
    approved: number;
    rejected: number;
    pickedUp: number;
    received: number;
    refunded: number;
    total: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    APPROVED: { label: 'Approved', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
    PICKUP_SCHEDULED: { label: 'Pickup Scheduled', color: 'bg-purple-100 text-purple-800', icon: Truck },
    PICKED_UP: { label: 'Picked Up', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    RECEIVED: { label: 'Received', color: 'bg-teal-100 text-teal-800', icon: Package },
    INSPECTING: { label: 'Inspecting', color: 'bg-orange-100 text-orange-800', icon: Eye },
    REFUND_INITIATED: { label: 'Refund Initiated', color: 'bg-cyan-100 text-cyan-800', icon: DollarSign },
    REFUND_COMPLETED: { label: 'Refund Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
};

export default function ReturnsPage() {
    const { user } = useAuth();
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [stats, setStats] = useState<ReturnStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [expandedReturn, setExpandedReturn] = useState<string | null>(null);

    // Action modals
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Form state
    const [rejectionReason, setRejectionReason] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [pickupInstructions, setPickupInstructions] = useState('');
    const [sellerNote, setSellerNote] = useState('');

    const fetchReturns = useCallback(async () => {
        try {
            const params = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
            const response = await apiClient.get(`/api/business/returns${params}`);
            const data = response.data as { returns?: ReturnRequest[] };
            setReturns(data.returns || []);
        } catch (error: any) {
            console.error('Failed to fetch returns:', error);
            toast.error('Failed to load returns');
        }
    }, [filterStatus]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await apiClient.get('/api/business/returns/stats');
            setStats(response.data as ReturnStats);
        } catch (error: any) {
            console.error('Failed to fetch stats:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchReturns(), fetchStats()]);
            setLoading(false);
        };
        loadData();
    }, [fetchReturns, fetchStats]);

    const handleApprove = async (returnId: string) => {
        setActionLoading(true);
        try {
            await apiClient.patch(`/api/business/returns/${returnId}/approve`, {
                sellerNote: sellerNote || undefined
            });
            toast.success('Return request approved');
            setSellerNote('');
            fetchReturns();
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to approve return');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedReturn || !rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        setActionLoading(true);
        try {
            await apiClient.patch(`/api/business/returns/${selectedReturn._id}/reject`, {
                rejectionReason
            });
            toast.success('Return request rejected');
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedReturn(null);
            fetchReturns();
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to reject return');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSchedulePickup = async () => {
        if (!selectedReturn || !pickupDate) {
            toast.error('Please select a pickup date');
            return;
        }
        setActionLoading(true);
        try {
            await apiClient.patch(`/api/business/returns/${selectedReturn._id}/pickup`, {
                scheduledDate: pickupDate,
                instructions: pickupInstructions || undefined
            });
            toast.success('Pickup scheduled successfully');
            setShowPickupModal(false);
            setPickupDate('');
            setPickupInstructions('');
            setSelectedReturn(null);
            fetchReturns();
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to schedule pickup');
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkReceived = async (returnId: string) => {
        setActionLoading(true);
        try {
            await apiClient.patch(`/api/business/returns/${returnId}/received`);
            toast.success('Return marked as received');
            fetchReturns();
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to mark as received');
        } finally {
            setActionLoading(false);
        }
    };

    const handleProcessRefund = async () => {
        if (!selectedReturn) return;
        setActionLoading(true);
        try {
            await apiClient.patch(`/api/business/returns/${selectedReturn._id}/refund`, {
                refundMethod: 'WALLET'
            });
            toast.success('Refund processed successfully');
            setShowRefundModal(false);
            setSelectedReturn(null);
            fetchReturns();
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to process refund');
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
            </span>
        );
    };

    const getActionButtons = (returnReq: ReturnRequest) => {
        const buttons: JSX.Element[] = [];

        switch (returnReq.status) {
            case 'PENDING':
                buttons.push(
                    <button
                        key="approve"
                        onClick={() => handleApprove(returnReq._id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        Approve
                    </button>,
                    <button
                        key="reject"
                        onClick={() => {
                            setSelectedReturn(returnReq);
                            setShowRejectModal(true);
                        }}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        Reject
                    </button>
                );
                break;
            case 'APPROVED':
                buttons.push(
                    <button
                        key="pickup"
                        onClick={() => {
                            setSelectedReturn(returnReq);
                            setShowPickupModal(true);
                        }}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        Schedule Pickup
                    </button>
                );
                break;
            case 'PICKUP_SCHEDULED':
            case 'PICKED_UP':
                buttons.push(
                    <button
                        key="received"
                        onClick={() => handleMarkReceived(returnReq._id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 disabled:opacity-50"
                    >
                        Mark Received
                    </button>
                );
                break;
            case 'RECEIVED':
            case 'INSPECTING':
                buttons.push(
                    <button
                        key="refund"
                        onClick={() => {
                            setSelectedReturn(returnReq);
                            setShowRefundModal(true);
                        }}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 disabled:opacity-50"
                    >
                        Process Refund
                    </button>
                );
                break;
        }

        return buttons;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Returns Management</h1>
                    <p className="text-gray-600">Manage customer return requests</p>
                </div>
                <button
                    onClick={() => { fetchReturns(); fetchStats(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <RotateCcw className="w-4 h-4" />
                            <span className="text-sm">Total</span>
                        </div>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
                        <div className="flex items-center gap-2 text-yellow-700 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Pending</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700 mb-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Approved</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-800">{stats.approved}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
                        <div className="flex items-center gap-2 text-red-700 mb-1">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm">Rejected</span>
                        </div>
                        <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200">
                        <div className="flex items-center gap-2 text-purple-700 mb-1">
                            <Truck className="w-4 h-4" />
                            <span className="text-sm">Picked Up</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-800">{stats.pickedUp}</p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg shadow-sm border border-teal-200">
                        <div className="flex items-center gap-2 text-teal-700 mb-1">
                            <Package className="w-4 h-4" />
                            <span className="text-sm">Received</span>
                        </div>
                        <p className="text-2xl font-bold text-teal-800">{stats.received}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
                        <div className="flex items-center gap-2 text-green-700 mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm">Refunded</span>
                        </div>
                        <p className="text-2xl font-bold text-green-800">{stats.refunded}</p>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">Filter by status:</span>
                <div className="flex flex-wrap gap-2">
                    {['all', 'PENDING', 'APPROVED', 'REJECTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'RECEIVED', 'REFUND_COMPLETED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === status
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status === 'all' ? 'All' : STATUS_CONFIG[status]?.label || status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Returns List */}
            <div className="space-y-4">
                {returns.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
                        <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No return requests</h3>
                        <p className="text-gray-500 mt-1">
                            {filterStatus === 'all'
                                ? 'You have no return requests yet'
                                : `No ${STATUS_CONFIG[filterStatus]?.label || filterStatus} returns found`}
                        </p>
                    </div>
                ) : (
                    returns.map((returnReq) => (
                        <div key={returnReq._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            {/* Return Header */}
                            <div
                                className="p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => setExpandedReturn(expandedReturn === returnReq._id ? null : returnReq._id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                #{returnReq.returnRequestNumber}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Order: #{returnReq.orderId?.orderNumber || 'N/A'}
                                            </p>
                                        </div>
                                        {getStatusBadge(returnReq.status)}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatCurrency(returnReq.refundAmount)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {returnReq.items.length} item(s)
                                            </p>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm text-gray-500">
                                                {formatDate(returnReq.createdAt)}
                                            </p>
                                        </div>
                                        {expandedReturn === returnReq._id ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedReturn === returnReq._id && (
                                <div className="border-t p-4 bg-gray-50 space-y-4">
                                    {/* Customer Info */}
                                    <div className="bg-white p-4 rounded-lg border">
                                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Customer Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Name:</span>
                                                <p className="font-medium">{returnReq.userId?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Email:</span>
                                                <p className="font-medium">{returnReq.userId?.email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Phone:</span>
                                                <p className="font-medium">{returnReq.userId?.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="bg-white p-4 rounded-lg border">
                                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <Package className="w-4 h-4" />
                                            Return Items
                                        </h4>
                                        <div className="space-y-3">
                                            {returnReq.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                    {item.productImage && (
                                                        <img
                                                            src={item.productImage}
                                                            alt={item.productTitle}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{item.productTitle}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {item.quantity} × {formatCurrency(item.price)}
                                                        </p>
                                                        <div className="flex gap-4 mt-1">
                                                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                                                                Reason: {item.reason}
                                                            </span>
                                                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                                                                Condition: {item.condition}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Customer Note */}
                                    {returnReq.customerNote && (
                                        <div className="bg-white p-4 rounded-lg border">
                                            <h4 className="font-medium text-gray-900 mb-2">Customer Note</h4>
                                            <p className="text-gray-600">{returnReq.customerNote}</p>
                                        </div>
                                    )}

                                    {/* Customer Images */}
                                    {returnReq.images && returnReq.images.length > 0 && (
                                        <div className="bg-white p-4 rounded-lg border">
                                            <h4 className="font-medium text-gray-900 mb-3">Customer Photos</h4>
                                            <div className="flex gap-3 flex-wrap">
                                                {returnReq.images.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`Return image ${idx + 1}`}
                                                        className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                                                        onClick={() => window.open(img, '_blank')}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Rejection Reason */}
                                    {returnReq.rejectionReason && (
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <h4 className="font-medium text-red-800 mb-2">Rejection Reason</h4>
                                            <p className="text-red-700">{returnReq.rejectionReason}</p>
                                        </div>
                                    )}

                                    {/* Pickup Details */}
                                    {returnReq.pickupDetails?.scheduledDate && (
                                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                            <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
                                                <Truck className="w-4 h-4" />
                                                Pickup Details
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-purple-600" />
                                                    <span>Scheduled: {formatDate(returnReq.pickupDetails.scheduledDate)}</span>
                                                </div>
                                                {returnReq.pickupDetails.instructions && (
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                                                        <span>Instructions: {returnReq.pickupDetails.instructions}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Timeline */}
                                    <div className="bg-white p-4 rounded-lg border">
                                        <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                                        <div className="space-y-3">
                                            {returnReq.timeline.map((event, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {STATUS_CONFIG[event.status]?.label || event.status}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{formatDate(event.timestamp)}</p>
                                                        {event.note && (
                                                            <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 justify-end">
                                        {getActionButtons(returnReq)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && selectedReturn && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Return Request</h3>
                        <p className="text-gray-600 mb-4">
                            Please provide a reason for rejecting this return request. This will be shown to the customer.
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            rows={4}
                        />
                        <div className="flex gap-3 mt-4 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedReturn(null);
                                    setRejectionReason('');
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={actionLoading || !rejectionReason.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading ? 'Rejecting...' : 'Reject Return'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pickup Modal */}
            {showPickupModal && selectedReturn && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Pickup</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pickup Date *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Instructions (optional)
                                </label>
                                <textarea
                                    value={pickupInstructions}
                                    onChange={(e) => setPickupInstructions(e.target.value)}
                                    placeholder="Any special instructions for pickup..."
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4 justify-end">
                            <button
                                onClick={() => {
                                    setShowPickupModal(false);
                                    setSelectedReturn(null);
                                    setPickupDate('');
                                    setPickupInstructions('');
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSchedulePickup}
                                disabled={actionLoading || !pickupDate}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {actionLoading ? 'Scheduling...' : 'Schedule Pickup'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Modal */}
            {showRefundModal && selectedReturn && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Refund</h3>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Refund Amount:</span>
                                <span className="text-xl font-bold text-green-600">
                                    {formatCurrency(selectedReturn.refundAmount)}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                            This amount will be credited to the customer's wallet. Stock will be restored automatically.
                        </p>
                        <div className="flex gap-3 mt-4 justify-end">
                            <button
                                onClick={() => {
                                    setShowRefundModal(false);
                                    setSelectedReturn(null);
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProcessRefund}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {actionLoading ? 'Processing...' : 'Confirm Refund'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
