import mongoose, { Schema, Document } from 'mongoose';

export interface IDeliveryRule extends Document {
    name: string;
    minDistance: number; // in km
    maxDistance: number; // in km
    timeValue: number;
    timeUnit: 'hours' | 'days';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const deliveryRuleSchema = new Schema<IDeliveryRule>(
    {
        name: { type: String, required: true, trim: true },
        minDistance: { type: Number, required: true, min: 0 },
        maxDistance: { type: Number, required: true, min: 0 },
        timeValue: { type: Number, required: true, min: 0 },
        timeUnit: { type: String, enum: ['hours', 'days'], required: true, default: 'days' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Prevent overlapping ranges could be handled here or in service logic.
// Simple index for querying active rules
deliveryRuleSchema.index({ isActive: 1 });
deliveryRuleSchema.index({ minDistance: 1 });

export const DeliveryRule = mongoose.model<IDeliveryRule>('DeliveryRule', deliveryRuleSchema);
