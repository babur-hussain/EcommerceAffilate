import mongoose, { Schema, Document } from 'mongoose';

export interface IAttribute extends Document {
    code: string;
    name: string;
    type: 'checkbox' | 'radio' | 'range' | 'boolean';
    isFilterable: boolean;
    isVariant: boolean;
    values: string[];
    createdAt: Date;
    updatedAt: Date;
}

const attributeSchema = new Schema<IAttribute>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['checkbox', 'radio', 'range', 'boolean'],
            default: 'checkbox',
        },
        isFilterable: {
            type: Boolean,
            default: true,
        },
        isVariant: {
            type: Boolean,
            default: false,
        },
        values: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IAttribute>('Attribute', attributeSchema);
