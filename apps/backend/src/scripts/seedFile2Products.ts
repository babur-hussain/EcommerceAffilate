import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import Category from '../models/category.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BUSINESS_ID = '696f93fcf288b99a36271ab3';

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

const parseMarkdown = (filePath: string) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sections = content.split(/^## \d+\./m).filter(s => s.trim().length > 0);

    const products = sections.map(section => {
        const lines = section.split('\n').map(l => l.trim()).filter(l => l.startsWith('* **'));
        const productData: any = {};

        lines.forEach(line => {
            const match = line.match(/\* \*\*(.*?)\*\*: (.*)/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                value = value.replace(/`/g, '');
                productData[key] = value;
            }
        });

        return productData;
    });

    return products;
};

// Map category names to appropriate image keywords
const getCategoryImageKeyword = (categoryName: string, title: string): string => {
    const catLower = categoryName.toLowerCase();
    if (catLower.includes('shirt') || catLower.includes('t-shirt') || catLower.includes('tshirt')) return 'tshirt,fashion';
    if (catLower.includes('jean') || catLower.includes('trouser') || catLower.includes('pant')) return 'jeans,fashion';
    if (catLower.includes('jacket') || catLower.includes('hoodie') || catLower.includes('blazer')) return 'jacket,fashion';
    if (catLower.includes('shoe') || catLower.includes('boot') || catLower.includes('sandal') || catLower.includes('slipper') || catLower.includes('loafer') || catLower.includes('footwear')) return 'shoes,footwear';
    if (catLower.includes('watch') || catLower.includes('smartwatch')) return 'watch,wristwatch';
    if (catLower.includes('earbud') || catLower.includes('headphone')) return 'earbuds,electronics';
    if (catLower.includes('power bank') || catLower.includes('charger') || catLower.includes('cable')) return 'electronics,gadget';
    if (catLower.includes('laptop') || catLower.includes('keyboard') || catLower.includes('mouse') || catLower.includes('monitor')) return 'laptop,computer';
    if (catLower.includes('speaker')) return 'speaker,audio';
    if (catLower.includes('tv') || catLower.includes('television')) return 'television,smart';
    if (catLower.includes('refrigerator') || catLower.includes('fridge')) return 'refrigerator,appliance';
    if (catLower.includes('washing') || catLower.includes('washer')) return 'washingmachine,appliance';
    if (catLower.includes('air conditioner') || catLower.includes('ac')) return 'airconditioner,cooling';
    if (catLower.includes('mixer') || catLower.includes('grinder')) return 'mixer,kitchen';
    if (catLower.includes('microwave') || catLower.includes('oven')) return 'microwave,oven';
    if (catLower.includes('vacuum')) return 'vacuum,cleaning';
    if (catLower.includes('bag') || catLower.includes('backpack')) return 'backpack,bag';
    if (catLower.includes('wallet')) return 'wallet,leather';
    if (catLower.includes('belt')) return 'belt,accessories';
    if (catLower.includes('sunglass')) return 'sunglasses,eyewear';
    if (catLower.includes('kurta') || catLower.includes('sherwani') || catLower.includes('ethnic')) return 'ethnic,traditional';
    if (catLower.includes('suit') || catLower.includes('formal')) return 'suit,formal';
    const cleanName = title.replace(/[^a-zA-Z ]/g, '').split(' ')[0].toLowerCase();
    return `${cleanName},product`;
};

const seedFile2Products = async () => {
    await connectDB();

    const filePath = '/Users/baburhussain/Pictures/ecommerceearn/## 2.md';
    console.log(`🌱 Reading products from ${filePath}...`);

    const productsData = parseMarkdown(filePath);
    console.log(`Found ${productsData.length} products to seed.`);

    let totalCreated = 0;
    let totalUpdated = 0;
    let errors = 0;

    for (const data of productsData) {
        try {
            if (!data['Product Title']) continue;

            const brandName = data['Brand Name'] || data['Brand'] || 'Generic Brand';

            // Get or create brand
            let brand = await Brand.findOne({ name: brandName, businessId: BUSINESS_ID });
            if (!brand) {
                brand = await Brand.create({
                    name: brandName,
                    businessId: BUSINESS_ID,
                    isActive: true
                });
            }

            const title = data['Product Title'];
            const slug = data['URL Slug'] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const categoryId = data['Sub-Category ID'];

            if (!categoryId) {
                console.log(`   ⏭️ Skipping ${title}: No Sub-Category ID found.`);
                continue;
            }

            const parseNum = (val: string | undefined): number => {
                if (!val) return 0;
                if (val.toLowerCase() === 'free') return 0;
                if (val.toLowerCase() === 'na') return 0;
                const num = parseFloat(val.replace(/[^0-9.]/g, ''));
                return isNaN(num) ? 0 : num;
            };

            const price = parseNum(data['Selling Price']);
            const mrp = parseNum(data['MRP']);
            const stock = parseInt((data['Stock Quantity'] || '0'), 10) || 0;

            // Fetch category name from DB
            const categoryDoc = await Category.findById(categoryId);
            const categoryName = categoryDoc ? categoryDoc.name : categoryId;

            const existingProduct = await Product.findOne({ title: title });
            if (existingProduct) {
                existingProduct.businessId = new mongoose.Types.ObjectId(BUSINESS_ID);
                existingProduct.brandId = brand._id;
                existingProduct.category = categoryName;
                await existingProduct.save();
                console.log(`   🔄 Updated: ${title}`);
                totalUpdated++;
                continue;
            }

            const categoryLabel = data['Sub-Category'] || categoryName || title;
            const imageKeyword = getCategoryImageKeyword(categoryLabel, title);
            const lockId = slug.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
            const image = `https://loremflickr.com/600/400/${imageKeyword}?lock=${lockId}`;

            const discountValue = parseNum(data['Discount Value']);
            const discountPercentage = data['Discount Type'] === 'Percentage' ? discountValue : (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

            await Product.create({
                title: title,
                subtitle: data['Product Subtitle'],
                slug: slug,
                description: data['Long Description'] || data['Short Description'],
                shortDescription: data['Short Description'],
                price: price,
                mrp: mrp,
                discountPercentage: discountPercentage,
                category: categoryName,
                brandId: brand._id,
                businessId: new mongoose.Types.ObjectId(BUSINESS_ID),
                stock: stock,
                isActive: true,
                isSponsored: false,
                popularityScore: Math.floor(Math.random() * 100),
                rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
                ratingCount: Math.floor(Math.random() * 500),
                image: image,
                images: [image],
                primaryImage: image,
                thumbnailImage: image,
                metaTitle: data['SEO Title'],
                metaDescription: data['SEO Meta Description'],
                hsnCode: data['HSN / SAC Code'],
                gstRate: parseNum(data['GST Rate (%)']),
                countryOfOrigin: data['Country of Origin'],
                inventoryType: 'Seller',
                packagingType: 'Box',
                shippingCharges: parseNum(data['Shipping Charges']),
                protectPromiseFee: parseNum(data['Protect Promise Fee']),
                warrantyDetails: data['Warranty Details'],
                warrantyDuration: data['Warranty Duration'],
                barcode: data['UPC / EAN / ISBN'],
                sku: data['SKU'],
                features: [
                    data['Feature 1'],
                    data['Feature 2'],
                    data['Feature 3'],
                    data['Feature 4'],
                    data['Feature 5'],
                ].filter(Boolean),
                boxContents: data['Box Contents'],
                returnWindow: parseInt(data['Return Window (Days)'] || '7', 10) || 7,
                isCODAvailable: data['COD Available']?.toLowerCase() === 'yes',
                isFragile: data['Fragile Item']?.toLowerCase() === 'yes',
                isLiquid: data['Liquid Item']?.toLowerCase() === 'yes',
                isHazardous: data['Hazardous Item']?.toLowerCase() === 'yes',
            });

            console.log(`   ✅ Created: ${title} [${categoryName}]`);
            totalCreated++;

        } catch (error: any) {
            console.error(`   ❌ Error with "${data['Product Title']}":`, error.message);
            errors++;
        }
    }

    console.log(`\n✨ Seeding Complete!`);
    console.log(`✅ Created: ${totalCreated}`);
    console.log(`🔄 Updated: ${totalUpdated}`);
    console.log(`❌ Errors:  ${errors}`);

    mongoose.disconnect();
};

seedFile2Products();
