import express from 'express';
import {
    createRole,
    getRoles,
    updateRole,
    deleteRole,
    assignRoleToUser,
    removeRoleFromUser
} from '../controllers/rbac.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware'; // Assuming existing auth middleware

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(restrictTo('SUPER_ADMIN')); // Only Super Admins can manage RBAC

// Role Management
router.route('/roles')
    .get(getRoles)
    .post(createRole);

router.route('/roles/:id')
    .put(updateRole)
    .delete(deleteRole);

// User Assignment
router.post('/users/assign', assignRoleToUser);
router.post('/users/remove', removeRoleFromUser);

export default router;
