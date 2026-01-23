
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

const SpecialFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#C62828", // Deep Red
        surfaceLight: "#FFFFFF",
        surfaceDark: "#171717",
        textInactive: "#9CA3AF",
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "search", label: "Search", route: "/catalog" },
        { icon: "bolt", label: "", route: "/cart", isCenter: true },
        { icon: "favorite", label: "Saved", route: "/wishlist" },
        { icon: "person", label: "Profile", route: "/profile" },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDarkMode ? colors.surfaceDark : colors.surfaceLight,
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
                                        { backgroundColor: isDarkMode ? 'white' : 'black' }
                                    ]}
                                    activeOpacity={0.9}
                                    onPress={() => router.push(item.route as Href)}
                                >
                                    <MaterialIcons
                                        name={item.icon as any}
                                        size={28}
                                        color={isDarkMode ? 'black' : 'white'}
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
        paddingTop: 8,
        paddingBottom: 24, // Safe area
        position: 'absolute',
        bottom: 0,
        zIndex: 50,
        borderTopWidth: 1,
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 15,
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
        fontWeight: 'bold',
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

export default SpecialFooter;
