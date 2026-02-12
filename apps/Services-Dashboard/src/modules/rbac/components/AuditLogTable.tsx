'use client';

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { format } from 'date-fns';
import api from '@/lib/axios';

interface AuditLog {
    _id: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: string;
    userId: {
        name: string;
        email: string;
    }
}

export function AuditLogTable() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/audit-logs'); // Need to ensure this endpoint exists or mock it
                setLogs(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div>Loading logs...</div>;

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log._id}>
                            <TableCell>{format(new Date(log.createdAt), 'MMM d, HH:mm')}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{log.userId?.name || 'Unknown'}</span>
                                    <span className="text-xs text-gray-500">{log.userId?.email}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    {log.action}
                                </span>
                            </TableCell>
                            <TableCell>{log.entityType} ({log.entityId.slice(-4)})</TableCell>
                            <TableCell className="max-w-xs truncate text-xs font-mono text-gray-500">
                                {JSON.stringify(log.metadata)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
