import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
    name: string;
    description?: string;
    permissions: string[]; // e.g. ['services.create', 'services.edit']
    isSystem: boolean; // System roles cannot be deleted
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        permissions: [{
            type: String,
            trim: true
        }],
        isSystem: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

roleSchema.index({ name: 1 }, { unique: true });

export const Role = mongoose.model<IRole>('Role', roleSchema);
