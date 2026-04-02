import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceType extends Document {
    categoryId: mongoose.Types.ObjectId;
    subCategoryId?: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description: string;
    icon: string;
    isActive: boolean;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}

const serviceTypeSchema = new Schema<IServiceType>(
    {
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'ServiceCategory',
            required: true,
        },
        subCategoryId: {
            type: Schema.Types.ObjectId,
            ref: 'ServiceSubCategory',
            default: null,
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

serviceTypeSchema.index({ categoryId: 1 });
serviceTypeSchema.index({ subCategoryId: 1 });
serviceTypeSchema.index({ slug: 1, categoryId: 1 }, { unique: true });
serviceTypeSchema.index({ isActive: 1 });
serviceTypeSchema.index({ priority: 1 });

export const ServiceType = mongoose.model<IServiceType>('ServiceType', serviceTypeSchema);
