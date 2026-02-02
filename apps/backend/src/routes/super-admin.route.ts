import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { verifyFirebaseToken } from "../middlewares/firebaseAuth";
import { User } from "../models/user.model";
import { Business } from "../models/business.model";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
import { InfluencerAttribution } from "../models/influencerAttribution.model";

const router = Router();

// Middleware to verify super admin role
const verifySuperAdmin = async (req: Request, res: Response, next: any) => {
  try {
    const uid = req.firebaseUser?.uid;
    if (!uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ uid });
    if (!user || user.role !== "SUPER_ADMIN") {
      return res
        .status(403)
        .json({ error: "Forbidden: Super admin access required" });
    }

    req.user = user as any;
    next();
  } catch (error) {
    console.error("Super admin verification error:", error);
    res.status(500).json({ error: "Authorization failed" });
  }
};

// POST /api/super-admin/register - Register/create super admin
router.post(
  "/super-admin/register",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      const uid = req.firebaseUser?.uid;
      const firebaseEmail = req.firebaseUser?.email;
      const userEmail = (email || firebaseEmail || "").toLowerCase().trim();

      console.log("[Super Admin Register] Request:", {
        name,
        email: userEmail,
        uid,
        firebaseEmail,
      });

      if (!uid) {
        console.log("[Super Admin Register] No UID found");
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user already exists by uid, firebaseUid, or email
      let user = await User.findOne({
        $or: [
          { uid },
          { firebaseUid: uid },
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      });
      console.log("[Super Admin Register] Existing user:", user);

      if (user) {
        // Update to super admin
        console.log(
          "[Super Admin Register] Updating existing user to SUPER_ADMIN"
        );
        user.role = "SUPER_ADMIN";
        user.name = name || user.name || "Super Admin";
        user.uid = uid;
        user.firebaseUid = uid;
        if (userEmail) user.email = userEmail;
        await user.save();
        console.log("[Super Admin Register] User updated:", user);
      } else {
        // Create new super admin user
        console.log("[Super Admin Register] Creating new SUPER_ADMIN user");
        user = await User.create({
          uid,
          firebaseUid: uid,
          email: userEmail,
          name: name || "Super Admin",
          role: "SUPER_ADMIN",
          isActive: true,
        });
        console.log("[Super Admin Register] User created:", user);
      }

      res.status(201).json({
        message: "Super admin registered successfully",
        user: {
          uid: user.uid,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error("[Super Admin Register] Error:", error);
      res.status(500).json({
        error: "Failed to register super admin",
        message: error.message,
      });
    }
  }
);

// GET /api/super-admin/profile - Get super admin profile
router.get(
  "/super-admin/profile",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;
      const email = req.firebaseUser?.email;

      console.log("[Super Admin Profile] Request:", { uid, email });

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Find user by uid, firebaseUid, or email
      let user = await User.findOne({
        $or: [
          { uid },
          { firebaseUid: uid },
          ...(email ? [{ email: email.toLowerCase() }] : []),
        ],
      });

      console.log("[Super Admin Profile] Found user:", user);

      // If user doesn't exist, return 404 so frontend knows to register
      if (!user) {
        // [AUTO-FIX] If whitelist email, create them immediately
        if (email?.toLowerCase() === "thebaburhussain2@gmail.com") {
          console.log("[Super Admin Profile] Auto-creating whitelisted Super Admin");
          user = await User.create({
            uid,
            firebaseUid: uid,
            email: email.toLowerCase(),
            name: "Super Admin",
            role: "SUPER_ADMIN",
            isActive: true
          });
        } else {
          console.log("[Super Admin Profile] User not found, returning 404");
          return res.status(404).json({ error: "User not found" });
        }
      }

      // [AUTO-FIX] If whitelist email, force update role
      if (email?.toLowerCase() === "thebaburhussain2@gmail.com" && user.role !== "SUPER_ADMIN") {
        console.log("[Super Admin Profile] Auto-promoting whitelisted user to SUPER_ADMIN");
        user.role = "SUPER_ADMIN";
        await user.save();
      }

      // If user exists but is not super admin, return 403
      if (user.role !== "SUPER_ADMIN") {
        console.log(
          "[Super Admin Profile] User is not SUPER_ADMIN:",
          user.role
        );
        return res
          .status(403)
          .json({ error: "Forbidden: Super admin access required" });
      }

      const profile = {
        uid: user.uid,
        email: user.email,
        name: user.name || "Super Admin",
        role: user.role,
        isActive: user.isActive,
        permissions: ["all"],
      };

      console.log("[Super Admin Profile] Returning profile:", profile);
      res.json(profile);
    } catch (error: any) {
      console.error("[Super Admin Profile] Error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
);

// GET /api/super-admin/metrics - Get platform metrics
router.get(
  "/super-admin/metrics",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      // Get all counts
      const [
        totalUsers,
        totalSellers,
        totalInfluencers,
        totalCustomers,
        totalProducts,
        totalOrders,
        totalBusinesses,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "SELLER_OWNER" }),
        User.countDocuments({ role: "INFLUENCER" }),
        User.countDocuments({ role: "CUSTOMER" }),
        Product.countDocuments(),
        Order.countDocuments(),
        Business.countDocuments(),
      ]);

      // Calculate revenue and commissions
      const orders = await Order.find();
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      const attributions = await InfluencerAttribution.find();
      const totalCommissions = attributions.reduce(
        (sum, attr) => sum + attr.commissionAmount,
        0
      );

      // Get date ranges for growth calculation
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Calculate growth metrics
      const [
        newUsersThisWeek,
        newUsersLastWeek,
        newSellersThisWeek,
        newSellersLastWeek,
        newInfluencersThisWeek,
        newInfluencersLastWeek,
        newOrdersToday,
        pendingBusinesses,
      ] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: weekAgo } }),
        User.countDocuments({
          createdAt: { $gte: twoWeeksAgo, $lt: weekAgo },
        }),
        User.countDocuments({
          role: "SELLER_OWNER",
          createdAt: { $gte: weekAgo },
        }),
        User.countDocuments({
          role: "SELLER_OWNER",
          createdAt: { $gte: twoWeeksAgo, $lt: weekAgo },
        }),
        User.countDocuments({
          role: "INFLUENCER",
          createdAt: { $gte: weekAgo },
        }),
        User.countDocuments({
          role: "INFLUENCER",
          createdAt: { $gte: twoWeeksAgo, $lt: weekAgo },
        }),
        Order.countDocuments({ createdAt: { $gte: today } }),
        Business.countDocuments({ status: "PENDING" }),
      ]);

      // Calculate growth percentages
      const usersGrowth =
        newUsersLastWeek > 0
          ? ((newUsersThisWeek - newUsersLastWeek) / newUsersLastWeek) * 100
          : 0;
      const sellersGrowth =
        newSellersLastWeek > 0
          ? ((newSellersThisWeek - newSellersLastWeek) / newSellersLastWeek) *
          100
          : 0;
      const influencersGrowth =
        newInfluencersLastWeek > 0
          ? ((newInfluencersThisWeek - newInfluencersLastWeek) /
            newInfluencersLastWeek) *
          100
          : 0;

      const ordersLastWeek = await Order.find({
        createdAt: { $gte: weekAgo },
      });
      const ordersPreviousWeek = await Order.find({
        createdAt: { $gte: twoWeeksAgo, $lt: weekAgo },
      });

      const revenueThisWeek = ordersLastWeek.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
      const revenueLastWeek = ordersPreviousWeek.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
      const revenueGrowth =
        revenueLastWeek > 0
          ? ((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100
          : 0;

      const metrics = {
        overview: {
          totalUsers,
          totalSellers,
          totalInfluencers,
          totalCustomers,
          totalProducts,
          totalOrders,
          totalRevenue,
          totalCommissions,
        },
        growth: {
          usersGrowth: Math.round(usersGrowth),
          sellersGrowth: Math.round(sellersGrowth),
          influencersGrowth: Math.round(influencersGrowth),
          revenueGrowth: Math.round(revenueGrowth),
        },
        recent: {
          newUsers: newUsersThisWeek,
          newOrders: newOrdersToday,
          pendingApprovals: pendingBusinesses,
        },
      };

      res.json(metrics);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  }
);

