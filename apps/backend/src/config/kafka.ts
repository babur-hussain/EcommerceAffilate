import { Kafka, logLevel } from 'kafkajs';
import { env } from './env';
import { logger } from '../utils/logger';

// Custom logger adapter for KafkaJS → Pino
const kafkaLogCreator = () => {
    return ({ namespace, level, log }: any) => {
        const { message, ...extra } = log;
        switch (level) {
            case logLevel.ERROR:
            case logLevel.NOTHING:
                logger.error({ kafka: namespace, ...extra }, message);
                break;
            case logLevel.WARN:
                logger.warn({ kafka: namespace, ...extra }, message);
                break;
            case logLevel.INFO:
                logger.info({ kafka: namespace, ...extra }, message);
                break;
            case logLevel.DEBUG:
                logger.debug({ kafka: namespace, ...extra }, message);
                break;
        }
    };
};

export const kafka = new Kafka({
    clientId: env.kafka.clientId,
    brokers: env.kafka.brokers,
    logLevel: env.isProduction ? logLevel.WARN : logLevel.INFO,
    logCreator: kafkaLogCreator,
    retry: {
        initialRetryTime: 300,
        retries: 8,
    },
});

// Topic name constants
export const KAFKA_TOPICS = {
    ORDER_EVENTS: 'order-events',
    PAYMENT_EVENTS: 'payment-events',
    CART_EVENTS: 'cart-events',
    USER_EVENTS: 'user-events',
    PRODUCT_EVENTS: 'product-events',
    NOTIFICATION_EVENTS: 'notification-events',
    INFLUENCER_EVENTS: 'influencer-events',
    TRACKING_EVENTS: 'tracking-events',
} as const;

export type KafkaTopic = typeof KAFKA_TOPICS[keyof typeof KAFKA_TOPICS];
