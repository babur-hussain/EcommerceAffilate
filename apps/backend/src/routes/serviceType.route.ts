import express from 'express';
import {
    createServiceType,
    updateServiceType,
    publishServiceType,
    getServiceTypes,
    getServiceTypeByCode
} from '../controllers/serviceType.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

// Public/Protected Read Routes (depending on app logic, maybe public for dynamic forms)
router.get('/', protect, getServiceTypes);
router.get('/:code', protect, getServiceTypeByCode);

// Admin Write Routes
router.use(protect);
router.use(restrictTo('SUPER_ADMIN'));

router.post('/', createServiceType);
router.put('/:id', updateServiceType);
router.post('/:id/publish', publishServiceType);

export default router;
