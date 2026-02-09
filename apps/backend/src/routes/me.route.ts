import { Router, Request, Response } from 'express';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import { User } from '../models/user.model';
import { Business } from '../models/business.model';

import { getAuth } from 'firebase-admin/auth';

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
        coins: user.coins || 0,
        membershipStatus: user.membershipStatus || 'Classic',
        businessStatus: (user.businessId && businessActive !== undefined) ? (await Business.findById(user.businessId).select('status').lean())?.status : undefined,
        affiliateLinks: user.affiliateLinks,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

// DELETE /me - Permanent account deletion
router.delete('/me', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userCtx = req.user;
    if (!userCtx?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userCtx.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 1. Delete from MongoDB
    await User.deleteOne({ _id: userCtx.id });

    // 2. Delete from Firebase Auth
    try {
      // req.user does not have uid, it uses req.firebaseUser from middleware
      const firebaseUid = req.firebaseUser?.uid || user.firebaseUid;
      if (firebaseUid) {
        await getAuth().deleteUser(firebaseUid);
        console.log(`Successfully deleted user ${firebaseUid} from Firebase`);
      } else {
        console.warn("No firebaseUid found for user, skipping Firebase deletion");
      }
    } catch (firebaseError) {
      console.error('Error deleting user from Firebase:', firebaseError);
      // Non-blocking error, user is already gone from DB which matters most for app login
    }

    return res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
});
router.put('/me', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userCtx = req.user;
    if (!userCtx?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const allowedUpdates = ['name', 'phoneNumber', 'bio', 'socialMedia', 'profileImage'];
    const updates = Object.keys(req.body).reduce((acc: any, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = req.body[key];
      }
      return acc;
    }, {});

    const updatedUser = await User.findByIdAndUpdate(
      userCtx.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      user: {
        id: String(updatedUser._id),
        email: updatedUser.email,
        role: updatedUser.role,
        name: updatedUser.name,
        profileImage: updatedUser.profileImage,
        businessId: updatedUser.businessId,
        isActive: updatedUser.isActive,
        coins: updatedUser.coins || 0,
        membershipStatus: updatedUser.membershipStatus || 'Classic',
        phoneNumber: updatedUser.phoneNumber,
        bio: updatedUser.bio,
        socialMedia: updatedUser.socialMedia,
        affiliateLinks: updatedUser.affiliateLinks
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/me/account-layout', verifyFirebaseToken, (req: Request, res: Response) => {
  const layout = {
    sections: [
      {
        id: 'account_settings',
        title: 'Account Settings',
        type: 'list',
        items: [
          { id: 'plus', title: 'Premium Membership', icon: 'star-outline', actionUrl: '/plus' },
          { id: 'edit_profile', title: 'Edit Profile', icon: 'person-outline', actionUrl: '/profile/edit' },
          { id: 'wallet', title: 'Saved Cards & Wallet', icon: 'card-outline', actionUrl: '/wallet' },
          { id: 'addresses', title: 'Saved Addresses', icon: 'location-outline', actionUrl: '/address' },
          { id: 'language', title: 'Select Language', icon: 'language-outline', actionUrl: '/language' },
          { id: 'notifications', title: 'Notification Settings', icon: 'notifications-outline', actionUrl: '/notifications' },
          { id: 'privacy', title: 'Privacy Settings', icon: 'lock-closed-outline', actionUrl: '/privacy' },
        ]
      },
      {
        id: 'my_activity',
        title: 'My Activity',
        type: 'list',
        items: [
          { id: 'reviews', title: 'Reviews', icon: 'create-outline', actionUrl: '/reviews' },
          { id: 'questions', title: 'Questions & Answers', icon: 'chatbubbles-outline', actionUrl: '/questions' },
        ]
      },
      {
        id: 'earn',
        title: 'Earn with Us',
        type: 'list',
        items: [
          { id: 'sell', title: 'Sell on Platform', icon: 'storefront-outline', actionUrl: '/sell' },
        ]
      },
      {
        id: 'feedback',
        title: 'Feedback & Information',
        type: 'list',
        items: [
          { id: 'policies', title: 'Terms, Policies and Licenses', icon: 'document-text-outline', actionUrl: '/policies' },
          { id: 'faqs', title: 'Browse FAQs', icon: 'help-circle-outline', actionUrl: '/faqs' },
        ]
      }
    ]
  };
  res.json(layout);
});

router.post('/me/deactivate', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userCtx = req.user;
    if (!userCtx?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await User.findByIdAndUpdate(userCtx.id, { isActive: false });

    return res.json({ success: true, message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating account:', error);
    return res.status(500).json({ error: 'Failed to deactivate account' });
  }
});

export default router;
