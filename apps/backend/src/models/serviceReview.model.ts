import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceReview extends Document {
    serviceProviderId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    customerId: mongoose.Types.ObjectId;
    rating: number;
    review: string;
    createdAt: Date;
    updatedAt: Date;
}

const serviceReviewSchema = new Schema<IServiceReview>(
    {
        serviceProviderId: {
            type: Schema.Types.ObjectId,
            ref: 'ServiceProvider',
            required: true,
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
            default: '',
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

serviceReviewSchema.index({ serviceProviderId: 1 });
serviceReviewSchema.index({ customerId: 1 });
serviceReviewSchema.index({ bookingId: 1 }, { unique: true });

export const ServiceReview = mongoose.model<IServiceReview>('ServiceReview', serviceReviewSchema);
