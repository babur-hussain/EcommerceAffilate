import mongoose from 'mongoose';
import Category from '../models/category.model';
import { env as config } from '../config/env';

const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    icon: '📱',
    order: 1,
  },
  {
    name: 'Fashion',
    description: 'Clothing, footwear, and accessories',
    icon: '👗',
    order: 2,
  },
  {
    name: 'Home & Kitchen',
    description: 'Home decor and kitchen essentials',
    icon: '🏠',
    order: 3,
  },
  {
    name: 'Beauty',
    description: 'Beauty and personal care products',
    icon: '💄',
    order: 4,
  },
  {
    name: 'Sports',
    description: 'Sports and fitness equipment',
    icon: '⚽',
    order: 5,
  },
  {
    name: 'Books',
    description: 'Books and educational materials',
    icon: '📚',
    order: 6,
  },
  {
    name: 'Toys',
    description: 'Toys and games for all ages',
    icon: '🧸',
    order: 7,
  },
  {
    name: 'Health',
    description: 'Health and wellness products',
    icon: '🏥',
    order: 8,
  },
  {
    name: 'Automotive',
    description: 'Automotive parts and accessories',
    icon: '🚗',
    order: 9,
  },
  {
    name: 'Food',
    description: 'Food and beverages',
    icon: '🍔',
    order: 10,
  },
  {
    name: 'Jewelry',
    description: 'Jewelry and watches',
    icon: '💍',
    order: 11,
  },
  {
    name: 'Pet Supplies',
    description: 'Pet food, toys, and accessories',
    icon: '🐾',
    order: 12,
  },
  {
    name: 'Baby Products',
    description: 'Baby care and nursery items',
    icon: '👶',
    order: 13,
  },
  {
    name: 'Furniture',
    description: 'Furniture for home and office',
    icon: '🛋️',
    order: 14,
  },
  {
    name: 'Garden & Outdoor',
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
