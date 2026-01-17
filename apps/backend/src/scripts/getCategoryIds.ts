import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Category from '../models/category.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const getIds = async () => {
    await connectDB();

    const breakfastItems = ['Tea', 'Coffee', 'Bread', 'Eggs', 'Milk', 'Breakfast Cereals', 'Oats & Muesli'];
    const dealItems = ['Rice', 'White Sugar', 'Mustard Oil', 'Detergents', 'Biscuits & Cookies'];

    console.log('\n--- Breakfast IDs ---');
    const breakfastCats = await Category.find({ name: { $in: breakfastItems } });
    breakfastCats.forEach(c => console.log(`${c.name}: ${c._id}`));

    console.log('\n--- Deals IDs ---');
    const dealCats = await Category.find({ name: { $in: dealItems } });
    dealCats.forEach(c => console.log(`${c.name}: ${c._id}`));

    mongoose.disconnect();
};

getIds();
