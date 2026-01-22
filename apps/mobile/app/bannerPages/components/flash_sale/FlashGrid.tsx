import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 16;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface FlashProduct {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    original_price: string;
    image_url: string;
    badge_text?: string;
}

interface FlashGridProps {
    data: {
        title: string;
        items: FlashProduct[];
    };
}

export default function FlashGrid({ data }: FlashGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>{data.title}</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {data.items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id || index}
                        style={styles.card}
                        onPress={() => router.push(`/product/${item.id}`)}
                        activeOpacity={0.95}
                    >
                        {item.badge_text && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.badge_text}</Text>
                            </View>
                        )}

                        <View style={styles.imageBox}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.prodTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.prodSubtitle}>{item.subtitle}</Text>

                            <View style={styles.prices}>
                                <Text style={styles.originalPrice}>{item.original_price}</Text>
                                <Text style={styles.price}>{item.price}</Text>
                            </View>

                            <TouchableOpacity style={styles.shopBtn}>
                                <Text style={styles.shopBtnText}>SHOP NOW</Text>
                                <MaterialIcons name="shopping-cart" size={14} color="white" />
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
        paddingHorizontal: PADDING,
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 24,
        color: '#111827', // gray-900
    },
    viewAll: {
        fontSize: 12,
        color: '#6B7280', // gray-500
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
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    badge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#D32F2F',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        zIndex: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    imageBox: {
        height: 128,
        backgroundColor: '#F9FAFB', // gray-50
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    image: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    details: {
        flex: 1,
    },
    prodTitle: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 14,
        color: '#111827',
        marginBottom: 2,
    },
    prodSubtitle: {
        fontSize: 10,
        color: '#6B7280',
        marginBottom: 8,
    },
    prices: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#D32F2F',
    },
    shopBtn: {
        backgroundColor: '#D32F2F',
        borderRadius: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    shopBtnText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    }
});
