import { Consumer, EachMessagePayload } from 'kafkajs';
import { kafka, KafkaTopic } from '../config/kafka';
import { logger } from '../utils/logger';

export type KafkaMessageHandler = (
    eventType: string,
    payload: Record<string, any>,
    raw: EachMessagePayload
) => Promise<void>;

interface ConsumerRegistration {
    groupId: string;
    topics: KafkaTopic[];
    handler: KafkaMessageHandler;
}

class KafkaConsumerService {
    private consumers: Consumer[] = [];
    private registrations: ConsumerRegistration[] = [];

    /**
     * Register a consumer group with topics and a handler.
     * Call this BEFORE startAll().
     */
    register(groupId: string, topics: KafkaTopic[], handler: KafkaMessageHandler): void {
        this.registrations.push({ groupId, topics, handler });
        logger.info({ groupId, topics }, `📋 Kafka consumer registered: ${groupId}`);
    }

    /**
     * Connect and start all registered consumers.
     */
    async startAll(): Promise<void> {
        for (const reg of this.registrations) {
            try {
                const consumer = kafka.consumer({ groupId: reg.groupId });
                await consumer.connect();

                for (const topic of reg.topics) {
                    await consumer.subscribe({ topic, fromBeginning: false });
                }

                await consumer.run({
                    eachMessage: async (messagePayload: EachMessagePayload) => {
                        const { topic, partition, message } = messagePayload;
                        try {
                            const raw = message.value?.toString();
                            if (!raw) return;

                            const parsed = JSON.parse(raw);
                            const eventType = parsed.eventType || 'unknown';
                            const payload = parsed.payload || {};

                            logger.debug(
                                { groupId: reg.groupId, topic, partition, eventType },
                                `📥 Kafka event received: ${eventType}`
                            );

                            await reg.handler(eventType, payload, messagePayload);
                        } catch (error) {
                            logger.error(
                                { err: error, groupId: reg.groupId, topic, partition },
                                '❌ Error processing Kafka message'
                            );
                        }
                    },
                });

                this.consumers.push(consumer);
                logger.info({ groupId: reg.groupId, topics: reg.topics }, `✅ Kafka consumer started: ${reg.groupId}`);
            } catch (error) {
                logger.error({ err: error, groupId: reg.groupId }, `❌ Failed to start Kafka consumer: ${reg.groupId}`);
            }
        }
    }

    /**
     * Disconnect all consumers gracefully.
     */
    async disconnectAll(): Promise<void> {
        for (const consumer of this.consumers) {
            try {
                await consumer.disconnect();
            } catch (error) {
                logger.error({ err: error }, 'Error disconnecting Kafka consumer');
            }
        }
        this.consumers = [];
        logger.info('Kafka consumers disconnected');
    }
}

// Singleton instance
export const kafkaConsumer = new KafkaConsumerService();
