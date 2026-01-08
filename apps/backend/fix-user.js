/**
 * Quick script to fix user role for baburhussain660@gmail.com
 */
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerceearn';

const UserSchema = new mongoose.Schema({
  email: String,
  firebaseUid: String,
  role: String,
  businessId: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function fixUserRole() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const email = 'baburhussain660@gmail.com';
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('\n📋 Current user details:');
    console.log('  ID:', user._id);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  BusinessId:', user.businessId || 'None');
    console.log('  Firebase UID:', user.firebaseUid || 'Not set');

    // Update role to SELLER_OWNER
    user.role = 'SELLER_OWNER';
    await user.save();

    console.log('\n✅ User role updated to SELLER_OWNER');
    console.log('\n📋 Updated user details:');
    console.log('  ID:', user._id);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  BusinessId:', user.businessId || 'None');

    await mongoose.disconnect();
    console.log('\n✓ Done - Please logout and login again in the dashboard');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixUserRole();
