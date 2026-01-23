
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

const ElevateFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#111111", // Deep Charcoal
        bgLight: "#FFFFFF", // surface-light
        bgDark: "#1E1E1E", // surface-dark
        borderLight: "#E5E7EB", // gray-200
        borderDark: "#1F2937", // gray-800
        textGray: "#9CA3AF", // gray-400
        textWhite: "#FFFFFF",
    };

    const navItems = [
        { icon: "home", label: "", route: "/" },
        { icon: "search", label: "", route: "/search" },
        { icon: "favorite-border", label: "", route: "/wishlist" },
        { icon: "person-outline", label: "", route: "/profile" },
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
                    // Simulating first item active as per design (Home is dark, others gray)
                    const isActive = index === 0;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.navItem}
                            onPress={() => item.route !== "/" ? router.push(item.route as Href) : null}
                        >
                            <MaterialIcons
                                name={item.icon as any}
                                size={28} // text-2xl
                                color={isActive
                                    ? (isDarkMode ? colors.textWhite : colors.primary)
                                    : colors.textGray
                                }
                            />
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
        paddingVertical: 16,
        paddingBottom: 24, // Safe area
        position: 'absolute',
        bottom: 0,
        zIndex: 50,
    },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
});

export default ElevateFooter;
