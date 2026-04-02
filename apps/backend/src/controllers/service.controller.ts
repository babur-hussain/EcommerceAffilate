import { Request, Response } from 'express';
import { Service } from '../models/service.model';
import { ServiceType } from '../models/serviceType.model';
import { AuditLog } from '../models/auditLog.model';
import { logger } from '../utils/logger';
import slugify from 'slugify';

export const createService = async (req: Request, res: Response) => {
    try {
        const {
            name,
            serviceTypeId,
            price,
            description,
            images,
            data,
            location
        } = req.body;

        const providerId = (req as any).user?.id;

        // Validate service type exists
        const serviceType = await ServiceType.findById(serviceTypeId);
        if (!serviceType) {
            return res.status(404).json({ error: 'Service Type not found.' });
        }

        // Generate Slug
        let slug = slugify(name, { lower: true, strict: true });
        const existingSlug = await Service.findOne({ slug });
        if (existingSlug) {
            slug = `${slug}-${Date.now()}`;
        }

        const newService = await Service.create({
            name,
            slug,
            providerId,
            serviceTypeId: serviceType._id,
            serviceTypeCode: serviceType.slug,
            serviceTypeVersion: 1,
            data: data || {},
            price,
            images,
            description,
            location,
            status: 'DRAFT'
        });

        await AuditLog.create({
            userId: providerId,
            action: 'SERVICE_CREATE',
            entityType: 'SERVICE',
            entityId: newService._id.toString(),
            metadata: { serviceTypeId }
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

        if (service.providerId.toString() !== userId && (req as any).user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Not authorized to update this service' });
        }

        Object.assign(service, updates);
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
            serviceTypeId,
            providerId,
            search
        } = req.query;

        const query: any = {};

        if (status) query.status = status;
        if (serviceTypeId) query.serviceTypeId = serviceTypeId;
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
                .populate('providerId', 'name email'),
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

        service.status = 'ARCHIVED';
        await service.save();

        await AuditLog.create({
            userId,
            action: 'SERVICE_DELETE',
            entityType: 'SERVICE',
            entityId: id
        });

        res.json({ message: 'Service archived successfully' });
    } catch (error: any) {
        logger.error({ err: error }, 'Error deleting service');
        res.status(500).json({ error: 'Failed to delete service' });
    }
};
