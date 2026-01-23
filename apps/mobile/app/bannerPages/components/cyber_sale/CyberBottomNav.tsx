
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

const CyberBottomNav = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#D9242C",
        secondary: "#FFCB05",
        bgLight: "#FFFFFF",
        bgDark: "#111827", // gray-900
        textLight: "#9CA3AF", // gray-400
        textDark: "#6B7280", // gray-500
        activeTextLight: "#000000",
        activeTextDark: "#FFFFFF",
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "search", label: "Search", route: "/search" },
        { icon: "local-offer", label: "Deals", route: "/deals", isCenter: true },
        { icon: "favorite-border", label: "Saved", route: "/wishlist" },
        { icon: "person-outline", label: "Profile", route: "/profile" },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight,
                borderTopColor: 'black'
            }
        ]}>
            <View style={styles.navContent}>
                {navItems.map((item, index) => {
                    const isCenter = item.isCenter;
                    if (isCenter) {
                        return (
                            <View key={index} style={styles.centerButtonWrapper}>
                                <TouchableOpacity
                                    style={[styles.centerButton, { backgroundColor: colors.secondary, borderColor: 'black' }]}
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
                                size={28}
                                color={index === 0
                                    ? colors.primary
                                    : (isDarkMode ? colors.textDark : colors.textLight)
                                }
                            />
                            <Text style={[
                                styles.navLabel,
                                {
                                    color: index === 0
                                        ? colors.primary
                                        : (isDarkMode ? colors.textDark : colors.textLight)
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
        borderTopWidth: 2,
        paddingTop: 12,
        paddingBottom: 32, // Safe area
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
    },
    navLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
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
        borderWidth: 2,
        // Pop shadow
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
    },
});

export default CyberBottomNav;
