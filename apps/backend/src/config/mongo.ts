import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 30_000;

let isConnected = false;
let connectPromise: Promise<void> | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
let isShuttingDown = false;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const connectWithRetry = async (attempt = 1): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 45_000,
      heartbeatFrequencyMS: 10_000,
      family: 4, // Force IPv4
    });
    isConnected = true;
    logger.info({ attempt }, 'MongoDB connected');
  } catch (error) {
    isConnected = false;
    const nextAttempt = attempt + 1;
    const delay = Math.min(BASE_DELAY_MS * 2 ** (attempt - 1), MAX_DELAY_MS);
    logger.error({ err: error, attempt, delay }, 'MongoDB connection error');

    if (attempt >= MAX_RETRIES) {
      throw error; // Bubble after exhausting retries so server fails fast on misconfig
    }

    await wait(delay);
    return connectWithRetry(nextAttempt);
  }
};

const scheduleReconnect = (): void => {
  if (isShuttingDown || reconnectTimeout) return;

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    connectMongo().catch((err) => {
      logger.error({ err }, 'MongoDB reconnect failed');
    });
  }, BASE_DELAY_MS);
};

export const connectMongo = async (): Promise<void> => {
  if (isConnected) {
    logger.info('MongoDB already connected');
    return;
  }

  if (!connectPromise) {
    connectPromise = connectWithRetry();
  }

  try {
    await connectPromise;
  } finally {
    connectPromise = null;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('MongoDB disconnected');
  scheduleReconnect();
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  logger.info('MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB connection error');
  scheduleReconnect();
});

export const disconnectMongo = async (): Promise<void> => {
  isShuttingDown = true;

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('MongoDB connection closed');
  } catch (err) {
    logger.error({ err }, 'Error closing MongoDB connection');
  } finally {
    connectPromise = null;
    isShuttingDown = false;
  }
};
