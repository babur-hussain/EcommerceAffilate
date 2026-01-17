
import mongoose from 'mongoose';
import { env } from '../config/env';
import Category from '../models/category.model';

async function findFurnitureId() {
    try {
        await mongoose.connect(env.MONGODB_URI);
        const furniture = await Category.findOne({ name: 'Furniture' });
        if (furniture) {
            console.log(`Furniture ID: ${furniture._id}`);
            console.log(`Furniture Slug: ${furniture.slug}`);
        } else {
            console.log('Furniture category not found');
        }
        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

findFurnitureId();
