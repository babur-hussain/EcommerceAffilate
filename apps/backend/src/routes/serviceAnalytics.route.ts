import express from 'express';
import {
    getServiceAnalyticsOverview,
    getTopProviders,
    getTopCategories,
    getRevenueOverTime,
} from '../controllers/serviceAnalytics.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);
router.use(restrictTo('SUPER_ADMIN', 'SERVICE_MANAGER'));

router.get('/overview', getServiceAnalyticsOverview);
router.get('/top-providers', getTopProviders);
router.get('/top-categories', getTopCategories);
router.get('/revenue-over-time', getRevenueOverTime);

export default router;
