const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const CategorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    image: String,
    icon: String,
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    level: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    group: String,
});

const Category = mongoose.model('Category', CategorySchema);

async function checkCategory() {
    try {
        await mongoose.connect('mongodb+srv://baburhussain:Babur123@ecommerceaffilate.mozlczh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=EcommerceAffilate');
        console.log('Connected to DB');

        // 1. Check if the "Kids" category (parent) exists
        const kidsId = '6968f0e29424899fc3d9cc54';
        const kidsCategory = await Category.findById(kidsId);
        console.log('Kids Category:', kidsCategory);

        if (kidsCategory) {
            // 2. Fetch subcategories
            const subcategories = await Category.find({ parentCategory: kidsId });
            console.log('Subcategories found:', subcategories.length);
            console.log(JSON.stringify(subcategories, null, 2));
        } else {
            console.log("Kids category NOT FOUND with ID:", kidsId);

            // Let's search by name just in case
            const kidsByName = await Category.findOne({ name: { $regex: /kid/i } });
            console.log("Did you mean this category?", kidsByName);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkCategory();
