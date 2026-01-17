import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Category from '../models/category.model';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CATEGORY_ID = '695ff7de3f61939001a06389'; // Furniture Parent ID

const furnitureGroups = [
    {
        name: 'Living Room',
        items: [
            'Sofas', 'Coffee Tables', 'TV Units', 'Armchairs', 'Recliners',
            'Bookshelves', 'Shoe Racks', 'Bean Bags', 'Sofa Beds'
        ]
    },
    {
        name: 'Bedroom',
        items: [
            'Beds', 'Mattresses', 'Wardrobes', 'Bedside Tables',
            'Dressing Tables', 'Chest of Drawers', 'Pillows'
        ]
    },
    {
        name: 'Dining Room',
        items: [
            'Dining Sets', 'Dining Chairs', 'Dining Tables', 'Bar Stools',
            'Crockery Units', 'Buffet Tables'
        ]
    },
    {
        name: 'Office Furniture',
        items: [
            'Office Chairs', 'Study Tables', 'Computer Desks',
            'File Cabinets', 'Office Sofas'
        ]
    },
    {
        name: 'Kids Furniture',
        items: [
            'Kids Beds', 'Bunk Beds', 'Kids Study Tables',
            'Kids Wardrobes', 'Kids Chairs'
        ]
    },
    {
        name: 'Outdoor Furniture',
        items: [
            'Outdoor Chairs', 'Outdoor Tables', 'Swings',
            'Hammocks', 'Patio Sets'
        ]
    },
    {
        name: 'Home Decor & Storage',
        items: [
            'Wall Shelves', 'Mirrors', 'Lamps & Lighting',
            'Carpets', 'Curtains', 'Storage Cabinets'
        ]
    }
];

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI not found in environment');
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

    console.log(`🌱 Seeding subcategories for Furniture Parent ID: ${CATEGORY_ID}...`);

    let totalCreated = 0;
    let errors = 0;

    for (const group of furnitureGroups) {
        console.log(`\n📂 Processing Group: ${group.name}`);

        for (const itemName of group.items) {
            try {
                const slug = generateSlug(itemName);

                // --- IMPROVED IMAGE & ICON LOGIC ---
                // Clean the name to get a good keyword
                const cleanName = itemName.replace(/[^a-zA-Z ]/g, "").split(" ")[0].toLowerCase();

                // Use a deterministic number based on the slug for the 'lock' parameter
                const lockId = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

                // LoremFlickr with 'furniture' + specific keyword
                const image = `https://loremflickr.com/600/400/furniture,${cleanName}?lock=${lockId}`;

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
                    description: `High-quality ${itemName} for your home and office.`,
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
