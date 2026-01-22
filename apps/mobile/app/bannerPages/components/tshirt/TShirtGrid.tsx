import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 2 cols, gap 16 (gap-4)

interface ProductItem {
    id: string;
    title: string;
    subtitle?: string;
    price: string;
    original_price?: string;
    image_url: string;
    badge_text?: string;
    badge_color?: string; // Using accent #FACC15 mainly
    badge_text_color?: string;
}

interface TShirtGridProps {
    data: {
        title: string;
        header_icon?: any;
        load_more_text?: string;
        items: ProductItem[];
    };
}

export default function TShirtGrid({ data }: TShirtGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    const PRIMARY_COLOR = '#0f5e36';
    const ACCENT_COLOR = '#FACC15';

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <MaterialIcons name="local-fire-department" size={24} color={PRIMARY_COLOR} style={{ marginRight: 8 }} />
                    <Text style={styles.title}>{data.title}</Text>
                </View>
            </View>

            {/* Grid */}
            <View style={styles.grid}>
                {data.items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id || index}
                        style={styles.card}
                        onPress={() => router.push(`/product/${item.id}`)}
                        activeOpacity={0.9}
                    >
                        {/* SALE Badge (Top Right) */}
                        {item.badge_text && (
                            <View style={styles.topRightBadge}>
                                <Text style={styles.topRightBadgeText}>{item.badge_text}</Text>
                            </View>
                        )}

                        {/* Image Aspect 4/5 */}
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                        </View>

                        {/* Content */}
                        <View style={styles.cardContent}>
                            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.itemSubtitle}>{item.subtitle || 'Cotton Blend'}</Text>

                            <View style={styles.bottomRow}>
                                <View style={styles.priceCol}>
                                    {item.original_price && (
                                        <Text style={styles.originalPrice}>{item.original_price}</Text>
                                    )}
                                    <Text style={styles.price}>{item.price}</Text>
                                </View>
                                <TouchableOpacity style={styles.addButton}>
                                    <MaterialIcons name="add-shopping-cart" size={16} color="#111827" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Load More Button */}
            {data.load_more_text && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.loadMoreButton}>
                        <Text style={styles.loadMoreText}>{data.load_more_text}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 8,
    },
    header: {
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20, // text-xl
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: COLUMN_WIDTH,
        backgroundColor: 'white',
        borderRadius: 16, // rounded-2xl
        marginBottom: 16, // part of gap vertical
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 }, // shadow-lg
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
        overflow: 'hidden',
    },
    // Aspect 4/5
    imageContainer: {
        width: '100%',
        aspectRatio: 0.8, // 4/5
        backgroundColor: '#F3F4F6', // bg-gray-100
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    topRightBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: '#FACC15', // accent
        borderBottomLeftRadius: 12, // rounded-bl-xl
        paddingHorizontal: 12, // px-3
        paddingVertical: 6, // py-1.5
    },
    topRightBadgeText: {
        color: 'black',
        fontSize: 12, // text-xs
        fontWeight: '900', // font-black
    },
    cardContent: {
        padding: 12, // p-3
        flex: 1,
    },
    itemTitle: {
        fontSize: 14, // text-sm
        fontFamily: 'Poppins_700Bold',
        color: '#1F2937', // text-gray-800
        marginBottom: 4,
    },
    itemSubtitle: {
        fontSize: 12, // text-xs
        fontFamily: 'Poppins_400Regular',
        color: '#6B7280', // text-gray-500
        marginBottom: 12, // mb-3
    },
    bottomRow: {
        marginTop: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceCol: {
        flexDirection: 'column',
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF', // text-gray-400
        fontSize: 12, // text-xs
        marginBottom: 2,
    },
    price: {
        fontSize: 18, // text-lg
        fontFamily: 'Poppins_700Bold',
        color: '#0f5e36', // text-primary
    },
    addButton: {
        width: 36, // w-9
        height: 36, // h-9
        borderRadius: 18, // rounded-full
        backgroundColor: '#FACC15', // bg-accent
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    footer: {
        marginTop: 32, // mt-8
        marginBottom: 16, // mb-4
    },
    loadMoreButton: {
        width: '100%',
        paddingVertical: 12, // py-3
        borderWidth: 2, // border-2
        borderColor: '#0f5e36', // border-primary
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadMoreText: {
        color: '#0f5e36', // text-primary
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    }
});
