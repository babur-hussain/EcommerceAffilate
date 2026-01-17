import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  posters?: string[];
  parentCategory?: mongoose.Types.ObjectId;
  attributes: {
    attributeId: mongoose.Types.ObjectId;
    position: number;
    isRequired: boolean;
  }[];
  group?: string;
  subCategoryGroupOrder?: string[]; // Groups ordering for subcategories (only relevant for Parent Categories)
  isActive: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
