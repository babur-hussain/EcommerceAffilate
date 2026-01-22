import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 16;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface CosmeticProduct {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    original_price?: string;
    image_url: string;
    badge?: string;
    badge_bg?: string; // Hex color e.g., rose-500
}

interface CosmeticGridProps {
    data: {
        items: CosmeticProduct[];
    };
}

export default function CosmeticGrid({ data }: CosmeticGridProps) {
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
                        activeOpacity={0.95}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />

                            {item.badge && (
                                <View style={[
                                    styles.badge,
                                    item.badge_bg ? { backgroundColor: item.badge_bg } : styles.badgeDefault
                                ]}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            )}

                            <TouchableOpacity style={styles.favButton}>
                                <MaterialIcons name="favorite-border" size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text>

                            <View style={styles.footer}>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.price}>{item.price}</Text>
                                    {item.original_price && (
                                        <Text style={styles.originalPrice}>{item.original_price}</Text>
                                    )}
                                </View>

                                <TouchableOpacity style={styles.addButton}>
                                    <Text style={styles.addButtonText}>SHOP NOW</Text>
                                </TouchableOpacity>
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
        paddingHorizontal: PADDING,
        paddingBottom: 24,
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
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'transparent', // for layout consistency
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 4 / 5,
        backgroundColor: '#F8FAFC', // slate-50
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeDefault: {
        backgroundColor: '#112D4E', // Primary
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    favButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 6,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    details: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: 'PlayfairDisplay_400Regular', // or 600
        color: '#112D4E',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 12,
        fontFamily: 'Lato_400Regular',
    },
    footer: {
        marginTop: 'auto',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#112D4E',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    addButton: {
        width: '100%',
        backgroundColor: '#112D4E',
        paddingVertical: 10,
        borderRadius: 999,
        alignItems: 'center',
        elevation: 2,
    },
    addButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    }
});
