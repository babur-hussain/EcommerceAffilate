import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 24;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface LumiereProduct {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    original_price?: string;
    image_url: string;
    badge?: string;
    price_color?: string; // e.g., text-green-700
}

interface LumiereSectionProps {
    data: {
        section_title: string;
        section_subtitle: string;
        link_text: string;
        background_color: string; // Hex
        items: LumiereProduct[];
    };
}

export default function LumiereSection({ data }: LumiereSectionProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={[styles.sectionContainer, { backgroundColor: data.background_color }]}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>{data.section_title}</Text>
                        <Text style={styles.subtitle}>{data.section_subtitle}</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.link}>{data.link_text}</Text>
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
                                {item.badge && (
                                    <View style={[
                                        styles.badge,
                                        item.badge.includes('%') ? styles.badgeGreen : styles.badgeSecondary
                                    ]}>
                                        <Text style={styles.badgeText}>{item.badge}</Text>
                                    </View>
                                )}
                                <Image source={{ uri: item.image_url }} style={styles.image} />
                                <TouchableOpacity style={styles.addButton}>
                                    <MaterialIcons name="add" size={16} color="black" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.prodTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.prodSubtitle} numberOfLines={1}>{item.subtitle}</Text>

                            <View style={styles.priceRow}>
                                <Text style={[styles.price, item.price_color && { color: item.price_color }]}>
                                    {item.price}
                                </Text>
                                {item.original_price && (
                                    <Text style={styles.originalPrice}>{item.original_price}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    sectionContainer: {
        borderRadius: 24,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    link: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#6D28D9', // Primary
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: GAP,
    },
    card: {
        width: '47%', // roughly half minus gap
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        elevation: 1,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
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
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        zIndex: 10,
    },
    badgeGreen: {
        backgroundColor: '#15803D', // green-700
    },
    badgeSecondary: {
        backgroundColor: '#D946EF', // Secondary
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    addButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 6,
        borderRadius: 999,
        elevation: 1,
    },
    prodTitle: {
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_600SemiBold',
        color: '#111827',
        marginBottom: 2,
    },
    prodSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6D28D9', // Default primary
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    }
});
