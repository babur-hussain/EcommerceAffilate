
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const PayDayHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme Colors
    const colors = {
        primary: "#4FA960", // Vibrant Green
        secondary: "#1B4B63", // Teal/Blue
        bgLight: "#F3F4F6",
        bgDark: "#111827",
    };

    return (
        <View style={styles.container}>
            {/* Top Navbar Area (Sticky-like) */}
            <View style={[styles.navbar, { backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <MaterialIcons name="arrow-back" size={24} color={isDarkMode ? 'white' : '#1F2937'} />
                </TouchableOpacity>
                <Text style={[styles.logoText, { color: isDarkMode ? 'white' : '#1F2937' }]}>
                    SPORT<Text style={{ color: colors.primary }}>ZONE</Text>
                </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.iconBtn}>
                    <MaterialIcons name="shopping-bag" size={24} color={isDarkMode ? 'white' : '#1F2937'} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            {/* Banner Content */}
            <View style={styles.bannerWrapper}>
                <View style={styles.bgDarkBlock} />

                {/* Diagonal Gradient */}
                <View style={styles.diagonalClipWrapper}>
                    <LinearGradient
                        colors={['#0F766E', '#4FA960']} // teal-700 to primary
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.diagonalGradient}
                    />
                </View>

                <View style={styles.contentRow}>
                    <View style={styles.textColumn}>
                        <Text style={styles.mainTitle}>
                            PAYDAY{'\n'}PROMO
                        </Text>
                        <Text style={styles.subText}>Discount Up to 50%</Text>
                        <Text style={styles.subText}>For All products</Text>

                        <View style={styles.arrowRow}>
                            <View style={styles.arrowIcon} />
                            <View style={styles.arrowIcon} />
                            <View style={styles.arrowIcon} />
                        </View>
                    </View>

                    <View style={styles.imageColumn}>
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCe4_FOSSnKIWVRRSaX9B86gxjP1b65CC-xpoLwagymYWKHOEEnMiCA506BVzTjezIA7SZ9vNuQbpBarkJQsCL67lWP7VQx9ll3eDoSHRFAJWGCx5T8Tw_CJfGxQobkAFZ-YT3Tgo5j70dAB3dMa40GA3MB2xhC7TWlg77eFhkN4oDPu1y5VHPmlZcsE22w9s8ejXadVFVMbOVIGDA5F9JyCgRbB-UwNThs9Qk9meWRbo22wqVkHZ2CBcs8aRBf3yAaWaEyGFykP9E3" }}
                            style={styles.mainImage}
                            resizeMode="contain"
                        />
                        {/* Floating elements */}
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaB5a5y8VU-PWoEG-N6Qxi_lPSzvfVazXb99zgx7yWuhMqxFGFbB2gUGRTL_9j6eTKx66yFQkmtRDcyhhVBCDFRf8OA7n522sFqtv0hjdL_UBUgGoVkYF4S-fNBXTpP5TG0bYx4E5i2l280665tDSlmuTyOC59dvPvID5a_1iNYeu-NNWZYgpke8hsvledZf-3i1v5fnqTMxvlsFWBQ3RyU_1Go_cnsz0LPPVHLTz0N1-yLDHOC25PqFdBkLhz0U2Z7_s1mLwXG1UR" }}
                            style={styles.ballImage}
                        />

                        {/* Starburst Badge */}
                        <View style={styles.starburstWrapper}>
                            <View style={styles.starburst}>
                                <Text style={styles.discountLabel}>DISCOUNT</Text>
                                <Text style={styles.discountValue}>50%</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 54, // Adjusted for status bar
        paddingBottom: 12,
        zIndex: 50,
    },
    iconBtn: {
        padding: 8,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
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
        borderColor: 'white',
    },
    bannerWrapper: {
        height: 256, // h-64
        position: 'relative',
        backgroundColor: '#111827', // gray-900 base
        overflow: 'hidden',
        marginBottom: 24,
    },
    bgDarkBlock: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#111827',
    },
    diagonalClipWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '66%',
        // Simple rectangular overlay that we will mask or position to look diagonal
        // RN doesn't have clip-path polygon easily without SVG. Using transform.
        transform: [{ skewX: '-20deg' }, { translateX: 60 }],
        overflow: 'hidden',
    },
    diagonalGradient: {
        flex: 1,
        // Counter-skew
        transform: [{ skewX: '20deg' }, { translateX: -40 }],
    },
    contentRow: {
        flexDirection: 'row',
        height: '100%',
        paddingHorizontal: 24,
        zIndex: 20,
    },
    textColumn: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 16,
    },
    mainTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 40,
        marginBottom: 8,
    },
    subText: {
        color: '#D1D5DB', // gray-300
        fontSize: 12,
        marginBottom: 4,
    },
    arrowRow: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 4,
        opacity: 0.8,
    },
    arrowIcon: {
        width: 12,
        height: 12,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'white',
        transform: [{ rotate: '-45deg' }],
    },
    imageColumn: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: {
        width: '140%', // Oversize
        height: '90%',
        position: 'absolute',
        right: -20,
        top: 16,
        transform: [{ rotate: '12deg' }],
    },
    ballImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        position: 'absolute',
        bottom: 24,
        left: 0,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    starburstWrapper: {
        position: 'absolute',
        bottom: 32,
        right: 0,
        zIndex: 30,
    },
    // Simple circle for starburst simulation in RN
    starburst: {
        width: 80,
        height: 80,
        backgroundColor: 'white',
        borderRadius: 40, // Circle instead of jagged star for sim
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    discountLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    discountValue: {
        fontSize: 24,
        fontWeight: '900',
    },
});

export default PayDayHeader;
