import { Request, Response } from 'express';
import { ServiceCategory } from '../models/serviceCategory.model';
import { ServiceSubCategory } from '../models/serviceSubCategory.model';
import { AuditLog } from '../models/auditLog.model';
import { logger } from '../utils/logger';
import slugify from 'slugify';

export const createServiceCategory = async (req: Request, res: Response) => {
    try {
        const { name, icon, description, isActive, priority } = req.body;
        const userId = (req as any).user?.id;

        let slug = slugify(name, { lower: true, strict: true });
        const existing = await ServiceCategory.findOne({ slug });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        const category = await ServiceCategory.create({
            name,
            slug,
            icon: icon || '',
            description: description || '',
            isActive: isActive !== undefined ? isActive : true,
            priority: priority || 0,
        });

        await AuditLog.create({
            userId,
            action: 'SERVICE_CATEGORY_CREATE',
            entityType: 'SERVICE_CATEGORY',
            entityId: category._id.toString(),
            metadata: { name },
        });

        res.status(201).json(category);
    } catch (error: any) {
        logger.error({ err: error }, 'Error creating service category');
        res.status(500).json({ error: 'Failed to create service category' });
    }
};

export const updateServiceCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = (req as any).user?.id;

        const category = await ServiceCategory.findById(id);
        if (!category) return res.status(404).json({ error: 'Service category not found' });

        if (updates.name && updates.name !== category.name) {
            updates.slug = slugify(updates.name, { lower: true, strict: true });
        }

        Object.assign(category, updates);
        await category.save();

        await AuditLog.create({
            userId,
            action: 'SERVICE_CATEGORY_UPDATE',
            entityType: 'SERVICE_CATEGORY',
            entityId: id,
            metadata: { updates },
        });

        res.json(category);
    } catch (error: any) {
        logger.error({ err: error }, 'Error updating service category');
        res.status(500).json({ error: 'Failed to update service category' });
    }
};

export const deleteServiceCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;

        // Check if sub-categories exist
        const subCatCount = await ServiceSubCategory.countDocuments({ categoryId: id });
        if (subCatCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete category with existing sub-categories. Delete sub-categories first.',
            });
        }

        const category = await ServiceCategory.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ error: 'Service category not found' });

        await AuditLog.create({
            userId,
            action: 'SERVICE_CATEGORY_DELETE',
            entityType: 'SERVICE_CATEGORY',
            entityId: id,
        });

        res.json({ message: 'Service category deleted successfully' });
    } catch (error: any) {
        logger.error({ err: error }, 'Error deleting service category');
        res.status(500).json({ error: 'Failed to delete service category' });
    }
};

export const getServiceCategories = async (req: Request, res: Response) => {
    try {
        const { isActive, search } = req.query;
        const query: any = {};

        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (search) query.name = { $regex: search, $options: 'i' };

        const categories = await ServiceCategory.find(query).sort({ priority: 1, name: 1 });
        res.json(categories);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service categories');
        res.status(500).json({ error: 'Failed to fetch service categories' });
    }
};

export const getServiceCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await ServiceCategory.findById(id);
        if (!category) return res.status(404).json({ error: 'Service category not found' });
        res.json(category);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service category');
        res.status(500).json({ error: 'Failed to fetch service category' });
    }
};
