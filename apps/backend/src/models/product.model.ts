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

// Product Variant Schema
const VariantSchema = new Schema({
  sku: { type: String, required: true },
  attributes: { type: Map, of: String }, // e.g., { "color": "Red", "size": "M" }
  price: { type: Number, required: true },
  mrp: { type: Number },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { _id: false });

export interface IProduct extends Document {
  title: string;
  slug: string;
  productType: 'Physical' | 'Digital' | 'Service'; // Added
  foodType?: 'Veg' | 'Non-Veg' | 'Egg' | 'Vegan'; // Added for Grocery
  description?: string;
  shortDescription?: string;
  price: number;
  mrp?: number;
  category: string;
  brand?: string;
  image: string;          // Keep for backward compatibility
  images: string[];       // New array field

  // Variants
  variantConfig?: string[]; // e.g. ["color", "size"]
  variants?: {
    sku: string;
    attributes: Map<string, string>;
    price: number;
    mrp?: number;
    stock: number;
    images: string[];
    isActive: boolean;
  }[];

  // Filterable Attributes (Key-Value map for easy filtering)
  filterableAttributes?: Map<string, any>; // e.g. { "brand": "Nike", "material": "Cotton" }

  rating: number;
  ratingCount: number;
  views: number;
  clicks: number;
  brandId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalNote?: string;
  isSponsored: boolean;
  sponsoredScore: number;    // Admin-controlled ranking weight
  popularityScore: number;   // System-calculated (sales/views)
  stock: number;
  lowStockThreshold: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
  protectPromiseFee?: number;
  shippingCharges?: number;
  isCodAvailable?: boolean;
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

  // Deprecated - kept for backward compatibility if needed, but filterableAttributes is preferred
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
  lastChanceOffers?: {
    title: string;
    description?: string;
    originalPrice: number;
    offerPrice: number;
    discountPercentage?: number;
    tag?: string;
    features?: string[];
    image?: string;
  }[];
  fees?: {
    name: string;
    amount: number;
  }[];
  platformCommission?: number; // Percentage
  influencerCommission?: number; // Percentage (part of platform commission)
  weight?: number;
  dimensions?: {
    length: number;
    breadth: number;
    height: number;
  };
  // --- New Grocery Fields ---
  hsnCode?: string;
  gstRate?: number;
  countryOfOrigin?: string;
  manufacturer?: {
    name: string;
    address: string;
  };
  importer?: {
    name: string;
  };
  customerCare?: string;

  // Inventory Extended
  barcode?: string;
  inventoryType?: 'Seller' | 'Platform';
  maxOrderQty?: number;
  minOrderQty?: number; // Override base?
  restockLeadTime?: number;
  warehouseLocation?: string;

  // Packaging
  packSize?: number;
  packUnit?: string;
  totalWeight?: number;
  netQuantity?: string;
  unitsInPack?: number;
  isLoose?: boolean;
  packagingType?: string;

  // Shelf Life & Storage
  shelfLife?: {
    value: number;
    unit: 'Days' | 'Months' | 'Years';
  };
  manufacturingDate?: Date;
  expiryDate?: Date;
  bestBefore?: Date;
  storageInstructions?: string;
  temperatureRequirement?: string; // e.g. "Refrigerated (0-4°C)"
  isPerishable?: boolean;
  isColdChain?: boolean; // delivery req

  // Food Safety
  fssaiLicense?: string;
  fssaiLogo?: string;
  allergens?: string[];
  preservatives?: boolean;
  artificialColors?: boolean;
  isOrganic?: boolean;
  certifications?: string[]; // e.g. ["FSSAI", "USDA"]
  certificateImage?: string;

  // Nutrition
  nutrition?: {
    servingSize: string;
    servingsPerPack: number;
    energy?: number;
    protein?: number;
    carbohydrates?: number;
    sugars?: number;
    fat?: number; // Total Fat
    saturatedFat?: number;
    transFat?: number;
    cholesterol?: number;
    sodium?: number;
    fiber?: number;
    vitamins?: Map<string, string>; // e.g. "Vitamin C": "10mg"
  };

  // Ingredients
  ingredientList?: string; // Full text list
  keyIngredients?: string[];
  additives?: string;
  isGMO?: boolean;

  // Logistics Extended
  volumetricWeight?: number;
  isFragile?: boolean;
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
    productType: {
      type: String,
      enum: ['Physical', 'Digital', 'Service'],
      default: 'Physical'
    },
    foodType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Egg', 'Vegan'],
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
      default: false, // Products start inactive until approved
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvalNote: {
      type: String,
      trim: true,
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
      default: 0,
      min: 0,
    },
    shippingCharges: {
      type: Number,
      default: 0,
      min: 0
    },
    isCodAvailable: {
      type: Boolean,
      default: true
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
    lastChanceOffers: [{
      title: { type: String, required: true },
      description: { type: String },
      originalPrice: { type: Number, required: true },
      offerPrice: { type: Number, required: true },
      discountPercentage: { type: Number },
      tag: { type: String },
      features: [{ type: String }],
      image: { type: String }
    }],
    fees: [{
      name: { type: String, required: true },
      amount: { type: Number, required: true, default: 0 }
    }],
    platformCommission: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    influencerCommission: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
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

    // Variants
    variantConfig: [{ type: String }],
    variants: [VariantSchema],

    // Filterable Attributes
    filterableAttributes: {
      type: Map,
      of: Schema.Types.Mixed
    },

    attributes: [{
      attributeId: {
        type: Schema.Types.ObjectId,
        ref: 'Attribute',
        //        required: true // Making optional to support new system
      },
      value: {
        type: Schema.Types.Mixed, // Can be string, number, boolean, or array
        //        required: true
      }
    }],
    weight: {
      type: Number,
      default: 0.5 // Default 500g
    },
    dimensions: {
      length: { type: Number, default: 10 },
      breadth: { type: Number, default: 10 },
      height: { type: Number, default: 10 }
    },
    trustBadges: [{ type: String }],

    // --- Grocery Fields Schema ---
    hsnCode: { type: String, trim: true },
    gstRate: { type: Number, default: 0 },
    countryOfOrigin: { type: String, trim: true },
    manufacturer: {
      name: String,
      address: String
    },
    importer: {
      name: String
    },
    customerCare: { type: String },

    barcode: { type: String, trim: true },
    inventoryType: { type: String, enum: ['Seller', 'Platform'], default: 'Seller' },
    maxOrderQty: { type: Number },
    minOrderQty: { type: Number, default: 1 },
    restockLeadTime: { type: Number },
    warehouseLocation: { type: String },

    packSize: { type: Number },
    packUnit: { type: String }, // g, kg, ml, L, pcs
    totalWeight: { type: Number }, // Gross
    netQuantity: { type: String },
    unitsInPack: { type: Number },
    isLoose: { type: Boolean, default: false },
    packagingType: { type: String },

    shelfLife: {
      value: Number,
      unit: { type: String, enum: ['Days', 'Months', 'Years'] }
    },
    manufacturingDate: Date,
    expiryDate: Date,
    bestBefore: Date,
    storageInstructions: String,
    temperatureRequirement: String,
    isPerishable: { type: Boolean, default: false },
    isColdChain: { type: Boolean, default: false },

    fssaiLicense: String,
    fssaiLogo: String,
    allergens: [String],
    preservatives: { type: Boolean, default: false },
    artificialColors: { type: Boolean, default: false },
    isOrganic: { type: Boolean, default: false },
    certifications: [String],
    certificateImage: String,

    nutrition: {
      servingSize: String,
      servingsPerPack: Number,
      energy: Number,
      protein: Number,
      carbohydrates: Number,
      sugars: Number,
      fat: Number,
      saturatedFat: Number,
      transFat: Number,
      cholesterol: Number,
      sodium: Number,
      fiber: Number,
      vitamins: { type: Map, of: String }
    },

    ingredientList: String,
    keyIngredients: [String],
    additives: String,
    isGMO: { type: Boolean, default: false },

    volumetricWeight: Number,
    isFragile: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save hook to auto-generate slug if not provided
productSchema.pre('save', function (this: IProduct, next) {
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
productSchema.pre('validate', function (this: IProduct, next) {
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
