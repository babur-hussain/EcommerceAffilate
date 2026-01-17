import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import { Address } from '../models/address.model';
import { Product } from '../models/product.model';
import { requireCustomer, requireAdmin } from '../middlewares/rbac';
import { createNotification, notifySellers } from '../services/notification.service';
import { applyCoupon } from '../services/coupon.service';
import { logAction } from '../services/audit.service';
import { createInfluencerAttribution, rejectInfluencerAttribution } from '../services/influencer.service';
import { InfluencerAttribution } from '../models/influencerAttribution.model';

import { Business } from '../models/business.model';
import { admin } from '../config/firebaseAdmin';
import { createPaymentOrder, verifyPayment } from '../services/payment.service';

const router = Router();

// TODO: Add order cancellation endpoint that restores stock for order items.

router.post('/orders', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { items, addressId, couponCode, influencerCode, selectedOfferIds, paymentMethod } = req.body as {
      items?: Array<{ productId: string; quantity: number }>;
      addressId?: string;
      couponCode?: string;
      influencerCode?: string;
      selectedOfferIds?: string[];
      paymentMethod?: string;
    };
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }
    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ error: 'addressId is required' });
    }

    // Validate item shapes
    for (const item of items) {
      if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ error: 'Invalid productId in items' });
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be a positive integer' });
      }
    }

    const session = await mongoose.startSession();
    let createdOrders: any[] | null = null;

    try {
      await session.withTransaction(async () => {
        // Load and validate address belongs to user
        const address = await Address.findOne({ _id: addressId, userId: user.id }).session(session);
        if (!address) {
          throw new Error('INVALID_ADDRESS');
        }

        const productIds = items.map((i) => i.productId);
        const products = await Product.find({ _id: { $in: productIds }, isActive: true })
          .select('price stock shippingCharges protectPromiseFee lastChanceOffers')
          .session(session);

        if (products.length !== productIds.length) {
          throw new Error('INVALID_PRODUCTS');
        }

        const productMap = new Map<string, any>();
        products.forEach((p) => productMap.set(p._id.toString(), p));

        for (const item of items) {
          const product = productMap.get(item.productId);
          if (!product || product.stock < item.quantity) {
            throw new Error('INSUFFICIENT_STOCK');
          }
        }

        const orderItems = items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: productMap.get(i.productId)!.price,
        }));

        // Calculate base total (items * price)
        let totalAmount = orderItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);

        // Add Shipping & Protect Fees
        let totalShipping = 0;
        let totalProtectFee = 0;
        const processedAddOns: { title: string; price: number; offerId?: string }[] = [];

        products.forEach(p => {
          // Explicitly convert to number to handle potential string data in DB
          const shipping = Number(p.shippingCharges) || 0;
          const protect = Number(p.protectPromiseFee) || 0;

          totalShipping += shipping;
          totalProtectFee += protect;

          // Process Add-On Offers (Upsells)
          if (Array.isArray(selectedOfferIds) && selectedOfferIds.length > 0 && p.lastChanceOffers) {
            p.lastChanceOffers.forEach((offer: any) => {
              // Check if this offer is selected (comparing IDs carefully)
              if (offer._id && selectedOfferIds.includes(offer._id.toString())) {
                const offerPrice = Number(offer.offerPrice) || 0;
                totalAmount += offerPrice;
                processedAddOns.push({
                  title: offer.title,
                  price: offerPrice,
                  offerId: offer._id.toString()
                });
              }
            });
          }
        });

        totalAmount += totalShipping + totalProtectFee;

        // Apply coupon if provided
        let discountAmount = 0;
        let appliedCode: string | undefined = undefined;
        if (typeof couponCode === 'string' && couponCode.trim().length > 0) {
          try {
            const applied = await applyCoupon(couponCode, totalAmount);
            discountAmount = applied.discount;
            appliedCode = applied.coupon.code;
          } catch (_e) {
            // Invalid coupon: fail fast with clear message
            throw new Error('INVALID_COUPON');
          }
        }

        const payableAmount = Math.max(0, totalAmount - discountAmount);

        for (const item of orderItems) {
          const updateResult = await Product.updateOne(
            { _id: item.productId, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { session }
          );

          if (updateResult.modifiedCount === 0) {
            throw new Error('INSUFFICIENT_STOCK');
          }
        }

        createdOrders = await Order.create(
          [
            {
              userId: user.id,
              items: orderItems,
              shippingAddress: {
                name: address.name,
                phone: address.phone,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                country: address.country,
              },
              totalAmount,
              shippingCharges: totalShipping,
              protectPromiseFee: totalProtectFee,
              addOns: processedAddOns,
              couponCode: appliedCode,
              influencerCode: influencerCode ? influencerCode.toUpperCase() : undefined,
              discountAmount,
              payableAmount,
              status: 'CREATED',
              paymentProvider: paymentMethod === 'COD' ? 'COD' : undefined,
            },
          ],
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    const createdOrder: any | null = (createdOrders as any)?.[0] ?? null;
    res.status(201).json(createdOrder);

    if (createdOrder) {
      await createNotification(
        user.id,
        'ORDER',
        'Order placed',
        `Your order ${createdOrder._id} has been placed.`
      );

      void logAction({
        userId: user.id,
        role: (req as any)?.user?.role,
        action: 'ORDER_CREATED',
        entityType: 'ORDER',
        entityId: createdOrder._id.toString(),
        metadata: { totalAmount: createdOrder.totalAmount, itemCount: createdOrder.items.length },
      });

      // Create influencer attribution if influencer code provided
      if (influencerCode) {
        try {
          await createInfluencerAttribution(createdOrder._id.toString(), influencerCode);
        } catch (attrError) {
          // Log but don't fail the order if attribution creation fails
          console.error('Failed to create influencer attribution:', attrError);
        }
      }

      // If COD, notify sellers immediately (since there is no online payment verification)
      if (paymentMethod === 'COD') {
        void notifySellers(createdOrder);
      }
    }
  } catch (error: any) {
    if (error?.message === 'INSUFFICIENT_STOCK') {
      return res.status(400).json({ error: 'Insufficient stock for one or more items' });
    }
    if (error?.message === 'INVALID_PRODUCTS') {
      return res.status(400).json({ error: 'One or more products are invalid or inactive' });
    }
    if (error?.message === 'INVALID_ADDRESS') {
      return res.status(400).json({ error: 'Invalid address' });
    }
    if (error?.message === 'INVALID_COUPON') {
      return res.status(400).json({ error: 'Invalid or ineligible coupon' });
    }
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
});

