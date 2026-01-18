import mongoose, { Schema, Document } from "mongoose";

export type UserRole =
  | "ADMIN"
  | "SUPER_ADMIN"
  | "BUSINESS_OWNER"
  | "BUSINESS_MANAGER"
  | "BUSINESS_STAFF"
  | "SELLER_OWNER"
  | "SELLER_MANAGER"
  | "SELLER_STAFF"
  | "INFLUENCER"
  | "DELIVERY_PARTNER"
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
  coins?: number;
  membershipStatus?: string;
  isActive: boolean;
  isOnline?: boolean;
  location?: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  fcmToken?: string;
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
        "SUPER_ADMIN",
        "BUSINESS_OWNER",
        "BUSINESS_MANAGER",
        "BUSINESS_STAFF",
        "SELLER_OWNER",
        "SELLER_MANAGER",
        "SELLER_STAFF",
        "INFLUENCER",
        "DELIVERY_PARTNER",
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
    coins: {
      type: Number,
      default: 0,
      min: 0
    },
    membershipStatus: {
      type: String,
      default: 'Classic',
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
      index: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    fcmToken: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.index({ uid: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ firebaseUid: 1 }, { unique: true, sparse: true });
userSchema.index({ referralCode: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ businessId: 1 });
userSchema.index({ location: '2dsphere' });

export const User = mongoose.model<IUser>("User", userSchema);
