import http from 'http';
import { env } from './config/env'; // Load env vars first
import app from './app';
import { connectMongo, disconnectMongo } from './config/mongo';
import { logger } from './utils/logger';
import { DispatchService } from './services/dispatch.service';

const PORT = env.PORT;

// Start server only after MongoDB connection is established
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectMongo();

    // Initialize Dispatch Service (Cron Jobs)
    DispatchService.init();

    // Start HTTP server only if DB connection succeeds
    const server = http.createServer(app);

    // Listen on all network interfaces (0.0.0.0) to allow mobile app connections
    server.listen(PORT, '0.0.0.0', () => {
      logger.info({ port: PORT, host: '0.0.0.0' }, 'Backend server running on all network interfaces');
      console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
      console.log(`📱 Mobile devices can connect using your local IP address`);
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

// Forced restart for callbackUrl fix
startServer();
