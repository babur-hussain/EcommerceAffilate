
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const CenterHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme Colors
    const colors = {
        primary: "#314CB6", // Royal Blue
        primaryDark: "#2a419e",
        bgLight: "#F0F9FF",
        bgDark: "#0B1120",
    };

    return (
        <View style={styles.container}>
            {/* Background elements - usually SVG in web, simplified here */}
            <View style={styles.bgCircles}>
                <View style={[styles.circle, { width: 500, height: 500, top: 40 }]} />
                <View style={[styles.circle, { width: 420, height: 420, top: 80 }]} />
                <View style={[styles.circle, { width: 340, height: 340, top: 120 }]} />
            </View>

            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => router.back()} style={[
                    styles.iconBtn,
                    { backgroundColor: isDarkMode ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.5)' }
                ]}>
                    <MaterialIcons name="arrow-back" size={24} color={isDarkMode ? '#E2E8F0' : '#334155'} />
                </TouchableOpacity>

                <View style={styles.brandIcon}>
                    <MaterialIcons name="sports-soccer" size={20} color="white" />
                </View>

                <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={[
                    styles.iconBtn,
                    { backgroundColor: isDarkMode ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.5)' }
                ]}>
                    <MaterialIcons name="shopping-bag" size={24} color={isDarkMode ? '#E2E8F0' : '#334155'} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            {/* Header Content */}
            <View style={styles.content}>
                <Text style={styles.subTitle}>SHOPPING CENTER</Text>

                <View style={styles.heroSection}>
                    {/* Big Background Text */}
                    <Text style={[styles.bgText, { color: colors.primary }]}>SPORT</Text>

                    {/* Floating Image */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIsPK9ih4rPiZoDwQl3weYIlP0Guc3G4oj3wSiSTzTvOe_qe3Yj-q3pMwIaNp4k-JX8Z7GUhB5vO4QP3DiVvAIrQv_aJAwl8YD9CR2NcTVzxFpffXP-kaMyG996nNsOlsWgXfANDLFaoBDuIMSxE-mZ0lRZT5gloqMfYKtjRZpZzf9x4b29iTbYlpRc_vYXchCjpy4aOa7-h-CLs0ZYkFn9KLl4jeEqBHU9wtvaavsSLnu9apNsCXu93j1KWCfi1siD_qfXYj4J5ko" }}
                            style={styles.heroImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={[
                        styles.searchBox,
                        { backgroundColor: isDarkMode ? '#1E293B' : 'white' }
                    ]}>
                        <MaterialIcons name="search" size={24} color="#94A3B8" style={{ marginRight: 12 }} />
                        <TextInput
                            placeholder="Search football, tennis, jersey..."
                            placeholderTextColor="#94A3B8"
                            style={[styles.input, { color: isDarkMode ? 'white' : '#1E293B' }]}
                        />
                        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.primary }]}>
                            <MaterialIcons name="tune" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        overflow: 'hidden', // Contain bg circles
        paddingBottom: 24,
    },
    bgCircles: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)', // Using higher opacity for visibility on presumed light bg, adjust as needed
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 0,
        paddingTop: 54, // Increased padding
        marginBottom: 16,
        zIndex: 20,
    },
    iconBtn: {
        padding: 8,
        borderRadius: 20,
        // Backdrop blur not supported on straight View without BlurView, simplifying
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        backgroundColor: '#EF4444',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'white',
    },
    brandIcon: {
        width: 32,
        height: 32,
        backgroundColor: '#314CB6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '3deg' }],
    },
    content: {
        alignItems: 'center',
        zIndex: 10,
    },
    subTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2, // tracking-[0.2em]
        color: '#64748B',
        textTransform: 'uppercase',
        marginBottom: -10,
        zIndex: 10,
    },
    heroSection: {
        height: 160,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    bgText: {
        fontSize: 80, // 7rem approx
        fontWeight: '900', // black
        position: 'absolute',
        zIndex: 0,
        transform: [{ scaleY: 0.9 }],
        // Text stroke workaround not ideal in RN, relying on color
    },
    imageWrapper: {
        width: width * 0.8,
        height: 140,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    searchContainer: {
        width: '100%',
        paddingHorizontal: 24,
        marginTop: 32,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 8,
        paddingVertical: 8,
        borderRadius: 16,
        shadowColor: '#1E3A8A', // blue-900
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 14,
        fontWeight: '500',
    },
    filterBtn: {
        padding: 10,
        borderRadius: 12,
    },
});

export default CenterHeader;
