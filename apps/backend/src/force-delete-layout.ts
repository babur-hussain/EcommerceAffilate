import mongoose from 'mongoose';
import { env } from './config/env';
import { AdvancedLayout } from './models/advanced.layout.model';
import { connectMongo } from './config/mongo';

const run = async () => {
    await connectMongo();
    console.log('Step 1: Deleting existing for-you layout(s)...');
    const res = await AdvancedLayout.deleteMany({ slug: 'for-you' });
    console.log(`Deleted ${res.deletedCount} documents.`);
    console.log('Done. Should return empty on next fetch.');
    process.exit(0);
};

run().catch(console.error);
