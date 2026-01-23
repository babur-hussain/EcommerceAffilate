
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 20;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const BackToSchoolGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#F4B060", // Bright orange
        bgLight: "#F9F7F2",
        bgDark: "#1A1A1A",
        paperWhite: "#FFFFFF",
        paperDark: "#2D2D2D",
        accentRed: "#E66B6B",
        textGray: "#4B5563",
        textGrayDark: "#D1D5DB",
        textMainLight: "#1F2937",
        textMainDark: "#F3F4F6",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Dino Explorer Backpack",
            subtitle: "Ergonomic fit",
            price: "$34.99",
            badge: "New",
            badgeColor: colors.primary,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0qgZsOP70tmld6ZraMtCBaVLxR6dZxr8exrVcrnu2VlLAF1epw_2DBCombSYP8Ny5Q8NerXaaOsaH50MFgYBo3zIdQsqAweqCakaLhRvU369-cyYyZF_oS1CkqAjHTdwhnWY-xggEGvKMPBNTVHOo2HXk2vPboQ43QSSe9wPIHWh-MMJrv33bc77nfiydEXZDiSddkOS0u309A1T-i5VYfX7m6sunNVCAbEnXd-eoLdQSYFaHh1fbPZIx0miN7z24RsAYb_vaV1Xl"
        },
        {
            id: '2',
            title: "Artist Color Pencil Set",
            subtitle: "24 Vibrant Colors",
            price: "$12.50",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcdvhXWvPY_GEjZhc9IoobM2aNEU1lp7iQkcfU3n82j_i6d0y00yKz6PX_WsRfpm1GR_JPpEq4M4nbhfEdGv_UopfMEESW2zq9Fch9gd8Lk7FngJA9pb1rz-XLvCRo6eYvHbcvTq_5QtfoLfhq9nOse1z3vkTHlRrcHgJXxOEXI4jxJYvuq8_0GVM3tvDFno77q7CxXsD8Z5paYzSMezi7hD7909VrRQ35Q8IFV0JwYYuBCZllVDfiwFvBYQG0LU-rT7F6bbbZlk7A"
        },
        {
            id: '3',
            title: "Hardcover Notebook",
            subtitle: "Ruled pages",
            price: "$8.99",
            badge: "-15%",
            badgeColor: colors.accentRed,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2OayXsAosgmuFl6A_uKlKuvYffK7mO5VmGd_uGVd7vOftDM3UmgiJhpsd2ml_Y4yETCoXhiyezFnm229e8nDaS__HTUX0hbj_Qufs7anfkqIg1mSQTSVZPAFW-vgI47f09Djzpu3-j9BqNSJr4o18v6PfWrN6yLyB8Uvu8cPZYs2FgPxRzFw8c_elAE4xGxJTWkDFvGrNFuSOmr6TWtB384daydDe0aZuvMXZq7DOWzA3ZAg4CaYh6bJLWvWDwYdf3bTkvEhHSf7q"
        },
        {
            id: '4',
            title: "Scientific Calculator",
            subtitle: "Solar Powered",
            price: "$15.99",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFxJ3QXPxvSONI21tIppEnXusRtXhs0IB5D_BqYLQdpO_qP3U0BkRFoKxPvRsxFPk1h-H6zg85kqfIwestz1I82gw_VEozvDmZwT7NvCN_7UwjJaTQWWDmzML1tZNpH_go0pnh3PMWQPDdh2zqE-o14iiXlaWZQU0NI29QIaD6XRQzNKPMiGYurpIyvujbWtDNKXSpC7UsxyidfoRY2rnb2gUakRpEoBd4Gi3Gg9VQdtOdrViYlfnUoBUnsxLEPD3MHanCOrGjNCcI"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : colors.textMainLight }]}>Trending Now</Text>

            <View style={styles.grid}>
                {products.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            {
                                backgroundColor: isDarkMode ? colors.paperDark : colors.paperWhite,
                                borderColor: isDarkMode ? '#374151' : '#F3F4F6',
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {/* Image Section */}
                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' }]}>
                            {item.badge && (
                                <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            )}

                            <TouchableOpacity style={[
                                styles.favButton,
                                { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)' }
                            ]}>
                                <MaterialIcons name="favorite" size={16} color="#9CA3AF" />
                            </TouchableOpacity>

                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text
                                numberOfLines={1}
                                style={[styles.title, { color: isDarkMode ? 'white' : colors.textMainLight }]}
                            >
                                {item.title}
                            </Text>
                            <Text style={[styles.subtitle, { color: isDarkMode ? colors.textGrayDark : colors.textGray }]}>
                                {item.subtitle}
                            </Text>

                            <View style={styles.footer}>
                                <Text style={[styles.price, { color: isDarkMode ? 'white' : colors.textMainLight }]}>{item.price}</Text>

                                <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
                                    <MaterialIcons name="add" size={18} color="white" />
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
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
        borderWidth: 1,
        overflow: 'hidden',
        // shadowColor avoided for heavy lists but can use elevation
    },
    imageContainer: {
        height: 144, // h-36
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
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
        borderRadius: 999,
        zIndex: 10,
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
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    content: {
        padding: 12,
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
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F4B060',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
});

export default BackToSchoolGrid;
