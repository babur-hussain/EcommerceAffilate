/**
 * Fix Incomplete Business Registrations
 *
 * This script finds businesses where the registration completed but the user role
 * wasn't updated to SELLER_OWNER, and fixes them.
 */

const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

async function fixIncompleteRegistrations() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const businessCollection = db.collection("businesses");
    const userCollection = db.collection("users");

    // Find all businesses
    console.log("\n📋 Checking for incomplete registrations...");
    const businesses = await businessCollection
      .find({ isActive: true })
      .toArray();
    console.log(`Found ${businesses.length} active businesses`);

    let fixedCount = 0;
    let alreadyCorrect = 0;

    for (const business of businesses) {
      // Find the corresponding user
      const user = await userCollection.findOne({ _id: business.userId });

      if (!user) {
        console.log(
          `⚠️  Business ${business._id} has no corresponding user (userId: ${business.userId})`
        );
        continue;
      }

      // Check if user has the wrong role
      if (user.role !== "SELLER_OWNER") {
        console.log(`\n🔧 Fixing user ${user.email} (${user._id})`);
        console.log(
          `   Current role: ${user.role} -> Updating to: SELLER_OWNER`
        );
        console.log(
          `   Business: ${business.businessIdentity?.tradeName || business._id}`
        );

        // Update user role and businessId
        await userCollection.updateOne(
          { _id: user._id },
          {
            $set: {
              role: "SELLER_OWNER",
              businessId: business._id,
            },
          }
        );

        fixedCount++;
        console.log(`   ✅ Fixed!`);
      } else {
        alreadyCorrect++;
      }
    }

    console.log("\n📊 Summary:");
    console.log(`   Total businesses: ${businesses.length}`);
    console.log(`   Already correct: ${alreadyCorrect}`);
    console.log(`   Fixed: ${fixedCount}`);

    if (fixedCount > 0) {
      console.log("\n✅ Incomplete registrations have been fixed!");
      console.log(
        "💡 Users with fixed registrations can now access the dashboard."
      );
    } else {
      console.log("\n✅ All registrations are already correct!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

fixIncompleteRegistrations()
  .then(() => {
    console.log("\n✅ Script completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
