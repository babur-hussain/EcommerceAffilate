import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 12;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2; // 2 cols

interface ProductItem {
    id: string;
    title: string;
    category: string;
    price: string;
    original_price?: string;
    image_url: string;
    badge_text?: string;
}

interface GirlsFashionGridProps {
    data: {
        title: string;
        view_all_text: string;
        items: ProductItem[];
    };
}

export default function GirlsFashionGrid({ data }: GirlsFashionGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>{data.title}</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>{data.view_all_text}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {data.items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id || index}
                        style={styles.card}
                        onPress={() => router.push(`/product/${item.id}`)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                            {item.badge_text && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.badge_text}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.category}>{item.category}</Text>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>{item.price}</Text>
                                {item.original_price && (
                                    <Text style={styles.originalPrice}>{item.original_price}</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: '#111827',
    },
    viewAll: {
        fontSize: 12,
        color: '#6B7280',
        textDecorationLine: 'underline',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    card: {
        width: COLUMN_WIDTH,
        marginBottom: 8,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 3 / 4,
        backgroundColor: '#F3F4F6',
        borderRadius: 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
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
        right: 8,
        backgroundColor: '#8B0000', // Primary
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 2,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    details: {
        marginTop: 12,
        gap: 4,
    },
    category: {
        fontSize: 10, // text-[10px]
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontFamily: 'Lato_400Regular',
    },
    title: {
        fontSize: 18,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: '#111827',
        lineHeight: 22,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        color: '#8B0000',
        fontWeight: '600',
        fontFamily: 'Lato_700Bold',
    },
    originalPrice: {
        color: '#9CA3AF',
        fontSize: 12,
        textDecorationLine: 'line-through',
    }
});
