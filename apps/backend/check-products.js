const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = 'mongodb+srv://baburhussain:Babur123@ecommerceaffilate.mozlczh.mongodb.net/ecommerce';
const BUSINESS_ID = '695f555b6a1529a8da7e3ca4';

async function checkProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    
    // Check all products
    const allProducts = await Product.find({});
    console.log(`\n📦 Total products in database: ${allProducts.length}`);
    
    // Check products for this business
    const businessProducts = await Product.find({ businessId: new mongoose.Types.ObjectId(BUSINESS_ID) });
    console.log(`📦 Products for business ${BUSINESS_ID}: ${businessProducts.length}`);
    
    if (businessProducts.length > 0) {
      console.log('\n📋 Products found:');
      businessProducts.forEach((p, i) => {
        console.log(`  ${i+1}. ${p.title} - Price: ₹${p.price} - Stock: ${p.stock || 0}`);
      });
    } else {
      console.log('\n⚠️  No products found for this business');
      console.log('💡 Create products by calling POST /api/products endpoint');
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProducts();
