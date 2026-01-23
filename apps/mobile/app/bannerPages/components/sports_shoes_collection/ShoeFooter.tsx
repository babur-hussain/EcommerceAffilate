
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

const ShoeFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#BE3A3B", // Red
        bgLight: "#FFFFFF",
        bgDark: "#111827",
        textInactive: "#9CA3AF",
        textActive: "#BE3A3B",
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "favorite-border", label: "Wishlist", route: "/wishlist" },
        { icon: "shopping-cart", label: "", route: "/cart", isCenter: true },
        { icon: "receipt", label: "Orders", route: "/orders" }, // Map receipt_long to receipt
        { icon: "person-outline", label: "Profile", route: "/profile" },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight,
                borderTopColor: isDarkMode ? '#1F2937' : '#E5E7EB'
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
                                        { backgroundColor: isDarkMode ? 'white' : '#111827' }
                                    ]}
                                    activeOpacity={0.9}
                                    onPress={() => router.push(item.route as Href)}
                                >
                                    <MaterialIcons
                                        name={item.icon as any}
                                        size={24}
                                        color={isDarkMode ? '#111827' : 'white'}
                                    />
                                </TouchableOpacity>
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
                                size={24}
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
        shadowColor: 'rgba(0,0,0,0.02)',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 10,
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
        height: 0,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default ShoeFooter;
