import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvancedComponent {
    id: string;
    type: string; // 'Container', 'Text', 'Image', 'ProductGrid', etc.
    name?: string; // For admin UI readability
    props: Record<string, any>; // Content props: text, imageUrl, etc.
    style?: Record<string, any>; // style props: backgroundColor, padding, etc.
    dataSource?: {
        type: 'STATIC' | 'DYNAMIC';
        query?: Record<string, any>; // { category: 'electronics', limit: 10 }
        data?: any; // Static data if type is STATIC
    };
    children?: IAdvancedComponent[]; // For nested structures like Containers
}

export interface IAdvancedLayout extends Document {
    slug: string;
    name: string;
    description?: string;
    isActive: boolean;
    components: IAdvancedComponent[];
    meta?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

const advancedComponentSchema = new Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String },
    props: { type: Schema.Types.Mixed, default: {} },
    style: { type: Schema.Types.Mixed, default: {} },
    dataSource: {
        type: { type: String, enum: ['STATIC', 'DYNAMIC'], default: 'STATIC' },
        query: { type: Schema.Types.Mixed },
        data: { type: Schema.Types.Mixed }
    },
    // Recursive definition for children handled by Mongoose via 'add' if strictly needed,
    // but often Mixed is easier for arbitrary nesting depth in SDUI. 
    // Let's use Mixed for children array to avoid complex recursive schema issues initially.
    children: { type: [Schema.Types.Mixed], default: [] }
});

const advancedLayoutSchema = new Schema<IAdvancedLayout>(
    {
        slug: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        description: { type: String },
        isActive: { type: Boolean, default: true },
        components: [advancedComponentSchema],
        meta: {
            title: String,
            description: String,
            keywords: [String]
        },
        version: { type: Number, default: 1 }
    },
    {
        timestamps: true
    }
);

export const AdvancedLayout = mongoose.model<IAdvancedLayout>('AdvancedLayout', advancedLayoutSchema);
