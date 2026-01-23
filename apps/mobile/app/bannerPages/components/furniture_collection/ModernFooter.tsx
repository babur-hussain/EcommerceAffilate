
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const ModernFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors (LUSSO)
    const colors = {
        primary: "#9F6B08",
        surfaceLight: "#FFFFFF",
        surfaceDark: "#292524", // Stone 800-ish
        textMainLight: "#4A3B32",
        textSubLight: "#A8A29E",
        textSubDark: "#78716C",
        stone100: "#F5F5F4",
        stone800: "#292524",
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "grid-view", label: "Catalog", route: "/catalog" },
        { icon: "search", label: "", route: "/search", isCenter: true }, // Search is now center
        { icon: "favorite-border", label: "Saved", route: "/wishlist" },
        { icon: "person-outline", label: "Profile", route: "/profile" },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDarkMode ? colors.surfaceDark : colors.surfaceLight,
                borderTopColor: isDarkMode ? colors.stone800 : colors.stone100,
                // Shadow match
                shadowColor: 'rgba(0,0,0,0.03)',
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
                                            backgroundColor: colors.primary,
                                            // Golden glow shadow
                                            shadowColor: colors.primary,
                                        }
                                    ]}
                                    activeOpacity={0.9}
                                    onPress={() => router.push(item.route as Href)}
                                >
                                    <MaterialIcons
                                        name={item.icon as any}
                                        size={28}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    // Hover effects simulated by active state logic logic if tracked, 
                    // for now static "Home" usually active or none. 
                    // Let's keep all inactive color except maybe Home if we tracked route.
                    // Design has Home as active-ish color (primary) or text-main.

                    const isActive = index === 0;
                    const iconColor = isActive ? colors.primary : (isDarkMode ? colors.textSubDark : colors.textSubLight);
                    const textColor = isActive ? colors.primary : (isDarkMode ? colors.textSubDark : colors.textSubLight);

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.navItem}
                            onPress={() => item.route !== "/" ? router.push(item.route as Href) : null}
                        >
                            <MaterialIcons
                                name={item.icon as any}
                                size={24}
                                color={iconColor}
                            />
                            <Text style={[
                                styles.navLabel,
                                { color: textColor }
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
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 10,
    },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        minWidth: 48,
    },
    navLabel: {
        fontSize: 10,
        fontWeight: '500',
    },
    centerButtonWrapper: {
        position: 'relative',
        top: -30,
        height: 0, // doesn't take space in row flow height
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
    },
    centerButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3, // glow
        shadowRadius: 20,
        elevation: 8,
    },
});

export default ModernFooter;
