import express from 'express';
import Category from '../models/category.model';
import { firebaseAuth } from '../middlewares/firebaseAuth';
import { requireRoles } from '../middlewares/rbac';

const router = express.Router();

// Middleware for authentication and authorization
const auth = [firebaseAuth, requireRoles(['SUPER_ADMIN'])];

// Get all categories (including inactive ones)
router.get('/categories', ...auth, async (req, res) => {
  try {
    const categories = await Category.find()
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
    const { name, description, image, icon, parentCategory, order } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      $or: [{ name }, { slug }] 
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = new Category({
      name,
      slug,
      description,
      image,
      icon,
      parentCategory: parentCategory || null,
      order: order || 0,
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
    const { name, description, image, icon, parentCategory, order, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // If name is being changed, update slug
    if (name && name !== category.name) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Check if new name/slug already exists
      const existingCategory = await Category.findOne({
        _id: { $ne: req.params.id },
        $or: [{ name }, { slug }],
      });

      if (existingCategory) {
        return res.status(400).json({ error: 'Category name already exists' });
      }

      category.name = name;
      category.slug = slug;
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (icon !== undefined) category.icon = icon;
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;

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

export default router;
