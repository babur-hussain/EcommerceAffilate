import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Product } from '../models/product.model';
import Category from '../models/category.model';
import { Brand } from '../models/brand.model';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BUSINESS_ID = '6965f8b98894f86e0ab26100'; // User Provided Business ID
const GROCERY_PARENT_ID = '696686d02c5aacc146652e03';

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

const seedProducts = async () => {
    await connectDB();

    console.log(`🌱 Seeding grocery products for Business ID: ${BUSINESS_ID}...`);

    let totalCreated = 0;
    let errors = 0;

    // 1. Get or Create Brand
    let brand = await Brand.findOne({ businessId: BUSINESS_ID });
    if (!brand) {
        console.log('brands not found, creating generic brand...');
        brand = await Brand.create({
            name: 'Generic Grocery Brand',
            businessId: BUSINESS_ID,
            isActive: true
        });
    }
    console.log(`Using Brand: ${brand.name} (${brand._id})`);

    // 2. Iterate and Create Products
    for (const group of groceryGroups) {
        console.log(`\n📂 Processing Group: ${group.name}`);

        for (const itemName of group.items) {
            try {
                // Ensure subcategory exists (by name and parent)
                // Assuming categories are already seeded as per user request context
                // We will use the 'itemName' as the category string for the product
                const categoryName = itemName;
                const slug = generateSlug(`${itemName} Premium`);

                // Generate consistent image
                const cleanName = itemName.replace(/[^a-zA-Z ]/g, "").split(" ")[0].toLowerCase();
                const lockId = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const image = `https://loremflickr.com/600/400/grocery,${cleanName}?lock=${lockId}`;

                // Randomized Price
                const price = Math.floor(Math.random() * (500 - 50 + 1) + 50); // 50 to 500

                const existingProduct = await Product.findOne({ slug, businessId: BUSINESS_ID });

                if (existingProduct) {
                    console.log(`   🔸 Product Exists: ${existingProduct.title}`);
                    continue;
                }

                await Product.create({
                    title: `Premium ${itemName}`,
                    slug: slug,
                    description: `High quality ${itemName} sourced from the best farms. Fresh and pure.`,
                    price: price,
                    mrp: price * 1.2,
                    category: categoryName, // Linking by Name string as per schema
                    image: image,
                    primaryImage: image,
                    thumbnailImage: image,
                    images: [image],
                    brandId: brand._id,
                    businessId: BUSINESS_ID,
                    stock: 100,
                    isActive: true,
                    isSponsored: false,
                    popularityScore: Math.floor(Math.random() * 100),
                    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // 3.5 to 5.0
                    ratingCount: Math.floor(Math.random() * 500),
                    netWeight: '1 kg',
                    attributes: []
                    // subCategory can be added if your schema supports it and you have logic for it
                });

                console.log(`   ✅ Created Product: Premium ${itemName}`);
                totalCreated++;

            } catch (error: any) {
                console.error(`   ❌ Error creating product for ${itemName}:`, error.message);
                errors++;
            }
        }
    }

    console.log(`\n✨ Product Seeding Complete!`);
    console.log(`Created: ${totalCreated}`);
    console.log(`Errors: ${errors}`);

    mongoose.disconnect();
};

seedProducts();
