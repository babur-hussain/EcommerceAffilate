
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 20;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const SpecialGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#C62828", // Deep Red
        surfaceLight: "#FFFFFF",
        surfaceDark: "#171717",
        bgLight: "#F9FAFB",
        bgDark: "#1F2937", // slightly lighter than surface for image bg
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Cyber High-Top X1",
            subtitle: "Urban Series",
            price: "$145.00",
            badge: "EXCLUSIVE",
            badgeColor: "#000000",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTIybldomSJneu0tokz7IH2lmn5-VCllFrM5eG2tBNHe9uyYlXzfBDA8omRbEhjsLjNap9RjRzh6qFESmI0cLQ7GF_uNwSe0iPdhqQvOYwyC_nQgaTwaq2TYlIl3jreTUR9pGkkU33PsFGXUdTsxkpuyH3lR6WEQ4V885n2R9vLRgh5qDsP1YwZ-UfKtrmi3yjzQLpZugj4KhmGWQXZ-5hX8-_eSAGtQ2n5EH_GL19AecWwPXHljXU_GBCGDRto-dSVSwq1IeNaFor"
        },
        {
            id: '2',
            title: "Retro Chunky Red",
            subtitle: "Vintage Vibes",
            price: "$189.99",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoUY0xkTp07I79nulYd7Cc89SOa1WkjlPbens6fW8eXMGbyPNUksoo4NWGtVx30evmnhZATijXvgmE4U3rXxyrWPoCSDLM_xC6t73tkAW1aV5Vt_yIORzRHABJbPHAMtKMVZ8h27NRDVaMHEE4cqpZE_fTeB0Wlu5V3rdLW2X6WfBKwRAIiZLVF4TeV_SdTy8ST5Gcx6tuR6YBDQzNDyuYJOnsnlXHD6JWUYiwvQ-Uh48tZvqm1pZRva2Nn2iTc7LgRA6iivVeijdd"
        },
        {
            id: '3',
            title: "Street Flex V2",
            subtitle: "Running Tech",
            price: "$128.00",
            originalPrice: "$160",
            badge: "SALE -20%",
            badgeColor: "#C62828",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6q9kGEWgikgtgf7ExPIxkUtHRO18ZIwwxgET5xUqbgFqTLO5H4HdWZzrmiK1g1dAFrFyXbAJN6EUOle4KV0Zw8y9fHLm2THmkJ4ffHlq3lqOPYjc2I5CQoLF-W6Z0W9i5ezoRkGR1ZIlbC84X0RsddXJkZ34-I7Mh1oX3T5bmYzCS1EclhLZHb4N1rKBoauPh1RMOk_5rvzD9NWQ1mZXBR4nn2aeBEPne7NqPvBd6XLXWAt_QzP7GNGJKqrbfjFssJtK93JFoUJ5G"
        },
        {
            id: '4',
            title: "Green Strike Low",
            subtitle: "Skate Culture",
            price: "$115.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOZdzCZdgFYmZftJeuQ40AutswNtqbBpJ9eOHZW4F7vClL8iMaXDuk3p_CdkE44rt3l72BjL3keRIqjnvA2oP3HnKpzJl2S1V9cOjFCsVlQGTZ_fUtFe-lS7f_sUDB_RMecF2tEqDFyhP58fmciU9QCLsr5_tYGXbbP60_TwaIWkb1QlcmbH067U-26ehRSLSBmTt6edTz8DjqfJpB6gbv-F2AGnVI6aphq-dKOhnEdd0pl12k7OJwWchHpOBDo2e-mrshGuhOfYOe"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : '#111827' }]}>
                        Featured Drops
                    </Text>
                    <Text style={styles.sectionSubtitle}>Urban Collection 2024</Text>
                </View>
                <TouchableOpacity style={styles.viewAllBtn}>
                    <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                    <MaterialIcons name="chevron-right" size={16} color={colors.primary} />
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
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {item.badge && (
                            <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                                <Text style={styles.badgeText}>{item.badge}</Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.favButton}>
                            <MaterialIcons name="favorite-border" size={18} color="#9CA3AF" />
                        </TouchableOpacity>

                        <View style={[
                            styles.imageContainer,
                            { backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#F9FAFB' }
                        ]}>
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
                                    <Text style={[styles.price, { color: colors.primary }]}>
                                        {item.price}
                                    </Text>
                                </View>
                                <TouchableOpacity style={[
                                    styles.addButton,
                                    { backgroundColor: isDarkMode ? 'white' : '#000000' }
                                ]}>
                                    <MaterialIcons
                                        name="add"
                                        size={14}
                                        color={isDarkMode ? 'black' : 'white'}
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
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold', // display font usually heavy
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionSubtitle: {
        fontSize: 12, // xs
        color: '#6B7280',
        fontWeight: '500',
        marginTop: 4,
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
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
        borderRadius: 12, // xl
        marginBottom: 20, // larger gap
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
        overflow: 'hidden',
    },
    badge: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderBottomRightRadius: 8,
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
        top: 12,
        right: 12,
        zIndex: 10,
    },
    imageContainer: {
        height: 128, // h-32 (md:h-40 handled via scaling if needed, stick to mobile base)
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        lineHeight: 18,
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 12,
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
        fontSize: 18, // lg
        fontWeight: 'bold', // display font usually
        letterSpacing: 0.5,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SpecialGrid;
