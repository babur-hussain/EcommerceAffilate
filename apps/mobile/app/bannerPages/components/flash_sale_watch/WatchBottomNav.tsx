
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

const WatchBottomNav = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#D32F2F",
        gold500: "#FFD700",
        bgWhite: "#FFFFFF",
        bgDark: "#121212",
        borderLight: "#E5E7EB",
        borderDark: "#1F2937",
        textGray: "#9CA3AF", // gray-400
        textDark: "#111827", // gray-900
        textWhite: "#FFFFFF",
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "search", label: "Search", route: "/search" },
        { icon: "local-offer", label: "", route: "/deals", isCenter: true },
        { icon: "favorite", label: "Saved", route: "/wishlist" },
        { icon: "person", label: "Profile", route: "/profile" },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDarkMode ? colors.bgDark : colors.bgWhite,
                borderTopColor: isDarkMode ? colors.borderDark : colors.borderLight
            }
        ]}>
            <View style={styles.navContent}>
                {navItems.map((item, index) => {
                    const isCenter = item.isCenter;
                    if (isCenter) {
                        return (
                            <View key={index} style={styles.centerButtonWrapper}>
                                <TouchableOpacity
                                    style={[
                                        styles.centerButton,
                                        {
                                            backgroundColor: colors.gold500,
                                            borderColor: isDarkMode ? '#121212' : 'white',
                                            shadowColor: '#EAB308' // yellow-500
                                        }
                                    ]}
                                    activeOpacity={0.9}
                                    onPress={() => router.push(item.route as Href)}
                                >
                                    <MaterialIcons name={item.icon as any} size={28} color="black" />
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.navItem}
                            onPress={() => item.route !== "/" ? router.push(item.route as Href) : null}
                        >
                            <MaterialIcons
                                name={item.icon as any}
                                size={24}
                                color={isDarkMode ? (item.label === "Home" ? colors.primary : colors.textGray) : (item.label === "Home" ? colors.primary : colors.textGray)}
                            />
                            {/* Hover effect simulation logic omitted for simplicity, sticking to active/inactive states based on index or props if passed */}
                            <Text style={[
                                styles.navLabel,
                                {
                                    color: isDarkMode
                                        ? (item.label === "Home" ? colors.primary : colors.textGray)
                                        : (item.label === "Home" ? colors.primary : colors.textGray)
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
    },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
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
        top: -30,
    },
    centerButton: {
        width: 56, // w-14
        height: 56, // h-14
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
});

export default WatchBottomNav;
