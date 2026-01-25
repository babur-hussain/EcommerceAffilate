const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const userId = '696f93fcf288b99a36271ab3';
const businessId = '696f93fcf288b99a36271ab3';

async function repairUserLink() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const User = mongoose.connection.db.collection('users');

        // 1. Set correct businessId
        // 2. Unset the incorrect 'business' object I added
        const updateResult = await User.updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            {
                $set: {
                    businessId: new mongoose.Types.ObjectId(businessId) // Correct field
                },
                $unset: {
                    business: "" // Remove incorrect field
                }
            }
        );

        console.log(`✅ User repaired: ${updateResult.modifiedCount} document(s) modified.`);
        console.log('   Exchanged invalid "business" object for valid "businessId" reference.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

repairUserLink();
