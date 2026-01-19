import { Router, Request, Response } from "express";
import { PageLayout } from "../models/page.layout.model";

const router = Router();

// GET /api/layout/:slug - Fetch layout for specific page
router.get("/layout/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const layout = await PageLayout.findOne({ pageSlug: slug, isActive: true });

        if (!layout) {
            // Fallback logic could go here, or just 404
            return res.status(404).json({ message: "Layout not found" });
        }

        res.json(layout);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch layout", message: error.message });
    }
});

// Backward compatibility (optional): Redirect root homepage request to 'home' slug
router.get("/homepage", async (req: Request, res: Response) => {
    try {
        const layout = await PageLayout.findOne({ pageSlug: 'home', isActive: true });
        if (!layout) return res.status(404).json({ message: "Home layout not found" });
        res.json(layout);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch homepage", message: error.message });
    }
});

export default router;
