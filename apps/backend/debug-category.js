const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";

const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    isActive: Boolean,
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    }
});

const Category = mongoose.model('Category', categorySchema);

// Check provided IDs or default to testing specific ones
const idsToCheck = process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : ['695f88c75f463eeb3c42e765', '695f88c75f463eeb3c42e76c', '695f88c75f463eeb3c42e76d', '695f88c75f463eeb3c42e771'];

async function debugCategories() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        for (const id of idsToCheck) {
            console.log(`\n🔍 Checking ID: ${id}`);
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.log('   ❌ Invalid ObjectId format');
                continue;
            }

            const category = await Category.findById(id);
            if (category) {
                console.log(`   ✅ Found: ${category.name} (${category.slug})`);
                console.log(`      IsActive: ${category.isActive}`);

                // Count subcategories
                const subCount = await Category.countDocuments({ parentCategory: id });
                console.log(`      Subcategories: ${subCount}`);

                if (subCount > 0) {
                    const subs = await Category.find({ parentCategory: id }).limit(5);
                    console.log(`      Examples: ${subs.map(s => s.name).join(', ')}`);
                }
            } else {
                console.log('   ❌ Not Found');
            }
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

debugCategories();
