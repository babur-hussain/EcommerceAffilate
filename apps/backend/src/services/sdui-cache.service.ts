// SDUI Cache Service - Cache-first logic for SDUI layouts
// Implements Redis cache with MongoDB fallback

import { redis } from './redis.service';
import { PageLayout } from '../models/page.layout.model';
import { CacheTTL, CacheKeys } from '../config/redis.config';

export interface CacheResult<T> {
    data: T;
    fromCache: boolean;
    cacheKey?: string;
}

class SDUICacheService {
    private static instance: SDUICacheService;

    private constructor() { }

    public static getInstance(): SDUICacheService {
        if (!SDUICacheService.instance) {
            SDUICacheService.instance = new SDUICacheService();
        }
        return SDUICacheService.instance;
    }

    /**
     * Get home page SDUI with cache-first strategy
     * @param userId - Optional user ID for personalized content
     */
    public async getHomeLayout(userId?: string): Promise<CacheResult<any>> {
        const cacheKey = userId
            ? CacheKeys.HOME_USER(userId)
            : CacheKeys.HOME_GUEST;

        const ttl = userId ? CacheTTL.HOME_USER : CacheTTL.HOME_GUEST;

        return this.getLayoutWithCache(cacheKey, 'home', ttl);
    }

    /**
     * Get any page layout by slug with caching
     * @param slug - Page slug (e.g., 'fashion', 'electronics')
     */
    public async getLayout(slug: string): Promise<CacheResult<any>> {
        const cacheKey = CacheKeys.LAYOUT(slug);
        return this.getLayoutWithCache(cacheKey, slug, CacheTTL.CATEGORY_LAYOUT);
    }

    /**
     * Core cache-first fetch logic
     */
    private async getLayoutWithCache(
        cacheKey: string,
        slug: string,
        ttl: number
    ): Promise<CacheResult<any>> {
        // 1. Try Redis cache first
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log(`[SDUI Cache] HIT for ${cacheKey}`);
                return {
                    data: JSON.parse(cached),
                    fromCache: true,
                    cacheKey,
                };
            }
            console.log(`[SDUI Cache] MISS for ${cacheKey}`);
        } catch (error) {
            console.error(`[SDUI Cache] Redis error for ${cacheKey}:`, error);
            // Continue to MongoDB fallback
        }

        // 2. Cache miss - fetch from MongoDB
        const layout = await PageLayout.findOne({
            pageSlug: slug,
            isActive: true
        }).lean();

        if (!layout) {
            throw new Error(`Layout not found for slug: ${slug}`);
        }

        // 3. Store in Redis (non-blocking)
        this.cacheLayout(cacheKey, layout, ttl);

        return {
            data: layout,
            fromCache: false,
            cacheKey,
        };
    }

    /**
     * Cache a layout in Redis (non-blocking)
     */
    private async cacheLayout(key: string, data: any, ttl: number): Promise<void> {
        try {
            const serialized = JSON.stringify(data);
            await redis.setex(key, ttl, serialized);
            console.log(`[SDUI Cache] Stored ${key} with TTL ${ttl}s`);
        } catch (error) {
            // Non-fatal - log and continue
            console.error(`[SDUI Cache] Failed to cache ${key}:`, error);
        }
    }

    /**
     * Invalidate cache for a specific layout
     * Call this when layout is updated via admin
     */
    public async invalidateLayout(slug: string): Promise<boolean> {
        const cacheKey = CacheKeys.LAYOUT(slug);
        console.log(`[SDUI Cache] Invalidating ${cacheKey}`);
        return redis.del(cacheKey);
    }

    /**
     * Invalidate all home caches (guest + all users)
     */
    public async invalidateHomeCache(): Promise<number> {
        console.log('[SDUI Cache] Invalidating all home caches');
        const count = await redis.delPattern('home:*');
        return count;
    }

    /**
     * Invalidate user-specific cache
     */
    public async invalidateUserCache(userId: string): Promise<boolean> {
        const cacheKey = CacheKeys.HOME_USER(userId);
        console.log(`[SDUI Cache] Invalidating ${cacheKey}`);
        return redis.del(cacheKey);
    }

    /**
     * Warm up cache by pre-fetching common layouts
     * Call this on server startup or via scheduled job
     */
    public async warmupCache(slugs: string[] = ['home', 'fashion', 'electronics', 'beauty']): Promise<void> {
        console.log(`[SDUI Cache] Warming up cache for: ${slugs.join(', ')}`);

        for (const slug of slugs) {
            try {
                if (slug === 'home') {
                    await this.getHomeLayout();
                } else {
                    await this.getLayout(slug);
                }
            } catch (error) {
                console.error(`[SDUI Cache] Failed to warm up ${slug}:`, error);
            }
        }

        console.log('[SDUI Cache] Cache warmup complete');
    }
}

// Export singleton instance
export const sduiCache = SDUICacheService.getInstance();
export default sduiCache;
