import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import { getAttributionsByInfluencer, getTotalCommissionByInfluencer } from '../services/influencer.service';

const router = Router();

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
