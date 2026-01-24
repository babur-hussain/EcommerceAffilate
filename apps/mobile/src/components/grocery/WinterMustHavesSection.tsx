import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../lib/api';
import { ProductCardStyle1, Product } from './ProductCardStyle1';

const WINTER_IDS = [
    '69675480b5f185ae0ee5bad3', // Premium Tea
    '69675480b5f185ae0ee5bad6', // Premium Coffee
    '69675481b5f185ae0ee5baf4', // Premium Soups
    // Filling with others since we only found 3 matches above or use duplicates for demo
    '69675480b5f185ae0ee5bad3',
    '69675480b5f185ae0ee5bad6',
    '69675481b5f185ae0ee5baf4',
];

export function WinterMustHavesSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setProducts([
                { _id: 'wm1', title: 'Winter Care Lotion', price: 199, mrp: 299, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/body-lotion/j/k/l/-original-imagg9k8z6c7qg5z.jpeg?q=70', netWeight: '200ml', rating: 4.6, ratingCount: 150, categoryDetails: { _id: 'c11', name: 'Personal Care' } },
                { _id: 'wm2', title: 'Hot Chocolate Mix', price: 150, mrp: 200, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/beverage/m/n/o/-original-imagm2h2m2h2m2h2.jpeg?q=70', netWeight: '200g', rating: 4.7, ratingCount: 80, categoryDetails: { _id: 'c12', name: 'Beverages' } },
                { _id: 'wm3', title: 'Green Tea', price: 250, mrp: 300, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tea/t/u/v/-original-imagp4m8m8z8m8z8.jpeg?q=70', netWeight: '100g', rating: 4.8, ratingCount: 120, categoryDetails: { _id: 'c12', name: 'Beverages' } },
            ]);
        } catch (error) {
            console.error('Failed to fetch winter products:', error);
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
                <Text style={styles.headerTitle}>Winter Must Haves</Text>
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
