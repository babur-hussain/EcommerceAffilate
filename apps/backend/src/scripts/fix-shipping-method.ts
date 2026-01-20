// Fix shipping method for all existing orders based on their actual workflow
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const INTERNAL_DELIVERY_STATUSES = [
    'SEARCHING_FOR_PARTNER',
    'ASSIGNED',
    'PICKED_UP',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'PENDING_PICKUP'  // For orders marked ready but using internal delivery
];

async function fixOrderShippingMethods() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const db = mongoose.connection.db!;

    console.log('Starting order shipping method fix...\n');

    // Fix orders that are using internal delivery workflow
    // These have delivery statuses that indicate our own delivery partners
    const internalResult = await db.collection('orders').updateMany(
        {
            $or: [
                { deliveryStatus: { $in: INTERNAL_DELIVERY_STATUSES } },
                { deliveryPartnerId: { $exists: true, $ne: null } }
            ]
        },
        { $set: { shippingMethod: 'INTERNAL' } }
    );
    console.log(`Fixed ${internalResult.modifiedCount} orders to INTERNAL (had internal delivery workflow)`);

    // For orders without shippingMethod set, check if they have Shiprocket data
    const shiprocketResult = await db.collection('orders').updateMany(
        {
            shippingMethod: { $exists: false },
            'shiprocket.orderId': { $exists: true }
        },
        { $set: { shippingMethod: 'SHIPROCKET' } }
    );
    console.log(`Fixed ${shiprocketResult.modifiedCount} orders to SHIPROCKET (had shiprocket data)`);

    // Set remaining old orders without shippingMethod to INTERNAL (conservative default)
    const defaultResult = await db.collection('orders').updateMany(
        { shippingMethod: { $exists: false } },
        { $set: { shippingMethod: 'INTERNAL' } }
    );
    console.log(`Fixed ${defaultResult.modifiedCount} orders to INTERNAL (default)`);

    // Summary
    const summary = await db.collection('orders').aggregate([
        { $group: { _id: '$shippingMethod', count: { $sum: 1 } } }
    ]).toArray();

    console.log('\n--- Summary ---');
    summary.forEach(s => console.log(`${s._id || 'NOT SET'}: ${s.count} orders`));

    await mongoose.disconnect();
    console.log('\nDone!');
}

fixOrderShippingMethods().catch(console.error);
