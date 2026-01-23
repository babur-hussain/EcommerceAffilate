
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
// import { BlurView } from 'expo-blur'; // removed to avoid extra dependencies check, using opacity fallback

const { width } = Dimensions.get('window');

const NewFurnitureFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#593E2E", // Dark Brown
        secondary: "#CBB6A4", // Tan
        bgLight: "rgba(255, 255, 255, 0.95)",
        bgDark: "rgba(41, 37, 36, 0.95)", // surface-dark
        borderLight: "#F3F4F6", // gray-100
        borderDark: "#1F2937", // gray-800
        textGray: "#9CA3AF", // gray-400
        textGrayDark: "#6B7280", // gray-500
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "search", label: "Search", route: "/search" },
        { icon: "grid-view", label: "Catalog", route: "/catalog" },
        { icon: "person-outline", label: "Profile", route: "/profile" },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight,
                borderTopColor: isDarkMode ? colors.borderDark : colors.borderLight,
            }
        ]}>
            <View style={styles.navContent}>
                {navItems.map((item, index) => {
                    const isActive = index === 0; // Hardcoded active state for Home
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.navItem}
                            onPress={() => item.route !== "/" ? router.push(item.route as Href) : null}
                        >
                            <MaterialIcons
                                name={item.icon as any}
                                size={24}
                                color={isActive
                                    ? (isDarkMode ? colors.secondary : colors.primary)
                                    : (isDarkMode ? colors.textGrayDark : colors.textGray)
                                }
                            />
                            <Text style={[
                                styles.navLabel,
                                {
                                    color: isActive
                                        ? (isDarkMode ? colors.secondary : colors.primary)
                                        : (isDarkMode ? colors.textGrayDark : colors.textGray)
                                }
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderTopWidth: 1,
        paddingTop: 16,
        paddingBottom: 24, // Safe area
        position: 'absolute',
        bottom: 0,
        zIndex: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    navLabel: {
        fontSize: 10,
        fontWeight: '500',
    },
});

export default NewFurnitureFooter;
