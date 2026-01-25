import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { connectMongo, disconnectMongo } from '../config/mongo';

const BUSINESS_ID = '696f93fcf288b99a36271ab3'; // Urban Fashion Hub

// Fashion subcategories
const fashionSubcategories = {
    mens: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Jackets', 'Sweaters', 'Shorts', 'Ethnic Wear', 'Formal Wear', 'Casual Wear'],
    womens: ['Dresses', 'Tops', 'Jeans', 'Skirts', 'Kurtis', 'Sarees', 'Lehengas', 'Palazzo', 'Jumpsuits', 'Ethnic Wear'],
    kids: ['Boys T-Shirts', 'Boys Shirts', 'Boys Jeans', 'Girls Dresses', 'Girls Tops', 'Girls Jeans', 'Kids Ethnic Wear', 'Infant Wear']
};

// Fashion brand names
const fashionBrands = [
    'StyleCraft', 'UrbanEdge', 'ClassicThreads', 'TrendyWear', 'ElegantFit',
    'CasualVibes', 'PremiumStyle', 'ModernLook', 'ChicWear', 'FashionHub',
    'EliteApparel', 'SmartStyle', 'TrendSetter', 'LuxeFashion', 'UrbanChic'
];

// Product color variations
const colors = ['Black', 'White', 'Navy Blue', 'Red', 'Green', 'Grey', 'Beige', 'Brown', 'Pink', 'Yellow', 'Purple', 'Maroon', 'Olive', 'Charcoal'];

// Size variations
const mensSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const womensSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const kidsSizes = ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y', '14-15Y'];

// Fabric types
const fabrics = ['Cotton', 'Polyester', 'Cotton Blend', 'Denim', 'Linen', 'Silk', 'Wool', 'Rayon', 'Jersey', 'Chiffon'];

// Fashion product templates
const productTemplates = {
    mens: {
        'T-Shirts': [
            { name: 'Solid Round Neck T-Shirt', desc: 'Comfortable and breathable cotton t-shirt perfect for everyday wear', basePrice: 399 },
            { name: 'V-Neck Casual T-Shirt', desc: 'Stylish v-neck design with premium fabric', basePrice: 449 },
            { name: 'Printed Graphic T-Shirt', desc: 'Trendy graphic print on soft cotton fabric', basePrice: 499 },
            { name: 'Polo Collar T-Shirt', desc: 'Smart casual polo t-shirt with collar', basePrice: 599 },
            { name: 'Full Sleeve T-Shirt', desc: 'Comfortable full sleeve t-shirt for all seasons', basePrice: 549 }
        ],
        'Shirts': [
            { name: 'Formal Cotton Shirt', desc: 'Premium quality formal shirt for office wear', basePrice: 899 },
            { name: 'Casual Check Shirt', desc: 'Stylish checkered pattern casual shirt', basePrice: 799 },
            { name: 'Slim Fit Shirt', desc: 'Modern slim fit design for a sharp look', basePrice: 999 },
            { name: 'Denim Shirt', desc: 'Trendy denim shirt for casual outings', basePrice: 1199 },
            { name: 'Linen Shirt', desc: 'Breathable linen shirt perfect for summer', basePrice: 1299 }
        ],
        'Jeans': [
            { name: 'Slim Fit Jeans', desc: 'Contemporary slim fit denim jeans', basePrice: 1499 },
            { name: 'Regular Fit Jeans', desc: 'Classic regular fit comfortable jeans', basePrice: 1299 },
            { name: 'Distressed Jeans', desc: 'Trendy distressed denim for a rugged look', basePrice: 1699 },
            { name: 'Stretch Jeans', desc: 'Comfortable stretchable denim jeans', basePrice: 1599 },
            { name: 'Black Jeans', desc: 'Versatile black denim jeans', basePrice: 1399 }
        ],
        'Jackets': [
            { name: 'Bomber Jacket', desc: 'Stylish bomber jacket for winter', basePrice: 2499 },
            { name: 'Denim Jacket', desc: 'Classic denim jacket with modern fit', basePrice: 2199 },
            { name: 'Leather Jacket', desc: 'Premium faux leather jacket', basePrice: 3999 },
            { name: 'Windcheater', desc: 'Lightweight windproof jacket', basePrice: 1899 }
        ]
    },
    womens: {
        'Dresses': [
            { name: 'Floral Print Dress', desc: 'Beautiful floral pattern summer dress', basePrice: 1299 },
            { name: 'A-Line Midi Dress', desc: 'Elegant midi length dress for all occasions', basePrice: 1599 },
            { name: 'Maxi Dress', desc: 'Flowing maxi dress perfect for evening wear', basePrice: 1899 },
            { name: 'Bodycon Dress', desc: 'Trendy bodycon fit dress', basePrice: 1499 },
            { name: 'Wrap Dress', desc: 'Versatile wrap style dress', basePrice: 1699 }
        ],
        'Tops': [
            { name: 'Casual Top', desc: 'Comfortable everyday casual top', basePrice: 599 },
            { name: 'Crop Top', desc: 'Trendy crop top for young women', basePrice: 499 },
            { name: 'Formal Top', desc: 'Elegant formal top for office wear', basePrice: 899 },
            { name: 'Tank Top', desc: 'Sleeveless tank top for summer', basePrice: 399 },
            { name: 'Blouse', desc: 'Designer blouse with elegant patterns', basePrice: 799 }
        ],
        'Kurtis': [
            { name: 'Printed Kurti', desc: 'Beautiful printed kurti for daily wear', basePrice: 699 },
            { name: 'Anarkali Kurti', desc: 'Stylish anarkali design kurti', basePrice: 1299 },
            { name: 'Straight Kurti', desc: 'Simple straight cut kurti', basePrice: 599 },
            { name: 'A-Line Kurti', desc: 'Elegant a-line kurti design', basePrice: 899 },
            { name: 'Designer Kurti', desc: 'Premium designer kurti with embroidery', basePrice: 1599 }
        ],
        'Jeans': [
            { name: 'Skinny Jeans', desc: 'Slim fit skinny jeans for women', basePrice: 1399 },
            { name: 'High Waist Jeans', desc: 'Trendy high waist denim jeans', basePrice: 1599 },
            { name: 'Mom Jeans', desc: 'Comfortable mom fit jeans', basePrice: 1499 },
            { name: 'Boyfriend Jeans', desc: 'Relaxed boyfriend fit jeans', basePrice: 1699 }
        ]
    },
    kids: {
        'Boys T-Shirts': [
            { name: 'Kids Graphic T-Shirt', desc: 'Fun graphic print t-shirt for boys', basePrice: 299 },
            { name: 'Boys Polo T-Shirt', desc: 'Smart casual polo for young boys', basePrice: 399 },
            { name: 'Superhero Print T-Shirt', desc: 'Colorful superhero themed t-shirt', basePrice: 349 }
        ],
        'Girls Dresses': [
            { name: 'Princess Frock', desc: 'Adorable princess style frock for girls', basePrice: 799 },
            { name: 'Party Dress', desc: 'Beautiful party wear dress', basePrice: 999 },
            { name: 'Casual Dress', desc: 'Comfortable everyday dress for girls', basePrice: 599 }
        ],
        'Kids Ethnic Wear': [
            { name: 'Boys Kurta Set', desc: 'Traditional kurta pajama set for boys', basePrice: 899 },
            { name: 'Girls Lehenga', desc: 'Festive lehenga choli for girls', basePrice: 1499 }
        ]
    }
};

