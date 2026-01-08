import mongoose, { Schema, Document } from 'mongoose';

export type HomepageSectionType =
  | 'HERO_BANNER'
  | 'PRODUCT_CAROUSEL'
  | 'CATEGORY_GRID'
  | 'SPONSORED_CAROUSEL'
  | 'TEXT_BANNER';

export interface IHomepageSection extends Document {
  type: HomepageSectionType;
  enabled: boolean;
  order: number;
  title?: string;
  subtitle?: string;
  // Section-specific rules/config
  config: Record<string, any>;
}

export interface IHomepageConfig extends Document {
  isPublished: boolean;
  draftVersion: number;
  publishedVersion: number;
  sections: IHomepageSection[];
  updatedAt: Date;
  createdAt: Date;
}

const sectionSchema = new Schema<IHomepageSection>(
  {
    type: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, required: true, index: true },
    title: { type: String },
    subtitle: { type: String },
    config: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true }
);

const homepageConfigSchema = new Schema<IHomepageConfig>(
  {
    isPublished: { type: Boolean, default: false },
    draftVersion: { type: Number, default: 1 },
    publishedVersion: { type: Number, default: 0 },
    sections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true }
);

export const HomepageConfig = mongoose.model<IHomepageConfig>('HomepageConfig', homepageConfigSchema);
