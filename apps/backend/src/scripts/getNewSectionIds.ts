
import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const fetchNewSectionIds = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // Winter Must Haves (cream, lotion, tea, coffee)
        const winterProducts = await Product.find({
            title: { $regex: /cream|lotion|tea|coffee|soup|moisturizer/i }
        }).limit(6);

        // Laundry Favourites (detergent, wash, soap, powder)
        const laundryProducts = await Product.find({
            title: { $regex: /detergent|wash|soap|powder|liquid/i }
        }).limit(6);

        // Price Crash (cheap items or discounts - for now just grabbing some random ones not in others)
        // We'll just grab some random ones for "Price Crash"
        const priceCrashProducts = await Product.aggregate([{ $sample: { size: 6 } }]);

        console.log('\n--- WINTER MUST HAVES ---');
        winterProducts.forEach((p: any) => console.log(`'${p._id}', // ${p.title}`));

        console.log('\n--- LAUNDRY FAVOURITES ---');
        laundryProducts.forEach((p: any) => console.log(`'${p._id}', // ${p.title}`));

        console.log('\n--- PRICE CRASH ---');
        priceCrashProducts.forEach((p: any) => console.log(`'${p._id}', // ${p.title}`));
        console.log('------------------------------');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

fetchNewSectionIds();
