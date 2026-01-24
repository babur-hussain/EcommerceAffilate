import mongoose, { Schema, Document } from 'mongoose';

export interface IBrowserHistory extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const browserHistorySchema = new Schema<IBrowserHistory>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to quickly look up user's history sorted by time
browserHistorySchema.index({ userId: 1, createdAt: -1 });

export const BrowserHistory = mongoose.model<IBrowserHistory>('BrowserHistory', browserHistorySchema);
