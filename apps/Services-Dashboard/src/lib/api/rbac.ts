import api from '@/lib/axios';

export interface Role {
    _id: string;
    name: string;
    description?: string;
    permissions: string[];
    isSystem: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Permission {
    id: string;
    label: string;
    description?: string;
}

export const rbacApi = {
    getRoles: async () => {
        const response = await api.get<Role[]>('/rbac/roles');
        return response.data;
    },

    createRole: async (data: { name: string; description?: string; permissions: string[] }) => {
        const response = await api.post<Role>('/rbac/roles', data);
        return response.data;
    },

    updateRole: async (id: string, data: Partial<Role>) => {
        const response = await api.put<Role>(`/rbac/roles/${id}`, data);
        return response.data;
    },

    deleteRole: async (id: string) => {
        const response = await api.delete(`/rbac/roles/${id}`);
        return response.data;
    },

    assignRole: async (data: { userId: string; roleId: string; country?: string }) => {
        const response = await api.post('/rbac/users/assign', data);
        return response.data;
    },

    removeRole: async (data: { userId: string; roleId: string; country?: string }) => {
        const response = await api.post('/rbac/users/remove', data);
        return response.data;
    }
};