// GET /api/super-admin/sellers - Get all sellers
router.get(
  "/super-admin/sellers",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const { status } = req.query;

      const query: any = { role: "SELLER_OWNER" };
      if (status === "active") query.isActive = true;
      if (status === "inactive") query.isActive = false;

      const sellers = await User.find(query).sort({ createdAt: -1 });

      const sellersWithDetails = await Promise.all(
        sellers.map(async (seller) => {
          const business = await Business.findOne({ ownerId: seller._id });
          const products = await Product.countDocuments({
            sellerId: seller._id,
          });
          const orders = await Order.find({ "items.sellerId": seller._id });

          const totalOrders = orders.length;
          const totalRevenue = orders.reduce(
            (sum, order) => sum + order.totalAmount,
            0
          );

          return {
            _id: seller._id,
            uid: seller.uid,
            email: seller.email,
            name: seller.name || seller.email,
            role: seller.role,
            phoneNumber: seller.phoneNumber,
            isActive: seller.isActive,
            createdAt: seller.createdAt,
            business: business
              ? {
                _id: business._id,
                businessName: business.businessIdentity.tradeName,
                businessType: business.businessIdentity.businessType,
                status: business.status,
              }
              : null,
            stats: {
              totalProducts: products,
              totalOrders,
              totalRevenue,
              commissionPaid: 0,
            },
          };
        })
      );

      res.json(sellersWithDetails);
    } catch (error: any) {
      console.error("Error fetching sellers:", error);
      res.status(500).json({ error: "Failed to fetch sellers" });
    }
  }
);

