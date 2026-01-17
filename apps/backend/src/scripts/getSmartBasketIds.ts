
import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const fetchSmartBasketIds = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // Search for daily essentials
        const regex = /tea|coffee|oil|sugar|salt|biscuit|cookie|soap|paste/i;

        const products = await Product.find({
            title: { $regex: regex }
        }).limit(6);

        let finalProducts = products;
        if (products.length < 6) {
            const moreProducts = await Product.aggregate([{ $sample: { size: 6 - products.length } }]);
            finalProducts = [...products, ...moreProducts];
        }

        console.log('--- SMART BASKET PRODUCT IDS ---');
        finalProducts.forEach((p: any) => {
            console.log(`'${p._id}', // ${p.title}`);
        });
        console.log('------------------------------');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

fetchSmartBasketIds();
