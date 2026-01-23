
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const ShoeGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#BE3A3B", // Red
        cardLight: "#FFFFFF",
        cardDark: "#1F2937",
        textMainLight: "#111827",
        textMainDark: "#FFFFFF",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Air Zoom Pegasus",
            subtitle: "Running • Men",
            price: "$84.00",
            originalPrice: "$120.00",
            badge: "-30%",
            badgeColor: isDarkMode ? 'rgba(127, 29, 29, 0.3)' : '#FEE2E2', // red-900/30 or red-100
            badgeTextColor: "#BE3A3B",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLS8nqd019GMYerRzg1_OaPiJaWOYM3jtu1SmAtFQOIM5dbSMhHHervHP7tufg3WB6oBaHIauhf-A8Vr9veVTM5NhtSyYsQODwUPn7TtR9zbZJbRwpVWuG7WwOH_BMHbGUGburP9Pg9bxlWxNYM_WdRC31s5mhykJ_Wu6ofPVFJz07jWjgD8QzaK85MqeouprlM2abZ0vgt6EYnvAWV6vim2tHvBpsJuH5lmbEZuwH3_5_pCyAQa50gl4EC_nqytOg1Wqecfs2LRUE"
        },
        {
            id: '2',
            title: "Ultra Boost DNA",
            subtitle: "Lifestyle • Unisex",
            price: "$160.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYlkLoBssPFNUGTfYE4_UA_U9MiaJiuQeyfZdFatfzGYxZ3dY4dlr_Q2yvJmz2R6VzKtCoZPjU2SmyKpN9Qp2svWdRENA7VajmABeDz-KYbnoOZ1BCRigZom7Nq9uNOXLRSiawGQ82mFD02UQyn3RbaZ-S9YHQoZVyYjo3N1qKyRaAV58Sf5BDl7Fqr3pN2nmSCDVUkg2ivLrlPm8PzywflZVHmnVnwu_zZZDw9A4MqumJcor6P4JCpomky1n5yjpjSvk6dy8cX9T1"
        },
        {
            id: '3',
            title: "Metcon 7 X",
            subtitle: "Training • Women",
            price: "$130.00",
            badge: "New",
            badgeColor: isDarkMode ? 'rgba(127, 29, 29, 0.3)' : '#FEE2E2',
            badgeTextColor: "#BE3A3B",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1zw8hsP2h69igGA3urc6G1X3CbySGIkTaM-LFpZLAdjliCVFpzWT7J7XadJ8O5PnyU9Lb5mCN8P5-Gya21_raT7gH9OfynsmZjLjBr2EJjVG4n24kTLs3XM43gST7ABJFSSuSMmGlQEoV_-4_M0enWJLGRBSdTmcMTRd51KiAkXpHAVzBXmKxC4C-eJ7rDXxeVZ73bhSNnykiFd3CLM97DrZDS9R_378ofJ3pEGtQ-1XduSDD2FINIuJZmO3Elhf7VcZz7fvTmRBa"
        },
        {
            id: '4',
            title: "Speedcross 5",
            subtitle: "Trail • Men",
            price: "$84.00",
            originalPrice: "$140.00",
            badge: "-40%",
            badgeColor: isDarkMode ? 'rgba(127, 29, 29, 0.3)' : '#FEE2E2',
            badgeTextColor: "#BE3A3B",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDm5Xkdu_p0hS82xLiV__TVAfq4anMLadBCkDfFrvLEpOyGkt8A1z4EzAg8Z0_MOttrW6r68ehn3H-q-4DIZgICmU9BmsfILGfO5B3pcxCChgANEtjMzjfhqSHvdriWGUMvmbEadB96hL1n1W6Q6xxSCk1y51LY6jTIKRGc5jGTiQRIgqumMIAPuxWgs-O3_LIfWWgOCRdQ41vYV3E5DwwaHa8oX92DJxpC-LDJNu-UDrtSmPfqnvHpXmiO5ZM2XMu44O5wcyVbsnL5"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : '#111827' }]}>
                    Popular Picks
                </Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
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
                                borderColor: isDarkMode ? '#1F2937' : '#F3F4F6',
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {item.badge && (
                            <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                                <Text style={[styles.badgeText, { color: item.badgeTextColor }]}>
                                    {item.badge}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.favButton}>
                            <MaterialIcons name="favorite-border" size={18} color="#D1D5DB" />
                        </TouchableOpacity>

                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.content}>
                            <Text
                                style={[
                                    styles.title,
                                    { color: isDarkMode ? 'white' : '#111827' }
                                ]}
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>

                            <View style={styles.footer}>
                                <View style={styles.priceCol}>
                                    {item.originalPrice && (
                                        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    )}
                                    <Text style={[
                                        styles.price,
                                        {
                                            color: item.originalPrice ? colors.primary : (isDarkMode ? 'white' : '#111827'),
                                            marginTop: item.originalPrice ? 0 : 4, // Align visual weight if no original price 
                                        }
                                    ]}>
                                        {item.price}
                                    </Text>
                                </View>
                                <TouchableOpacity style={[
                                    styles.addButton,
                                    { backgroundColor: isDarkMode ? 'white' : '#111827' }
                                ]}>
                                    <MaterialIcons
                                        name="add"
                                        size={14}
                                        color={isDarkMode ? '#111827' : 'white'}
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
        alignItems: 'baseline',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
        color: '#BE3A3B',
        textDecorationLine: 'underline',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    badge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 8,
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
        top: 12,
        right: 12,
        zIndex: 10,
    },
    imageContainer: {
        height: 128,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280', // gray-500
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceCol: {
        flexDirection: 'column',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        marginBottom: 2,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        padding: 6,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ShoeGrid;
