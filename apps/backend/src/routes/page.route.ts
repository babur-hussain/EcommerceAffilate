import { Router, Request, Response } from "express";
import { sduiCache } from "../services/sdui-cache.service";

const router = Router();

/**
 * Extract user ID from Authorization header (if present)
 */
function extractUserId(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return undefined;
    }

    // Decode JWT to get user ID (basic implementation)
    // In production, use proper JWT verification
    try {
        const token = authHeader.split(' ')[1];
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return payload.userId || payload.sub || payload._id;
    } catch {
        return undefined;
    }
}

// GET /api/layout/:slug - Fetch layout for specific page (with caching)
router.get("/layout/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        // Use cache-first strategy
        const result = await sduiCache.getLayout(slug);

        // Set cache headers for debugging
        res.setHeader('X-Cache', result.fromCache ? 'HIT' : 'MISS');
        res.setHeader('X-Cache-Key', result.cacheKey || 'none');

        // Set HTTP cache headers
        res.setHeader('Cache-Control', 'public, max-age=60');

        res.json(result.data);
    } catch (error: any) {
        if (error.message?.includes('not found')) {
            return res.status(404).json({ message: "Layout not found" });
        }
        res.status(500).json({ error: "Failed to fetch layout", message: error.message });
    }
});

// GET /api/homepage - Home page with personalized caching
router.get("/homepage", async (req: Request, res: Response) => {
    try {
        const userId = extractUserId(req);

        // Use cache-first strategy with optional user personalization
        const result = await sduiCache.getHomeLayout(userId);

        // Set cache headers for debugging
        res.setHeader('X-Cache', result.fromCache ? 'HIT' : 'MISS');
        res.setHeader('X-Cache-Key', result.cacheKey || 'none');

        // Shorter cache for personalized content
        const maxAge = userId ? 30 : 120;
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`);

        res.json(result.data);
    } catch (error: any) {
        if (error.message?.includes('not found')) {
            return res.status(404).json({ message: "Home layout not found" });
        }
        res.status(500).json({ error: "Failed to fetch homepage", message: error.message });
    }
});

// POST /api/layout/:slug/invalidate - Invalidate cache (admin only)
router.post("/layout/:slug/invalidate", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        // TODO: Add admin authentication check here

        if (slug === 'home') {
            const count = await sduiCache.invalidateHomeCache();
            return res.json({ success: true, message: `Invalidated ${count} home cache keys` });
        }

        const success = await sduiCache.invalidateLayout(slug);
        res.json({ success, message: `Cache invalidated for: ${slug}` });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to invalidate cache", message: error.message });
    }
});

export default router;
