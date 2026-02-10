
const mongoose = require('mongoose');
require('dotenv').config({ path: 'apps/backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://naved:naved123@cluster0.pwb0a.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0";

async function debugRouteLogic() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected.");

        // Simulate authUser
        const authUser = {
            id: "some-user-id",
            businessId: "696f93fcf288b99a36271ab3" // The ID found in previous step
        };

        console.log(`👤 Simulating user with Business ID: ${authUser.businessId}`);

        if (!mongoose.connection.db) {
            console.error("❌ Database connection not established (mock)");
            return;
        }

        const groceryCollection = mongoose.connection.db.collection("grocery_products");

        // Exact logic from route
        const products = await groceryCollection.find({
            businessId: new mongoose.Types.ObjectId(authUser.businessId)
        }).toArray();

        console.log(`🔍 Query Result Count: ${products.length}`);

        if (products.length === 0) {
            console.log("⚠️ Query returned 0 results using ObjectId match.");
            // Try string match just to see
            const productsStr = await groceryCollection.find({
                businessId: authUser.businessId
            }).toArray();
            console.log(`🔍 Query Result Count (String match): ${productsStr.length}`);
        } else {
            console.log("✅ Query successful.");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected.");
    }
}

debugRouteLogic();
