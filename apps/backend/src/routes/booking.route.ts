import express from 'express';
import {
    getBookings,
    getBookingById,
    updateBookingStatus,
    addBookingNote,
    createBooking
} from '../controllers/booking.controller';
import { protect, restrictTo as authorize } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getBookings);
router.post('/', createBooking); // Internal/Dev use primarily
router.get('/:id', getBookingById);
router.put('/:id/status', authorize('SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'), updateBookingStatus);
router.post('/:id/notes', authorize('SUPER_ADMIN', 'COUNTRY_ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'), addBookingNote);

export default router;
