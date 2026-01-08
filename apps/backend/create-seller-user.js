/**
 * Create user with business link
 */
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerceearn';

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

async function createUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const businessId = '695f555b6a1529a8da7e3ca4';
    const firebaseUid = 'mmfzrhht7BNuqQnbujLdORXxw9h2';
    const email = 'baburhussain660@gmail.com';

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      firebaseUid: firebaseUid,
      role: 'SELLER_OWNER',
      businessId: new mongoose.Types.ObjectId(businessId),
      isActive: true
    });

    console.log('\n✅ User created in MongoDB');
    console.log('  ID:', user._id);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  BusinessId:', user.businessId);
    console.log('  Firebase UID:', user.firebaseUid);

    // Update Firebase custom claims
    try {
      await admin.auth().setCustomUserClaims(firebaseUid, {
        role: 'SELLER_OWNER',
        businessId: businessId,
        accountType: 'new'
      });
      console.log('\n✅ Firebase custom claims updated');
    } catch (firebaseError) {
      console.error('\n⚠️ Firebase custom claims update failed:', firebaseError.message);
    }

    await mongoose.disconnect();
    console.log('\n✅ DONE!');
    console.log('👉 Logout and login again in the dashboard');
    console.log('👉 You should now be redirected to /seller dashboard');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createUser();
