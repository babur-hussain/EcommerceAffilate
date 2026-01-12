const admin = require("firebase-admin");
const serviceAccount = require("./firebase-adminsdk.json");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function createSuperAdmin() {
  try {
    const email = "daudmansuri7545@gmail.com"; // Change this to your email
    const password = "SuperAdmin@123"; // Change this to your desired password
    const displayName = "Super Admin";

    console.log("Creating Firebase user...");

    // Check if user already exists
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
      console.log("✓ User already exists:", user.uid);
    } catch (error) {
      // User doesn't exist, create new one
      user = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: displayName,
        emailVerified: true,
      });
      console.log("✓ Firebase user created successfully!");
    }

    console.log("\n=== Super Admin User Details ===");
    console.log("UID:", user.uid);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("\n=== Next Steps ===");
    console.log("1. Go to http://localhost:3003/login");
    console.log("2. Sign in with the credentials above");
    console.log("3. MongoDB user will be created automatically");
    console.log("\nDon't forget to change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating super admin:", error);
    process.exit(1);
  }
}

createSuperAdmin();
