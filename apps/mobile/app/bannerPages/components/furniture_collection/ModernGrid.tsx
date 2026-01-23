
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 20; // gap-5
const PADDING = 24; // px-6
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const ModernGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors (LUSSO)
    const colors = {
        primary: "#9F6B08",
        surfaceLight: "#FFFFFF",
        surfaceDark: "#292524",
        textMainLight: "#4A3B32", // Deep Brown
        textMainDark: "#FFFFFF",
        textSubLight: "#8D7B6F",
        textSubDark: "#A8A29E",
        bgImageLight: "#F5F5F4", // stone-100
        bgImageDark: "#292524", // stone-800
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Lounge Chair",
            subtitle: "Grey Fabric",
            price: "$120.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKzYUpN4uKBExp76PBGdFvxSjxiNkdHOFQ4zYWh2JZL5kH6G_CUwLGCw5JoZ9MJPU4l84CBfaOyAqT1NqKWyQayoxxnyiXjYF-B5-EDV5zpGooCLLbOEE56OfVJNubo5Iv2DbinE-nUaAeXxsfs55KCQIN0M20glLoK-aZuyKph2IMMTjS0DncRbtR9OpL6SyzYVL7qY-GlPk9Jost6ytNxkGQ4VoEWWIFj74nCczE2duyiJKOoPizRi2Fueu4b3CMdmu3QQfjmtij"
        },
        {
            id: '2',
            title: "Minimal Lamp",
            subtitle: "Brass Finish",
            price: "$85.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC797HoaClxX8PEKea9iHg-qXInR5yKkpnhptnjSeAWUIydFL3-cvczMnkehcgeXCooMSkOqcLE9Ne4EA9xDE7eE0BslZSN0Gh6e9Pw_I67Grp-NnNPeKsY4gom72I5u87-zeOLCSJTqPXwdhQgXxPUqlQIWTVY7aaKeeUU2bhIKv81IW1ddTmwRkzzGz7XYy90GMeRFqLikWvk4_j5pSRpBKmcfWUn_qMqPjyOtiH4fdLm9CPTQL9L1i2T5JJBQnIiablmN92i9Gve",
            staggered: true // Second column items pushed down
        },
        {
            id: '3',
            title: "Oak Table",
            subtitle: "Natural Wood",
            price: "$150.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiGnq0Ti8mJziO7eAxNyZWgNfXiT6BG1V7IzRdYO4-AnxM5n3HJgIHnmlouovV5blIPsnNTBqilPya0SOrRjBxoeHPXcyIjIEtlVZOi8bEUQTjboRyIMi3iZmCmJ6L6XwTd4Ev3ICnt5_pc071zbdFRiz2UT-jvP_EvftqunKoW0Gf3VTAADBCafSQb93WaL7tt2_7sAfxqoBcbLYWdIUFyWb119dVcvDK3h6xhO2NFkxrIoukr1DRgnB1DCr-qQT-JhLjY9PqHVaO"
        },
        {
            id: '4',
            title: "Velvet Cushion",
            subtitle: "Teal Blue",
            price: "$35.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2YdtvViW8GyylBO7KsYNHkmdVY94CIwrfm9Skjh58_oJXQAsz6hsFhBHoqQ9UUn5xxBJ5ycfOh3DkcMTXvDSKG7A5vy1Ec09ZwKI69ZmUtU-T95M5xhz4pZDxqhM7sUQgyyKnpt1Q7-PwEszbfwCjDmBXTQmPPAEgnXMF6P2IMqo7GQaLhO63Olh8PRFOGuBgGCSLzvKSjK0njVvk6Mt_sj_wlqYGEMbGHEJ0b4ZkM4aUJiE9ImdApTT43Hfr07nylguh2yTC5YvC",
            staggered: true
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.heading, { color: isDarkMode ? 'white' : colors.textMainLight }]}>
                    Popular Finds
                </Text>
                <TouchableOpacity>
                    <Text style={[styles.viewAll, { color: colors.primary }]}>VIEW ALL</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {products.map((item: any, index: number) => {
                    // Stagger logic: every 2nd item (index 1, 3...) gets extra top margin
                    const isRightColumn = index % 2 !== 0;

                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.cardWrapper,
                                {
                                    marginTop: isRightColumn ? 24 : 0,
                                }
                            ]}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/product/${item.id}`)}
                        >
                            <View style={[
                                styles.imageCard,
                                {
                                    backgroundColor: isDarkMode ? colors.surfaceDark : colors.surfaceLight,
                                    shadowColor: isDarkMode ? 'transparent' : 'rgba(0,0,0,0.08)',
                                    borderColor: isDarkMode ? '#292524' : 'transparent',
                                }
                            ]}>
                                <TouchableOpacity style={[
                                    styles.favBtn,
                                    { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)' }
                                ]}>
                                    <MaterialIcons name="favorite" size={14} color={isDarkMode ? '#A8A29E' : '#A8A29E'} />
                                </TouchableOpacity>

                                <View style={[
                                    styles.imageContainer,
                                    { backgroundColor: isDarkMode ? colors.bgImageDark : colors.bgImageLight }
                                ]}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                </View>
                            </View>

                            <View style={styles.info}>
                                <Text
                                    style={[
                                        styles.title,
                                        { color: isDarkMode ? 'white' : colors.textMainLight }
                                    ]}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                <Text style={[
                                    styles.subtitle,
                                    { color: isDarkMode ? colors.textSubDark : colors.textSubLight }
                                ]}>
                                    {item.subtitle}
                                </Text>
                                <Text style={[styles.price, { color: colors.primary }]}>
                                    {item.price}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PADDING,
        paddingBottom: 48,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 24,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'serif',
    },
    viewAll: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // key for staggering
    },
    cardWrapper: {
        width: CARD_WIDTH,
        marginBottom: 12,
    },
    imageCard: {
        borderRadius: 16,
        padding: 12, // p-3
        marginBottom: 12,
        position: 'relative',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1, // handled by shadowColor
        shadowRadius: 40,
        elevation: 2,
    },
    favBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 0.8, // aspect-[4/5]
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    info: {
        paddingLeft: 4,
    },
    title: {
        fontSize: 18,
        fontFamily: 'serif',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ModernGrid;
