import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Category from '../models/category.model';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CATEGORY_ID = '695ff7de3f61939001a06380';
const SLUG = 'sports';

const checkAndFix = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI not found');
        console.log(`🔌 Connecting to MongoDB...`);
        await mongoose.connect(uri);
        console.log('✅ Connected');

        // Check by ID
        let byId = await Category.findById(CATEGORY_ID);
        console.log(`\n🔍 Check by ID (${CATEGORY_ID}):`, byId ? 'Found ✅' : 'Not Found ❌');
        if (byId) console.log('   Slug:', byId.slug);

        // Check by Slug
        let bySlug = await Category.findOne({ slug: SLUG });
        console.log(`\n🔍 Check by Slug (${SLUG}):`, bySlug ? 'Found ✅' : 'Not Found ❌');
        if (bySlug) console.log('   ID:', bySlug._id);

        if (!byId && !bySlug) {
            console.log('\n⚠️ Parent Category missing. Creating it...');
            await Category.create({
                _id: CATEGORY_ID,
                name: 'Sports',
                slug: SLUG,
                description: 'Sports equipment, apparel, and accessories.',
                isActive: true,
                image: 'https://loremflickr.com/600/400/sports',
                icon: 'https://ui-avatars.com/api/?name=Sports&background=random',
                order: 10
            });
            console.log('✅ Parent Category "Sports" Created!');
        } else if (bySlug && !byId) {
            console.log('\n⚠️ Found by slug but ID mismatch. Updating ID if possible is hard in Mongo. Using found ID.');
            console.log(`Existing ID for slug 'sports': ${bySlug._id}`);
            // Note: We can't easily change _id. We might need to delete and recreate if we strictly want that ID.
            // But better to just let the user know.
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        mongoose.disconnect();
    }
};

checkAndFix();
