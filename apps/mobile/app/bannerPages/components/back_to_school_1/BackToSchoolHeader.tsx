
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BackToSchoolHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#F4B060", // Bright orange
        chalkboardGreen: "#2B5F3E", // Dark green
        bgLight: "#F9F7F2",
        bgDark: "#1A1A1A",
        paperWhite: "#FFFFFF",
        paperDark: "#2D2D2D",
        accentBlue: "#6B9EE6",
        accentRed: "#E66B6B",
        accentYellow: "#F4D35E",
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight }]}>
            {/* Header section */}
            <View style={[styles.header, { backgroundColor: colors.chalkboardGreen }]}>
                {/* Decorative Elements */}
                <View style={styles.topDecoRow}>
                    {[...Array(5)].map((_, i) => (
                        <View key={i} style={[styles.chalkStick, { height: 24 + (i % 3) * 6 }]} />
                    ))}
                </View>

                {/* Simulated Chalk Drawings */}
                <View style={styles.drawingABC}>
                    <Text style={styles.chalkText}>ABC</Text>
                </View>
                <View style={styles.drawingBulb}>
                    <MaterialIcons name="lightbulb" size={32} color="rgba(255,255,255,0.4)" />
                </View>
                <View style={styles.drawingMath}>
                    <Text style={styles.chalkText}>1 + 2 = 3</Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.welcomeText}>Welcome</Text>
                    <Text style={styles.mainTitle}>
                        BACK{'\n'}
                        <Text style={styles.toText}>to</Text> SCHOOL
                    </Text>

                    <View style={styles.studentRow}>
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUKcux_NhPl0HEN2ypADh8zAQqEU5oSPNSBqOkzj32oFzbKPYcBn2Vekj81U4QjVoPICK0-AEwjzXuWU-HF1McdyktPXE3e9bgq0bApl5FlLtiDPkdOkenJe5XYk97_VRUgsSLCN1IgvYqW9Obn05EkyOASEbKZSHbtVLnQ5GO2HdTjyLG_thy5nm3y9InXjyn_IRxVEd_MIzG95Lb6yl_eO4cLEjQWi-Hsz7WUJDZzWBhq_BLqbPR1Xu5_P5JTOiGfDC1j9_4ARJs" }}
                            style={styles.studentImg}
                        />
                        <View style={[styles.shopBtn, { backgroundColor: colors.primary }]}>
                            <Text style={styles.shopText}>SHOP NOW</Text>
                        </View>
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCK9aRKYsvvsjUqLQmrVhvnfXTV_bbd0S4aofnNw68dw-paqUnkPTPHSdpK0kvY74gCpBBs-qhlGas91j6q7V0VEKOQXRD4lfXAe9xLT7ZdBOauA6Fy8iLvelXrpMXQwUcofIFe9lv7Y-LuOZYvnBp9jGF4zueqbezsysreHmG8Bu2RXIGCZ_J0-x4LvuGeEZEQJRSS9iAVxO86aFSvWIUCr_nGJAC4B7sDUQvAx0J2EsGDMwGhgquDMCm0evCKUw9d0wQHnWh-XdP5" }}
                            style={styles.studentImg}
                        />
                    </View>
                </View>
            </View>

            {/* Overlapping Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[
                    styles.searchBox,
                    {
                        backgroundColor: isDarkMode ? colors.paperDark : colors.paperWhite,
                        borderColor: isDarkMode ? '#374151' : '#F3F4F6'
                    }
                ]}>
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search backpacks, pencils..."
                        placeholderTextColor="#9CA3AF"
                        style={[styles.input, { color: isDarkMode ? 'white' : '#1F2937' }]}
                    />
                    <TouchableOpacity style={[styles.filterBtn, { backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }]}>
                        <MaterialIcons name="tune" size={20} color={isDarkMode ? '#D1D5DB' : '#6B7280'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingTop: 60,
        paddingBottom: 48,
        position: 'relative',
        overflow: 'hidden',
    },
    topDecoRow: {
        position: 'absolute',
        top: -10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    chalkStick: {
        width: 8,
        backgroundColor: 'rgba(253, 224, 71, 0.5)', // yellow-200/50
        borderRadius: 4,
    },
    drawingABC: {
        position: 'absolute',
        top: 60,
        left: 20,
        transform: [{ rotate: '-12deg' }],
        opacity: 0.4,
    },
    drawingBulb: {
        position: 'absolute',
        top: 60,
        right: 20,
        opacity: 0.4,
    },
    drawingMath: {
        position: 'absolute',
        bottom: 40,
        right: 40,
        transform: [{ rotate: '12deg' }],
        opacity: 0.3,
    },
    chalkText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        // fontFamily: 'Handwriting' if available
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    welcomeText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 18,
        marginBottom: 4,
    },
    mainTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        lineHeight: 42,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        marginBottom: 16,
    },
    toText: {
        fontSize: 24,
        fontWeight: 'normal',
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 16,
    },
    studentImg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    shopBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 999,
        marginHorizontal: -12, // overlap
        marginBottom: 20,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    shopText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    searchContainer: {
        marginTop: -24,
        paddingHorizontal: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
    },
    filterBtn: {
        padding: 6,
        borderRadius: 8,
    },
});

export default BackToSchoolHeader;
