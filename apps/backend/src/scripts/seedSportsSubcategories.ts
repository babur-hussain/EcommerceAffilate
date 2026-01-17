import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Category from '../models/category.model';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CATEGORY_ID = '695ff7de3f61939001a06380'; // Sports Parent ID

const sportsGroups = [
    {
        name: 'Team Sports',
        items: [
            'Cricket', 'Football', 'Basketball', 'Volleyball', 'Hockey', 'Rugby', 'Baseball'
        ]
    },
    {
        name: 'Racket Sports',
        items: [
            'Badminton', 'Tennis', 'Table Tennis', 'Squash', 'Pickleball'
        ]
    },
    {
        name: 'Fitness & Gym',
        items: [
            'Treadmills', 'Dumbbells', 'Yoga Mats', 'Resistance Bands', 'Exercise Bikes', 'Gym Benches'
        ]
    },
    {
        name: 'Cycling',
        items: [
            'Mountain Bikes', 'Road Bikes', 'Hybrid Cycles', 'Cycling Accessories', 'Helmets'
        ]
    },
    {
        name: 'Outdoor & Adventure',
        items: [
            'Camping Tents', 'Hiking Bags', 'Skating', 'Swimming', 'Fishing'
        ]
    },
    {
        name: 'Indoor Games',
        items: [
            'Chess', 'Carrom', 'Dart Boards', 'Billiards & Snooker', 'Foosball'
        ]
    },
    {
        name: 'Sports Apparel',
        items: [
            'Jerseys', 'Tracksuits', 'Sports Shorts', 'Training T-Shirts', 'Sports Socks'
        ]
    },
    {
        name: 'Sports Footwear',
        items: [
            'Running Shoes', 'Football Studs', 'Cricket Spikes', 'Badminton Shoes', 'Training Shoes'
        ]
    },
    {
        name: 'Accessories',
        items: [
            'Gym Bags', 'Water Bottles', 'Protective Gear', 'Caps & Hats', 'Wristbands'
        ]
    }
];

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI not found in environment');
        console.log(`🔌 Connecting to MongoDB at ${uri.split('@')[1]}...`); // Log only host part for safety
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const seed = async () => {
    await connectDB();

    console.log(`🌱 Seeding subcategories for Sports Parent ID: ${CATEGORY_ID}...`);

    let totalCreated = 0;
    let errors = 0;

    for (const group of sportsGroups) {
        console.log(`\n📂 Processing Group: ${group.name}`);

        for (const itemName of group.items) {
            try {
                const slug = generateSlug(itemName);

                // --- IMPROVED IMAGE & ICON LOGIC ---
                // Clean the name to get a good keyword
                const cleanName = itemName.replace(/[^a-zA-Z ]/g, "").split(" ")[0].toLowerCase();

                // Use a deterministic number based on the slug for the 'lock' parameter
                const lockId = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

                // LoremFlickr with 'sports' + specific keyword
                const image = `https://loremflickr.com/600/400/sports,${cleanName}?lock=${lockId}`;

                // Icon: UI Avatars with random distinct colors based on lockId
                const colors = ['EF4444', 'F97316', 'F59E0B', '84CC16', '10B981', '06B6D4', '3B82F6', '6366F1', '8B5CF6', 'EC4899'];
                const color = colors[lockId % colors.length];
                const icon = `https://ui-avatars.com/api/?name=${encodeURIComponent(itemName)}&background=${color}&color=fff&size=512&bold=true&format=svg`;

                const existing = await Category.findOne({ slug, parentCategory: CATEGORY_ID });

                if (existing) {
                    console.log(`   🔸 Updating (Exists): ${itemName}`);
                    existing.image = image;
                    existing.icon = icon;
                    existing.isActive = true;
                    if (!existing.group) existing.group = group.name;
                    await existing.save();
                    continue;
                }

                await Category.create({
                    name: itemName,
                    slug: slug,
                    description: `High-performance ${itemName} gear for enthusiasts and pros.`,
                    parentCategory: CATEGORY_ID,
                    group: group.name,
                    image: image,
                    icon: icon,
                    isActive: true,
                    order: totalCreated + 1,
                });

                console.log(`   ✅ Created: ${itemName}`);
                totalCreated++;
            } catch (error: any) {
                console.error(`   ❌ Error creating ${itemName}:`, error.message);
                errors++;
            }
        }
    }

    console.log(`\n✨ Seeding Complete!`);
    console.log(`Created: ${totalCreated}`);
    console.log(`Errors: ${errors}`);

    mongoose.disconnect();
};

seed();
