// Fix SHIPROCKET orders that incorrectly have internal delivery status
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

async function fixShiprocketOrders() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const db = mongoose.connection.db!;

    console.log('Fixing SHIPROCKET orders with wrong delivery status...\n');

    // SHIPROCKET orders should NOT have SEARCHING_FOR_PARTNER status
    // Clear the deliveryStatus for SHIPROCKET orders that were incorrectly assigned
    const result = await db.collection('orders').updateMany(
        {
            shippingMethod: 'SHIPROCKET',
            deliveryStatus: { $in: ['SEARCHING_FOR_PARTNER', 'PENDING_PICKUP'] }
        },
        {
            $unset: { deliveryStatus: '', deliveryPartnerId: '' }
        }
    );
    console.log(`Fixed ${result.modifiedCount} SHIPROCKET orders (removed wrong delivery status)`);

    // Also cancel any DeliveryRequests for SHIPROCKET orders
    const orders = await db.collection('orders').find({
        shippingMethod: 'SHIPROCKET'
    }).project({ _id: 1 }).toArray();

    const orderIds = orders.map(o => o._id);

    if (orderIds.length > 0) {
        const requestResult = await db.collection('deliveryrequests').updateMany(
            { orderId: { $in: orderIds }, status: 'PENDING' },
            { $set: { status: 'CANCELLED' } }
        );
        console.log(`Cancelled ${requestResult.modifiedCount} delivery requests for SHIPROCKET orders`);
    }

    // Summary
    console.log('\n--- Summary ---');
    const shiprocketOrders = await db.collection('orders').countDocuments({ shippingMethod: 'SHIPROCKET' });
    const internalOrders = await db.collection('orders').countDocuments({ shippingMethod: 'INTERNAL' });
    console.log(`SHIPROCKET orders: ${shiprocketOrders}`);
    console.log(`INTERNAL orders: ${internalOrders}`);

    await mongoose.disconnect();
    console.log('\nDone!');
}

fixShiprocketOrders().catch(console.error);
