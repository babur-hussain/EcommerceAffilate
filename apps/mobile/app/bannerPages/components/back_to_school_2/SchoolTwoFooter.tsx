
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const SchoolTwoFooter = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#FACC15",
        activeIcon: "#FACC15",
        inactiveIcon: "rgba(255,255,255,0.6)",
    };

    const navItems = [
        { icon: "home", label: "Home", route: "/" },
        { icon: "category", label: "Catalog", route: "/catalog" },
        { icon: "shopping-bag", label: "", route: "/cart", isCenter: true },
        { icon: "favorite", label: "Saved", route: "/wishlist" },
        { icon: "person", label: "Profile", route: "/profile" },
    ];

    return (
        <View style={styles.container}>
            {/* Backdrop Blur Simulation or View for fallback on Android/Web if needed. 
                Expo BlurView is good. */}
            <BlurView intensity={80} tint="dark" style={styles.blurView}>
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
                                                borderColor: isDarkMode ? '#0f382a' : '#155e48'
                                            }
                                        ]}
                                        activeOpacity={0.9}
                                        onPress={() => router.push(item.route as Href)}
                                    >
                                        <MaterialIcons name={item.icon as any} size={28} color="black" />
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
                                    size={28}
                                    color={isActive ? colors.activeIcon : colors.inactiveIcon}
                                />
                                <Text style={[
                                    styles.navLabel,
                                    { color: isActive ? colors.activeIcon : colors.inactiveIcon }
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        zIndex: 50,
        // For visual consistency, wrapping view or absolute positioning logic
    },
    blurView: {
        width: '100%',
        paddingTop: 16,
        paddingBottom: 24, // Safe area
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
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
        fontWeight: '500',
    },
    centerButtonWrapper: {
        position: 'relative',
        top: -32,
        height: 0, // Avoid pushing layout
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
    },
    centerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default SchoolTwoFooter;
