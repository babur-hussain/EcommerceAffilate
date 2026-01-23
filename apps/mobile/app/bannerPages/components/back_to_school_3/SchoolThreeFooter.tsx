
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

const SchoolThreeFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#FF8C42", // Orange
        secondary: "#007ea7", // Teal
        cardLight: "#FFFFFF",
        cardDark: "#1E1E1E",
        textInactive: "#9CA3AF",
    };

    const navItems = [
        { icon: "home", label: "Shop", route: "/" },
        { icon: "category", label: "Categories", route: "/catalog" },
        { icon: "shopping-bag", label: "", route: "/cart", isCenter: true },
        { icon: "favorite", label: "Saved", route: "/wishlist" },
        { icon: "person", label: "Profile", route: "/profile" },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
                borderTopColor: isDarkMode ? '#333' : '#F3F4F6'
            }
        ]}>
            <View style={styles.navContent}>
                {navItems.map((item, index) => {
                    const isCenter = item.isCenter;
                    if (isCenter) {
                        return (
                            <View key={index} style={styles.centerButtonWrapper}>
                                <TouchableOpacity
                                    style={[styles.centerButton, { backgroundColor: colors.primary }]}
                                    activeOpacity={0.9}
                                    onPress={() => router.push(item.route as Href)}
                                >
                                    <MaterialIcons name={item.icon as any} size={28} color="white" />
                                </TouchableOpacity>
                                <View style={[
                                    styles.badge,
                                    { borderColor: isDarkMode ? colors.cardDark : colors.cardLight }
                                ]}>
                                    <Text style={styles.badgeText}>2</Text>
                                </View>
                            </View>
                        );
                    }

                    const isActive = index === 0;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.navItem}
                            onPress={() => item.route !== "/" ? router.push(item.route as Href) : null}
                        >
                            <MaterialIcons
                                name={item.icon as any}
                                size={28}
                                color={isActive ? colors.primary : colors.textInactive}
                            />
                            <Text style={[
                                styles.navLabel,
                                { color: isActive ? colors.primary : colors.textInactive }
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
        paddingTop: 12,
        paddingBottom: 24, // Safe area
        position: 'absolute',
        bottom: 0,
        zIndex: 50,
        borderTopWidth: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 10,
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
        fontWeight: 'bold',
    },
    centerButtonWrapper: {
        position: 'relative',
        top: -32,
        height: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
    },
    centerButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#EF4444',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default SchoolThreeFooter;
