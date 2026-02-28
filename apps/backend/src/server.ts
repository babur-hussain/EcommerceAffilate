import http from 'http';
import { env } from './config/env'; // Load env vars first
import app from './app';
import { connectMongo, disconnectMongo } from './config/mongo';
import { logger } from './utils/logger';
import { DispatchService } from './services/dispatch.service';
import { kafkaProducer } from './services/kafka.producer';
import { kafkaConsumer } from './services/kafka.consumer';
import { registerKafkaConsumers } from './services/consumers/index';
import { startSSEKafkaRelay } from './routes/sse.route';
import redis from './services/redis.service';

const PORT = env.PORT;
const SHUTDOWN_TIMEOUT_MS = 15_000; // Force-kill after 15s

// Start server only after MongoDB connection is established
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectMongo();

    // Initialize Dispatch Service (Cron Jobs)
    DispatchService.init();

    // Initialize Kafka (non-blocking — server starts even if Kafka fails)
    try {
      await kafkaProducer.connect();
      registerKafkaConsumers();
      await kafkaConsumer.startAll();
      await startSSEKafkaRelay();
      logger.info('✅ Kafka infrastructure initialized');
    } catch (kafkaError) {
      logger.error({ err: kafkaError }, '⚠️ Kafka initialization failed — server continues without Kafka');
    }

    // Start HTTP server only if DB connection succeeds
    const server = http.createServer(app);

    // Timeouts for load balancer compatibility (must be > ALB/nginx idle timeout)
    server.keepAliveTimeout = 65_000; // 65s (AWS ALB default idle = 60s)
    server.headersTimeout = 66_000;   // Slightly higher than keepAliveTimeout

    // Listen on all network interfaces (0.0.0.0) to allow mobile app connections
    server.listen(PORT, '0.0.0.0', () => {
      logger.info({ port: PORT, host: '0.0.0.0', pid: process.pid }, 'Backend server running');
    });

    // --- Graceful Shutdown ---
    let isShuttingDown = false;

    const shutdown = async (signal: NodeJS.Signals) => {
      if (isShuttingDown) return; // Prevent double shutdown
      isShuttingDown = true;
      logger.info({ signal }, 'Received shutdown signal — starting graceful shutdown');

      // Force-kill timer to prevent zombie processes
      const forceKillTimer = setTimeout(() => {
        logger.error('Graceful shutdown timed out — forcing exit');
        process.exit(1);
      }, SHUTDOWN_TIMEOUT_MS);
      forceKillTimer.unref(); // Don't keep the event loop alive

      try {
        // 1. Stop accepting new connections
        await new Promise<void>((resolve, reject) => {
          server.close((err) => (err ? reject(err) : resolve()));
        });
        logger.info('HTTP server closed');

        // 2. Disconnect services in order
        await kafkaProducer.disconnect().catch((e: any) => logger.error({ err: e }, 'Kafka producer disconnect error'));
        await kafkaConsumer.disconnectAll().catch((e: any) => logger.error({ err: e }, 'Kafka consumer disconnect error'));
        await redis.disconnect().catch((e: any) => logger.error({ err: e }, 'Redis disconnect error'));
        await disconnectMongo();

        logger.info('All services disconnected — exiting cleanly');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Error during graceful shutdown');
        process.exit(1);
      }
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1); // Exit if DB connection fails
  }
};

// --- Process-level Error Handlers ---
process.on('unhandledRejection', (reason: any) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
  // Don't exit — log and continue; the rejection is contained
});

process.on('uncaughtException', (error: Error) => {
  logger.fatal({ err: error }, 'Uncaught exception — shutting down');
  process.exit(1); // Uncaught exceptions leave state potentially corrupt; must exit
});

startServer();

