
import mongoose from 'mongoose';
import { ShiprocketService } from '../services/shiprocket.service';
import { Order } from '../models/order.model';
import '../models/product.model'; // Register Product Schema
import '../models/business.model'; // Register Business Schema
import { env } from '../config/env';

// Adjust path to env if needed or hardcode mongodb uri for testing if env not loaded correctly (usually env is loaded by index)
// We might need to load dotenv manually
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

const ORDER_ID = '696f9ca681cf37ff2e4d594c';

async function run() {
    try {
        console.log('Connecting to DB...');
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing in env');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        console.log(`Fetching Order: ${ORDER_ID}`);
        const order = await Order.findById(ORDER_ID).populate('items.productId');

        if (!order) {
            console.error('Order not found!');
            return;
        }

        console.log('Order found. Items:', order.items.length);

        console.log('Calling checkServiceability...');
        const result = await ShiprocketService.checkServiceability(order);

        console.log('SUCCESS Result:', JSON.stringify(result, null, 2));

    } catch (error: any) {
        console.error('FAILURE Error:', error);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    } finally {
        await mongoose.disconnect();
    }
}

run();
