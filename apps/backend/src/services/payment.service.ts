import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import { logAction } from './audit.service';

export const createPaymentOrder = async (
  orderId: string,
  provider: 'RAZORPAY' | 'CASHFREE'
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID');
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');
  if (order.status !== 'CREATED') throw new Error('Order is not payable');

  // Mock provider order id
  const paymentOrderId = `${provider}-${order._id}-${Date.now()}`;

  order.paymentProvider = provider;
  order.paymentOrderId = paymentOrderId;
  order.paymentStatus = 'PENDING';
  await order.save();

  void logAction({
    userId: order.userId.toString(),
    role: undefined,
    action: 'PAYMENT_ORDER_CREATED',
    entityType: 'PAYMENT',
    entityId: order._id.toString(),
    metadata: { provider, paymentOrderId },
  });

  return {
    paymentOrderId,
    amount: (order as any).payableAmount ?? order.totalAmount,
    provider,
  };
};

export const verifyPayment = async (
  orderId: string,
  payload: any
): Promise<'SUCCESS' | 'FAILED'> => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID');
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  // Placeholder verification logic: assume success if payload.success === true
  const success = payload?.success === true;

  order.paymentStatus = success ? 'SUCCESS' : 'FAILED';
  if (success) {
    order.status = 'PAID';
    // Increment coupon usage only when payment succeeds
    if ((order as any).couponCode) {
      try {
        const { incrementUsage } = await import('./coupon.service');
        await incrementUsage((order as any).couponCode as string);
      } catch {
        // ignore coupon increment errors
      }
    }
    void logAction({
      userId: order.userId.toString(),
      role: undefined,
      action: 'ORDER_PAID',
      entityType: 'ORDER',
      entityId: order._id.toString(),
      metadata: { provider: order.paymentProvider },
    });
  }

  await order.save();

  void logAction({
    userId: order.userId.toString(),
    role: undefined,
    action: 'PAYMENT_STATUS_UPDATED',
    entityType: 'PAYMENT',
    entityId: order._id.toString(),
    metadata: { provider: order.paymentProvider, status: order.paymentStatus },
  });

  return order.paymentStatus as 'SUCCESS' | 'FAILED';
};
