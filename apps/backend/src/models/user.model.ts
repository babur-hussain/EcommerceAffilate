import mongoose, { Schema, Document } from 'mongoose';

export type UserRole =
  | 'ADMIN'
  | 'BUSINESS_OWNER'
  | 'BUSINESS_MANAGER'
  | 'BUSINESS_STAFF'
  | 'INFLUENCER'
  | 'CUSTOMER';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  firebaseUid?: string;
  role: UserRole;
  businessId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
    },
    firebaseUid: {
      type: String,
      sparse: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'BUSINESS_OWNER', 'BUSINESS_MANAGER', 'BUSINESS_STAFF', 'INFLUENCER', 'CUSTOMER'],
      default: 'CUSTOMER',
      required: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ firebaseUid: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ businessId: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
