import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import multer from "multer";
import { env } from "./config/env";
import { globalLimiter, authLimiter, sensitiveLimiter, userLimiter } from "./middlewares/rateLimiter";
import healthRouter from "./routes/health.route";
import productRouter from "./routes/product.route";
import sponsorshipRouter from "./routes/sponsorship.route";
import rankingRouter from "./routes/ranking.route";
import adminRouter from "./routes/admin.route";
import adminAnalyticsRouter from "./routes/admin.analytics.route";
import adminDashboardRouter from "./routes/admin.dashboard.route";
import adminInfluencerRouter from "./routes/admin.influencer.route";
import adminBusinessRouter from "./routes/admin.business.route";
import searchRouter from "./routes/search.route"; // New Search Router
import authRouter from "./routes/auth.route";
import brandRouter from "./routes/brand.route";
import cartRouter from "./routes/cart.route";
import paymentRouter from "./routes/payment.route";
import addressRouter from "./routes/address.route";
import orderRouter from "./routes/order.route";
import reviewRouter from "./routes/review.route";
import wishlistRouter from "./routes/wishlist.route";
import notificationRouter from "./routes/notification.route";
import adminAuditRouter from "./routes/admin.audit.route";
import recommendationRouter from "./routes/recommendation.route";
import couponRouter from "./routes/coupon.route";
import influencerRouter from "./routes/influencer.route";
import influencersRouter from "./routes/influencers.route";
import businessRouter from "./routes/business.route";
import businessUsersRouter from "./routes/business.users.route";
import uploadRouter from "./routes/upload.route";
import meRouter from "./routes/me.route";
import pageRouter from "./routes/page.route";
import adminPageRouter from "./routes/admin.page.route";
import rbacRouter from "./routes/rbac.route";
import serviceTypeRouter from "./routes/serviceType.route";
import serviceRouter from "./routes/service.route";
import availabilityRouter from "./routes/availability.route";
import bookingRouter from "./routes/booking.route";
import serviceCategoryRouter from "./routes/serviceCategory.route";
import serviceSubCategoryRouter from "./routes/serviceSubCategory.route";
import serviceProviderRouter from "./routes/serviceProvider.route";
import serviceReviewRouter from "./routes/serviceReview.route";
import serviceAnalyticsRouter from "./routes/serviceAnalytics.route";

// ... existing code ...


import categoryRouter from "./routes/category.route";
import adminCategoryRouter from "./routes/admin.category.route";
import adminAttributeRouter from "./routes/admin.attribute.route";
import attributeRouter from "./routes/attribute.route";
import adminTrustBadgeRouter from "./routes/admin.trustBadge.route";
import adminLayoutRouter from "./routes/admin.layout.route";
import advancedLayoutRouter from "./routes/advanced-layout.route";
import superAdminRouter from "./routes/super-admin.route";
import offerRouter from "./routes/offer.route";
import deliveryRuleRouter from "./routes/deliveryRule.route";
import deliveryRouter from "./routes/delivery.route";
import walletRouter from "./routes/wallet.route";
import partnerRouter from "./routes/partner.route";
import shiprocketRouter from "./routes/shiprocket.route";
import returnRouter from "./routes/return.route";
import { requestLogger } from "./middlewares/requestLogger";
import { logger, loggerWithContext } from "./utils/logger";

const app: Express = express();

// Trust first proxy (nginx) — required for rate limiting and correct IP detection
app.set('trust proxy', 1);

// CORS: environment-configurable origin whitelist
// - In development: allows localhost ports + env-specified origins
// - In production: STRICT whitelist from CORS_ALLOWED_ORIGINS env var only
// Mobile apps (no origin header) are always allowed through
const envOrigins = env.cors.origins; // from CORS_ALLOWED_ORIGINS

