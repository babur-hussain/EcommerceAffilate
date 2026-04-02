import { Request, Response } from 'express';
import { ServiceType } from '../models/serviceType.model';
import { ServiceCategory } from '../models/serviceCategory.model';

// GET /api/service-types
export const getServiceTypes = async (req: Request, res: Response) => {
    try {
        const { categoryId, subCategoryId, isActive, search } = req.query;
        const filter: any = {};
        if (categoryId) filter.categoryId = categoryId;
        if (subCategoryId) filter.subCategoryId = subCategoryId;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (search) filter.name = { $regex: search, $options: 'i' };

        const types = await ServiceType.find(filter)
            .populate('categoryId', 'name icon')
            .populate('subCategoryId', 'name icon')
            .sort({ priority: 1, name: 1 });
        res.json(types);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/service-types/:id
export const getServiceTypeById = async (req: Request, res: Response) => {
    try {
        const type = await ServiceType.findById(req.params.id)
            .populate('categoryId', 'name icon')
            .populate('subCategoryId', 'name icon');
        if (!type) return res.status(404).json({ error: 'Service type not found' });
        res.json(type);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/service-types/by-subcategory/:subCategoryId
export const getTypesBySubCategoryId = async (req: Request, res: Response) => {
    try {
        const types = await ServiceType.find({
            subCategoryId: req.params.subCategoryId,
            isActive: true,
        }).sort({ priority: 1, name: 1 });
        res.json(types);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/service-types
export const createServiceType = async (req: Request, res: Response) => {
    try {
        const { categoryId, subCategoryId, name, description, icon, isActive } = req.body;
        if (!categoryId || !name) {
            return res.status(400).json({ error: 'categoryId and name are required' });
        }

        const category = await ServiceCategory.findById(categoryId);
        if (!category) return res.status(404).json({ error: 'Category not found' });

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const type = await ServiceType.create({
            categoryId,
            subCategoryId: subCategoryId || null,
            name,
            slug,
            description: description || '',
            icon: icon || '',
            isActive: isActive !== false,
        });
        res.status(201).json(type);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/service-types/:id
export const updateServiceType = async (req: Request, res: Response) => {
    try {
        const { name, description, icon, isActive, categoryId, subCategoryId } = req.body;
        const update: any = {};
        if (name) {
            update.name = name;
            update.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (description !== undefined) update.description = description;
        if (icon !== undefined) update.icon = icon;
        if (isActive !== undefined) update.isActive = isActive;
        if (categoryId) update.categoryId = categoryId;
        if (subCategoryId !== undefined) update.subCategoryId = subCategoryId || null;

        const type = await ServiceType.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!type) return res.status(404).json({ error: 'Service type not found' });
        res.json(type);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/service-types/:id
export const deleteServiceType = async (req: Request, res: Response) => {
    try {
        const type = await ServiceType.findByIdAndDelete(req.params.id);
        if (!type) return res.status(404).json({ error: 'Service type not found' });
        res.json({ message: 'Service type deleted' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