// GET /api/super-admin/sellers/:id - Get single seller details
router.get(
  "/super-admin/sellers/:id",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const seller = await User.findById(id);

      if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
      }

      if (seller.role !== "SELLER_OWNER") {
        return res.status(400).json({ error: "User is not a seller" });
      }

      const business = await Business.findOne({ userId: seller._id });
      const products = await Product.countDocuments({ sellerId: seller._id });
      const orders = await Order.find({ "items.sellerId": seller._id });

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      const sellerDetails = {
        _id: seller._id,
        uid: seller.uid,
        email: seller.email,
        name: seller.name || seller.email,
        role: seller.role,
        phoneNumber: seller.phoneNumber,
        isActive: seller.isActive,
        createdAt: seller.createdAt,
        business: business || null,  // Return full business object
        stats: {
          totalProducts: products,
          totalOrders,
          totalRevenue,
          commissionPaid: 0,
        },
      };

      res.json(sellerDetails);
    } catch (error: any) {
      console.error("Error fetching seller details:", error);
      res.status(500).json({ error: "Failed to fetch seller details" });
    }
  }
);

// PATCH /api/super-admin/businesses/:id/trust-badges - Update business trust badges
router.patch(
  "/super-admin/businesses/:id/trust-badges",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { badges } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid business ID' });
      }

      if (!Array.isArray(badges)) {
        return res.status(400).json({ error: 'badges must be an array' });
      }

      const updated = await Business.findByIdAndUpdate(
        id,
        { trustBadges: badges },
        { new: true }
      );

      if (!updated) return res.status(404).json({ error: 'Business not found' });
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating trust badges:", error);
      res.status(500).json({ error: 'Failed to update trust badges', message: error.message });
    }
  }
);

