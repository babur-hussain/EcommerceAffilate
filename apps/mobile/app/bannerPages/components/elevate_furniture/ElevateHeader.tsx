
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ElevateHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#111111", // Deep Charcoal
        bgLight: "#F2F1EE", // Warm off-white
        bgDark: "#121212",
        textLight: "#111111",
        textDark: "#FFFFFF",
        accentSalmon: "#F0AC96",
        textGrayLight: "#4B5563", // gray-600
        textGrayDark: "#D1D5DB", // gray-300
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight }]}>
            {/* Navbar */}
            <View style={[styles.navbar, { borderBottomColor: isDarkMode ? '#1F2937' : '#E5E7EB' }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="menu" size={28} color={isDarkMode ? colors.textDark : colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.brand, { color: isDarkMode ? colors.textDark : colors.primary }]}>LIVING SPACE</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="shopping-bag" size={28} color={isDarkMode ? colors.textDark : colors.primary} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            {/* Header Text Content */}
            <View style={styles.content}>
                <Text style={[styles.mainTitle, { color: isDarkMode ? colors.textDark : colors.primary }]}>
                    ELEVATE{'\n'}YOUR LIVING{'\n'}SPACE
                </Text>
                <Text style={[styles.description, { color: isDarkMode ? colors.textGrayDark : colors.textGrayLight }]}>
                    Explore our latest assortment of modern and high-quality chairs, a perfect addition to your room.
                </Text>

                <View style={styles.discountWrapper}>
                    <Text style={[styles.discountLabel, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>SPECIAL DISCOUNT</Text>
                    <View style={[styles.discountValueWrapper, { borderBottomColor: colors.accentSalmon }]}>
                        <Text style={[styles.discountValue, { color: isDarkMode ? colors.textDark : colors.primary }]}>UP TO 50% OFF!</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 24,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 50, // Safe area
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    iconBtn: {
        padding: 4,
    },
    brand: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2,
        // fontFamily: 'Oswald' (simulated with bold/tracking)
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 0,
        width: 10,
        height: 10,
        backgroundColor: '#EF4444',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#F2F1EE', // Match bg
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    mainTitle: {
        fontSize: 48, // text-6xl ~ 60px, but 48 safer for mobile
        fontWeight: 'bold',
        lineHeight: 48,
        letterSpacing: -1,
        marginBottom: 24,
        textTransform: 'uppercase',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
        marginBottom: 32,
        maxWidth: 300,
    },
    discountWrapper: {
        alignItems: 'flex-start',
    },
    discountLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    discountValueWrapper: {
        borderBottomWidth: 4,
        paddingBottom: 4,
    },
    discountValue: {
        fontSize: 30, // text-4xl
        fontWeight: 'bold',
    },
});

export default ElevateHeader;
