import { Request, Response } from 'express';
import { ServiceCategory } from '../models/serviceCategory.model';
import { ServiceSubCategory } from '../models/serviceSubCategory.model';
import { ServiceProvider } from '../models/serviceProvider.model';
import { Booking } from '../models/booking.model';
import { logger } from '../utils/logger';

export const getServiceAnalyticsOverview = async (req: Request, res: Response) => {
    try {
        const [
            totalCategories,
            totalSubCategories,
            totalProviders,
            approvedProviders,
            pendingProviders,
            totalBookings,
            completedBookings,
        ] = await Promise.all([
            ServiceCategory.countDocuments({ isActive: true }),
            ServiceSubCategory.countDocuments({ isActive: true }),
            ServiceProvider.countDocuments(),
            ServiceProvider.countDocuments({ status: 'APPROVED' }),
            ServiceProvider.countDocuments({ status: 'PENDING' }),
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'COMPLETED' }),
        ]);

        // Calculate revenue from completed bookings
        const revenueResult = await Booking.aggregate([
            { $match: { status: 'COMPLETED', 'payment.status': 'PAID' } },
            { $group: { _id: null, totalRevenue: { $sum: '$payment.amount' } } },
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        res.json({
            totalCategories,
            totalSubCategories,
            totalProviders,
            approvedProviders,
            pendingProviders,
            totalBookings,
            completedBookings,
            totalRevenue,
        });
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching service analytics');
        res.status(500).json({ error: 'Failed to fetch service analytics' });
    }
};

export const getTopProviders = async (req: Request, res: Response) => {
    try {
        const { limit = 10 } = req.query;

        const topProviders = await ServiceProvider.find({ status: 'APPROVED' })
            .populate('userId', 'name email profileImage')
            .populate('serviceCategoryId', 'name')
            .populate('serviceSubCategoryId', 'name')
            .sort({ rating: -1, reviewCount: -1 })
            .limit(Number(limit));

        res.json(topProviders);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching top providers');
        res.status(500).json({ error: 'Failed to fetch top providers' });
    }
};

export const getTopCategories = async (req: Request, res: Response) => {
    try {
        const topCategories = await ServiceProvider.aggregate([
            { $match: { status: 'APPROVED' } },
            {
                $group: {
                    _id: '$serviceCategoryId',
                    providerCount: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                },
            },
            { $sort: { providerCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'servicecategories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: '$category' },
            {
                $project: {
                    _id: 1,
                    name: '$category.name',
                    icon: '$category.icon',
                    providerCount: 1,
                    avgRating: { $round: ['$avgRating', 1] },
                },
            },
        ]);

        res.json(topCategories);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching top categories');
        res.status(500).json({ error: 'Failed to fetch top categories' });
    }
};

export const getRevenueOverTime = async (req: Request, res: Response) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const revenueData = await Booking.aggregate([
            {
                $match: {
                    status: 'COMPLETED',
                    'payment.status': 'PAID',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    total: { $sum: '$payment.amount' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Format to match frontend: [ { name: 'Jan', total: 1200 }, ... ]
        const formattedData = revenueData.map(item => ({
            name: monthNames[item._id.month - 1],
            total: item.total
        }));

        res.json(formattedData);
    } catch (error: any) {
        logger.error({ err: error }, 'Error fetching revenue over time');
        res.status(500).json({ error: 'Failed to fetch revenue over time' });
    }
};
