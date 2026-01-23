
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 20;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const GameDayGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#D4FF3E", // Lime
        tertiary: "#023E8A", // Deep Blue
        cardLight: "#FFFFFF",
        cardDark: "#1F2937",
        textMainLight: "#111827",
        textMainDark: "#FFFFFF",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Velocity Pro Elite X",
            subtitle: "Firm Ground Cleats",
            price: "$240",
            badge: "Just In",
            badgeColor: "rgba(212, 255, 62, 0.2)",
            badgeTextColor: isDarkMode ? "#D4FF3E" : "#1a2e05",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqJN3HAX2DXPNYW9hlMZ3inCXa3tYAAcChqenT5U8UnuDjwagBgyAcRCMSwOlrbWomlnte3R8rvk00qaOBoLlF_h-o0qNqLaZE3J-bOiMKKik9Qqy5uDZLjcoEU6jHTGfqv2dTBZ_Ec4r_WyaMaYcEwsrhGnfn6ltJO7G6ZlJUoPW9hTcCweSemUmmHclHdmotUUdIr0anzsn7-MQzA6l58eK1JE43HgJId5drMo8W0ImHNwEL1R5Bm0A2-tuccBf-VDa-eUyR-iNn"
        },
        {
            id: '2',
            title: "Striker Jersey '25",
            subtitle: "Dri-Fit Technology",
            price: "$85",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWG71gzvOoDrQOXZssaDZwZGnzBRsFRk6zBX82fKCkCDpBhlJTe0kk3UzGXLOzeSFqftiYRyT-1_UhRZilDoZOlA6rbe3lp6vO29qUBn0dFhZi6sMH8vuJWm6GEIPVkESmuwF7S3kqBKCwHbaBVGkrzYj2Vb24W7KYzYHemJsN-Xeml7URzlblU6cJ78fb-TmJDyk5D1hJJYMpdSPtWm3Pk-2SpUhFBdM4gvtxPXT3DyzWUxcFpI9-8jEke8hQGU7pJFpz7FO5rLts"
        },
        {
            id: '3',
            title: "Grip Control GK",
            subtitle: "Pro Grade Latex",
            price: "$120",
            originalPrice: "$150",
            badge: "-20%",
            badgeColor: "#EF4444",
            badgeTextColor: "white",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS2pXU4clKkSdAurgJS5l_ydvJOGUGiWkxiK_i-lf6u5GHdfcSJPQVJxBBPx6aD7eZnGwIJ6boKAFdRE7O4KozFw_GcVUVrODBzREszirkURUYibjO1_PnaIgVSSjA2j5f_BctTaWBcSB9_sxmgbze4vA3XUyEYsBCWXfDeqwlIS2t93VOvnoeJgEuqOh5K6D3L1JPZd-JE5NBvedwfb-v7WFiG11w6bAGlJNZ3LJO3B5NjuIWGN5ukzb4kbI6vGsWdhOh_U7PpvYq"
        },
        {
            id: '4',
            title: "Match Ball '25",
            subtitle: "FIFA Quality Pro",
            price: "$160",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC30ysmCIbGQxkdI8Xsl8OKARO3tmgquPtjVZ3kNEFeJbNLzYvUfkWLAXL0Nycjh_CyRQijreX9szKWwBvlIGNuypdpomecBFJXOS_I0bB9HL0SExmFsGQCBWJbJKhx72lJRnQkHpv3jT1VOSp8WwBeZ0LouxawxdW6fj7GAUP6oUAjf1cQU6pZ9-jLVXsYOKz26Kh4yIiAk1QBolIWifp-StCh1LaewvcB6Xk2ygg_NbU5hLz5xgl6a4YB3wWOLyby0Yp1HQSzvteW"
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
                                borderColor: isDarkMode ? '#374151' : '#F3F4F6',
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {item.badge && (
                            <View style={[
                                styles.badge,
                                { backgroundColor: item.badgeColor }
                            ]}>
                                <Text style={[styles.badgeText, { color: item.badgeTextColor }]}>
                                    {item.badge}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.favButton}>
                            <MaterialIcons name="favorite-border" size={18} color="#9CA3AF" />
                        </TouchableOpacity>

                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' }]}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.content}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.title,
                                    { color: isDarkMode ? colors.textMainDark : colors.textMainLight }
                                ]}
                            >
                                {item.title}
                            </Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>

                            <View style={styles.footer}>
                                <View style={styles.priceCol}>
                                    <Text style={[styles.price, { color: isDarkMode ? 'white' : '#111827' }]}>
                                        {item.price}
                                    </Text>
                                    {item.originalPrice && (
                                        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    )}
                                </View>
                                <TouchableOpacity style={[
                                    styles.addButton,
                                    {
                                        backgroundColor: item.id === '1' ? colors.primary : (isDarkMode ? '#374151' : '#F3F4F6'),
                                        shadowColor: item.id === '1' ? colors.primary : 'transparent',
                                        shadowOpacity: item.id === '1' ? 0.4 : 0,
                                        shadowRadius: 10,
                                    }
                                ]}>
                                    <MaterialIcons
                                        name="add"
                                        size={18}
                                        color={item.id === '1' ? colors.tertiary : (isDarkMode ? 'white' : '#111827')}
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
        marginTop: 16,
        paddingHorizontal: PADDING,
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
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    badge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        zIndex: 10,
        backdropFilter: 'blur(4px)', // simulating backdrop blur
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
        borderRadius: 12,
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
        paddingHorizontal: 0,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12, // xs
        color: '#9CA3AF',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceCol: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default GameDayGrid;
