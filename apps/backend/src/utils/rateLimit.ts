import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const viewRateLimiter = rateLimit({
  windowMs: env.rateLimit.views.windowMs,
  max: env.rateLimit.views.max,
  standardHeaders: true,
  legacyHeaders: false,
});

export const clickRateLimiter = rateLimit({
  windowMs: env.rateLimit.clicks.windowMs,
  max: env.rateLimit.clicks.max,
  standardHeaders: true,
  legacyHeaders: false,
});
