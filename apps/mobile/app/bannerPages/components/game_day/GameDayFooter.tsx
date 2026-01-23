
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const GameDayFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#D4FF3E", // Lime
        tertiary: "#023E8A", // Deep Blue
        cardLight: "#F3F4F6", // Using slightly darker than pure white for footer in light mode per design
        cardDark: "#1F2937",
        textInactive: "#9CA3AF",
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "grid-view", label: "Shop", route: "/catalog" },
        { icon: "sports-soccer", label: "", route: "/cart", isCenter: true },
        { icon: "favorite-border", label: "Saved", route: "/wishlist" },
        { icon: "person-outline", label: "Profile", route: "/profile" },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                borderTopColor: isDarkMode ? '#374151' : '#E5E7EB'
            }
        ]}>
            <View style={styles.navContent}>
                {navItems.map((item, index) => {
                    const isCenter = item.isCenter;
                    if (isCenter) {
                        return (
                            <View key={index} style={styles.centerButtonWrapper}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => router.push(item.route as Href)}
                                >
                                    <LinearGradient
                                        colors={[colors.primary, '#4ADE80']} // lime to green
                                        style={[
                                            styles.centerButton,
                                            {
                                                shadowColor: colors.primary,
                                                borderColor: isDarkMode ? '#111827' : 'white'
                                            }
                                        ]}
                                    >
                                        <MaterialIcons name={item.icon as any} size={32} color={colors.tertiary} />
                                    </LinearGradient>
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
                                { color: isActive ? (isDarkMode ? 'white' : '#111827') : colors.textInactive }
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
        // Backdrop blur support varies, opacity used here
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
        width: 64, // fixed width for even spacing
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
        borderWidth: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
});

export default GameDayFooter;
