import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 20;
const PADDING = 24;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface BeautyProduct {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    original_price: string;
    image_url: string;
    discount_badge: string;
}

interface BeautyGridProps {
    data: {
        items: BeautyProduct[];
    };
}

export default function BeautyGrid({ data }: BeautyGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {data.items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id || index}
                        style={styles.card}
                        onPress={() => router.push(`/product/${item.id}`)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.imageContainer}>
                            {item.discount_badge && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.discount_badge}</Text>
                                </View>
                            )}
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>

                            <View style={styles.priceRow}>
                                <Text style={styles.price}>{item.price}</Text>
                                <Text style={styles.originalPrice}>{item.original_price}</Text>
                            </View>

                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.addButtonText}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: PADDING,
        paddingBottom: 100, // Space for bottom nav
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: GAP,
    },
    card: {
        width: COLUMN_WIDTH,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 8,
    },
    imageContainer: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        backgroundColor: '#F9FAFB',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#EF4444', // Red-400 equivalentish
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        zIndex: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: 'Poppins_400Regular',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3E2723', // Primary
        fontFamily: 'Poppins_700Bold',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        fontFamily: 'Poppins_400Regular',
    },
    addButton: {
        backgroundColor: '#3E2723',
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'Poppins_500Medium',
    }
});
