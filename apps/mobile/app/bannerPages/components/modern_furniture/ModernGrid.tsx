
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const ModernGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#ECC646", // Yellow
        secondary: "#111111", // Black
        bgLight: "#F5F5F5",
        bgDark: "#121212",
        cardLight: "#FFFFFF",
        cardDark: "#1E1E1E",
        textMain: "#111827",
        textWhite: "#F3F4F6",
        textSub: "#6B7280",
        textSubDark: "#9CA3AF",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Wooden Side Table",
            collection: "Minimalist Design",
            price: "$120",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAe1Ldi_-CM6ImXmbnEX334MQPyT9f-OHYJdzbAtQlMfB4C9-6cTnO8XvX7ek2O4jy3GwPJkqcwKVKTaoZMjbbb-E4hNhAXrGdOdQ2tvmXNP_JGVGsCLCAKJwftudAln6DblKZqME8sjNUgBxouiXdya_4caBzVHC4lwxK43eyxuoNNTcGS5S-9LbV_NrPHYYbZn_Vo9-FafUEdeTMaBoM3S3A4CJCmDRR25A1CpGDzmk_uJAwWOJWI8-EYlaHQLELiVUbN8uEJfKn"
        },
        {
            id: '2',
            title: "Arc Floor Lamp",
            collection: "Brushed Metal",
            price: "$250",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6UmQxi31DHe_ym5nYP6NxOvb4NrpGMkQrWP2F4HUsK_kVNeM5oQxTzyitQb711aNEcOweycTWGVWPx-zN25p_JSuBNTLXf3Q9qlblzxaI8S8khwVr4cwAjDPQ6H43nIPsz4QGAkR91h4R-2fzEpWsX_qoeTeQrYMipEhkbHKUeZqDKDbwpdGzBYYLHUiBX2kSuwX_4zDXNOFlMKf1udkE_SNd78ekxiwbsrwNErrSJg69-iDaLH-q0npeIiAWqes6LscalNvtjc-x"
        },
        {
            id: '3',
            title: "Grid Shelving",
            collection: "White Oak",
            price: "$180",
            originalPrice: "$300",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBifcvAWFyr2GyhITDYldCkAieyoUvCzNUGT0TOxRa6Rrh3GkhEHO_IrTEtcplhoizdWuPzxto0tezcQtKgG62TpOf5YKHVw9jm1b06eWJYXhMYTnA6quXeLjRy1ogXo9hFA65jVIhjHVClcVW9qVi4Qki7OhFEwiNR4qjTm6K1c9-Kj7c7p6DrdhWzqYRFcqV2Uf-oDiPqxjWz5AWdGzTD_YApSJCiOfSn7C4v5LHXHRHi9KjipYzO5R8hvGGqkMU85md3zHJq0-to",
            isOnSale: true
        },
        {
            id: '4',
            title: "Lounge Sofa",
            collection: "Grey Fabric",
            price: "$899",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzkAt9aUMHJykUjAwn64HJd4c-xqCSX8dYVAC9vJOPbE24LcXv7uJo96GWTLvxepxjr7bgT4pFHr0Okf_upLb_2JU4RJFp3GC8jocKMTssOekVsQaNExsM10G3UEHfSLke4SGzzCzu8QlGZoMj5k3XV5yN4Ei55LvUAagyKToqAwVm85Cxdol-mMewKlvMRKTaOmG5gO-YvbCw39WFAal4pl_sG0yYfNjd3xIlfueco0llHgzx33F70UDmITu95FVdkAmpHAj8PVi-"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textWhite : '#1F2937' }]}>New Arrivals</Text>
            <View style={styles.grid}>
                {products.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            {
                                backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
                                shadowColor: isDarkMode ? 'transparent' : 'rgba(0,0,0,0.1)', // box-shadow sharp logic manual
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {/* Image Section */}
                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }]}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            {item.isOnSale && (
                                <View style={styles.saleBadge}>
                                    <Text style={styles.saleText}>SALE</Text>
                                </View>
                            )}
                            <TouchableOpacity style={styles.favButton}>
                                <MaterialIcons name="favorite-border" size={14} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text
                                numberOfLines={1}
                                style={[styles.title, { color: isDarkMode ? colors.textWhite : colors.textMain }]}
                            >
                                {item.title}
                            </Text>
                            <Text style={[styles.collection, { color: isDarkMode ? colors.textSubDark : colors.textSub }]}>
                                {item.collection}
                            </Text>

                            <View style={styles.footer}>
                                <View>
                                    {item.originalPrice && (
                                        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    )}
                                    <Text style={[styles.price, { color: colors.primary }]}>{item.price}</Text>
                                </View>

                                <TouchableOpacity style={[styles.buyButton, { backgroundColor: colors.secondary }]}>
                                    <Text style={[styles.buyText, { color: colors.primary }]}>BUY</Text>
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
        paddingTop: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        marginBottom: 16,
        padding: 12,
        // Sharp shadow simulation:
        borderRightWidth: 4,
        borderBottomWidth: 4,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    imageContainer: {
        height: 128, // h-32
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    saleBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#EF4444', // red-500
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    saleText: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
    },
    favButton: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    collection: {
        fontSize: 10,
        marginBottom: 12,
    },
    footer: {
        marginTop: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    originalPrice: {
        fontSize: 10,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    buyButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    buyText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});

export default ModernGrid;
