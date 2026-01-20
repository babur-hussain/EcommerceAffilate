/**
 * One-time script to create missing InfluencerAttribution for existing orders.
 * 
 * Usage: node scripts/fix-missing-attribution.js
 * 
 * This is a manual fix for orders that were placed before the referralCode lookup bug was fixed.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerceearn';
const COMMISSION_RATE = 0.1; // 10%

async function main() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    const InfluencerAttribution = mongoose.model('InfluencerAttribution', new mongoose.Schema({}, { strict: false }));

    // Find orders with influencerCode that have no corresponding attribution
    const ordersWithCode = await Order.find({ influencerCode: { $exists: true, $ne: null } });
    console.log(`📦 Found ${ordersWithCode.length} orders with influencer codes`);

    for (const order of ordersWithCode) {
        // Check if attribution already exists
        const existingAttr = await InfluencerAttribution.findOne({ orderId: order._id });
        if (existingAttr) {
            console.log(`⏭️ Skipping order ${order._id} - attribution already exists`);
            continue;
        }

        // Find influencer by referral code
        const influencer = await User.findOne({
            referralCode: order.influencerCode.toUpperCase(),
            role: 'INFLUENCER',
            isActive: true,
        });

        if (!influencer) {
            console.log(`⚠️ Skipping order ${order._id} - influencer not found for code: ${order.influencerCode}`);
            continue;
        }

        // Get product details for businessId and brandId
        const firstItem = order.items?.[0];
        if (!firstItem?.productId) {
            console.log(`⚠️ Skipping order ${order._id} - no product items`);
            continue;
        }

        const product = await Product.findById(firstItem.productId);
        if (!product) {
            console.log(`⚠️ Skipping order ${order._id} - product not found`);
            continue;
        }

        const commissionAmount = (order.totalAmount || order.payableAmount || 0) * COMMISSION_RATE;

        // Create the attribution
        await InfluencerAttribution.create({
            influencerUserId: influencer._id,
            businessId: product.businessId,
            brandId: product.brandId,
            productId: product._id,
            orderId: order._id,
            commissionAmount,
            status: 'PENDING',
        });

        console.log(`✅ Created attribution for order ${order._id} - Commission: ₹${commissionAmount.toFixed(2)}`);
    }

    console.log('🎉 Done!');
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
});
