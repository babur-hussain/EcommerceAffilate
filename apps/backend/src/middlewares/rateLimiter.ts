import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { Request } from 'express';

/**
 * Centralized rate limiters — all configurable via environment variables.
 *
 * Why tiered limits?
 * - Global: prevents IP-level DDoS / scraping (200 req/min default)
 * - Auth: protects login/register from brute-force (20 req/min)
 * - Sensitive: slows abuse on payment/order/admin routes (30 req/min)
 * - User: prevents authenticated users from abusing APIs (100 req/min per userId)
 *
 * All return proper 429 status + standard rate-limit headers:
 *   RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, Retry-After
 */

/** Global API limiter — applied to all /api routes */
export const globalLimiter = rateLimit({
    windowMs: env.rateLimit.global.windowMs,
    max: env.rateLimit.global.max,
    standardHeaders: 'draft-7', // RateLimit-* headers (RFC draft)
    legacyHeaders: false,       // Disable X-RateLimit-* headers
    message: {
        error: 'Too many requests, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
    },
    skip: (req) => req.path === '/health' || req.path === '/ready',
});

/** Auth-specific limiter — login, register, Google auth */
export const authLimiter = rateLimit({
    windowMs: env.rateLimit.auth.windowMs,
    max: env.rateLimit.auth.max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        error: 'Too many authentication attempts, please try again later',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
    },
});

/** Sensitive operation limiter — payments, orders, admin write operations */
export const sensitiveLimiter = rateLimit({
    windowMs: env.rateLimit.sensitive.windowMs,
    max: env.rateLimit.sensitive.max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        error: 'Too many requests to this endpoint, please try again later',
        code: 'SENSITIVE_RATE_LIMIT_EXCEEDED',
    },
});

/**
 * User-based limiter — keyed by authenticated user ID.
 * Falls back to IP if no user is attached (unauthenticated request).
 * This prevents a single user from consuming disproportionate resources
 * even from different IPs (e.g., using a VPN pool).
 */
export const userLimiter = rateLimit({
    windowMs: 60_000,          // 1 minute window
    max: 100,                  // 100 requests per user per minute
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
        const user = (req as any).user;
        return user?.id || req.ip || 'unknown';
    },
    message: {
        error: 'You are making too many requests, please slow down',
        code: 'USER_RATE_LIMIT_EXCEEDED',
    },
});
