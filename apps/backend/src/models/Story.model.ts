import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
    userId: mongoose.Types.ObjectId;
    userName: string;
    userProfileImage?: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    duration?: number; // For videos, in seconds
    thumbnailUrl?: string;
    views: number;
    viewedBy: mongoose.Types.ObjectId[];
    isActive: boolean;
    createdAt: Date;
    expiresAt: Date;
}

const StorySchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    userName: {
        type: String,
        required: true
    },
    userProfileImage: {
        type: String
    },
    mediaUrl: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        required: true
    },
    duration: {
        type: Number
    },
    thumbnailUrl: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    viewedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    }
}, {
    timestamps: true
});

// Index for finding active stories
StorySchema.index({ isActive: 1, expiresAt: 1 });

// Auto-expire stories after 24 hours (TTL index)
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IStory>('Story', StorySchema);
