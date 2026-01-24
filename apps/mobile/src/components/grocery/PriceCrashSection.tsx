import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../lib/api';
import { ProductCardStyle1, Product } from './ProductCardStyle1';

const PRICE_CRASH_IDS = [
    '695ffd2d5f2baf92257f146e', // Shirt
    '69675485b5f185ae0ee5bb51', // Premium Diabetic Food
    '69675485b5f185ae0ee5bb63', // Premium Baby Snacks
    '69675480b5f185ae0ee5bacd', // Premium Stevia
    '6967547fb5f185ae0ee5bac4', // Premium Jaggery
    '69675483b5f185ae0ee5bb27', // Premium Curd & Buttermilk
];

export function PriceCrashSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setProducts([
                { _id: 'pc1', title: 'Sugar 5kg', price: 180, mrp: 220, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sugar/j/k/l/-original-imagm2h2m2h2m2h2.jpeg?q=70', netWeight: '5kg', rating: 4.6, ratingCount: 100, categoryDetails: { _id: 'c4', name: 'Staples' } },
                { _id: 'pc2', title: 'Salt 1kg', price: 20, mrp: 25, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/salt/e/d/e/-original-imaghfcpz8zq8frz.jpeg?q=70', netWeight: '1kg', rating: 4.5, ratingCount: 200, categoryDetails: { _id: 'c4', name: 'Staples' } },
                { _id: 'pc3', title: 'Rice 5kg', price: 300, mrp: 350, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/rice/y/n/z/5-super-premium-basmati-rice-bag-1-kohinoor-original-imags3x2y7h7qshz.jpeg?q=70', netWeight: '5kg', rating: 4.8, ratingCount: 150, categoryDetails: { _id: 'c4', name: 'Staples' } },
            ]);
        } catch (error) {
            console.error('Failed to fetch price crash products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || products.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Price Crash</Text>
                <TouchableOpacity style={styles.arrowButton}>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {products.map((product) => (
                    <ProductCardStyle1 key={product._id} product={product} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    arrowButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 0,
    },
});
