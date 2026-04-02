import mongoose, { Schema, Document } from 'mongoose';

export type ProviderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type PricingModel = 'FIXED' | 'HOURLY' | 'NEGOTIABLE';

export interface IServiceProvider extends Document {
    userId: mongoose.Types.ObjectId;
    serviceCategoryId: mongoose.Types.ObjectId;
    serviceSubCategoryId: mongoose.Types.ObjectId;
    businessName: string;
    description: string;
    experienceYears: number;
    rating: number;
    reviewCount: number;
    location: {
        type: string;
        coordinates: number[];
        address?: string;
    };
    serviceArea: string[];
    pricingModel: PricingModel;
    startingPrice: number;
    currency: string;
    availability: {
        monday?: { start: string; end: string };
        tuesday?: { start: string; end: string };
        wednesday?: { start: string; end: string };
        thursday?: { start: string; end: string };
        friday?: { start: string; end: string };
        saturday?: { start: string; end: string };
        sunday?: { start: string; end: string };
    };
    images: string[];
    isVerified: boolean;
    status: ProviderStatus;
    createdAt: Date;
    updatedAt: Date;
}

const serviceProviderSchema = new Schema<IServiceProvider>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        serviceCategoryId: {
            type: Schema.Types.ObjectId,
            ref: 'ServiceCategory',
            required: true,
        },
        serviceSubCategoryId: {
            type: Schema.Types.ObjectId,
            ref: 'ServiceSubCategory',
            required: true,
        },
        businessName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        experienceYears: {
            type: Number,
            default: 0,
            min: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                default: [0, 0],
            },
            address: String,
        },
        serviceArea: {
            type: [String],
            default: [],
        },
        pricingModel: {
            type: String,
            enum: ['FIXED', 'HOURLY', 'NEGOTIABLE'],
            default: 'FIXED',
        },
        startingPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        availability: {
            monday: { start: String, end: String },
            tuesday: { start: String, end: String },
            wednesday: { start: String, end: String },
            thursday: { start: String, end: String },
            friday: { start: String, end: String },
            saturday: { start: String, end: String },
            sunday: { start: String, end: String },
        },
        images: {
            type: [String],
            default: [],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
            default: 'PENDING',
        },
    },
    {
        timestamps: true,
    }
);

serviceProviderSchema.index({ userId: 1 });
serviceProviderSchema.index({ serviceCategoryId: 1 });
serviceProviderSchema.index({ serviceSubCategoryId: 1 });
serviceProviderSchema.index({ status: 1 });
serviceProviderSchema.index({ location: '2dsphere' });
serviceProviderSchema.index({ rating: -1 });
serviceProviderSchema.index({ startingPrice: 1 });
serviceProviderSchema.index({ isVerified: 1, status: 1 });

export const ServiceProvider = mongoose.model<IServiceProvider>('ServiceProvider', serviceProviderSchema);
