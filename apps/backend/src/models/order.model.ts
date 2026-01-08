import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  couponCode?: string;
  influencerCode?: string;
  discountAmount: number;
  payableAmount: number;
  totalAmount: number;
  status:
    | 'CREATED'
    | 'PAID'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'RETURN_REQUESTED'
    | 'RETURNED'
    | 'REFUNDED'
    | 'CANCELLED';
  returnReason?: string;
  refundAmount?: number;
  paymentProvider?: 'RAZORPAY' | 'CASHFREE';
  paymentOrderId?: string;
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items: IOrderItem[]) => Array.isArray(items) && items.length > 0,
        message: 'Order must have at least one item',
      },
      required: true,
    },
    shippingAddress: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      addressLine1: { type: String, required: true, trim: true },
      addressLine2: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    couponCode: { type: String, trim: true, uppercase: true },
    influencerCode: { type: String, trim: true, uppercase: true },
    discountAmount: { type: Number, required: true, min: 0, default: 0 },
    payableAmount: { type: Number, required: true, min: 0 },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        'CREATED',
        'PAID',
        'SHIPPED',
        'DELIVERED',
        'RETURN_REQUESTED',
        'RETURNED',
        'REFUNDED',
        'CANCELLED',
      ],
      default: 'CREATED',
      index: true,
    },
    returnReason: {
      type: String,
      trim: true,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    paymentProvider: {
      type: String,
      enum: ['RAZORPAY', 'CASHFREE'],
    },
    paymentOrderId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
