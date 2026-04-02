export type Role = 'SUPER_ADMIN' | 'COUNTRY_ADMIN' | 'OPERATIONS_MANAGER' | 'SUPPORT_AGENT' | 'SERVICE_MANAGER' | 'SERVICE_PROVIDER';

export const Roles: Record<Role, Role> = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    COUNTRY_ADMIN: 'COUNTRY_ADMIN',
    OPERATIONS_MANAGER: 'OPERATIONS_MANAGER',
    SUPPORT_AGENT: 'SUPPORT_AGENT',
    SERVICE_MANAGER: 'SERVICE_MANAGER',
    SERVICE_PROVIDER: 'SERVICE_PROVIDER',
};

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    permissions?: string[];
}
