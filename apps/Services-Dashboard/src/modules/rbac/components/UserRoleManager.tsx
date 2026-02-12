'use client';

import React, { useState } from 'react';
import { useRBACStore } from '@/store/useRBACStore';
import { Button } from '@/components/ui/button';
import { rbacApi } from '@/lib/api/rbac';
import { toast } from 'react-hot-toast';
import { User, Role } from '@/types/auth'; // Ensure types exist

interface UserRoleManagerProps {
    targetUser: User;
    onUpdate: () => void;
}

export function UserRoleManager({ targetUser, onUpdate }: UserRoleManagerProps) {
    const { roles } = useRBACStore();
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('ALL');
    const [loading, setLoading] = useState(false);

    const handleAssign = async () => {
        if (!selectedRole) return;
        setLoading(true);
        try {
            await rbacApi.assignRole({
                userId: targetUser.id,
                roleId: selectedRole,
                country: selectedCountry
            });
            toast.success('Role assigned');
            onUpdate();
        } catch (e) {
            toast.error('Failed to assign role');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium">Role Assignment</h3>
            <div className="flex gap-2">
                <select
                    className="rounded-md border p-2"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="">Select Role...</option>
                    {roles.map(r => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                </select>

                <input
                    className="rounded-md border p-2 w-24"
                    placeholder="Country (ISO)"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                />

                <Button onClick={handleAssign} disabled={loading || !selectedRole}>
                    Assign
                </Button>
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Current Roles</p>
                {/* 
                  This presumes targetUser has a customRoles field populated.
                  If the User type in frontend doesn't have it yet, we need to update types/auth.ts
                */}
                {/* Placeholder visualization */}
                <div className="text-sm text-gray-500 italic">No roles assigned (visualization pending user data update)</div>
            </div>
        </div>
    );
}
