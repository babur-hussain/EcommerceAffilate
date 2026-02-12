import mongoose, { Schema, Document } from 'mongoose';

export type BookingStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'REJECTED'
    | 'NO_SHOW';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface IBooking extends Document {
    bookingId: string; // Readable ID (e.g., BK-12345)
    userId: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;

    slot: {
        date: Date; // Midnight UTC
        startTime: string; // HH:mm
        endTime: string;   // HH:mm
    };

    status: BookingStatus;

    payment: {
        amount: number;
        currency: string;
        status: PaymentStatus;
        transactionId?: string;
        method?: string;
    };

    fraudScore?: number;

    internalNotes: {
        content: string;
        authorId: mongoose.Types.ObjectId;
        createdAt: Date;
    }[];

    sla: {
        confirmedAt?: Date;
        completedAt?: Date;
        expectedCompletionAt?: Date;
        breachWarningSent?: boolean;
    };

    metadata: Record<string, any>;

    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        bookingId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        providerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
            index: true
        },
        slot: {
            date: { type: Date, required: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true }
        },
        status: {
            type: String,
            enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED', 'NO_SHOW'],
            default: 'PENDING',
            index: true
        },
        payment: {
            amount: { type: Number, required: true },
            currency: { type: String, default: 'USD' },
            status: {
                type: String,
                enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
                default: 'PENDING'
            },
            transactionId: String,
            method: String
        },
        fraudScore: { type: Number, default: 0 },
        internalNotes: [{
            content: String,
            authorId: { type: Schema.Types.ObjectId, ref: 'User' },
            createdAt: { type: Date, default: Date.now }
        }],
        sla: {
            confirmedAt: Date,
            completedAt: Date,
            expectedCompletionAt: Date,
            breachWarningSent: { type: Boolean, default: false }
        },
        metadata: { type: Schema.Types.Mixed, default: {} }
    },
    {
        timestamps: true
    }
);

// Indexes for common filters
bookingSchema.index({ 'slot.date': 1 });
bookingSchema.index({ status: 1, providerId: 1 });
bookingSchema.index({ 'payment.status': 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
