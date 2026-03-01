import { Router, Request, Response } from "express";
import { Product } from "../models/product.model";
import Category from "../models/category.model";
import { Brand } from "../models/brand.model";
import { verifyFirebaseTokenOptional } from "../middlewares/firebaseAuth";
import mongoose from "mongoose";

const router = Router();

// GET /api/search/global
// Advanced search across multiple entities with robust matching
// Uses optional auth to capture user context for analytics (guest access allowed)
router.get("/search/global", verifyFirebaseTokenOptional, async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== "string" || q.trim().length === 0) {
            return res.json({
                products: [],
                categories: [],
                brands: [],
                suggestions: []
            });
        }

        const query = q.trim();

        // 1. Parallel search execution for speed
        const [products, categories, brands] = await Promise.all([
            searchProducts(query),
            searchCategories(query),
            searchBrands(query)
        ]);

        res.json({
            products,
            categories,
            brands,
            // Aggregated suggestions: top hits from each
            // using mapped 'id' because the arrays are already mapped below
            suggestions: [
                ...brands.slice(0, 2).map(b => ({ text: b.name, type: 'brand', id: b.id })),
                ...categories.slice(0, 2).map(c => ({ text: c.name, type: 'category', id: c.id })),
                ...products.slice(0, 4).map(p => ({ text: p.title, type: 'product', id: p.id }))
            ]
        });

    } catch (error: any) {
        console.error("Global search error:", error);
        res.status(500).json({ error: "Search failed", message: error.message });
    }
});

// GET /api/search/trending
// Returns popular/trending search terms
router.get("/search/trending", verifyFirebaseTokenOptional, async (req: Request, res: Response) => {
    try {
        // In a real app, this would aggregate actual search logs or product views.
        // For now, we return a curated list mixed with popular categories.

        const trendingCategories = await Category.find({ parentCategory: null })
            .limit(5)
            .select('name');

        const staticTerms = [
            "Headphones",
            "Smart Watches",
            "Running Shoes",
            "Office Chair",
            "Gaming Laptop"
        ];

        const terms = [
            ...trendingCategories.map(c => c.name),
            ...staticTerms
        ];

        // Shuffle and pick top 8
        const shuffled = terms.sort(() => 0.5 - Math.random()).slice(0, 8);

        res.json(shuffled);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch trending terms" });
    }
});

// --- Helper Functions ---

async function searchProducts(query: string) {
    // Strategy 1: Text Search (Fast, stems words)
    // Requires text index on title, description, brand, category
    let results = await Product.find({
        isActive: true,
        $text: { $search: query }
    })
        .select('title price primaryImage image category brand rating isActive slug')
        .limit(20)
        .lean();

    // Strategy 2: Regex Search (Partial matching) if text search returns few results
    // This handles partial words like "lapto" -> "laptop" which text search might miss
    if (results.length < 5) {
        const regex = new RegExp(query.split(' ').join('|'), 'i'); // Simple OR regex for words
        const regexResults = await Product.find({
            isActive: true,
            _id: { $nin: results.map(r => r._id) }, // Exclude already found
            $or: [
                { title: regex },
                { brand: regex },
                { category: regex }
            ]
        })
            .select('title price primaryImage image category brand rating isActive slug')
            .limit(10)
            .lean();

        results = [...results, ...regexResults];
    }

    // Strategy 3: "Fuzzy-ish" Regex (Permissive) if still absolutely no results
    // e.g. "smsng" -> /s.*m.*s.*n.*g/
    if (results.length === 0 && query.length > 3) {
        const fuzzyPattern = query.split('').join('.*');
        const fuzzyRegex = new RegExp(fuzzyPattern, 'i');

        const fuzzyResults = await Product.find({
            isActive: true,
            title: fuzzyRegex
        })
            .select('title price primaryImage image category brand rating isActive slug')
            .limit(5)
            .lean();

        results = fuzzyResults;
    }

    return results.map(p => ({
        id: p._id,
        title: p.title,
        image: p.primaryImage || p.image,
        price: p.price,
        rating: p.rating,
        brand: p.brand
    }));
}

async function searchCategories(query: string) {
    const regex = new RegExp(query, 'i');
    const categories = await Category.find({
        name: regex
    })
        .select('name image parentCategory')
        .limit(5)
        .lean();

    return categories.map(c => ({
        id: c._id,
        name: c.name,
        image: c.image
    }));
}

async function searchBrands(query: string) {
    const regex = new RegExp(query, 'i');
    const brands = await Brand.find({
        name: regex,
        isActive: true
    })
        .select('name') // Removed logo
        .limit(5)
        .lean();

    return brands.map(b => ({
        id: b._id,
        name: b.name,
        image: null // No logo available in model
    }));
}

// GET /api/search/grocery
// Specific search for grocery products from grocery_products collection
router.get("/search/grocery", verifyFirebaseTokenOptional, async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        // Ensure database connection is established
        if (!mongoose.connection.db) {
            return res.status(500).json({ error: "Database connection not established" });
        }

        if (!q || typeof q !== "string" || q.trim().length === 0) {
            return res.json({
                products: [],
                suggestions: []
            });
        }

        const query = q.trim();
        const groceryCollection = mongoose.connection.db.collection("grocery_products");

        // Use regex for flexible matching (case-insensitive)
        const regex = new RegExp(query.split(' ').join('|'), 'i');

        // Search in grocery_products collection
        const products = await groceryCollection.find({
            $or: [
                { isActive: true },
                { status: "active" },
                { isActive: { $exists: false } }
            ],
            $and: [
                {
                    $or: [
                        { title: regex },
                        { brand: regex },
                        { category: regex },
                        { subCategory: regex },
                        { description: regex }
                    ]
                }
            ]
        })
            .limit(20)
            .toArray();

        // Extract suggestions (top 5 unique terms from results)
        const suggestionsSet = new Set<string>();
        // Add exact query match first if needed, but usually we want terms from content
        // Let's add variations from product titles
        products.forEach((p: any) => {
            const title = p.title || p.name || "";
            // Add exact title match if short enough
            if (title.length < 30) suggestionsSet.add(title);
            // Add category if matches query
            if (p.category && new RegExp(query, 'i').test(p.category)) suggestionsSet.add(p.category);
            // Add brand if matches query
            if (p.brand && new RegExp(query, 'i').test(p.brand)) suggestionsSet.add(p.brand);
        });

        const suggestions = Array.from(suggestionsSet).slice(0, 5);

        // Map to simplified product format
        const formattedProducts = products.map((p: any) => {
            const primaryImage = p.primaryImage || p.image || (p.images && p.images.length > 0 ? p.images[0] : "");
            return {
                _id: p._id,
                title: p.title || p.name || "",
                name: p.title || p.name || "",
                slug: p.slug || "",
                price: p.sellingPrice || p.price || 0,
                mrp: p.mrp || p.price || 0,
                image: primaryImage,
                primaryImage: primaryImage,
                rating: p.rating || 0,
                brand: p.brand || "",
                category: p.category || "Grocery"
            };
        });

        res.json({
            products: formattedProducts,
            suggestions: suggestions.map(term => ({ text: term, type: 'term' })) // Wrap in object for consistency
        });

    } catch (error: any) {
        console.error("Grocery search error:", error);
        res.status(500).json({ error: "Grocery search failed", message: error.message });
    }
});

export default router;
