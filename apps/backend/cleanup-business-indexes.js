/**
 * Clean up obsolete indexes from Business Collection
 *
 * Removes the old 'ownerUserId_1' index that's no longer used
 */

const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

async function cleanupObsoleteIndexes() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const businessCollection = db.collection("businesses");

    // List current indexes
    console.log("\n📋 Current indexes:");
    const indexes = await businessCollection.indexes();
    indexes.forEach((index) => {
      console.log(`  - ${JSON.stringify(index.key)} (name: ${index.name})`);
    });

    // Check for ownerUserId index (old field)
    const hasOwnerUserIdIndex = indexes.some(
      (index) => index.name === "ownerUserId_1"
    );

    if (hasOwnerUserIdIndex) {
      console.log('\n⚠️  Found obsolete "ownerUserId_1" index');
      console.log('🗑️  Dropping "ownerUserId_1" index...');
      await businessCollection.dropIndex("ownerUserId_1");
      console.log("✅ Successfully dropped obsolete index");
    } else {
      console.log("\n✅ No obsolete indexes found");
    }

    // Show final state
    console.log("\n📋 Final indexes:");
    const finalIndexes = await businessCollection.indexes();
    finalIndexes.forEach((index) => {
      console.log(`  - ${JSON.stringify(index.key)} (name: ${index.name})`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

cleanupObsoleteIndexes()
  .then(() => {
    console.log("\n✅ Cleanup completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Cleanup failed:", error);
    process.exit(1);
  });
