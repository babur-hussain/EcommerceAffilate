import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import https from 'https';
import { Product } from '../models/product.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BASE_URL = 'https://api.lfvs.in/api';

// All sub-category IDs from ## 2.md that need name resolution
const ID_TO_NAME: Record<string, string> = {
    '696e6db79d453a4173def377': 'T-Shirts',
    '696e6db79d453a4173def37a': 'Casual Shirts',
    '696e6db79d453a4173def37d': 'Formal Shirts',
    '696e6db79d453a4173def380': 'Jeans',
    '696e6db79d453a4173def383': 'Trousers',
    '696e6db79d453a4173def386': 'Shorts',
    '696e6db79d453a4173def389': 'Jackets',
    '696e6db79d453a4173def38c': 'Hoodies',
    '696e6db79d453a4173def38f': 'Sweaters',
    '696e6db79d453a4173def392': 'Blazers',
    '696e6db79d453a4173def395': 'Track Pants',
    '696e6db79d453a4173def398': 'Innerwear',
    '696e6db79d453a4173def39b': 'Kurtas',
    '696e6db79d453a4173def39e': 'Sherwanis',
    '696e6db79d453a4173def3a1': 'Suits',
    '696e6db79d453a4173def3a4': 'Socks',
    '696e6db79d453a4173def3a7': 'Caps',
    '696e6db79d453a4173def3aa': 'Belts',
    '696e6db79d453a4173def3ad': 'Wallets',
    '696e6db79d453a4173def3b0': 'Sunglasses',
    '696e6db79d453a4173def3b3': 'Watches',
    '696e6db79d453a4173def3b6': 'Bags & Backpacks',
    '696e6db79d453a4173def3b9': 'Sports Shoes',
    '696e6db79d453a4173def3bc': 'Casual Shoes',
    '696e6db79d453a4173def3bf': 'Formal Shoes',
    '696e6db79d453a4173def3c2': 'Sandals',
    '696e6db79d453a4173def3c5': 'Slippers & Flip Flops',
    '696e6db79d453a4173def3c8': 'Boots',
    '696e6db79d453a4173def3cb': 'Loafers',
    '696e6db79d453a4173def3ce': 'Ethnic Footwear',
    '696e6db79d453a4173def3d1': 'Smartwatches',
    '696e6db79d453a4173def3d4': 'Earbuds',
    '696e6db79d453a4173def3d7': 'Power Banks',
    '696e6db79d453a4173def3da': 'Mobile Chargers',
    '696e6db79d453a4173def3dd': 'USB Cables',
    '696e6db79d453a4173def3e0': 'Laptop Sleeves',
    '696e6db79d453a4173def3e3': 'Gaming Mouse',
    '696e6db79d453a4173def3e6': 'Mechanical Keyboard',
    '696e6db79d453a4173def3e9': 'Bluetooth Speakers',
    '696e6db79d453a4173def3ec': 'Webcam',
    '696e6db79d453a4173def3ef': 'Monitor',
    '696e6db79d453a4173def3f2': 'Printer',
    '696e6db79d453a4173def3f5': 'External Hard Drive',
    '696e6db79d453a4173def3f8': 'Pendrive',
    '696e6db79d453a4173def3fb': 'Router',
    '696e6db79d453a4173def3fe': 'CCTV Camera',
    '696e6db79d453a4173def401': 'Smart Bulb',
    '696e6db79d453a4173def404': 'Smart Door Lock',
    '696e6db79d453a4173def407': 'Smart Plug',
    '696e6db79d453a4173def40a': 'Smart LED TV',
    '696e6db79d453a4173def40d': 'Air Conditioner',
    '696e6db79d453a4173def410': 'Refrigerator',
    '696e6db79d453a4173def413': 'Washing Machine',
    '696e6db79d453a4173def416': 'Microwave Oven',
    '696e6db79d453a4173def419': 'Vacuum Cleaner',
    '696e6db79d453a4173def41c': 'Air Purifier',
    '696e6db79d453a4173def41f': 'Water Purifier',
    '696e6db79d453a4173def422': 'Ceiling Fan',
    '696e6db79d453a4173def425': 'Induction Cooktop',
    '696e6db79d453a4173def428': 'Mixer Grinder',
};

const fetchCategoryName = (id: string): Promise<string | null> => {
    return new Promise((resolve) => {
        https.get(`${BASE_URL}/categories/${id}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.name || null);
                } catch {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
};

const fixCategoryNames = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    let fixed = 0;
    let skipped = 0;

    for (const [id, fallbackName] of Object.entries(ID_TO_NAME)) {
        // Check if any products still have the ID as category
        const products = await Product.find({ category: id });
        if (products.length === 0) {
            // Category name already set correctly, skip
            continue;
        }

        // Try live API first, fall back to name from markdown
        let categoryName = await fetchCategoryName(id);
        if (!categoryName) {
            categoryName = fallbackName;
            console.log(`  ⚠️  API miss for ${id}, using fallback: "${categoryName}"`);
        }

        const result = await Product.updateMany(
            { category: id },
            { $set: { category: categoryName } }
        );

        console.log(`  ✅ Fixed ${result.modifiedCount} products: ${id} → "${categoryName}"`);
        fixed += result.modifiedCount;
    }

    if (fixed === 0) {
        console.log('ℹ️  All category names already correct. Nothing to fix!');
    } else {
        console.log(`\n✨ Done! Fixed ${fixed} products.`);
    }

    mongoose.disconnect();
};

fixCategoryNames().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
