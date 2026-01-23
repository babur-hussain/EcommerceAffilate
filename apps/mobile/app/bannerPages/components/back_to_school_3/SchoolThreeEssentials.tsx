
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SchoolThreeEssentials = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#FF8C42", // Orange
        secondary: "#007ea7", // Teal
        accent: "#FDE74C", // Yellow
        cardLight: "#FFFFFF",
        cardDark: "#1E1E1E",
        textLight: "#333333",
        textDark: "#E5E5E5",
    };

    const essentials = [
        {
            id: '1',
            title: "Spiral Notebooks (3 Pack)",
            subtitle: "College Ruled, 120 Pages",
            rating: 4,
            reviews: 42,
            price: "$15.00",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRjIDyZaq2P-gYqnlZDpUjgOq0JdurFTMoj2Y_4zYEAiQqHSFwrgxofCPBUvuQ0lMjF82xjb7cuMmfxm9-l0HTuVWhgir-cbOJQFuDbSBt618GDL-ZUdl1uFBRa7lraoqGifRu_ehvBY6n4rGuyp-_SW2u09cdcpYDcvdXRAOOpoW1EjZs07z2VWNKFnrRka6IZzMs-9XoyO3v-nMQ-p1W6Vp5sXF-eDhr8mZYtoZM7rX10sTz3TgVTN6dHJL1lHvs1vyvDHO6iCPA"
        },
        {
            id: '2',
            title: "Neon Highlighters",
            subtitle: "Smear-safe protection",
            rating: 4.5,
            reviews: 18,
            price: "$5.99",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6BKtwlOZVZZv9oM8QSBpooeaVJYNet1spSTOPsQT5NL-scfZB35fasL-xGCqg_HPzGVWJsnPWMYbe1mkhT8p4N5zzcf_R2cGh7OUStdJOgl7SlgzqD5jJbt7WWXKJoWxzGX03QL4OoBxd4rsuyaXkv7jLv3tLIFO1VrdH2pX1SjSb6gVHmTGF4YwnYRQalzwCaMKyIK433pFxQfeDj89DXqH0nlw_quW988tj6NGgMkGeDL7v0oZjZGrMoGQEYzFwiNoaqZTZgzb1"
        }
    ];

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<MaterialIcons key={i} name="star" size={14} color={colors.accent} />);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars.push(<MaterialIcons key={i} name="star-half" size={14} color={colors.accent} />);
            } else {
                stars.push(<MaterialIcons key={i} name="star" size={14} color="#D1D5DB" />);
            }
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.accent : colors.secondary }]}>
                    Essential Gear
                </Text>
            </View>

            <View style={styles.list}>
                {essentials.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.card,
                            { backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight }
                        ]}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#333' : '#F3F4F6' }]}>
                            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                        </View>

                        <View style={styles.content}>
                            <Text style={[styles.title, { color: isDarkMode ? colors.textDark : colors.textLight }]}>
                                {item.title}
                            </Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                            <View style={styles.ratingRow}>
                                {renderStars(item.rating)}
                                <Text style={styles.reviewCount}>({item.reviews})</Text>
                            </View>
                        </View>

                        <View style={styles.action}>
                            <Text style={[styles.price, { color: isDarkMode ? colors.accent : colors.secondary }]}>
                                {item.price}
                            </Text>
                            <TouchableOpacity>
                                <MaterialIcons name="add-shopping-cart" size={24} color={colors.primary} />
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
        marginTop: 32,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    headerRow: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    list: {
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewCount: {
        fontSize: 12,
        color: '#9CA3AF',
        marginLeft: 4,
    },
    action: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '100%',
        paddingVertical: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '900',
    },
});

export default SchoolThreeEssentials;
