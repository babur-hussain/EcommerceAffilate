import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  businessId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

brandSchema.index({ name: 1, businessId: 1 }, { unique: true });
brandSchema.index({ isActive: 1 });

export const Brand = mongoose.model<IBrand>('Brand', brandSchema);
