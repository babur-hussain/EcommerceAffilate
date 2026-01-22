import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 16;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface SpecialProduct {
    id: string;
    title: string;
    price: string;
    original_price?: string;
    image_url: string;
    badge_text?: string;
    rating?: string;
    review_count?: string;
    stock_status_text?: string;
    stock_status_icon?: keyof typeof MaterialIcons.glyphMap;
    progress_percent?: number;
    sold_text?: string;
}

interface SpecialGridProps {
    data: {
        items: SpecialProduct[];
    };
}

export default function SpecialGrid({ data }: SpecialGridProps) {
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
                        {item.badge_text && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.badge_text}</Text>
                            </View>
                        )}

                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

                            {item.rating && (
                                <View style={styles.ratingRow}>
                                    <MaterialIcons name="star" size={14} color="#FFD700" />
                                    <Text style={styles.ratingText}>{item.rating} ({item.review_count})</Text>
                                </View>
                            )}

                            <View style={styles.footer}>
                                <View>
                                    <Text style={styles.originalPrice}>{item.original_price}</Text>
                                    <Text style={styles.price}>{item.price}</Text>
                                </View>
                                <TouchableOpacity style={styles.addButton}>
                                    <MaterialIcons name="add" size={20} color="#D32F2F" />
                                </TouchableOpacity>
                            </View>

                            {/* Stock Status / Progress */}
                            {item.progress_percent !== undefined ? (
                                <View style={{ marginTop: 8 }}>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, { width: `${item.progress_percent}%` }]} />
                                    </View>
                                    {item.sold_text && <Text style={styles.soldText}>{item.sold_text}</Text>}
                                </View>
                            ) : item.stock_status_text && (
                                <View style={styles.stockRow}>
                                    <MaterialIcons name={item.stock_status_icon || "timer"} size={10} color="#F97316" />
                                    <Text style={styles.stockText}>{item.stock_status_text}</Text>
                                </View>
                            )}
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
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        marginBottom: 8,
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#D32F2F', // primary
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        zIndex: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    imageContainer: {
        height: 128,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    details: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 4,
        fontFamily: 'Roboto_500Medium',
        lineHeight: 18,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 10,
        color: '#6B7280',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D32F2F',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stockRow: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    stockText: {
        fontSize: 10,
        color: '#F97316', // orange
        fontWeight: '500',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#D32F2F',
        borderRadius: 3,
    },
    soldText: {
        fontSize: 10,
        color: '#6B7280',
        marginTop: 4,
    }
});
