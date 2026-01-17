import { Router, Request, Response } from "express";
import { Business } from "../models/business.model";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { Brand } from "../models/brand.model";
import { verifyFirebaseToken } from "../middlewares/firebaseAuth";
import { logger } from "../utils/logger";
import { adminAuth } from "../config/firebaseAdmin";

console.log("📦 BUSINESS ROUTE MODULE LOADING...");

const router = Router();

console.log("📦 BUSINESS ROUTER CREATED");

// Test endpoint to verify route is accessible
router.get("/business/test", (req: Request, res: Response) => {
  console.log("✅ /business/test handler reached");
  res.json({ message: "Business route is working!" });
});

console.log("📦 /business/test route registered");

// POST /api/business/register - Comprehensive business/seller registration
// Uses verifyFirebaseToken middleware for simpler authentication
router.post(
  "/business/register",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      console.log("📝 Business registration request received");

      // Get user from middleware
      const firebaseUser = (req as any).firebaseUser;
      const user = (req as any).user;

      if (!firebaseUser || !user) {
        console.log("❌ No user context from middleware");
        return res.status(401).json({ error: "Authentication failed" });
      }

      const firebaseUid = firebaseUser.uid;
      console.log("✅ User authenticated:", firebaseUid);

      // Extract all registration data
      const {
        accountType,
        businessIdentity,
        ownerDetails,
        addresses,
        taxLegal,
        bankDetails,
        verification,
        storeProfile,
        logistics,
        compliance,
        advanced,
      } = req.body;

      // Validate required fields
      if (
        !accountType ||
        !businessIdentity ||
        !ownerDetails ||
        !addresses ||
        !taxLegal ||
        !bankDetails ||
        !storeProfile ||
        !logistics ||
        !compliance
      ) {
        console.log("❌ Missing required fields");
        return res.status(400).json({
          error: "Missing required fields",
          required: [
            "accountType",
            "businessIdentity",
            "ownerDetails",
            "addresses",
            "taxLegal",
            "bankDetails",
            "storeProfile",
            "logistics",
            "compliance",
          ],
        });
      }

      // Get the MongoDB user first
      const mongoUser = await User.findById(user.id);
      if (!mongoUser) {
        console.log("❌ MongoDB user not found");
        return res.status(404).json({ error: "User not found" });
      }

      // Check if business already exists for this user
      const existingBusiness = await Business.findOne({ firebaseUid });
      if (existingBusiness) {
        console.log(
          "⚠️ Business already exists - updating with new information"
        );

        try {
          // Update existing business with new information
          existingBusiness.accountType = accountType;
          existingBusiness.businessIdentity = businessIdentity;
          existingBusiness.ownerDetails = ownerDetails;
          existingBusiness.addresses = addresses;
          existingBusiness.taxLegal = taxLegal;
          existingBusiness.bankDetails = bankDetails;
          existingBusiness.verification = verification ||
            existingBusiness.verification || { isVerified: false };
          existingBusiness.storeProfile = storeProfile;
          existingBusiness.logistics = logistics;
          existingBusiness.compliance = {
            ...compliance,
            acceptedAt: new Date(),
          };
          existingBusiness.advanced =
            advanced || existingBusiness.advanced || {};
          existingBusiness.isActive = true;

          await existingBusiness.save();
          console.log("✅ Business information updated:", existingBusiness._id);

          // Ensure user role is correct
          if (
            mongoUser.role !== "SELLER_OWNER" ||
            mongoUser.businessId?.toString() !== existingBusiness._id.toString()
          ) {
            console.log("🔧 Updating user role to SELLER_OWNER");
            mongoUser.role = "SELLER_OWNER";
            mongoUser.businessId = existingBusiness._id;
            await mongoUser.save();
          }

          // Update Firebase claims
          try {
            await adminAuth.setCustomUserClaims(firebaseUid, {
              accountType: accountType,
              role: "SELLER_OWNER",
              businessId: existingBusiness._id.toString(),
            });
            console.log("✅ Firebase custom claims updated");
          } catch (claimsError: any) {
            console.error(
              "⚠️ Failed to set custom claims:",
              claimsError.message
            );
          }

          logger.info({
            businessId: existingBusiness._id,
            userId: mongoUser._id,
            accountType,
          }, "Business information updated successfully");

          return res.status(200).json({
            success: true,
            message: "Business information updated successfully",
            business: {
              id: existingBusiness._id,
              tradeName: existingBusiness.businessIdentity.tradeName,
              accountType: existingBusiness.accountType,
              isActive: existingBusiness.isActive,
            },
            user: {
              id: mongoUser._id,
              email: mongoUser.email,
              role: mongoUser.role,
              businessId: mongoUser.businessId,
            },
          });
        } catch (updateError: any) {
          console.error("❌ Failed to update business:", updateError.message);
          throw new Error(`Business update failed: ${updateError.message}`);
        }
      }

      // Create business document
      console.log("📝 Creating business document...");
      let business;
      try {
        business = new Business({
          userId: mongoUser._id,
          firebaseUid,
          accountType,
          businessIdentity,
          ownerDetails,
          addresses,
          taxLegal,
          bankDetails,
          verification: verification || { isVerified: false },
          storeProfile,
          logistics,
          compliance: {
            ...compliance,
            acceptedAt: new Date(),
          },
          advanced: advanced || {},
          isActive: true,
        });

        await business.save();
        console.log("✅ Business saved to MongoDB:", business._id);
      } catch (businessError: any) {
        console.error("❌ Failed to create business:", businessError.message);
        throw new Error(`Business creation failed: ${businessError.message}`);
      }

      // Update user role to SELLER_OWNER (for dashboard access)
      try {
        mongoUser.role = "SELLER_OWNER";
        mongoUser.businessId = business._id;
        await mongoUser.save();
        console.log("✅ User role updated to SELLER_OWNER");
      } catch (userUpdateError: any) {
        console.error(
          "❌ Failed to update user role:",
          userUpdateError.message
        );
        // Rollback: Delete the business we just created
        await Business.findByIdAndDelete(business._id);
        console.log("🔄 Rolled back business creation");
        throw new Error(`User update failed: ${userUpdateError.message}`);
      }

      // Set Firebase custom claims
      try {
        await adminAuth.setCustomUserClaims(firebaseUid, {
          accountType: accountType,
          role: "SELLER_OWNER",
          businessId: business._id.toString(),
        });
        console.log("✅ Firebase custom claims set");
      } catch (claimsError: any) {
        console.error("⚠️ Failed to set custom claims:", claimsError.message);
        // Don't fail the request - business is registered, claims can be set later
      }

      logger.info({
        businessId: business._id,
        userId: mongoUser._id,
        accountType,
      }, "Business registered successfully");

      return res.status(201).json({
        success: true,
        message: "Business registered successfully",
        business: {
          id: business._id,
          tradeName: business.businessIdentity.tradeName,
          accountType: business.accountType,
          isActive: business.isActive,
        },
        user: {
          id: mongoUser._id,
          email: mongoUser.email,
          role: mongoUser.role,
          businessId: mongoUser.businessId,
        },
      });
    } catch (error: any) {
      console.error("❌ Business registration error:", error.message);
      logger.error({
        error: error.message,
        stack: error.stack,
      }, "Business registration error");
      return res.status(500).json({
        error: "Business registration failed",
        details: error.message,
      });
    }
  }
);

