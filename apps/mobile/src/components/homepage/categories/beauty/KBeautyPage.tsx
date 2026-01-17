import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const kBeautyData = [
    {
        brand: 'TIRTIR',
        ingredientTitle: 'Star\ningredient',
        ingredient: 'Niacinamide',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        bg: '#880E4F',
        offer: 'Up to 20% Off'
    },
    {
        brand: 'COSRX',
        ingredientTitle: 'Star\ningredient',
        ingredient: 'Snail Mucin',
        image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=600&q=80',
        bg: '#FFF9C4',
        offer: 'Up to 25% Off',
        darkText: true
    },
    {
        brand: 'Innisfree',
        ingredientTitle: 'Star\ningredient',
        ingredient: 'Green Tea',
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
        bg: '#C8E6C9',
        offer: 'From ₹499',
        darkText: true
    },
    {
        brand: 'Innisfree', // Duplicated in original, keeping it for now or removing if desired. Kept for fidelity.
        ingredientTitle: 'Star\ningredient',
        ingredient: 'Green Tea',
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
        bg: '#C8E6C9',
        offer: 'From ₹499',
        darkText: true
    }
];

export default function KBeautyPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>K-Beauty Obsessed</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {kBeautyData.map((item, index) => (
                    <View key={index} style={[styles.card, { backgroundColor: item.bg }]}>
                        {/* Brand Pill */}
                        <View style={styles.brandPill}>
                            <Text style={[styles.brandText, item.darkText && { color: '#000' }]}>{item.brand}</Text>
                        </View>

                        {/* Product Image */}
                        <Image source={{ uri: item.image }} style={styles.image} />

                        {/* Ingredient Box */}
                        <View style={styles.ingredientBox}>
                            <Text style={styles.ingredientTitle}>{item.ingredientTitle}</Text>
                            <View style={styles.ingredientDivider} />
                            <Text style={styles.ingredientName}>{item.ingredient}</Text>
                        </View>

                        {/* Offer Footer */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.6)']}
                            style={styles.gradientFooter}
                        >
                            <Text style={styles.offerText}>{item.offer}</Text>
                        </LinearGradient>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60, // Safe area
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        width: '100%',
        height: 250,
        borderRadius: 24,
        marginBottom: 20,
        padding: 16,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    brandPill: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        zIndex: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        elevation: 2,
    },
    brandText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        textTransform: 'uppercase',
    },
    image: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        width: '70%',
        height: '110%',
        resizeMode: 'contain',
        transform: [{ rotate: '-10deg' }],
    },
    ingredientBox: {
        position: 'absolute',
        top: 70,
        left: 20,
        // backgroundColor: 'rgba(255,255,255,0.2)', // Removed bg for cleaner look, text only
    },
    ingredientTitle: {
        color: '#fff', // Default white
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    ingredientDivider: {
        width: 30,
        height: 2,
        backgroundColor: '#fff',
        marginVertical: 4,
    },
    ingredientName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 2,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    gradientFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        justifyContent: 'flex-end',
        padding: 20,
    },
    offerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
});
