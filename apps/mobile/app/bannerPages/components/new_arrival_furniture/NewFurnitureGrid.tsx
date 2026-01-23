
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const NewFurnitureGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#593E2E", // Dark Brown
        secondary: "#CBB6A4", // Tan
        bgLight: "#F7F4F0",
        bgDark: "#1C1917",
        surfaceLight: "#FFFFFF",
        surfaceDark: "#292524",
        textMain: "#593E2E",
        textWhite: "#FFFFFF",
        textGray: "#6B7280", // gray-500
        textGrayDark: "#9CA3AF", // gray-400
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Woven Lounge",
            collection: "Rattan Collection",
            price: "$249",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQWiiKrvcY6WygXK53r0DimSZQ4mVGErHct_OhHBtItDZsbKzS70s2nS6D_uuRkFbcmtp0NO1gJkZXg4vbQoQnqidIdBJW_Vd7FUrzgC5wd9qbJpNGyDs3qLbDeeqzoMpAymPZTHXVXLMXnULK-KEXHAfKOuP6o0Kdnu3jji3RiNvCNAu-azx0ztJ_dT5cgAxGKST4XZEmMvCBIYFOB1Hsv67qEG2E7h5nJHZ9zNjYMZ01Jv8hrlQeYYmewHoahvUOXO4x2J4WmlVu"
        },
        {
            id: '2',
            title: "Clay Vase",
            collection: "Artisan Ceramics",
            price: "$85",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMkwNIawCu8Pf7UEWJ7JbPuC3oTtSQqdCcrnnA_y3it9J6JsDNn3K-d7ioi1hYLxM2YcysWViKDVkpw-Ztm2iraOIA8d-_sENUak1Ft7h7kj23XBLAFjU7fjuI2rQI5Mav4b7QZj6wqZbL9eClw0JGtppe6R1GK9-OomNw37A1GushX6RYMmHOP-bw4nUD2JQTwe3j3tIoOmfjljH4rm80yfgMn2jauEEAj_ezsTuBBR9YitQRrBA0osy8iAQdkONu5WR_o_htSX6m"
        },
        {
            id: '3',
            title: "Oak Side Table",
            collection: "Essential Wood",
            price: "$120",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7Mo8vr6SHBE3P3x5MeFOBXmQNav2sJtYfr3Obv-wryhttkdvSOIkV3xU1MN4n5S2m5OvEoCvXG7Qoq9mIYlSa5B1VL2qxKqu0Ji-rrBpmWVFVYQ8oMppgb8OAUcfO4cIkOhkMHWN6JtMkL89PEVFa6T-_VIG6s7veeQsOy2qhwUcYpVJOWRbQ5UwAZ7fGPQHHH9igLlz8USkC60zBzPsgEuwu3ld0HrdpOE-ZgBY2zIS8mOCbDWaDlKror9v5mpgM4ODMSvXpQN7Y"
        },
        {
            id: '4',
            title: "Linen Pillow",
            collection: "Soft Textiles",
            price: "$45",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgN7pIT_qc0VNvufuUCSUA3kD9OsjOcnAqF8zj3ihNhmwIwLHBon2P4M1zZCA4tl-bTiC6uc9QEMmQNwfqAW2Sbe6mVuzmoDGbmTg8BBGia5s5abSPaCNRJxEjvm4sYME1D6XyBlHc3BFbTpfBSrqxEAhSwnh7qZo-L-xjzta4ozNbnMzMxvY38Mtz95NLyUPzAA5mj4hktfV-oQ5Z6Ut7JQlSGrDeRA6G_nzri2LKrQ3k9g4-LcKV6DSYyRmnKY624gNxztEpFhrz"
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
                                backgroundColor: isDarkMode ? colors.surfaceDark : colors.surfaceLight,
                                shadowColor: '#000',
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
                            <TouchableOpacity style={[
                                styles.favButton,
                                { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)' }
                            ]}>
                                <MaterialIcons name="favorite-border" size={14} color={isDarkMode ? 'white' : colors.primary} />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text
                                numberOfLines={1}
                                style={[styles.title, { color: isDarkMode ? 'white' : colors.primary }]}
                            >
                                {item.title}
                            </Text>
                            <Text style={[styles.collection, { color: isDarkMode ? colors.textGrayDark : colors.textGray }]}>
                                {item.collection}
                            </Text>

                            <View style={styles.footer}>
                                <Text style={[styles.price, { color: isDarkMode ? colors.secondary : colors.primary }]}>{item.price}</Text>

                                <TouchableOpacity style={[
                                    styles.viewButton,
                                    { backgroundColor: isDarkMode ? 'rgba(203, 182, 164, 0.1)' : 'rgba(203, 182, 164, 0.2)' }
                                ]}>
                                    <Text style={[styles.viewText, { color: isDarkMode ? colors.secondary : colors.primary }]}>VIEW</Text>
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
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 12, // rounded-xl
        marginBottom: 16,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, // shadow-sm
        shadowRadius: 4,
        elevation: 2,
    },
    imageContainer: {
        height: 192, // h-48
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: 6,
        borderRadius: 999,
        backdropFilter: 'blur(4px)', // simulation mostly ignored on mobile unless using BlurView
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        marginBottom: 4,
    },
    collection: {
        fontSize: 12, // text-xs
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16, // text-base/semi-bold
        fontWeight: '600',
    },
    viewButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    viewText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default NewFurnitureGrid;
