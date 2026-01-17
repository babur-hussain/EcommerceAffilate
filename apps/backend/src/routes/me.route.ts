import { Router, Request, Response } from 'express';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import { User } from '../models/user.model';
import { Business } from '../models/business.model';

const router = Router();

// GET /me - returns authenticated user profile and basic authorization context
router.get('/me', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userCtx = req.user;
    if (!userCtx?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userCtx.id).lean();
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ error: 'User inactive', user: { id: String(user._id), email: user.email, role: user.role, businessId: user.businessId, isActive: user.isActive } });
    }

    let businessActive: boolean | undefined = undefined;
    if (user.businessId) {
      const biz = await Business.findById(user.businessId).lean();
      businessActive = biz?.isActive ?? undefined;
      if (businessActive === false) {
        return res.status(403).json({ error: 'Business disabled', user: { id: String(user._id), email: user.email, role: user.role, businessId: user.businessId, isActive: user.isActive, businessActive } });
      }
    }

    return res.json({
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
        name: user.name,
        profileImage: user.profileImage,
        businessId: user.businessId,
        isActive: user.isActive,
        businessActive,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

export default router;
