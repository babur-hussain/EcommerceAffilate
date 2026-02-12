import express from 'express';
import {
    createService,
    updateService,
    getServices,
    getServiceById,
    deleteService
} from '../controllers/service.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

// Public / Provider Read Routes
router.get('/', protect, getServices); // Protected mainly for dashboard logic, public API might differ
router.get('/:id', protect, getServiceById);

// Write Routes
router.use(protect);

router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService); // Archive

export default router;
