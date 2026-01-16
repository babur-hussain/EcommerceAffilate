import express from 'express';
import { Product } from '../models/product.model';
import { DeliveryRule } from '../models/deliveryRule.model';
import { Address } from '../models/address.model';
import { getDistanceMatrix } from '../utils/geo';

const router = express.Router();

// POST /api/delivery/calculate
router.post('/calculate', async (req, res) => {
    try {
        const { productId, pincode, addressId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        let destinationPincode = pincode;

        // If addressId provided, fetch pincode from Address
        if (!destinationPincode && addressId) {
            const address = await Address.findById(addressId);
            if (address) {
                destinationPincode = address.pincode;
            }
        }

        if (!destinationPincode) {
            return res.status(400).json({ message: 'Destination pincode or valid Address ID is required' });
        }

        // 1. Fetch Product & Business (Seller)
        const product = await Product.findById(productId).populate('businessId');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const business = product.businessId as any;

        let origin = '';
        if (product.pickupLocation) {
            origin = product.pickupLocation;
        } else if (business?.addresses?.operational?.pincode) {
            origin = business.addresses.operational.pincode;
        } else if (business?.addresses?.registered?.pincode) {
            origin = business.addresses.registered.pincode;
        }

        if (!origin) {
            // Fallback if seller address missing
            const today = new Date();
            today.setDate(today.getDate() + 7);
            return res.json({
                distanceKm: 0,
                processingDays: 1,
                transitDays: 6,
                totalDays: 7,
                estimatedDate: today,
                formattedDate: today.toDateString(),
                ruleApplied: 'Standard Fallback (No Seller Info)'
            });
        }

        // 2. Calculate Distance (Real API or Fallback logic)
        let distanceKm = 0;
        let apiError = null;

        const mapResult = await getDistanceMatrix(origin, destinationPincode);

        if (mapResult.distanceInKm !== null) {
            distanceKm = mapResult.distanceInKm;
        } else {
            console.warn(`Google Maps API failed (${mapResult.error}), using fallback logic.`);
            apiError = mapResult.error;

            // Fallback based on Pincode Logic
            const isOriginPincode = /^\d6$/.test(origin); // Simple check if it looks like a pincode

            if (origin === destinationPincode) {
                distanceKm = 5;
            } else if (isOriginPincode && origin.substring(0, 3) === destinationPincode.substring(0, 3)) {
                distanceKm = 20;
            } else if (isOriginPincode && origin.substring(0, 2) === destinationPincode.substring(0, 2)) {
                distanceKm = 100;
            } else {
                distanceKm = 600;
            }
        }

        // 3. Find Matching Delivery Rule
        // Find rule where min <= distance < max
        const rule = await DeliveryRule.findOne({
            minDistance: { $lte: distanceKm },
            maxDistance: { $gt: distanceKm },
            isActive: true
        });

        // 4. Calculate Total Time
        // Processing Time
        let processingDays = 1;
        if (product.processingTime) {
            if (product.processingTime.unit === 'hours') {
                processingDays = Math.ceil(product.processingTime.value / 24);
            } else {
                processingDays = product.processingTime.value;
            }
        }

        // Transit Time (from Rule)
        let transitDays = 3; // Default fallback
        if (rule) {
            if (rule.timeUnit === 'hours') {
                transitDays = Math.ceil(rule.timeValue / 24);
            } else {
                transitDays = rule.timeValue;
            }
        } else {
            // No rule matched (maybe huge distance), default logic
            if (distanceKm < 50) transitDays = 1;
            else if (distanceKm < 200) transitDays = 2;
            else if (distanceKm < 1000) transitDays = 4;
            else transitDays = 7;
        }

        const totalDays = processingDays + transitDays;

        // Create response
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + totalDays);

        res.json({
            distanceKm,
            processingDays,
            transitDays,
            totalDays,
            estimatedDate: deliveryDate,
            formattedDate: deliveryDate.toDateString(),
            ruleApplied: rule ? rule.name : 'Standard Fallback',
            originPincode: origin,
            destinationPincode,
            apiError // Return if there was an error for debugging (optional, maybe remove in prod)
        });

    } catch (error) {
        console.error('Delivery calculation error:', error);
        res.status(500).json({ message: 'Failed to calculate delivery time', error });
    }
});

export default router;
