
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 24;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const ElevateGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#111111", // Deep Charcoal
        bgLight: "#F2F1EE",
        bgDark: "#121212",
        surfaceLight: "#FFFFFF",
        surfaceDark: "#1E1E1E",
        textGray: "#6B7280",
        textGrayDark: "#9CA3AF",
        accentSalmon: "#F0AC96",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Eames Replica",
            collection: "Modern Living",
            price: "$120",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC41AodRnaEN285cJT-Lb1kEV_FAhfdOMOaRvyrSXsZXDVMRDgpxdo-lf-RVV2j_Rdd7d3wW5WIFOn0DYW3yc-B5o2QsJ_6hw8AgitkHdvFi8QZgmUwus-z2mIxgZHcdt4ZLuq-CTLIX69PXYnURnfQL-Jfs2_7zS8hbFtIPmLC6Rm48M3WXptQuARZhcCZduqvtE19sWKe3pYCqCG9Dxb27tYL-5zQO54fFjQTz1uv3O1zMgSsUsh5r-pkGP-4zZrX3_TLeI9LHIFE"
        },
        {
            id: '2',
            title: "Nordic White",
            collection: "Minimalist",
            price: "$250",
            badge: "HOT",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRkVyijLULSo_rKHDSaXUsiePklRLGzDv2dlF7QLFln0etXLkxypYAA-_8fzYoUvqRsXKB9T94PO2XBDm-lJPSMj312xsBCFQuU5YOXEGy5OdpN6P3Zx78d5R4HxpBYmW9iLKXRXHkw_VdnXSVAfN9hDAm3GQErgksHo_aaohk1B30r-HzsQJtz8E64a55N8wemkrF5NbL4LDJ38bZ5gQP15tcOHOjWNnTy04rLPH2nXkR1r2PSb7hOFKlgvAz_-_pdnrkO8R5xv7g"
        },
        {
            id: '3',
            title: "Oak Classic",
            collection: "Traditional",
            price: "$180",
            originalPrice: "$220",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFjwQ-SL77jJU1A6D2OuN7FWE4yuItA4AcOYpHuOrqj_7NKWl2EYfHMGHhB2q9Y1oig_aSEsGvDEZufk9Weoc-EAn1DjX9932WnjKkDoQ25u4vgM-mAgQwDCTZrFyJ6ExHavXFZ4BEzWJyyslirjgfeW14-1jVjFw1Kce_0K-KXIUy24O8YvGoDWmvz7Fi5EwNhsDCcKBrQsJMAxkz9oL-eXYxx7OUiIuUknsLndxARn8_wZMM9GLJrDTls4HXWA4Wb8zYTVZlcFir"
        },
        {
            id: '4',
            title: "Industrial Set",
            collection: "Metal Works",
            price: "$95",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZnWGXluI5NYknNLRnvVmeTwbhMLG__PmYVxwVLkxwnCaU7T6cLM6NJPZIAW7v3V06fC9mqNbd5UvrOejvjteEG9IjdxH8soBgFobVWQKh-iKiO7qQlI4y-fxkFSuoQq7Wz-NYtTLsf_7EeV0NIcDFmOpL5A8PyBIMVBsJMiKfMHzTZM9_P9pjxhWCov8Y6AU8o3aPQDPfaCsit2t4p5E0D8l4h8aX-2ia0q37zgEMiWanTYzLEAkJj-HA4icT6MOUTn5NcN1PRc8t"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : colors.primary }]}>New Arrivals</Text>
                <TouchableOpacity>
                    <Text style={[styles.viewAll, { color: isDarkMode ? colors.textGrayDark : colors.textGray }]}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {products.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            {
                                backgroundColor: isDarkMode ? colors.surfaceDark : colors.surfaceLight,
                                shadowColor: '#000',
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {/* Image Section */}
                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' }]}>
                            {item.badge && (
                                <View style={[styles.badge, { backgroundColor: colors.accentSalmon }]}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            )}
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <TouchableOpacity style={[
                                styles.favButton,
                                { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)' }
                            ]}>
                                <MaterialIcons name="favorite-border" size={14} color={isDarkMode ? 'white' : colors.textGray} />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text
                                numberOfLines={1}
                                style={[styles.title, { color: isDarkMode ? 'white' : colors.primary }]}
                            >
                                {item.title}
                            </Text>
                            <Text style={[styles.collection, { color: isDarkMode ? colors.textGrayDark : colors.textGray }]}>
                                {item.collection}
                            </Text>

                            <View style={styles.footer}>
                                <View>
                                    {item.originalPrice && (
                                        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    )}
                                    <Text style={[
                                        styles.price,
                                        { color: item.originalPrice ? '#EF4444' : (isDarkMode ? 'white' : colors.primary) }
                                    ]}>
                                        {item.price}
                                    </Text>
                                </View>

                                <TouchableOpacity style={[
                                    styles.addButton,
                                    { backgroundColor: isDarkMode ? 'white' : colors.primary }
                                ]}>
                                    <MaterialIcons name="add" size={16} color={isDarkMode ? colors.primary : 'white'} />
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
        paddingBottom: 100, // Space for bottom nav
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 24, // text-3xl
        fontWeight: 'bold',
        // fontFamily: 'Oswald'
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 16, // rounded-2xl
        marginBottom: 16,
        padding: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, // shadow-sm
        shadowRadius: 4,
        elevation: 2,
    },
    imageContainer: {
        height: 160, // h-40
        marginBottom: 16,
        borderRadius: 12,
        position: 'relative',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 10,
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
        zIndex: 10,
    },
    content: {
        // padding handled by card
    },
    title: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        marginBottom: 4,
        lineHeight: 22,
    },
    collection: {
        fontSize: 12, // text-xs
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    originalPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        padding: 6,
        borderRadius: 8,
    },
});

export default ElevateGrid;
