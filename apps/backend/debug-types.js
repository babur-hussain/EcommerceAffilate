
const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://naved:naved123@cluster0.pwb0a.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(MONGODB_URI);

        const Category = mongoose.connection.db.collection('categories');

        // IDs from context
        const idsToCheck = [
            "697095953758a7d8f76fa8c3", // Bread & Buns
            "697095953758a7d8f76fa8c4", // Toast & Rusk
        ];

        console.log("--- Checking Types ---");
        for (const id of idsToCheck) {
            const cat = await Category.findOne({ _id: new mongoose.Types.ObjectId(id) });
            if (cat) {
                console.log(`ID: ${cat._id}`);
                console.log(`  Name: ${cat.name}`);
                console.log(`  Parent: ${cat.parentCategory}`);
                console.log(`  Parent Type: ${cat.parentCategory ? cat.parentCategory.constructor.name : 'N/A'}`);
                if (cat.parentCategory && cat.parentCategory._bsontype) {
                    console.log(`  Parent BSON Type: ${cat.parentCategory._bsontype}`);
                } else {
                    console.log(`  Parent is likely raw String: ${typeof cat.parentCategory}`);
                }
            } else {
                console.log(`ID: ${id} NOT FOUND`);
            }
        }

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

check();
