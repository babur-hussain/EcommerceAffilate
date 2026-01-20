import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ShiprocketService } from '../services/shiprocket.service';
import { Order } from '../models/order.model';
import { requireAdmin, requireBrand } from '../middlewares/rbac';

const router = Router();

// ============================================
// MIDDLEWARE
// ============================================

/**
 * Middleware to ensure order exists and user has access
 */
const getOrder = async (req: Request, res: Response, next: any) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid order id' });
        }

        const order = await Order.findById(id)
            .populate('items.productId')
            .populate('userId', 'email name phone');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // TODO: Add stricter ownership check for sellers
        (req as any).order = order;
        next();
    } catch (error: any) {
        console.error('[Shiprocket Route] getOrder error:', error);
        res.status(500).json({ error: 'Database error', details: error.message });
    }
};

/**
 * Error handler wrapper for async routes
 */
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error: any) => {
        console.error('[Shiprocket Route] Error:', error);
        const formatted = ShiprocketService.formatError(error);
        res.status(500).json({
            error: formatted.message,
            details: formatted.details,
        });
    });
};

// ============================================
// PICKUP LOCATIONS
// ============================================

/**
 * GET /api/shiprocket/pickup-locations
 * Get all configured pickup locations
 */
router.get('/shiprocket/pickup-locations', requireBrand, asyncHandler(async (req: Request, res: Response) => {
    const locations = await ShiprocketService.getPickupLocations();
    res.json({ success: true, data: locations });
}));

// ============================================
// SERVICEABILITY & RATES
// ============================================

/**
 * GET /api/orders/:id/shiprocket/rates
 * Check courier serviceability and get available rates
 */
router.get('/orders/:id/shiprocket/rates', requireBrand, getOrder, asyncHandler(async (req: Request, res: Response) => {
    const order = (req as any).order;
    const result = await ShiprocketService.checkServiceability(order);
    res.json(result);
}));

/**
 * GET /api/orders/:id/shiprocket/couriers
 * Get available couriers for a shipment (after order is created)
 */
router.get('/orders/:id/shiprocket/couriers', requireBrand, getOrder, asyncHandler(async (req: Request, res: Response) => {
    const order = (req as any).order;

    if (!order.shiprocket?.shipmentId) {
        return res.status(400).json({ error: 'Shiprocket order not created yet. Create order first.' });
    }

    const couriers = await ShiprocketService.getAvailableCouriers(order.shiprocket.shipmentId);
    res.json({ success: true, data: couriers });
}));

// ============================================
// ORDER MANAGEMENT
// ============================================

/**
 * POST /api/orders/:id/shiprocket/create
 * Create order in Shiprocket
 */
router.post('/orders/:id/shiprocket/create', requireBrand, getOrder, asyncHandler(async (req: Request, res: Response) => {
    const order = (req as any).order;
    const { pickup_location } = req.body; // Optional: Override pickup location name

    if (order.shiprocket?.orderId) {
        return res.status(400).json({
            error: 'Shiprocket order already created',
            shiprocket_order_id: order.shiprocket.orderId,
        });
    }

    const result = await ShiprocketService.createOrder(order, pickup_location || 'Primary');

    // Update Order with Shiprocket details
    order.shiprocket = {
        orderId: result.order_id,
        shipmentId: result.shipment_id,
        status: result.status,
    };
    await order.save();

    res.json({
        success: true,
        message: 'Order created in Shiprocket',
        order,
    });
}));

/**
 * POST /api/orders/:id/shiprocket/cancel
 * Cancel Shiprocket order
 */
router.post('/orders/:id/shiprocket/cancel', requireBrand, getOrder, asyncHandler(async (req: Request, res: Response) => {
    const order = (req as any).order;

    if (!order.shiprocket?.orderId) {
        return res.status(400).json({ error: 'No Shiprocket order to cancel' });
    }

    // Cannot cancel if AWB is generated and pickup is scheduled
    if (order.shiprocket.awbCode && order.shiprocket.pickupScheduled) {
        // Need to cancel shipment via AWB instead
        await ShiprocketService.cancelShipment([order.shiprocket.awbCode]);
    } else {
        await ShiprocketService.cancelOrder([order.shiprocket.orderId]);
    }

    // Update order status
    order.shiprocket.status = 'CANCELLED';
    order.status = 'CANCELLED';
    await order.save();

    res.json({
        success: true,
        message: 'Order cancelled in Shiprocket',
        order,
    });
}));

// ============================================
// AWB & COURIER ASSIGNMENT
// ============================================

/**
 * POST /api/orders/:id/shiprocket/awb
 * Generate AWB (assign courier)
 */
router.post('/orders/:id/shiprocket/awb', requireBrand, getOrder, asyncHandler(async (req: Request, res: Response) => {
    const order = (req as any).order;
    const { courier_id } = req.body; // Optional: If not provided, auto-select recommended

    if (!order.shiprocket?.shipmentId) {
        return res.status(400).json({ error: 'Shiprocket order not created yet' });
    }

    if (order.shiprocket.awbCode) {
        return res.status(400).json({
            error: 'AWB already generated',
            awb_code: order.shiprocket.awbCode,
        });
    }

    let result;
    if (courier_id) {
        result = await ShiprocketService.generateAWB(order.shiprocket.shipmentId, courier_id);
    } else {
        // Auto-assign based on recommendation
        result = await ShiprocketService.autoAssignAWB(order.shiprocket.shipmentId);
    }

    // Update order with AWB details
    order.shiprocket.awbCode = result.awb_code;
    order.shiprocket.courierName = result.courier_name;
    order.shiprocket.courierId = result.courier_company_id;
    order.shiprocket.actualShippingCost = result.applied_weight; // May need different field
    await order.save();

    res.json({
        success: true,
        message: 'AWB generated successfully',
        awb_code: result.awb_code,
        courier_name: result.courier_name,
        order,
    });
}));

