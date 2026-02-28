import { EachMessagePayload } from 'kafkajs';
import { logger } from '../../utils/logger';
import { Product } from '../../models/product.model';

/**
 * Analytics consumer handler — processes events for analytics aggregation.
 * Subscribes to: order-events, product-events, tracking-events, influencer-events
 */
export async function analyticsConsumerHandler(
    eventType: string,
    payload: Record<string, any>,
    _raw: EachMessagePayload
): Promise<void> {
    switch (eventType) {
        // Product analytics
        case 'product.viewed': {
            const { productId } = payload;
            if (productId) {
                await Product.findByIdAndUpdate(productId, { $inc: { views: 1 } });
                logger.debug({ productId }, '📊 Product view incremented via Kafka');
            }
            break;
        }

        case 'product.clicked': {
            const { productId } = payload;
            if (productId) {
                await Product.findByIdAndUpdate(productId, { $inc: { clicks: 1 } });
                logger.debug({ productId }, '📊 Product click incremented via Kafka');
            }
            break;
        }

        case 'product.searched': {
            const { query, resultsCount } = payload;
            logger.info({ query, resultsCount }, '📊 Search event tracked');
            // Future: store in search analytics collection
            break;
        }

        // Order analytics
        case 'order.created': {
            const { orderId, totalAmount, itemCount } = payload;
            logger.info({ orderId, totalAmount, itemCount }, '📊 Order created event tracked');
            // Future: update daily sales aggregation
            break;
        }

        // Influencer analytics
        case 'influencer.click': {
            const { influencerId, productId, referralCode } = payload;
            logger.info({ influencerId, productId, referralCode }, '📊 Influencer click tracked');
            break;
        }

        case 'influencer.conversion': {
            const { influencerId, orderId, commission } = payload;
            logger.info({ influencerId, orderId, commission }, '📊 Influencer conversion tracked');
            break;
        }

        // App tracking events
        case 'app.screen_view':
        case 'app.button_click': {
            logger.debug({ eventType, ...payload }, '📊 App tracking event');
            break;
        }

        default:
            logger.debug({ eventType }, '📊 Unhandled analytics event');
    }
}