router.get('/orders/mine', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const orders = await Order.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'title images');
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
});

router.post('/orders/:id/pay', requireCustomer, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { provider } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const result = await createPaymentOrder(id, provider || 'RAZORPAY');
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to initiate payment', message: error.message });
  }
});

router.post('/orders/:id/verify', requireCustomer, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await verifyPayment(id, req.body);
    res.json({ status: result });

    // If payment verified, notify sellers
    if (result === 'SUCCESS' || (result as any)?.status === 'SUCCESS') {
      const order = await Order.findById(id).populate('items.productId');
      if (order) {
        void notifySellers(order);
      }
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to verify payment', message: error.message });
  }
});

router.post('/orders/:id/ship', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, status: 'PAID' },
      { status: 'SHIPPED' },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({ error: 'Order not found or not eligible for shipping' });
    }

    res.json(order);

    void logAction({
      userId: (req as any)?.user?.id,
      role: (req as any)?.user?.role,
      action: 'ORDER_SHIPPED',
      entityType: 'ORDER',
      entityId: order._id.toString(),
      metadata: { previousStatus: 'PAID' },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to ship order', message: error.message });
  }
});

router.post('/orders/:id/deliver', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, status: 'SHIPPED' },
      { status: 'DELIVERED' },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({ error: 'Order not found or not eligible for delivery' });
    }

    res.json(order);

    if (order) {
      await createNotification(
        order.userId.toString(),
        'ORDER',
        'Order delivered',
        `Your order ${order._id} has been delivered.`
      );

      void logAction({
        userId: (req as any)?.user?.id,
        role: (req as any)?.user?.role,
        action: 'ORDER_DELIVERED',
        entityType: 'ORDER',
        entityId: order._id.toString(),
        metadata: { previousStatus: 'SHIPPED' },
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to mark order delivered', message: error.message });
  }
});

