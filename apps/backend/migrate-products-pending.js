/**
 * Migration script to set all existing products to approvalStatus: 'pending'
 * Run with: node apps/backend/migrate-products-pending.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: 'apps/backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

async function migrateProducts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const productsCollection = db.collection('products');

        // Find products that don't have approvalStatus or have it as undefined
        const result = await productsCollection.updateMany(
            {
                $or: [
                    { approvalStatus: { $exists: false } },
                    { approvalStatus: null },
                    { approvalStatus: undefined }
                ]
            },
            {
                $set: {
                    approvalStatus: 'pending',
                    isActive: false
                }
            }
        );

        console.log(`Updated ${result.modifiedCount} products to 'pending' status`);

        // Count pending products
        const pendingCount = await productsCollection.countDocuments({ approvalStatus: 'pending' });
        console.log(`Total pending products: ${pendingCount}`);

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

migrateProducts();
