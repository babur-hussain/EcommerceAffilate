import mongoose, { Schema, Document } from 'mongoose';

export interface IReturnItem {
    productId: mongoose.Types.ObjectId;
    productTitle: string;
    productImage?: string;
    quantity: number;
    price: number;
    reason: 'DEFECTIVE' | 'WRONG_ITEM' | 'NOT_AS_DESCRIBED' | 'SIZE_FIT' | 'DAMAGED' | 'CHANGED_MIND' | 'OTHER';
    condition: 'UNOPENED' | 'OPENED' | 'USED' | 'DAMAGED';
}

export interface IReturnTimeline {
    status: string;
    timestamp: Date;
    note?: string;
    updatedBy?: mongoose.Types.ObjectId;
}

export interface IReturnRequest extends Document {
    returnRequestNumber: string;
    orderId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    businessId: mongoose.Types.ObjectId;
    items: IReturnItem[];
    status:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'PICKUP_SCHEDULED'
    | 'PICKED_UP'
    | 'RECEIVED'
    | 'REFUND_INITIATED'
    | 'REFUND_COMPLETED'
    | 'CANCELLED';
    customerNote?: string;
    sellerNote?: string;
    adminNote?: string;
    rejectionReason?: string;
    images: string[];
    refundAmount: number;
    refundMethod?: 'ORIGINAL_PAYMENT' | 'WALLET' | 'BANK_TRANSFER';
    refundStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    refundTransactionId?: string;
    pickupDetails?: {
        scheduledDate?: Date;
        completedDate?: Date;
        awbCode?: string;
        courierName?: string;
        pickupAddress?: string;
    };
    timeline: IReturnTimeline[];
    createdAt: Date;
    updatedAt: Date;
}

const returnItemSchema = new Schema<IReturnItem>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        productTitle: {
            type: String,
            required: true,
        },
        productImage: {
            type: String,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        reason: {
            type: String,
            enum: ['DEFECTIVE', 'WRONG_ITEM', 'NOT_AS_DESCRIBED', 'SIZE_FIT', 'DAMAGED', 'CHANGED_MIND', 'OTHER'],
            required: true,
        },
        condition: {
            type: String,
            enum: ['UNOPENED', 'OPENED', 'USED', 'DAMAGED'],
            required: true,
        },
    },
    { _id: false }
);

const returnTimelineSchema = new Schema<IReturnTimeline>(
    {
        status: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        note: {
            type: String,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { _id: false }
);

const returnRequestSchema = new Schema<IReturnRequest>(
    {
        returnRequestNumber: {
            type: String,
            required: true,
            unique: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
            index: true,
        },
        items: {
            type: [returnItemSchema],
            required: true,
            validate: {
                validator: (items: IReturnItem[]) => Array.isArray(items) && items.length > 0,
                message: 'Return request must have at least one item',
            },
        },
        status: {
            type: String,
            enum: [
                'PENDING',
                'APPROVED',
                'REJECTED',
                'PICKUP_SCHEDULED',
                'PICKED_UP',
                'RECEIVED',
                'REFUND_INITIATED',
                'REFUND_COMPLETED',
                'CANCELLED',
            ],
            default: 'PENDING',
            index: true,
        },
        customerNote: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        sellerNote: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        adminNote: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        rejectionReason: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        images: {
            type: [String],
            default: [],
        },
        refundAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        refundMethod: {
            type: String,
            enum: ['ORIGINAL_PAYMENT', 'WALLET', 'BANK_TRANSFER'],
        },
        refundStatus: {
            type: String,
            enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
        },
        refundTransactionId: {
            type: String,
        },
        pickupDetails: {
            scheduledDate: { type: Date },
            completedDate: { type: Date },
            awbCode: { type: String },
            courierName: { type: String },
            pickupAddress: { type: String },
        },
        timeline: {
            type: [returnTimelineSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Generate unique return request number
returnRequestSchema.pre('save', async function (next) {
    if (this.isNew && !this.returnRequestNumber) {
        const date = new Date();
        const prefix = `RET${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
        const count = await ReturnRequest.countDocuments({
            returnRequestNumber: { $regex: `^${prefix}` },
        });
        this.returnRequestNumber = `${prefix}${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Add initial timeline entry on creation
returnRequestSchema.pre('save', function (next) {
    if (this.isNew && this.timeline.length === 0) {
        this.timeline.push({
            status: 'PENDING',
            timestamp: new Date(),
            note: 'Return request created',
        });
    }
    next();
});

returnRequestSchema.index({ createdAt: -1 });
returnRequestSchema.index({ status: 1, businessId: 1 });

export const ReturnRequest = mongoose.model<IReturnRequest>('ReturnRequest', returnRequestSchema);
