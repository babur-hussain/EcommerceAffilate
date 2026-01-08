import express from 'express';
import Category from '../models/category.model';

const router = express.Router();

// Get all active categories (public - for sellers and customers)
router.get('/categories', async (req, res) => {
  try {
    console.log('🔍 Fetching categories...');
    const categories = await Category.find({ isActive: true })
      .select('name slug description image icon parentCategory order')
      .sort({ order: 1, name: 1 })
      .lean();

    console.log(`✅ Found ${categories.length} categories`);
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by slug
router.get('/categories/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    })
      .populate('parentCategory', 'name slug')
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
      isActive: true 
    });

    if (!parentCategory) {
      return res.status(404).json({ error: 'Parent category not found' });
    }

    const subcategories = await Category.find({
      parentCategory: parentCategory._id,
      isActive: true,
    })
      .select('name slug description image icon order')
      .sort({ order: 1, name: 1 })
      .lean();

    res.json(subcategories);
  } catch (error: any) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

export default router;
