import { Router, Request, Response } from 'express';
import { kafkaProducer } from '../services/kafka.producer';
import { KAFKA_TOPICS } from '../config/kafka';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/events/track — Receives batched tracking events from iOS app
 * Events are produced to the 'tracking-events' Kafka topic.
 * 
 * Body: {
 *   events: [
 *     { eventType: string, properties: object, timestamp: string }
 *   ],
 *   device: { platform: string, version: string, os: string },
 *   sessionId: string
 * }
 */
router.post('/events/track', async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as { id?: string } | undefined;
        const userId = user?.id || 'anonymous';

        const { events, device, sessionId } = req.body as {
            events?: Array<{ eventType: string; properties?: Record<string, any>; timestamp?: string }>;
            device?: { platform?: string; version?: string; os?: string };
            sessionId?: string;
        };

        if (!Array.isArray(events) || events.length === 0) {
            return res.status(400).json({ error: 'events array is required' });
        }

        // Cap batch size to prevent abuse
        const maxBatchSize = 50;
        const batch = events.slice(0, maxBatchSize);

        // Enrich events with metadata and produce to Kafka
        const kafkaEvents = batch.map((event) => ({
            eventType: event.eventType,
            payload: {
                ...event.properties,
                userId,
                sessionId,
                device,
                clientTimestamp: event.timestamp,
            },
            key: userId,
        }));

        await kafkaProducer.sendBatch(KAFKA_TOPICS.TRACKING_EVENTS, kafkaEvents);

        logger.info({ userId, count: batch.length }, `📲 Received ${batch.length} tracking events from iOS`);

        res.json({ success: true, accepted: batch.length });
    } catch (error: any) {
        logger.error({ err: error }, 'Failed to process tracking events');
        res.status(500).json({ error: 'Failed to track events', message: error.message });
    }
});

export default router;
