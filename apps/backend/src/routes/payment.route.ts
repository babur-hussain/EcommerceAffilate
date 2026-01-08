import { Router, Request, Response } from 'express';
import { createPaymentOrder, verifyPayment } from '../services/payment.service';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';
import { createNotification } from '../services/notification.service';
import { requireCustomer } from '../middlewares/rbac';

const router = Router();

// Create payment order for an existing order
router.post('/payments/create', requireCustomer, async (req: Request, res: Response) => {
  try {
    const { orderId, provider } = req.body as { orderId?: string; provider?: 'RAZORPAY' | 'CASHFREE' };

    if (!orderId || !provider) {
      return res.status(400).json({ error: 'orderId and provider are required' });
    }

    const paymentOrder = await createPaymentOrder(orderId, provider);
    res.status(201).json(paymentOrder);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create payment order', message: error.message });
  }
});

// Webhook to handle payment success/failure (placeholder)
router.post('/payments/webhook', async (req: Request, res: Response) => {
  try {
    const { orderId, success } = req.body as { orderId?: string; success?: boolean };
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const status = await verifyPayment(orderId, { success });

    if (status === 'SUCCESS') {
      try {
        const order = await Order.findById(orderId).select('userId totalAmount');
        if (order) {
          // Notify customer
          await createNotification(
            order.userId.toString(),
            'ORDER',
            'Order placed successfully',
            `Your order ${orderId} has been placed and paid. Total: ${order.totalAmount}`
          );

          // Notify all admins
          const admins = await User.find({ role: 'ADMIN', isActive: true }).select('_id');
          await Promise.all(
            admins.map((a) =>
              createNotification(
                a._id.toString(),
                'ORDER',
                'New order received',
                `Order ${orderId} has been paid and is ready for processing.`
              )
            )
          );
        }
      } catch (_) {
        // Best-effort notifications; ignore failures
      }
    }

    res.json({ status });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to process payment webhook', message: error.message });
  }
});

export default router;
