import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Category from '../models/category.model';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CATEGORY_ID = '696686d02c5aacc146652e03'; // Grocery Parent ID

const groceryGroups = [
    {
        name: 'Staples & Essentials',
        items: [
            'Rice', 'Wheat & Atta', 'Maida & Sooji', 'Millets',
            'Pulses / Dals', 'Gram Flour (Besan)', 'Poha, Daliya, Sabudana', 'Soya Products'
        ]
    },
    {
        name: 'Spices & Masalas',
        items: [
            'Whole Spices', 'Powdered Spices', 'Blended Masalas', 'Regional Masalas',
            'Ready-to-Use Masala Pastes', 'Herbs', 'Salt'
        ]
    },
    {
        name: 'Cooking Oils & Ghee',
        items: [
            'Mustard Oil', 'Sunflower Oil', 'Soybean Oil', 'Groundnut Oil',
            'Rice Bran Oil', 'Coconut Oil', 'Olive Oil', 'Desi Ghee', 'Vanaspati'
        ]
    },
    {
        name: 'Dry Fruits & Nuts',
        items: [
            'Almonds', 'Cashews', 'Pistachios', 'Walnuts', 'Raisins',
            'Dates', 'Figs', 'Seeds', 'Roasted & Flavored Nuts'
        ]
    },
    {
        name: 'Sugar, Jaggery & Sweeteners',
        items: [
            'White Sugar', 'Brown Sugar', 'Jaggery', 'Palm Sugar',
            'Honey', 'Stevia', 'Sugar Substitutes'
        ]
    },
    {
        name: 'Tea, Coffee & Beverages',
        items: [
            'Tea', 'Coffee', 'Health Drinks', 'Energy Drinks',
            'Soft Drinks', 'Fruit Juices', 'Syrups & Concentrates'
        ]
    },
    {
        name: 'Packaged Food & Instant Food',
        items: [
            'Instant Noodles', 'Pasta & Macaroni', 'Ready-to-Eat Meals',
            'Ready-to-Cook Mixes', 'Soups', 'Frozen Food', 'Breakfast Cereals',
            'Oats & Muesli'
        ]
    },
    {
        name: 'Biscuits, Snacks & Namkeen',
        items: [
            'Biscuits & Cookies', 'Chips & Wafers', 'Namkeen & Mixtures', 'Popcorn',
            'Roasted Snacks', 'Indian Snacks', 'Chocolates & Candies'
        ]
    },
    {
        name: 'Bakery & Bread',
        items: [
            'Bread', 'Buns & Pav', 'Cakes', 'Rusk & Toast', 'Bakery Snacks'
        ]
    },
    {
        name: 'Dairy & Eggs',
        items: [
            'Milk', 'Curd & Buttermilk', 'Paneer', 'Cheese', 'Butter',
            'Ghee', 'Eggs'
        ]
    },
    {
        name: 'Pickles, Chutneys & Sauces',
        items: [
            'Pickles', 'Chutneys', 'Tomato Ketchup', 'Sauces',
            'Mayonnaise', 'Dips & Spreads'
        ]
    },
    {
        name: 'Health, Organic & Diet Food',
        items: [
            'Organic Staples', 'Gluten-Free Products', 'Diabetic Food',
            'Protein Foods', 'Ayurvedic / Herbal Food', 'Superfoods'
        ]
    },
    {
        name: 'Baby Food',
        items: [
            'Infant Formula', 'Baby Cereals', 'Baby Snacks', 'Baby Drinks'
        ]
    },
    {
        name: 'Pooja & Religious Items',
        items: [
            'Agarbatti', 'Dhoop', 'Camphor', 'Pooja Oil',
            'Hawan Samagri', 'Cotton Wicks'
        ]
    },
    {
        name: 'Household Essentials',
        items: [
            'Cleaning Liquids', 'Dishwash Bars & Liquids', 'Floor Cleaners',
            'Detergents', 'Paper Towels', 'Garbage Bags'
        ]
    },
    {
        name: 'Local & Regional Specialties',
        items: [
            'Local Rice Varieties', 'Local Spices', 'Homemade Pickles',
            'Tribal / Organic Products', 'Seasonal Special Items'
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

    console.log(`🌱 Seeding subcategories for Parent ID: ${CATEGORY_ID}...`);

    let totalCreated = 0;
    let errors = 0;

    for (const group of groceryGroups) {
        console.log(`\n📂 Processing Group: ${group.name}`);

        for (const itemName of group.items) {
            try {
                const slug = generateSlug(itemName);

                // --- IMPROVED IMAGE & ICON LOGIC ---
                // Clean the name to get a good keyword
                const cleanName = itemName.replace(/[^a-zA-Z ]/g, "").split(" ")[0].toLowerCase();

                // Use a deterministic number based on the slug for the 'lock' parameter
                const lockId = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

                // LoremFlickr with 'grocery' + specific keyword
                const image = `https://loremflickr.com/600/400/grocery,${cleanName}?lock=${lockId}`;

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
                    description: `Fresh and high-quality ${itemName} delivered to your doorstep.`,
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
