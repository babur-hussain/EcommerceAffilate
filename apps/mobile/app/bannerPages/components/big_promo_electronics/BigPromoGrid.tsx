
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const BigPromoGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#F59E0B",
        cardLight: "#FFFFFF",
        cardDark: "#1E293B",
        textLight: "#1E293B",
        textDark: "#F1F5F9",
        bgLight: "#F3F4F6", // gray-100
        bgDark: "#1F2937", // gray-800
        grayLight: "#9CA3AF", // gray-400
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Digital Air Fryer Pro 5L",
            originalPrice: "$120",
            price: "$89",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQEmB_gzcC1b8eHeVSShcwP5F5aoOz6Xqc0lgx4YHrrfe1H4uzvWUU8eiGEJwd5lZ8oh72XTrdYyS00Hesp7w8O0j-vLWTpCpgpLKVV4VH3bF65hiuN8IFzSfR6roVggMZryu6LFHcm5Yx8I1qDwBUaGWt5oMo5og_y8FO8YepJFv-HCFeKo7uWk8amuXFzqehfJKKt9x0HlpKudGckxwhu0nKzcnffVzNXXSVwFqW6x3E2Rcx09MFTqWXc7WkrVVw2YtcrnV-eL21"
        },
        {
            id: '2',
            title: "High Speed Blender 1000W",
            originalPrice: "$85",
            price: "$55",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVfAhaUxtDhcAGGF6-wcFHUa_XFxHulLF5OSzyP1dJwJ95t3uZAxAiIi0X4xuxGfW5xB-5lCHK89sCpgFMsFfU7PbPUhNm6tWXKnuE5ZlXP9uxsbgNvBXCjZos8iYazoXNR81YaL6fJD4pmIGuLUVdIYI2sJ6HXybtRS7fgxuezkksCj5DjyEiwN7t4BijUuhp-BwaPgbUMdWQrd1P_0tSUYeNh-JdtrN8pQCC0bRdKK7UctemMHC1eBhBZCFVVXditQEI7G1oxy7n"
        },
        {
            id: '3',
            title: "Smart Front Load Washer",
            originalPrice: "$699",
            price: "$450",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzt5H8WK1wvx9c605F3iDoDUNh97rvy_AYYS_dbB8IlFj-VIkvXE7HZGvKNb7XkmW5PNRBr8KuNHxPlPlFCTKz-xyO2GuQflc7rzpsRmbK6qbwR7aYEtLH3bTcigTeaBAcAozwLOV8gAIovrVqeh_k4tLPg-NZNTg_G0vGxQwW0h9ULyqOw4mmD7cVAdy7cUXWZFVo6BqSGn5oEqXGMys4FhD1EL0lFQsZQMNueMV_PVhzHNq_nBLHKFBHKNPYp2vyIHXLUs0h5K9g"
        },
        {
            id: '4',
            title: "Double Door Frost Free Fridge",
            originalPrice: "$950",
            price: "$720",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtHnALf_OFvzxil99l-95jx6besZtjrrpdHzaCs3MGYMwPR-JLW01i1aqxE3HkF3P6TOcPbCk2CeSiTQksEvfAQHwO1WqO0NY5IRtcBvI7KothQF40-cHLIEJed7uuLbYaDDESz3Aa7VQGetTZ3UxYidVnscz1BDAsq-nnlmnWSZ4RjqS9rZsMioGGFzI-JQB8q3KQcoPbAQeTZRX0ksQzuA1c0EPWDYJsHon-LHppNU7uQ8vz2WxYtPxduyNP4B566BWiAf-nfuUF"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {products.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            {
                                backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
                                marginBottom: 16
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {/* Starburst Badge */}
                        <View style={styles.starburstBadge}>
                            <View style={[styles.starburst, { backgroundColor: '#38BDF8' }]}>
                                <Text style={styles.starburstText}>ONLY{'\n'}2 DAYS</Text>
                            </View>
                        </View>

                        {/* Image Section */}
                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight }]}>
                            <Image
                                source={{ uri: item.image }}
                                style={[styles.image, { opacity: isDarkMode ? 1 : 0.9 }]}
                            />
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text
                                numberOfLines={2}
                                style={[styles.title, { color: isDarkMode ? colors.textDark : colors.textLight }]}
                            >
                                {item.title}
                            </Text>

                            <View style={styles.priceContainer}>
                                <View>
                                    <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    <Text style={[styles.price, { color: colors.primary }]}>{item.price}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.cartBtn,
                                        { backgroundColor: colors.primary, shadowColor: '#F97316' }
                                    ]}
                                >
                                    <MaterialIcons name="shopping-cart" size={16} color="white" />
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
        paddingBottom: 100, // Space for footer
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 24, // rounded-3xl
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        position: 'relative',
    },
    starburstBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        zIndex: 10,
        transform: [{ rotate: '12deg' }],
    },
    starburst: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        // Creating a pseudo starburst shape using borderRadius is tricky. 
        // We'll stick to a rotated square or circle for simplicity in RN without SVGs
        // To mimic the design closer, we could use a library, but circle works for "badge" feel
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    starburstText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 12,
        transform: [{ rotate: '-12deg' }],
    },
    imageContainer: {
        height: 144, // h-36
        borderRadius: 16, // rounded-2xl
        overflow: 'hidden',
        marginBottom: 12,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    content: {},
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        height: 40, // fix height for alignment
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 4,
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: 18,
        fontWeight: '900',
    },
    cartBtn: {
        padding: 8,
        borderRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
});

export default BigPromoGrid;
