import mongoose, { Schema, Document } from 'mongoose';

export interface IPageSection {
    id: string;
    type: string;
    title?: string;
    subtitle?: string;
    adminLabel?: string;
    priority: number;
    content: any; // Flexible payload depending on type
    style?: {
        backgroundColor?: string;
        paddingRemote?: number;
    };
}

export interface IPageLayout extends Document {
    pageSlug: string; // 'home', 'category', 'profile', etc.
    name: string;
    description?: string;
    isActive: boolean;
    sections: IPageSection[];
    createdAt: Date;
    updatedAt: Date;
}

const pageSectionSchema = new Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String },
    subtitle: { type: String },
    adminLabel: { type: String },
    priority: { type: Number, default: 0 },
    content: { type: Schema.Types.Mixed, default: {} },
    style: {
        backgroundColor: { type: String },
        paddingRemote: { type: Number }
    }
});

const pageLayoutSchema = new Schema<IPageLayout>(
    {
        pageSlug: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        description: { type: String },
        isActive: { type: Boolean, default: true },
        sections: [pageSectionSchema]
    },
    {
        timestamps: true
    }
);

export const PageLayout = mongoose.model<IPageLayout>('PageLayout', pageLayoutSchema);