// POST /api/business - Create a business (owner-only). Admin bypasses restrictions.
router.post(
  "/business",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user as
        | { id?: string; role?: string; businessId?: string }
        | undefined;
      if (!authUser?.id) return res.status(401).json({ error: "Unauthorized" });

      const { name, legalName, gstNumber } = req.body || {};

      if (!name || !legalName) {
        return res
          .status(400)
          .json({ error: "name and legalName are required" });
      }

      // Allow only if user is not already attached to a business (unless ADMIN)
      if (authUser.role !== "ADMIN" && authUser.businessId) {
        return res
          .status(400)
          .json({ error: "User already associated with a business" });
      }

      // Create business
      const business = await Business.create({
        name,
        legalName,
        gstNumber,
        ownerUserId: authUser.id,
        isActive: true,
      });

      // Update user to SELLER_OWNER and set businessId (unless ADMIN creating for others)
      if (authUser.role !== "ADMIN") {
        await User.findByIdAndUpdate(
          authUser.id,
          { role: "SELLER_OWNER", businessId: business._id },
          { new: true }
        );
      }

      res.status(201).json({ business });
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to create business", message: error.message });
    }
  }
);

// GET /api/business/products - Get products for the authenticated seller's business
router.get(
  "/business/products",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user as
        | { id?: string; role?: string; businessId?: string }
        | undefined;
      if (!authUser?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user has a business
      if (!authUser.businessId) {
        return res
          .status(403)
          .json({ error: "No business associated with this account" });
      }

      // Find products for this business
      const products = await Product.find({ businessId: authUser.businessId })
        .populate("brand", "name logo")
        .sort({ createdAt: -1 });

      console.log(
        `✅ Found ${products.length} products for business ${authUser.businessId}`
      );

      res.json(products);
    } catch (error: any) {
      console.error("❌ Error fetching business products:", error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch products", message: error.message });
    }
  }
);

// GET /api/business/brands - Get brands for the authenticated seller's business
router.get(
  "/business/brands",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user as
        | { id?: string; role?: string; businessId?: string }
        | undefined;
      if (!authUser?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!authUser.businessId) {
        return res
          .status(403)
          .json({ error: "No business associated with this account" });
      }

      const brands = await Brand.find({ businessId: authUser.businessId }).sort(
        { createdAt: -1 }
      );

      console.log(
        `✅ Found ${brands.length} brands for business ${authUser.businessId}`
      );

      res.json(brands);
    } catch (error: any) {
      console.error("❌ Error fetching business brands:", error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch brands", message: error.message });
    }
  }
);

// GET /api/business/orders - Get orders that contain products from the authenticated seller's business
router.get(
  "/business/orders",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user as
        | { id?: string; role?: string; businessId?: string }
        | undefined;

      if (!authUser?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!authUser.businessId) {
        return res
          .status(403)
          .json({ error: "No business associated with this account" });
      }

      // 1. Find all products owned by this business
      const products = await Product.find({ businessId: authUser.businessId }).select('_id');
      const productIds = products.map(p => p._id);

      if (productIds.length === 0) {
        return res.json([]);
      }

      // 2. Find orders that contain any of these products
      const { Order } = await import("../models/order.model");

      const orders = await Order.find({
        "items.productId": { $in: productIds }
      })
        .sort({ createdAt: -1 })
        .populate("items.productId", "title price image businessId")
        .populate("userId", "name email phone");

      console.log(
        `✅ Found ${orders.length} orders for business ${authUser.businessId}`
      );

      res.json(orders);
    } catch (error: any) {
      console.error("❌ Error fetching business orders:", error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch orders", message: error.message });
    }
  }
);

export default router;
