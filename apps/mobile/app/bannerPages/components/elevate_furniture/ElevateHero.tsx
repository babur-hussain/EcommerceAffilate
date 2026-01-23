
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const SPACER_WIDTH = (width - CARD_WIDTH) / 2;

const ElevateHero = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#111111", // Deep Charcoal
        bgLight: "#F2F1EE",
        bgDark: "#121212",
        textLight: "#111111",
        textDark: "#FFFFFF",
        accentSage: "#9CC4B8",
        accentSalmon: "#F0AC96",
    };

    const items = data?.items || [
        {
            id: '1',
            title: "Minimalist Grey",
            badge: "Best Seller",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUbNZ5aX7gf7v1HR3oLfdajhtsK25289qjvRAR8S70MjKdGXeRYv8ubYf2o1_aM5pOL2bnyEYWlu5Mr-aH6_zNgdqGmKQnnjWEtjt3rt-YOBupf-p03nVICyjFDVVJ5z2QMvxnKmSEUOpZkbw3wzFU6WmU6yalmSMm_sGmNqbYESLQsUFldZsWRNjbFuB3VWvtdwDbopRQhXmONyf8W5v_fQuQXnckR9IbO0k-l_tHSzqEloQGzbSfKKuXBUGGyHnXpwdFChpB9iW9",
            bgColor: isDarkMode ? '#374151' : '#FFFFFF',
        },
        {
            id: '2',
            title: "Velvet Sage",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzyWQ8HAJ5QABlnGcVYIE6s-kMxZfOFhnpZV3K7N5AReVNbSCYPJwatSW1-f9WiHJ9Bz2YgkUxfuD0Hdw3HQzkJL4R90VIaPKX87rLgmBUjGwKl0xNmoFApNcjlOTiJ8-NHOmdZ3z0N7r-hOcdou0FhCNWatb1d9gRgcp4C8b6_907wAzofdx04keRSpPfzikITXJhPxdEw-IgH56T2SEyCSOvE7VN6gjHwfwnebgwIrU9ROuCDfckq48bAXuADHMwfVX9n3dBkAUx",
            bgColor: colors.accentSage,
            isDarkText: false,
        },
        {
            id: '3',
            title: "Sunset Lounge",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP_sUVx9UvbDls5FkjjlRYhZd_g48CNqpCjtp0Pb8P1XxJ6kOZBHPS_fzbIvffr97fnvHpOFWnMLncwE5vXSfAvKUgsyi6KgAwDfoShh2N2Lwnz8cORrWHy7eNviElDi12X_DCjMJChTzCMrGobaUL5loKbhRXh85VytdgRpZFQiwf5R-SbNBb3AvOkHxuGXwRGcN5-28vVE8i9e3CtRWwirHryjWDMEw2-Y0uwrX_XVfz83CnBkTy9udyqEKZ_s9BmlsNHoYTq8C_",
            bgColor: colors.accentSalmon,
            isDarkText: false,
        }
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 16} // card + gap
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
            >
                {items.map((item: any) => (
                    <View key={item.id} style={[styles.card, { backgroundColor: item.bgColor }]}>
                        {/* Gradient Overlay */}
                        <LinearGradient
                            colors={['rgba(255,255,255,0.2)', 'rgba(0,0,0,0.05)']}
                            style={styles.gradient}
                        />

                        <Image
                            source={{ uri: item.image }}
                            style={styles.image}
                            resizeMode="contain"
                        />

                        <View style={styles.footer}>
                            {item.badge && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            )}
                            <Text style={[
                                styles.title,
                                { color: item.isDarkText !== false ? colors.primary : 'white' }
                            ]}>
                                {item.title}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 48,
    },
    scrollContent: {
        paddingHorizontal: 24,
        gap: 16,
    },
    card: {
        width: CARD_WIDTH,
        height: 400,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 5,
    },
    gradient: {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
    },
    image: {
        width: '100%',
        height: '100%',
        padding: 32,
        zIndex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        zIndex: 2,
    },
    badge: {
        backgroundColor: '#111111',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        marginBottom: 8,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        // fontFamily: 'Oswald'
    },
});

export default ElevateHero;
