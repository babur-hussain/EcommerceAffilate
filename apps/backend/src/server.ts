import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectMongo, disconnectMongo } from './config/mongo';
import { logger } from './utils/logger';

const PORT = env.PORT;

// Start server only after MongoDB connection is established
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectMongo();

    // Start HTTP server only if DB connection succeeds
    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info({ port: PORT }, 'Backend server running');
    });

    const shutdown = async (signal: NodeJS.Signals) => {
      logger.info({ signal }, 'Received shutdown signal');
      server.close(async (err) => {
        if (err) {
          logger.error({ err }, 'Error during HTTP server close');
          process.exit(1);
        }
        await disconnectMongo();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1); // Exit if DB connection fails
  }
};

startServer();
