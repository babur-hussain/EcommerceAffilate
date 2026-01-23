
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ModernHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#ECC646", // Vibrant Yellow
        secondary: "#111111", // Deep Black
        bgLight: "#F5F5F5",
        bgDark: "#121212",
        textLight: "#111111",
        textDark: "#FFFFFF",
    };

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.timeSim}>9:41</Text>
                <View style={styles.statusIcons}>
                    <MaterialIcons name="signal-cellular-alt" size={16} color="white" />
                    <MaterialIcons name="wifi" size={16} color="white" />
                    <MaterialIcons name="battery-full" size={16} color="white" />
                </View>
            </View>

            {/* Split Header */}
            <View style={styles.header}>
                {/* Left Side (Image) */}
                <View style={styles.leftSide}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9fSAfFn95ebYIKmcPYOJRcYYBqhAFwncGviXcAXmALQ2Ex5XWq_cxWs7t-FstujC8yFqvYp0fSHjD-VjuApgDqSF8R4whI54wuMkUSsbn-i_BnAgL8QgBPtftX6pcyTEux-Xxn15NSmGlePKLI-i47VVVb1W5NQEeGqiEcZsM0v2ffxljwNc7UM3YLbUMSlRZKa2IEHT5oXUMkTmaY-IB3PNWjt5MZ0kgQmE9WBzIhIO0D4dhFrnQVlJNMTVBDdLTfNajH_QjnGc4" }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    {/* Simulated Diagonal Clip via overlapping view */}
                    <View style={[styles.diagonalOverlay, { borderRightColor: isDarkMode ? '#121212' : '#F5F5F5' }]} />
                </View>

                {/* Right Side (Content) */}
                <View style={styles.rightSide}>
                    <View style={styles.contentWrapper}>
                        <Text style={[styles.scriptText, { color: isDarkMode ? colors.primary : colors.secondary }]}>Modern</Text>
                        <Text style={[styles.mainTitle, { color: isDarkMode ? 'white' : colors.secondary }]}>FURNITURE</Text>
                        <Text style={[styles.description, { color: isDarkMode ? '#A1A1AA' : '#4B5563' }]}>
                            Decorate your house with modern furniture. Furniture that comforts the eyes.
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.ctaButton,
                                { backgroundColor: colors.secondary, shadowColor: 'rgba(0,0,0,0.5)' }
                            ]}
                            activeOpacity={0.9}
                        >
                            <Text style={[styles.ctaText, { color: colors.primary }]}>ORDER NOW</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Floating Discount Badge */}
                <View style={[styles.discountBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.discountPercent, { color: colors.primary }]}>50%</Text>
                    <Text style={[styles.discountLabel, { color: colors.primary }]}>OFF</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 480,
        backgroundColor: '#F5F5F5',
        position: 'relative',
        overflow: 'hidden',
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 50,
        // In a real app we might not render this or handle status bar differently
    },
    timeSim: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    statusIcons: {
        flexDirection: 'row',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
    },
    leftSide: {
        width: '65%', // slightly more than half
        height: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    diagonalOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: 0,
        width: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 100, // Width of triangle
        borderTopWidth: 480, // Height of triangle matching container
        borderTopColor: 'transparent',
        // borderRightColor set in component
    },
    rightSide: {
        width: '45%', // Overlap logic handled by visual trick or explicit width. 
        // Here we just use the remaining space + overlay effect
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        // width: '50%', // Removed duplicate
        justifyContent: 'center',
        paddingRight: 16,
        paddingLeft: 32, // Push text right
    },
    contentWrapper: {
        alignItems: 'flex-end',
    },
    scriptText: {
        fontSize: 32,
        fontStyle: 'italic', // Satisfy font simulation available
        marginBottom: -8,
        // fontFamily: 'Satisfy'
    },
    mainTitle: {
        fontSize: 36,
        fontWeight: '900',
        textAlign: 'right',
        lineHeight: 36,
        marginBottom: 16,
    },
    description: {
        fontSize: 12,
        textAlign: 'right',
        marginBottom: 24,
        lineHeight: 18,
    },
    ctaButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 999,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    ctaText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    discountBadge: {
        position: 'absolute',
        top: '35%',
        left: '50%', // Centered roughly on the split
        marginLeft: -80, // Adjust manual positioning
        width: 96, // w-24
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        zIndex: 20,
    },
    discountPercent: {
        fontSize: 24,
        fontWeight: '900',
    },
    discountLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});

export default ModernHeader;
