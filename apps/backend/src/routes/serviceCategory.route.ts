import express from 'express';
import {
    createServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
    getServiceCategories,
    getServiceCategoryById,
} from '../controllers/serviceCategory.controller';

const router = express.Router();

// All routes are open for dashboard management
// TODO: Add back protect + restrictTo middleware once dashboard has Firebase login
router.get('/', getServiceCategories);
router.get('/:id', getServiceCategoryById);
router.post('/', createServiceCategory);
router.put('/:id', updateServiceCategory);
router.delete('/:id', deleteServiceCategory);

export default router;
