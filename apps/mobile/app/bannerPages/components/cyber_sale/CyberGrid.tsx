
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const CyberGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#D9242C",
        secondary: "#FFCB05",
        backgroundLight: "#F8FAFC",
        backgroundDark: "#0B0B0B",
        cardLight: "#FFFFFF",
        cardDark: "#1E1E1E",
        textLight: "#000000",
        textDark: "#FFFFFF",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Pop Mini Tote",
            collection: "Retro Collection",
            price: "$45.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9VNfGumdBjVpKxrUSLk3hQ4ToTF51Q6OLaGTkHOo-nSW96m8wzvIXYuLFdZlgEHJ7GH5omjnxSplZHNKWrkF0aM4LC0knqGyjuenqLbA0tY0IxYRf3vhk5rVAroDKktcEWfhihMc-JHi0QTEBQqYf_KYHmmT4gW5dWyBW79i-T2X1RcYQHacPi70mjYGEXbWWVfui4eoCt7UpRxFPd5YS4QU9sdplGWp4IA6cTR86LxEHZJ1uSspe4aPZxfh2HyQzJX_PYh8hPEp5",
            rotation: 3
        },
        {
            id: '2',
            title: "Electric Blue Heels",
            collection: "Night Out",
            price: "$89.99",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyosg-MU17m6xB3YuRBVDBofVv9XFXwFL2L4AaklS5xn8d_HxNmn8RNtrgsZXlc18Yduu5Mj3GH97XXDSOBklNq7Q3WTcSO4msdwjucr3Rdbzn-QuhwZrej6GQYfS2mVYfWDUurQJrBLMp6fFcT5SK8SFPIhG5aLFRQKCsmXMbhe62QvD_HBgQnArhkD_7PssOG8fioMOIxfNGhmWyMJ4U2mZBpyNqDty23HiAZ7lopEenyIxdjVq4U8dsA-Am-A9uHKk9sWrcZC0h",
            rotation: -2
        },
        {
            id: '3',
            title: "Retro Shades",
            collection: "Summer Essentials",
            price: "$24.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9JD4IDoUHWUUY2QRQlZq7ZwbpeCJfiB2BMz02_t0G0REmiA7JVuotrelda_0VnrvZA6KGMLxbnKv7dzVsIZZRjH9pjne_yfsDK2_jI3fk5VT4JWPnA5j5-toXhvsEoT7tQQDuvOpgnb26K2wGvqqgei11Pv7-IUFVysPMp3XPHB8gt3l_nDswVu80CnYMarTSV1xSEsgGYfxWL559Mcw3tfKIWMjJ3sZTXxnaO50GtsCZNHYvTJvDrYG00rfk6Q9mJMLMpJjtoE54",
            discount: "-20%",
            rotation: 1
        },
        {
            id: '4',
            title: "Metallic Clutch",
            collection: "Limited Edition",
            price: "$120.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6IOi-3Vbj6m4M6gWtsPMbJqspCx0y514hh7FX66ZqY_P06wSuFf3V_VgQCUEdDO_xOwJEn-WSnuSHCKr_HNDXLBdVCraQJ1ihojnJRHykavPppapGLZbT-nQriqSknqgV_tDq5YB6VWnPlF1MgsuCn1N-K_09qSAW-efWarl-gijSZY9X7dE72MuWDIoW8ABO2kuOJZau9OdYpm3IXTJLpCQVw5cEbwTlxTY1HgMfucQW_qLucdRp0rkZk7tA9eiWy6DhgroTbLV8",
            rotation: -3
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
                                borderColor: 'black',
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {/* Image Section */}
                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6' }]}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                            />

                            {/* Discount Tag if available */}
                            {item.discount && (
                                <View style={styles.discountTag}>
                                    <Text style={styles.discountTagText}>{item.discount}</Text>
                                </View>
                            )}

                            {/* Favorite Button */}
                            <TouchableOpacity style={styles.favButton}>
                                <MaterialIcons name="favorite-border" size={16} color="black" />
                            </TouchableOpacity>

                            {/* Price Floating Badge with rotation */}
                            <View style={[
                                styles.priceBadge,
                                { transform: [{ rotate: `${item.rotation || 0}deg` }] }
                            ]}>
                                <Text style={styles.priceText}>{item.price}</Text>
                            </View>
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text
                                numberOfLines={1}
                                style={[styles.title, { color: isDarkMode ? colors.textDark : colors.textLight }]}
                            >
                                {item.title}
                            </Text>
                            <Text style={styles.collection}>{item.collection}</Text>

                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.addButtonText}>ADD TO CART</Text>
                            </TouchableOpacity>
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
        paddingBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 12, // rounded-xl
        borderWidth: 2,
        overflow: 'hidden',
        marginBottom: 16,
        // Pop Shadow
        shadowColor: '#0F172A',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    imageContainer: {
        height: 160, // h-40
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    discountTag: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#D9242C', // primary
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: 'black',
        zIndex: 5,
    },
    discountTagText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
    },
    favButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    priceBadge: {
        position: 'absolute',
        bottom: -12,
        left: -4,
        backgroundColor: '#FFCB05', // secondary
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: 'black',
        zIndex: 10,
    },
    priceText: {
        color: 'black',
        fontWeight: 'bold', // comic style bold
        fontSize: 18,
    },
    content: {
        padding: 12,
        paddingTop: 20,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    collection: {
        fontSize: 12,
        color: '#6B7280', // gray-500
        marginBottom: 8,
    },
    addButton: {
        backgroundColor: '#D9242C', // primary
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default CyberGrid;
