import express from 'express';
import {
    createServiceProvider,
    updateServiceProvider,
    updateProviderStatus,
    getServiceProviders,
    getServiceProviderById,
    deleteServiceProvider,
    searchServiceProviders,
} from '../controllers/serviceProvider.controller';

const router = express.Router();

// All routes are open for dashboard management
// TODO: Add back protect + restrictTo middleware once dashboard has Firebase login
router.get('/search', searchServiceProviders);
router.get('/', getServiceProviders);
router.get('/:id', getServiceProviderById);
router.post('/', createServiceProvider);
router.put('/:id', updateServiceProvider);
router.patch('/:id/status', updateProviderStatus);
router.delete('/:id', deleteServiceProvider);

export default router;
