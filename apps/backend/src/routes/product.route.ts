import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/product.model";
import { Brand } from "../models/brand.model";
import { calculatePopularityScore } from "../services/popularity.service";
import { consumeClickBudget } from "../services/sponsorship.service";
import { clearCacheByPrefix, RANKING_CACHE_PREFIX } from "../utils/cache";
import { viewRateLimiter, clickRateLimiter } from "../utils/rateLimit";
import { requireBrand, requireAuth } from "../middlewares/rbac";
import { requireProductOwnership } from "../utils/ownership";
import { buildOptimizedVariants, resolvePrimaryImage } from "../utils/image";
import { getCategoryMeta } from "../utils/categoryMeta";

const router = Router();

// POST /api/products - Create a product
router.post("/products", requireBrand, async (req: Request, res: Response) => {
  try {
    const {
      title,
      price,
      category,
      image,
      description,
      brand,
      images,
      primaryImage,
      thumbnailImage,
      brandId,
    } = req.body;

    const authUser = (req as any).user as
      | { id?: string; role?: string; businessId?: string }
      | undefined;
    if (!authUser?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Basic validation
    if (!title || !price || !category || !image) {
      res.status(400).json({
        error: "Missing required fields: title, price, category, image",
      });
      return;
    }

    if (typeof price !== "number" || price <= 0) {
      res.status(400).json({
        error: "Price must be a number greater than 0",
      });
      return;
    }

    // Validate images array if provided
    if (images && !Array.isArray(images)) {
      res.status(400).json({
        error: "Images must be an array",
      });
      return;
    }

    if (!brandId || !mongoose.Types.ObjectId.isValid(brandId)) {
      return res
        .status(400)
        .json({ error: "brandId is required and must be valid" });
    }

    const brandDoc = await Brand.findById(brandId).select(
      "businessId name isActive"
    );
    if (!brandDoc || !brandDoc.isActive) {
      return res.status(404).json({ error: "Brand not found or inactive" });
    }

    if (authUser.role !== "ADMIN") {
      if (!authUser.businessId) {
        return res.status(403).json({ error: "Business context is required" });
      }
      if (brandDoc.businessId.toString() !== authUser.businessId) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    // Create product - NEVER accept sponsoredScore or popularityScore from API
    const product = await Product.create({
      title,
      price,
      category,
      image,
      description,
      brand: brand || brandDoc.name,
      images: images || [image], // Use images array or default to single image
      primaryImage: primaryImage || image,
      thumbnailImage: thumbnailImage || image,
      brandId: brandDoc._id,
      businessId: brandDoc.businessId,
      // sponsoredScore and popularityScore will use defaults (0)
      // These are controlled by admin/system logic only
    });

    // Invalidate ranking caches because product catalog changed.
    clearCacheByPrefix(RANKING_CACHE_PREFIX);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to create product",
      message: error.message,
    });
  }
});

