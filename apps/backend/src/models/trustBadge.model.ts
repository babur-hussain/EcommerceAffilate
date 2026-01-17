import mongoose, { Schema, Document } from 'mongoose';

export interface ITrustBadge extends Document {
    id: string;
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const trustBadgeSchema = new Schema<ITrustBadge>(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String, default: '' },
        icon: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

trustBadgeSchema.index({ id: 1 });
trustBadgeSchema.index({ isActive: 1 });

export const TrustBadge = mongoose.model<ITrustBadge>('TrustBadge', trustBadgeSchema);
