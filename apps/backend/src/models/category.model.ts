import mongoose, { Schema, Document } from 'mongoose';

export interface IFilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'variant' | 'range' | 'text';
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  posters?: string[];
  parentCategory?: mongoose.Types.ObjectId;
  group?: string;
  subCategoryGroupOrder?: string[]; // Groups ordering for subcategories (only relevant for Parent Categories)

  // Dynamic Filter Configuration
  filterConfig?: IFilterConfig[];

  attributes: {
    attributeId: mongoose.Types.ObjectId;
    position: number;
    isRequired: boolean;
  }[];

  isActive: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Filter Configuration Schema
const FilterConfigSchema = new Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['select', 'multiselect', 'variant', 'range', 'text']
  },
  required: { type: Boolean, default: false },
  options: [{ type: String }], // Predefined options
  min: { type: Number },       // For range
  max: { type: Number },       // For range
  unit: { type: String }       // e.g., "GB", "kg", "cm"
}, { _id: false });

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    icon: {
      type: String,
    },
    posters: {
      type: [String],
      default: [],
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    group: {
      type: String,
      trim: true,
      description: 'Main Title for grouping subcategories (e.g. Staples under Grocery)',
    },
    subCategoryGroupOrder: {
      type: [String], // Array of group names in order
      default: [],
    },

    // Dynamic Filter Configuration
    filterConfig: {
      type: [FilterConfigSchema],
      default: []
    },

    attributes: [{
      attributeId: {
        type: Schema.Types.ObjectId,
        ref: 'Attribute',
      },
      position: {
        type: Number,
        default: 0,
      },
      isRequired: {
        type: Boolean,
        default: false,
      },
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug from name
categorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

export default mongoose.model<ICategory>('Category', categorySchema);
