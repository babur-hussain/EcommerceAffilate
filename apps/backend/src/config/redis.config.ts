// Redis Configuration - Redis Cloud connection (non-TLS)
// Production-safe defaults with timeouts and retry limits

export interface RedisConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
    db?: number;
    maxRetriesPerRequest: number;
    connectTimeout: number;
    commandTimeout: number;
    retryDelayOnFailover: number;
    enableOfflineQueue: boolean;
    lazyConnect: boolean;
}

// Redis Cloud configuration (non-TLS endpoint)
export const redisConfig: RedisConfig = {
    host: process.env.REDIS_HOST || 'redis-14835.crce179.ap-south-1-1.ec2.cloud.redislabs.com',
    port: parseInt(process.env.REDIS_PORT || '14835', 10),
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD || 'QTUnzdCEs5klMt2IMl50jG0OURuCsnit',
    db: parseInt(process.env.REDIS_DB || '0', 10),
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,    // 10 seconds to connect (cloud may be slower)
    commandTimeout: 5000,     // 5 seconds per command
    retryDelayOnFailover: 100,
    enableOfflineQueue: false, // Fail fast if disconnected
    lazyConnect: true,         // Don't connect until first command
};

// TTL values in seconds
export const CacheTTL = {
    HOME_SHELL: 30 * 60,        // 30 minutes - static nav/headers
    HOME_GUEST: 5 * 60,         // 5 minutes - guest home SDUI
    HOME_USER: 60,              // 60 seconds - personalized user home
    CATEGORY_LAYOUT: 10 * 60,   // 10 minutes - category layouts
    FEATURE_BLOCK: 10 * 60,     // 10 minutes - feature-specific blocks
    GROCERY_PRODUCTS: 5 * 60,   // 5 minutes - grocery product listings
    CATEGORIES: 10 * 60,        // 10 minutes - category lookups
} as const;

// Cache key prefixes
export const CacheKeys = {
    HOME_SHELL: (version: number) => `home:shell:v${version}`,
    HOME_GUEST: 'home:guest:v1',
    HOME_USER: (userId: string) => `home:user:${userId}`,
    LAYOUT: (slug: string) => `layout:${slug}`,
    FEATURE: (name: string) => `feature:${name}`,
    GROCERY_PRODUCTS: (queryHash: string) => `grocery:products:${queryHash}`,
    CATEGORIES: (parentId: string) => `categories:${parentId}`,
} as const;
