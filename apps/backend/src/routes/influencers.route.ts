import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { verifyFirebaseToken } from "../middlewares/firebaseAuth";
import { User } from "../models/user.model";
import { InfluencerAttribution } from "../models/influencerAttribution.model";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";

const router = Router();

// Influencer Profile Model (simple extension of User)
interface InfluencerProfile {
  uid: string;
  name: string;
  email: string;
  phoneNumber?: string;
  socialMedia?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
  };
  followers?: {
    instagram?: number;
    youtube?: number;
    twitter?: number;
    facebook?: number;
    tiktok?: number;
  };
  bio?: string;
  profileImage?: string;
  referralCode: string;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  isActive: boolean;
}

// Generate unique referral code
function generateReferralCode(name: string): string {
  const cleanName = name
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .substring(0, 6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}${random}`;
}

// POST /api/influencers/register - Register as influencer
router.post(
  "/influencers/register",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      const uid = req.firebaseUser?.uid;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("Register request:", { uid, email, name });

      // Try to find user by uid first
      let user = await User.findOne({ uid });

      // If not found by uid, try by email
      if (!user) {
        user = await User.findOne({ email });

        // If found by email, update with uid
        if (user) {
          console.log("Found user by email, updating with uid");
          user.uid = uid;
          user.name = name || user.name;
          user.role = "INFLUENCER";
          if (!user.referralCode) {
            user.referralCode = generateReferralCode(name || email);
          }
          await user.save();
        }
      }

      if (user) {
        // Update existing user
        if (!user.referralCode) {
          user.referralCode = generateReferralCode(name || email);
        }
        if (user.role !== "INFLUENCER") {
          user.role = "INFLUENCER";
        }
        user.name = name || user.name;
        await user.save();
        console.log("Updated existing user:", {
          uid: user.uid,
          referralCode: user.referralCode,
        });
      } else {
        // Create new influencer user
        user = await User.create({
          uid,
          email,
          name,
          role: "INFLUENCER",
          referralCode: generateReferralCode(name || email),
          isActive: true,
        });
        console.log("Created new user:", {
          uid: user.uid,
          referralCode: user.referralCode,
        });
      }

      res.status(201).json({
        message: "Influencer registered successfully",
        user: {
          uid: user.uid,
          email: user.email,
          name: user.name,
          referralCode: user.referralCode,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error("Error registering influencer:", error);
      res.status(500).json({
        error: "Failed to register influencer",
        message: error.message,
      });
    }
  }
);

// GET /api/influencers/profile - Get influencer profile
router.get(
  "/influencers/profile",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ uid });

      if (!user) {
        return res.status(404).json({ error: "Influencer profile not found" });
      }

      // Calculate earnings
      const attributions = await InfluencerAttribution.find({
        influencerUserId: user._id,
      });

      const totalEarnings = attributions.reduce(
        (sum, attr) => sum + attr.commissionAmount,
        0
      );
      const pendingEarnings = attributions
        .filter((attr) => attr.status === "APPROVED")
        .reduce((sum, attr) => sum + attr.commissionAmount, 0);
      const paidEarnings = attributions
        .filter((attr) => attr.status === "PAID")
        .reduce((sum, attr) => sum + attr.commissionAmount, 0);

      const profile: InfluencerProfile = {
        uid: user.uid,
        name: user.name || "",
        email: user.email,
        phoneNumber: user.phoneNumber,
        socialMedia: user.socialMedia,
        followers: user.followers,
        bio: user.bio,
        profileImage: user.profileImage,
        referralCode: user.referralCode || "",
        totalEarnings,
        pendingEarnings,
        paidEarnings,
        isActive: user.isActive,
      };

      res.json(profile);
    } catch (error: any) {
      console.error("Error fetching influencer profile:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch profile", message: error.message });
    }
  }
);

// PUT /api/influencers/profile - Update influencer profile
router.put(
  "/influencers/profile",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { name, phoneNumber, bio, socialMedia, followers } = req.body;

      const user = await User.findOneAndUpdate(
        { uid },
        {
          name,
          phoneNumber,
          bio,
          socialMedia,
          followers,
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "Influencer not found" });
      }

      res.json({ message: "Profile updated successfully", user });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res
        .status(500)
        .json({ error: "Failed to update profile", message: error.message });
    }
  }
);

// GET /api/influencers/metrics - Get dashboard metrics
router.get(
  "/influencers/metrics",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get all attributions for the influencer
      const attributions = await InfluencerAttribution.find({
        influencerUserId: user._id,
      }).populate("productId orderId");

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate metrics
      const allTime = {
        totalClicks: attributions.length,
        totalConversions: attributions.filter((a) => a.status !== "PENDING")
          .length,
        conversionRate:
          attributions.length > 0
            ? (attributions.filter((a) => a.status !== "PENDING").length /
                attributions.length) *
              100
            : 0,
        totalEarnings: attributions.reduce(
          (sum, a) => sum + a.commissionAmount,
          0
        ),
        pendingEarnings: attributions
          .filter((a) => a.status === "APPROVED")
          .reduce((sum, a) => sum + a.commissionAmount, 0),
        paidEarnings: attributions
          .filter((a) => a.status === "PAID")
          .reduce((sum, a) => sum + a.commissionAmount, 0),
        averageOrderValue: 0,
        totalOrders: attributions.filter((a) => a.orderId).length,
      };

      const todayAttrs = attributions.filter((a) => a.createdAt >= today);
      const weekAttrs = attributions.filter((a) => a.createdAt >= weekAgo);
      const monthAttrs = attributions.filter((a) => a.createdAt >= monthAgo);

      res.json({
        today: {
          clicks: todayAttrs.length,
          conversions: todayAttrs.filter((a) => a.status !== "PENDING").length,
          earnings: todayAttrs.reduce((sum, a) => sum + a.commissionAmount, 0),
        },
        thisWeek: {
          clicks: weekAttrs.length,
          conversions: weekAttrs.filter((a) => a.status !== "PENDING").length,
          earnings: weekAttrs.reduce((sum, a) => sum + a.commissionAmount, 0),
        },
        thisMonth: {
          clicks: monthAttrs.length,
          conversions: monthAttrs.filter((a) => a.status !== "PENDING").length,
          earnings: monthAttrs.reduce((sum, a) => sum + a.commissionAmount, 0),
        },
        allTime,
      });
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch metrics", message: error.message });
    }
  }
);

// GET /api/influencers/top-products - Get top performing products
router.get(
  "/influencers/top-products",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const attributions = await InfluencerAttribution.find({
        influencerUserId: user._id,
      }).populate("productId");

      // Group by product
      const productMap = new Map<string, any>();

      for (const attr of attributions) {
        const product = attr.productId as any;
        if (!product) continue;

        const productId = product._id.toString();
        if (!productMap.has(productId)) {
          productMap.set(productId, {
            productId,
            productName: product.name,
            productImage: product.images?.[0] || "",
            clicks: 0,
            conversions: 0,
            revenue: 0,
            commission: 0,
          });
        }

        const entry = productMap.get(productId);
        entry.clicks += 1;
        if (attr.status !== "PENDING") {
          entry.conversions += 1;
        }
        entry.commission += attr.commissionAmount;
        entry.revenue += product.price || 0;
      }

      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.commission - a.commission)
        .slice(0, 10);

      res.json(topProducts);
    } catch (error: any) {
      console.error("Error fetching top products:", error);
      res.status(500).json({
        error: "Failed to fetch top products",
        message: error.message,
      });
    }
  }
);

// GET /api/influencers/clicks-over-time - Get clicks over time
router.get(
  "/influencers/clicks-over-time",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;
      const { days = "30" } = req.query;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const daysNum = parseInt(days as string, 10);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const attributions = await InfluencerAttribution.find({
        influencerUserId: user._id,
        createdAt: { $gte: startDate },
      });

      // Group by date
      const dateMap = new Map<
        string,
        { clicks: number; conversions: number }
      >();

      for (let i = 0; i < daysNum; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        dateMap.set(dateStr, { clicks: 0, conversions: 0 });
      }

      for (const attr of attributions) {
        const dateStr = attr.createdAt.toISOString().split("T")[0];
        if (dateMap.has(dateStr)) {
          const entry = dateMap.get(dateStr)!;
          entry.clicks += 1;
          if (attr.status !== "PENDING") {
            entry.conversions += 1;
          }
        }
      }

      const data = Array.from(dateMap.entries())
        .map(([date, stats]) => ({ date, ...stats }))
        .reverse();

      res.json(data);
    } catch (error: any) {
      console.error("Error fetching clicks over time:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch data", message: error.message });
    }
  }
);

// GET /api/influencers/attributions - Get attribution history
router.get(
  "/influencers/attributions",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;
      const { status, days = "30" } = req.query;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const daysNum = parseInt(days as string, 10);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const query: any = {
        influencerUserId: user._id,
        createdAt: { $gte: startDate },
      };

      if (status && status !== "all") {
        const statusStr = typeof status === "string" ? status : String(status);
        query.status =
          statusStr === "click"
            ? "PENDING"
            : statusStr === "conversion"
            ? "APPROVED"
            : statusStr.toUpperCase();
      }

      const attributions = await InfluencerAttribution.find(query)
        .populate("productId")
        .sort({ createdAt: -1 })
        .limit(100);

      const result = attributions.map((attr) => ({
        _id: attr._id,
        influencerId: attr.influencerUserId,
        referralCode: user.referralCode,
        productId: attr.productId,
        product: attr.productId,
        orderId: attr.orderId,
        orderAmount: attr.commissionAmount * 10, // Estimate
        commissionRate: 10,
        commissionAmount: attr.commissionAmount,
        status:
          attr.status === "PENDING"
            ? "click"
            : attr.status === "PAID"
            ? "paid"
            : "conversion",
        createdAt: attr.createdAt,
        clickTimestamp: attr.createdAt,
        conversionTimestamp:
          attr.status !== "PENDING" ? attr.updatedAt : undefined,
      }));

      res.json(result);
    } catch (error: any) {
      console.error("Error fetching attributions:", error);
      res.status(500).json({
        error: "Failed to fetch attributions",
        message: error.message,
      });
    }
  }
);

// GET /api/influencers/stats - Get detailed stats
router.get(
  "/influencers/stats",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const attributions = await InfluencerAttribution.find({
        influencerUserId: user._id,
      });

      const stats = {
        totalClicks: attributions.length,
        totalConversions: attributions.filter((a) => a.status !== "PENDING")
          .length,
        conversionRate:
          attributions.length > 0
            ? (attributions.filter((a) => a.status !== "PENDING").length /
                attributions.length) *
              100
            : 0,
        totalEarnings: attributions.reduce(
          (sum, a) => sum + a.commissionAmount,
          0
        ),
        pendingEarnings: attributions
          .filter((a) => a.status === "APPROVED")
          .reduce((sum, a) => sum + a.commissionAmount, 0),
        paidEarnings: attributions
          .filter((a) => a.status === "PAID")
          .reduce((sum, a) => sum + a.commissionAmount, 0),
        averageOrderValue: 0,
        totalOrders: attributions.filter((a) => a.orderId).length,
      };

      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch stats", message: error.message });
    }
  }
);

// POST /api/influencers/affiliate-links - Create affiliate link
router.post(
  "/influencers/affiliate-links",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;
      const { productId } = req.body;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ uid });
      if (!user || !user.referralCode) {
        return res.status(404).json({ error: "Influencer not found" });
      }

      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // In a real implementation, you'd store affiliate links in a separate collection
      // For now, we'll just return a success response
      const affiliateLink = {
        _id: new mongoose.Types.ObjectId(),
        influencerId: user._id,
        productId,
        product,
        url: `http://localhost:3000/products/${productId}?ref=${user.referralCode}`,
        shortCode: user.referralCode,
        clicks: 0,
        conversions: 0,
        isActive: true,
        createdAt: new Date(),
      };

      res.status(201).json(affiliateLink);
    } catch (error: any) {
      console.error("Error creating affiliate link:", error);
      res.status(500).json({
        error: "Failed to create affiliate link",
        message: error.message,
      });
    }
  }
);

