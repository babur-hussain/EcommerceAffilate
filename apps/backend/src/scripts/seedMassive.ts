import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Category from '../models/category.model';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CATEGORIES = {
    'Electronics': '695f88c75f463eeb3c42e764',
    'Fashion': '695f88c75f463eeb3c42e765',
    'Home & Kitchen': '695f88c75f463eeb3c42e766',
    'Beauty': '695f88c75f463eeb3c42e767',
    'Sports': '695f88c75f463eeb3c42e768',
    'Books': '695f88c75f463eeb3c42e769',
    'Toys': '695f88c75f463eeb3c42e76a',
    'Health': '695f88c75f463eeb3c42e76b',
    'Automotive': '695f88c75f463eeb3c42e76c',
    'Food': '695f88c75f463eeb3c42e76d',
    'Jewelry': '695f88c75f463eeb3c42e76e',
    'Pet Supplies': '695f88c75f463eeb3c42e76f',
    'Baby Products': '695f88c75f463eeb3c42e770',
    'Furniture': '695f88c75f463eeb3c42e771',
    'Garden & Outdoor': '695f88c75f463eeb3c42e772',
};

// Data Definition
const DATA: Record<string, { group: string, items: string[] }[]> = {
    'Electronics': [
        { group: 'Mobiles & Tablets', items: ['Smartphones', 'Feature Phones', 'Refurbished Mobiles', 'Tablets', 'iPads', 'E-readers', 'Power Banks', 'Mobile Cases', 'Screen Protectors', 'Mobile Chargers', 'Cables & Cords', 'Mobile Stands', 'Selfie Sticks', 'VR Headsets', 'Memory Cards', 'Sim Cards'] },
        { group: 'Computers & Laptops', items: ['Laptops', 'Gaming Laptops', 'MacBooks', 'Desktop PCs', 'All-in-One PCs', 'Monitors', 'Keyboards', 'Mice', 'Webcams', 'Printers', 'Ink & Toners', 'Wi-Fi Routers', 'External Quality Hard Drives', 'USB Pen Drives', 'Laptop Bags', 'Laptop Skins', 'Cooling Pads', 'PC Components', 'Graphic Cards', 'Processors'] },
        { group: 'Audio', items: ['Headphones', 'Earphones', 'TWS Earbuds', 'Bluetooth Speakers', 'Soundbars', 'Home Theatre Systems', 'Multimedia Speakers', 'Party Speakers', 'Smart Speakers', 'Voice Assistants', 'MP3 Players', 'Microphones', 'Audio Interfaces', 'Amplifiers'] },
        { group: 'Cameras', items: ['DSLR Cameras', 'Mirrorless Cameras', 'Point & Shoot', 'Action Cameras', 'Instant Cameras', 'Camcorders', 'Drone Cameras', 'Camera Lenses', 'Tripods', 'Camera Bags', 'Ring Lights', 'Studio Lighting', 'Binoculars', 'Telescopes', 'Digital Photo Frames'] },
        { group: 'Wearable Technology', items: ['Smartwatches', 'Fitness Bands', 'Smart Glasses', 'VR Headsets', 'Smart Trackers', 'Smart Rings'] },
        { group: 'Office Electronics', items: ['Calculators', 'Paper Shredders', 'Laminators', 'Projectors', 'Scanners', 'Barcode Scanners', 'Attendance Machines'] }
    ],
    'Fashion': [
        { group: 'Men\'s Clothing', items: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Jeans', 'Trousers', 'Shorts', 'Track Pants', 'Suits & Blazers', 'Jackets & Coats', 'Sweaters', 'Thermals', 'Kurtas', 'Ethnic Sets', 'Dhotis', 'Innerwear', 'Sleepwear'] },
        { group: 'Women\'s Clothing', items: ['Sarees', 'Kurtas & Kurtis', 'Lehenga Choli', 'Salwar Suits', 'Gowns', 'Tops & Tunics', 'Dresses', 'Jeans & Jeggings', 'Trousers & Capris', 'Leggings', 'Skirts', 'Shorts', 'Jackets & Shrugs', 'Cardigans', 'Sweatshirts', 'Lingerie', 'Sleepwear', 'Shapewear', 'Dupattas'] },
        { group: 'Kids\' Fashion', items: ['Boys T-Shirts', 'Boys Shirts', 'Boys Jeans', 'Boys Shorts', 'Boys Ethnic Wear', 'Girls Dresses', 'Girls Tops', 'Girls Jeans', 'Girls Skirts', 'Girls Ethnic Wear', 'Infant Wear', 'Kids Innerwear', 'School Uniforms'] },
        { group: 'Footwear', items: ['Men Sports Shoes', 'Men Casual Shoes', 'Men Formal Shoes', 'Men Sandals', 'Men Slippers', 'Women Flats', 'Women Heels', 'Women Wedges', 'Women Sport Shoes', 'Women Boots', 'Kids Sport Shoes', 'Kids Sandals', 'School Shoes'] },
        { group: 'Accessories', items: ['Watches', 'Sunglasses', 'Belts', 'Wallets', 'Handbags', 'Backpacks', 'Clutches', 'Jewellery Sets', 'Earrings', 'Necklaces', 'Rings', 'Caps & Hats', 'Scarves', 'Ties & Cufflinks', 'Socks', 'Handkerchiefs', 'Umbrellas', 'Luggage & Trolleys'] }
    ],
    'Home & Kitchen': [
        { group: 'Kitchenware', items: ['Pressure Cookers', 'Pans & Tawas', 'Kadai & Woks', 'Casseroles', 'Utensil Sets', 'Knives & Boards', 'Gas Stoves', 'Kitchen Tools', 'Colanders', 'Graters', 'Peelers', 'Spatulas', 'Measuring Cups'] },
        { group: 'Tableware', items: ['Dinner Sets', 'Plates & Bowls', 'Cups & Mugs', 'Glasses', 'Cutlery', 'Serveware', 'Barware', 'Table Runners', 'Coasters', 'Napkins', 'Jugs & Flasks', 'Tiffins'] },
        { group: 'Home Decor', items: ['Wall Shelves', 'Clocks', 'Photo Frames', 'Wall Art', 'Paintings', 'Showpieces', 'Vases', 'Artificial Flowers', 'Candles', 'Candle Holders', 'Mirrors', 'Wall Stickers', 'pooja Essentials', 'Festive Decor'] },
        { group: 'Furnishing', items: ['Bedsheets', 'Curtains', 'Blankets', 'Quilts', 'Pillows', 'Cushion Covers', 'Carpets', 'Rugs', 'Doormats', 'Towels', 'Bath Mats', 'Sofa Covers', 'Mattress Protectors'] },
        { group: 'Storage', items: ['Water Bottles', 'Lunch Boxes', 'Kitchen Containers', 'Spice Racks', 'Laundry Baskets', 'Organizers', 'Hangers', 'Shoe Racks', 'Hooks & Holders'] },
        { group: 'Lighting', items: ['Bulbs', 'Tubelights', 'Ceiling Lamps', 'Table Lamps', 'Wall Lamps', 'Floor Lamps', 'Decorative Lights', 'Smart Lights', 'Emergency Lights', 'Torches'] }
    ],
    'Beauty': [
        { group: 'Makeup', items: ['Lipstick', 'Lip Gloss', 'Lip Liner', 'Foundation', 'Concealer', 'Compact Powder', 'Highlighter', 'Blush', 'Mascara', 'Eyeliner', 'Kajal', 'Eyeshadow', 'Makeup Kits', 'Nail Polish', 'Nail Art', 'Makeup Remover', 'Makeup Brushes'] },
        { group: 'Skin Care', items: ['Face Wash', 'Face Scrub', 'Face Mask', 'Moisturizer', 'Sunscreen', 'Toners', 'Serums', 'Under Eye Cream', 'Lip Balm', 'Body Lotion', 'Body Oils', 'Soaps', 'Shower Gels', 'Bath Salts'] },
        { group: 'Hair Care', items: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Serum', 'Hair Mask', 'Hair Color', 'Hair Wax', 'Hair Gel', 'Hair Spray', 'Combs & Brushes'] },
        { group: 'Fragrances', items: ['Perfumes', 'Deodorants', 'Body Mists', 'Attar', 'Pocket Perfumes'] },
        { group: 'Men\'s Grooming', items: ['Shaving Cream', 'Razors & Cartridges', 'After Shave', 'Beard Oil', 'Beard Wax', 'Beard Trimmers', 'Face Wash for Men'] },
        { group: 'Tools & Accessories', items: ['Hair Dryers', 'Straighteners', 'Curlers', 'Epilators', 'Trimmers', 'Manicure Kits', 'Pedicure Kits', 'Mirrors', 'Sponges & Applicators'] }
    ],
    'Sports': [
        { group: 'Cricket', items: ['Cricket Bats', 'Cricket Balls', 'Batting Gloves', 'Batting Pads', 'Helmets', 'Thigh Pads', 'Kit Bags', 'Stumps', 'Cricket Shoes', 'Team Jerseys'] },
        { group: 'Badminton', items: ['Badminton Racquets', 'Shuttlecocks', 'Badminton Nets', 'Badminton Shoes', 'Grips', 'Kit Bags', 'Wrist Bands'] },
        { group: 'Football', items: ['Footballs', 'Football Shoes', 'Shin Guards', 'Goalkeeper Gloves', 'Jerseys', 'Training Cones', 'Air Pumps'] },
        { group: 'Fitness', items: ['Dumbbells', 'Kettlebells', 'Barbells', 'Weight Plates', 'Benches', 'Treadmills', 'Exercise Bikes', 'Ellipticals', 'Yoga Mats', 'Resistance Bands', 'Gym Balls', 'Gym Gloves', 'Shakers', 'Support Wraps'] },
        { group: 'Cycling', items: ['Mountain Bikes', 'Hybrid Bikes', 'Road Bikes', 'Kids Cycles', 'Electric Cycles', 'Helmets', 'Cycle Locks', 'Lights & Reflectors', 'Pumps', 'Mudguards'] },
        { group: 'Outdoor', items: ['Tents', 'Sleeping Bags', 'Rucksacks', 'Hiking Shoes', 'Trekking Poles', 'Binoculars', 'Swiss Knives', 'Skating', 'Skateboards', 'Scooters'] },
        { group: 'Indoor Games', items: ['Carrom Boards', 'Chess', 'Ludo', 'Snakes & Ladders', 'Dart Boards', 'Table Tennis', 'Foosball', 'Pool Tables'] }
    ],
    'Books': [
        { group: 'Fiction', items: ['Romance', 'Thriller', 'Mystery', 'Sci-Fi', 'Fantasy', 'Horror', 'Historical Fiction', 'Classics', 'Graphic Novels', 'Comics', 'Poems', 'Short Stories'] },
        { group: 'Non-Fiction', items: ['Biographies', 'Autobiographies', 'History', 'Politics', 'Philosophy', 'Psychology', 'Sociology', 'Science', 'Technology', 'Travel', 'True Crime', 'Humor'] },
        { group: 'Academic', items: ['School Textbooks', 'College Textbooks', 'Engineering', 'Medical', 'Law', 'Management', 'Accounting', 'Entrance Exams', 'Dictionaries', 'Encyclopedias'] },
        { group: 'Children', items: ['Picture Books', 'Story Books', 'Activity Books', 'Coloring Books', 'Comics', 'Early Learning', 'Fairy Tales'] },
        { group: 'Self Help', items: ['Personal Development', 'Motivation', 'Spirituality', 'Religion', 'Health & Fitness', 'Business & Economics', 'Investing'] }
    ],
    'Toys': [
        { group: 'Baby Toys', items: ['Rattles', 'Teethers', 'Bath Toys', 'Musical Toys', 'Soft Toys', 'Stacking Toys', 'Shape Sorters', 'Activity Gyms', 'Pull Along Toys'] },
        { group: 'Educational', items: ['Puzzles', 'Building Blocks', 'Board Games', 'Science Kits', 'Art & Craft Kits', 'Clay & Dough', 'Abacus', 'Flash Cards', 'Microscopes'] },
        { group: 'Action Toys', items: ['Action Figures', 'Cars & Vehicles', 'RC Toys', 'Drone Toys', 'Train Sets', 'Guns & Darts', 'Keychains', 'Tops & Spinners'] },
        { group: 'Dolls & Houses', items: ['Barbie Dolls', 'Doll Houses', 'Kitchen Sets', 'Doctor Sets', 'Fashion Dolls', 'Plush Toys', 'Teddy Bears'] },
        { group: 'Outdoor Toys', items: ['Tricycles', 'Ride-ons', 'Skates', 'Scooters', 'Slides', 'Swings', 'Pools', 'Beach Toys', 'Trampolines', 'Inflatable Toys'] }
    ],
    'Health': [
        { group: 'Personal Care', items: ['Hand Wash', 'Sanitizers', 'Masks', 'Gloves', 'Cotton & Earbuds', 'Body Wipes', 'Adult Diapers', 'Period Care', 'Condoms', 'Lubricants'] },
        { group: 'Health Monitors', items: ['BP Monitors', 'Glucometers', 'Thermometers', 'Oximeters', 'Weighing Scales', 'Pedometers', 'Stethoscopes', 'Test Strips'] },
        { group: 'Nutrition', items: ['Protein Supplements', 'Vitamins', 'Minerals', 'Herbal Supplements', 'Weight Loss', 'Weight Gain', 'Energy Drinks', 'Health Drinks', 'Chyawanprash'] },
        { group: 'Ayurveda', items: ['Ayurvedic Medicines', 'Herbal Juices', 'Ayurvedic Oils', 'Herbal Powders', 'Bhasma', 'Organic Honey'] },
        { group: 'First Aid', items: ['Bandages', 'Antiseptics', 'Pain Relief Creams', 'Hot Water Bags', 'Ice Bags', 'Walking Sticks', 'Wheelchairs', 'Commode Chairs'] }
    ],
    'Automotive': [
        { group: 'Car Accessories', items: ['Car Covers', 'Car Mats', 'Seat Covers', 'Sun Shades', 'Steering Covers', 'Car Perfumes', 'Mobile Holders', 'Car Chargers', 'Vacuum Cleaners', 'Tyre Inflators', 'Jumper Cables', 'Tool Kits'] },
        { group: 'Bike Accessories', items: ['Bike Covers', 'Helmets', 'Riding Gloves', 'Knee & Elbow Guards', 'Face Masks', 'Bike Locks', 'Mobile Holders', 'Seat Covers', 'Tank Pads'] },
        { group: 'Car Electronics', items: ['Car Stereos', 'Car Speakers', 'Amplifiers', 'Subwoofers', 'Reverse Cameras', 'Dash Cams', 'GPS Trackers'] },
        { group: 'Spare Parts', items: ['Bulbs', 'Horns', 'Wipers', 'Filters', 'Spark Plugs', 'Brake Pads', 'Batteries', 'Tyres', 'Tubes', 'Engine Oil', 'Lubricants'] },
        { group: 'Car Care', items: ['Car Shampoos', 'Polishes', 'Waxes', 'Scratch Removers', 'Glass Cleaners', 'Microfiber Cloths', 'Sponges', 'Brushes'] }
    ],
    'Food': [
        { group: 'Staples', items: ['Rice', 'Atta', 'Flour', 'Dal', 'Pulses', 'Cooking Oil', 'Ghee', 'Sugar', 'Jaggery', 'Salt', 'Spices', 'Masalas'] },
        { group: 'Snacks', items: ['Biscuits', 'Cookies', 'Chips', 'Namkeen', 'Popcorn', 'Chocolates', 'Candies', 'Gum', 'Noodles', 'Pasta'] },
        { group: 'Beverages', items: ['Tea', 'Coffee', 'Juices', 'Soft Drinks', 'Energy Drinks', 'Water', 'Squash', 'Syrups', 'Health Drinks'] },
        { group: 'Breakfast', items: ['Cereals', 'Oats', 'Muesli', 'Cornflakes', 'Jams', 'Honey', 'Spreads', 'Peanut Butter', 'Sauces', 'Pickles'] },
        { group: 'Dairy & Bakery', items: ['Milk', 'Curd', 'Cheese', 'Butter', 'Paneer', 'Cream', 'Bread', 'Buns', 'Cakes', 'Pastries'] },
        { group: 'Instant Food', items: ['Instant Noodles', 'Sup', 'Ready to Eat', 'Frozen Food', 'Dessert Mixes', 'Baking Essentials'] },
        { group: 'Dry Fruits', items: ['Almonds', 'Cashews', 'Raisins', 'Walnuts', 'Pistachios', 'Dates', 'Figs', 'Apricots', 'Seeds'] }
    ],
    'Jewelry': [
        { group: 'Fine Jewelry', items: ['Gold Coins', 'Silver Coins', 'Diamond Rings', 'Gold Earrings', 'Gold Necklaces', 'Silver Chains'] },
        { group: 'Fashion Jewelry', items: ['Earrings', 'Necklaces', 'Pendants', 'Rings', 'Bracelets', 'Bangles', 'Anklets', 'Mangalsutras', 'Nose Rings', 'Toe Rings', 'Brooches'] },
        { group: 'Men\'s Jewelry', items: ['Rings', 'Chains', 'Bracelets', 'Cufflinks', 'Ear Studs', 'Tie Pins'] },
        { group: 'Gemstones', items: ['Ruby', 'Emerald', 'Sapphire', 'Pearl', 'Coral', 'Topaz', 'Amethyst'] }
    ],
    'Pet Supplies': [
        { group: 'Dogs', items: ['Dog Food', 'Dog Treats', 'Dog Toys', 'Leashes', 'Collars', 'Harnesses', 'Beds', 'Grooming', 'Clothing', 'Bowls'] },
        { group: 'Cats', items: ['Cat Food', 'Cat Treats', 'Cat Toys', 'Litter', 'Litter Trays', 'Scratching Posts', 'Beds', 'Collars', 'Grooming'] },
        { group: 'Fish', items: ['Fish Food', 'Aquariums', 'Filters', 'Pumps', 'Decorations', 'Cleaning Supplies'] },
        { group: 'Birds', items: ['Bird Food', 'Bird Cages', 'Bird Toys', 'Feeders', 'Nests'] },
        { group: 'Small Animals', items: ['Food', 'Cages', 'Bedding', 'Toys'] }
    ],
    'Baby Products': [
        { group: 'Diapering', items: ['Diapers', 'Wipes', 'Diaper Bags', 'Rash Creams', 'Changing Mats', 'Potty Trainers'] },
        { group: 'Feeding', items: ['Feeding Bottles', 'Nipples', 'Sterilizers', 'Warmers', 'Formula', 'Baby Food', 'Bibs', 'Sippers', 'Cups', 'Breast Pumps'] },
        { group: 'Bath & Skin', items: ['Soaps', 'Shampoos', 'Lotions', 'Oils', 'Powders', 'Creams', 'Towels', 'Bathtubs'] },
        { group: 'Gear', items: ['Strollers', 'Prams', 'Walkers', 'Car Seats', 'Carry Cots', 'High Chairs', 'Bouncers', 'Swings'] },
        { group: 'Nursery', items: ['Cribs', 'Cradles', 'Mattresses', 'Bedding Sets', 'Blankets', 'Mosquito Nets', 'Safety Locks', 'Monitors'] },
        { group: 'Maternity', items: ['Maternity Wear', 'Nursing Bras', 'Maternity Pads', 'Stretch Mark Creams', 'Pillows'] }
    ],
    'Furniture': [
        { group: 'Living Room', items: ['Sofas', 'Sofa Beds', 'Recliners', 'Bean Bags', 'Coffee Tables', 'TV Units', 'Shoe Racks', 'Bookshelves', 'Display Units', 'Wall Shelves'] },
        { group: 'Bedroom', items: ['Beds', 'Mattresses', 'Wardrobes', 'Bedside Tables', 'Dressing Tables', 'Chest of Drawers', 'Pillows', 'Mosquito Nets'] },
        { group: 'Dining', items: ['Dining Sets', 'Dining Tables', 'Dining Chairs', 'Benches', 'Bar Stools', 'Crockery Units', 'Bar Cabinets'] },
        { group: 'Office', items: ['Office Chairs', 'Study Tables', 'Computer Desks', 'Office Sofas', 'File Cabinets'] },
        { group: 'Outdoor', items: ['Outdoor Chairs', 'Outdoor Tables', 'Swings', 'Hammocks', 'Gazebos'] },
        { group: 'Kids', items: ['Kids Beds', 'Bunk Beds', 'Kids Chairs', 'Kids Tables', 'Kids Wardrobes'] },
        { group: 'Decor', items: ['Wall Art', 'Clocks', 'Lamps', 'Mirrors', 'Carpets', 'Curtains', 'Cushions'] }
    ],
    'Garden & Outdoor': [
        { group: 'Gardening', items: ['Seeds', 'Bulbs', 'Plants', 'Pots', 'Planters', 'Soil', 'Manure', 'Fertilizers', 'Pesticides'] },
        { group: 'Tools', items: ['Trowels', 'Forks', 'Pruners', 'Shears', 'Gloves', 'Watering Cans', 'Sprayers', 'Hoses', 'Rakes', 'Shovels'] },
        { group: 'Decor', items: ['Garden Lights', 'Pebbles', 'Stands', 'Fountains', 'Bird Feeders', 'Bird Baths', 'Fences'] },
        { group: 'Outdoor Living', items: ['Grills', 'BBQ', 'Picnic Bags', 'Umbrellas'] }
    ]
};

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
    console.log(`🌱 Starting MASSIVE SEED operation...`);

    let totalCreated = 0;
    let errors = 0;

    for (const [categoryName, categoryId] of Object.entries(CATEGORIES)) {
        console.log(`\n==================================================`);
        console.log(`🚀 Processing Root Category: ${categoryName}`);
        console.log(`   ID: ${categoryId}`);
        console.log(`==================================================`);

        const catData = DATA[categoryName];
        if (!catData) {
            console.log(`   ⚠️ No data defined for ${categoryName}, skipping.`);
            continue;
        }

        let catOrder = 1;

        for (const group of catData) {
            console.log(`   📂 Group: ${group.group}`);

            for (const itemName of group.items) {
                try {
                    const slug = generateSlug(itemName);

                    // --- IMAGE & ICON GENERATION ---
                    const cleanName = itemName.replace(/[^a-zA-Z ]/g, "").split(" ")[0].toLowerCase();
                    const lockId = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

                    // Use category name as primary keyword, item name as secondary
                    const imageKw = categoryName.split(' ')[0].toLowerCase().replace('&', '');
                    const image = `https://loremflickr.com/600/400/${imageKw},${cleanName}?lock=${lockId}`;

                    const colors = ['EF4444', 'F97316', 'F59E0B', '84CC16', '10B981', '06B6D4', '3B82F6', '6366F1', '8B5CF6', 'EC4899'];
                    const color = colors[lockId % colors.length];
                    const icon = `https://ui-avatars.com/api/?name=${encodeURIComponent(itemName)}&background=${color}&color=fff&size=512&bold=true&format=svg`;

                    // Check for existing to avoid duplicates (optional, but good for re-runs)
                    // We only check slug + parent to allow same names in different categories
                    const existing = await Category.findOne({ slug, parentCategory: categoryId });

                    if (existing) {
                        // Update existing
                        existing.image = image;
                        existing.icon = icon;
                        existing.isActive = true;
                        existing.group = group.group;
                        existing.order = catOrder; // Re-order
                        await existing.save();
                        // console.log(`      🔸 Updated: ${itemName}`);
                    } else {
                        // Create new
                        await Category.create({
                            name: itemName,
                            slug: slug + '-' + Math.floor(Math.random() * 1000), // Append random to ensure uniqueness globally if needed, though usually handled by uniqueness check. Actually, let's trust the slug generator for now but append if collision.
                            // Better slug logic:
                            // slug: slug, // Let's try simple slug first. If collision, handle it? 
                            // Actually, standard seed scripts just used simple slug. Let's stick to that but maybe append parent ID hash if we want global uniqueness? 
                            // The schema usually enforces unique slug GLOBAL. So 'Table' in Furniture vs 'Table' in Office might conflict.
                            // Let's modify slug to be safe: slug + '-' + categoryName-short

                            description: `Best ${itemName} in ${categoryName}`,
                            parentCategory: categoryId,
                            group: group.group,
                            image: image,
                            icon: icon,
                            isActive: true,
                            order: catOrder,
                        });
                        // console.log(`      ✅ Created: ${itemName}`);
                    }
                    catOrder++;
                    totalCreated++;
                    if (totalCreated % 50 === 0) process.stdout.write('.');

                } catch (error: any) {
                    if (error.code === 11000) {
                        // Duplicate key error (likely slug). Try again with suffix.
                        try {
                            const suffix = Math.floor(Math.random() * 10000);
                            const cleanName = itemName.replace(/[^a-zA-Z ]/g, "").split(" ")[0].toLowerCase();
                            const lockId = suffix;
                            const imageKw = categoryName.split(' ')[0].toLowerCase().replace('&', '');
                            const image = `https://loremflickr.com/600/400/${imageKw},${cleanName}?lock=${lockId}`;
                            const colors = ['EF4444', 'F97316', 'F59E0B', '84CC16', '10B981', '06B6D4', '3B82F6', '6366F1', '8B5CF6', 'EC4899'];
                            const color = colors[lockId % colors.length];
                            const icon = `https://ui-avatars.com/api/?name=${encodeURIComponent(itemName)}&background=${color}&color=fff&size=512&bold=true&format=svg`;

                            await Category.create({
                                name: itemName,
                                slug: generateSlug(itemName) + '-' + suffix,
                                description: `Best ${itemName} in ${categoryName}`,
                                parentCategory: categoryId,
                                group: group.group,
                                image: image,
                                icon: icon,
                                isActive: true,
                                order: catOrder,
                            });
                            // console.log(`      ✅ Created (Slug Retry): ${itemName}`);
                            totalCreated++;
                        } catch (retryErr) {
                            console.error(`      ❌ Failed ${itemName}:`, retryErr);
                            errors++;
                        }
                    } else {
                        console.error(`      ❌ Error ${itemName}:`, error.message);
                        errors++;
                    }
                }
            }
        }
        console.log(`   ✨ ${categoryName} Finished. Total items so far: ${totalCreated}`);
    }

    console.log(`\n🏁 MASSIVE SEED COMPLETE!`);
    console.log(`Total Subcategories Processed: ${totalCreated}`);
    console.log(`Total Errors: ${errors}`);

    mongoose.disconnect();
};

seed();
