import mongoose, { Schema, Document } from 'mongoose';

export type ServiceStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface IService extends Document {
    name: string;
    slug: string;
    providerId: mongoose.Types.ObjectId; // User or Business ID

    // Link to Schema Definition
    serviceTypeId: mongoose.Types.ObjectId;
    serviceTypeCode: string;
    serviceTypeVersion: number;

    // Dynamic Data
    data: Record<string, any>;

    // Standard Fields
    price: number;
    currency: string;
    images: string[];
    description?: string;

    // Discovery & Status
    status: ServiceStatus;
    location?: {
        type: string;
        coordinates: number[]; // [lng, lat]
        address?: string;
    };
    rating: number;
    reviewCount: number;

    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        providerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        serviceTypeId: {
            type: Schema.Types.ObjectId,
            ref: 'ServiceType',
            required: true
        },
        serviceTypeCode: {
            type: String,
            required: true
        },
        serviceTypeVersion: {
            type: Number,
            required: true
        },
        data: {
            type: Schema.Types.Mixed,
            default: {}
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            default: 'USD'
        },
        images: [String],
        description: String,
        status: {
            type: String,
            enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'],
            default: 'DRAFT'
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            },
            address: String
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        reviewCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Indexes
serviceSchema.index({ slug: 1 });
serviceSchema.index({ providerId: 1 });
serviceSchema.index({ serviceTypeCode: 1, status: 1 });
serviceSchema.index({ location: '2dsphere' });
serviceSchema.index({ price: 1 });
serviceSchema.index({ rating: -1 });

export const Service = mongoose.model<IService>('Service', serviceSchema);
