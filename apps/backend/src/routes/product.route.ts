import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/product.model";
import { Brand } from "../models/brand.model";
import Category from "../models/category.model";
import { TrustBadge } from "../models/trustBadge.model";
import { calculatePopularityScore } from "../services/popularity.service";
import { consumeClickBudget } from "../services/sponsorship.service";
import { clearCacheByPrefix, RANKING_CACHE_PREFIX } from "../utils/cache";
import { viewRateLimiter, clickRateLimiter } from "../utils/rateLimit";
import { requireBrand, requireAuth } from "../middlewares/rbac";
import { requireProductOwnership } from "../utils/ownership";
import { buildOptimizedVariants, resolvePrimaryImage } from "../utils/image";
import { getCategoryMeta } from "../utils/categoryMeta";
import { estimateDeliveryTime } from "../utils/delivery";

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
      shortDescription,
      brand,
      images,
      primaryImage,
      thumbnailImage,
      brandId,
      attributes,
      saleStartDate,
      saleEndDate,
      protectPromiseFee,
      offers,
      lastChanceOffers,
      fees,
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
      shortDescription,
      brand: brand || brandDoc.name,
      images: images || [image], // Use images array or default to single image
      primaryImage: primaryImage || image,
      thumbnailImage: thumbnailImage || image,
      brandId: brandDoc._id,
      businessId: brandDoc.businessId,
      attributes: attributes || [],
      saleStartDate,
      saleEndDate,
      protectPromiseFee,
      offers: offers || [],
      lastChanceOffers: lastChanceOffers || [],
      fees: fees || [],
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
        attributes,
        saleStartDate,
        saleEndDate,
        protectPromiseFee,
        offers,
        lastChanceOffers,
        fees,
        pickupLocation,
        pickupLocationCoordinates,
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
      if (saleStartDate !== undefined) updates.saleStartDate = saleStartDate;
      if (saleEndDate !== undefined) updates.saleEndDate = saleEndDate;
      if (protectPromiseFee !== undefined) updates.protectPromiseFee = protectPromiseFee;
      if (offers !== undefined) updates.offers = offers;
      if (lastChanceOffers !== undefined) updates.lastChanceOffers = lastChanceOffers;
      if (fees !== undefined) updates.fees = fees;
      if (pickupLocation !== undefined) updates.pickupLocation = pickupLocation;
      if (pickupLocationCoordinates !== undefined) updates.pickupLocationCoordinates = pickupLocationCoordinates;

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

      // Check if product exists and is approved before allowing activation
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Only allow activation if product is approved
      if (isActive && product.approvalStatus !== "approved") {
        return res.status(403).json({
          error: "Product must be approved before it can be activated",
          approvalStatus: product.approvalStatus,
        });
      }

      product.isActive = isActive;
      await product.save();

      clearCacheByPrefix(RANKING_CACHE_PREFIX);
      res.json(product);
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to update product status",
        message: error.message,
      });
    }
  }
);

// PATCH /api/products/:id/resubmit - Resubmit rejected product for review
router.patch(
  "/products/:id/resubmit",
  requireBrand,
  requireProductOwnership(),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Only allow resubmit if product was rejected
      if (product.approvalStatus !== "rejected") {
        return res.status(400).json({
          error: "Only rejected products can be resubmitted for review",
          approvalStatus: product.approvalStatus,
        });
      }

      product.approvalStatus = "pending";
      product.approvalNote = undefined;
      await product.save();

      res.json({
        message: "Product resubmitted for review",
        product: {
          _id: product._id,
          title: product.title,
          approvalStatus: product.approvalStatus,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to resubmit product",
        message: error.message,
      });
    }
  }
);

// GET /api/products/public/random - Get random products (for Top Picks etc)
router.get("/products/public/random", async (req: Request, res: Response) => {
  try {
    const count = await Product.countDocuments({ isActive: true });
    // Fetch up to 10 random products
    const randomSize = Math.min(10, count);

    // Aggregation pipeline to get random products
    const products = await Product.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: randomSize } }
    ]);

    // Fetch category details for restriction logic
    const categoryNames = [...new Set(products.map((p) => p.category))];
    const categories = await Category.find({ name: { $in: categoryNames } }).lean();
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = {
        _id: cat._id,
        name: cat.name,
        parentCategory: cat.parentCategory,
      };
      return acc;
    }, {} as Record<string, any>);

    // Format the products similar to other endpoints
    const formatted = products.map((p) => {
      // Since aggregate results are plain objects, we can pass them to resolvePrimaryImage
      const primaryImageResolved = resolvePrimaryImage(p);
      return {
        ...p,
        primaryImage: primaryImageResolved,
        optimizedImages: buildOptimizedVariants(primaryImageResolved),
        seoTitle: p.metaTitle || p.title,
        seoDescription: p.metaDescription || p.description,
        seoKeywords: p.metaKeywords || [],
        categoryMeta: getCategoryMeta(p.category),
        categoryDetails: categoryMap[p.category],
      };
    });

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch random products",
      message: error.message,
    });
  }
});

