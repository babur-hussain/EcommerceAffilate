import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
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

// CORS: allow web frontend and dashboard origins (MUST be before helmet)
// In development, allow all origins for mobile app compatibility
// In production, use whitelist for security
const whitelistRegex = [
  /^http:\/\/localhost:\d+$/, // Allow any localhost port
  /^https:\/\/.*\.localforvocalstartup\.com$/, // Allow subdomains
  /^https:\/\/localforvocalstartup\.com$/,
  /^https:\/\/api\.lfvs\.in$/ // Allow self
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin matches any regex
    const isAllowed = whitelistRegex.some(regex => regex.test(origin));

    if (isAllowed) {
      return callback(null, true);
    } else {
      console.log(`🚫 CORS Blocked: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Request-Id"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Security middleware
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

// Body parsing with size limits (MUST come BEFORE multer for JSON requests)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

// DEBUG: Log ALL incoming requests
app.use((req, res, next) => {
  console.log(
    `🌐 INCOMING: ${req.method} ${req.url} - Auth: ${req.headers.authorization ? "YES" : "NO"
    }`
  );
  if (req.url.includes("/business/register")) {
    console.log(`🔍 BUSINESS REGISTER REQUEST DETECTED`);
    console.log(`📊 Headers:`, JSON.stringify(req.headers, null, 2));
  }
  next();
});

app.use(requestLogger);

// Handle OPTIONS requests for CORS preflight
app.options("*", cors());

// DEBUG: Test route to verify routing works
app.get("/api/test-early", (req, res) => {
  console.log("🎯 EARLY TEST ROUTE HIT!");
  res.json({ message: "Early test route works!" });
});

// Routes
app.use(healthRouter);
app.use("/api", authRouter);
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
app.use("/api", categoryRouter);
app.use("/api", attributeRouter);
app.use("/api", superAdminRouter);
app.use("/api", offerRouter);
app.use("/api/delivery-rules", deliveryRuleRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/partner", partnerRouter);
app.use("/api", shiprocketRouter);
app.use("/api", returnRouter);

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
