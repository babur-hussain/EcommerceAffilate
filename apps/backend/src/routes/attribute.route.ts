import express from 'express';
import Attribute from '../models/attribute.model';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';

import { Business } from '../models/business.model';

const router = express.Router();

// Get all attributes (public/authenticated for sellers)
router.get('/attributes', verifyFirebaseToken, async (req, res) => {
    try {
        const businessId = (req as any).businessId; // Populated by verifyFirebaseToken if business user

        let query: any = {};

        if (businessId) {
            const business = await Business.findById(businessId).select('assignedAttributes');
            if (business?.assignedAttributes && business.assignedAttributes.length > 0) {
                query._id = { $in: business.assignedAttributes };
            }
        }

        const attributes = await Attribute.find(query).sort({ name: 1 });
        res.json(attributes);
    } catch (error: any) {
        console.error('Error fetching attributes:', error);
        res.status(500).json({ error: 'Failed to fetch attributes' });
    }
});

export default router;
