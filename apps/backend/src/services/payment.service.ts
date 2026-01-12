
import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import { logAction } from './audit.service';
import Razorpay from 'razorpay';
import { env } from '../config/env';
import crypto from 'crypto';


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

  let paymentOrderId = '';
  let paymentOrderData: any = {};

  if (provider === 'RAZORPAY') {
    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: env.payments.razorpay.key_id,
      key_secret: env.payments.razorpay.key_secret,
    });
    const amount = Math.round((order as any).payableAmount ?? order.totalAmount) * 100; // in paise
    const rzpOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: order._id.toString(),
      payment_capture: 1,
      notes: {
        userId: order.userId.toString(),
        orderId: order._id.toString(),
      },
    });
    paymentOrderId = rzpOrder.id;
    paymentOrderData = rzpOrder;
  } else {
    // Mock for other providers
    paymentOrderId = `${provider}-${order._id}-${Date.now()}`;
    paymentOrderData = { id: paymentOrderId };
  }

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
    paymentOrderData,
    key_id: provider === 'RAZORPAY' ? env.payments.razorpay.key_id : undefined,
    currency: 'INR',
    name: 'EcommerceEarn',
    description: 'Order Payment',
    orderId: order._id,
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

  let success = false;
  if (order.paymentProvider === 'RAZORPAY') {
    // Razorpay signature verification
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error('Missing Razorpay payment details');
    }
    const hmac = crypto.createHmac('sha256', env.payments.razorpay.key_secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');
    if (generatedSignature === razorpay_signature) {
      success = true;
    }
  } else {
    // Placeholder for other providers
    success = payload?.success === true;
  }

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
