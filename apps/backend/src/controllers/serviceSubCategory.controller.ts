import { Request, Response } from 'express';
import { ServiceSubCategory } from '../models/serviceSubCategory.model';
import { ServiceCategory } from '../models/serviceCategory.model';
import { AuditLog } from '../models/auditLog.model';
import { logger } from '../utils/logger';
import slugify from 'slugify';

export const createServiceSubCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId, name, icon, description, isActive } = req.body;
        const userId = (req as any).user?.id;

        // Verify parent category exists
        const category = await ServiceCategory.findById(categoryId);
        if (!category) return res.status(404).json({ error: 'Parent service category not found' });

        let slug = slugify(name, { lower: true, strict: true });
        const existing = await ServiceSubCategory.findOne({ slug, categoryId });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        const subCategory = await ServiceSubCategory.create({
            categoryId,
            name,
            slug,
            icon: icon || '',
            description: description || '',
            isActive: isActive !== undefined ? isActive : true,
        });

        await AuditLog.create({
            userId,
            action: 'SERVICE_SUBCATEGORY_CREATE',
            entityType: 'SERVICE_SUBCATEGORY',
            entityId: subCategory._id.toString(),
            metadata: { name, categoryId },
        });

        res.status(201).json(subCategory);
    } catch (error: any) {
        logger.error({ err: error }, 'Error creating service sub-category');
        res.status(500).json({ error: 'Failed to create service sub-category' });
    }
};

export const updateServiceSubCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = (req as any).user?.id;

        const subCategory = await ServiceSubCategory.findById(id);
        if (!subCategory) return res.status(404).json({ error: 'Service sub-category not found' });

        if (updates.name && updates.name !== subCategory.name) {
            updates.slug = slugify(updates.name, { lower: true, strict: true });
        }

        Object.assign(subCategory, updates);
        await subCategory.save();

        await AuditLog.create({
            userId,
            action: 'SERVICE_SUBCATEGORY_UPDATE',
            entityType: 'SERVICE_SUBCATEGORY',
            entityId: id,
            metadata: { updates },
        });

        res.json(subCategory);
    } catch (error: any) {
        logger.error({ err: error }, 'Error updating service sub-category');
        res.status(500).json({ error: 'Failed to update service sub-category' });
    }
};

export const deleteServiceSubCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;

        const subCategory = await ServiceSubCategory.findByIdAndDelete(id);
        if (!subCategory) return res.status(404).json({ error: 'Service sub-category not found' });

        await AuditLog.create({
            userId,
            action: 'SERVICE_SUBCATEGORY_DELETE',
            entityType: 'SERVICE_SUBCATEGORY',
            entityId: id,
        });

        res.json({ message: 'Service sub-category deleted successfully' });
    } catch (error: any) {
        logger.error({ err: error }, 'Error deleting service sub-category');
        res.status(500).json({ error: 'Failed to delete service sub-category' });
    }
};

export const getServiceSubCategories = async (req: Request, res: Response) => {
    try {
        const { categoryId, isActive, search } = req.query;
        const query: any = {};

        if (categoryId) query.categoryId = categoryId;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (search) query.name = { $regex: search, $options: 'i' };

        const subCategories = await ServiceSubCategory.find(query)
            .populate('categoryId', 'name slug')
            .sort({ priority: 1, name: 1 });

        res.json(subCategories);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service sub-categories');
        res.status(500).json({ error: 'Failed to fetch service sub-categories' });
    }
};

export const getServiceSubCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const subCategory = await ServiceSubCategory.findById(id).populate('categoryId', 'name slug');
        if (!subCategory) return res.status(404).json({ error: 'Service sub-category not found' });
        res.json(subCategory);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service sub-category');
        res.status(500).json({ error: 'Failed to fetch service sub-category' });
    }
};

export const getSubCategoriesByCategoryId = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;
        const subCategories = await ServiceSubCategory.find({
            categoryId,
            isActive: true,
        }).sort({ priority: 1, name: 1 });
        res.json(subCategories);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching sub-categories by category');
        res.status(500).json({ error: 'Failed to fetch sub-categories' });
    }
};
