/**
 * List all users to find the correct email
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

async function listUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const users = await User.find({}).limit(20);
    
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      console.log(`\nFound ${users.length} users:\n`);
      users.forEach(user => {
        console.log('─────────────────────────────');
        console.log('  ID:', user._id);
        console.log('  Email:', user.email);
        console.log('  Role:', user.role);
        console.log('  BusinessId:', user.businessId || 'None');
        console.log('  Firebase UID:', user.firebaseUid || 'Not set');
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listUsers();
