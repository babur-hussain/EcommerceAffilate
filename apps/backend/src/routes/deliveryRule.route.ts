import express from 'express';
import { DeliveryRule } from '../models/deliveryRule.model';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import { requireRoles } from '../middlewares/rbac';

const router = express.Router();

// GET /api/delivery-rules (Admin/Public?) - List all rules
// Public might need to see them? Probably only Admin.
router.get('/', verifyFirebaseToken, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const rules = await DeliveryRule.find().sort({ minDistance: 1 });
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery rules', error });
    }
});

// POST /api/delivery-rules (Admin) - Create new rule
router.post('/', verifyFirebaseToken, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const { name, minDistance, maxDistance, timeValue, timeUnit } = req.body;

        // Basic validation
        if (minDistance >= maxDistance) {
            return res.status(400).json({ message: 'minDistance must be less than maxDistance' });
        }

        // Check for overlap? For simplicity, we might skip complex overlap checks now 
        // but in production we should ensure ranges don't conflict ambiguously.

        const rule = new DeliveryRule({
            name,
            minDistance,
            maxDistance,
            timeValue,
            timeUnit
        });

        await rule.save();
        res.status(201).json(rule);
    } catch (error) {
        res.status(500).json({ message: 'Error creating delivery rule', error });
    }
});

// PUT /api/delivery-rules/:id (Admin)
router.put('/:id', verifyFirebaseToken, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const { minDistance, maxDistance } = req.body;

        if (minDistance !== undefined && maxDistance !== undefined && minDistance >= maxDistance) {
            return res.status(400).json({ message: 'minDistance must be less than maxDistance' });
        }

        const rule = await DeliveryRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        res.json(rule);
    } catch (error) {
        res.status(500).json({ message: 'Error updating delivery rule', error });
    }
});

// DELETE /api/delivery-rules/:id (Admin)
router.delete('/:id', verifyFirebaseToken, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const rule = await DeliveryRule.findByIdAndDelete(req.params.id);
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        res.json({ message: 'Rule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting delivery rule', error });
    }
});

export default router;
