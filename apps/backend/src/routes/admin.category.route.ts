import express from 'express';
import Category from '../models/category.model';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import { requireRoles } from '../middlewares/rbac';

const router = express.Router();

// Middleware for authentication and authorization
const auth = [verifyFirebaseToken, requireRoles(['SUPER_ADMIN'])];

// Get all categories (including inactive ones)
router.get('/categories', ...auth, async (req, res) => {
  try {
    // console.log('🔍 Admin fetching categories...');
    const { parentCategory } = req.query;
    const query: any = {};

    if (parentCategory) {
      query.parentCategory = parentCategory;
    }

    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .sort({ order: 1, name: 1 })
      .lean();

    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create new category
router.post('/categories', ...auth, async (req, res) => {
  try {
    const { name, description, image, icon, posters, parentCategory, order, group } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // CUSTOM VALIDATION: Root categories must have unique names
    if (!parentCategory) {
      const existingRoot = await Category.findOne({ name, parentCategory: null });
      if (existingRoot) {
        return res.status(400).json({ error: 'A root category with this name already exists' });
      }
    }

    // Generate basic slug
    let slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Ensure slug uniqueness across ALL categories
    let candidateSlug = slug;
    let counter = 1;
    while (await Category.findOne({ slug: candidateSlug })) {
      candidateSlug = `${slug}-${counter}`;
      counter++;
    }
    slug = candidateSlug;

    const category = new Category({
      name,
      slug,
      description,
      image,
      icon,
      posters: posters || [],
      parentCategory: parentCategory || null,
      order: order || 0,
      group: group || undefined,
      isActive: true,
    });

    await category.save();

    res.status(201).json(category);
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category
router.put('/categories/:id', ...auth, async (req, res) => {
  try {
    const { name, description, image, icon, posters, parentCategory, order, isActive, group, attributes, subCategoryGroupOrder } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Determine effective values for validation
    const effectiveName = name !== undefined ? name : category.name;
    const effectiveParent = parentCategory !== undefined ? (parentCategory || null) : category.parentCategory;

    // VALIDATION: Root categories must have unique names
    if (!effectiveParent) {
      const existingRoot = await Category.findOne({
        name: effectiveName,
        parentCategory: null,
        _id: { $ne: req.params.id }
      });
      if (existingRoot) {
        return res.status(400).json({ error: 'A root category with this name already exists' });
      }
    }

    // Handle Name Change & Slug Generation
    if (name && name !== category.name) {
      // Generate basic slug
      let slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

      // Ensure slug uniqueness (excluding current category)
      let candidateSlug = slug;
      let counter = 1;
      while (await Category.findOne({ slug: candidateSlug, _id: { $ne: req.params.id } })) {
        candidateSlug = `${slug}-${counter}`;
        counter++;
      }

      category.name = name;
      category.slug = candidateSlug;
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (icon !== undefined) category.icon = icon;
    if (posters !== undefined) category.posters = posters;
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;
    if (group !== undefined) category.group = group;
    if (attributes !== undefined) category.attributes = attributes;
    if (subCategoryGroupOrder !== undefined) category.subCategoryGroupOrder = subCategoryGroupOrder;

    await category.save();

    res.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category
router.delete('/categories/:id', ...auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has subcategories
    const subcategories = await Category.countDocuments({ parentCategory: req.params.id });

    if (subcategories > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Get category by ID
router.get('/categories/:id', ...auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name slug')
      .populate('attributes.attributeId');

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error: any) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

export default router;