// PUT /api/products/:id - Update product (owned brand or admin)
router.put(
  "/products/:id",
  requireBrand,
  requireProductOwnership(),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        title,
        subtitle,
        price,
        mrp,
        category,
        subCategory,
        image,
        description,
        shortDescription,
        brand,
        brandName,
        brandId,
        manufacturerName,
        images,
        primaryImage,
        thumbnailImage,
        stock,
        sku,
        hsnCode,
        productType,
        productCondition,
        countryOfOrigin,
        modelName,
        upc,
        gstRate,
        taxInclusive,
        minOrderQty,
        maxOrderQty,
        lowStockThreshold,
        keyFeatures,
        warrantyDetails,
        warrantyDuration,
        returnable,
        returnWindow,
        netWeight,
        grossWeight,
        dimensions,
        shippingClass,
        processingTime,
        codAvailable,
        seoTitle,
        seoDescription,
        seoKeywords,
        status,
        visibility,
      } = req.body;

      const updates: any = {};
      if (title) updates.title = title;
      if (subtitle !== undefined) updates.subtitle = subtitle;
      if (price !== undefined) updates.price = price;
      if (mrp !== undefined) updates.mrp = mrp;
      if (category) updates.category = category;
      if (subCategory !== undefined) updates.subCategory = subCategory;
      if (image) updates.image = image;
      if (description !== undefined) updates.description = description;
      if (shortDescription !== undefined)
        updates.shortDescription = shortDescription;
      if (brand !== undefined) updates.brand = brand;
      if (brandName !== undefined) updates.brandName = brandName;
      if (brandId !== undefined) updates.brandId = brandId;
      if (manufacturerName !== undefined)
        updates.manufacturerName = manufacturerName;
      if (stock !== undefined) updates.stock = stock;
      if (sku !== undefined) updates.sku = sku;
      if (hsnCode !== undefined) updates.hsnCode = hsnCode;
      if (productType !== undefined) updates.productType = productType;
      if (productCondition !== undefined)
        updates.productCondition = productCondition;
      if (countryOfOrigin !== undefined)
        updates.countryOfOrigin = countryOfOrigin;
      if (modelName !== undefined) updates.modelName = modelName;
      if (upc !== undefined) updates.upc = upc;
      if (gstRate !== undefined) updates.gstRate = gstRate;
      if (taxInclusive !== undefined) updates.taxInclusive = taxInclusive;
      if (minOrderQty !== undefined) updates.minOrderQty = minOrderQty;
      if (maxOrderQty !== undefined) updates.maxOrderQty = maxOrderQty;
      if (lowStockThreshold !== undefined)
        updates.lowStockThreshold = lowStockThreshold;
      if (keyFeatures !== undefined) updates.keyFeatures = keyFeatures;
      if (warrantyDetails !== undefined)
        updates.warrantyDetails = warrantyDetails;
      if (warrantyDuration !== undefined)
        updates.warrantyDuration = warrantyDuration;
      if (returnable !== undefined) updates.returnable = returnable;
      if (returnWindow !== undefined) updates.returnWindow = returnWindow;
      if (netWeight !== undefined) updates.netWeight = netWeight;
      if (grossWeight !== undefined) updates.grossWeight = grossWeight;
      if (dimensions !== undefined) updates.dimensions = dimensions;
      if (shippingClass !== undefined) updates.shippingClass = shippingClass;
      if (processingTime !== undefined) updates.processingTime = processingTime;
      if (codAvailable !== undefined) updates.codAvailable = codAvailable;
      if (seoTitle !== undefined) updates.seoTitle = seoTitle;
      if (seoDescription !== undefined) updates.seoDescription = seoDescription;
      if (seoKeywords !== undefined) updates.seoKeywords = seoKeywords;
      if (status !== undefined) updates.status = status;
      if (visibility !== undefined) updates.visibility = visibility;
      if (images) {
        if (!Array.isArray(images)) {
          return res.status(400).json({ error: "Images must be an array" });
        }
        updates.images = images;
      }
      if (primaryImage !== undefined) updates.primaryImage = primaryImage;
      if (thumbnailImage !== undefined) updates.thumbnailImage = thumbnailImage;

      const updated = await Product.findByIdAndUpdate(id, updates, {
        new: true,
      });
      if (!updated) {
        return res.status(404).json({ error: "Product not found" });
      }

      clearCacheByPrefix(RANKING_CACHE_PREFIX);
      res.json(updated);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to update product", message: error.message });
    }
  }
);

// PATCH /api/products/:id/status - Activate/deactivate product (owned brand or admin)
router.patch(
  "/products/:id/status",
  requireBrand,
  requireProductOwnership(),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "isActive must be a boolean" });
      }

      const updated = await Product.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: "Product not found" });
      }

      clearCacheByPrefix(RANKING_CACHE_PREFIX);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to update product status",
        message: error.message,
      });
    }
  }
);

// GET /api/products/:id - Get single product by ID
router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const primaryImageResolved = resolvePrimaryImage(product);
    const formatted = {
      ...product,
      primaryImage: primaryImageResolved,
      optimizedImages: buildOptimizedVariants(primaryImageResolved),
      seoTitle: product.metaTitle || product.title,
      seoDescription: product.metaDescription || product.description,
      seoKeywords: product.metaKeywords || [],
      categoryMeta: getCategoryMeta(product.category),
    };

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch product",
      message: error.message,
    });
  }
});

// GET /api/products - Get all active products
router.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isActive: true }).lean();
    const formatted = products.map((p) => {
      const primaryImageResolved = resolvePrimaryImage(p);
      return {
        ...p,
        primaryImage: primaryImageResolved,
        optimizedImages: buildOptimizedVariants(primaryImageResolved),
        seoTitle: p.metaTitle || p.title,
        seoDescription: p.metaDescription || p.description,
        seoKeywords: p.metaKeywords || [],
        categoryMeta: getCategoryMeta(p.category),
      };
    });

    if (formatted.length === 0) {
      // Serve a small public placeholder catalog when DB is empty so the storefront is never blank
      const placeholders = [
        {
          _id: "placeholder-1",
          title: "Noise Cancelling Headphones",
          slug: "demo-noise-cancelling-headphones",
          price: 129.99,
          category: "Electronics",
          brand: "Demo Audio",
          image:
            "https://images.unsplash.com/photo-1518441902117-f6dbe7c38e8c?auto=format&fit=crop&w=900&q=80",
          images: [],
          primaryImage:
            "https://images.unsplash.com/photo-1518441902117-f6dbe7c38e8c?auto=format&fit=crop&w=900&q=80",
          optimizedImages: buildOptimizedVariants(
            "https://images.unsplash.com/photo-1518441902117-f6dbe7c38e8c?auto=format&fit=crop&w=900&q=80"
          ),
          rating: 4.6,
          ratingCount: 842,
          isActive: true,
          isSponsored: false,
          sponsoredScore: 0,
          popularityScore: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          seoTitle: "Noise Cancelling Headphones",
          seoDescription:
            "Wireless over-ear headphones with ANC and 30h battery life",
          seoKeywords: ["headphones", "wireless", "audio"],
          categoryMeta: getCategoryMeta("Electronics"),
        },
        {
          _id: "placeholder-2",
          title: "Smartwatch Fitness Edition",
          slug: "demo-smartwatch-fitness",
          price: 89.99,
          category: "Electronics",
          brand: "Demo Wearables",
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
          images: [],
          primaryImage:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
          optimizedImages: buildOptimizedVariants(
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
          ),
          rating: 4.4,
          ratingCount: 621,
          isActive: true,
          isSponsored: false,
          sponsoredScore: 0,
          popularityScore: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          seoTitle: "Smartwatch Fitness Edition",
          seoDescription:
            "Track workouts, heart rate, and sleep with 7-day battery",
          seoKeywords: ["smartwatch", "fitness", "wearable"],
          categoryMeta: getCategoryMeta("Electronics"),
        },
        {
          _id: "placeholder-3",
          title: "Minimalist Office Chair",
          slug: "demo-minimalist-office-chair",
          price: 159.0,
          category: "Home & Furniture",
          brand: "Demo Living",
          image:
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
          images: [],
          primaryImage:
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
          optimizedImages: buildOptimizedVariants(
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
          ),
          rating: 4.5,
          ratingCount: 312,
          isActive: true,
          isSponsored: false,
          sponsoredScore: 0,
          popularityScore: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          seoTitle: "Minimalist Office Chair",
          seoDescription:
            "Ergonomic mesh back with adjustable height and lumbar support",
          seoKeywords: ["chair", "office", "furniture"],
          categoryMeta: getCategoryMeta("Home & Furniture"),
        },
      ];

      return res.json(placeholders);
    }

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch products",
      message: error.message,
    });
  }
});