// PATCH /api/super-admin/businesses/:id/status - Update business status (activate/deactivate)
router.patch(
  "/super-admin/businesses/:id/status",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid business ID' });
      }

      const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      const business = await Business.findById(id);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Update business status
      business.status = status;

      // Update isActive based on status
      business.isActive = status === 'APPROVED';

      await business.save();

      // If approving, also ensure the user is active
      if (status === 'APPROVED') {
        await User.findByIdAndUpdate(business.userId, { isActive: true });
      }

      res.json({
        message: `Business status updated to ${status}`,
        business: {
          _id: business._id,
          status: business.status,
          isActive: business.isActive
        }
      });
    } catch (error: any) {
      console.error("Error updating business status:", error);
      res.status(500).json({
        error: 'Failed to update business status',
        message: error.message
      });
    }
  }
);

// PATCH /api/super-admin/sellers/:id/approve - Approve seller/business
router.patch(
  "/super-admin/sellers/:id/approve",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const seller = await User.findById(id);
      if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
      }

      // Activate user
      seller.isActive = true;
      await seller.save();

      // Approve business if exists
      const business = await Business.findOne({ ownerId: seller._id });
      if (business) {
        business.status = "APPROVED";
        await business.save();
      }

      res.json({ message: "Seller approved successfully" });
    } catch (error: any) {
      console.error("Error approving seller:", error);
      res.status(500).json({ error: "Failed to approve seller" });
    }
  }
);

// PATCH /api/super-admin/sellers/:id/suspend - Suspend seller
router.patch(
  "/super-admin/sellers/:id/suspend",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const seller = await User.findById(id);
      if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
      }

      seller.isActive = false;
      await seller.save();

      res.json({ message: "Seller suspended successfully" });
    } catch (error: any) {
      console.error("Error suspending seller:", error);
      res.status(500).json({ error: "Failed to suspend seller" });
    }
  }
);

// GET /api/super-admin/influencers - Get all influencers
router.get(
  "/super-admin/influencers",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const { status } = req.query;

      const query: any = { role: "INFLUENCER" };
      if (status === "active") query.isActive = true;
      if (status === "inactive") query.isActive = false;

      const influencers = await User.find(query).sort({ createdAt: -1 });

      const influencersWithStats = await Promise.all(
        influencers.map(async (influencer) => {
          const attributions = await InfluencerAttribution.find({
            influencerUserId: influencer._id,
          });

          const totalClicks = attributions.length;
          const totalConversions = attributions.filter(
            (a) => a.status !== "PENDING"
          ).length;
          const conversionRate =
            totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
          const totalEarnings = attributions.reduce(
            (sum, a) => sum + a.commissionAmount,
            0
          );
          const pendingEarnings = attributions
            .filter((a) => a.status === "APPROVED")
            .reduce((sum, a) => sum + a.commissionAmount, 0);
          const paidEarnings = attributions
            .filter((a) => a.status === "PAID")
            .reduce((sum, a) => sum + a.commissionAmount, 0);

          return {
            _id: influencer._id,
            uid: influencer.uid,
            email: influencer.email,
            name: influencer.name || influencer.email,
            role: influencer.role,
            phoneNumber: influencer.phoneNumber,
            referralCode: influencer.referralCode || "",
            isActive: influencer.isActive,
            createdAt: influencer.createdAt,
            socialMedia: influencer.socialMedia,
            followers: influencer.followers,
            stats: {
              totalClicks,
              totalConversions,
              conversionRate,
              totalEarnings,
              pendingEarnings,
              paidEarnings,
            },
          };
        })
      );

      res.json(influencersWithStats);
    } catch (error: any) {
      console.error("Error fetching influencers:", error);
      res.status(500).json({ error: "Failed to fetch influencers" });
    }
  }
);

