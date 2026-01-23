
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const NewFurnitureHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#593E2E", // Dark Brown
        secondary: "#CBB6A4", // Tan
        bgLight: "#F7F4F0", // Cream
        bgDark: "#1C1917",
        textDark: "#E7E5E4",
        surfaceLight: "#FFFFFF",
        surfaceDark: "#292524",
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight }]}>
            {/* Nav Bar */}
            <View style={[styles.navbar, { backgroundColor: isDarkMode ? 'rgba(28, 25, 23, 0.9)' : 'rgba(247, 244, 240, 0.9)' }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="menu" size={24} color={isDarkMode ? colors.textDark : colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.brand, { color: isDarkMode ? colors.textDark : colors.primary }]}>L U M A</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="shopping-bag" size={24} color={isDarkMode ? colors.textDark : colors.primary} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            {/* Header Content */}
            <View style={styles.headerContent}>
                {/* Background Circles */}
                <View style={[styles.circleDeco, styles.circleBig, { backgroundColor: isDarkMode ? 'rgba(203, 182, 164, 0.1)' : 'rgba(203, 182, 164, 0.3)' }]} />
                <View style={[styles.circleDeco, styles.circleSmall, { backgroundColor: isDarkMode ? 'rgba(203, 182, 164, 0.05)' : 'rgba(203, 182, 164, 0.2)' }]} />

                {/* Main Circle Image */}
                <View style={styles.imageWrapper}>
                    <View style={[styles.imageBorder, { borderColor: isDarkMode ? 'rgba(203, 182, 164, 0.2)' : 'rgba(203, 182, 164, 0.4)' }]}>
                        <View style={styles.imageInner}>
                            <Image
                                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvsMqAwwBuRTXVHW3j3WQjQRYXdyEGq1CvZj7PMUoDxHi8vubS0c_7gLukySTGSnDvEh3AKuyxHEZd7jllD7j0pHTQ4X8jq3aeL0WAnPdMeurccXxGDQ974-vV4UZMCR2az54ux9m_k69TNYuy99c83VY7sDHqQd5BXUK2Mr0Ker-QqGYvLcCp9a3m1FtC9oylHPac_CyUQxaNS6SIm0n5mAZ-O99raRzrP2XJy8Uf0RmlDI0vGBxmgg87OawiYCdy8HzW1fRfb5nH" }}
                                style={styles.heroImage}
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                </View>

                {/* Typography */}
                <View style={styles.textContainer}>
                    <Text style={[styles.subtitle, { color: isDarkMode ? colors.secondary : 'rgba(89, 62, 46, 0.8)' }]}>SPECIAL COLLECTION</Text>
                    <Text style={[styles.title, { color: isDarkMode ? 'white' : colors.primary }]}>NEW</Text>
                    <Text style={[styles.subTitleLarge, { color: isDarkMode ? 'rgba(203, 182, 164, 0.8)' : colors.secondary }]}>ARRIVAL</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        overflow: 'hidden',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 50, // Safe area
        paddingBottom: 16,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
    },
    iconBtn: {
        padding: 8,
        borderRadius: 999,
    },
    brand: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 4,
    },
    badge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 10,
        height: 10,
        backgroundColor: '#EF4444',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#F7F4F0',
    },
    headerContent: {
        marginTop: 100, // Space for navbar
        paddingBottom: 40,
        alignItems: 'center',
        position: 'relative',
    },
    circleDeco: {
        position: 'absolute',
        borderRadius: 999,
        zIndex: 0,
    },
    circleBig: {
        width: 256, // w-64
        height: 256,
        top: -80,
        left: -80,
    },
    circleSmall: {
        width: 128, // w-32
        height: 128,
        top: 40,
        right: -32,
    },
    imageWrapper: {
        width: 256,
        height: 256,
        marginBottom: 24,
        zIndex: 10,
    },
    imageBorder: {
        width: '100%',
        height: '100%',
        borderRadius: 128,
        borderWidth: 6,
        padding: 8,
    },
    imageInner: {
        width: '100%',
        height: '100%',
        borderRadius: 128,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
        zIndex: 10,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2, // tracking-[0.2em]
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    title: {
        fontSize: 60, // text-6xl
        fontWeight: '900',
        lineHeight: 60,
    },
    subTitleLarge: {
        fontSize: 36, // text-4xl
        fontWeight: '300', // font-light
        letterSpacing: 4, // tracking-widest
        lineHeight: 40,
    },
});

export default NewFurnitureHeader;
