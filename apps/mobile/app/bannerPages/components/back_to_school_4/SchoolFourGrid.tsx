
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const SchoolFourGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#1565C0", // Deep Blue
        secondary: "#FF8F00", // Orange
        cardLight: "#FFFFFF",
        cardDark: "#1F2937",
        textMainLight: "#111827",
        textMainDark: "#F9FAFB",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Pleated Skirt",
            subtitle: "Grey & Navy Options",
            price: "$24.99",
            badge: "IN STOCK",
            badgeColor: "#DCFCE7", // green-100
            badgeTextColor: "#15803D", // green-700
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbAgp5kIduqiKyWmtqcIYF7zO_T68btBFWT_2HOkQy-mZzM75b-lXHdoGoXnThkc2Cyi7kNTTskIbYyYcqllCY-fbvzH3SV_8v5q1784x8xHbqgZD-bBIYGbHZwyHKOzSJnHLRAacSvQwBghvLxC6guQYWtL8c1Po8IxCGrzaLEBiIvjrjVzbUkQAhJa1RaxU4RNDyE3jzBgVIircc3LuRBbr6O_NQlB-7IADlgHsmJ3yjdtZ283mYxKHPvrAsFPsIFRxf7vyvaquf"
        },
        {
            id: '2',
            title: "Premium Polo",
            subtitle: "Cotton Blend (2-Pack)",
            price: "$18.50",
            badge: "IN STOCK",
            badgeColor: "#DCFCE7",
            badgeTextColor: "#15803D",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDspN1w-OKG1sC1udjRFw5eQuMOsUgiwY89bWPd3Zfld2BXkbsQeCi14nKYNyRE5SD8c_fA4_ona5G7ViY-c5cPMq54IyooRSMyvroTFki06Rgwdrv1Syln7lvPmJ_yKgiCLcuqmPy0afmUThKhbl0u8trSY_Xt-t4AlYnmLbmUtaJzu0KZk3f7G-RufiB11TAgWntNuoAfi3n-Gt6ddRperI7tTnJ0hdq4KIKftFN1e_fDK0k4OFtmivOP39wpiyRH9Fl589rD3lMV"
        },
        {
            id: '3',
            title: "Classic Blazer",
            subtitle: "Embroidered Badge Ready",
            price: "$45.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8XaXQDpYxSrbNKu8N_FqFsT9IijFf2tO_iNGGCPkvTgVeleqZaRnw8t4r-9-3-t048UgFPVkAz61T5i4icG-fFcNYb-KylYbUxAkAd0pgDaD3fxQX9q_9-g90CL5AYmYDuTQ3U66KCX9NaFxCDDjs2--wSxrPzXmgwA9m7CjM27AnSw8v0ltsW7_UVMB4yV3GH9hPwO_z9blmYRCKQKrILsn4xOQLt3Us4GgSxpnzplAVhmO6CTswl3xHPooXtA9_ARQUWLeePPsM"
        },
        {
            id: '4',
            title: "Striped Tie",
            subtitle: "Standard House Colors",
            price: "$8.99",
            badge: "LOW STOCK",
            badgeColor: "#FEE2E2", // red-100
            badgeTextColor: "#B91C1C", // red-700
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnjyr6QlwCJibx6-VYHNaJc-G0veToQYr513y2tNXeRraDxoWWe7uyEBjOVJuJSAIOT-M3d4C98PpIQ3M4K3J1YOLDs2eiAiAUoMKuPRfIWCf6aibZre9el9b-PoTi489Bd4hhKnBPOicMAFZkxCiTnjETxOEcdA5fSC4PWy1ltOpOd1iy5NWd9z_NZJk7FLYN-O3dkKwip-uUATgYfz1Fz_ftjBJ9abRQOQftdNy2f6JYy_uKoK9itqEuSut0N3Z82rN3DHmsI2LY"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textMainDark : colors.textMainLight }]}>
                    Essentials
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
                            <View style={[
                                styles.badge,
                                {
                                    backgroundColor: isDarkMode
                                        ? (item.badge === "LOW STOCK" ? '#7f1d1d' : '#14532d')
                                        : item.badgeColor
                                }
                            ]}>
                                <Text style={[
                                    styles.badgeText,
                                    {
                                        color: isDarkMode
                                            ? (item.badge === "LOW STOCK" ? '#fca5a5' : '#86efac')
                                            : item.badgeTextColor
                                    }
                                ]}>
                                    {item.badge}
                                </Text>
                            </View>
                        )}

                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' }]}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>

                        <View style={styles.content}>
                            <Text style={[
                                styles.title,
                                { color: isDarkMode ? colors.textMainDark : colors.textMainLight }
                            ]}>
                                {item.title}
                            </Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>

                            <View style={styles.footer}>
                                <Text style={[styles.price, { color: isDarkMode ? colors.textMainDark : colors.textMainLight }]}>
                                    {item.price}
                                </Text>
                                <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
                                    <MaterialIcons name="add" size={16} color="white" />
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
        marginTop: 24,
        paddingHorizontal: PADDING,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '900',
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
        borderRadius: 24, // 3xl
        marginBottom: 16,
        padding: 12,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 25,
        elevation: 10,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        zIndex: 10,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    imageContainer: {
        height: 128,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: '900',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
});

export default SchoolFourGrid;
