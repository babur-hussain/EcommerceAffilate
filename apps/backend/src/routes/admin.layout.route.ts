import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middlewares/rbac';
import { AdvancedLayout, IAdvancedLayout } from '../models/advanced.layout.model';
import mongoose from 'mongoose';

const router = Router();

// GET /api/admin/layouts - List all layouts
router.get('/admin/layouts', requireAdmin, async (req: Request, res: Response) => {
    try {
        const layouts = await AdvancedLayout.find({})
            .select('slug name description isActive version updatedAt')
            .sort({ updatedAt: -1 });
        res.json(layouts);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch layouts', message: error.message });
    }
});

// GET /api/admin/layouts/:id - Get single layout details
router.get('/admin/layouts/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let layout;

        if (mongoose.Types.ObjectId.isValid(id)) {
            layout = await AdvancedLayout.findById(id);
        } else {
            // Allow lookup by slug as well
            layout = await AdvancedLayout.findOne({ slug: id });
        }

        if (!layout) {
            return res.status(404).json({ error: 'Layout not found' });
        }
        res.json(layout);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch layout', message: error.message });
    }
});

// POST /api/admin/layouts - Create new layout
router.post('/admin/layouts', requireAdmin, async (req: Request, res: Response) => {
    try {
        const { slug, name, description, components, meta } = req.body;

        if (!slug || !name) {
            return res.status(400).json({ error: 'Slug and Name are required' });
        }

        const existing = await AdvancedLayout.findOne({ slug });
        if (existing) {
            return res.status(400).json({ error: 'Layout with this slug already exists' });
        }

        const layout = await AdvancedLayout.create({
            slug,
            name,
            description,
            components: components || [],
            meta,
            version: 1,
            isActive: true
        });

        res.status(201).json(layout);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create layout', message: error.message });
    }
});

// PUT /api/admin/layouts/:id - Update layout
router.put('/admin/layouts/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid layout ID' });
        }

        // Auto-increment version
        const result = await AdvancedLayout.findByIdAndUpdate(
            id,
            {
                ...updates,
                $inc: { version: 1 }
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: 'Layout not found' });
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update layout', message: error.message });
    }
});

// DELETE /api/admin/layouts/:id - Delete layout
router.delete('/admin/layouts/:id', requireAdmin, async (req: Request, res: Response) => {
    console.log(`🗑️ DELETE Layout Request: ${req.params.id}`);
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(`❌ Invalid Layout ID: ${id}`);
            return res.status(400).json({ error: 'Invalid layout ID' });
        }

        const result = await AdvancedLayout.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Layout not found' });
        }

        res.json({ message: 'Layout deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete layout', message: error.message });
    }
});

export default router;
