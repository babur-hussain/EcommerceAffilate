// Redis Service - Singleton pattern with connection pooling
// Configured for Redis Cloud

import Redis from 'ioredis';
import { redisConfig } from '../config/redis.config';
import { logger } from '../utils/logger';

class RedisService {
    private static instance: RedisService;
    private client: Redis | null = null;
    private isConnected: boolean = false;
    private connectionPromise: Promise<void> | null = null;

    private constructor() { }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    /**
     * Initialize Redis connection (lazy)
     */
    private async connect(): Promise<void> {
        if (this.isConnected && this.client) {
            return;
        }

        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                this.client = new Redis({
                    host: redisConfig.host,
                    port: redisConfig.port,
                    username: redisConfig.username,
                    password: redisConfig.password,
                    db: redisConfig.db,
                    maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
                    connectTimeout: redisConfig.connectTimeout,
                    commandTimeout: redisConfig.commandTimeout,
                    lazyConnect: false,
                    enableOfflineQueue: true, // Buffer commands while connecting
                    retryStrategy: (times) => {
                        if (times > 3) {
                            console.error('[Redis] Max connection retries exceeded');
                            return null;
                        }
                        const delay = Math.min(times * 200, 3000);
                        logger.info(`[Redis] Retrying connection in ${delay}ms (attempt ${times})`);
                        return delay;
                    },
                });

                this.client.on('ready', () => {
                    logger.info('[Redis] Connected to Redis Cloud and ready');
                    this.isConnected = true;
                    resolve();
                });

                this.client.on('error', (err) => {
                    logger.error({ err }, '[Redis] Connection error');
                    // Don't set isConnected false here, let 'close' handle it
                });

                this.client.on('close', () => {
                    logger.warn('[Redis] Connection closed');
                    this.isConnected = false;
                });

                this.client.on('reconnecting', () => {
                    logger.info('[Redis] Reconnecting...');
                });

                // Timeout for initial connection
                setTimeout(() => {
                    if (!this.isConnected) {
                        logger.error('[Redis] Connection timeout');
                        reject(new Error('Redis connection timeout'));
                    }
                }, redisConfig.connectTimeout);

            } catch (error) {
                logger.error({ err: error }, '[Redis] Failed to create client');
                this.connectionPromise = null;
                reject(error);
            }
        });

        return this.connectionPromise;
    }

    /**
     * Get a value from Redis cache
     * Returns null on error (graceful degradation)
     */
    public async get(key: string): Promise<string | null> {
        try {
            await this.connect();
            if (!this.client) return null;
            return await this.client.get(key);
        } catch (error) {
            logger.error({ key, err: error }, '[Redis] GET error');
            return null;
        }
    }

    /**
     * Set a value in Redis cache with TTL
     * Silently fails on error (non-blocking)
     */
    public async setex(key: string, ttl: number, value: string): Promise<boolean> {
        try {
            await this.connect();
            if (!this.client) return false;
            await this.client.setex(key, ttl, value);
            return true;
        } catch (error) {
            logger.error({ key, err: error }, '[Redis] SETEX error');
            return false;
        }
    }

    /**
     * Set a value in Redis cache (no expiry)
     */
    public async set(key: string, value: string): Promise<boolean> {
        try {
            await this.connect();
            if (!this.client) return false;
            await this.client.set(key, value);
            return true;
        } catch (error) {
            logger.error({ key, err: error }, '[Redis] SET error');
            return false;
        }
    }

    /**
     * Delete a key from Redis
     */
    public async del(key: string): Promise<boolean> {
        try {
            await this.connect();
            if (!this.client) return false;
            await this.client.del(key);
            return true;
        } catch (error) {
            logger.error({ key, err: error }, '[Redis] DEL error');
            return false;
        }
    }

    /**
     * Delete keys matching a pattern
     */
    public async delPattern(pattern: string): Promise<number> {
        try {
            await this.connect();
            if (!this.client) return 0;

            const keys = await this.client.keys(pattern);
            if (keys.length === 0) return 0;

            return await this.client.del(...keys);
        } catch (error) {
            logger.error({ pattern, err: error }, '[Redis] DEL pattern error');
            return 0;
        }
    }

    /**
     * Health check for Redis connection
     */
    public async isHealthy(): Promise<boolean> {
        try {
            await this.connect();
            if (!this.client) return false;
            const pong = await this.client.ping();
            return pong === 'PONG';
        } catch (error) {
            logger.error({ err: error }, '[Redis] Health check failed');
            return false;
        }
    }

    /**
     * Get connection status
     */
    public getStatus(): { connected: boolean; host: string; port: number } {
        return {
            connected: this.isConnected,
            host: redisConfig.host,
            port: redisConfig.port,
        };
    }

    /**
     * Test connection - useful for startup verification
     */
    public async testConnection(): Promise<boolean> {
        try {
            await this.connect();
            if (!this.client) return false;

            // Simple ping test
            const pong = await this.client.ping();
            if (pong !== 'PONG') return false;

            // Test set/get
            const testKey = '__redis_test__';
            await this.client.set(testKey, 'ok');
            const result = await this.client.get(testKey);
            await this.client.del(testKey);

            logger.info('[Redis] Connection test passed');
            return result === 'ok';
        } catch (error) {
            logger.error({ err: error }, '[Redis] Connection test failed');
            return false;
        }
    }

    /**
     * Graceful shutdown
     */
    public async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.quit();
            this.client = null;
            this.isConnected = false;
            this.connectionPromise = null;
            logger.info('[Redis] Disconnected gracefully');
        }
    }
}

// Export singleton instance
export const redis = RedisService.getInstance();
export default redis;
