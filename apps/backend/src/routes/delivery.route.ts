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

        // 2. Calculate Distance using Google Maps API
        let distanceKm = 0;
        let apiError = null;

        // Origin for Google Maps: Preference Order -> Coordinates String > Pickup Location String > Pincode
        let originString = origin;
        if (product.pickupLocationCoordinates && product.pickupLocationCoordinates.lat) {
            originString = `${product.pickupLocationCoordinates.lat},${product.pickupLocationCoordinates.lng}`;
        } else if (product.pickupLocation) {
            originString = product.pickupLocation;
        }

        const mapResult = await getDistanceMatrix(originString, destinationPincode);

        if (mapResult.distanceInKm !== null) {
            distanceKm = mapResult.distanceInKm;
        } else {
            console.warn(`Google Maps API failed (${mapResult.error}), using fallback logic.`);
            apiError = mapResult.error;

            // Fallback based on Pincode Logic (Approximate, only if Origin is a Pincode)
            const isOriginPincode = /^\d+$/.test(origin); // Simple numeric check

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

        // 4. Calculate Total Time in Hours
        // Processing Time (Convert to Hours)
        let processingHours = 24; // Default 1 day
        if (product.processingTime) {
            if (product.processingTime.unit === 'hours') {
                processingHours = product.processingTime.value;
            } else {
                processingHours = product.processingTime.value * 24;
            }
        }

        // Transit Time (Convert to Hours)
        let transitHours = 72; // Default 3 days

        if (mapResult.durationInSeconds) {
            // Real API Data: Add 4 hours buffer for handling
            transitHours = (mapResult.durationInSeconds / 3600) + 4;
        } else if (rule) {
            // Rule-based
            if (rule.timeUnit === 'hours') {
                transitHours = rule.timeValue;
            } else {
                transitHours = rule.timeValue * 24;
            }
        } else {
            // Fallback Logic
            if (distanceKm < 50) transitHours = 4; // ~4 hours for local
            else if (distanceKm < 200) transitHours = 24; // 1 day
            else if (distanceKm < 1000) transitHours = 96; // 4 days
            else transitHours = 168; // 7 days
        }

        const totalHours = Math.ceil(processingHours + transitHours);
        const totalDays = Math.ceil(totalHours / 24);

        // Format Response
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setHours(today.getHours() + totalHours);

        // precise text for short duration, date for long
        let deliveryTimeText = `Delivery by ${deliveryDate.toDateString()}`;
        if (totalHours < 48) {
            deliveryTimeText = `Delivery in ${totalHours} hours`;
        }

        res.json({
            distanceKm,
            processingHours,
            transitHours,
            totalHours,
            totalDays,
            estimatedDate: deliveryDate,
            formattedDate: deliveryDate.toDateString(),
            deliveryTimeText, // New field for UI
            ruleApplied: rule ? rule.name : 'Standard Fallback',
            originPincode: origin,
            destinationPincode
        });

    } catch (error) {
        console.error('Delivery calculation error:', error);
        res.status(500).json({ message: 'Failed to calculate delivery time', error });
    }
});

export default router;
