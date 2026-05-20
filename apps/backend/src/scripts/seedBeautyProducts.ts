import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import Category from '../models/category.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Default business ID or you can change it
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
                // Remove backticks if any
                value = value.replace(/`/g, '');
                productData[key] = value;
            }
        });
        
        return productData;
    });

    return products;
};

const seedBeautyProducts = async () => {
    await connectDB();

    const filePath = '/Users/baburhussain/Pictures/ecommerceearn/## 1.md';
    console.log(`🌱 Reading products from ${filePath}...`);
    
    const productsData = parseMarkdown(filePath);
    console.log(`Found ${productsData.length} products to seed.`);

    let totalCreated = 0;
    let errors = 0;

    for (const data of productsData) {
        try {
            if (!data['Product Title']) continue;

            const brandName = data['Brand Name'] || 'Generic Brand';
            
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
                const num = parseFloat(val.replace(/[^0-9.]/g, ''));
                return isNaN(num) ? 0 : num;
            };

            const price = parseNum(data['Selling Price']);
            const mrp = parseNum(data['MRP']);
            const stock = parseInt((data['Stock Quantity'] || '0'), 10) || 0;
            
            const categoryDoc = await Category.findById(categoryId);
            const categoryName = categoryDoc ? categoryDoc.name : categoryId;

            const existingProduct = await Product.findOne({ title: title });
            if (existingProduct) {
                existingProduct.businessId = new mongoose.Types.ObjectId(BUSINESS_ID);
                existingProduct.brandId = brand._id;
                existingProduct.category = categoryName;
                await existingProduct.save();
                console.log(`   🔄 Updated Product Business ID & Category Name: ${existingProduct.title}`);
                continue;
            }

            const cleanName = title.replace(/[^a-zA-Z ]/g, "").split(" ")[0].toLowerCase();
            const lockId = slug.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
            const image = `https://loremflickr.com/600/400/beauty,${cleanName}?lock=${lockId}`;

            await Product.create({
                title: title,
                slug: slug,
                description: data['Long Description'] || data['Short Description'],
                shortDescription: data['Short Description'],
                price: price,
                mrp: mrp,
                category: categoryId, // Assign to proper sub category id
                brandId: brand._id,
                businessId: BUSINESS_ID,
                stock: stock,
                isActive: true,
                isSponsored: false,
                popularityScore: Math.floor(Math.random() * 100),
                rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // 3.5 to 5.0
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
                barcode: data['UPC / EAN / ISBN']
            });

            console.log(`   ✅ Created Product: ${title}`);
            totalCreated++;

        } catch (error: any) {
            console.error(`   ❌ Error creating product ${data['Product Title']}:`, error.message);
            errors++;
        }
    }

    console.log(`\n✨ Product Seeding Complete!`);
    console.log(`Created: ${totalCreated}`);
    console.log(`Errors: ${errors}`);

    mongoose.disconnect();
};

seedBeautyProducts();
