import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 16;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface LuminousProduct {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    original_price?: string;
    image_url: string;
    badge?: string;
    badge_bg?: string; // Optional
}

interface LuminousGridProps {
    data: {
        section_title: string;
        items: LuminousProduct[];
    };
}

export default function LuminousGrid({ data }: LuminousGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>{data.section_title}</Text>
                <View style={styles.icons}>
                    <MaterialIcons name="grid-view" size={24} color="#a03028" />
                    <MaterialIcons name="view-list" size={24} color="#9CA3AF" style={{ marginLeft: 8 }} />
                </View>
            </View>

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
                                <MaterialIcons name="favorite" size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>

                            <View style={styles.footer}>
                                <View style={styles.priceContainer}>
                                    {item.original_price && (
                                        <Text style={styles.originalPrice}>{item.original_price}</Text>
                                    )}
                                    <Text style={styles.price}>{item.price}</Text>
                                </View>

                                <TouchableOpacity style={styles.addButton}>
                                    <MaterialIcons name="add" size={16} color="#a03028" />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#111827',
    },
    icons: {
        flexDirection: 'row',
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
        elevation: 1, // shadow-soft
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        overflow: 'hidden',
        marginBottom: 8,
    },
    imageContainer: {
        width: '100%',
        height: 192,
        backgroundColor: '#F9FAFB',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.9, // mix-blend-multiply sim sometimes
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
        backgroundColor: '#a03028', // Primary
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
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
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#111827',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'column',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#a03028',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fdf2ee', // secondary-light
        alignItems: 'center',
        justifyContent: 'center',
    }
});
