import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, trim: true, required: true },
    phone: { type: String, trim: true, required: true },
    addressLine1: { type: String, trim: true, required: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    pincode: { type: String, trim: true, required: true },
    country: { type: String, trim: true, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Ensure at most one default address per user using a partial unique index
addressSchema.index(
  { userId: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);

export const Address = mongoose.model<IAddress>('Address', addressSchema);
