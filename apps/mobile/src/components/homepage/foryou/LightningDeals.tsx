import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LightningDealCard, { LightningDealProduct } from './LightningDealCard';
import api from '../../../lib/api';
import CachedImage from '../../shared/CachedImage';

// Visual overrides for specific slots to match the screenshot
const DEAL_OVERRIDES = [
    {
        weight: '250 g',
        deliveryTime: '9 MINS',
        timeLeft: 'Only 1 left',
        reviews: 1843,
        rating: 4.5,
        isVeg: true,
        footerText: 'See more like this'
    },
    {
        weight: '127 g',
        deliveryTime: '9 MINS',
        timeLeft: 'Only 2 left',
        reviews: 2362,
        rating: 4.6,
        isVeg: true,
        footerText: 'See more like this'
    },
    {
        weight: '20 g',
        deliveryTime: '9 MINS',
        timeLeft: 'Only 2 left',
        reviews: 671,
        rating: 4.3,
        isVeg: true,
        footerText: 'See all Dates'
    },
    {
        weight: '168 g',
        deliveryTime: '35 MINS',
        reviews: 2633,
        rating: 4.8,
        isVeg: false, // Choco pie often non-veg/egg
        isGreatDeal: true,
        footerText: 'See more'
    },
    {
        weight: '200 g',
        deliveryTime: 'NEXT DAY',
        reviews: 500,
        rating: 4.2,
        isVeg: true,
        isImported: true,
        footerText: 'See more Prunes'
    },
    {
        weight: 'Combo of 2',
        deliveryTime: '2 DAYS',
        reviews: 301,
        rating: 4.7,
        isVeg: true,
        isGreatDeal: true,
        footerText: 'See more Packs'
    }
];

interface VisualOverride {
    weight?: string;
    deliveryTime?: string;
    timeLeft?: string;
    reviews?: number;
    rating?: number;
    isVeg?: boolean;
    footerText?: string;
    isGreatDeal?: boolean;
    isImported?: boolean;
    discount?: string;
}

export default function LightningDeals() {
    const [products, setProducts] = useState<LightningDealProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDealProducts();
    }, []);

    const fetchDealProducts = async () => {
        try {
            // Fetching slightly different products or same endpoint, for demo using same
            const response = await api.get('/api/products?limit=6&skip=6');
            const fetchedProducts = Array.isArray(response.data) ? response.data : (response.data.products || []);

            const mergedProducts = fetchedProducts.slice(0, 6).map((item: any, index: number) => {
                const overrides: VisualOverride = DEAL_OVERRIDES[index] || {};
                return {
                    id: item._id,
                    name: item.name,
                    image: item.images && item.images.length > 0 ? { uri: item.images[0] } : null,
                    price: item.price,
                    mrp: item.mrp || Math.round(item.price * 1.3),
                    discount: overrides.discount || (item.mrp && item.price ? `${Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF` : ''),
                    ...overrides,
                };
            });

            setProducts(mergedProducts);
        } catch (error) {
            console.error('Error fetching lightning deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: LightningDealProduct }) => (
        <LightningDealCard product={item} onAdd={() => console.log('Add Deal', item.name)} onSeeMore={() => console.log('See More', item.name)} />
    );

    if (loading || products.length === 0) return null;

    return (
        <View style={styles.container}>
            {/* Pink Gradient Background */}
            <LinearGradient
                colors={['#FFF0F5', '#FFE4E1', '#FDF2F8']} // Lavender Blush -> Misty Rose -> Pink tint
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.backgroundGradient}
            />

            {/* Lightning Bolt Decoration (Approximate CSS shape or image) */}
            <CachedImage
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/616/616490.png' }} // Simple lightning icon for reference
                style={styles.lightningIcon}
                contentFit="contain"
            />

            <View style={styles.header}>
                <Text style={styles.title}>Lightning deals</Text>
                <Text style={styles.subtitle}>Big savings on select products</Text>
            </View>

            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        position: 'relative',
        overflow: 'hidden',
        marginTop: 0,
    },
    backgroundGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    lightningIcon: {
        position: 'absolute',
        right: -20,
        top: -10,
        width: 150,
        height: 150,
        opacity: 0.05,
        tintColor: '#EF4444',
        transform: [{ rotate: '-15deg' }]
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#BE123C', // Rose 700 / Dark Pinkish Red
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#4B5563', // Gray 600
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
});
