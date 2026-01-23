
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 20;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const SchoolFiveGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#DC2626", // Bright Red
        primaryDark: "#B91C1C",
        cardLight: "#FFFFFF",
        cardDark: "#1F2937",
        textMainLight: "#111827",
        textMainDark: "#F9FAFB",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Neon Gel Pens",
            subtitle: "Pack of 12 colors",
            price: "$8.99",
            originalPrice: "$12.00",
            badge: "SALE",
            itemsCenter: false, // For image style handling
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAh9W-P6SzvcUquKkj8oRartWE3IYELg0HGry7XiS-vZN78khe1Gf4E8HZwS9QoTv7qxV3X1doKiUtWCbD8JoXn4IMTFt4cuRPDqnbUiCyke6YXioUGHVUwQGpcuC34T35-qGG3Yo4EA66N-1BqKaKlhNwdNJQIMeueBtGmCq0OqiG9nR2GES65ZxwKKDDT4tNJwI5cN7t0zN3KBHzBbs2wjTYqaIVtqs9JSEHbVRZ1JhlVbJHEPNAcGcvwbJBN5e8lNduAADH0Oao3"
        },
        {
            id: '2',
            title: "Spiral Notebooks",
            subtitle: "A4, Ruled, 3-Pack",
            price: "$14.50",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJv6ZhzRgq1AXy-L3x6Dyb1tIONByYLyCQYId4ScwyXPCikbbgdYN6lo4qe77OmM60ch7cz8FnbBzClarY_SvLAr_2Rt6E65_NFunrbEN7CSLqNfFbhGf7vTFCNwGCjPWLRkOHkGWhI05C946v0BDgX1ElN6wdDQrknc9PNcIFLmI0pAV2ex9E0uZ8k3g16OuH-9jQRPunhjoz8lG438wyVKwd1cBYpw5xoG57l3O5yw8jKGY4y7L9AeMMN8Xi6YvIBjUDbCKNZqsX"
        },
        {
            id: '3',
            title: "Classic Alarm",
            subtitle: "Wake up in style",
            price: "$19.99",
            originalPrice: "$25.00",
            badge: "-20%",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3CNS_TyF0xwREb3GXQGDbMaXExgYe6yva89TVACy3UVK0duuroi1MoLiJqpAKTNWBinOMwtufLejzsYajEWduGio9EbSYpSGVnOw1bBLwolL2CkxkZjtsYrNPJXqBu05LfOBzDxauJmDov2ktFS4gmuoG7bff2d8AIOCqORBbcntzu2XkeKKR9lF_V3ryWLSio2dVArBXNAIDIziSjSskmKSuz0535nmGu8IiS7XxZSqkvCjLI-L7JxCnSaC8KcFbU5qfFAOG6p0h"
        },
        {
            id: '4',
            title: "Desk Tidy Pro",
            subtitle: "Keep it organized",
            price: "$16.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYxiEUEVf8Kmizk0wj6pRmPGuu1VC1bbUw3OvQBII33y_OD6AQenO-FJ0-YdnBYd_lmsV2f3Gjs_aNtQd3BuaeOftk2WUTsuEPMiCzRS9zffoZHUCu1as0QYUVY93M3pQCJCAP_UO8_YQqsMpt_e4KLdqNTZ1w52j5OW-9R0dUMYncXcnv9l6XP6pq-sNlg8j5POTDQrPQfy86ih6kxWy_ZQaV-uHc5qBOfHomqy37cFGpSE009rz8wrzkTtYZ2d-_qCoRqX8Hf69C"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textMainDark : colors.textMainLight }]}>
                    Trending Now
                </Text>
                <TouchableOpacity>
                    <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {products.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            {
                                backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {item.badge && (
                            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.badgeText}>{item.badge}</Text>
                            </View>
                        )}

                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }]}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <TouchableOpacity style={[
                                styles.favButton,
                                { backgroundColor: isDarkMode ? '#1F2937' : 'white' }
                            ]}>
                                <MaterialIcons
                                    name="favorite"
                                    size={16}
                                    color={isDarkMode ? '#9CA3AF' : '#9CA3AF'} // Default gray
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.content}>
                            <Text style={[
                                styles.title,
                                { color: isDarkMode ? 'white' : colors.textMainLight }
                            ]}>
                                {item.title}
                            </Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>

                            <View style={styles.footer}>
                                <View>
                                    {item.originalPrice && (
                                        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    )}
                                    <Text style={[
                                        styles.price,
                                        { color: item.originalPrice ? colors.primary : (isDarkMode ? 'white' : colors.textMainLight) }
                                    ]}>
                                        {item.price}
                                    </Text>
                                </View>
                                <TouchableOpacity style={[
                                    styles.addButton,
                                    {
                                        backgroundColor: item.originalPrice ? colors.primary : (isDarkMode ? '#374151' : '#F3F4F6'),
                                        shadowColor: item.originalPrice ? '#FECACA' : '#000', // red-200
                                        shadowOpacity: item.originalPrice ? 0.5 : 0,
                                    }
                                ]}>
                                    <MaterialIcons
                                        name="add"
                                        size={18}
                                        color={item.originalPrice ? 'white' : (isDarkMode ? 'white' : '#1F2937')}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PADDING,
        paddingBottom: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 16,
        marginBottom: 20,
        padding: 12,
        shadowColor: 'rgba(0, 0, 0, 0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 20, // inside image container visually
        left: 20,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        zIndex: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    imageContainer: {
        height: 140, // aspect square approx
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        lineHeight: 20,
    },
    subtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        fontWeight: '500',
    },
    price: {
        fontSize: 18,
        fontWeight: '900',
    },
    addButton: {
        padding: 8,
        borderRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 4,
    },
});

export default SchoolFiveGrid;
