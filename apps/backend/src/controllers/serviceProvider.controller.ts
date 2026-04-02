import { Request, Response } from 'express';
import { ServiceProvider } from '../models/serviceProvider.model';
import { AuditLog } from '../models/auditLog.model';
import { logger } from '../utils/logger';

export const createServiceProvider = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const {
            serviceCategoryId,
            serviceSubCategoryId,
            businessName,
            description,
            experienceYears,
            location,
            serviceArea,
            pricingModel,
            startingPrice,
            currency,
            availability,
            images,
        } = req.body;

        const provider = await ServiceProvider.create({
            userId,
            serviceCategoryId,
            serviceSubCategoryId,
            businessName,
            description,
            experienceYears,
            location,
            serviceArea,
            pricingModel,
            startingPrice,
            currency,
            availability,
            images,
            status: 'PENDING',
            isVerified: false,
        });

        await AuditLog.create({
            userId,
            action: 'SERVICE_PROVIDER_CREATE',
            entityType: 'SERVICE_PROVIDER',
            entityId: provider._id.toString(),
            metadata: { businessName },
        });

        res.status(201).json(provider);
    } catch (error: any) {
        logger.error({ err: error }, 'Error creating service provider');
        res.status(500).json({ error: 'Failed to create service provider' });
    }
};

export const updateServiceProvider = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = (req as any).user?.id;

        const provider = await ServiceProvider.findById(id);
        if (!provider) return res.status(404).json({ error: 'Service provider not found' });

        // Only owner or admin can update
        if (provider.userId.toString() !== userId && !['SUPER_ADMIN', 'SERVICE_MANAGER'].includes((req as any).user?.role)) {
            return res.status(403).json({ error: 'Not authorized to update this provider' });
        }

        // Don't allow providers to change their status directly
        if ((req as any).user?.role !== 'SUPER_ADMIN' && (req as any).user?.role !== 'SERVICE_MANAGER') {
            delete updates.status;
            delete updates.isVerified;
        }

        Object.assign(provider, updates);
        await provider.save();

        await AuditLog.create({
            userId,
            action: 'SERVICE_PROVIDER_UPDATE',
            entityType: 'SERVICE_PROVIDER',
            entityId: id,
            metadata: { updates },
        });

        res.json(provider);
    } catch (error: any) {
        logger.error({ err: error }, 'Error updating service provider');
        res.status(500).json({ error: 'Failed to update service provider' });
    }
};

export const updateProviderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = (req as any).user?.id;

        const provider = await ServiceProvider.findById(id);
        if (!provider) return res.status(404).json({ error: 'Service provider not found' });

        const oldStatus = provider.status;
        provider.status = status;

        if (status === 'APPROVED') {
            provider.isVerified = true;
        } else if (status === 'REJECTED' || status === 'SUSPENDED') {
            provider.isVerified = false;
        }

        await provider.save();

        await AuditLog.create({
            userId,
            action: 'SERVICE_PROVIDER_STATUS_CHANGE',
            entityType: 'SERVICE_PROVIDER',
            entityId: id,
            metadata: { from: oldStatus, to: status },
        });

        res.json(provider);
    } catch (error: any) {
        logger.error({ err: error }, 'Error updating provider status');
        res.status(500).json({ error: 'Failed to update provider status' });
    }
};

export const getServiceProviders = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            serviceCategoryId,
            serviceSubCategoryId,
            search,
            minRating,
            maxPrice,
            sortBy = 'rating',
        } = req.query;

        const query: any = {};

        if (status) query.status = status;
        if (serviceCategoryId) query.serviceCategoryId = serviceCategoryId;
        if (serviceSubCategoryId) query.serviceSubCategoryId = serviceSubCategoryId;
        if (search) query.businessName = { $regex: search, $options: 'i' };
        if (minRating) query.rating = { $gte: Number(minRating) };
        if (maxPrice) query.startingPrice = { $lte: Number(maxPrice) };

        const skip = (Number(page) - 1) * Number(limit);

        const sortOptions: any = {};
        if (sortBy === 'rating') sortOptions.rating = -1;
        else if (sortBy === 'price') sortOptions.startingPrice = 1;
        else if (sortBy === 'experience') sortOptions.experienceYears = -1;
        else sortOptions.createdAt = -1;

        const [providers, total] = await Promise.all([
            ServiceProvider.find(query)
                .populate('userId', 'name email phoneNumber profileImage')
                .populate('serviceCategoryId', 'name slug')
                .populate('serviceSubCategoryId', 'name slug')
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit)),
            ServiceProvider.countDocuments(query),
        ]);

        res.json({
            data: providers,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service providers');
        res.status(500).json({ error: 'Failed to fetch service providers' });
    }
};

export const getServiceProviderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const provider = await ServiceProvider.findById(id)
            .populate('userId', 'name email phoneNumber profileImage')
            .populate('serviceCategoryId', 'name slug icon')
            .populate('serviceSubCategoryId', 'name slug icon');

        if (!provider) return res.status(404).json({ error: 'Service provider not found' });
        res.json(provider);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service provider');
        res.status(500).json({ error: 'Failed to fetch service provider' });
    }
};

export const deleteServiceProvider = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;

        const provider = await ServiceProvider.findById(id);
        if (!provider) return res.status(404).json({ error: 'Service provider not found' });

        // Soft delete by setting status to SUSPENDED
        provider.status = 'SUSPENDED';
        await provider.save();

        await AuditLog.create({
            userId,
            action: 'SERVICE_PROVIDER_DELETE',
            entityType: 'SERVICE_PROVIDER',
            entityId: id,
        });

        res.json({ message: 'Service provider suspended successfully' });
    } catch (error: any) {
        logger.error({ err: error }, 'Error deleting service provider');
        res.status(500).json({ error: 'Failed to delete service provider' });
    }
};

export const searchServiceProviders = async (req: Request, res: Response) => {
    try {
        const {
            lat,
            lng,
            radius = 10, // km
            categoryId,
            subCategoryId,
            minRating,
            maxPrice,
            page = 1,
            limit = 20,
        } = req.query;

        const query: any = { status: 'APPROVED', isVerified: true };

        if (categoryId) query.serviceCategoryId = categoryId;
        if (subCategoryId) query.serviceSubCategoryId = subCategoryId;
        if (minRating) query.rating = { $gte: Number(minRating) };
        if (maxPrice) query.startingPrice = { $lte: Number(maxPrice) };

        // Geo-spatial search
        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [Number(lng), Number(lat)],
                    },
                    $maxDistance: Number(radius) * 1000, // Convert km to meters
                },
            };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [providers, total] = await Promise.all([
            ServiceProvider.find(query)
                .populate('userId', 'name email profileImage')
                .populate('serviceCategoryId', 'name slug')
                .populate('serviceSubCategoryId', 'name slug')
                .skip(skip)
                .limit(Number(limit)),
            ServiceProvider.countDocuments(query),
        ]);

        res.json({
            data: providers,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error: any) {
        logger.error({ err: error }, 'Error searching service providers');
        res.status(500).json({ error: 'Failed to search service providers' });
    }
};
