'use client';

import React from 'react';
import { useRBACStore } from '@/store/useRBACStore';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Role } from '@/lib/api/rbac';
import { format } from 'date-fns';

interface RoleMatrixTableProps {
    onEdit: (role: Role) => void;
}

export function RoleMatrixTable({ onEdit }: RoleMatrixTableProps) {
    const { roles, isLoading, deleteRole } = useRBACStore();

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this role?')) {
            await deleteRole(id);
        }
    };

    if (isLoading && roles.length === 0) {
        return <div>Loading roles...</div>;
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No roles found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        roles.map((role) => (
                            <TableRow key={role._id}>
                                <TableCell className="font-medium">{role.name}</TableCell>
                                <TableCell>{role.description || '—'}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions.slice(0, 3).map(p => (
                                            <span key={p} className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                {p}
                                            </span>
                                        ))}
                                        {role.permissions.length > 3 && (
                                            <span className="text-xs text-gray-500 self-center">+{role.permissions.length - 3} more</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{format(new Date(role.createdAt), 'MMM d, yyyy')}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(role)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        {!role.isSystem && (
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(role._id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
