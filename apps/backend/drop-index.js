const mongoose = require('mongoose');

const uri = "mongodb+srv://baburhussain:Babur123@ecommerceaffilate.mozlczh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=EcommerceAffilate";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to DB");
    
    const collection = mongoose.connection.collection('categories');
    
    try {
        await collection.dropIndex('name_1');
        console.log("✅ Successfully dropped unique index on 'name'");
    } catch (e) {
        console.log("⚠️ Index might not exist or already dropped:", e.message);
    }
    
    // List indexes to confirm
    const indexes = await collection.indexes();
    console.log("Current Indexes:", indexes);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
