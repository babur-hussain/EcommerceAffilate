import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const populateMrp = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products to update`);

        let updatedCount = 0;
        for (const product of products) {
            // Set MRP to random 1.5x to 3x of price to ensure good discounts
            const multiplier = 1.5 + Math.random() * 1.5;
            const newMrp = Math.ceil(product.price * multiplier);

            // Only update if missing (or we can force update to ensure 50% zone has candidates)
            // Let's force update some to be definitely > 50% discount

            // Logic: Ensure at least some have > 50% discount
            // If discount > 50%, price < 0.5 * mrp => mrp > 2 * price

            // Let's make 50% of products have >50% discount
            let finalMrp = newMrp;
            if (Math.random() > 0.5) {
                finalMrp = Math.ceil(product.price * 2.2); // > 50% discount
            }

            product.mrp = finalMrp;
            await product.save();
            updatedCount++;
            process.stdout.write('.');
        }

        console.log(`\nSuccessfully updated ${updatedCount} products with MRP`);
        process.exit(0);

    } catch (error) {
        console.error('Error seeding MRP:', error);
        process.exit(1);
    }
};

populateMrp();
