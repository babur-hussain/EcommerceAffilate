import { Router, Request, Response } from 'express';
import { AdvancedLayout } from '../models/advanced.layout.model';
import { AuditLog } from '../models/auditLog.model';
import { Product } from '../models/product.model';
import mongoose from 'mongoose';

const router = Router();
// Force Restart 2

// Helper to resolve dynamic data
const resolveDynamicData = async (component: any, userId?: string) => {
    if (component.dataSource?.type === 'DYNAMIC' && component.dataSource.query) {
        const query = component.dataSource.query;

        if (query.source === 'browsing_history' && userId) {
            // Fetch last N viewed products
            const limit = query.limit || 10;
            const logs = await AuditLog.find({
                userId: userId,
                action: 'VIEW_PRODUCT',
                entityType: 'PRODUCT'
            })
                .sort({ createdAt: -1 })
                .limit(limit * 2); // Fetch more to handle duplicates

            // Extract unique product IDs
            const productIds = [...new Set(logs.map(log => log.entityId))].slice(0, limit);

            if (productIds.length > 0) {
                const products = await Product.find({ _id: { $in: productIds } })
                    .select('title price images rating reviewCount');

                // Init props if undefined
                if (!component.props) component.props = {};

                // Inject products into props
                component.props.products = products;
            } else {
                if (!component.props) component.props = {};
                component.props.products = [];
            }
        } else if (query.source === 'lightning_deals') {
            // Fetch products with active lastChanceOffers
            const limit = query.limit || 4;
            const products = await Product.find({
                isActive: true,
                'lastChanceOffers.0': { $exists: true }
            })
                .select('title price images rating reviewCount lastChanceOffers')
                .sort({ updatedAt: -1 })
                .limit(limit);

            if (!component.props) component.props = {};
            component.props.products = products;
        } else if (query.source === 'specific_products' && Array.isArray(query.ids)) {
            // Fetch specific products by ID
            const products = await Product.find({
                _id: { $in: query.ids },
                isActive: true
            })
                .select('title price images rating reviewCount lastChanceOffers offers');

            if (!component.props) component.props = {};
            component.props.products = products;
        }
    }
    // Add more resolvers here (e.g., bestselling, new_arrivals)

    // Recursively resolve children
    if (component.children && Array.isArray(component.children)) {
        for (let i = 0; i < component.children.length; i++) {
            await resolveDynamicData(component.children[i], userId);
        }
    }
};

// GET /api/advanced-layout/:slug
router.get('/advanced-layout/:slug', async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const userId = (req as any).user?.id || req.query.userId; // Support query param for anonymous/testing

        const layout = await AdvancedLayout.findOne({ slug, isActive: true });

        if (!layout) {
            // Auto-seed 'for-you' if missing
            if (slug === 'for-you') {
                console.log('Auto-seeding for-you layout');
                const defaultLayout = {
                    name: 'For You Top Section',
                    slug: 'for-you',
                    description: 'Top section with Lightning Deals and History',
                    isActive: true,
                    components: [] // Start empty instead of forcing hardcoded sections
                };

                const newLayout = await AdvancedLayout.create(defaultLayout);

                // Hydrate and return
                const layoutObj = newLayout.toObject();
                for (const component of layoutObj.components) {
                    await resolveDynamicData(component, userId?.toString());
                }
                return res.json(layoutObj);
            }

            return res.status(404).json({ error: 'Layout not found' });
        }

        // Convert to POJO to allow modification
        const layoutObj = layout.toObject();

        // Hydrate components with dynamic data
        for (const component of layoutObj.components) {
            await resolveDynamicData(component, userId?.toString());
        }

        res.json(layoutObj);
    } catch (error: any) {
        console.error('Advanced Layout Error:', error);
        res.status(500).json({ error: 'Failed to fetch layout', message: error.message });
    }
});

export default router;
