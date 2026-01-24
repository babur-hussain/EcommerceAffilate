import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../lib/api';
import { ProductCardStyle1, Product } from './ProductCardStyle1';

const LAUNDRY_IDS = [
    '69675486b5f185ae0ee5bb7b', // Premium Cleaning Liquids
    '69675486b5f185ae0ee5bb7e', // Premium Dishwash Bars & Liquids
    '69675487b5f185ae0ee5bb84', // Premium Detergents
    '6967547db5f185ae0ee5ba76', // Premium Powdered Spices (using as filler if needed, actually fetched "Powder")
];

export function LaundryFavouritesSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setProducts([
                { _id: 'lf1', title: 'Liquid Detergent', price: 199, mrp: 250, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/washing-powder/c/3/c/-original-imagg6t6g6t6g6t6.jpeg?q=70', netWeight: '1L', rating: 4.7, ratingCount: 300, categoryDetails: { _id: 'c7', name: 'Household' } },
                { _id: 'lf2', title: 'Fabric Conditioner', price: 150, mrp: 180, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/fabric-softener/f/g/h/-original-imagm7bgugbjysir.jpeg?q=70', netWeight: '500ml', rating: 4.6, ratingCount: 200, categoryDetails: { _id: 'c7', name: 'Household' } },
                { _id: 'lf3', title: 'Stain Remover', price: 120, mrp: 150, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/stain-remover/s/t/u/-original-imagm2h2m2h2m2h2.jpeg?q=70', netWeight: '200ml', rating: 4.5, ratingCount: 100, categoryDetails: { _id: 'c7', name: 'Household' } },
            ]);
        } catch (error) {
            console.error('Failed to fetch laundry products:', error);
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
                <Text style={styles.headerTitle}>Laundry Favourites</Text>
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
