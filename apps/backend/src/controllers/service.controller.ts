import { Request, Response } from 'express';
import { Service } from '../models/service.model';
import { ServiceType, IServiceType } from '../models/serviceType.model'; // Assuming export
import { AuditLog } from '../models/auditLog.model';
import { logger } from '../utils/logger';
import slugify from 'slugify';

// Helper to validate dynamic data against schema fields
const validateDynamicData = (data: any, fields: any[]) => {
    const errors: string[] = [];

    fields.forEach((field) => {
        const value = data[field.key];

        // Required check
        if (field.required && (value === undefined || value === null || value === '')) {
            errors.push(`Field '${field.label}' (${field.key}) is required.`);
        }

        // Type validation (basic)
        if (value !== undefined && value !== null) {
            if (field.type === 'number' && typeof value !== 'number') {
                errors.push(`Field '${field.label}' must be a number.`);
            }
            // Add more type checks as needed (date, boolean, etc.)

            // Min/Max validation for numbers
            if (field.type === 'number' && field.validation) {
                if (field.validation.min !== undefined && value < field.validation.min) {
                    errors.push(`Field '${field.label}' must be at least ${field.validation.min}.`);
                }
                if (field.validation.max !== undefined && value > field.validation.max) {
                    errors.push(`Field '${field.label}' must be at most ${field.validation.max}.`);
                }
            }

            // Regex validation
            if (field.type === 'text' && field.validation?.regex) {
                try {
                    const regex = new RegExp(field.validation.regex);
                    if (!regex.test(value)) {
                        errors.push(`Field '${field.label}' format is invalid.`);
                    }
                } catch (e) {
                    logger.warn(`Invalid regex for field ${field.key}`);
                }
            }
        }
    });

    return errors;
};

export const createService = async (req: Request, res: Response) => {
    try {
        const {
            name,
            serviceTypeCode,
            price,
            description,
            images,
            data,
            location
        } = req.body;

        const providerId = (req as any).user?.id; // Assumes provider is creating

        // 1. Fetch Latest Published Schema
        const serviceType = await ServiceType.findOne({
            code: serviceTypeCode,
            status: 'PUBLISHED'
        }).sort({ version: -1 });

        if (!serviceType) {
            return res.status(404).json({ error: 'Service Type schema not found or not published.' });
        }

        // 2. Validate Dynamic Data
        const validationErrors = validateDynamicData(data || {}, serviceType.fields);
        if (validationErrors.length > 0) {
            return res.status(400).json({ error: 'Validation failed', details: validationErrors });
        }

        // 3. Generate Slug
        let slug = slugify(name, { lower: true, strict: true });
        // Simple uniqueness check (in real world, retry with suffix)
        const existingSlug = await Service.findOne({ slug });
        if (existingSlug) {
            slug = `${slug}-${Date.now()}`;
        }

        // 4. Create Service
        const newService = await Service.create({
            name,
            slug,
            providerId,
            serviceTypeId: serviceType._id,
            serviceTypeCode: serviceType.code,
            serviceTypeVersion: serviceType.version, // Snapshot version
            data: data || {},
            price,
            images,
            description,
            location,
            status: 'DRAFT' // Default to draft
        });

        await AuditLog.create({
            userId: providerId,
            action: 'SERVICE_CREATE',
            entityType: 'SERVICE',
            entityId: newService._id.toString(),
            metadata: { serviceTypeCode, version: serviceType.version }
        });

        res.status(201).json(newService);

    } catch (error: any) {
        logger.error({ err: error }, 'Error creating service');
        res.status(500).json({ error: 'Failed to create service' });
    }
};

export const updateService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = (req as any).user?.id;

        const service = await Service.findById(id);
        if (!service) return res.status(404).json({ error: 'Service not found' });

        // Authorization check (Provider owns service OR Super Admin)
        // For strictness, if providerId is stored as string/ObjectId, compare strings
        if (service.providerId.toString() !== userId && (req as any).user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Not authorized to update this service' });
        }

        // If updating 'data', we must re-validate against THE SAME version schema used on creation
        // to ensure integrity, OR we separate "Migration" logic.
        if (updates.data) {
            const originalSchema = await ServiceType.findOne({
                code: service.serviceTypeCode,
                version: service.serviceTypeVersion
            });

            if (originalSchema) {
                const validationErrors = validateDynamicData(updates.data, originalSchema.fields);
                if (validationErrors.length > 0) {
                    return res.status(400).json({ error: 'Validation failed', details: validationErrors });
                }
            } else {
                logger.warn(`Schema version ${service.serviceTypeVersion} for ${service.serviceTypeCode} missing during update.`);
                // Proceed with caution or block? Allowing for now but logging.
            }
        }

        Object.assign(service, updates);

        // If name changed, update slug? Maybe not to keep URLs stable.

        await service.save();

        await AuditLog.create({
            userId,
            action: 'SERVICE_UPDATE',
            entityType: 'SERVICE',
            entityId: service._id.toString(),
            metadata: { updates }
        });

        res.json(service);

    } catch (error: any) {
        logger.error({ err: error }, 'Error updating service');
        res.status(500).json({ error: 'Failed to update service' });
    }
};

export const getServices = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            serviceTypeCode,
            providerId,
            search
        } = req.query;

        const query: any = {};

        if (status) query.status = status;
        if (serviceTypeCode) query.serviceTypeCode = serviceTypeCode;
        if (providerId) query.providerId = providerId;

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [services, total] = await Promise.all([
            Service.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate('providerId', 'name email'), // Populate basic provider info
            Service.countDocuments(query)
        ]);

        res.json({
            data: services,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });

    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching services');
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

export const getServiceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id).populate('providerId', 'name email');

        if (!service) return res.status(404).json({ error: 'Service not found' });

        res.json(service);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service details');
        res.status(500).json({ error: 'Failed to fetch service details' });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;

        const service = await Service.findById(id);
        if (!service) return res.status(404).json({ error: 'Service not found' });

        if (service.providerId.toString() !== userId && (req as any).user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Not authorized to delete this service' });
        }

        // Soft delete
        service.status = 'ARCHIVED';
        await service.save();

        await AuditLog.create({
            userId,
            action: 'SERVICE_DELETE', // Soft delete
            entityType: 'SERVICE',
            entityId: id
        });

        res.json({ message: 'Service archived successfully' });
    } catch (error: any) {
        logger.error({ err: error }, 'Error deleting service');
        res.status(500).json({ error: 'Failed to delete service' });
    }
};
