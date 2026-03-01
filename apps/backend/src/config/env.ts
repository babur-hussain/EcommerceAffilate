import dotenv from 'dotenv';

dotenv.config();

type Environment = 'development' | 'staging' | 'production';

const NODE_ENV = (process.env.NODE_ENV as Environment) || 'development';
const isProduction = NODE_ENV === 'production';

const required = (key: string): string => {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
};

const numberFromEnv = (key: string, fallback: number): number => {
  const raw = process.env[key];
  if (raw === undefined) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const MONGODB_URI = required('MONGODB_URI');

const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? '' : 'dev-secret');
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET');
}

export const env = {
  NODE_ENV,
  isProduction,
  PORT: numberFromEnv('PORT', 4000),
  MONGODB_URI,
  JWT_SECRET,
  IMAGE_CDN_BASE_URL: process.env.IMAGE_CDN_BASE_URL,
  payments: {
    provider: process.env.PAYMENT_PROVIDER || 'MOCK',
    razorpay: {
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    },
    paytm: {
      merchantId: process.env.PAYTM_MID || '',
      merchantKey: process.env.PAYTM_MKEY || '',
      website: process.env.PAYTM_WEBSITE || 'WEBSTAGING',
      isProduction: process.env.PAYTM_ENV === 'PROD',
    },
  },
  shiprocket: {
    email: process.env.SHIPROCKET_EMAIL || '',
    password: process.env.SHIPROCKET_PASSWORD || '',
  },
  ads: {
    clickCost: numberFromEnv('CLICK_COST', isProduction ? 5 : 1),
    impressionCost: numberFromEnv('IMPRESSION_COST', isProduction ? 1 : 0),
  },
  cache: {
    rankingHomeTtl: numberFromEnv('CACHE_RANKING_HOME_TTL', 30),
    rankingCategoryTtl: numberFromEnv('CACHE_RANKING_CATEGORY_TTL', 60),
    rankingSearchTtl: numberFromEnv('CACHE_RANKING_SEARCH_TTL', 30),
  },
  rateLimit: {
    global: {
      windowMs: numberFromEnv('RATE_LIMIT_GLOBAL_WINDOW_MS', 60_000),
      max: numberFromEnv('RATE_LIMIT_GLOBAL_MAX', 200),
    },
    auth: {
      windowMs: numberFromEnv('RATE_LIMIT_AUTH_WINDOW_MS', 60_000),
      max: numberFromEnv('RATE_LIMIT_AUTH_MAX', 20),
    },
    sensitive: {
      windowMs: numberFromEnv('RATE_LIMIT_SENSITIVE_WINDOW_MS', 60_000),
      max: numberFromEnv('RATE_LIMIT_SENSITIVE_MAX', 30),
    },
    views: {
      windowMs: numberFromEnv('RATE_LIMIT_VIEWS_WINDOW_MS', 60_000),
      max: numberFromEnv('RATE_LIMIT_VIEWS_MAX', 20),
    },
    clicks: {
      windowMs: numberFromEnv('RATE_LIMIT_CLICKS_WINDOW_MS', 60_000),
      max: numberFromEnv('RATE_LIMIT_CLICKS_MAX', 10),
    },
  },
  cors: {
    origins: process.env.CORS_ALLOWED_ORIGINS
      ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(s => s.trim())
      : [], // empty = use defaults per NODE_ENV
  },
  security: {
    superAdminEmails: process.env.SUPER_ADMIN_EMAILS
      ? process.env.SUPER_ADMIN_EMAILS.split(',').map(s => s.trim().toLowerCase())
      : [],
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || '72.62.196.61:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'ecommerce-backend',
  },
};
