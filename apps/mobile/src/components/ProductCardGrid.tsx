import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import LightningDealCard from './homepage/foryou/LightningDealCard';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16; // Adjusted to match generic container padding often used
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

interface Product {
    _id?: string;
    id?: string;
    title: string;
    subtitle?: string;
    price: number | string;
    originalPrice?: number | string;
    images?: string[];
    image?: string;
    rating?: number;
    reviewCount?: number;
    lastChanceOffers?: any[];
}

interface ProductCardGridProps {
    products: Product[];
    title?: string;
    layout?: 'grid' | 'horizontal' | 'lightning';
}

const ProductCardGrid: React.FC<ProductCardGridProps> = ({ products, title, layout = 'grid' }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#D4FF3E", // Lime
        tertiary: "#023E8A", // Deep Blue
        cardLight: "#FFFFFF",
        cardDark: "#1F2937",
        textMainLight: "#111827",
        textMainDark: "#FFFFFF",
    };

    if (!products || products.length === 0) return null;

    if (layout === 'lightning') {
        return (
            <View style={styles.container}>
                {title && (
                    <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textMainDark : colors.textMainLight }]}>
                        {title}
                    </Text>
                )}
                <View style={{ paddingLeft: 16 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {products.map((item: any, index: number) => {
                            // Map generic product to LightningDealProduct
                            const dealProduct = {
                                id: item._id || item.id,
                                name: item.title || item.name,
                                image: item.image ? { uri: item.image } : (item.images?.length ? { uri: item.images[0] } : null),
                                rating: item.rating || 4.5,
                                reviews: item.reviewCount || 100,
                                deliveryTime: '9 MINS', // Mock or fetch if available
                                price: item.price,
                                mrp: item.originalPrice || Math.round(item.price * 1.3),
                                discount: item.discountPercentage ? `${item.discountPercentage}% OFF` : '',
                                weight: '1 pc',
                                isVeg: true,
                                timeLeft: 'Only a few left'
                            };
                            return (
                                <LightningDealCard
                                    key={index}
                                    product={dealProduct}
                                    onAdd={() => console.log('Add', dealProduct.name)}
                                    onPress={() => {
                                        console.log('Lightning Card Pressed:', dealProduct.id);
                                        if (dealProduct.id) {
                                            router.push(`/product/${dealProduct.id}`);
                                        } else {
                                            console.warn('No Product ID for Lightning Deal');
                                        }
                                    }}
                                />
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {title && (
                <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textMainDark : colors.textMainLight }]}>
                    {title}
                </Text>
            )}
            <View style={styles.grid}>
                {products.map((item: any, index: number) => {
                    // Handle potential ID differences
                    const productId = item.id || item._id;
                    const displayImage = item.image || (item.images && item.images.length > 0 ? item.images[0] : null);
                    const subtitle = item.subtitle || item.shortDescription || item.category;

                    return (
                        <TouchableOpacity
                            key={`${productId}-${index}`}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
                                    borderColor: isDarkMode ? '#374151' : '#F3F4F6',
                                }
                            ]}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/product/${productId}`)}
                        >
                            {/* Example Badge Logic - customizable via props in future */}
                            {item.discountPercentage && (
                                <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
                                    <Text style={[styles.badgeText, { color: 'white' }]}>
                                        -{item.discountPercentage}%
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity style={styles.favButton}>
                                <MaterialIcons name="favorite-border" size={18} color="#9CA3AF" />
                            </TouchableOpacity>

                            <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' }]}>
                                {displayImage ? (
                                    <Image
                                        source={{ uri: displayImage }}
                                        style={styles.image}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <MaterialIcons name="image-not-supported" size={24} color="#9CA3AF" />
                                    </View>
                                )}
                            </View>

                            <View style={styles.content}>
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.title,
                                        { color: isDarkMode ? colors.textMainDark : colors.textMainLight }
                                    ]}
                                >
                                    {item.title}
                                </Text>
                                <Text numberOfLines={1} style={styles.subtitle}>{subtitle}</Text>

                                <View style={styles.footer}>
                                    <View style={styles.priceCol}>
                                        <Text style={[styles.price, { color: isDarkMode ? 'white' : '#111827' }]}>
                                            {typeof item.price === 'number' ? `$${item.price}` : item.price}
                                        </Text>
                                        {item.originalPrice && (
                                            <Text style={styles.originalPrice}>
                                                {typeof item.originalPrice === 'number' ? `$${item.originalPrice}` : item.originalPrice}
                                            </Text>
                                        )}
                                    </View>
                                    <TouchableOpacity style={[
                                        styles.addButton,
                                        {
                                            backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                                        }
                                    ]}>
                                        <MaterialIcons
                                            name="add"
                                            size={18}
                                            color={isDarkMode ? 'white' : '#111827'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // marginTop: 16,
        // paddingHorizontal: PADDING, // Let parent container handle padding via SDUI props
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        paddingHorizontal: 4
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%', // Flexible width instead of fixed calculation
        borderRadius: 12,
        marginBottom: 16,
        padding: 8,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        zIndex: 10,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    favButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
        padding: 4,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 12
    },
    imageContainer: {
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        paddingHorizontal: 0,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 11,
        color: '#9CA3AF',
        marginBottom: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceCol: {
        flexDirection: 'column', // Stack original price under current price
        alignItems: 'flex-start',
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
    },
    originalPrice: {
        fontSize: 10,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    addButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProductCardGrid;
