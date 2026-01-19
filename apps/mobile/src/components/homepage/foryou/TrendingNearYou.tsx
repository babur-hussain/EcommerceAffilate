import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TrendingProductCard, { TrendingProduct } from './TrendingProductCard';
import { useUserLocation } from '../../../hooks/useUserLocation';
import api from '../../../lib/api';
import CachedImage from '../../shared/CachedImage';



export default function TrendingNearYou() {
    const [products, setProducts] = useState<TrendingProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const { address: locationAddress, fetchLocation } = useUserLocation();
    const [pincode, setPincode] = useState<string | null>(null);

    useEffect(() => {
        if (locationAddress?.postalCode) {
            setPincode(locationAddress.postalCode);
        } else {
            // Trigger fetch if not available
            fetchLocation();
        }
    }, [locationAddress]);

    useEffect(() => {
        // Refetch when pincode is available or initially
        fetchTrendingProducts();
    }, [pincode]);

    const fetchTrendingProducts = async () => {
        try {
            const params: any = { sort: 'most_viewed', limit: 10 };
            if (pincode) {
                params.pincode = pincode;
            }

            const response = await api.get('/api/products', { params });
            const fetchedProducts = Array.isArray(response.data) ? response.data : (response.data.products || []);

            // Map real data to UI model
            const mappedProducts = fetchedProducts.map((item: any) => {
                // Calculate Discount
                let discountLabel = '';
                if (item.mrp && item.mrp > item.price) {
                    const off = Math.round(((item.mrp - item.price) / item.mrp) * 100);
                    if (off > 5) discountLabel = `${off}% OFF`;
                }

                // Delivery Time (Strict: Only show if Minutes or Hours)
                let deliveryTime = '';
                if (pincode && item.deliveryEstimate) {
                    const est = item.deliveryEstimate.toLowerCase();
                    if (est.includes('min') || est.includes('hour')) {
                        deliveryTime = item.deliveryEstimate;
                    }
                }

                // Stock urgency label
                let timeLeft = '';
                if (item.stock < 10 && item.stock > 0) {
                    timeLeft = `Only ${item.stock} left`;
                }

                // Tag derived from data
                let tag = undefined;
                if (item.rating > 4.5) tag = 'Best Seller';
                if (item.offers && item.offers.length > 0) tag = 'Offer Available';

                return {
                    id: item._id,
                    name: item.name || item.title,
                    image: item.images && item.images.length > 0 ? { uri: item.images[0] } : (item.image ? { uri: item.image } : null),
                    price: item.price,
                    mrp: item.mrp || undefined,
                    discount: discountLabel,
                    weight: item.netWeight || item.weight || '1 unit', // Backend field might be 'netWeight'
                    deliveryTime,
                    timeLeft,
                    reviews: item.ratingCount || 0,
                    rating: item.rating || 0,
                    tag,
                    stock: item.stock
                };
            });

            setProducts(mappedProducts);
        } catch (error) {
            console.error('Error fetching trending products:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: TrendingProduct }) => (
        <TrendingProductCard product={item} onAdd={() => {
            // Placeholder: The card itself handles Add to Cart internally if it uses AddToCartButton
            // But TrendingProductCard might not use it yet.
            // checking TrendingProductCard implementation next.
        }} />
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
        fontSize: 20,
        fontWeight: '800',
        color: '#0D9488', // Teal 600
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#115E59', // Teal 800
        fontWeight: '500',
        opacity: 0.9,
        lineHeight: 20,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
});