router.post('/orders/:id/return', requireCustomer, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body as { reason?: string };
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const order = await Order.findOne({ _id: id, userId: user.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'DELIVERED') {
      return res.status(400).json({ error: 'Order is not eligible for return' });
    }

    order.status = 'RETURN_REQUESTED';
    order.returnReason = reason;
    await order.save();

    res.json(order);

    void logAction({
      userId: user.id,
      role: (req as any)?.user?.role,
      action: 'ORDER_RETURN_REQUESTED',
      entityType: 'ORDER',
      entityId: order._id.toString(),
      metadata: { reason },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to request return', message: error.message });
  }
});

router.post('/orders/:id/refund', requireAdmin, async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    const { refundAmount } = req.body as { refundAmount?: number };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    let updatedOrder: any | null = null;

    await session.withTransaction(async () => {
      const order = await Order.findById(id).session(session);
      if (!order) {
        throw new Error('NOT_FOUND');
      }

      if (order.status === 'REFUNDED') {
        throw new Error('ALREADY_REFUNDED');
      }

      if (order.status !== 'RETURN_REQUESTED') {
        throw new Error('INVALID_STATE');
      }

      const amountToRefund = refundAmount ?? order.totalAmount;
      if (typeof amountToRefund !== 'number' || amountToRefund < 0 || amountToRefund > order.totalAmount) {
        throw new Error('INVALID_REFUND');
      }

      for (const item of order.items) {
        const result = await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
          { session }
        );
        if (result.matchedCount === 0) {
          throw new Error('MISSING_PRODUCT');
        }
      }

      order.status = 'REFUNDED';
      order.refundAmount = amountToRefund;
      updatedOrder = await order.save({ session });

      // Reject any pending influencer attributions for this order
      const attributions = await InfluencerAttribution.find(
        { orderId: order._id, status: { $in: ['PENDING', 'APPROVED'] } },
        null,
        { session }
      );

      for (const attr of attributions) {
        attr.status = 'REJECTED';
        await attr.save({ session });
      }
    });

    res.json(updatedOrder);

    if (updatedOrder) {
      await createNotification(
        updatedOrder.userId.toString(),
        'RETURN',
        'Return approved',
        `Your return for order ${updatedOrder._id} has been approved. Refund amount: ${updatedOrder.refundAmount ?? updatedOrder.totalAmount
        }`
      );

      void logAction({
        userId: (req as any)?.user?.id,
        role: (req as any)?.user?.role,
        action: 'ORDER_REFUNDED',
        entityType: 'ORDER',
        entityId: updatedOrder._id.toString(),
        metadata: { refundAmount: updatedOrder.refundAmount ?? updatedOrder.totalAmount },
      });
    }
  } catch (error: any) {
    if (error?.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (error?.message === 'ALREADY_REFUNDED') {
      return res.status(400).json({ error: 'Order already refunded' });
    }
    if (error?.message === 'INVALID_STATE') {
      return res.status(400).json({ error: 'Order not eligible for refund' });
    }
    if (error?.message === 'INVALID_REFUND') {
      return res.status(400).json({ error: 'Invalid refund amount' });
    }
    if (error?.message === 'MISSING_PRODUCT') {
      return res.status(400).json({ error: 'Product not found while restoring stock' });
    }
    res.status(500).json({ error: 'Failed to refund order', message: error.message });
  } finally {
    await session.endSession();
  }
});

export default router;
