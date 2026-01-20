import mongoose from 'mongoose';
import Category from '../models/category.model';
import { env as config } from '../config/env';

const categories = [
  {
    _id: '695f88c75f463eeb3c42e764',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    icon: '📱',
    order: 1,
  },
  {
    _id: '695f88c75f463eeb3c42e765',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, footwear, and accessories',
    icon: '👗',
    order: 2,
  },
  {
    _id: '695f88c75f463eeb3c42e766',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Home decor and kitchen essentials',
    icon: '🏠',
    order: 3,
  },
  {
    _id: '695f88c75f463eeb3c42e767',
    name: 'Beauty',
    slug: 'beauty',
    description: 'Beauty and personal care products',
    icon: '💄',
    order: 4,
  },
  {
    _id: '695f88c75f463eeb3c42e768',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports and fitness equipment',
    icon: '⚽',
    order: 5,
  },
  {
    _id: '695f88c75f463eeb3c42e769',
    name: 'Books',
    slug: 'books',
    description: 'Books and educational materials',
    icon: '📚',
    order: 6,
  },
  {
    _id: '695f88c75f463eeb3c42e76a',
    name: 'Toys',
    slug: 'toys',
    description: 'Toys and games for all ages',
    icon: '🧸',
    order: 7,
  },
  {
    _id: '695f88c75f463eeb3c42e76b',
    name: 'Health',
    slug: 'health',
    description: 'Health and wellness products',
    icon: '🏥',
    order: 8,
  },
  {
    _id: '695f88c75f463eeb3c42e76c',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Automotive parts and accessories',
    icon: '🚗',
    order: 9,
  },
  {
    _id: '695f88c75f463eeb3c42e76d',
    name: 'Food',
    slug: 'food',
    description: 'Food and beverages',
    icon: '🍔',
    order: 10,
  },
  {
    _id: '695f88c75f463eeb3c42e76e',
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Jewelry and watches',
    icon: '💍',
    order: 11,
  },
  {
    _id: '695f88c75f463eeb3c42e76f',
    name: 'Pet Supplies',
    slug: 'pet-supplies',
    description: 'Pet food, toys, and accessories',
    icon: '🐾',
    order: 12,
  },
  {
    _id: '695f88c75f463eeb3c42e770',
    name: 'Baby Products',
    slug: 'baby-products',
    description: 'Baby care and nursery items',
    icon: '👶',
    order: 13,
  },
  {
    _id: '695f88c75f463eeb3c42e771',
    name: 'Furniture',
    slug: 'furniture',
    description: 'Furniture for home and office',
    icon: '🛋️',
    order: 14,
  },
  {
    _id: '695f88c75f463eeb3c42e772',
    name: 'Garden & Outdoor',
    slug: 'garden-outdoor',
    description: 'Garden tools and outdoor equipment',
    icon: '🌱',
    order: 15,
  },
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    console.log('\n📋 Categories created:');
    createdCategories.forEach((cat) => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
