import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceCategory extends Document {
    name: string;
    slug: string;
    icon: string;
    description: string;
    isActive: boolean;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}

const serviceCategorySchema = new Schema<IServiceCategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        icon: {
            type: String,
            default: '',
        },
        description: {
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

serviceCategorySchema.index({ slug: 1 }, { unique: true });
serviceCategorySchema.index({ isActive: 1 });
serviceCategorySchema.index({ priority: 1 });

export const ServiceCategory = mongoose.model<IServiceCategory>('ServiceCategory', serviceCategorySchema);
