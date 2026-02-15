
const mongoose = require('mongoose');

const uri = "mongodb://baburhussain:Babur123@ac-qc0u9rr-shard-00-00.mozlczh.mongodb.net:27017,ac-qc0u9rr-shard-00-01.mozlczh.mongodb.net:27017,ac-qc0u9rr-shard-00-02.mozlczh.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-g9baay-shard-0&authSource=admin&retryWrites=true&w=majority&appName=EcommerceAffilate";

const userSchema = new mongoose.Schema({
    uid: String,
    email: String,
    role: String,
    isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function checkUser() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("Connected.");

        const email = "thebaburhussain2@gmail.com";
        console.log(`Searching for user with email: ${email}`);

        const user = await User.findOne({ email });

        if (user) {
            console.log("User found:");
            console.log(JSON.stringify(user.toJSON(), null, 2));

            if (user.role === "SUPER_ADMIN") {
                console.log("✅ User has SUPER_ADMIN role.");
            } else {
                console.log(`❌ User has role: ${user.role}`);
            }
        } else {
            console.log("❌ User not found.");
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser();
