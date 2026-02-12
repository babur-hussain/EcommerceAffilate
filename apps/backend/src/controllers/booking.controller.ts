import { Request, Response } from 'express';
import { Booking, IBooking } from '../models/booking.model';
import { AuditLog } from '../models/auditLog.model';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

// Helper to log actions
const logAction = async (
    userId: string,
    action: string,
    entityId: string,
    metadata: any = {}
) => {
    try {
        await AuditLog.create({
            userId,
            action,
            entityType: 'BOOKING',
            entityId,
            metadata: {
                ...metadata,
                timestamp: new Date()
            }
        });
    } catch (err) {
        logger.error('Failed to create audit log', err);
    }
};

export const getBookings = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            paymentStatus,
            providerId,
            userId,
            startDate,
            endDate,
            search,
            minFraudScore
        } = req.query;

        const query: any = {};

        if (status) query.status = status;
        if (paymentStatus) query['payment.status'] = paymentStatus;
        if (providerId) query.providerId = providerId;
        if (userId) query.userId = userId;

        if (startDate || endDate) {
            query['slot.date'] = {};
            if (startDate) query['slot.date'].$gte = new Date(startDate as string);
            if (endDate) query['slot.date'].$lte = new Date(endDate as string);
        }

        if (minFraudScore) {
            query.fraudScore = { $gte: Number(minFraudScore) };
        }

        if (search) {
            // Regex search on Booking ID or some linked user field (advanced requires aggregation)
            // specific to bookingId for now
            query.bookingId = { $regex: search, $options: 'i' };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('userId', 'firstName lastName email')
            .populate('providerId', 'firstName lastName businessName')
            .populate('serviceId', 'name');

        const total = await Booking.countDocuments(query);

        res.json({
            data: bookings,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        logger.error({ err: error }, 'Error fetching bookings');
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId', 'firstName lastName email phone')
            .populate('providerId', 'firstName lastName businessName')
            .populate('serviceId')
            .populate('internalNotes.authorId', 'firstName lastName');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, note } = req.body;
        const adminId = (req as any).user?._id; // Assuming auth middleware

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        const oldStatus = booking.status;
        booking.status = status;

        // SLA updates
        if (status === 'CONFIRMED' && !booking.sla.confirmedAt) {
            booking.sla.confirmedAt = new Date();
        }
        if (status === 'COMPLETED') {
            booking.sla.completedAt = new Date();
        }

        if (note) {
            booking.internalNotes.push({
                content: `Status Change Note: ${note}`,
                authorId: adminId,
                createdAt: new Date()
            });
        }

        await booking.save();

        // Audit Log
        await logAction(adminId, 'UPDATE_STATUS', id, { from: oldStatus, to: status, note });

        res.json(booking);
    } catch (error) {
        logger.error({ err: error }, 'Error updating booking status');
        res.status(500).json({ error: 'Failed to update booking status' });
    }
};

export const addBookingNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const authorId = (req as any).user?._id;

        const booking = await Booking.findByIdAndUpdate(
            id,
            {
                $push: {
                    internalNotes: {
                        content,
                        authorId,
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        ).populate('internalNotes.authorId', 'firstName lastName');

        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        await logAction(authorId, 'ADD_NOTE', id, { contentSnippet: content.substring(0, 50) });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add note' });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    // Basic creation logic for testing seed. Real flow likely comes from Payment Webhook / Service App
    try {
        const payload = req.body;
        // Generate readable ID
        const count = await Booking.countDocuments();
        payload.bookingId = `BK-${10000 + count + 1}`;

        const booking = await Booking.create(payload);

        await logAction((req as any).user?._id, 'CREATE_BOOKING', booking._id.toString());

        res.status(201).json(booking);
    } catch (error) {
        logger.error({ err: error }, 'Error creating booking');
        res.status(500).json({ error: 'Failed to create booking' });
    }
};