// GET /api/products/suggestions - Get search suggestions
router.get("/products/suggestions", async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.length < 2) {
      return res.json([]);
    }

    const regex = new RegExp(query, "i");

    // Find products matching title or brand
    const suggestions = await Product.find({
      isActive: true,
      $or: [{ title: regex }, { brand: regex }, { category: regex }],
    })
      .select("title slug price primaryImage image brand category")
      .limit(6)
      .lean();

    // Map to simplified format
    const formatted = suggestions.map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      brand: p.brand,
      image: p.primaryImage || p.image || "",
      type: "product",
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch suggestions",
      message: error.message,
    });
  }
});

// GET /api/products/:id - Get single product by ID
router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id).populate({
      path: 'businessId',
      select: 'businessIdentity.tradeName'
    }).lean();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let categoryDoc = await Category.findOne({ name: product.category }).lean();
    if (!categoryDoc && mongoose.Types.ObjectId.isValid(product.category)) {
      categoryDoc = await Category.findById(product.category).lean();
    }

    // Fetch Trust Badges
    // Determine if trustBadges contains IDs (strings) or objects
    let trustBadgesData: any[] = [];
    if (product.trustBadges && product.trustBadges.length > 0) {
      // If it's an array of ID strings, fetch the details
      const badges = await TrustBadge.find({
        id: { $in: product.trustBadges }
      }).select('name icon id startColor endColor').lean();

      // Sort badges to match the order in product.trustBadges
      const badgeMap = new Map(badges.map(b => [b.id, b]));
      trustBadgesData = product.trustBadges
        .map((id: string) => badgeMap.get(id))
        .filter((b: any) => b !== undefined);
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
      categoryDetails: categoryDoc
        ? {
          _id: categoryDoc._id,
          name: categoryDoc.name,
          parentCategory: categoryDoc.parentCategory,
        }
        : undefined,
      sellerName: (product.businessId as any)?.businessIdentity?.tradeName,
      trustBadges: trustBadgesData // Override with populated data
    };

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch product",
      message: error.message,
    });
  }
});

