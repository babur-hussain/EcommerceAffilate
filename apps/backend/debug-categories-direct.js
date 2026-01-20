
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected!');

        const collection = mongoose.connection.collection('categories');

        // 1. Count total active categories
        const total = await collection.countDocuments({ isActive: true });
        console.log(`Total active categories: ${total}`);

        // 2. Check for explicit null parentCategory
        const nullParent = await collection.countDocuments({ isActive: true, parentCategory: null });
        console.log(`Categories with parentCategory: null: ${nullParent}`);

        // 3. Check for missing parentCategory field
        const missingParent = await collection.countDocuments({ isActive: true, parentCategory: { $exists: false } });
        console.log(`Categories with missing parentCategory field: ${missingParent}`);

        // 4. Sample some root-like categories (those intended to be root)
        // We expect some to be root. Let's dump a few.
        console.log('\n--- Sample Categories ---');
        const samples = await collection.find({ isActive: true }).limit(5).toArray();
        samples.forEach(doc => {
            console.log(`Name: ${doc.name}, ID: ${doc._id}, Parent: ${doc.parentCategory} (Type: ${typeof doc.parentCategory})`);
        });

        // 5. Check what "Automotive" looks like, as we saw it in previous steps
        console.log('\n--- Automotive Category ---');
        const automotive = await collection.findOne({ name: 'Automotive' });
        console.log(automotive);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
