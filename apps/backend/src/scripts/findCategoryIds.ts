import mongoose from 'mongoose';
import Category from '../models/category.model';
import { connectMongo, disconnectMongo } from '../config/mongo';

async function findCategoryIds() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await connectMongo();
        console.log('✅ Connected to MongoDB');

        console.log('🔍 Finding Kids\' Fashion categories...');
        const categories = await Category.find({
            name: { $regex: "Kids' Fashion", $options: 'i' }
        });

        console.log(`📝 Found ${categories.length} categories:`);
        categories.forEach(cat => {
            console.log(` - Name: "${cat.name}", ID: ${cat._id}`);
        });

    } catch (error: any) {
        console.error('❌ Error finding categories:', error.message);
    } finally {
        await disconnectMongo();
        await mongoose.disconnect();
        process.exit(0);
    }
}

findCategoryIds();
