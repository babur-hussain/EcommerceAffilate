/**
 * Clean up orphaned business records
 *
 * Removes business documents that don't have a valid userId
 */

const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

async function cleanupOrphanedBusinesses() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const businessCollection = db.collection("businesses");

    // Find businesses with no userId
    console.log("\n🔍 Looking for orphaned business records...");
    const orphanedBusinesses = await businessCollection
      .find({
        $or: [
          { userId: { $exists: false } },
          { userId: null },
          { userId: undefined },
        ],
      })
      .toArray();

    console.log(`Found ${orphanedBusinesses.length} orphaned business records`);

    if (orphanedBusinesses.length > 0) {
      console.log("\n📋 Orphaned businesses:");
      orphanedBusinesses.forEach((business) => {
        console.log(
          `   - ${business._id} (${
            business.businessIdentity?.tradeName || "No name"
          })`
        );
        console.log(`     Firebase UID: ${business.firebaseUid || "None"}`);
      });

      console.log("\n🗑️  Deleting orphaned business records...");
      const result = await businessCollection.deleteMany({
        $or: [
          { userId: { $exists: false } },
          { userId: null },
          { userId: undefined },
        ],
      });

      console.log(
        `✅ Deleted ${result.deletedCount} orphaned business records`
      );
    } else {
      console.log("✅ No orphaned business records found");
    }

    // Show final stats
    const totalBusinesses = await businessCollection.countDocuments();
    console.log(`\n📊 Total businesses remaining: ${totalBusinesses}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

cleanupOrphanedBusinesses()
  .then(() => {
    console.log("\n✅ Cleanup completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Cleanup failed:", error);
    process.exit(1);
  });
