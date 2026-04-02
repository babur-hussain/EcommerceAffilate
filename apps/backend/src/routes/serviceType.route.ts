import express from 'express';
import {
    createServiceType,
    updateServiceType,
    deleteServiceType,
    getServiceTypes,
    getServiceTypeById,
    getTypesBySubCategoryId,
} from '../controllers/serviceType.controller';

const router = express.Router();

// All routes open for dashboard management
// TODO: Add back protect + restrictTo middleware once dashboard has Firebase login
router.get('/', getServiceTypes);
router.get('/:id', getServiceTypeById);
router.get('/by-subcategory/:subCategoryId', getTypesBySubCategoryId);
router.post('/', createServiceType);
router.put('/:id', updateServiceType);
router.delete('/:id', deleteServiceType);

export default router;
