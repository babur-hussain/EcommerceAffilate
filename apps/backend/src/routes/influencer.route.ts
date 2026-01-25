import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import { getAttributionsByInfluencer, getTotalCommissionByInfluencer } from '../services/influencer.service';

const router = Router();

import { Business } from '../models/business.model';
import { User } from '../models/user.model';
import { adminAuth } from '../config/firebaseAdmin';

// POST /influencer/register - Register a new influencer
router.post('/influencer/register', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const firebaseUser = (req as any).firebaseUser;
    const user = (req as any).user;

    if (!firebaseUser || !user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const firebaseUid = firebaseUser.uid;
    const {
      accountType,
      businessIdentity,
      ownerDetails,
      addresses,
      taxLegal,
      bankDetails,
      verification,
      storeProfile,
      compliance,
    } = req.body;

    // Validate essential fields
    if (!businessIdentity || !ownerDetails || !bankDetails) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if business/influencer profile already exists
    let business = await Business.findOne({ firebaseUid });
    const mongoUser = await User.findById(user.id);

    if (!mongoUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (business) {
      if (business.status === 'PENDING' || business.status === 'APPROVED') {
        return res.status(400).json({
          error: 'Registration already exists',
          message: business.status === 'PENDING' ? 'Your registration is under review.' : 'You are already registered.'
        });
      }
      // Update existing (e.g. if rejected)
      business.businessIdentity = businessIdentity;
      business.ownerDetails = ownerDetails;
      business.addresses = addresses;
      business.taxLegal = taxLegal;
      business.bankDetails = bankDetails;
      business.storeProfile = storeProfile;
      business.compliance = compliance;
      business.isActive = true;
      business.status = 'PENDING'; // Reset to pending
      await business.save();
    } else {
      // Create new
      business = new Business({
        userId: mongoUser._id,
        firebaseUid,
        accountType: 'new',
        businessIdentity, // Should have businessType: 'Influencer'
        ownerDetails,
        addresses,
        taxLegal,
        bankDetails,
        verification: verification || { isVerified: false },
        storeProfile,
        logistics: { // Dummy data for required fields
          pickupAddress: 'N/A',
          packagingType: 'Seller Packed',
          returnAddress: 'N/A',
          returnPolicyAccepted: true
        },
        compliance: {
          ...compliance,
          acceptedAt: new Date()
        },
        isActive: true,
        status: 'PENDING'
      });
      await business.save();
    }

    // Update User Role to INFLUENCER
    if (mongoUser.role !== 'INFLUENCER') {
      mongoUser.role = 'INFLUENCER';
      // We don't necessarily set businessId on User for Influencers if we want to distinguish them fully, 
      // OR we do set it so they can use "business" endpoints if needed. 
      // For now, let's set it to link them.
      mongoUser.businessId = business._id as any;
      await mongoUser.save();
    }

    // Set Firebase Custom Claims
    try {
      await adminAuth.setCustomUserClaims(firebaseUid, {
        role: 'INFLUENCER',
        businessId: business._id.toString(),
        accountType: 'influencer'
      });
    } catch (err) {
      console.error('Failed to set custom claims', err);
    }

    res.json({ success: true, message: 'Influencer registered successfully', business });
  } catch (error: any) {
    console.error('Influencer registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// GET /influencer/attributions?status=PENDING|APPROVED|PAID|REJECTED
router.get('/influencer/attributions', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status } = req.query as { status?: string };
    const items = await getAttributionsByInfluencer(userId, status);
    res.json({ data: items });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch attributions', message: e.message });
  }
});

// GET /influencer/summary - totals by status and total earnings
router.get('/influencer/summary', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [pending, approved, paid, rejected, totalApproved, totalPaid] = await Promise.all([
      getAttributionsByInfluencer(userId, 'PENDING').then((l) => l.length),
      getAttributionsByInfluencer(userId, 'APPROVED').then((l) => l.length),
      getAttributionsByInfluencer(userId, 'PAID').then((l) => l.length),
      getAttributionsByInfluencer(userId, 'REJECTED').then((l) => l.length),
      getTotalCommissionByInfluencer(userId, 'APPROVED'),
      getTotalCommissionByInfluencer(userId, 'PAID'),
    ]);

    res.json({
      counts: { pending, approved, paid, rejected },
      earnings: { approved: totalApproved, paid: totalPaid },
    });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch summary', message: e.message });
  }
});

export default router;
