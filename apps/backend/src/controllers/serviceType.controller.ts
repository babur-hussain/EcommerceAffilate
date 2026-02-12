import { Request, Response } from 'express';
import { ServiceType } from '../models/serviceType.model';
import { AuditLog } from '../models/auditLog.model';
import { logger } from '../utils/logger';

// --- Service Type Management ---

export const createServiceType = async (req: Request, res: Response) => {
    try {
        const { name, code, countryCode, description, icon } = req.body;
        const adminUserId = (req as any).user?.id;

        // Check if a draft already exists for this code/country
        const existingDraft = await ServiceType.findOne({
            code,
            countryCode: countryCode || 'ALL',
            status: 'DRAFT'
        });

        if (existingDraft) {
            return res.status(409).json({
                error: 'A draft already exists for this service type. Please edit the existing draft.',
                draftId: existingDraft._id
            });
        }

        // Determine next version (if published versions exist)
        const latestPublished = await ServiceType.findOne({
            code,
            countryCode: countryCode || 'ALL',
            status: 'PUBLISHED'
        }).sort({ version: -1 });

        const version = latestPublished ? latestPublished.version + 1 : 1;

        const newServiceType = await ServiceType.create({
            name,
            code,
            countryCode: countryCode || 'ALL',
            version,
            status: 'DRAFT',
            description,
            icon,
            fields: []
        });

        await AuditLog.create({
            userId: adminUserId,
            action: 'SERVICE_TYPE_CREATE',
            entityType: 'SERVICE_TYPE',
            entityId: newServiceType._id.toString(),
            metadata: { name, code, version },
        });

        res.status(201).json(newServiceType);
    } catch (error: any) {
        logger.error({ err: error }, 'Error creating service type');
        res.status(500).json({ error: 'Failed to create service type' });
    }
};

export const updateServiceType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const adminUserId = (req as any).user?.id;

        const serviceType = await ServiceType.findById(id);
        if (!serviceType) return res.status(404).json({ error: 'Service type not found' });

        if (serviceType.status === 'PUBLISHED') {
            // If trying to update a published version, we should strictly prevent it 
            // OR automatically fork it into a new draft (business logic decision).
            // For this implementation, we'll enforce that users must strictly edit DRAFTS.
            // If they want to edit a published one, they should "Create New Version" from UI 
            // which essentially calls createServiceType logic or a specific fork endpoint.
            return res.status(403).json({ error: 'Cannot edit a published service type. Create a new version instead.' });
        }

        // Allow updating fields
        Object.assign(serviceType, updates);

        // Protected fields check (ensure version/code integrity if needed, usually excluded from body)
        // serviceType.version = ... (should not change manually)

        await serviceType.save();

        await AuditLog.create({
            userId: adminUserId,
            action: 'SERVICE_TYPE_UPDATE',
            entityType: 'SERVICE_TYPE',
            entityId: serviceType._id.toString(),
            metadata: { updates },
        });

        res.json(serviceType);
    } catch (error: any) {
        logger.error({ err: error }, 'Error updating service type');
        res.status(500).json({ error: 'Failed to update service type' });
    }
};

export const publishServiceType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const adminUserId = (req as any).user?.id;

        const serviceType = await ServiceType.findById(id);
        if (!serviceType) return res.status(404).json({ error: 'Service type not found' });

        if (serviceType.status === 'PUBLISHED') {
            return res.json(serviceType); // Idempotent
        }

        serviceType.status = 'PUBLISHED';
        await serviceType.save();

        await AuditLog.create({
            userId: adminUserId,
            action: 'SERVICE_TYPE_PUBLISH',
            entityType: 'SERVICE_TYPE',
            entityId: serviceType._id.toString(),
            metadata: { version: serviceType.version },
        });

        res.json(serviceType);
    } catch (error: any) {
        logger.error({ err: error }, 'Error publishing service type');
        res.status(500).json({ error: 'Failed to publish service type' });
    }
};

export const getServiceTypes = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const query: any = {};
        if (status) query.status = status;

        // Ideally, we might want to group by code and show latest, 
        // or just list everything. For simple admin list, listing everything is fine 
        // but maybe sorting by code and version.
        const serviceTypes = await ServiceType.find(query).sort({ code: 1, version: -1 });
        res.json(serviceTypes);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service types');
        res.status(500).json({ error: 'Failed to fetch service types' });
    }
};

export const getServiceTypeByCode = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const { countryCode, version } = req.query;

        const query: any = { code: code.toUpperCase() };

        if (countryCode) query.countryCode = (countryCode as string).toUpperCase();
        else query.countryCode = 'ALL';

        if (version) {
            query.version = parseInt(version as string);
        } else {
            // Default to latest PUBLISHED if no version specified
            query.status = 'PUBLISHED';
        }

        const serviceType = await ServiceType.findOne(query).sort({ version: -1 });

        // If requesting latest published but none exists, maybe return draft? 
        // For now, strict 404 if not found.
        if (!serviceType) return res.status(404).json({ error: 'Service type not found' });

        res.json(serviceType);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service type details');
        res.status(500).json({ error: 'Failed to fetch service type details' });
    }
};
