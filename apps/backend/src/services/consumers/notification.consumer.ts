import { EachMessagePayload } from 'kafkajs';
import { logger } from '../../utils/logger';
import { createNotification } from '../notification.service';

/**
 * Notification consumer handler — triggers push/in-app notifications.
 * Subscribes to: order-events, payment-events, notification-events
 */
export async function notificationConsumerHandler(
    eventType: string,
    payload: Record<string, any>,
    _raw: EachMessagePayload
): Promise<void> {
    switch (eventType) {
        case 'order.created': {
            const { userId, orderId, totalAmount } = payload;
            if (userId) {
                await createNotification(
                    userId,
                    'order',
                    'Order Confirmed! 🎉',
                    `Your order #${orderId} of ₹${totalAmount} has been placed successfully.`
                );
                logger.info({ userId, orderId }, '🔔 Order confirmation notification created');
            }
            break;
        }

        case 'order.status-changed': {
            const { userId, orderId, newStatus } = payload;
            if (userId) {
                const statusMessages: Record<string, string> = {
                    processing: 'Your order is being processed.',
                    shipped: 'Your order has been shipped! 🚚',
                    delivered: 'Your order has been delivered! ✅',
                    cancelled: 'Your order has been cancelled.',
                };
                const message = statusMessages[newStatus] || `Order status updated to: ${newStatus}`;
                await createNotification(userId, 'order', `Order #${orderId} Update`, message);
                logger.info({ userId, orderId, newStatus }, '🔔 Order status notification created');
            }
            break;
        }

        case 'payment.success': {
            const { userId, orderId, amount } = payload;
            if (userId) {
                await createNotification(
                    userId,
                    'payment',
                    'Payment Successful 💰',
                    `Payment of ₹${amount} for order #${orderId} was successful.`
                );
                logger.info({ userId, orderId }, '🔔 Payment success notification created');
            }
            break;
        }

        case 'payment.failed': {
            const { userId, orderId, reason } = payload;
            if (userId) {
                await createNotification(
                    userId,
                    'payment',
                    'Payment Failed ❌',
                    `Payment for order #${orderId} failed. ${reason || 'Please try again.'}`
                );
                logger.warn({ userId, orderId, reason }, '🔔 Payment failure notification created');
            }
            break;
        }

        default:
            logger.debug({ eventType }, '🔔 Unhandled notification event');
    }
}
