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
import homepageRouter from "./routes/homepage.route";
import adminHomepageRouter from "./routes/admin.homepage.route";
import categoryRouter from "./routes/category.route";
import adminCategoryRouter from "./routes/admin.category.route";
import adminAttributeRouter from "./routes/admin.attribute.route";
import attributeRouter from "./routes/attribute.route";
import adminTrustBadgeRouter from "./routes/admin.trustBadge.route";
import superAdminRouter from "./routes/super-admin.route";
import offerRouter from "./routes/offer.route";
import deliveryRuleRouter from "./routes/deliveryRule.route";
import deliveryRouter from "./routes/delivery.route";
import { requestLogger } from "./middlewares/requestLogger";
import { logger, loggerWithContext } from "./utils/logger";

const app: Express = express();

// CORS: allow web frontend and dashboard origins (MUST be before helmet)
// In development, allow all origins for mobile app compatibility
// In production, use whitelist for security
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003", // Super Admin Panel
      "http://192.168.29.193:3000", // Previous IP
      "http://192.168.29.240:3000", // Current IP
    ]
    : true, // Allow all origins in development
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
app.use(express.json({ limit: "100kb" }));

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
app.use("/api", meRouter);
app.use("/api", homepageRouter);
app.use("/api", adminHomepageRouter);
app.use("/api", categoryRouter);
app.use("/api", attributeRouter);
app.use("/api", superAdminRouter);
app.use("/api", offerRouter);
app.use("/api/delivery-rules", deliveryRuleRouter);
app.use("/api/delivery", deliveryRouter);
app.use('/api/super-admin', adminCategoryRouter);
app.use('/api/super-admin', adminAttributeRouter);
app.use('/api/super-admin', adminTrustBadgeRouter);

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
