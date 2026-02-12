'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useRBACStore } from '@/store/useRBACStore';
import { Role } from '@/lib/api/rbac';

const roleSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    permissions: z.array(z.string()).default([]),
});

type RoleFormValues = z.infer<typeof roleSchema>;

// Hardcoded permission list for now - ideally fetched from backend
const AVAILABLE_PERMISSIONS = [
    { id: 'services.create', label: 'Create Services' },
    { id: 'services.edit', label: 'Edit Services' },
    { id: 'services.delete', label: 'Delete Services' },
    { id: 'services.publish', label: 'Publish Services' },
    { id: 'bookings.view', label: 'View Bookings' },
    { id: 'bookings.edit', label: 'Edit Bookings' },
    { id: 'stats.view', label: 'View Analytics' },
    { id: 'rbac.manage', label: 'Manage RBAC' },
];

interface RoleFormProps {
    initialData?: Role;
    onSuccess: () => void;
    onCancel: () => void;
}

export function RoleForm({ initialData, onSuccess, onCancel }: RoleFormProps) {
    const { createRole, updateRole, isLoading } = useRBACStore();

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<any>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            permissions: initialData?.permissions || [],
        },
    });

    const selectedPermissions = watch('permissions') || [];

    const handlePermissionToggle = (permId: string) => {
        const current = selectedPermissions;
        if (current.includes(permId)) {
            setValue('permissions', current.filter((p: string) => p !== permId));
        } else {
            setValue('permissions', [...current, permId]);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            if (initialData) {
                await updateRole(initialData._id, data);
            } else {
                await createRole(data);
            }
            onSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Role Name</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    {...register('name')}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message as string}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    {...register('description')}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-60 overflow-y-auto">
                    {AVAILABLE_PERMISSIONS.map((perm) => (
                        <div key={perm.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={perm.id}
                                checked={selectedPermissions.includes(perm.id)}
                                onChange={() => handlePermissionToggle(perm.id)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <label htmlFor={perm.id} className="ml-2 text-sm text-gray-900">
                                {perm.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : initialData ? 'Update Role' : 'Create Role'}
                </Button>
            </div>
        </form>
    );
}
