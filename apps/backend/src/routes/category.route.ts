import express from 'express';
import mongoose from 'mongoose';
import Category from '../models/category.model';

const router = express.Router();

// Get all active categories (public - for sellers and customers)
router.get('/categories', async (req, res) => {
  try {
    console.log('🔍 Fetching categories...');
    const { parentCategory } = req.query;
    const query: any = { isActive: true };

    if (parentCategory) {
      if (mongoose.Types.ObjectId.isValid(parentCategory as string)) {
        query.parentCategory = parentCategory;
      } else {
        // If not a valid ObjectId, try finding the parent category by name
        const parent = await Category.findOne({
          name: { $regex: new RegExp(`^${parentCategory}$`, 'i') }
        }).select('_id');

        if (parent) {
          query.parentCategory = parent._id;
        } else {
          // If parent category not found by name either, return empty list immediately
          return res.json([]);
        }
      }
    }

    const categories = await Category.find(query)
      .select('name slug description image icon posters parentCategory order group subCategoryGroupOrder')
      .sort({ order: 1, name: 1 })
      .lean();

    console.log(`✅ Found ${categories.length} categories`);
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by slug or ID
router.get('/categories/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let query: any = { isActive: true };

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      query = { _id: idOrSlug, isActive: true };
    } else {
      query = { slug: idOrSlug, isActive: true };
    }

    const category = await Category.findOne(query)
      .populate('parentCategory', 'name slug')
      .populate('attributes.attributeId', 'name code type isFilterable values')
      .lean();

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error: any) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Get subcategories by parent category slug
router.get('/categories/:slug/subcategories', async (req, res) => {
  try {
    const parentCategory = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!parentCategory) {
      return res.status(404).json({ error: 'Parent category not found' });
    }

    const subcategories = await Category.find({
      parentCategory: parentCategory._id,
      isActive: true,
    })
      .select('name slug description image icon posters order group')
      .sort({ order: 1, name: 1 })
      .lean();

    res.json(subcategories);
  } catch (error: any) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

export default router;
