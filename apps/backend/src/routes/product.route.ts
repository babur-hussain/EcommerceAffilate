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
import { redis } from '../services/redis.service';
import { CacheTTL, CacheKeys } from '../config/redis.config';
import crypto from 'crypto';

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
      // Grocery Fields
      isGrocery,
      foodType,
      manufacturerName, // Already accepted in update, accept here too? No, it's 'manufacturer' object in schema? Let's check schema.
      // Wait, 'manufacturer' in schema is object { name, address }. 'manufacturerName' was used in existing code?
      // Existing code has 'manufacturerName' in update? Yes line 152.
      // But new schema has 'manufacturer: { name, address }'.
      // Frontend sends: manufacturer: { name: ..., address: ... }
      manufacturer,
      importer,
      customerCare,
      barcode,
      restockLeadTime,
      shelfLife,
      manufacturingDate,
      expiryDate,
      storageInstructions,
      temperatureRequirement,
      isPerishable,
      isColdChain,
      fssaiLicense,
      allergens,
      certifications,
      preservatives,
      artificialColors,
      isOrganic,
      nutrition,
      ingredientList,
      keyIngredients,
      additives,
      isGMO,
      volumetricWeight,
      isFragile,
      packSize,
      packUnit,
      netQuantity,
      unitsInPack,
      totalWeight,
      packagingType,
      isLoose
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
      // Grocery Fields
      foodType,
      manufacturer,
      importer,
      customerCare,
      barcode,
      restockLeadTime,
      shelfLife,
      manufacturingDate,
      expiryDate,
      storageInstructions,
      temperatureRequirement,
      isPerishable,
      isColdChain,
      fssaiLicense,
      allergens,
      certifications,
      preservatives,
      artificialColors,
      isOrganic,
      nutrition,
      ingredientList,
      keyIngredients,
      additives,
      isGMO,
      volumetricWeight,
      isFragile,
      packSize,
      packUnit,
      netQuantity,
      unitsInPack,
      totalWeight,
      packagingType,
      isLoose,
      // sponsoredScore and popularityScore will use defaults (0)
      // These are controlled by admin/system logic only
    });

    // Invalidate ranking caches because product catalog changed.
    // Invalidate ranking caches because product catalog changed.
    clearCacheByPrefix(RANKING_CACHE_PREFIX);

    // --- Dual Storage for Grocery Products ---
    if (isGrocery) {
      try {
        if (mongoose.connection.db) {
          const groceryCollection = mongoose.connection.db.collection("grocery_products");
          await groceryCollection.insertOne(product.toObject());
          console.log(`✅ Product ${product._id} also saved to grocery_products collection`);
        }
      } catch (groceryError) {
        console.error("⚠️ Failed to save to grocery_products (non-critical):", groceryError);
        // We don't fail the request, just log it.
      }
    }

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

// PATCH /api/products/:id/image - Rapidly update product primary image (and sync to grocery)
router.patch(
  "/products/:id/image",
  requireBrand,
  requireProductOwnership(),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;

      if (!imageUrl || typeof imageUrl !== "string") {
        return res.status(400).json({ error: "imageUrl is required" });
      }

      console.log(`🖼️ Updating image for product ${id}: ${imageUrl}`);

      // 1. Update Main Product
      // We push to images array AND set as primaryImage/image
      let product = await Product.findByIdAndUpdate(
        id,
        {
          $push: { images: { $each: [imageUrl], $position: 0 } }, // Prepend to array
          $set: {
            image: imageUrl,
            primaryImage: imageUrl,
            thumbnailImage: imageUrl
          }
        },
        { new: true }
      );

      // 2. Sync to/Update Grocery Products
      let groceryUpdated = false;
      try {
        if (mongoose.connection.db) {
          const groceryCollection = mongoose.connection.db.collection("grocery_products");

          const result = await groceryCollection.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id) }, // Same ID
            {
              $push: { images: { $each: [imageUrl], $position: 0 } }, // Prepend
              $set: {
                image: imageUrl,
                primaryImage: imageUrl,
                thumbnailImage: imageUrl
              }
            } as any,
            { returnDocument: 'after' }
          );

          if (result) {
            // Handle both driver versions: result.value or result as doc
            const updatedDoc = (result as any).value || result;

            if (updatedDoc) {
              groceryUpdated = true;
              console.log(`✅ Updated image in grocery_products for ${id}`);
              // If product was null (not in main collection), use grocery data for response
              if (!product) {
                product = updatedDoc as any;
              }
            }
          }
        }
      } catch (syncError) {
        console.error("⚠️ Failed to sync/update image to grocery_products:", syncError);
      }

      if (!product && !groceryUpdated) {
        return res.status(404).json({ error: "Product not found" });
      }

      clearCacheByPrefix(RANKING_CACHE_PREFIX);

      res.json({
        message: "Image updated successfully",
        product: {
          _id: (product as any)._id,
          image: (product as any).image,
          primaryImage: (product as any).primaryImage,
          images: (product as any).images
        }
      });

    } catch (error: any) {
      console.error("❌ Failed to update product image:", error);
      res.status(500).json({
        error: "Failed to update product image",
        message: error.message,
      });
    }
  }
);

