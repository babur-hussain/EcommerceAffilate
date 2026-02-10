
const mongoose = require('mongoose');
require('dotenv').config({ path: 'apps/backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://naved:naved123@cluster0.pwb0a.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0";

async function debugGroceryData() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected.");

        const db = mongoose.connection.db;
        const groceryCollection = db.collection('grocery_products');
        const usersCollection = db.collection('users');
        const businessesCollection = db.collection('businesses');

        // 1. Check user business ID
        const userEmail = "sarvrachna.com@gmail.com";
        const user = await usersCollection.findOne({ email: userEmail });

        if (!user) {
            console.log(`❌ User ${userEmail} not found!`);
        } else {
            console.log(`👤 User found: ${user.email}, ID: ${user._id}`);
            console.log(`   role: ${user.role}`);
            console.log(`   businessId: ${user.businessId} (Type: ${typeof user.businessId})`);

            if (user.businessId) {
                const business = await businessesCollection.findOne({ _id: new mongoose.Types.ObjectId(user.businessId) });
                // try string if objectId fails? 
                // actually check type first.
                console.log(`   Business ID Type in User: ${user.businessId ? user.businessId.constructor.name : 'null'}`);
            }
        }

        // 2. Check Grocery Products
        const count = await groceryCollection.countDocuments();
        console.log(`📦 Total Grocery Products: ${count}`);

        if (count > 0) {
            const sample = await groceryCollection.findOne();
            console.log("📝 Sample Grocery Product:");
            console.log(`   _id: ${sample._id}`);
            console.log(`   title: ${sample.title}`);
            console.log(`   businessId: ${sample.businessId} (Type: ${typeof sample.businessId}, Constructor: ${sample.businessId ? sample.businessId.constructor.name : 'null'})`);

            // Check distinctive values for businessId
            const uniqueBusinessIds = await groceryCollection.distinct('businessId');
            console.log(`🔢 Unique Business IDs in grocery_products: ${uniqueBusinessIds.length}`);
            uniqueBusinessIds.forEach(id => {
                console.log(`   - ${id} (Type: ${typeof id}, Constructor: ${id.constructor.name})`);
            });

            // 3. Try to match user business ID
            if (user && user.businessId) {
                const userBusinessIdStr = user.businessId.toString();
                // Try matching as string
                const matchStr = await groceryCollection.countDocuments({ businessId: userBusinessIdStr });
                // Try matching as ObjectId
                let matchObjId = 0;
                try {
                    matchObjId = await groceryCollection.countDocuments({ businessId: new mongoose.Types.ObjectId(userBusinessIdStr) });
                } catch (e) { console.log("   (Invalid ObjectId format for user businessId)"); }

                console.log(`🔍 Matching products for user business ${userBusinessIdStr}:`);
                console.log(`   - Match as String: ${matchStr}`);
                console.log(`   - Match as ObjectId: ${matchObjId}`);
            }
        } else {
            console.log("⚠️ No grocery products found in collection.");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected.");
    }
}

debugGroceryData();
