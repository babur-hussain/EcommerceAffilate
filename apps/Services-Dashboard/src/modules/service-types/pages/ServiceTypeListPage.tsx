'use client';

import React, { useEffect } from 'react';
import { useServiceTypeStore } from '@/store/useServiceTypeStore';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function ServiceTypeListPage() {
    const { serviceTypes, fetchServiceTypes, isLoading } = useServiceTypeStore();
    const router = useRouter();

    useEffect(() => {
        fetchServiceTypes();
    }, [fetchServiceTypes]);

    if (isLoading && serviceTypes.length === 0) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Service Types</h2>
                    <p className="text-gray-500">Manage service schemas and definitions.</p>
                </div>
                <Button onClick={() => router.push('/service-types/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Create Service Type
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {serviceTypes.map((type) => (
                            <TableRow key={type._id}>
                                <TableCell className="font-medium">{type.name}</TableCell>
                                <TableCell><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{type.code}</span></TableCell>
                                <TableCell>{type.countryCode}</TableCell>
                                <TableCell>v{type.version}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${type.status === 'PUBLISHED'
                                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                                            : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                        }`}>
                                        {type.status}
                                    </span>
                                </TableCell>
                                <TableCell>{format(new Date(type.updatedAt), 'MMM d, yyyy')}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => router.push(`/service-types/${type.code}`)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {serviceTypes.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">No service types found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
