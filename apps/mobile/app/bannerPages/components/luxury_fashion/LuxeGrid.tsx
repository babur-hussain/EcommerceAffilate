import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 16;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface LuxeItem {
    id?: string;
    title?: string;
    brand?: string;
    price?: string;
    original_price?: string;
    image_url?: string;
    badge_text?: string;
    // For local content block
    type?: 'product' | 'promo_block';
    block_title?: string;
    block_desc?: string;
    block_button?: string;
}

interface LuxeGridProps {
    data: {
        items: LuxeItem[];
    };
}

export default function LuxeGrid({ data }: LuxeGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {data.items.map((item, index) => {
                    if (item.type === 'promo_block') {
                        return (
                            <View key={index} style={styles.promoBlock}>
                                {/* Using a simple dark background since we can't easily tile textures without an image */}
                                <View style={styles.promoBg} />
                                <Text style={styles.promoTitle}>{item.block_title}</Text>
                                <Text style={styles.promoDesc}>{item.block_desc}</Text>
                                <TouchableOpacity style={styles.promoButton}>
                                    <Text style={styles.promoButtonText}>{item.block_button}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={item.id || index}
                            style={styles.card}
                            onPress={() => item.id && router.push(`/product/${item.id}`)}
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
                                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.brand}>{item.brand}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.price}>{item.price}</Text>
                                    {item.original_price && (
                                        <Text style={styles.originalPrice}>{item.original_price}</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: PADDING,
        paddingBottom: 100,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: GAP,
    },
    card: {
        width: COLUMN_WIDTH,
        marginBottom: 24,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 3 / 4,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
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
        backgroundColor: 'white',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    badgeText: {
        color: '#E60023', // Primary
        fontSize: 10,
        fontWeight: 'bold',
    },
    details: {
        alignItems: 'flex-start',
        gap: 4,
    },
    title: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    brand: {
        fontSize: 10,
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontFamily: 'Montserrat_500Medium',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Montserrat_700Bold',
    },
    originalPrice: {
        color: '#9CA3AF',
        fontSize: 12,
        textDecorationLine: 'line-through',
    },

    // Promo Block Styles
    promoBlock: {
        width: '100%',
        height: 250,
        backgroundColor: 'black',
        marginVertical: 24,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        position: 'relative',
        overflow: 'hidden',
    },
    promoBg: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.2,
        backgroundColor: '#1a1a1a',
    },
    promoTitle: {
        color: 'white',
        fontSize: 32,
        fontFamily: 'SixCaps_400Regular',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
    },
    promoDesc: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        textAlign: 'center',
        maxWidth: 200,
        letterSpacing: 2,
        marginBottom: 24,
    },
    promoButton: {
        borderWidth: 1,
        borderColor: 'white',
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    promoButtonText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontFamily: 'Montserrat_700Bold',
    }
});