// GET /api/influencers/affiliate-links - Get all affiliate links
router.get(
  "/influencers/affiliate-links",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get unique products from attributions
      const attributions = await InfluencerAttribution.find({
        influencerUserId: user._id,
      }).populate("productId");

      const productMap = new Map();
      for (const attr of attributions) {
        const product = attr.productId as any;
        if (!product) continue;

        const productId = product._id.toString();
        if (!productMap.has(productId)) {
          productMap.set(productId, {
            _id: new mongoose.Types.ObjectId(),
            influencerId: user._id,
            productId,
            product,
            url: `http://localhost:3000/products/${productId}?ref=${user.referralCode}`,
            shortCode: user.referralCode,
            clicks: 0,
            conversions: 0,
            isActive: true,
            createdAt: attr.createdAt,
          });
        }

        const link = productMap.get(productId);
        link.clicks += 1;
        if (attr.status !== "PENDING") {
          link.conversions += 1;
        }
      }

      res.json(Array.from(productMap.values()));
    } catch (error: any) {
      console.error("Error fetching affiliate links:", error);
      res.status(500).json({
        error: "Failed to fetch affiliate links",
        message: error.message,
      });
    }
  }
);

// PATCH /api/influencers/affiliate-links/:id - Update affiliate link
router.patch(
  "/influencers/affiliate-links/:id",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;
      const { id } = req.params;
      const { isActive } = req.body;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // For now, just return success
      res.json({ message: "Link updated successfully", isActive });
    } catch (error: any) {
      console.error("Error updating affiliate link:", error);
      res
        .status(500)
        .json({ error: "Failed to update link", message: error.message });
    }
  }
);

