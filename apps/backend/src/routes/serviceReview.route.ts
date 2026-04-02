import express from 'express';
import {
    createServiceReview,
    getReviewsByProvider,
} from '../controllers/serviceReview.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.get('/by-provider/:providerId', getReviewsByProvider);

// Authenticated routes
router.post('/', protect, createServiceReview);

export default router;
