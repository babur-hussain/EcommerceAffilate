
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

const SaleFeedFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#52665F", // Deep Green
        bgLight: "#FFFFFF", // card-light
        bgDark: "#1E2623", // card-dark
        borderLight: "#E5E7EB", // gray-200
        borderDark: "#1F2937", // gray-800
        textGray: "#9CA3AF", // gray-400
        textGrayDark: "#6B7280", // gray-500
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
                                            backgroundColor: colors.primary,
                                            // shadowColor: colors.primary,
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
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
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
        fontWeight: '600',
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, // shadow-lg via color
        shadowRadius: 8,
        elevation: 8,
    },
});

export default SaleFeedFooter;
