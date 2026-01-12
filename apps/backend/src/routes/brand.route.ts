import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Brand } from "../models/brand.model";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import {
  getBrandProducts,
  getBrandSponsorships,
} from "../services/brand.service";
import { verifyFirebaseToken } from "../middlewares/firebaseAuth";
import { logger } from "../utils/logger";
import { UserRole } from "../models/user.model";

const router = Router();

// GET /brands - List all brands under user's business
router.get(
  "/brands",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const firebaseUser = (req as any).firebaseUser;
      const user = (req as any).user;

      if (!firebaseUser || !user) {
        console.log("❌ No user context");
        return res.status(401).json({ error: "Unauthorized" });
      }

      const mongoUser = await User.findById(user.id);
      if (!mongoUser || !mongoUser.businessId) {
        console.log("❌ No business associated with user");
        return res
          .status(403)
          .json({ error: "No business associated with this account" });
      }

      const brands = await Brand.find({
        businessId: new mongoose.Types.ObjectId(mongoUser.businessId),
        isActive: true,
      })
        .select("_id name businessId isActive createdAt updatedAt")
        .lean();

      // Get product counts for each brand
      const brandsWithCounts = await Promise.all(
        brands.map(async (brand) => {
          const productCount = await Product.countDocuments({
            brandId: brand._id,
          });
          return {
            ...brand,
            productCount,
          };
        })
      );

      console.log(
        `✅ Found ${brands.length} brands for business ${mongoUser.businessId}`
      );
      res.json(brandsWithCounts);
    } catch (error: any) {
      console.error("❌ Error fetching brands:", error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch brands", message: error.message });
    }
  }
);

// POST /brands - Create a new brand
router.post(
  "/brands",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const firebaseUser = (req as any).firebaseUser;
      const user = (req as any).user;
      const { name } = req.body;

      if (!firebaseUser || !user) {
        console.log("❌ No user context");
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!name || typeof name !== "string" || !name.trim()) {
        console.log("❌ Brand name is required");
        return res
          .status(400)
          .json({ error: "Brand name is required and must be a string" });
      }

      const mongoUser = await User.findById(user.id);
      if (!mongoUser || !mongoUser.businessId) {
        console.log("❌ No business associated with user");
        return res.status(403).json({ error: "Business context is required" });
      }

      const businessId = new mongoose.Types.ObjectId(mongoUser.businessId);

      console.log(
        `📝 Creating brand "${name}" for business ${mongoUser.businessId}`
      );

      const brand = await Brand.create({
        name: name.trim(),
        businessId,
        isActive: true,
      });

      logger.info("Brand created successfully", {
        brandId: brand._id,
        businessId: mongoUser.businessId,
        name: brand.name,
      });

      console.log(`✅ Brand created: ${brand._id}`);
      res.status(201).json(brand);
    } catch (error: any) {
      console.error("❌ Error creating brand:", error.message);
      if (error.code === 11000) {
        return res.status(409).json({
          error: "Brand with this name already exists for this business",
        });
      }
      res
        .status(500)
        .json({ error: "Failed to create brand", message: error.message });
    }
  }
);

// GET /brands/:id - Get a specific brand
router.get(
  "/brands/:id",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const firebaseUser = (req as any).firebaseUser;
      const user = (req as any).user;
      const { id } = req.params;

      if (!firebaseUser || !user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid brand ID" });
      }

      const mongoUser = await User.findById(user.id);
      if (!mongoUser || !mongoUser.businessId) {
        return res
          .status(403)
          .json({ error: "No business associated with this account" });
      }

      const brand = await Brand.findById(id).lean();
      if (!brand) return res.status(404).json({ error: "Brand not found" });

      // Check ownership
      if (brand.businessId.toString() !== mongoUser.businessId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      res.json(brand);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to fetch brand", message: error.message });
    }
  }
);

// PUT /brands/:id - Update brand
router.put(
  "/brands/:id",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const firebaseUser = (req as any).firebaseUser;
      const user = (req as any).user;
      const { id } = req.params;
      const { name } = req.body;

      if (!firebaseUser || !user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid brand ID" });
      }

      const mongoUser = await User.findById(user.id);
      if (!mongoUser || !mongoUser.businessId) {
        return res
          .status(403)
          .json({ error: "No business associated with this account" });
      }

      const brand = await Brand.findById(id);
      if (!brand) return res.status(404).json({ error: "Brand not found" });

      // Check ownership
      if (brand.businessId.toString() !== mongoUser.businessId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (name && typeof name === "string" && name.trim()) {
        brand.name = name.trim();
      }

      const updated = await brand.save();
      res.json(updated);
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(409).json({
          error: "Brand with this name already exists for this business",
        });
      }
      res
        .status(500)
        .json({ error: "Failed to update brand", message: error.message });
    }
  }
);

// PATCH /brands/:id/status - Activate/deactivate brand
router.patch(
  "/brands/:id/status",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const firebaseUser = (req as any).firebaseUser;
      const user = (req as any).user;
      const { id } = req.params;
      const { isActive } = req.body;

      if (!firebaseUser || !user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "isActive must be a boolean" });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid brand ID" });
      }

      const mongoUser = await User.findById(user.id);
      if (!mongoUser || !mongoUser.businessId) {
        return res
          .status(403)
          .json({ error: "No business associated with this account" });
      }

      const brand = await Brand.findById(id);
      if (!brand) return res.status(404).json({ error: "Brand not found" });

      // Check ownership
      if (brand.businessId.toString() !== mongoUser.businessId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      brand.isActive = isActive;
      const updated = await brand.save();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to update brand status",
        message: error.message,
      });
    }
  }
);

// Legacy endpoints: /brand/products, /brand/sponsorships
router.get(
  "/brand/products",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const firebaseUser = (req as any).firebaseUser;
      const user = (req as any).user;

      if (!firebaseUser || !user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const mongoUser = await User.findById(user.id);
      if (!mongoUser || !mongoUser.businessId) {
        return res
          .status(403)
          .json({ error: "No business associated with this account" });
      }

      const products = await getBrandProducts(mongoUser.businessId);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch brand products",
        message: error.message,
      });
    }
  }
);

router.get(
  "/brand/sponsorships",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const firebaseUser = (req as any).firebaseUser;
      const user = (req as any).user;

      if (!firebaseUser || !user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const mongoUser = await User.findById(user.id);
      if (!mongoUser || !mongoUser.businessId) {
        return res
          .status(403)
          .json({ error: "No business associated with this account" });
      }

      const sponsorships = await getBrandSponsorships(mongoUser.businessId);
      // Filter out populated docs where product didn't match owner
      const filtered = sponsorships.filter((s) => (s as any).productId);
      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch brand sponsorships",
        message: error.message,
      });
    }
  }
);

export default router;
