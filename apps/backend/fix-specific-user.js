/**
 * Fix specific user by linking to business and setting SELLER_OWNER role
 */
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerceearn';

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, 'firebase-adminsdk.json'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const UserSchema = new mongoose.Schema({
  email: String,
  firebaseUid: String,
  role: String,
  businessId: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function fixUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const userId = '695f526789063a65c5b790f5';
    const businessId = '695f555b6a1529a8da7e3ca4';
    const firebaseUid = 'mmfzrhht7BNuqQnbujLdORXxw9h2';

    // First, try to find user by firebaseUid
    let user = await User.findOne({ firebaseUid: firebaseUid });
    
    if (!user) {
      // Try by email
      user = await User.findOne({ email: 'baburhussain660@gmail.com' });
    }
    
    if (!user) {
      // Try by ObjectId
      user = await User.findById(new mongoose.Types.ObjectId(userId));
    }
    
    if (!user) {
      console.log('❌ User not found');
      console.log('Searching for:');
      console.log('  Firebase UID:', firebaseUid);
      console.log('  Email: baburhussain660@gmail.com');
      console.log('  User ID:', userId);
      
      // List all users
      const allUsers = await User.find({}).limit(5);
      console.log('\nFound users in database:');
      allUsers.forEach(u => {
        console.log('  -', u.email, '|', u.role, '|', u.firebaseUid || 'no UID');
      });
      
      process.exit(1);
    }

    console.log('\n📋 Current user details:');
    console.log('  ID:', user._id);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  BusinessId:', user.businessId || 'None');
    console.log('  Firebase UID:', user.firebaseUid || 'Not set');

    // Update user
    user.role = 'SELLER_OWNER';
    user.businessId = new mongoose.Types.ObjectId(businessId);
    user.isActive = true;
    await user.save();

    console.log('\n✅ User updated in MongoDB');

    // Update Firebase custom claims
    try {
      await admin.auth().setCustomUserClaims(firebaseUid, {
        role: 'SELLER_OWNER',
        businessId: businessId,
        accountType: 'new'
      });
      console.log('✅ Firebase custom claims updated');
    } catch (firebaseError) {
      console.error('⚠️ Firebase custom claims update failed:', firebaseError.message);
    }

    console.log('\n📋 Updated user details:');
    console.log('  ID:', user._id);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  BusinessId:', user.businessId);
    console.log('  Firebase UID:', user.firebaseUid);

    await mongoose.disconnect();
    console.log('\n✅ DONE - Logout and login again in dashboard to see changes!');
    console.log('👉 You should now have access to the Seller Dashboard');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixUser();
