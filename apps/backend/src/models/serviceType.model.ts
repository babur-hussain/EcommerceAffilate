import mongoose, { Schema, Document } from 'mongoose';

export type ServiceTypeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface IServiceField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'dropdown' | 'multiselect' | 'boolean' | 'date' | 'file' | 'image';
    required: boolean;
    options?: { label: string; value: string }[]; // For dropdown/multiselect
    validation?: {
        min?: number;
        max?: number;
        regex?: string;
    };
    defaultValue?: any;
    placeholder?: string;
    order: number;
    visibility?: {
        admin: boolean;
        customer: boolean;
    };
}

export interface IServiceType extends Document {
    name: string;
    code: string; // e.g. DOCTOR, ELECTRICIAN
    countryCode: string; // ISO code or 'ALL'
    version: number;
    status: ServiceTypeStatus;
    fields: IServiceField[];
    description?: string;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
}

const serviceFieldSchema = new Schema({
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['text', 'number', 'textarea', 'dropdown', 'multiselect', 'boolean', 'date', 'file', 'image']
    },
    required: { type: Boolean, default: false },
    options: [{
        label: String,
        value: String
    }],
    validation: {
        min: Number,
        max: Number,
        regex: String
    },
    defaultValue: Schema.Types.Mixed,
    placeholder: String,
    order: { type: Number, default: 0 },
    visibility: {
        admin: { type: Boolean, default: true },
        customer: { type: Boolean, default: true }
    }
}, { _id: false });

const serviceTypeSchema = new Schema<IServiceType>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },
        countryCode: {
            type: String,
            required: true,
            uppercase: true,
            default: 'ALL'
        },
        version: {
            type: Number,
            required: true,
            default: 1
        },
        status: {
            type: String,
            enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
            default: 'DRAFT'
        },
        fields: [serviceFieldSchema],
        description: String,
        icon: String,
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique version per code+country
serviceTypeSchema.index({ code: 1, countryCode: 1, version: 1 }, { unique: true });

// Index for fetching latest published
serviceTypeSchema.index({ code: 1, countryCode: 1, status: 1 });

export const ServiceType = mongoose.model<IServiceType>('ServiceType', serviceTypeSchema);
