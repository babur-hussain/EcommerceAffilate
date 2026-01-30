require('dotenv').config();
const mongoose = require('mongoose');

// Define Schema roughly (or import if TS -> JS workflow was easy, but raw JS script is safer here)
const layoutSchema = new mongoose.Schema({
    slug: String,
    name: String,
    isActive: Boolean,
    components: Array
}, { strict: false });

const AdvancedLayout = mongoose.model('AdvancedLayout', layoutSchema);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce-app"; // Fallback to local if env missing

async function updateFashionLayout() {
    try {
        console.log("🔌 Connecting to MongoDB:", MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected.");

        const fashionComponents = [
            {
                "id": "global_fashion_hero",
                "type": "hero_carousel",
                "props": {
                    "banners": [
                        {
                            "id": "fashion_banner_1",
                            "image": "https://img.freepik.com/free-photo/young-woman-with-shopping-bags-beautiful-dress_1303-17504.jpg",
                            "actionUrl": "/bannerPages/fashion-sale"
                        },
                        {
                            "id": "fashion_banner_2",
                            "image": "https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074076.jpg",
                            "actionUrl": "/common-category/clothing"
                        },
                        {
                            "id": "fashion_banner_3",
                            "image": "https://img.freepik.com/free-photo/fashionable-pale-brunette-long-green-dress-black-jacket-sunglasses-standing-street-during-daytime-against-grey-wall_197531-24468.jpg",
                            "actionUrl": "/common-category/dresses"
                        }
                    ]
                }
            },
            {
                "id": "global_sub_cats",
                "type": "sub_category_slider",
                "props": {
                    "parentCategoryId": "695f88c75f463eeb3c42e765"
                }
            }
        ];

        console.log("🔄 Updating Fashion Layout...");
        const result = await AdvancedLayout.findOneAndUpdate(
            { slug: 'fashion' },
            {
                $set: {
                    name: "Fashion Page",
                    isActive: true,
                    components: fashionComponents
                }
            },
            { upsert: true, new: true }
        );

        console.log("✅ Fashion Layout Updated Successfully!");
        console.log("Slug:", result.slug);
        console.log("Components Count:", result.components.length);
        console.log("Top Component:", result.components[0].type);

    } catch (error) {
        console.error("❌ Error updating fashion layout:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected.");
    }
}

updateFashionLayout();
