// Script to fix user uid field
const mongoose = require("mongoose");

async function fixUser() {
  try {
    // Connect to MongoDB Atlas
    const MONGODB_URI =
      "mongodb+srv://baburhussain:Babur123@ecommerceaffilate.mozlczh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=EcommerceAffilate";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get the User model schema
    const userSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model("User", userSchema);

    // Find user by email
    const user = await User.findOne({ email: "rizwanmansuri7545@gmail.com" });

    if (!user) {
      console.log("User not found");
      process.exit(0);
    }

    console.log("Found user:", {
      email: user.email,
      firebaseUid: user.firebaseUid,
      uid: user.uid,
      referralCode: user.referralCode,
      role: user.role,
    });

    // Generate referral code if missing
    function generateReferralCode(name) {
      const cleanName = name
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .substring(0, 6);
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `${cleanName}${random}`;
    }

    // Update user with uid and referral code
    if (user.firebaseUid && !user.uid) {
      user.uid = user.firebaseUid;
      console.log("Setting uid from firebaseUid:", user.firebaseUid);
    }

    if (!user.referralCode) {
      user.referralCode = generateReferralCode(user.name || user.email);
      console.log("Generated referral code:", user.referralCode);
    }

    if (user.role !== "INFLUENCER") {
      user.role = "INFLUENCER";
      console.log("Set role to INFLUENCER");
    }

    await user.save();
    console.log("User updated successfully!");
    console.log("Final user:", {
      email: user.email,
      uid: user.uid,
      referralCode: user.referralCode,
      role: user.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixUser();
