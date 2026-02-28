import { Router, Request, Response } from 'express';
import { kafka, KAFKA_TOPICS } from '../config/kafka';
import { logger } from '../utils/logger';

const router = Router();

// In-memory map of connected SSE clients: userId -> Response[]
const sseClients = new Map<string, Response[]>();
const MAX_CONNECTIONS_PER_USER = 5;
const MAX_TOTAL_CONNECTIONS = 1000;

// Track total connection count efficiently
let totalConnectionCount = 0;

/**
 * GET /api/sse/events — Server-Sent Events endpoint for real-time Kafka events
 * The iOS app connects here after login to receive real-time updates.
 * Requires Authorization header with Bearer token.
 */
router.get('/sse/events', async (req: Request, res: Response) => {
    const user = (req as any).user as { id?: string } | undefined;
    const userId = user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Authentication required for SSE' });
    }

    // Check total connection limit
    if (totalConnectionCount >= MAX_TOTAL_CONNECTIONS) {
        logger.warn({ totalConnectionCount }, '📡 SSE max total connections reached');
        return res.status(503).json({ error: 'Server busy, try again later' });
    }

    // Check per-user connection limit
    const existingClients = sseClients.get(userId) || [];
    if (existingClients.length >= MAX_CONNECTIONS_PER_USER) {
        logger.warn({ userId, count: existingClients.length }, '📡 SSE max per-user connections reached');
        return res.status(429).json({ error: 'Too many SSE connections' });
    }

    // Set SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
    });

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ eventType: 'connected', payload: { userId } })}\n\n`);

    // Register this client
    if (!sseClients.has(userId)) {
        sseClients.set(userId, []);
    }
    sseClients.get(userId)!.push(res);
    totalConnectionCount++;

    logger.info({ userId, userClients: sseClients.get(userId)!.length, totalClients: totalConnectionCount }, '📡 SSE client connected');

    // Keep-alive ping every 30s
    const keepAlive = setInterval(() => {
        try { res.write(': ping\n\n'); } catch (_) { /* client gone */ }
    }, 30000);

    // Cleanup on disconnect
    req.on('close', () => {
        clearInterval(keepAlive);
        const clients = sseClients.get(userId);
        if (clients) {
            const index = clients.indexOf(res);
            if (index > -1) {
                clients.splice(index, 1);
                totalConnectionCount--;
            }
            if (clients.length === 0) sseClients.delete(userId);
        }
        logger.info({ userId, totalClients: totalConnectionCount }, '📡 SSE client disconnected');
    });
});

/**
 * Send an event to a specific user via SSE
 */
export function sendSSEEvent(userId: string, eventType: string, payload: any): void {
    const clients = sseClients.get(userId);
    if (!clients || clients.length === 0) return;

    const data = JSON.stringify({ eventType, payload, timestamp: new Date().toISOString() });

    clients.forEach((client) => {
        try {
            client.write(`event: ${eventType}\ndata: ${data}\n\n`);
        } catch (error) {
            logger.error({ err: error, userId, eventType }, 'Failed to send SSE event');
        }
    });
}

/**
 * Broadcast an event to all connected SSE clients
 */
export function broadcastSSEEvent(eventType: string, payload: any): void {
    const data = JSON.stringify({ eventType, payload, timestamp: new Date().toISOString() });

    sseClients.forEach((clients, _userId) => {
        clients.forEach((client) => {
            try {
                client.write(`event: ${eventType}\ndata: ${data}\n\n`);
            } catch (error) {
                // Client likely disconnected
            }
        });
    });
}

// Start a Kafka consumer that relays user-specific events to SSE clients
let sseConsumerStarted = false;

export async function startSSEKafkaRelay(): Promise<void> {
    if (sseConsumerStarted) return;
    sseConsumerStarted = true;

    try {
        const consumer = kafka.consumer({ groupId: 'ecommerce-sse-relay' });
        await consumer.connect();

        await consumer.subscribe({ topic: KAFKA_TOPICS.ORDER_EVENTS, fromBeginning: false });
        await consumer.subscribe({ topic: KAFKA_TOPICS.PAYMENT_EVENTS, fromBeginning: false });
        await consumer.subscribe({ topic: KAFKA_TOPICS.NOTIFICATION_EVENTS, fromBeginning: false });

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const raw = message.value?.toString();
                    if (!raw) return;

                    const parsed = JSON.parse(raw);
                    const eventType = parsed.eventType || 'unknown';
                    const payload = parsed.payload || {};
                    const userId = payload.userId;

                    if (userId) {
                        sendSSEEvent(userId, eventType, payload);
                    }
                } catch (error) {
                    logger.error({ err: error }, 'Error in SSE Kafka relay');
                }
            },
        });

        logger.info('📡 SSE Kafka relay consumer started');
    } catch (error) {
        logger.error({ err: error }, 'Failed to start SSE Kafka relay');
    }
}

export default router;
