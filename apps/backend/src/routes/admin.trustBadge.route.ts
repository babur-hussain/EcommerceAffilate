import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { TrustBadge } from '../models/trustBadge.model';

const router = Router();

// Get all trust badges
router.get('/trust-badges', async (_req: Request, res: Response) => {
    try {
        const badges = await TrustBadge.find({ isActive: true }).sort({ createdAt: -1 }).lean();
        res.json(badges);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch trust badges', message: error.message });
    }
});

// Create new trust badge
router.post('/trust-badges', async (req: Request, res: Response) => {
    try {
        const { id, name, description, icon } = req.body;

        if (!id || !name || !icon) {
            return res.status(400).json({ error: 'Badge ID, Name, and Icon are required' });
        }

        // Check if badge with this ID already exists
        const existing = await TrustBadge.findOne({ id });
        if (existing) {
            return res.status(400).json({ error: 'Badge with this ID already exists' });
        }

        const badge = await TrustBadge.create({
            id,
            name,
            description: description || '',
            icon,
            isActive: true
        });

        res.status(201).json(badge);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create trust badge', message: error.message });
    }
});

// Update trust badge
router.patch('/trust-badges/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, icon, isActive } = req.body;

        const badge = await TrustBadge.findOne({ id });
        if (!badge) {
            return res.status(404).json({ error: 'Badge not found' });
        }

        if (name) badge.name = name;
        if (description) badge.description = description;
        if (icon) badge.icon = icon;
        if (typeof isActive === 'boolean') badge.isActive = isActive;

        await badge.save();
        res.json(badge);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update trust badge', message: error.message });
    }
});

// Delete trust badge
router.delete('/trust-badges/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await TrustBadge.findOneAndDelete({ id });
        res.json({ message: 'Badge deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete trust badge', message: error.message });
    }
});

export default router;