// POST /api/products/:id/view - Track a product impression
router.post(
  "/products/:id/view",
  viewRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const session = await mongoose.startSession();
      let views = 0;

      try {
        await session.withTransaction(async () => {
          const product = await Product.findOneAndUpdate(
            { _id: id },
            { $inc: { views: 1 } },
            { new: true, session, select: "views clicks popularityScore" }
          );

          if (!product) {
            throw new Error("NOT_FOUND");
          }

          const newScore = calculatePopularityScore(product);
          if (product.popularityScore !== newScore) {
            product.popularityScore = newScore;
            await product.save({ session });
          }

          views = product.views;
        });
      } finally {
        await session.endSession();
      }

      if (views === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ views });
    } catch (error: any) {
      if (error?.message === "NOT_FOUND") {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(500).json({
        error: "Failed to record product view",
        message: error.message,
      });
    }
  }
);

// POST /api/products/:id/click - Track a product click
router.post(
  "/products/:id/click",
  clickRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const session = await mongoose.startSession();
      let clicks = 0;

      try {
        await session.withTransaction(async () => {
          const product = await Product.findOneAndUpdate(
            { _id: id },
            { $inc: { clicks: 1 } },
            {
              new: true,
              session,
              select: "views clicks popularityScore isSponsored",
            }
          );

          if (!product) {
            throw new Error("NOT_FOUND");
          }

          const newScore = calculatePopularityScore(product);
          if (product.popularityScore !== newScore) {
            product.popularityScore = newScore;
            await product.save({ session });
          }

          clicks = product.clicks;
        });
      } finally {
        await session.endSession();
      }

      if (clicks === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Charge CPC budget for sponsored products if an active campaign exists.
      try {
        await consumeClickBudget(id);
      } catch (billingError: any) {
        return res.status(500).json({
          error: "Failed to charge click budget",
          message: billingError.message,
        });
      }

      res.json({ clicks });
    } catch (error: any) {
      if (error?.message === "NOT_FOUND") {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(500).json({
        error: "Failed to record product click",
        message: error.message,
      });
    }
  }
);

// GET /api/products/seller/my-products - Get products for logged-in seller
router.get(
  "/products/seller/my-products",
  requireAuth,
  requireBrand,
  async (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user as
        | { id?: string; role?: string; businessId?: string }
        | undefined;

      console.log("🔍 Seller My Products - Auth User:", authUser);

      if (!authUser?.businessId) {
        console.log("❌ No businessId found for user");
        return res.status(403).json({
          error: "No business associated with this account",
        });
      }

      console.log("📦 Fetching products for businessId:", authUser.businessId);

      // Find all products belonging to this seller's business
      const products = await Product.find({
        businessId: authUser.businessId,
      }).lean();

      console.log(
        `✅ Found ${products.length} products for business ${authUser.businessId}`
      );

      const formatted = products.map((p) => {
        const primaryImageResolved = resolvePrimaryImage(p);
        return {
          ...p,
          primaryImage: primaryImageResolved,
          optimizedImages: buildOptimizedVariants(primaryImageResolved),
          seoTitle: p.metaTitle || p.title,
          seoDescription: p.metaDescription || p.description,
          seoKeywords: p.metaKeywords || [],
          categoryMeta: getCategoryMeta(p.category),
        };
      });

      res.json(formatted);
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch seller products",
        message: error.message,
      });
    }
  }
);

export default router;
