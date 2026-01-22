import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 20;
const PADDING = 20;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface ElegantProduct {
    id: string;
    title: string;
    description: string;
    price: string;
    original_price?: string;
    image_url: string;
    discount_percent?: string;
}

interface ElegantGridProps {
    data: {
        title: string;
        link_text: string;
        items: ElegantProduct[];
    };
}

export default function ElegantGrid({ data }: ElegantGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>{data.title}</Text>
                <TouchableOpacity>
                    <Text style={styles.linkText}>{data.link_text}</Text>
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
                        {item.discount_percent && (
                            <View style={styles.badgeValuesWrapper}>
                                <View style={styles.badge}>
                                    <View style={styles.badgeContent}>
                                        <Text style={styles.badgePercent}>{item.discount_percent}</Text>
                                        <Text style={styles.badgeOff}>OFF</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                            <TouchableOpacity style={styles.addButton}>
                                <MaterialIcons name="add" size={20} color="#F26985" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>

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
        paddingHorizontal: PADDING,
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: 'Montserrat_700Bold',
        color: '#111827',
    },
    linkText: {
        fontSize: 14,
        fontFamily: 'Lato_700Bold',
        color: '#F26985', // Primary
        textDecorationLine: 'underline',
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
        borderWidth: 1,
        borderColor: 'rgba(242, 105, 133, 0.2)', // primary/20
        paddingBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        marginBottom: 8,
        position: 'relative',
        overflow: 'hidden',
    },
    badgeValuesWrapper: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 20,
    },
    badge: {
        backgroundColor: '#111111',
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '-12deg' }],
        elevation: 4,
    },
    badgeContent: {
        alignItems: 'center',
    },
    badgePercent: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badgeOff: {
        color: 'white',
        fontSize: 8,
        textTransform: 'uppercase',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 4 / 5,
        backgroundColor: '#F9FAFB',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    addButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 999,
        elevation: 2,
    },
    details: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        color: '#111827',
        marginBottom: 4,
    },
    desc: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: '#6B7280',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        color: '#F26985',
    },
    originalPrice: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    }
});
