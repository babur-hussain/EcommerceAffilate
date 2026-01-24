import { Router, Request, Response } from "express";
import { BrowserHistory } from "../models/browserHistory.model";
import { requireAuth } from "../middlewares/rbac";
import mongoose from "mongoose";

const router = Router();

// POST /api/history - Record a product view
router.post("/history", requireAuth, async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;
        const authUser = (req as any).user;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        if (!authUser?.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Upsert logic: Update timestamp if exists, or create new
        // This assumes we want to bubble up the 'latest' view time for repeat views
        const history = await BrowserHistory.findOneAndUpdate(
            { userId: authUser.id, productId },
            { userId: authUser.id, productId }, // Ensure fields are set on create
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json(history);
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to record history",
            message: error.message,
        });
    }
});

export default router;
