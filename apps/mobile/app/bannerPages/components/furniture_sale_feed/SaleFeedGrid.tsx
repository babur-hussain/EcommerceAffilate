
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 24;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const SaleFeedGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#52665F", // Deep Green
        secondary: "#8DA866", // Light Green
        bgLight: "#F2F4F3",
        bgDark: "#121816",
        cardLight: "#FFFFFF",
        cardDark: "#1E2623",
        textMainLight: "#1F2937",
        textMainDark: "#F3F4F6",
        textSubLight: "#6B7280",
        textSubDark: "#9CA3AF",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Sage Velvet Sofa",
            subtitle: "Living Room",
            price: "$629",
            originalPrice: "$899",
            saveBadge: "Save 30%",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMsdTu9SWAj8lYwRTYTlTwng-U36suU7UGpKprpKLjzf20RRADAPH9Nmrc6qlY6SJajJHu-4c5gU60IZViJNixtjJy5i6EboqN0X4oU7ndn60pJ0CS_83VJ7YX01OKKVqhaftef3HKSOMpXNr0DG77ytAl_3kt9gwe-xYUZMkmOBtmwNwD7NJitEZEe1SH_zuiRfOvfjSIrZI4Yhxc3791H4ofd505avA3B3BJDXUVdkv2SvktXnxyIRXjOgrNBaAJ1YPfyI1C8Chk"
        },
        {
            id: '2',
            title: "Teal Wingback",
            subtitle: "Reading Corner",
            price: "$315",
            originalPrice: "$450",
            saveBadge: "Save 30%",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdlPAB2efbHh6Vj3xp2WLvYDGJT0uBGM_BnGq8xahjtxX6jH57f8_dQWdKwQ1xGlk5iz3_r9pmH_DxfQOcv4eAcaKK8iiJ_VRQGAo11g-QGyJ9nW2aiFrwa_zQuURTRKLl8ynvavjQdkrcVdyqj8EKQIehang4jxtBwaFik-QtgfRiPx0enX9dpLxDMRPNbAyLrlP1v4b_uQSIxcVBD5_z_HpZBj8Is8LvnR2nBozz8stFqwUjJFNOJfP21umbfJ8ECV22J3OtttYy"
        },
        {
            id: '3',
            title: "Oak Coffee Table",
            subtitle: "Accessories",
            price: "$209",
            originalPrice: "$299",
            saveBadge: "Save 30%",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHNpMS591AgvZ26yetz5jAl9GK7waTrP6MwuB86Qh2RX3z1u0-UmeagbPcRn8mXOuyOV3F5Iivp_qbeYa9-udobCNJnwxU_4gVhYuZho30XrBXd6hrS3UHh5DiHGHGKywKQAAGkdWsWYZOxLVmaGPeuOEUXw1X8Lsjd6ZmVCVu7jltkeUdx4dGgQpFWoeQPq8QMrEwYS-HGYIcIsTo-CT-Xrifuw90DqyRWLygpfRYlu-66dius9Cl7soU5wu8F5iDoSn29f5MJGCk"
        },
        {
            id: '4',
            title: "Lounge Sofa Grey",
            subtitle: "Living Room",
            price: "$840",
            originalPrice: "$1200",
            saveBadge: "Save 30%",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2CLVmc4Bu70SWeWubyFreVjbxXoO_gEIf903R_hzGgmnBpC_-UH4oT_UxxJf1xGXGgw7cSOMOjiVSsvR6svm6ZpzC078uLKzEkNanGGy6IpVqhDwlO04V9dgV0dc-1gZgklNMEIdVLisEN5TmWn_pR_lJOU6okfGj_KJRcXJT5-HvWFEmDZd8psaASFhE6Uvj3pQ2hM31buFBuIuGSetptcZlcTs88JwZHu5IZxswJArFTv6KhPPouKMtkLid-hIlS9sNn79-4qso"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textMainDark : colors.textMainLight }]}>Don't Miss Out</Text>
                <TouchableOpacity>
                    <Text style={[styles.viewAll, { color: colors.secondary }]}>View All</Text>
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
                                shadowColor: '#000',
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {/* Save Badge */}
                        {item.saveBadge && (
                            <View style={[styles.saveBadge, { backgroundColor: colors.secondary }]}>
                                <Text style={styles.saveText}>{item.saveBadge}</Text>
                            </View>
                        )}

                        {/* Favorite Button */}
                        <TouchableOpacity style={styles.favButton}>
                            <MaterialIcons name="favorite" size={20} color={isDarkMode ? '#4B5563' : '#D1D5DB'} />
                        </TouchableOpacity>

                        {/* Image Section */}
                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#121816' : '#F9FAFB' }]}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text
                                numberOfLines={1}
                                style={[styles.title, { color: isDarkMode ? colors.textMainDark : colors.textMainLight }]}
                            >
                                {item.title}
                            </Text>
                            <Text style={[styles.subtitle, { color: isDarkMode ? colors.textSubDark : colors.textSubLight }]}>
                                {item.subtitle}
                            </Text>

                            <View style={styles.footer}>
                                <View>
                                    {item.originalPrice && (
                                        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    )}
                                    <Text style={[styles.price, { color: colors.primary }]}>{item.price}</Text>
                                </View>

                                <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
                                    <MaterialIcons name="add" size={20} color="white" />
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
        paddingTop: 16,
        paddingBottom: 110, // Space for bottom nav
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        // fontFamily: 'Montserrat'
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 16,
        marginBottom: 16,
        padding: 12,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
        position: 'relative',
    },
    saveBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        zIndex: 10,
    },
    saveText: {
        color: 'white',
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
        height: 128, // h-32
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        // padding handled by card
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12, // text-xs
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    originalPrice: {
        fontSize: 12, // text-xs
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
        fontWeight: '500',
    },
    price: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#52665F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
});

export default SaleFeedGrid;
