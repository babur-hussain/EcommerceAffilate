import express from 'express';
import {
    getAvailability,
    updateAvailability
} from '../controllers/availability.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getAvailability);
router.post('/', updateAvailability);

export default router;
