import mongoose from 'mongoose';
import { connectMongo, disconnectMongo } from '../config/mongo';
import { User } from '../models/user.model';
import { Business } from '../models/business.model';
import { Brand } from '../models/brand.model';
import { Product } from '../models/product.model';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

async function seed() {
  await connectMongo();

  const admin = await User.findOneAndUpdate(
    { email: 'admin@demo.store' },
    { role: 'ADMIN', isActive: true },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const owner = await User.findOneAndUpdate(
    { email: 'owner@demo.store' },
    { role: 'BUSINESS_OWNER', isActive: true },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const business = await Business.findOneAndUpdate(
    { name: 'Demo Store' },
    {
      name: 'Demo Store',
      legalName: 'Demo Store Pvt Ltd',
      ownerUserId: owner._id,
      isActive: true,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const brand = await Brand.findOneAndUpdate(
    { name: 'Demo Brand', businessId: business._id },
    { name: 'Demo Brand', businessId: business._id, isActive: true },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const catalog = [
    {
      title: 'Noise Cancelling Headphones',
      price: 129.99,
      category: 'Electronics',
      brand: 'Demo Brand',
      image: 'https://images.unsplash.com/photo-1518441902117-f6dbe7c38e8c?auto=format&fit=crop&w=900&q=80',
      description: 'Wireless over-ear headphones with ANC and 30h battery life.',
      stock: 200,
    },
    {
      title: 'Smartwatch Fitness Edition',
      price: 89.99,
      category: 'Electronics',
      brand: 'Demo Brand',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
      description: 'Track workouts, heart rate, and sleep with 7-day battery.',
      stock: 300,
    },
    {
      title: 'Minimalist Office Chair',
      price: 159,
      category: 'Home & Furniture',
      brand: 'Demo Brand',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      description: 'Ergonomic mesh back with adjustable height and lumbar support.',
      stock: 120,
    },
    {
      title: 'Portable Bluetooth Speaker',
      price: 59.99,
      category: 'Electronics',
      brand: 'Demo Brand',
      image: 'https://images.unsplash.com/photo-1490376840453-5f616fbebe5b?auto=format&fit=crop&w=900&q=80',
      description: 'Water-resistant speaker with 12h battery and deep bass.',
      stock: 250,
    },
    {
      title: 'Classic White Sneakers',
      price: 74.5,
      category: 'Fashion',
      brand: 'Demo Brand',
      image: 'https://images.unsplash.com/photo-1528701800489-20be9e62f2d2?auto=format&fit=crop&w=900&q=80',
      description: 'Everyday sneakers with breathable upper and cushioned sole.',
      stock: 180,
    },
  ];

  for (const item of catalog) {
    const slug = slugify(item.title);
    await Product.findOneAndUpdate(
      { slug },
      {
        ...item,
        slug,
        images: [item.image],
        primaryImage: item.image,
        thumbnailImage: item.image,
        brandId: brand._id,
        businessId: business._id,
        isActive: true,
        isSponsored: false,
        sponsoredScore: 0,
        popularityScore: 0,
        rating: 4.5,
        ratingCount: 100,
        views: 0,
        clicks: 0,
        lowStockThreshold: 5,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }

  const counts = {
    users: await User.countDocuments(),
    businesses: await Business.countDocuments(),
    brands: await Brand.countDocuments(),
    products: await Product.countDocuments(),
  };

  console.log('Seed complete:', counts);
  await disconnectMongo();
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