// Generate random variations
function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generatePrice(basePrice: number): { price: number; mrp: number } {
    const discount = Math.floor(Math.random() * 40) + 10; // 10-50% discount
    const mrp = Math.floor(basePrice * (1 + discount / 100));
    return { price: basePrice, mrp };
}

function generateImages(category: string): string[] {
    // Placeholder images - replace with actual image URLs
    const imageUrls = [
        'https://placehold.co/600x800/e6f3ff/0ea5e9?text=Fashion+Product',
        'https://placehold.co/600x800/fce8f3/ec4899?text=Fashion+Item',
        'https://placehold.co/600x800/ecfdf5/10b981?text=Fashion+Wear'
    ];
    return imageUrls;
}

async function seedFashionProducts() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await connectMongo();
        console.log('✅ Connected to MongoDB');

        // Verify business exists
        const { Business } = await import('../models/business.model');
        const business = await Business.findById(BUSINESS_ID);
        if (!business) {
            console.error('❌ Business not found with ID:', BUSINESS_ID);
            process.exit(1);
        }
        console.log('✅ Business found:', business.businessIdentity?.tradeName || 'Unknown');

        // Create or get brands
        console.log('🏷️ Creating fashion brands...');
        const brandIds: Record<string, mongoose.Types.ObjectId> = {};

        for (const brandName of fashionBrands) {
            let brand = await Brand.findOne({ name: brandName, businessId: BUSINESS_ID });
            if (!brand) {
                brand = await Brand.create({
                    name: brandName,
                    logo: 'https://placehold.co/200x200/0ea5e9/ffffff?text=' + brandName.substring(0, 2),
                    businessId: BUSINESS_ID,
                    isActive: true
                });
            }
            brandIds[brandName] = brand._id as mongoose.Types.ObjectId;
        }
        console.log(`✅ Created ${Object.keys(brandIds).length} brands`);

        // Generate 100 products
        const products: any[] = [];
        let productCount = 0;

        // Men's Fashion (40 products)
        for (const [subcategory, templates] of Object.entries(productTemplates.mens)) {
            for (const template of templates) {
                if (productCount >= 40) break;

                const color = getRandomElement(colors);
                const fabric = getRandomElement(fabrics);
                const brandName = getRandomElement(fashionBrands);
                const { price, mrp } = generatePrice(template.basePrice);
                const images = generateImages('mens');

                products.push({
                    title: `${template.name} - ${color} (${fabric})`,
                    description: `${template.desc}\n\nFabric: ${fabric}\nColor: ${color}\nFit: Regular\nCare: Machine wash\nOccasion: Casual/Formal\n\nSizes Available: ${mensSizes.join(', ')}`,
                    shortDescription: template.desc,
                    price,
                    mrp,
                    category: `Fashion > Men's Fashion > ${subcategory}`,
                    brand: brandName,
                    brandId: brandIds[brandName],
                    businessId: BUSINESS_ID,
                    image: images[0],
                    images,
                    stock: Math.floor(Math.random() * 100) + 50,
                    lowStockThreshold: 10,
                    isActive: true,
                    approvalStatus: 'approved',
                    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
                    ratingCount: Math.floor(Math.random() * 500) + 50,
                    isCodAvailable: true,
                    shippingCharges: 0,
                    processingTime: { value: 2, unit: 'days' },
                    metaKeywords: [subcategory, 'mens fashion', color.toLowerCase(), fabric.toLowerCase(), brandName],
                    weight: 0.3,
                    dimensions: { length: 30, breadth: 25, height: 5 }
                });

                productCount++;
            }
        }

        // Women's Fashion (40 products)
        productCount = 0;
        for (const [subcategory, templates] of Object.entries(productTemplates.womens)) {
            for (const template of templates) {
                if (productCount >= 40) break;

                const color = getRandomElement(colors);
                const fabric = getRandomElement(fabrics);
                const brandName = getRandomElement(fashionBrands);
                const { price, mrp } = generatePrice(template.basePrice);
                const images = generateImages('womens');

                products.push({
                    title: `${template.name} - ${color} (${fabric})`,
                    description: `${template.desc}\n\nFabric: ${fabric}\nColor: ${color}\nPattern: Solid/Printed\nCare: Hand wash recommended\nOccasion: Party/Casual/Formal\n\nSizes Available: ${womensSizes.join(', ')}`,
                    shortDescription: template.desc,
                    price,
                    mrp,
                    category: `Fashion > Women's Fashion > ${subcategory}`,
                    brand: brandName,
                    brandId: brandIds[brandName],
                    businessId: BUSINESS_ID,
                    image: images[0],
                    images,
                    stock: Math.floor(Math.random() * 100) + 50,
                    lowStockThreshold: 10,
                    isActive: true,
                    approvalStatus: 'approved',
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    ratingCount: Math.floor(Math.random() * 600) + 100,
                    isCodAvailable: true,
                    shippingCharges: 0,
                    processingTime: { value: 2, unit: 'days' },
                    metaKeywords: [subcategory, 'womens fashion', color.toLowerCase(), fabric.toLowerCase(), brandName],
                    weight: 0.25,
                    dimensions: { length: 28, breadth: 22, height: 4 }
                });

                productCount++;
            }
        }

        // Kids' Fashion (20 products)
        productCount = 0;
        for (const [subcategory, templates] of Object.entries(productTemplates.kids)) {
            for (const template of templates) {
                if (productCount >= 20) break;

                const color = getRandomElement(colors);
                const fabric = getRandomElement(fabrics);
                const brandName = getRandomElement(fashionBrands);
                const { price, mrp } = generatePrice(template.basePrice);
                const images = generateImages('kids');

                products.push({
                    title: `${template.name} - ${color} (${fabric})`,
                    description: `${template.desc}\n\nFabric: ${fabric}\nColor: ${color}\nAge Group: 2-15 years\nCare: Gentle machine wash\nOccasion: Daily wear/Party\n\nSizes Available: ${kidsSizes.join(', ')}`,
                    shortDescription: template.desc,
                    price,
                    mrp,
                    category: `Fashion > Kids' Fashion > ${subcategory}`,
                    brand: brandName,
                    brandId: brandIds[brandName],
                    businessId: BUSINESS_ID,
                    image: images[0],
                    images,
                    stock: Math.floor(Math.random() * 80) + 30,
                    lowStockThreshold: 10,
                    isActive: true,
                    approvalStatus: 'approved',
                    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                    ratingCount: Math.floor(Math.random() * 300) + 50,
                    isCodAvailable: true,
                    shippingCharges: 0,
                    processingTime: { value: 2, unit: 'days' },
                    metaKeywords: [subcategory, 'kids fashion', color.toLowerCase(), fabric.toLowerCase(), brandName],
                    weight: 0.2,
                    dimensions: { length: 25, breadth: 20, height: 3 }
                });

                productCount++;
            }
        }

        console.log(`\n📦 Creating ${products.length} fashion products...`);

        // Insert products in batches
        const batchSize = 20;
        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            await Product.insertMany(batch);
            console.log(`✅ Inserted products ${i + 1} to ${Math.min(i + batchSize, products.length)}`);
        }

        console.log('\n🎉 Successfully seeded fashion products!');
        console.log(`📊 Summary:`);
        console.log(`   - Total Products: ${products.length}`);
        console.log(`   - Brands: ${Object.keys(brandIds).length}`);
        console.log(`   - Categories: Men's Fashion, Women's Fashion, Kids' Fashion`);
        console.log(`   - Business ID: ${BUSINESS_ID}`);

    } catch (error: any) {
        console.error('❌ Error seeding products:', error.message);
        process.exit(1);
    } finally {
        await disconnectMongo();
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the seed script
seedFashionProducts();
