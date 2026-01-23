
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SpecialHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#C62828", // Deep Red
        bgLight: "#F3F4F6",
        bgDark: "#0a0a0a",
        surfaceLight: "#FFFFFF",
        surfaceDark: "#171717",
    };

    return (
        <View style={styles.container}>
            {/* Navbar */}
            <View style={[styles.navbar, {
                backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                borderBottomColor: isDarkMode ? '#1F2937' : '#F3F4F6'
            }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="menu" size={24} color={isDarkMode ? 'white' : '#111827'} />
                </TouchableOpacity>
                <Text style={[styles.brandText, { color: isDarkMode ? 'white' : '#111827' }]}>
                    SNEAK<Text style={{ color: colors.primary }}>HUB</Text>
                </Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="shopping-bag" size={24} color={isDarkMode ? 'white' : '#111827'} />
                    <View style={[styles.badge, { backgroundColor: colors.primary, borderColor: isDarkMode ? '#171717' : 'white' }]} />
                </TouchableOpacity>
            </View>

            {/* Banner */}
            <View style={[styles.bannerWrapper, { backgroundColor: isDarkMode ? colors.surfaceDark : 'white' }]}>
                {/* Diagonal Red Block */}
                <View style={styles.diagonalBlockWrapper}>
                    <View style={[styles.diagonalBlock, { backgroundColor: colors.primary }]}>
                        <LinearGradient
                            colors={['rgba(0,0,0,0.2)', 'transparent']}
                            style={StyleSheet.absoluteFill}
                        />
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.textContent}>
                        <Text style={[styles.headingNew, { color: isDarkMode ? 'white' : 'black' }]}>
                            NEW
                        </Text>
                        <View style={styles.specialRow}>
                            <Text style={styles.headingSpecial}>SPECIAL</Text>
                        </View>
                        <Text style={styles.headingShoes}>
                            SHOES SALE
                        </Text>

                        <TouchableOpacity style={[styles.shopBtn, { backgroundColor: isDarkMode ? 'white' : 'black' }]}>
                            <Text style={[styles.shopBtnText, { color: isDarkMode ? 'black' : 'white' }]}>
                                Shop Now
                            </Text>
                            <MaterialIcons
                                name="arrow-forward"
                                size={16}
                                color={isDarkMode ? 'black' : 'white'}
                                style={{ marginLeft: 4 }}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Shoe Image */}
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdGqi-iKSFA4wBVq6tGPcmdmzXDSW1K1YJjbzCp0F-PaCCKvRV_8Cd8RcjJN41T7x1-a7HMMhw2ce9X-JjyXSLiozjtwyXbbmR_q7RESGcCJ9FZhGhrwHVOav2X_DkQG8HwEnONBeQIoc2wKx-VmWAcLt0nmmh1jXpFaoswzJaw-QADE8sTHCEStbZdM1o5zalfdqUVPRcv8CYuklHnCwrw3JAWYK2FwxKoCPTzvZgYZuCKOSGgniuNRIWV6hu86aZZ0vqDosc92Lf" }}
                        style={styles.shoeImage}
                        resizeMode="contain"
                    />
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
        paddingVertical: 12,
        zIndex: 50,
        borderBottomWidth: 1,
    },
    iconBtn: {
        padding: 4,
    },
    brandText: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
    },
    bannerWrapper: {
        height: 400,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    diagonalBlockWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '65%',
        // Implementing skew through transform on wrapper container/child
    },
    diagonalBlock: {
        width: '100%',
        height: '100%',
        transform: [{ skewX: '-12deg' }, { translateX: 60 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
        position: 'relative',
    },
    textContent: {
        alignItems: 'flex-start',
        zIndex: 10,
    },
    headingNew: {
        fontSize: 60, // 6xl-ish
        fontWeight: 'bold', // italic handled with style if font supports
        fontStyle: 'italic',
        lineHeight: 60,
        transform: [{ rotate: '-1deg' }],
        zIndex: 10,
    },
    specialRow: {
        marginVertical: 4,
    },
    headingSpecial: {
        fontSize: 36,
        fontFamily: 'serif', // System serif
        color: '#C62828',
        letterSpacing: 2,
    },
    headingShoes: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#C62828',
        lineHeight: 48,
        letterSpacing: -1,
    },
    shopBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 999,
        marginTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    shopBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    shoeImage: {
        position: 'absolute',
        top: 80,
        right: -80, // Allow overflow off screen right
        width: 400,
        height: 300,
        transform: [{ rotate: '-15deg' }],
        zIndex: 5,
    },
});

export default SpecialHeader;
