
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const SchoolFiveHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#DC2626", // Bright Red
        secondary: "#FF9F1C", // Orange
        bgLight: "#F3F4F6",
        bgDark: "#111827",
    };

    return (
        <View style={styles.container}>
            <View style={[styles.headerBg, { backgroundColor: colors.secondary }]}>
                {/* Pattern Background Text */}
                <View style={styles.patternContainer}>
                    <Text style={[styles.patternText]}>CONFERENCE CONFERENCE</Text>
                    <Text style={[styles.patternText]}>CONFERENCE CONFERENCE</Text>
                    <Text style={[styles.patternText]}>CONFERENCE CONFERENCE</Text>
                    <Text style={[styles.patternText]}>CONFERENCE CONFERENCE</Text>
                    <Text style={[styles.patternText]}>CONFERENCE CONFERENCE</Text>
                </View>

                {/* Navbar */}
                <View style={styles.navbar}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="menu" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.navRight}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <MaterialIcons name="search" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <MaterialIcons name="shopping-bag" size={24} color="white" />
                            <View style={[styles.badge, { backgroundColor: colors.primary, borderColor: colors.secondary }]}>
                                <Text style={styles.badgeText}>2</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    <View style={styles.promoImageWrapper}>
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoRaUDKZyvSwlgoZOEv9kuTUBsifba_Nd1PpU0-T8RGetGYNhCL_4KjOHOPcuCv_ggOEg5TXSJ5zokyZ3nzIxROXAoNemMOLug0MGdoWTw0oNZ_Oj1RD6Nl_XiQMac76gFjQeXuErIm88C-uTSzMk3aJ2bU2rmNa5MRMRQSz0OoVsMqFuBltbtsA0JGsf8Oy70trIGrryn9ojP11s6fQf1FRHbY6EMW-CB213XCp6a9m3MdSLIXs6ytxAkL_B1ZiqSzicTDL7D0i0j" }}
                            style={styles.promoImage}
                            resizeMode="cover"
                        />
                        {/* Decorative floating emojis */}
                        <View style={[styles.floatIcon, styles.floatLeft]}>
                            <Text style={{ fontSize: 20 }}>✏️</Text>
                        </View>
                        <View style={[styles.floatIcon, styles.floatRight]}>
                            <Text style={{ fontSize: 20 }}>⏰</Text>
                        </View>
                    </View>

                    <Text style={styles.mainTitle}>Get Ready for School!</Text>
                    <Text style={styles.subTitle}>Huge savings on creative supplies</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    headerBg: {
        paddingTop: 48,
        paddingBottom: 32,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    patternContainer: {
        position: 'absolute',
        top: -20,
        left: -50,
        width: width * 2,
        opacity: 0.1,
        transform: [{ rotate: '-10deg' }],
    },
    patternText: {
        fontSize: 60,
        fontWeight: '900',
        color: 'white',
        lineHeight: 70,
        // In react native text stroke is not standard, using simply opacity here
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
        zIndex: 20,
    },
    navRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    badgeText: {
        color: 'white',
        fontSize: 8,
        fontWeight: 'bold',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    promoImageWrapper: {
        width: '100%',
        aspectRatio: 1.6, // 16:10
        borderRadius: 16,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
        transform: [{ rotate: '1deg' }],
        marginBottom: 16,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    promoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    floatIcon: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    floatLeft: {
        top: -12,
        left: -8,
        backgroundColor: '#3B82F6', // blue-500
        transform: [{ rotate: '-6deg' }],
    },
    floatRight: {
        bottom: -12,
        right: -8,
        transform: [{ rotate: '6deg' }],
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        marginBottom: 4,
    },
    subTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.9)',
    },
});

export default SchoolFiveHeader;
