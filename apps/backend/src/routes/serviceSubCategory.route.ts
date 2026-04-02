import express from 'express';
import {
    createServiceSubCategory,
    updateServiceSubCategory,
    deleteServiceSubCategory,
    getServiceSubCategories,
    getServiceSubCategoryById,
    getSubCategoriesByCategoryId,
} from '../controllers/serviceSubCategory.controller';

const router = express.Router();

// All routes are open for dashboard management
// TODO: Add back protect + restrictTo middleware once dashboard has Firebase login
router.get('/', getServiceSubCategories);
router.get('/:id', getServiceSubCategoryById);
router.get('/by-category/:categoryId', getSubCategoriesByCategoryId);
router.post('/', createServiceSubCategory);
router.put('/:id', updateServiceSubCategory);
router.delete('/:id', deleteServiceSubCategory);

export default router;
