import { Router, Request, Response } from 'express';
import Category from '../models/category.model';
import { Product } from '../models/product.model';

const router = Router();

// --- In-memory cache for homepage sections (60s TTL) ---
let cachedSections: any = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

/**
 * GET /api/homepage/sections
 * Returns all parent categories (excluding Grocery) with their subcategories
 * grouped by the `group` field, each subcategory containing up to 15 products.
 */
router.get('/homepage/sections', async (req: Request, res: Response) => {
    try {
        // Serve from cache if still fresh
        if (cachedSections && (Date.now() - cacheTimestamp) < CACHE_TTL_MS) {
            return res.json(cachedSections);
        }
        // 1. Fetch all parent categories
        const parentCategories = await Category.find({
            parentCategory: null,
            isActive: true,
        })
            .select('name slug image icon posters order subCategoryGroupOrder')
            .sort({ order: 1, name: 1 })
            .lean();

        const SPECIAL_CATEGORY_ID = '695f88c75f463eeb3c42e765';

        // 2. Filter out Grocery AND special category (to handle separately)
        const filteredParents = parentCategories.filter(
            (cat) => !/^grocery$/i.test(cat.name) && cat._id.toString() !== SPECIAL_CATEGORY_ID
        );

        // 3. For each normal parent, fetch subcategories and their products
        const sections = await Promise.all(
            filteredParents.map(async (parent) => {
                const subcategories = await Category.find({
                    parentCategory: parent._id,
                    isActive: true,
                })
                    .select('name slug image icon order group')
                    .sort({ order: 1, name: 1 })
                    .lean();

                // Group subcategories by their `group` field
                const groupMap: Record<string, typeof subcategories> = {};
                const ungrouped: typeof subcategories = [];

                for (const sub of subcategories) {
                    if (sub.group) {
                        if (!groupMap[sub.group]) groupMap[sub.group] = [];
                        groupMap[sub.group].push(sub);
                    } else {
                        ungrouped.push(sub);
                    }
                }

                // Determine group ordering from parent's subCategoryGroupOrder
                const groupOrder: string[] = (parent as any).subCategoryGroupOrder || [];
                const allGroupNames = Object.keys(groupMap);

                // Sort groups: ordered ones first, then remaining alphabetically
                const sortedGroupNames = [
                    ...groupOrder.filter((g: string) => allGroupNames.includes(g)),
                    ...allGroupNames.filter((g) => !groupOrder.includes(g)).sort(),
                ];

                // Build groups array with products
                const groups = await Promise.all(
                    sortedGroupNames.map(async (groupName) => {
                        const subs = groupMap[groupName];
                        const subsWithProducts = await Promise.all(
                            subs.map(async (sub) => {
                                const products = await Product.find({
                                    category: sub.name,
                                    isActive: true,
                                    approvalStatus: 'approved',
                                })
                                    .select(
                                        'title slug price mrp image images primaryImage rating ratingCount brand category'
                                    )
                                    .sort({ popularityScore: -1, createdAt: -1 })
                                    .limit(15)
                                    .lean();

                                return {
                                    _id: sub._id,
                                    name: sub.name,
                                    slug: sub.slug,
                                    image: sub.image,
                                    icon: sub.icon,
                                    products,
                                };
                            })
                        );

                        // Only include subcategories that actually have products
                        const subsWithProductsFiltered = subsWithProducts.filter(
                            (s) => s.products.length > 0
                        );

                        return {
                            groupName,
                            subcategories: subsWithProductsFiltered,
                        };
                    })
                );

                // Handle ungrouped subcategories (put them in a default group)
                if (ungrouped.length > 0) {
                    const ungroupedWithProducts = await Promise.all(
                        ungrouped.map(async (sub) => {
                            const products = await Product.find({
                                category: sub.name,
                                isActive: true,
                                approvalStatus: 'approved',
                            })
                                .select(
                                    'title slug price mrp image images primaryImage rating ratingCount brand category'
                                )
                                // .sort({ popularityScore: -1, createdAt: -1 }) // Removed sort for variety? No keep it.
                                .sort({ popularityScore: -1, createdAt: -1 })
                                .limit(15)
                                .lean();

                            return {
                                _id: sub._id,
                                name: sub.name,
                                slug: sub.slug,
                                image: sub.image,
                                icon: sub.icon,
                                products,
                            };
                        })
                    );

                    const filtered = ungroupedWithProducts.filter(
                        (s) => s.products.length > 0
                    );

                    if (filtered.length > 0) {
                        groups.push({
                            groupName: parent.name, // Use parent name as fallback group name
                            subcategories: filtered,
                        });
                    }
                }

                // Only include parent categories that have at least one group with products
                const nonEmptyGroups = groups.filter(
                    (g) => g.subcategories.length > 0
                );

                return {
                    _id: parent._id,
                    name: parent.name,
                    slug: parent.slug,
                    image: parent.image,
                    icon: parent.icon,
                    groups: nonEmptyGroups,
                };
            })
        );

        // Filter out parent categories with no products at all
        const nonEmptySections = sections.filter((s) => s.groups.length > 0);

        // 4. Handle Special Category (Hybrid: Flattened + Subcategories with Regex)
        let specialSection = null;
        try {
            const specialCat = await Category.findById(SPECIAL_CATEGORY_ID).lean();
            if (specialCat && specialCat.isActive) {
                // A. Fetch Subcategories first
                const subcategories = await Category.find({
                    parentCategory: specialCat._id,
                    isActive: true,
                })
                    .select('name slug image icon order group')
                    .sort({ order: 1, name: 1 })
                    .lean();

                // B. Fetch ALL products for "Highlights" strip (using Regex for hierarchy)
                // Matches "Fashion", "Fashion > ...", etc.
                const allProducts = await Product.find({
                    category: { $regex: specialCat.name, $options: 'i' },
                    isActive: true,
                    approvalStatus: 'approved'
                })
                    .select('title slug price mrp image images primaryImage rating ratingCount brand category')
                    .sort({ popularityScore: -1, createdAt: -1 })
                    .limit(20) // Limit highlighted items
                    .lean();

                // C. Build Standard Groups (Subcategory Strips with Regex)
                // Group subcategories by their `group` field
                const groupMap: Record<string, typeof subcategories> = {};
                const ungrouped: typeof subcategories = [];

                for (const sub of subcategories) {
                    if (sub.group) {
                        if (!groupMap[sub.group]) groupMap[sub.group] = [];
                        groupMap[sub.group].push(sub);
                    } else {
                        ungrouped.push(sub);
                    }
                }

                // Determine group ordering
                const groupOrder: string[] = (specialCat as any).subCategoryGroupOrder || [];
                const allGroupNames = Object.keys(groupMap);
                const sortedGroupNames = [
                    ...groupOrder.filter((g: string) => allGroupNames.includes(g)),
                    ...allGroupNames.filter((g) => !groupOrder.includes(g)).sort(),
                ];

                const standardGroups = await Promise.all(
                    sortedGroupNames.map(async (groupName) => {
                        const subs = groupMap[groupName];
                        const subsWithProducts = await Promise.all(
                            subs.map(async (sub) => {
                                const products = await Product.find({
                                    category: { $regex: sub.name, $options: 'i' }, // Regex fix
                                    isActive: true,
                                    approvalStatus: 'approved',
                                })
                                    .select('title slug price mrp image images primaryImage rating ratingCount brand category')
                                    .sort({ popularityScore: -1, createdAt: -1 })
                                    .limit(15)
                                    .lean();

                                return {
                                    _id: sub._id,
                                    name: sub.name,
                                    slug: sub.slug,
                                    image: sub.image,
                                    icon: sub.icon,
                                    products,
                                };
                            })
                        );
                        return {
                            groupName,
                            subcategories: subsWithProducts.filter((s) => s.products.length > 0),
                        };
                    })
                );

                // Handle ungrouped
                if (ungrouped.length > 0) {
                    const ungroupedWithProducts = await Promise.all(
                        ungrouped.map(async (sub) => {
                            const products = await Product.find({
                                category: { $regex: sub.name, $options: 'i' }, // Regex fix
                                isActive: true,
                                approvalStatus: 'approved',
                            })
                                .select('title slug price mrp image images primaryImage rating ratingCount brand category')
                                .sort({ popularityScore: -1, createdAt: -1 })
                                .limit(15)
                                .lean();

                            return {
                                _id: sub._id,
                                name: sub.name,
                                slug: sub.slug,
                                image: sub.image,
                                icon: sub.icon,
                                products,
                            };
                        })
                    );
                    const filtered = ungroupedWithProducts.filter((s) => s.products.length > 0);
                    if (filtered.length > 0) {
                        standardGroups.push({
                            groupName: specialCat.name, // Fallback group name
                            subcategories: filtered,
                        });
                    }
                }

                // D. Combine Groups: Highlights first, then Standard Groups
                const finalGroups = [];

                // Add "Highlights" group if it has products
                if (allProducts.length > 0) {
                    finalGroups.push({
                        groupName: "Best of " + specialCat.name,
                        subcategories: [{
                            _id: specialCat._id,
                            name: "All " + specialCat.name,
                            slug: specialCat.slug,
                            products: allProducts
                        }]
                    });
                }

                // Add standard groups
                finalGroups.push(...standardGroups.filter(g => g.subcategories.length > 0));

                if (finalGroups.length > 0) {
                    specialSection = {
                        _id: specialCat._id,
                        name: specialCat.name,
                        slug: specialCat.slug,
                        image: specialCat.image,
                        icon: specialCat.icon,
                        groups: finalGroups
                    };
                }
            }
        } catch (err) {
            console.error("Error fetching special category:", err);
        }

        // Prepend special section if it exists
        if (specialSection) {
            nonEmptySections.unshift(specialSection as any);
        }

        // Store in cache and respond
        cachedSections = nonEmptySections;
        cacheTimestamp = Date.now();
        res.json(nonEmptySections);
    } catch (error: any) {
        console.error('Error fetching homepage sections:', error);
        res.status(500).json({
            error: 'Failed to fetch homepage sections',
            message: error.message,
        });
    }
});

export default router;
