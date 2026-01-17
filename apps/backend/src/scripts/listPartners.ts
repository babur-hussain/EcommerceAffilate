
import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { env } from '../config/env';

const run = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const partners = await User.find({ role: 'DELIVERY_PARTNER' }).limit(5);

        if (partners.length === 0) {
            console.log('No delivery partners found!');
            // Create one for testing if none exist
            const newPartner = await User.create({
                uid: 'test-partner-' + Date.now(),
                email: 'partner@test.com',
                phone: '1234567890',
                role: 'DELIVERY_PARTNER',
                isActive: true,
                name: 'Test Partner',
                isOnline: false,
                location: { type: 'Point', coordinates: [0, 0] }
            });
            console.log('Created new partner:', newPartner._id);
        } else {
            console.log('Found partners:');
            partners.forEach(p => console.log(`- ID: ${p._id}, Name: ${p.name}, Email: ${p.email}`));
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

run();
