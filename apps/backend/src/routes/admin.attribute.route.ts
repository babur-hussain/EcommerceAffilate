import express from 'express';
import Attribute from '../models/attribute.model';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import { requireRoles } from '../middlewares/rbac';

const router = express.Router();

// Middleware for authentication and authorization
const auth = [verifyFirebaseToken, requireRoles(['SUPER_ADMIN'])];

// Get all attributes
router.get('/attributes', ...auth, async (req, res) => {
    try {
        const attributes = await Attribute.find().sort({ name: 1 });
        res.json(attributes);
    } catch (error: any) {
        console.error('Error fetching attributes:', error);
        res.status(500).json({ error: 'Failed to fetch attributes' });
    }
});

// Create new attribute
router.post('/attributes', ...auth, async (req, res) => {
    try {
        const { code, name, type, isFilterable, isVariant, values } = req.body;

        if (!code || !name) {
            return res.status(400).json({ error: 'Code and Name are required' });
        }

        const existingAttribute = await Attribute.findOne({ code });
        if (existingAttribute) {
            return res.status(400).json({ error: 'Attribute code already exists' });
        }

        const attribute = new Attribute({
            code,
            name,
            type,
            isFilterable,
            isVariant,
            values: values || [],
        });

        await attribute.save();
        res.status(201).json(attribute);
    } catch (error: any) {
        console.error('Error creating attribute:', error);
        res.status(500).json({ error: 'Failed to create attribute' });
    }
});

// Update attribute
router.put('/attributes/:id', ...auth, async (req, res) => {
    try {
        const { name, type, isFilterable, isVariant, values } = req.body;

        const attribute = await Attribute.findById(req.params.id);
        if (!attribute) {
            return res.status(404).json({ error: 'Attribute not found' });
        }

        if (name) attribute.name = name;
        if (type) attribute.type = type;
        if (isFilterable !== undefined) attribute.isFilterable = isFilterable;
        if (isVariant !== undefined) attribute.isVariant = isVariant;
        if (values) attribute.values = values;

        await attribute.save();
        res.json(attribute);
    } catch (error: any) {
        console.error('Error updating attribute:', error);
        res.status(500).json({ error: 'Failed to update attribute' });
    }
});

// Delete attribute
router.delete('/attributes/:id', ...auth, async (req, res) => {
    try {
        await Attribute.findByIdAndDelete(req.params.id);
        res.json({ message: 'Attribute deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting attribute:', error);
        res.status(500).json({ error: 'Failed to delete attribute' });
    }
});

export default router;
