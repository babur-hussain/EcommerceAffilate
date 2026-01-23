
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

const BigPromoFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#F59E0B",
        cardLight: "#FFFFFF",
        cardDark: "#0F172A", // Slate-900 per design for footer bg
        textLight: "#9CA3AF", // gray-400
        textDark: "#64748B", // slate-500
        activeLight: "#F59E0B",
        activeDark: "#F59E0B",
        borderColorLight: "#E5E7EB",
        borderColorDark: "#1E293B",
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "category", label: "Catalog", route: "/catalog" },
        { icon: "shopping-bag", label: "Cart", route: "/cart", isCenter: true },
        { icon: "favorite", label: "Saved", route: "/wishlist" },
        { icon: "person", label: "Profile", route: "/profile" },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
                borderTopColor: isDarkMode ? colors.borderColorDark : colors.borderColorLight
            }
        ]}>
            <View style={styles.navContent}>
                {navItems.map((item, index) => {
                    const isCenter = item.isCenter;
                    if (isCenter) {
                        return (
                            <View key={index} style={styles.centerButtonWrapper}>
                                <TouchableOpacity
                                    style={[styles.centerButton, { backgroundColor: colors.primary, borderColor: isDarkMode ? '#0F172A' : '#FFFFFF' }]}
                                    activeOpacity={0.9}
                                    onPress={() => router.push(item.route as Href)}
                                >
                                    <MaterialIcons name={item.icon as any} size={28} color="white" />
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
        borderTopWidth: 1,
        paddingTop: 12,
        paddingBottom: 32, // Safe area
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        position: 'absolute',
        bottom: 0,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
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
        borderWidth: 4,
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
});

export default BigPromoFooter;
