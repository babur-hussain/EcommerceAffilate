/**
 * Script to set user role in MongoDB
 * Usage: npx ts-node src/scripts/setUserRole.ts <email> <role>
 * Example: npx ts-node src/scripts/setUserRole.ts user@example.com ADMIN
 */

import mongoose from 'mongoose';
import { User, UserRole } from '../models/user.model';
import { config } from '../config/env';

const validRoles: UserRole[] = ['ADMIN', 'SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF', 'INFLUENCER', 'CUSTOMER'];

async function setUserRole(email: string, role: UserRole) {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✓ Connected to MongoDB');

    const normalizedEmail = email.toLowerCase().trim();
    
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log(`User ${email} not found. Creating new user...`);
      user = await User.create({
        email: normalizedEmail,
        role: role,
        isActive: true,
      });
      console.log(`✓ Created user ${email} with role ${role}`);
    } else {
      user.role = role;
      await user.save();
      console.log(`✓ Updated user ${email} to role ${role}`);
    }

    console.log('\nUser details:');
    console.log(`  ID: ${user._id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Active: ${user.isActive}`);
    console.log(`  Firebase UID: ${user.firebaseUid || 'Not set'}`);

    await mongoose.disconnect();
    console.log('\n✓ Done');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

const email = process.argv[2];
const role = process.argv[3] as UserRole;

if (!email || !role) {
  console.log('Usage: npx ts-node src/scripts/setUserRole.ts <email> <role>');
  console.log(`Valid roles: ${validRoles.join(', ')}`);
  process.exit(1);
}

if (!validRoles.includes(role)) {
  console.error(`Invalid role: ${role}`);
  console.log(`Valid roles: ${validRoles.join(', ')}`);
  process.exit(1);
}

setUserRole(email, role);
