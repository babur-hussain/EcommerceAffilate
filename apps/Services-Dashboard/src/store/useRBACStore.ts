import { create } from 'zustand';
import { rbacApi, Role } from '@/lib/api/rbac';
import { toast } from 'react-hot-toast';

interface RBACState {
    roles: Role[];
    isLoading: boolean;
    error: string | null;

    fetchRoles: () => Promise<void>;
    createRole: (data: { name: string; description?: string; permissions: string[] }) => Promise<void>;
    updateRole: (id: string, data: Partial<Role>) => Promise<void>;
    deleteRole: (id: string) => Promise<void>;
}

export const useRBACStore = create<RBACState>((set, get) => ({
    roles: [],
    isLoading: false,
    error: null,

    fetchRoles: async () => {
        set({ isLoading: true, error: null });
        try {
            const roles = await rbacApi.getRoles();
            set({ roles, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, error: error.message || 'Failed to fetch roles' });
            toast.error('Failed to fetch roles');
        }
    },

    createRole: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newRole = await rbacApi.createRole(data);
            set((state) => ({
                roles: [...state.roles, newRole],
                isLoading: false
            }));
            toast.success('Role created successfully');
        } catch (error: any) {
            set({ isLoading: false, error: error.message || 'Failed to create role' });
            toast.error(error?.response?.data?.error || 'Failed to create role');
            throw error;
        }
    },

    updateRole: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updatedRole = await rbacApi.updateRole(id, data);
            set((state) => ({
                roles: state.roles.map((r) => (r._id === id ? updatedRole : r)),
                isLoading: false
            }));
            toast.success('Role updated successfully');
        } catch (error: any) {
            set({ isLoading: false, error: error.message || 'Failed to update role' });
            toast.error('Failed to update role');
            throw error;
        }
    },

    deleteRole: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await rbacApi.deleteRole(id);
            set((state) => ({
                roles: state.roles.filter((r) => r._id !== id),
                isLoading: false
            }));
            toast.success('Role deleted successfully');
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            toast.error(error?.response?.data?.error || 'Failed to delete role');
        }
    }

}));