// PATCH /api/super-admin/influencers/:id/status - Update influencer status
router.patch(
  "/super-admin/influencers/:id/status",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const influencer = await User.findById(id);
      if (!influencer) {
        return res.status(404).json({ error: "Influencer not found" });
      }

      influencer.isActive = isActive;
      await influencer.save();

      res.json({
        message: `Influencer ${isActive ? "activated" : "suspended"
          } successfully`,
      });
    } catch (error: any) {
      console.error("Error updating influencer status:", error);
      res.status(500).json({ error: "Failed to update influencer status" });
    }
  }
);

// ============ Product Review Workflow ============

// GET /api/super-admin/products/pending - Get all pending products grouped by seller
router.get(
  "/super-admin/products/pending",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const pendingProducts = await Product.find({ approvalStatus: "pending" })
        .populate({
          path: "businessId",
          select: "businessIdentity.tradeName businessIdentity.businessType",
        })
        .sort({ createdAt: -1 })
        .lean();

      // Group products by businessId
      const grouped: Record<string, any> = {};
      for (const product of pendingProducts) {
        const bizId = (product.businessId as any)?._id?.toString() || "unknown";
        if (!grouped[bizId]) {
          const biz = product.businessId as any;
          grouped[bizId] = {
            businessId: bizId,
            businessName: biz?.businessIdentity?.tradeName || "Unknown Seller",
            businessType: biz?.businessIdentity?.businessType || "",
            products: [],
          };
        }
        grouped[bizId].products.push({
          _id: product._id,
          title: product.title,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          mrp: product.mrp,
          category: product.category,
          brand: product.brand,
          image: product.image,
          images: product.images,
          primaryImage: product.primaryImage || product.image,
          thumbnailImage: product.thumbnailImage,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
          weight: product.weight,
          dimensions: product.dimensions,
          warrantyDetails: product.warrantyDetails,
          warrantyDuration: product.warrantyDuration,
          shippingCharges: product.shippingCharges,
          isCodAvailable: product.isCodAvailable,
          processingTime: product.processingTime,
          pickupLocation: product.pickupLocation,
          protectPromiseFee: product.protectPromiseFee,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          metaKeywords: product.metaKeywords,
          saleStartDate: product.saleStartDate,
          saleEndDate: product.saleEndDate,
          offers: product.offers,
          lastChanceOffers: product.lastChanceOffers,
          fees: product.fees,
          trustBadges: product.trustBadges,
          createdAt: product.createdAt,
        });
      }

      const result = Object.values(grouped);
      res.json({
        totalPending: pendingProducts.length,
        sellers: result,
      });
    } catch (error: any) {
      console.error("Error fetching pending products:", error);
      res.status(500).json({ error: "Failed to fetch pending products" });
    }
  }
);

// PATCH /api/super-admin/products/:id/approve - Approve a product
router.patch(
  "/super-admin/products/:id/approve",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      product.approvalStatus = "approved";
      product.approvalNote = undefined;
      await product.save();

      res.json({
        message: "Product approved successfully",
        product: {
          _id: product._id,
          title: product.title,
          approvalStatus: product.approvalStatus,
        },
      });
    } catch (error: any) {
      console.error("Error approving product:", error);
      res.status(500).json({ error: "Failed to approve product" });
    }
  }
);

// PATCH /api/super-admin/products/:id/reject - Reject a product with reason
router.patch(
  "/super-admin/products/:id/reject",
  verifyFirebaseToken,
  verifySuperAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      if (!reason || typeof reason !== "string") {
        return res.status(400).json({ error: "Rejection reason is required" });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      product.approvalStatus = "rejected";
      product.approvalNote = reason;
      await product.save();

      res.json({
        message: "Product rejected",
        product: {
          _id: product._id,
          title: product.title,
          approvalStatus: product.approvalStatus,
          approvalNote: product.approvalNote,
        },
      });
    } catch (error: any) {
      console.error("Error rejecting product:", error);
      res.status(500).json({ error: "Failed to reject product" });
    }
  }
);

export default router;

