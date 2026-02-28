import { Producer, CompressionTypes } from 'kafkajs';
import { kafka, KafkaTopic } from '../config/kafka';
import { logger } from '../utils/logger';

class KafkaProducerService {
    private producer: Producer;
    private isConnected = false;

    constructor() {
        this.producer = kafka.producer({
            allowAutoTopicCreation: true,
            transactionTimeout: 30000,
        });
    }

    async connect(): Promise<void> {
        if (this.isConnected) return;
        try {
            await this.producer.connect();
            this.isConnected = true;
            logger.info('✅ Kafka producer connected');
        } catch (error) {
            logger.error({ err: error }, '❌ Failed to connect Kafka producer');
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) return;
        try {
            await this.producer.disconnect();
            this.isConnected = false;
            logger.info('Kafka producer disconnected');
        } catch (error) {
            logger.error({ err: error }, 'Error disconnecting Kafka producer');
        }
    }

    /**
     * Send an event to a Kafka topic
     * @param topic - Target Kafka topic
     * @param eventType - Event type (e.g., 'order.created')
     * @param payload - Event data
     * @param key - Optional partition key (e.g., userId or orderId)
     */
    async sendEvent(
        topic: KafkaTopic,
        eventType: string,
        payload: Record<string, any>,
        key?: string
    ): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }

        const message = {
            key: key || undefined,
            value: JSON.stringify({
                eventType,
                timestamp: new Date().toISOString(),
                payload,
            }),
            headers: {
                'event-type': eventType,
                'source': 'ecommerce-backend',
            },
        };

        try {
            await this.producer.send({
                topic,
                compression: CompressionTypes.GZIP,
                messages: [message],
            });
            logger.info({ topic, eventType, key }, `📤 Kafka event sent: ${eventType}`);
        } catch (error) {
            logger.error({ err: error, topic, eventType }, `❌ Failed to send Kafka event: ${eventType}`);
            // Don't throw — event production should not break the main flow
        }
    }

    /**
     * Send multiple events in a batch
     */
    async sendBatch(
        topic: KafkaTopic,
        events: Array<{ eventType: string; payload: Record<string, any>; key?: string }>
    ): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }

        const messages = events.map((event) => ({
            key: event.key || undefined,
            value: JSON.stringify({
                eventType: event.eventType,
                timestamp: new Date().toISOString(),
                payload: event.payload,
            }),
            headers: {
                'event-type': event.eventType,
                'source': 'ecommerce-backend',
            },
        }));

        try {
            await this.producer.send({
                topic,
                compression: CompressionTypes.GZIP,
                messages,
            });
            logger.info({ topic, count: messages.length }, `📤 Kafka batch sent: ${messages.length} events`);
        } catch (error) {
            logger.error({ err: error, topic }, '❌ Failed to send Kafka batch');
        }
    }
}

// Singleton instance
export const kafkaProducer = new KafkaProducerService();
