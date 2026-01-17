import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Offer } from "../models/offer.model";
import { Product } from "../models/product.model";
import { requireAdmin } from "../middlewares/rbac";

const router = Router();

// GET /api/offers/active - Get all active offers
router.get("/offers/active", async (req: Request, res: Response) => {
    try {
        const now = new Date();

        const offers = await Offer.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        })
            .populate({
                path: 'productId',
                select: 'title price image primaryImage optimizedImages rating ratingCount'
            })
            .populate({
                path: 'businessId',
                select: 'businessIdentity.tradeName'
            })
            .sort({ order: 1, createdAt: -1 });

        res.json(offers);
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to fetch active offers",
            message: error.message
        });
    }
});

// POST /api/offers - Create a new Steal Deal Offer
router.post("/offers", requireAdmin, async (req: Request, res: Response) => {
    try {
        const {
            productId,
            minSpendAmount,
            dealPrice,
            title,
            startDate,
            endDate,
            order
        } = req.body;

        // Validation
        if (!productId || !minSpendAmount || dealPrice === undefined || !startDate || !endDate) {
            return res.status(400).json({
                error: "Missing required fields: productId, minSpendAmount, dealPrice, startDate, endDate"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        // Fetch product to get businessId
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Create Offer
        const offer = await Offer.create({
            type: 'STEAL_DEAL',
            productId,
            businessId: req.body.businessId || product.businessId,
            minSpendAmount,
            dealPrice,
            title: title || "Steal Deal - Pick any one!",
            startDate,
            endDate,
            order: order || 0,
            isActive: true
        });

        res.status(201).json(offer);
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to create offer",
            message: error.message
        });
    }
});


// PUT /api/offers/:id - Update an existing offer
router.put("/offers/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            productId,
            businessId,
            minSpendAmount,
            dealPrice,
            title,
            startDate,
            endDate,
            isActive,
            order
        } = req.body;

        const offer = await Offer.findById(id);
        if (!offer) {
            return res.status(404).json({ error: "Offer not found" });
        }

        // If product is changed
        if (productId && productId !== offer.productId.toString()) {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: "Invalid product ID" });
            }
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            offer.productId = productId;
            // Only update businessId if not explicitly provided in this update 
            // AND the product changed (giving a new default)
            if (!businessId) {
                offer.businessId = product.businessId;
            }
        }

        // Allow explicit businessId override
        if (businessId) {
            if (!mongoose.Types.ObjectId.isValid(businessId)) {
                return res.status(400).json({ error: "Invalid business ID" });
            }
            offer.businessId = businessId;
        }

        if (minSpendAmount !== undefined) offer.minSpendAmount = minSpendAmount;
        if (dealPrice !== undefined) offer.dealPrice = dealPrice;
        if (title) offer.title = title;
        if (startDate) offer.startDate = startDate;
        if (endDate) offer.endDate = endDate;
        if (isActive !== undefined) offer.isActive = isActive;
        if (order !== undefined) offer.order = order;

        await offer.save();

        res.json(offer);
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to update offer",
            message: error.message
        });
    }
});

// GET /api/offers/:id - Get single offer details
router.get("/offers/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid offer ID" });
        }

        const offer = await Offer.findById(id)
            .populate({
                path: 'productId',
                select: 'title price image'
            })
            .populate({
                path: 'businessId',
                select: 'businessIdentity.tradeName'
            });

        if (!offer) {
            return res.status(404).json({ error: "Offer not found" });
        }

        res.json(offer);
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to fetch offer",
            message: error.message
        });
    }
});

// GET /api/offers - Get all offers (Admin)
router.get("/offers", requireAdmin, async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const offers = await Offer.find()
            .populate({
                path: 'productId',
                select: 'title price image'
            })
            .populate({
                path: 'businessId',
                select: 'businessIdentity.tradeName'
            })
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Offer.countDocuments();

        res.json({
            data: offers,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to fetch offers",
            message: error.message
        });
    }
});



export default router;
