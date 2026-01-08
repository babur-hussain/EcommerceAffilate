import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  productIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    productIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ userId: 1 }, { unique: true });
wishlistSchema.index({ productIds: 1 });

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
