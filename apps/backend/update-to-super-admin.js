const mongoose = require("mongoose");

// Change this email to the user you want to make super admin
const EMAIL_TO_UPDATE = "daudmansuri7545@gmail.com";

const userSchema = new mongoose.Schema(
  {
    uid: String,
    firebaseUid: String,
    email: String,
    name: String,
    role: String,
    isActive: Boolean,
  },
  { timestamps: true, strict: false }
);

async function updateToSuperAdmin() {
  try {
    await mongoose.connect(
      "mongodb+srv://baburhussain:Babur123@ecommerceaffilate.mozlczh.mongodb.net/ecommerce"
    );
    console.log("✓ Connected to MongoDB");

    const User = mongoose.model("User", userSchema);

    // Find user by email
    const user = await User.findOne({ email: EMAIL_TO_UPDATE.toLowerCase() });

    if (!user) {
      console.log(`✗ User not found with email: ${EMAIL_TO_UPDATE}`);
      console.log("\nAvailable users:");
      const allUsers = await User.find(
        {},
        { email: 1, role: 1, name: 1 }
      ).limit(20);
      allUsers.forEach((u) => console.log(`  - ${u.email} (${u.role})`));
      process.exit(1);
    }

    console.log("\n=== Current User Details ===");
    console.log("Email:", user.email);
    console.log("Name:", user.name);
    console.log("Current Role:", user.role);
    console.log("UID:", user.uid);

    // Update to SUPER_ADMIN
    user.role = "SUPER_ADMIN";
    await user.save();

    console.log("\n=== Updated User Details ===");
    console.log("Email:", user.email);
    console.log("Name:", user.name);
    console.log("New Role:", user.role);
    console.log("\n✓ User successfully updated to SUPER_ADMIN!");
    console.log("\nYou can now login at http://localhost:3003/login");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateToSuperAdmin();
