import { KAFKA_TOPICS } from '../../config/kafka';
import { kafkaConsumer } from '../kafka.consumer';
import { analyticsConsumerHandler } from './analytics.consumer';
import { notificationConsumerHandler } from './notification.consumer';

/**
 * Register all Kafka consumer groups.
 * Called once during server startup, BEFORE kafkaConsumer.startAll().
 */
export function registerKafkaConsumers(): void {
    // Analytics consumer — aggregates product views, clicks, order data
    kafkaConsumer.register(
        'ecommerce-analytics',
        [
            KAFKA_TOPICS.ORDER_EVENTS,
            KAFKA_TOPICS.PRODUCT_EVENTS,
            KAFKA_TOPICS.TRACKING_EVENTS,
            KAFKA_TOPICS.INFLUENCER_EVENTS,
        ],
        analyticsConsumerHandler
    );

    // Notification consumer — triggers push/in-app notifications
    kafkaConsumer.register(
        'ecommerce-notifications',
        [
            KAFKA_TOPICS.ORDER_EVENTS,
            KAFKA_TOPICS.PAYMENT_EVENTS,
            KAFKA_TOPICS.NOTIFICATION_EVENTS,
        ],
        notificationConsumerHandler
    );
}
