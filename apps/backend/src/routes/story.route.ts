import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Story from '../models/Story.model';
import { User } from '../models/user.model';
import s3Service from '../services/s3.service';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * GET /api/stories/upload-url
 * Get a presigned URL for uploading a story to S3
 */
router.get('/upload-url', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { fileName, contentType } = req.query;

        if (!fileName || !contentType) {
            return res.status(400).json({
                success: false,
                message: 'fileName and contentType are required'
            });
        }

        const userId = (req as any).user.id;
        const presignedData = await s3Service.generatePresignedUploadUrl(
            userId,
            fileName as string,
            contentType as string
        );

        res.json({
            success: true,
            data: presignedData
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate upload URL'
        });
    }
});

/**
 * POST /api/stories
 * Create a new story after successful S3 upload
 */
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { mediaUrl, mediaType, duration, thumbnailUrl } = req.body;
        const userId = (req as any).user.id; // Use .id from middleware

        if (!mediaUrl || !mediaType) {
            return res.status(400).json({
                success: false,
                message: 'mediaUrl and mediaType are required'
            });
        }

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Stories expire after 24 hours
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const story = new Story({
            userId: user._id,
            userName: user.name || 'User',
            userProfileImage: user.profileImage,
            mediaUrl,
            mediaType,
            duration,
            thumbnailUrl,
            expiresAt
        });

        await story.save();

        res.status(201).json({
            success: true,
            message: 'Story created successfully',
            data: story
        });
    } catch (error) {
        console.error('Error creating story:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create story'
        });
    }
});

/**
 * GET /api/stories
 * Get all active stories (for feed)
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const now = new Date();

        // Get all active stories that haven't expired
        const stories = await Story.find({
            isActive: true,
            expiresAt: { $gt: now }
        })
            .sort({ createdAt: -1 })
            .limit(50);

        // Group stories by user
        const groupedStories: { [key: string]: any } = {};

        stories.forEach(story => {
            const userIdStr = story.userId.toString();
            if (!groupedStories[userIdStr]) {
                groupedStories[userIdStr] = {
                    userId: story.userId,
                    userName: story.userName,
                    userProfileImage: story.userProfileImage,
                    stories: []
                };
            }
            groupedStories[userIdStr].stories.push(story);
        });

        res.json({
            success: true,
            data: Object.values(groupedStories)
        });
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stories'
        });
    }
});

/**
 * GET /api/stories/my
 * Get current user's stories
 */
router.get('/my', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const now = new Date();

        console.log(`Fetching stories for user: ${userId}`);

        const stories = await Story.find({
            userId: new mongoose.Types.ObjectId(userId),
            isActive: true,
            expiresAt: { $gt: now }
        }).sort({ createdAt: -1 });

        console.log(`Found ${stories.length} stories`);

        res.json({
            success: true,
            data: stories
        });
    } catch (error) {
        console.error('Error fetching user stories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stories',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

/**
 * POST /api/stories/:id/view
 * Mark a story as viewed
 */
router.post('/:id/view', authenticateToken, async (req: Request, res: Response) => {
    try {
        const storyId = req.params.id;
        const userId = (req as any).user.id;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        // Add viewer if not already viewed
        if (!story.viewedBy.includes(userId)) {
            story.viewedBy.push(userId);
            story.views += 1;
            await story.save();
        }

        res.json({
            success: true,
            message: 'Story marked as viewed'
        });
    } catch (error) {
        console.error('Error marking story as viewed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark story as viewed'
        });
    }
});

/**
 * DELETE /api/stories/:id
 * Delete a story
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const storyId = req.params.id;
        const userId = (req as any).user.id;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        // Check ownership
        if (story.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this story'
            });
        }

        // Delete from S3
        const key = s3Service.extractKeyFromUrl(story.mediaUrl);
        if (key) {
            await s3Service.deleteFromS3(key);
        }

        // Delete from database
        await Story.findByIdAndDelete(storyId);

        res.json({
            success: true,
            message: 'Story deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete story'
        });
    }
});

export default router;
