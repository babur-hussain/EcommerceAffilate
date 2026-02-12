import { Request, Response } from 'express';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { AuditLog } from '../models/auditLog.model';
import { logger } from '../utils/logger';

// --- Role Management ---

export const createRole = async (req: Request, res: Response) => {
    try {
        const { name, description, permissions } = req.body;
        const adminUserId = (req as any).user?.id; // Assumes auth middleware populates this

        // 1. Validation
        if (!name) return res.status(400).json({ error: 'Role name is required' });
        const existingRole = await Role.findOne({ name });
        if (existingRole) return res.status(409).json({ error: 'Role already exists' });

        // 2. Create Role
        const newRole = await Role.create({
            name,
            description,
            permissions: permissions || [],
            isSystem: false,
        });

        // 3. Audit Log
        await AuditLog.create({
            userId: adminUserId,
            action: 'ROLE_CREATE',
            entityType: 'ROLE',
            entityId: newRole._id.toString(),
            metadata: { name, permissions },
        });

        res.status(201).json(newRole);
    } catch (error: any) {
        logger.error({ err: error }, 'Error creating role');
        res.status(500).json({ error: 'Failed to create role' });
    }
};

export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.find().sort({ createdAt: -1 });
        res.json(roles);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching roles');
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
};

export const updateRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, permissions } = req.body;
        const adminUserId = (req as any).user?.id;

        const role = await Role.findById(id);
        if (!role) return res.status(404).json({ error: 'Role not found' });

        // Update fields
        if (name) role.name = name;
        if (description !== undefined) role.description = description;
        if (permissions) role.permissions = permissions;

        await role.save();

        await AuditLog.create({
            userId: adminUserId,
            action: 'ROLE_UPDATE',
            entityType: 'ROLE',
            entityId: role._id.toString(),
            metadata: { updates: req.body },
        });

        res.json(role);
    } catch (error: any) {
        logger.error({ err: error }, 'Error updating role');
        res.status(500).json({ error: 'Failed to update role' });
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const adminUserId = (req as any).user?.id;

        const role = await Role.findById(id);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        if (role.isSystem) return res.status(403).json({ error: 'Cannot delete system roles' });

        // Check if assigned to any user
        const userWithRole = await User.findOne({ 'customRoles.roleId': id });
        if (userWithRole) return res.status(409).json({ error: 'Role is currently assigned to users. Unassign first.' });

        await Role.findByIdAndDelete(id);

        await AuditLog.create({
            userId: adminUserId,
            action: 'ROLE_DELETE',
            entityType: 'ROLE',
            entityId: id,
            metadata: { roleName: role.name },
        });

        res.json({ message: 'Role deleted successfully' });
    } catch (error: any) {
        logger.error({ err: error }, 'Error deleting role');
        res.status(500).json({ error: 'Failed to delete role' });
    }
};

// --- User Assignment ---

export const assignRoleToUser = async (req: Request, res: Response) => {
    try {
        const { userId, roleId, country } = req.body; // userId is target user
        const adminUserId = (req as any).user?.id;

        if (!userId || !roleId) return res.status(400).json({ error: 'User ID and Role ID are required' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const role = await Role.findById(roleId);
        if (!role) return res.status(404).json({ error: 'Role not found' });

        // Check if already assigned (exact match role + country)
        const exists = user.customRoles?.some(
            (cr) => cr.roleId.toString() === roleId && (cr.country || 'ALL') === (country || 'ALL')
        );

        if (exists) return res.status(409).json({ error: 'Role already assigned to user for this scope' });

        // Add role
        if (!user.customRoles) user.customRoles = [];
        user.customRoles.push({
            roleId,
            country: country || 'ALL',
            assignedAt: new Date(),
        });

        await user.save();

        await AuditLog.create({
            userId: adminUserId,
            action: 'USER_ROLE_ASSIGN',
            entityType: 'USER',
            entityId: userId,
            metadata: { roleId, roleName: role.name, country },
        });

        res.json({ message: 'Role assigned successfully', customRoles: user.customRoles });
    } catch (error: any) {
        logger.error({ err: error }, 'Error assigning role');
        res.status(500).json({ error: 'Failed to assign role' });
    }
};

export const removeRoleFromUser = async (req: Request, res: Response) => {
    try {
        const { userId, roleId, country } = req.body;
        const adminUserId = (req as any).user?.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.customRoles) return res.status(400).json({ error: 'User has no custom roles' });

        // Filter out the specific role assignment
        const originalLength = user.customRoles.length;
        user.customRoles = user.customRoles.filter(
            (cr) => !(cr.roleId.toString() === roleId && (cr.country || 'ALL') === (country || 'ALL'))
        );

        if (user.customRoles.length === originalLength) {
            return res.status(404).json({ error: 'Role assignment not found on user' });
        }

        await user.save();

        await AuditLog.create({
            userId: adminUserId,
            action: 'USER_ROLE_REMOVE',
            entityType: 'USER',
            entityId: userId,
            metadata: { roleId, country },
        });

        res.json({ message: 'Role removed successfully', customRoles: user.customRoles });
    } catch (error: any) {
        logger.error({ err: error }, 'Error removing role');
        res.status(500).json({ error: 'Failed to remove role' });
    }
};
