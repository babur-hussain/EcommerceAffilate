
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const PayDayGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#4FA960", // Vibrant Green
        cardLight: "#FFFFFF",
        cardDark: "#1F2937",
        textMainLight: "#1F2937",
        textMainDark: "#FFFFFF",
    };

    const defaultProducts = [
        {
            id: '1',
            brand: "Wilson",
            title: "Pro Staff 97 V13",
            price: "$144",
            originalPrice: "$240",
            badge: "-40%",
            badgeColor: "#EF4444", // red-500
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjPuw40Z0RRVQO_dLMUPbGHT4q7RGHYkhagjX3l7TwyBDQh9zbaG5jeBAjdZ2aEdEVyX9lUE9jXqyMJtRmzeZOrN2sLcHlbgHPTC5jrvKF0Qhz5Yp1eZ21oPXPMu2_GNvoPIll7cFurjFZBbOB8Ia7aedpZr13j7mLwceUO8x4sEISJkpafQSRlVhMleKaJF-bArLApn7HhlEJ4ko2YqSW5Gq8OrpLC6tBKnEAwlhx1a_2sqj1SkeNey9s0VOEiCdJcqJnDVq4YcQj"
        },
        {
            id: '2',
            brand: "Dunlop",
            title: "Fort All Court (3-Pack)",
            price: "$6",
            originalPrice: "$12",
            badge: "-50%",
            badgeColor: "#EF4444",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvIJE0pDk0VllP1SfCifiCkuZucRH6vJ2kMGoN90pfTTPzElfRcMEySPnZuUYb1tex1IBUckvC6w7kxBr6Lh0vMauoLMH7w0Lu8103HV2u7gB2WqwO8PfGe7joSHptKU7COnDHQVh_MbbvGTTkEqFRmZG7w_8GV7PJAGmV9pvFkeuAh0YUOOJAvrdVpHZetHS_ay4thj9VixYUUSdu9xO1jUzT81hp2dYrdZ7xNSXsHHsPbjj7a0YUdpm8nIvhJEJnsfLUIPDKPG1J"
        },
        {
            id: '3',
            brand: "Oakley",
            title: "Radar EV Path",
            price: "$180",
            originalPrice: "$205",
            badge: "New",
            badgeColor: "#1B4B63", // Secondary
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0FajKYgPN-Dxz37FfjVy7POqDbEZ2DAupAdYNVY9QQ37qwCbvmJl5kWk0ZgPLuGIJfq2xyXQXiSH9TIUFMqorD1l-01DZI9ABuqIHI6EYEX1EZ_Ltzr82w3Y2BS2_5SdTPp8tAJ2vIYB8Dx5a864HMMTHOuabNvZs68ibc_-d4Jo_9vthyztBsj9cvsaQDLHdgAxhwF9xNMtP9rW33DuD80oy7Rvvq9j9ZFXDazv2doMOtsSPfFXwZXxSQ_bOPg1d3fdg5AUSbI8E"
        },
        {
            id: '4',
            brand: "Nike",
            title: "Zoom Vapor Cage 4",
            price: "$120",
            originalPrice: "$150",
            badge: "-20%",
            badgeColor: "#EF4444",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkX5N72DoQM0PURYpZexvVA3G6e6tYuL6on2R5lm4RVk9Kq4IqA2U3v-7azNQiyRO8t7YKJf8tbc3-pkErjeVGin-JQqXJ-0vFt4LKmaQKpS0Dm0xgJdUHGFslI76QNT77NfwXq0_CHZlQURluOUjALuV3ThnPv4d3yy7P5_uGM_G2dLKMQhElCzIji7mo08BA18cu6ev-1vK43vDMZzrS1YG9t8wnGDsD58lsWsF-eZzrHuuF4Ae1ouR3O7TTeMBI8rvN7BwTvYLq"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : colors.textMainLight }]}>
                    HOT <Text style={{ color: colors.primary }}>DEALS</Text>
                </Text>
                <TouchableOpacity style={styles.viewAllBtn}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <MaterialIcons name="arrow-forward" size={14} color="#6B7280" />
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
                                borderColor: isDarkMode ? '#374151' : '#F3F4F6',
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

                        <TouchableOpacity style={[
                            styles.favButton,
                            { backgroundColor: 'rgba(255,255,255,0.2)' }
                        ]}>
                            <MaterialIcons name="favorite-border" size={16} color={isDarkMode ? 'white' : '#1F2937'} />
                        </TouchableOpacity>

                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#111827' : '#F3F4F6' }]}>
                            {/* Dot Pattern Overlay Sim */}
                            <View style={styles.dotOverlay} />

                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.content}>
                            <Text style={styles.brand}>{item.brand}</Text>
                            <Text style={[
                                styles.title,
                                { color: isDarkMode ? 'white' : colors.textMainLight }
                            ]} numberOfLines={1}>
                                {item.title}
                            </Text>

                            <View style={styles.footer}>
                                <View>
                                    <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    <Text style={[styles.price, { color: colors.primary }]}>
                                        {item.price}
                                    </Text>
                                </View>
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
        paddingHorizontal: PADDING,
        marginBottom: 8,
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
        textTransform: 'uppercase',
        fontStyle: 'italic', // simulating 'italic' class
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
        marginRight: 2,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 12, // xl
        marginBottom: 16,
        borderWidth: 1,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
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
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    imageContainer: {
        height: 128,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    dotOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        // Dot pattern difficult in RN without image, skipping implementation detail for simplicity
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 12,
    },
    brand: {
        color: '#4FA960',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
    },
});

export default PayDayGrid;
