import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TrendingProductCard, { TrendingProduct } from './TrendingProductCard';
import api from '../../../lib/api';
import CachedImage from '../../shared/CachedImage';

// Hardcoded visual overrides to match the design
const VISUAL_OVERRIDES = [
    {
        weight: '250 ml',
        deliveryTime: '9 MINS',
        timeLeft: 'Only 4 left',
        reviews: 1153,
        rating: 4.8
    },
    {
        weight: '1 unit',
        deliveryTime: '9 MINS',
        tag: 'No Cost EMI Offer',
        timeLeft: 'Only 1 left',
        reviews: 298,
        rating: 4.2
    },
    {
        weight: '60 g  All Skin Types',
        deliveryTime: '9 MINS',
        timeLeft: 'Only 1 left',
        discount: '11% OFF',
        reviews: 1074,
        rating: 4.5
    },
    {
        weight: '150 ml',
        deliveryTime: '15 MINS',
        reviews: 850,
        rating: 4.0
    },
    {
        weight: '500 g',
        deliveryTime: 'NEXT DAY',
        tag: 'Best Seller',
        reviews: 2300,
        rating: 4.9
    },
    {
        weight: '1 pack',
        deliveryTime: '2 DAYS',
        reviews: 120,
        rating: 3.8
    }
];

export default function TrendingNearYou() {
    const [products, setProducts] = useState<TrendingProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrendingProducts();
    }, []);

    const fetchTrendingProducts = async () => {
        try {
            const response = await api.get('/api/products?limit=6');
            const fetchedProducts = Array.isArray(response.data) ? response.data : (response.data.products || []);

            // Merge fetched data with modifiers
            const mergedProducts = fetchedProducts.slice(0, 6).map((item: any, index: number) => {
                const overrides = VISUAL_OVERRIDES[index] || {};
                return {
                    id: item._id,
                    name: item.name,
                    image: item.images && item.images.length > 0 ? { uri: item.images[0] } : null,
                    price: item.price,
                    mrp: item.mrp || Math.round(item.price * 1.2), // Dummy MRP logic if missing
                    discount: overrides.discount || (item.mrp && item.price ? `${Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF` : ''),
                    ...overrides,
                };
            });

            setProducts(mergedProducts);
        } catch (error) {
            console.error('Error fetching trending products:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: TrendingProduct }) => (
        <TrendingProductCard product={item} onAdd={() => console.log('Add', item.name)} />
    );

    if (loading || products.length === 0) return null; // Or a loading skeleton

    return (
        <View style={styles.container}>
            {/* 
        Background: Diamond/Sparkle Pattern + Soft Teal Gradient 
        Using a tiled background pattern image if available, otherwise just gradient
      */}
            <View style={styles.backgroundContainer}>
                {/* Base gradient background */}
                <LinearGradient
                    colors={['#E0FAEF', '#ECFEFF', '#F0FDF4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                />

                {/* 
            Subtle Pattern Overlay 
            Ideally this would be a local asset like 'assets/patterns/sparkles.png'
            For now, using a highly transparent repeating view or just the gradient as exact pattern is hard without asset
          */}
                <CachedImage
                    source={{ uri: 'https://www.transparenttextures.com/patterns/cubes.png' }} // Example subtle pattern URL or use local
                    style={[styles.patternImage, { opacity: 0.05 }]}
                    contentFit="cover"
                />
            </View>

            <View style={styles.header}>
                <Text style={styles.title}>Trending near you</Text>
                <Text style={styles.subtitle}>Discover the top products trending today</Text>
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
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    patternImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0D9488', // Teal 600
        marginBottom: 4,
        fontFamily: 'System', // Ensure boldest weight
    },
    subtitle: {
        fontSize: 13,
        color: '#115E59', // Teal 800
        fontWeight: '500',
        opacity: 0.9,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
});
