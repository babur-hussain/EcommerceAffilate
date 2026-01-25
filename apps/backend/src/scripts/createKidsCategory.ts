import mongoose from 'mongoose';
import Category from '../models/category.model';
import { connectMongo, disconnectMongo } from '../config/mongo';

async function createKidsCategory() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await connectMongo();

        // 1. Create/Find "Fashion"
        let fashion = await Category.findOne({ name: 'Fashion' });
        if (!fashion) {
            fashion = await Category.create({ name: 'Fashion', slug: 'fashion', isActive: true, level: 0 });
            console.log('✅ Created root category: Fashion');
        }

        // 2. Create/Find "Kids' Fashion"
        let kidsFashion = await Category.findOne({ name: "Kids' Fashion", parentCategory: fashion._id });
        if (!kidsFashion) {
            kidsFashion = await Category.create({
                name: "Kids' Fashion",
                slug: 'kids-fashion',
                parentCategory: fashion._id,
                ancestors: [{ _id: fashion._id, name: 'Fashion', slug: 'fashion' }],
                isActive: true,
                level: 1
            });
            console.log("✅ Created category: Kids' Fashion");
        }

        console.log(`\n🆔 Kids' Fashion ID: ${kidsFashion._id}`);
        console.log(`ℹ️ Use this ID for filtering.`);

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    } finally {
        await disconnectMongo();
        await mongoose.disconnect();
        process.exit(0);
    }
}

createKidsCategory();
