const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function checkFashionData() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Define minimal schema to read data
        const categorySchema = new mongoose.Schema({
            name: String,
            slug: String,
            posters: [String],
            parentCategory: mongoose.Schema.Types.ObjectId
        });
        const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

        // 1. Find 'Fashion' category (case insensitive search)
        const fashionCat = await Category.findOne({ name: { $regex: new RegExp('^Fashion$', 'i') } });

        if (!fashionCat) {
            console.log('❌ "Fashion" category NOT FOUND');
            // List all categories to see what exists
            const allCats = await Category.find({}, 'name slug');
            console.log('Available categories:', allCats.map(c => `${c.name} (${c.slug})`));
        } else {
            console.log('✅ Found Fashion Category:', fashionCat.name);
            console.log('   Slug:', fashionCat.slug);
            console.log('   ID:', fashionCat._id);
            console.log('   Posters count:', fashionCat.posters ? fashionCat.posters.length : 0);
            if (fashionCat.posters && fashionCat.posters.length > 0) {
                console.log('   Posters:', fashionCat.posters);
            }

            // 2. Check Subcategories
            const subCats = await Category.find({ parentCategory: fashionCat._id });
            console.log('   Subcategories count:', subCats.length);
            if (subCats.length > 0) {
                console.log('   Subcategories:', subCats.map(c => c.name));
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkFashionData();
