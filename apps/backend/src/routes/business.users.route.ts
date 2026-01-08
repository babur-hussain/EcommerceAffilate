import { Router, Request, Response } from 'express';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import { User } from '../models/user.model';

const router = Router();

const ALLOWED_ROLES = ['BUSINESS_OWNER', 'BUSINESS_MANAGER'];
const ASSIGNABLE_ROLES = ['BUSINESS_MANAGER', 'BUSINESS_STAFF'] as const;

type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

router.post('/business/users', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user as { id?: string; role?: string; businessId?: string } | undefined;
    if (!authUser?.id || !authUser.role) return res.status(401).json({ error: 'Unauthorized' });

    if (!ALLOWED_ROLES.includes(authUser.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { email, role } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!ASSIGNABLE_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Role must be BUSINESS_MANAGER or BUSINESS_STAFF' });
    }

    if (!authUser.businessId) {
      return res.status(400).json({ error: 'No business associated with requester' });
    }

    // Check if user already exists
    let targetUser = await User.findOne({ email: normalizedEmail });

    // Enforce single-business rule
    if (targetUser && targetUser.businessId && targetUser.businessId.toString() !== authUser.businessId) {
      return res.status(400).json({ error: 'User is already associated with another business' });
    }

    if (!targetUser) {
      targetUser = await User.create({
        email: normalizedEmail,
        role: role as AssignableRole,
        businessId: authUser.businessId,
        isActive: true,
      });
    } else {
      targetUser.role = role as AssignableRole;
      targetUser.businessId = authUser.businessId as any;
      await targetUser.save();
    }

    res.status(201).json({
      message: 'User added to business',
      user: {
        id: targetUser._id,
        email: targetUser.email,
        role: targetUser.role,
        businessId: targetUser.businessId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add user to business', message: error.message });
  }
});

export default router;
