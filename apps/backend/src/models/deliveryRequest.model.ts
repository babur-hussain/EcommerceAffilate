import mongoose, { Schema, Document } from 'mongoose';

export interface IDeliveryRequest extends Document {
    orderId: mongoose.Types.ObjectId;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    currentAssignedPartnerId?: mongoose.Types.ObjectId;
    assignmentStartTime?: Date;
    participatingPartners: mongoose.Types.ObjectId[]; // List of partners considered for this order
    rejectedPartners: mongoose.Types.ObjectId[]; // List of partners who rejected or timed out
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const deliveryRequestSchema = new Schema<IDeliveryRequest>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
            default: 'PENDING',
            index: true,
        },
        currentAssignedPartnerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        assignmentStartTime: {
            type: Date,
        },
        participatingPartners: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        rejectedPartners: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        expiresAt: {
            type: Date,
            required: true,
            index: true, // For clean up
        },
    },
    {
        timestamps: true,
    }
);

export const DeliveryRequest = mongoose.model<IDeliveryRequest>('DeliveryRequest', deliveryRequestSchema);