// GET /api/products/meta - Get aggregation data for filters (price range, brands, etc.)
router.get("/products/meta", async (req: Request, res: Response) => {
  try {
    const { category, search, brand, subCategory, minPrice, maxPrice, ids } = req.query;

    const matchStage: any = { isActive: true };

    // Apply filters similar to main product listing
    if (ids) {
      const idArray = (ids as string).split(',').map(id => id.trim()).filter(id => mongoose.Types.ObjectId.isValid(id));
      if (idArray.length > 0) matchStage._id = { $in: idArray };
    }

    if (category) {
      // Check if category is ID
      if (mongoose.Types.ObjectId.isValid(category as string)) {
        // If ID, try to find category name to regex match, OR simply match exact category ID if you stored IDs.
        // Current logic in GET /products suggests we store Category NAME in product.category string field.
        const categoryDoc = await Category.findById(category);
        if (categoryDoc) {
          matchStage.category = { $regex: categoryDoc.name, $options: 'i' };
        } else {
          // Fallback
          matchStage.category = category;
        }
      } else {
        matchStage.category = { $regex: category, $options: 'i' };
      }
    }

    if (search) {
      matchStage.title = { $regex: search, $options: 'i' };
    }

    // Note: We typically exclude the specific filter we are aggregating for 
    // to show *other* options, but for strict narrowing, including them is also common.
    // For price bounds, we usually want global bounds of the search context *ignoring* current price selection.

    const priceMatch = { ...matchStage };
    // For brands aggregation, we might want to respect price filter
    const brandMatch = { ...matchStage };
    if (minPrice || maxPrice) {
      brandMatch.price = {};
      if (minPrice) brandMatch.price.$gte = Number(minPrice);
      if (maxPrice) brandMatch.price.$lte = Number(maxPrice);
    }
    // For price aggregation, we respect brand filter
    if (brand) {
      priceMatch.brand = brand;
    }

    const [priceStats, brandStats] = await Promise.all([
      Product.aggregate([
        { $match: priceMatch },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            count: { $sum: 1 }
          }
        }
      ]),
      Product.aggregate([
        { $match: brandMatch },
        {
          $group: {
            _id: "$brand",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    const stats = {
      price: {
        min: priceStats.length > 0 ? priceStats[0].minPrice : 0,
        max: priceStats.length > 0 ? priceStats[0].maxPrice : 1000,
      },
      brands: brandStats.map(b => ({ name: b._id || 'Generic', count: b.count })),
      totalProducts: priceStats.length > 0 ? priceStats[0].count : 0
    };

    res.json(stats);

  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch product metadata",
      message: error.message,
    });
  }
});

// GET /api/products - Get all products with filtering, sorting, and pagination
router.get("/products", async (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      brand,
      subCategory,
      ids,
      minPrice,
      maxPrice,
      sort: sortParam,
      page: pageParam,
      limit: limitParam,
      filters // Dynamic filters: color:Red,size:M
    } = req.query;

    const pipeline: any[] = [];
    const matchStage: any = { isActive: true };

    // 1. Basic Filters
    if (ids) {
      const idArray = (ids as string).split(',').map(id => id.trim()).filter(id => mongoose.Types.ObjectId.isValid(id));
      if (idArray.length > 0) matchStage._id = { $in: idArray.map(id => new mongoose.Types.ObjectId(id)) };
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category as string)) {
        const categoryDoc = await Category.findById(category);
        if (categoryDoc) {
          matchStage.category = categoryDoc.name;
        } else {
          matchStage.category = category;
        }
      } else {
        matchStage.category = { $regex: category, $options: 'i' };
      }
    }

    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (brand) matchStage.brand = brand;
    if (subCategory) matchStage.subCategory = subCategory;

    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = Number(minPrice);
      if (maxPrice) matchStage.price.$lte = Number(maxPrice);
    }

    // 2. Dynamic Filters Logic
    if (filters) {
      const filterString = filters as string;
      const filterPairs = filterString.split(',');
      const filterMap: Record<string, string[]> = {};

      // Group values by key (e.g. Color -> [Red, Blue])
      filterPairs.forEach(pair => {
        const [key, value] = pair.split(':');
        if (key && value) {
          if (!filterMap[key]) filterMap[key] = [];
          filterMap[key].push(value);
        }
      });

      // Apply conditions: (Color=Red OR Color=Blue) AND (Size=M)
      Object.entries(filterMap).forEach(([key, values]) => {
        const valueConditions = values.map(val => ({
          $or: [
            // Check direct filterable attribute
            { [`filterableAttributes.${key}`]: val },
            // Check formatted string match format
            { [`filterableAttributes.${key}`]: { $regex: new RegExp(`^${val}$`, 'i') } },
            // Check if ANY variant has this attribute
            { [`variants.attributes.${key}`]: val },
            // Check legacy attributes (loose match)
            { attributes: { $elemMatch: { value: val } } }
          ]
        }));

        // Add to global AND list
        if (!matchStage.$and) matchStage.$and = [];
        matchStage.$and.push({ $or: valueConditions.flat() });
      });
    }

    pipeline.push({ $match: matchStage });

    // 3. Sorting
    let sort: any = { popularityScore: -1 };
    switch (sortParam) {
      case 'price_low': sort = { price: 1 }; break;
      case 'price_high': sort = { price: -1 }; break;
      case 'newest': sort = { createdAt: -1 }; break;
      case 'top_rated': sort = { rating: -1, ratingCount: -1 }; break;
      case 'relevance': sort = { score: { $meta: "textScore" } }; break;
      default: sort = { popularityScore: -1 };
    }
    pipeline.push({ $sort: sort });

    // 4. Pagination & Facets
    const page = parseInt(pageParam as string) || 1;
    const limit = parseInt(limitParam as string) || 20;
    const skip = (page - 1) * limit;

    pipeline.push({
      $facet: {
        products: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],

        // Facets for sidebar
        brands: [
          { $group: { _id: "$brand", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        priceRange: [
          { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } }
        ],
        attributes: [
          { $project: { filterableAttributes: { $objectToArray: "$filterableAttributes" } } },
          { $unwind: "$filterableAttributes" },
          {
            $group: {
              _id: { key: "$filterableAttributes.k", value: "$filterableAttributes.v" },
              count: { $sum: 1 }
            }
          },
          {
            $group: {
              _id: "$_id.key",
              values: { $push: { value: "$_id.value", count: "$count" } }
            }
          }
        ]
      }
    });

    const results = await Product.aggregate(pipeline);

    const productsData = results[0].products;
    const total = results[0].totalCount[0]?.count || 0;
    const availableFilters = {
      brands: results[0].brands,
      price: results[0].priceRange[0] || { min: 0, max: 0 },
      attributes: results[0].attributes
    };

    // Post-process products
    const categoryNames = [...new Set(productsData.map((p: any) => p.category))];
    const categories = await Category.find({ name: { $in: categoryNames } }).lean();
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = { id: cat._id, name: cat.name, parentCategory: cat.parentCategory };
      return acc;
    }, {} as Record<string, any>);

    const formattedProducts = productsData.map((p: any) => {
      const primaryImageResolved = resolvePrimaryImage(p);
      return {
        ...p,
        primaryImage: primaryImageResolved,
        optimizedImages: buildOptimizedVariants(primaryImageResolved),
        categoryDetails: categoryMap[p.category]
      };
    });

    res.json({
      products: formattedProducts,
      total,
      page,
      pages: Math.ceil(total / limit),
      filters: availableFilters
    });

  } catch (error: any) {
    console.error("Error fetching products:", error);
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