const defaultOrigins = [
    'https://localforvocalstartup.com',
    'https://www.localforvocalstartup.com',
    'https://admin.localforvocalstartup.com',
    'https://super-admin-rust.vercel.app',
    'https://seller.localforvocalstartup.com',
    'https://www.seller.localforvocalstartup.com',
    'https://influencers.localforvocalstartup.com',
    'https://www.influencers.localforvocalstartup.com',
    'https://api.lfvs.in',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

const productionOrigins = envOrigins.length > 0
  ? Array.from(new Set([...envOrigins, ...defaultOrigins]))
  : defaultOrigins;

const developmentRegex = /^http:\/\/localhost:\d+$/; // Any localhost port

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Always allow localhost in any environment (for dashboard dev)
    if (developmentRegex.test(origin)) {
      return callback(null, true);
    }

    if (env.isProduction) {
      // Production: strict whitelist + localhost
      if (productionOrigins.includes(origin)) {
        return callback(null, true);
      }
    } else {
      // Development/Staging: allow env-specified origins
      if (envOrigins.length > 0 && envOrigins.includes(origin)) {
        return callback(null, true);
      }
      // In dev, also allow the production domains for testing
      if (productionOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    console.log(`🚫 CORS Blocked: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: [
    "Content-Length",
    "X-Request-Id",
    "RateLimit-Limit",
    "RateLimit-Remaining",
    "RateLimit-Reset",
    "Retry-After",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400, // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// Security middleware
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: false, // CSP handled at CDN/proxy layer
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true }, // 2 years
    noSniff: true,
    frameguard: { action: "deny" },
  })
);

// Response compression (gzip/brotli)
app.use(compression({
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress SSE streams
    if (req.path.includes('/sse/')) return false;
    return compression.filter(req, res);
  },
}));

// Body parsing with size limits
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));

// Rate limiters are imported from middlewares/rateLimiter.ts
// All limits are configurable via environment variables:
//   RATE_LIMIT_GLOBAL_MAX (default: 200/min)
//   RATE_LIMIT_AUTH_MAX (default: 20/min)
//   RATE_LIMIT_SENSITIVE_MAX (default: 30/min)

// Request timeout — 30 seconds
app.use((req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(30000, () => {
    if (!res.headersSent) {
      res.status(408).json({ error: "Request timeout" });
    }
  });
  next();
});

// Serve static files from public directory (for AASA file)
import path from "path";
app.use('/.well-known', express.static(path.join(__dirname, '../public/.well-known'), {
  setHeaders: (res, filePath) => {
    // AASA file must be served with application/json content type
    if (filePath.endsWith('apple-app-site-association')) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

// File upload handling with multer (only for multipart/form-data)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});
// Only use multer on routes that need file uploads
// Don't apply globally as it interferes with JSON parsing

app.use(requestLogger);

// Handle OPTIONS requests for CORS preflight
app.options("*", cors());

// Apply rate limiters (tiered)
app.use("/api", globalLimiter);          // 200 req/min per IP (all API routes)
app.use("/api/auth", authLimiter);       // 20 req/min per IP (auth routes)

// Sensitive operations get additional rate limiting
app.use("/api/payments", sensitiveLimiter);     // 30 req/min
app.use("/api/orders", sensitiveLimiter);       // 30 req/min
app.use("/api/super-admin", sensitiveLimiter);  // 30 req/min
app.use("/api/admin", sensitiveLimiter);        // 30 req/min
app.use("/api/wallet", sensitiveLimiter);       // 30 req/min

// Routes
app.use(healthRouter);
app.use("/api", authRouter); // auth routes also hit global + authLimiter
app.use("/api", searchRouter); // Use Search Router
app.use("/api", brandRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", reviewRouter);
app.use("/api", wishlistRouter);
app.use("/api", notificationRouter);
app.use("/api", sponsorshipRouter);
app.use("/api", rankingRouter);
app.use("/api", adminRouter);
app.use("/api", adminAnalyticsRouter);
app.use("/api", adminDashboardRouter);
app.use("/api", adminInfluencerRouter);
app.use("/api", adminBusinessRouter);
app.use("/api", paymentRouter);
app.use("/api", addressRouter);
app.use("/api", recommendationRouter);
app.use("/api", adminAuditRouter);
app.use("/api", couponRouter);
app.use("/api", businessRouter);
app.use("/api", businessUsersRouter);
app.use("/api", uploadRouter);
app.use("/api", influencerRouter);
app.use("/api", influencersRouter);
app.use("/api", walletRouter);
app.use("/api", meRouter);
app.use("/api", pageRouter);
app.use("/api", adminPageRouter);
app.use("/api/rbac", rbacRouter);
app.use("/api/service-types", serviceTypeRouter);
app.use("/api/services", serviceRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/service-categories", serviceCategoryRouter);
app.use("/api/service-subcategories", serviceSubCategoryRouter);
app.use("/api/service-providers", serviceProviderRouter);
app.use("/api/service-reviews", serviceReviewRouter);
app.use("/api/service-analytics", serviceAnalyticsRouter);
app.use("/api", categoryRouter);
app.use("/api", attributeRouter);
app.use("/api", superAdminRouter);
app.use("/api", offerRouter);
app.use("/api/delivery-rules", deliveryRuleRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/partner", partnerRouter);
app.use("/api", shiprocketRouter);
app.use("/api", returnRouter);

import homepageRouter from "./routes/homepage.route";
import storyRouter from "./routes/story.route";
app.use("/api/stories", storyRouter);
app.use('/api/super-admin', adminCategoryRouter);
app.use('/api/super-admin', adminAttributeRouter);
app.use('/api/super-admin', adminTrustBadgeRouter);
import browserHistoryRouter from "./routes/browserHistory.route";

// ... existing code ...

app.use('/api', adminLayoutRouter);
app.use('/api', advancedLayoutRouter);
app.use('/api', browserHistoryRouter);
app.use('/api', homepageRouter);

// Kafka SSE and Event Tracking routes
import sseRouter from "./routes/sse.route";
import eventsRouter from "./routes/events.route";
app.use("/api", sseRouter);
app.use("/api", eventsRouter);


// Global error handler
// Note: keep last
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req as any)?.requestId;
  const userId = (req as any)?.user?.id;
  const child = loggerWithContext({ requestId, userId });

  child.error(
    {
      err: {
        message: err?.message,
        stack: err?.stack,
      },
      path: req.originalUrl,
      method: req.method,
    },
    "Unhandled error"
  );

  const status = typeof err?.status === "number" ? err.status : 500;
  res.status(status).json({ error: "Internal server error", requestId });
});

export default app;
