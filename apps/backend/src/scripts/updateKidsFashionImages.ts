import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import { connectMongo, disconnectMongo } from '../config/mongo';

const kidsFashionImages = [
    'https://images.unsplash.com/photo-1519241047957-b466135b6190?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1621452773781-0f992ee03591?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1566579560416-52c7dc789c62?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519238263496-6362d74c1123?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503341338985-c0477be52513?auto=format&fit=crop&w=600&q=80'
];

async function updateKidsFashionImages() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await connectMongo();
        console.log('✅ Connected to MongoDB');

        console.log('🔍 Finding Kids\' Fashion products...');
        const products = await Product.find({
            category: { $regex: "Kids' Fashion", $options: 'i' }
        });

        console.log(`📝 Found ${products.length} products to update.`);

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            // Pick a random image from the list
            const randomImage = kidsFashionImages[i % kidsFashionImages.length];

            product.image = randomImage;
            product.images = [randomImage, ...kidsFashionImages.slice(0, 2)]; // Add couple more as gallery

            await product.save();
            // console.log(`✅ Updated ${product.title}`);
        }

        console.log('🎉 Successfully updated all Kids\' Fashion images!');

    } catch (error: any) {
        console.error('❌ Error updating images:', error.message);
        process.exit(1);
    } finally {
        await disconnectMongo();
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

updateKidsFashionImages();
