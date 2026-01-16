import mongoose, { Schema, Document } from 'mongoose';

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
};

export interface IProduct extends Document {
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  mrp?: number;
  category: string;
  brand?: string;
  image: string;          // Keep for backward compatibility
  images: string[];       // New array field
  rating: number;
  ratingCount: number;
  views: number;
  clicks: number;
  brandId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  isActive: boolean;
  isSponsored: boolean;
  sponsoredScore: number;    // Admin-controlled ranking weight
  popularityScore: number;   // System-calculated (sales/views)
  stock: number;
  lowStockThreshold: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
  protectPromiseFee?: number;
  processingTime?: {
    value: number;
    unit: 'hours' | 'days';
  };
  primaryImage?: string;
  thumbnailImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  warrantyDetails?: string;
  warrantyDuration?: string;
  pickupLocation?: string;
  pickupLocationCoordinates?: { lat: number; lng: number };
  attributes?: {
    attributeId: mongoose.Types.ObjectId;
    value: any;
  }[];
  trustBadges?: string[];
  offers?: {
    type: string; // 'Bank' | 'Exchange' | 'EMI' | 'Special'
    title: string;
    description: string;
    discountAmount: number;
    code?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than 0'],
    },
    mrp: {
      type: Number,
      min: [0, 'MRP must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSponsored: {
      type: Boolean,
      default: false,
    },
    sponsoredScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    popularityScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    saleStartDate: {
      type: Date,
    },
    saleEndDate: {
      type: Date,
    },
    protectPromiseFee: {
      type: Number,
      min: 0,
    },
    processingTime: {
      value: { type: Number, default: 1 },
      unit: { type: String, enum: ['hours', 'days'], default: 'days' }
    },
    offers: [{
      type: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String },
      discountAmount: { type: Number, required: true, min: 0 },
      code: { type: String }
    }],
    primaryImage: {
      type: String,
      trim: true,
    },
    thumbnailImage: {
      type: String,
      trim: true,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: [String],
      default: [],
    },
    warrantyDetails: {
      type: String,
      trim: true
    },
    warrantyDuration: {
      type: String,
      trim: true
    },
    pickupLocation: {
      type: String,
      trim: true
    },
    pickupLocationCoordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    attributes: [{
      attributeId: {
        type: Schema.Types.ObjectId,
        ref: 'Attribute',
        required: true
      },
      value: {
        type: Schema.Types.Mixed, // Can be string, number, boolean, or array
        required: true
      }
    }],
    trustBadges: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save hook to auto-generate slug if not provided
productSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }

  // Sync images array with single image for backward compatibility
  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }

  next();
});

// Pre-create middleware to auto-generate slug
productSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Indexes for query performance
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ popularityScore: -1 });
productSchema.index({ sponsoredScore: -1 });
productSchema.index({ stock: 1 });
productSchema.index({ title: 'text', category: 'text', brand: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
