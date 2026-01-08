import mongoose, { Schema, Document } from 'mongoose';

export interface ISponsorship extends Document {
  productId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  budget: number;
  dailyBudget: number;
  initialBudget: number;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'PAUSED' | 'REJECTED';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sponsorshipSchema = new Schema<ISponsorship>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      index: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (this: ISponsorship, value: Date) {
          return value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0.01, 'Budget must be greater than 0'],
    },
    initialBudget: {
      type: Number,
      min: [0, 'Initial budget must be non-negative'],
      default: function (this: ISponsorship) {
        return this.budget;
      },
    },
    dailyBudget: {
      type: Number,
      required: [true, 'Daily budget is required'],
      min: [0.01, 'Daily budget must be greater than 0'],
      validate: {
        validator: function (this: ISponsorship, value: number) {
          return value <= this.budget;
        },
        message: 'Daily budget cannot exceed total budget',
      },
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'ACTIVE', 'PAUSED', 'REJECTED'],
      default: 'PENDING',
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

// Indexes for efficient sponsorship lookups
sponsorshipSchema.index({ productId: 1 });
sponsorshipSchema.index({ businessId: 1 });
sponsorshipSchema.index({ isActive: 1 });
sponsorshipSchema.index({ status: 1 });
sponsorshipSchema.index({ startDate: 1, endDate: 1 });
sponsorshipSchema.index({ budget: 1 });

export const Sponsorship = mongoose.model<ISponsorship>('Sponsorship', sponsorshipSchema);
