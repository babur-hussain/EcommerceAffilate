
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const SchoolThreeGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#FF8C42", // Bright Orange
        secondary: "#007ea7", // Teal
        accent: "#FDE74C", // Yellow
        cardLight: "#FFFFFF",
        cardDark: "#1E1E1E",
        textLight: "#333333",
        textDark: "#E5E5E5",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Prismacolor Set",
            subtitle: "24 Vibrant Colors",
            price: "$12.99",
            badge: "BEST SELLER",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPYg2e-CCyEimCdpztr2uZXLrwEBtGsORQDbV1ln1T0WrIZBnZ3B4s5UZFWan4FoXMeA8w4JWpoEmb4eQd0OJi20sV914otWEfHMl6o6AtRrTCG7Aan0mqvn8tfHVwF36fuF9RkbpyL2PFUIx8BiFSQtKhdp2RTImwa22S1hsrYvwiGcgE8DWYr-3A7FOZdApFkf5Fs0mMQMzfpyzmx3sNbhsH4Wh-sArzJaC-sFb4cTr6vJ4sWk7RyVmITZoTzFmy2GbdCJwwmj_x"
        },
        {
            id: '2',
            title: "Geo Ruler Kit",
            subtitle: "Precision Tools",
            price: "$8.50",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-_IOBIPy6ZeJNUY2um8EQYm6RD6f6DPLaZeBCO0gCjoWV2DuLTfs6sOUTO-Bw5JJbnkADrQKI6givbfIPXUBj5UVfr17z2cDAG5mba3bPDwnE6lXGctl1CpIbY3B28s01rdlYKF9l9b5nYmU3CCS_vGTWGxp-_vD5DN8MAX4-g_vXzpHWG2chwTnapeOe6r5DgLEr2H1V5ykXz85EnYoD2Wa-4M-ZbuBh9K-hOyC5bnG-qLfcFAKAUwjStBhgyf03ADh6cqPaDaZI"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.accent : colors.secondary }]}>
                    Best Sellers
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

                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#333' : '#F9FAFB' }]}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>

                        <View style={styles.content}>
                            <Text style={[
                                styles.title,
                                { color: isDarkMode ? colors.textDark : colors.textLight }
                            ]}>
                                {item.title}
                            </Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>

                            <View style={styles.footer}>
                                <Text style={[styles.price, { color: isDarkMode ? colors.accent : colors.secondary }]}>
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
        fontSize: 20, // xl
        fontWeight: '900', // extrabold
        letterSpacing: -0.5,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 12,
        marginBottom: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        zIndex: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    imageContainer: {
        height: 128,
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        gap: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12, // xs
        color: '#9CA3AF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: '900', // extrabold
    },
    addButton: {
        padding: 6,
        borderRadius: 16,
        shadowColor: '#F97316', // orange
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
});

export default SchoolThreeGrid;
