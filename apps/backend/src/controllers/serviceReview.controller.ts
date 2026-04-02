import { Request, Response } from 'express';
import { ServiceReview } from '../models/serviceReview.model';
import { ServiceProvider } from '../models/serviceProvider.model';
import { Booking } from '../models/booking.model';
import { logger } from '../utils/logger';

export const createServiceReview = async (req: Request, res: Response) => {
    try {
        const customerId = (req as any).user?.id;
        const { serviceProviderId, bookingId, rating, review } = req.body;

        // Verify booking exists and belongs to this customer
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (booking.userId.toString() !== customerId) {
            return res.status(403).json({ error: 'You can only review your own bookings' });
        }
        if (booking.status !== 'COMPLETED') {
            return res.status(400).json({ error: 'You can only review completed bookings' });
        }

        // Check if already reviewed
        const existingReview = await ServiceReview.findOne({ bookingId });
        if (existingReview) {
            return res.status(409).json({ error: 'This booking has already been reviewed' });
        }

        const serviceReview = await ServiceReview.create({
            serviceProviderId,
            bookingId,
            customerId,
            rating,
            review,
        });

        // Update provider rating
        const allReviews = await ServiceReview.find({ serviceProviderId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await ServiceProvider.findByIdAndUpdate(serviceProviderId, {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: allReviews.length,
        });

        res.status(201).json(serviceReview);
    } catch (error: any) {
        logger.error({ err: error }, 'Error creating service review');
        res.status(500).json({ error: 'Failed to create service review' });
    }
};

export const getReviewsByProvider = async (req: Request, res: Response) => {
    try {
        const { providerId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const [reviews, total] = await Promise.all([
            ServiceReview.find({ serviceProviderId: providerId })
                .populate('customerId', 'name profileImage')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            ServiceReview.countDocuments({ serviceProviderId: providerId }),
        ]);

        res.json({
            data: reviews,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service reviews');
        res.status(500).json({ error: 'Failed to fetch service reviews' });
    }
};
