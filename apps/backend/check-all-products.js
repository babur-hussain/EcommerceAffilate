const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI =
  "mongodb+srv://baburhussain:Babur123@ecommerceaffilate.mozlczh.mongodb.net/ecommerce";

async function checkAllProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const Product = mongoose.model(
      "Product",
      new mongoose.Schema({}, { strict: false })
    );

    const products = await Product.find({});
    console.log(`\n📦 Total products: ${products.length}\n`);

    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`);
      console.log(`   Category: "${p.category}"`);
      console.log(`   Active: ${p.isActive}`);
      console.log(`   BusinessId: ${p.businessId}`);
      console.log("");
    });

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkAllProducts();
