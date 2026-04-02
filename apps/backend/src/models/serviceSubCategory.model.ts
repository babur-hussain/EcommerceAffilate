import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceSubCategory extends Document {
    categoryId: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description: string;
    icon: string;
    isActive: boolean;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}

const serviceSubCategorySchema = new Schema<IServiceSubCategory>(
    {
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'ServiceCategory',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        priority: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

serviceSubCategorySchema.index({ categoryId: 1 });
serviceSubCategorySchema.index({ slug: 1, categoryId: 1 }, { unique: true });
serviceSubCategorySchema.index({ isActive: 1 });
serviceSubCategorySchema.index({ priority: 1 });

export const ServiceSubCategory = mongoose.model<IServiceSubCategory>('ServiceSubCategory', serviceSubCategorySchema);
