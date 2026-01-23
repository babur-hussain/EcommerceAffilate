
const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '../.env' });

// ============================================================================
// FURNITURE NEW COLLECTION LAYOUT
// ============================================================================
const newFurnitureLayout = {
    pageSlug: 'furniture-new-collection',
    name: 'New Furniture Collection',
    isActive: true,
    sections: [
        {
            id: "sec_nf_header",
            type: "new_furniture_header",
            priority: 1,
            content: {
                title: "NEW",
                subtitle: "ARRIVAL",
                tagline: "Special Collection",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvsMqAwwBuRTXVHW3j3WQjQRYXdyEGq1CvZj7PMUoDxHi8vubS0c_7gLukySTGSnDvEh3AKuyxHEZd7jllD7j0pHTQ4X8jq3aeL0WAnPdMeurccXxGDQ974-vV4UZMCR2az54ux9m_k69TNYuy99c83VY7sDHqQd5BXUK2Mr0Ker-QqGYvLcCp9a3m1FtC9oylHPac_CyUQxaNS6SIm0n5mAZ-O99raRzrP2XJy8Uf0RmlDI0vGBxmgg87OawiYCdy8HzW1fRfb5nH"
            }
        },
        {
            id: "sec_nf_filter",
            type: "new_furniture_filter",
            priority: 2,
            content: {
                categories: [
                    "All",
                    "Chairs",
                    "Ceramics",
                    "Textiles",
                    "Lighting"
                ]
            }
        },
        {
            id: "sec_nf_grid",
            type: "new_furniture_grid",
            priority: 3,
            content: {
                products: [
                    {
                        id: "1",
                        title: "Woven Lounge",
                        collection: "Rattan Collection",
                        price: "$249",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQWiiKrvcY6WygXK53r0DimSZQ4mVGErHct_OhHBtItDZsbKzS70s2nS6D_uuRkFbcmtp0NO1gJkZXg4vbQoQnqidIdBJW_Vd7FUrzgC5wd9qbJpNGyDs3qLbDeeqzoMpAymPZTHXVXLMXnULK-KEXHAfKOuP6o0Kdnu3jji3RiNvCNAu-azx0ztJ_dT5cgAxGKST4XZEmMvCBIYFOB1Hsv67qEG2E7h5nJHZ9zNjYMZ01Jv8hrlQeYYmewHoahvUOXO4x2J4WmlVu"
                    },
                    {
                        id: "2",
                        title: "Clay Vase",
                        collection: "Artisan Ceramics",
                        price: "$85",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMkwNIawCu8Pf7UEWJ7JbPuC3oTtSQqdCcrnnA_y3it9J6JsDNn3K-d7ioi1hYLxM2YcysWViKDVkpw-Ztm2iraOIA8d-_sENUak1Ft7h7kj23XBLAFjU7fjuI2rQI5Mav4b7QZj6wqZbL9eClw0JGtppe6R1GK9-OomNw37A1GushX6RYMmHOP-bw4nUD2JQTwe3j3tIoOmfjljH4rm80yfgMn2jauEEAj_ezsTuBBR9YitQRrBA0osy8iAQdkONu5WR_o_htSX6m"
                    },
                    {
                        id: "3",
                        title: "Oak Side Table",
                        collection: "Essential Wood",
                        price: "$120",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7Mo8vr6SHBE3P3x5MeFOBXmQNav2sJtYfr3Obv-wryhttkdvSOIkV3xU1MN4n5S2m5OvEoCvXG7Qoq9mIYlSa5B1VL2qxKqu0Ji-rrBpmWVFVYQ8oMppgb8OAUcfO4cIkOhkMHWN6JtMkL89PEVFa6T-_VIG6s7veeQsOy2qhwUcYpVJOWRbQ5UwAZ7fGPQHHH9igLlz8USkC60zBzPsgEuwu3ld0HrdpOE-ZgBY2zIS8mOCbDWaDlKror9v5mpgM4ODMSvXpQN7Y"
                    },
                    {
                        id: "4",
                        title: "Linen Pillow",
                        collection: "Soft Textiles",
                        price: "$45",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgN7pIT_qc0VNvufuUCSUA3kD9OsjOcnAqF8zj3ihNhmwIwLHBon2P4M1zZCA4tl-bTiC6uc9QEMmQNwfqAW2Sbe6mVuzmoDGbmTg8BBGia5s5abSPaCNRJxEjvm4sYME1D6XyBlHc3BFbTpfBSrqxEAhSwnh7qZo-L-xjzta4ozNbnMzMxvY38Mtz95NLyUPzAA5mj4hktfV-oQ5Z6Ut7JQlSGrDeRA6G_nzri2LKrQ3k9g4-LcKV6DSYyRmnKY624gNxztEpFhrz"
                    }
                ]
            }
        },
        {
            id: "sec_nf_footer",
            type: "new_furniture_footer",
            priority: 4,
            content: {}
        }
    ]
};

async function seedLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('pagelayouts');

        await collection.deleteOne({ pageSlug: 'furniture-new-collection' });
        await collection.insertOne(newFurnitureLayout);

        console.log("✅ Furniture New Collection Layout Seeded Successfully");

    } catch (err) {
        console.error("❌ Error seeding layout:", err);
    } finally {
        await client.close();
    }
}

seedLayout();