// GET /api/products/public/grocery - Get grocery products from grocery_products collection (public)
// With Redis caching for fast repeated requests
router.get("/products/public/grocery", async (req: Request, res: Response) => {
  try {
    const { limit: limitParam, page: pageParam, category, subCategory } = req.query;
    const limit = parseInt(limitParam as string) || 20;
    const page = parseInt(pageParam as string) || 1;
    const skip = (page - 1) * limit;

    // Build a stable cache key from query params
    const queryStr = JSON.stringify({ limit, page, category: category || '', subCategory: subCategory || '' });
    const queryHash = crypto.createHash('md5').update(queryStr).digest('hex').slice(0, 12);
    const cacheKeyVal = CacheKeys.GROCERY_PRODUCTS(queryHash);

    // 1. Try Redis cache first
    try {
      const cached = await redis.get(cacheKeyVal);
      if (cached) {
        console.log(`[Grocery] Cache HIT for ${cacheKeyVal}`);
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Key', cacheKeyVal);
        return res.json(JSON.parse(cached));
      }
      console.log(`[Grocery] Cache MISS for ${cacheKeyVal}`);
    } catch (cacheErr) {
      console.error('[Grocery] Redis error, falling back to MongoDB:', cacheErr);
    }

    // 2. Fetch from MongoDB
    if (!mongoose.connection.db) {
      return res.status(500).json({ error: "Database connection not established" });
    }

    const groceryCollection = mongoose.connection.db.collection("grocery_products");

    // Build query - only active products
    const query: any = {};
    // Check common active flags
    query.$or = [
      { isActive: true },
      { status: "active" },
      { isActive: { $exists: false } } // Include products without isActive field
    ];

    // Filter by subCategory IDs (comma-separated ObjectIds from SDUI JSON)
    // Since grocery_products stores `category` as a text name (not ObjectId),
    // we need to look up the category names from the IDs first, then match by name.
    if (subCategory) {
      const subCatIds = (subCategory as string).split(',').map(id => id.trim()).filter(Boolean);
      if (subCatIds.length > 0) {
        // Look up category names from the provided ObjectIds
        const validIds = subCatIds.filter(id => mongoose.Types.ObjectId.isValid(id));
        if (validIds.length > 0) {
          const categoryDocs = await Category.find({
            _id: { $in: validIds.map(id => new mongoose.Types.ObjectId(id)) }
          }).lean() as any[];

          if (categoryDocs.length > 0) {
            const categoryNames = categoryDocs.map((doc: any) => doc.name);
            // Match products whose category field matches any of the looked-up names
            query.category = { $in: categoryNames.map((name: string) => new RegExp(name, 'i')) };
            console.log(`🛒 SubCategory filter: IDs=${subCatIds.join(',')} → Names=${categoryNames.join(',')}`);
          } else {
            // No matching categories found, return empty result
            console.log(`🛒 SubCategory filter: No categories found for IDs=${subCatIds.join(',')}`);
            query.category = { $in: [] };
          }
        }
      }
    } else if (category) {
      if (mongoose.Types.ObjectId.isValid(category as string)) {
        // Look up category name from the ID since grocery_products stores category as text name
        const categoryDoc = await Category.findById(category).lean() as any;
        if (categoryDoc) {
          query.category = { $regex: categoryDoc.name, $options: 'i' };
        } else {
          // Fallback: try matching directly (won't match if it's truly an ObjectId vs string)
          query.category = category;
        }
      } else {
        query.category = { $regex: category, $options: 'i' };
      }
    }

    const [products, total] = await Promise.all([
      groceryCollection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      groceryCollection.countDocuments(query)
    ]);

    // Format products to match the standard product response format
    const formatted = products.map((p: any) => {
      const primaryImage = p.primaryImage || p.image || (p.images && p.images.length > 0 ? p.images[0] : "");
      return {
        _id: p._id,
        title: p.title || p.name || "",
        name: p.title || p.name || "",
        slug: p.slug || "",
        price: p.sellingPrice || p.price || 0,
        mrp: p.mrp || p.price || 0,
        description: p.description || p.shortDescription || "",
        shortDescription: p.shortDescription || "",
        category: p.category || "Grocery",
        brand: p.brand || "",
        image: primaryImage,
        primaryImage: primaryImage,
        images: p.images || [],
        stock: p.stockQty || p.stock || 0,
        isActive: p.isActive !== false,
        rating: p.rating || 0,
        ratingCount: p.ratingCount || 0,
        unit: p.unit || "",
        weight: p.weight || "",
        foodType: p.foodType || "",
        businessId: p.businessId,
      };
    });

    const responseData = {
      products: formatted,
      total,
      page,
      pages: Math.ceil(total / limit),
    };

    // 3. Cache the result in Redis (non-blocking)
    redis.setex(cacheKeyVal, CacheTTL.GROCERY_PRODUCTS, JSON.stringify(responseData))
      .then(() => console.log(`[Grocery] Cached ${cacheKeyVal} (TTL: ${CacheTTL.GROCERY_PRODUCTS}s)`))
      .catch(err => console.error('[Grocery] Cache write failed:', err));

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Cache-Key', cacheKeyVal);
    res.json(responseData);

  } catch (error: any) {
    console.error("❌ Error fetching public grocery products:", error.message);
    res.status(500).json({
      error: "Failed to fetch grocery products",
      message: error.message,
    });
  }
});


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
      // Fallback: Check grocery_products collection
      if (mongoose.connection.db) {
        const groceryCollection = mongoose.connection.db.collection("grocery_products");
        const groceryProduct = await groceryCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });

        if (groceryProduct) {
          console.log(`fallback: found product ${id} in grocery_products`);
          // Transform grocery product to match Product structure
          // We need to ensure vital fields for Edit page are present
          const transformedProduct = {
            ...groceryProduct,
            // Ensure _id is string or ObjectId as expected? lean() returns ObjectId usually. 
            // groceryProduct is from raw driver, so _id is ObjectId.
            // We might need to populate businessId if possible, but raw driver can't populate mongoose refs easily.
            // However, we can fetch business details if needed.
            // usage in frontend: product.businessId (object) or string? 
            // Frontend Product interface expects businessId to be string usually, or populated object.
            // The edit page might not strictly use businessId validation on load, usually primarily for ownership check middleware which passed already.

            // Map specific fields if they differ
            title: groceryProduct.title || groceryProduct.name,
            price: groceryProduct.price || groceryProduct.sellingPrice,
            stock: groceryProduct.stock || groceryProduct.stockQty,

            // Grocery specific fields that might need mapping or are already matching
            // category is likely a string (name) in grocery_products, unlike ObjectId in Products
            // The edit page handles "category > subcategory" string parsing.
            category: groceryProduct.category,

            // Ensure images
            images: groceryProduct.images || (groceryProduct.image ? [groceryProduct.image] : []),
            image: groceryProduct.image || (groceryProduct.images && groceryProduct.images.length > 0 ? groceryProduct.images[0] : "")
          };

          // Respond with grocery product
          return res.json(transformedProduct);
        }
      }

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

