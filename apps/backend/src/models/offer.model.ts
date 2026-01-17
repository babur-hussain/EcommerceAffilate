import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
    type: 'STEAL_DEAL';
    productId: mongoose.Types.ObjectId;
    businessId: mongoose.Types.ObjectId;
    minSpendAmount: number;
    dealPrice: number;
    title: string;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    endDate: Date;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const offerSchema = new Schema<IOffer>(
    {
        type: {
            type: String,
            enum: ['STEAL_DEAL'],
            default: 'STEAL_DEAL',
            required: true
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'Business',
            required: true
        },
        minSpendAmount: {
            type: Number,
            required: true,
            min: 0
        },
        dealPrice: {
            type: Number,
            required: true,
            min: 0
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        endDate: {
            type: Date,
            required: true
        },
        order: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

offerSchema.index({ isActive: 1, type: 1, startDate: 1, endDate: 1 });
offerSchema.index({ order: 1 });
offerSchema.index({ businessId: 1 });

export const Offer = mongoose.model<IOffer>('Offer', offerSchema);
