
import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const fetchProductIds = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // Fetch 6 random products to be our "Bestsellers"
        const products = await Product.aggregate([{ $sample: { size: 6 } }]);

        console.log('--- BESTSELLER PRODUCT IDS ---');
        products.forEach((p: any) => {
            console.log(`'${p._id}', // ${p.title}`);
        });
        console.log('------------------------------');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

fetchProductIds();
