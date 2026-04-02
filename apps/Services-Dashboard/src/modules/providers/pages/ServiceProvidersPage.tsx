'use client';

import React, { useEffect } from 'react';
import { useServiceMarketplaceStore } from '@/store/useServiceMarketplaceStore';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Star, Users, Clock, Shield, Ban } from 'lucide-react';

export default function ServiceProvidersPage() {
    const {
        providers, providersLoading, providersMeta,
        fetchProviders, updateProviderStatus,
    } = useServiceMarketplaceStore();

    useEffect(() => { fetchProviders(); }, [fetchProviders]);

    const handleApprove = async (id: string) => {
        if (confirm('Approve this service provider?')) {
            await updateProviderStatus(id, 'APPROVED');
        }
    };

    const handleReject = async (id: string) => {
        if (confirm('Reject this service provider?')) {
            await updateProviderStatus(id, 'REJECTED');
        }
    };

    const handleSuspend = async (id: string) => {
        if (confirm('Suspend this service provider?')) {
            await updateProviderStatus(id, 'SUSPENDED');
        }
    };

    const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
        PENDING: { bg: 'bg-amber-50 ring-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending' },
        APPROVED: { bg: 'bg-emerald-50 ring-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Approved' },
        REJECTED: { bg: 'bg-red-50 ring-red-200', text: 'text-red-600', dot: 'bg-red-400', label: 'Rejected' },
        SUSPENDED: { bg: 'bg-gray-100 ring-gray-200', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Suspended' },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                    <Users className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Service Providers</h2>
                    <p className="text-sm text-gray-500">Review, approve, or manage service provider applications.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-5 border-0 shadow-sm bg-white group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{providersMeta.total}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-0 shadow-sm bg-white group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</p>
                            <p className="text-3xl font-bold text-amber-600 mt-1">
                                {providers.filter((p) => p.status === 'PENDING').length}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors">
                            <Clock className="h-6 w-6 text-amber-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-0 shadow-sm bg-white group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</p>
                            <p className="text-3xl font-bold text-emerald-600 mt-1">
                                {providers.filter((p) => p.status === 'APPROVED').length}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-0 shadow-sm bg-white group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected</p>
                            <p className="text-3xl font-bold text-red-600 mt-1">
                                {providers.filter((p) => p.status === 'REJECTED').length}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 group-hover:bg-red-100 transition-colors">
                            <XCircle className="h-6 w-6 text-red-500" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Providers Table */}
            <Card className="border-0 shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {providers.map((provider) => {
                            const status = statusConfig[provider.status] || statusConfig.PENDING;
                            return (
                                <TableRow key={provider._id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-xs font-bold text-white">
                                                {(provider.businessName?.[0] || 'B').toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-gray-900">{provider.businessName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-900">{provider.userId?.name || '—'}</div>
                                        <div className="text-xs text-gray-400">{provider.userId?.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 w-fit">
                                                {provider.serviceCategoryId?.name || '—'}
                                            </span>
                                            <span className="text-xs text-gray-400">{provider.serviceSubCategoryId?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-semibold text-gray-900">{provider.currency} {provider.startingPrice}</div>
                                        <div className="text-xs text-gray-400 capitalize">{provider.pricingModel?.toLowerCase()}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                            <span className="text-sm font-semibold text-gray-900">{provider.rating}</span>
                                            <span className="text-xs text-gray-400">({provider.reviewCount})</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${status.bg} ${status.text}`}>
                                            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status.dot}`} />
                                            {status.label}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1.5">
                                            {provider.status === 'PENDING' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3"
                                                        onClick={() => handleApprove(provider._id)}
                                                    >
                                                        <CheckCircle className="h-3 w-3 mr-1" /> Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-red-600 border-red-200 hover:bg-red-50 text-xs px-3"
                                                        onClick={() => handleReject(provider._id)}
                                                    >
                                                        <XCircle className="h-3 w-3 mr-1" /> Reject
                                                    </Button>
                                                </>
                                            )}
                                            {provider.status === 'APPROVED' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-gray-600 border-gray-200 hover:bg-gray-50 text-xs px-3"
                                                    onClick={() => handleSuspend(provider._id)}
                                                >
                                                    <Ban className="h-3 w-3 mr-1" /> Suspend
                                                </Button>
                                            )}
                                            {(provider.status === 'REJECTED' || provider.status === 'SUSPENDED') && (
                                                <Button
                                                    size="sm"
                                                    className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3"
                                                    onClick={() => handleApprove(provider._id)}
                                                >
                                                    <Shield className="h-3 w-3 mr-1" /> Re-Approve
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {!providersLoading && providers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                                            <Users className="h-7 w-7 text-teal-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">No providers yet</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Providers will appear here once they register.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            {providersMeta.pages > 1 && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline" size="sm"
                        disabled={providersMeta.page <= 1}
                        onClick={() => fetchProviders({ page: providersMeta.page - 1 })}
                        className="text-gray-600 border-gray-200"
                    >Previous</Button>
                    <span className="text-sm text-gray-500 px-2">
                        Page {providersMeta.page} of {providersMeta.pages}
                    </span>
                    <Button
                        variant="outline" size="sm"
                        disabled={providersMeta.page >= providersMeta.pages}
                        onClick={() => fetchProviders({ page: providersMeta.page + 1 })}
                        className="text-gray-600 border-gray-200"
                    >Next</Button>
                </div>
            )}
        </div>
    );
}
