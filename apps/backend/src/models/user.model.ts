import mongoose, { Schema, Document } from "mongoose";

export type UserRole =
  | "ADMIN"
  | "BUSINESS_OWNER"
  | "BUSINESS_MANAGER"
  | "BUSINESS_STAFF"
  | "SELLER_OWNER"
  | "INFLUENCER"
  | "CUSTOMER";

export interface IUser extends Document {
  uid: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  passwordHash?: string;
  firebaseUid?: string;
  role: UserRole;
  businessId?: mongoose.Types.ObjectId;
  referralCode?: string;
  socialMedia?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
  };
  followers?: {
    instagram?: number;
    youtube?: number;
    twitter?: number;
    facebook?: number;
    tiktok?: number;
  };
  bio?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
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
      enum: [
        "ADMIN",
        "BUSINESS_OWNER",
        "BUSINESS_MANAGER",
        "BUSINESS_STAFF",
        "SELLER_OWNER",
        "INFLUENCER",
        "CUSTOMER",
      ],
      default: "CUSTOMER",
      required: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
    },
    referralCode: {
      type: String,
      trim: true,
      sparse: true,
      uppercase: true,
    },
    socialMedia: {
      instagram: String,
      youtube: String,
      twitter: String,
      facebook: String,
      tiktok: String,
    },
    followers: {
      instagram: Number,
      youtube: Number,
      twitter: Number,
      facebook: Number,
      tiktok: Number,
    },
    bio: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
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

userSchema.index({ uid: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ firebaseUid: 1 }, { unique: true, sparse: true });
userSchema.index({ referralCode: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ businessId: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
