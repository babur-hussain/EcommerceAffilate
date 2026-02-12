'use client';

import React, { useEffect, useState } from 'react';
import { useRBACStore } from '@/store/useRBACStore';
import { RoleMatrixTable } from '@/modules/rbac/components/RoleMatrixTable';
import { RoleForm } from '@/modules/rbac/components/RoleForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Role } from '@/lib/api/rbac';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function RolesPage() {
    const { fetchRoles } = useRBACStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleCreate = () => {
        setEditingRole(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchRoles(); // Refresh
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions</h2>
                    <p className="text-gray-500">Manage system roles and access control.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Create Role
                </Button>
            </div>

            <RoleMatrixTable onEdit={handleEdit} />

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                    </DialogHeader>
                    <RoleForm
                        initialData={editingRole}
                        onSuccess={handleSuccess}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
