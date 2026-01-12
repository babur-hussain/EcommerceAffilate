/**
 * Fix Business Collection Index Issue
 *
 * This script removes the old 'name_1' index that's causing duplicate key errors
 * and cleans up any businesses with null name values.
 */

const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

async function fixBusinessIndexes() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const businessCollection = db.collection("businesses");

    // 1. List all current indexes
    console.log("\n📋 Current indexes on businesses collection:");
    const indexes = await businessCollection.indexes();
    indexes.forEach((index) => {
      console.log(`  - ${JSON.stringify(index.key)} (name: ${index.name})`);
    });

    // 2. Check for the problematic 'name_1' index
    const hasNameIndex = indexes.some((index) => index.name === "name_1");

    if (hasNameIndex) {
      console.log('\n⚠️  Found problematic "name_1" index!');

      // 3. Check for documents with null name
      const nullNameDocs = await businessCollection
        .find({ name: null })
        .toArray();
      console.log(`📊 Found ${nullNameDocs.length} documents with name: null`);

      if (nullNameDocs.length > 0) {
        console.log("\n🗑️  Removing documents with null name...");
        const deleteResult = await businessCollection.deleteMany({
          name: null,
        });
        console.log(`✅ Deleted ${deleteResult.deletedCount} documents`);
      }

      // 4. Drop the problematic index
      console.log('\n🗑️  Dropping "name_1" index...');
      await businessCollection.dropIndex("name_1");
      console.log('✅ Successfully dropped "name_1" index');

      // 5. Verify indexes after cleanup
      console.log("\n📋 Remaining indexes:");
      const remainingIndexes = await businessCollection.indexes();
      remainingIndexes.forEach((index) => {
        console.log(`  - ${JSON.stringify(index.key)} (name: ${index.name})`);
      });

      console.log("\n✅ Business collection indexes fixed successfully!");
      console.log(
        "💡 You can now register businesses without the duplicate key error."
      );
    } else {
      console.log('\n✅ No "name_1" index found - collection is clean!');

      // Still check for any null name documents
      const nullNameDocs = await businessCollection
        .find({ name: null })
        .toArray();
      if (nullNameDocs.length > 0) {
        console.log(
          `⚠️  Found ${nullNameDocs.length} documents with name: null`
        );
        console.log("🗑️  Removing them...");
        const deleteResult = await businessCollection.deleteMany({
          name: null,
        });
        console.log(`✅ Deleted ${deleteResult.deletedCount} documents`);
      }
    }

    // 6. Show total business count
    const totalBusinesses = await businessCollection.countDocuments();
    console.log(`\n📊 Total businesses in collection: ${totalBusinesses}`);
  } catch (error) {
    console.error("❌ Error fixing business indexes:", error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the fix
fixBusinessIndexes()
  .then(() => {
    console.log("\n✅ Fix completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fix failed:", error);
    process.exit(1);
  });
