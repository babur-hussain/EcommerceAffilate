
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

const BackToSchoolFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#F4B060", // Bright orange
        bgLight: "#FFFFFF", // paper-white
        bgDark: "#2D2D2D", // paper-dark
        borderLight: "#F3F4F6", // gray-100
        borderDark: "#1F2937", // gray-800
        textGray: "#9CA3AF", // gray-400
        textGrayDark: "#6B7280", // gray-500
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "grid-view", label: "Categories", route: "/catalog" },
        { icon: "shopping-cart", label: "", route: "/cart", isCenter: true },
        { icon: "favorite-border", label: "Saved", route: "/wishlist" },
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
                    const isCenter = item.isCenter;
                    if (isCenter) {
                        return (
                            <View key={index} style={styles.centerButtonWrapper}>
                                <TouchableOpacity
                                    style={[
                                        styles.centerButton,
                                        {
                                            backgroundColor: colors.primary,
                                            borderColor: isDarkMode ? colors.bgDark : colors.bgLight,
                                        }
                                    ]}
                                    activeOpacity={0.9}
                                    onPress={() => router.push(item.route as Href)}
                                >
                                    <MaterialIcons name={item.icon as any} size={28} color="white" />
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
                                size={26}
                                color={isActive
                                    ? colors.primary
                                    : (isDarkMode ? colors.textGrayDark : colors.textGray)
                                }
                            />
                            <Text style={[
                                styles.navLabel,
                                {
                                    color: isActive
                                        ? colors.primary
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
        paddingTop: 12,
        paddingBottom: 24, // Safe area
        position: 'absolute',
        bottom: 0,
        zIndex: 50,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
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
        fontWeight: '600',
    },
    centerButtonWrapper: {
        position: 'relative',
        top: -32,
    },
    centerButton: {
        width: 64, // w-16
        height: 64, // h-16
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4, // border-white/paper-dark
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, // shadow-lg
        shadowRadius: 8,
        elevation: 8,
    },
});

export default BackToSchoolFooter;
