'use client';

import React, { useEffect } from 'react';
import { useServiceStore } from '@/store/useServiceStore';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Eye, Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function ServiceListPage() {
    const { services, fetchServices, isLoading, meta } = useServiceStore();
    const router = useRouter();

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement search state and refetch
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Services</h2>
                    <p className="text-gray-500">Manage all service listings from providers.</p>
                </div>
                <Button onClick={() => router.push('/services/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Create Service
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Search services..." className="pl-8" />
                </div>
                {/* Add more filters (Status, Type) here */}
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service._id}>
                                <TableCell className="font-medium">
                                    <div>{service.name}</div>
                                    <div className="text-xs text-gray-400">{service.slug}</div>
                                </TableCell>
                                <TableCell>{service.serviceTypeCode} <span className="text-xs text-gray-400">v{service.serviceTypeVersion}</span></TableCell>
                                <TableCell>
                                    {service.providerId?.name || service.providerId}
                                    <div className="text-xs text-gray-400">{service.providerId?.email}</div>
                                </TableCell>
                                <TableCell>{service.currency} {service.price}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${service.status === 'ACTIVE'
                                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                                            : service.status === 'DRAFT'
                                                ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                                : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                        }`}>
                                        {service.status}
                                    </span>
                                </TableCell>
                                <TableCell>{format(new Date(service.createdAt), 'MMM d, yyyy')}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => router.push(`/services/${service._id}`)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && services.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">No services found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page <= 1}
                    onClick={() => fetchServices({ page: meta.page - 1 })}
                >
                    Previous
                </Button>
                <span className="text-sm text-gray-600">
                    Page {meta.page} of {meta.pages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page >= meta.pages}
                    onClick={() => fetchServices({ page: meta.page + 1 })}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
