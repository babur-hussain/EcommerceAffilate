/**
 * Create/update user with SELLER_OWNER role
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

async function createOrUpdateUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const email = 'baburhussain660@gmail.com';
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('Creating new user...');
      user = await User.create({
        email: email.toLowerCase(),
        role: 'SELLER_OWNER',
        isActive: true
      });
      console.log('✅ User created');
    } else {
      console.log('User found, updating...');
      user.role = 'SELLER_OWNER';
      user.isActive = true;
      await user.save();
      console.log('✅ User updated');
    }

    console.log('\n📋 User details:');
    console.log('  ID:', user._id);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Active:', user.isActive);

    await mongoose.disconnect();
    console.log('\n✓ Done - Logout and login again to see changes');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createOrUpdateUser();