// ============================================
// PICKUP SCHEDULING
// ============================================

/**
 * POST /api/orders/:id/shiprocket/pickup
 * Request pickup for the order
 */
router.post('/orders/:id/shiprocket/pickup', requireBrand, getOrder, asyncHandler(async (req: Request, res: Response) => {
    const order = (req as any).order;

    if (!order.shiprocket?.shipmentId) {
        return res.status(400).json({ error: 'Shiprocket order not created yet' });
    }

    if (!order.shiprocket.awbCode) {
        return res.status(400).json({ error: 'AWB not generated yet. Generate AWB first.' });
    }

    const result = await ShiprocketService.requestPickup([order.shiprocket.shipmentId]);

    // Update order
    order.shiprocket.pickupScheduled = true;
    order.shiprocket.pickupToken = result.pickup_token_number;
    order.status = 'SHIPPED';
    order.deliveryStatus = 'PENDING_PICKUP';
    await order.save();

    res.json({
        success: true,
        message: 'Pickup scheduled successfully',
        pickup_token: result.pickup_token_number,
        order,
    });
}));

// ============================================
// LABELS & DOCUMENTS
// ============================================

/**
 * GET /api/orders/:id/shiprocket/label
 * Generate and get shipping label URL
 */
router.get('/orders/:id/shiprocket/label', requireBrand, getOrder, asyncHandler(async (req: Request, res: Response) => {
    const order = (req as any).order;

    if (!order.shiprocket?.shipmentId) {
        return res.status(400).json({ error: 'Shiprocket order not created yet' });
    }

    if (!order.shiprocket.awbCode) {
        return res.status(400).json({ error: 'AWB not generated yet. Generate AWB first.' });
    }

    const url = await ShiprocketService.generateLabel([order.shiprocket.shipmentId]);

    // Save label URL
    order.shiprocket.labelUrl = url;
    await order.save();

    res.json({ success: true, url });
}));

/**
 * GET /api/orders/:id/shiprocket/manifest
 * Generate manifest
 */
router.get('/orders/:id/shiprocket/manifest', requireBrand, getOrder, asyncHandler(async (req: Request, res: Response) => {
    const order = (req as any).order;

    if (!order.shiprocket?.shipmentId) {
        return res.status(400).json({ error: 'Shiprocket order not created yet' });
    }

    const url = await ShiprocketService.generateManifest([order.shiprocket.shipmentId]);

    order.shiprocket.manifestUrl = url;
    await order.save();

    res.json({ success: true, url });
}));

/**
 * GET /api/orders/:id/shiprocket/invoice
 * Generate invoice
 */
router.get('/orders/:id/shiprocket/invoice', requireBrand, getOrder, asyncHandler(async (req: Request, res: Response) => {
    const order = (req as any).order;

    if (!order.shiprocket?.orderId) {
        return res.status(400).json({ error: 'Shiprocket order not created yet' });
    }

    const url = await ShiprocketService.generateInvoice([order.shiprocket.orderId]);

    order.shiprocket.invoiceUrl = url;
    await order.save();

    res.json({ success: true, url });
}));

// ============================================
// TRACKING
// ============================================

/**
 * GET /api/orders/:id/shiprocket/track
 * Track shipment
 */
router.get('/orders/:id/shiprocket/track', requireBrand, getOrder, asyncHandler(async (req: Request, res: Response) => {
    const order = (req as any).order;

    if (!order.shiprocket?.shipmentId) {
        return res.status(400).json({ error: 'Shiprocket order not created yet' });
    }

    let tracking;
    if (order.shiprocket.awbCode) {
        tracking = await ShiprocketService.trackByAWB(order.shiprocket.awbCode);
    } else {
        tracking = await ShiprocketService.trackShipment(order.shiprocket.shipmentId);
    }

    res.json({ success: true, data: tracking });
}));

/**
 * GET /api/shiprocket/track/awb/:awb
 * Track by AWB code (public-ish endpoint)
 */
router.get('/shiprocket/track/awb/:awb', asyncHandler(async (req: Request, res: Response) => {
    const { awb } = req.params;

    if (!awb) {
        return res.status(400).json({ error: 'AWB code is required' });
    }

    const tracking = await ShiprocketService.trackByAWB(awb);
    res.json({ success: true, data: tracking });
}));

// ============================================
// NDR MANAGEMENT (Admin)
// ============================================

/**
 * GET /api/shiprocket/ndr
 * Get all NDR shipments
 */
router.get('/shiprocket/ndr', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const ndrShipments = await ShiprocketService.getNDRShipments();
    res.json({ success: true, data: ndrShipments });
}));

/**
 * PUT /api/shiprocket/ndr/:awb
 * Update NDR action
 */
router.put('/shiprocket/ndr/:awb', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const { awb } = req.params;
    const { action, address, phone, comments } = req.body;

    if (!['reattempt', 'cancel'].includes(action)) {
        return res.status(400).json({ error: 'Action must be "reattempt" or "cancel"' });
    }

    const result = await ShiprocketService.updateNDR(awb, action, { address, phone, comments });
    res.json({ success: true, data: result });
}));

export default router;
