
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

const ModernBottomNav = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#ECC646", // Yellow
        secondary: "#111111", // Black
        bgLight: "#FFFFFF",
        bgDark: "#1E1E1E",
        borderLight: "#F3F4F6", // gray-100
        borderDark: "#374151", // gray-700
        textGray: "#9CA3AF", // gray-400
        textGrayDark: "#6B7280", // gray-500
        textActiveLight: "#111827",
        textActiveDark: "#E5E7EB",
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "grid-view", label: "Catalog", route: "/catalog" },
        { icon: "shopping-bag", label: "", route: "/cart", isCenter: true },
        { icon: "favorite", label: "Saved", route: "/wishlist" },
        { icon: "person", label: "Profile", route: "/profile" },
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
                    const isCenter = item.isCenter;
                    if (isCenter) {
                        return (
                            <View key={index} style={styles.centerButtonWrapper}>
                                <TouchableOpacity
                                    style={[
                                        styles.centerButton,
                                        {
                                            backgroundColor: colors.secondary,
                                            borderColor: isDarkMode ? colors.bgDark : 'white', // border-4
                                            shadowColor: '#000',
                                        }
                                    ]}
                                    activeOpacity={0.9}
                                    onPress={() => router.push(item.route as Href)}
                                >
                                    <MaterialIcons name={item.icon as any} size={28} color={colors.primary} />
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
                                    : (isDarkMode ? colors.textGrayDark : colors.textGray)
                                }
                            />
                            <Text style={[
                                styles.navLabel,
                                {
                                    color: index === 0
                                        ? colors.secondary // In light mode this should be blackish, wait design says text-primary for active home?
                                        // Design says text-primary for Home icon, text matches.
                                        // Let's stick strictly to design class if possible.
                                        // "text-primary" in design refers to yellow.
                                        : (isDarkMode ? colors.textGrayDark : colors.textGray)
                                },
                                index === 0 && { color: colors.primary }
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
        paddingTop: 12,
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
        // gap: 4, simulated via margin
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
        width: 64, // p-4 ~ 64px total? design has p-4 rounded-full. default icon 24. 24+32=56.
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
});

export default ModernBottomNav;
