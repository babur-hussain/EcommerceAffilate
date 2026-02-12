import mongoose, { Schema, Document } from 'mongoose';

export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'HOLD';

export interface ISlot {
    startTime: string; // HH:mm format (24h)
    endTime: string;   // HH:mm format (24h)
    status: SlotStatus;
    orderId?: mongoose.Types.ObjectId; // If booked
}

export interface IAvailability extends Document {
    providerId: mongoose.Types.ObjectId;
    date: Date; // Midnight UTC
    slots: ISlot[];
    createdAt: Date;
    updatedAt: Date;
}

const slotSchema = new Schema<ISlot>({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BOOKED', 'BLOCKED', 'HOLD'],
        default: 'AVAILABLE'
    },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' }
});

const availabilitySchema = new Schema<IAvailability>(
    {
        providerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        slots: [slotSchema]
    },
    {
        timestamps: true
    }
);

// Ensure one document per provider per day
availabilitySchema.index({ providerId: 1, date: 1 }, { unique: true });
// Index for range queries
availabilitySchema.index({ providerId: 1, date: 1 });

export const Availability = mongoose.model<IAvailability>('Availability', availabilitySchema);