// DELETE /api/products/:id - Delete a product
router.delete(
  "/products/:id",
  requireBrand,
  requireProductOwnership(),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      console.log(`🗑️ DELETE request for product: ${id}`);

      // 1. Try to delete from main products collection
      const product = await Product.findByIdAndDelete(id);
      console.log(`TRACER: Main product delete result: ${product ? 'FOUND & DELETED' : 'NOT FOUND'}`);

      // 2. Try to delete from grocery_products collection
      let groceryDeleted = false;
      try {
        if (mongoose.connection.db) {
          const result = await mongoose.connection.db.collection('grocery_products').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
          console.log(`TRACER: Grocery delete count: ${result.deletedCount}`);
          if (result.deletedCount > 0) {
            groceryDeleted = true;
            console.log(`✅ Deleted product from grocery_products: ${id}`);
          }
        } else {
          console.log('TRACER: No DB connection for grocery delete');
        }
      } catch (err) {
        console.error("⚠️ Failed to delete from grocery_products:", err);
      }

      if (!product && !groceryDeleted) {
        console.log('TRACER: Product not found in either collection, returning 404');
        return res.status(404).json({ error: "Product not found" });
      }

      // Clear caches
      clearCacheByPrefix(RANKING_CACHE_PREFIX);

      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to delete product",
        message: error.message,
      });
    }
  }
);

export default router;