// GET /api/influencers/analytics - Get analytics data
router.get(
  "/influencers/analytics",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;
      const { days = "30" } = req.query;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const daysNum = parseInt(days as string, 10);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const attributions = await InfluencerAttribution.find({
        influencerUserId: user._id,
        createdAt: { $gte: startDate },
      }).populate("productId");

      // Clicks over time
      const clicksOverTime = [];
      for (let i = daysNum - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        const dayAttrs = attributions.filter(
          (a) => a.createdAt.toISOString().split("T")[0] === dateStr
        );

        clicksOverTime.push({
          date: dateStr,
          clicks: dayAttrs.length,
          conversions: dayAttrs.filter((a) => a.status !== "PENDING").length,
        });
      }

      // Revenue over time
      const revenueOverTime = clicksOverTime.map((day) => ({
        date: day.date,
        revenue:
          attributions
            .filter((a) => a.createdAt.toISOString().split("T")[0] === day.date)
            .reduce((sum, a) => sum + a.commissionAmount, 0) || 0,
      }));

      // Calculate trends (comparing current period to previous period)
      const prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - daysNum);

      const prevAttributions = await InfluencerAttribution.find({
        influencerUserId: user._id,
        createdAt: { $gte: prevStartDate, $lt: startDate },
      });

      const currentClicks = attributions.length;
      const prevClicks = prevAttributions.length;
      const currentConversions = attributions.filter(
        (a) => a.status !== "PENDING"
      ).length;
      const prevConversions = prevAttributions.filter(
        (a) => a.status !== "PENDING"
      ).length;
      const currentRevenue = attributions.reduce(
        (sum, a) => sum + a.commissionAmount,
        0
      );
      const prevRevenue = prevAttributions.reduce(
        (sum, a) => sum + a.commissionAmount,
        0
      );

      const trends = {
        clicks: {
          current: currentClicks,
          previous: prevClicks,
          growth:
            prevClicks > 0
              ? ((currentClicks - prevClicks) / prevClicks) * 100
              : 0,
        },
        conversions: {
          current: currentConversions,
          previous: prevConversions,
          growth:
            prevConversions > 0
              ? ((currentConversions - prevConversions) / prevConversions) * 100
              : 0,
        },
        revenue: {
          current: currentRevenue,
          previous: prevRevenue,
          growth:
            prevRevenue > 0
              ? ((currentRevenue - prevRevenue) / prevRevenue) * 100
              : 0,
        },
        conversionRate: {
          current:
            currentClicks > 0 ? (currentConversions / currentClicks) * 100 : 0,
          previous: prevClicks > 0 ? (prevConversions / prevClicks) * 100 : 0,
          growth: 0,
        },
      };

      res.json({
        clicksOverTime,
        revenueOverTime,
        topCategories: [],
        deviceBreakdown: [],
        sourceBreakdown: [],
        hourlyPerformance: [],
        trends,
      });
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch analytics", message: error.message });
    }
  }
);

// GET /api/influencers/payouts - Get payout history
router.get(
  "/influencers/payouts",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // For now, return empty array as we don't have a payouts collection yet
      res.json([]);
    } catch (error: any) {
      console.error("Error fetching payouts:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch payouts", message: error.message });
    }
  }
);

// POST /api/influencers/payouts - Request payout
router.post(
  "/influencers/payouts",
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.firebaseUser?.uid;
      const { amount, method, accountDetails } = req.body;

      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get pending earnings
      const attributions = await InfluencerAttribution.find({
        influencerUserId: user._id,
        status: "APPROVED",
      });

      const pendingEarnings = attributions.reduce(
        (sum, attr) => sum + attr.commissionAmount,
        0
      );

      if (amount > pendingEarnings) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // In a real implementation, you'd create a payout record
      // For now, just return success
      res.status(201).json({
        message: "Payout request submitted successfully",
        payout: {
          _id: new mongoose.Types.ObjectId(),
          influencerId: user._id,
          amount,
          status: "pending",
          method,
          accountDetails,
          requestedAt: new Date(),
        },
      });
    } catch (error: any) {
      console.error("Error requesting payout:", error);
      res
        .status(500)
        .json({ error: "Failed to request payout", message: error.message });
    }
  }
);

export default router;
