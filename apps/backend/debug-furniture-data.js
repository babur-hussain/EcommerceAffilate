const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function checkFurnitureData() {
    if (!uri) {
        console.error("❌ MONGODB_URI is undefined");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB");

        const db = mongoose.connection.db;

        // 1. Check PageLayout
        const layout = await db.collection('pagelayouts').findOne({ pageSlug: 'furniture' });
        if (layout) {
            console.log("✅ Furniture PageLayout found");
            console.log(`- Sections: ${layout.sections.length}`);
            layout.sections.forEach(s => console.log(`  - [${s.priority}] ${s.id} (${s.type})`));
        } else {
            console.log("❌ Furniture PageLayout NOT found");
        }

        // 2. Check Parent Category
        const parentCat = await db.collection('categories').findOne({
            $or: [{ name: 'Furniture' }, { slug: 'furniture' }]
        });

        if (parentCat) {
            console.log(`✅ Parent Category 'Furniture' found (ID: ${parentCat._id})`);

            // 3. Check Subcategories
            const subcats = await db.collection('categories').find({ parent: parentCat._id }).toArray();
            console.log(`ℹ️ Subcategories found: ${subcats.length}`);
            subcats.forEach(s => console.log(`  - ${s.name} (${s.slug})`));
        } else {
            console.log("❌ Parent Category 'Furniture' NOT found");
        }

        // 4. Check Products
        const products = await db.collection('products').find({ category: 'Furniture' }).limit(5).toArray();
        console.log(`ℹ️ Products with category='Furniture' found (sample 5): ${products.length}`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("✅ Connection closed");
    }
}

checkFurnitureData();
