
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ModernHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors (LUSSO Palette)
    const colors = {
        primary: "#9F6B08", // Earthy Gold
        primaryDark: "#785106",
        bgLight: "#FDFBF7",
        bgDark: "#1C1917",
        textMainLight: "#4A3B32",
        textMainDark: "#E7E5E4",
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight }]}>

            {/* Banner Section */}
            <View style={[styles.bannerSection, { backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight }]}>
                {/* Text Block */}
                <View style={styles.headerTextBlock}>
                    <LinearGradient
                        colors={isDarkMode ? ['rgba(28, 25, 23, 0)', 'rgba(28, 25, 23, 0)'] : ['#F5F5F4', 'rgba(255,255,255,0)']}
                        style={StyleSheet.absoluteFill}
                    />
                    <Text style={[styles.seasonText, { color: colors.primary }]}>AUTUMN 2026</Text>
                    <Text style={[styles.mainTitle, { color: isDarkMode ? '#F5F5F4' : colors.textMainLight }]}>
                        New <Text style={styles.italicText}>Collection</Text>
                    </Text>
                </View>

                {/* Hero Content */}
                <View style={styles.heroContentWrapper}>
                    {/* Background Card */}
                    <View style={[styles.promoCard, { backgroundColor: colors.primary }]}>
                        {/* Decorative blur shadows */}
                        <View style={styles.blurCircle1} />
                        <View style={styles.blurCircle2} />

                        {/* Text Inside Card */}
                        <View style={styles.cardLeft}>
                            <Text style={styles.cardUpTo}>UP TO</Text>
                            <Text style={styles.cardPercent}>50%</Text>
                            <Text style={styles.cardOff}>OFF</Text>
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={styles.cardSeries}>Vintage{'\n'}Series</Text>
                            <View style={styles.limitedBadge}>
                                <Text style={styles.limitedText}>LIMITED</Text>
                            </View>
                        </View>
                    </View>

                    {/* Floating Image */}
                    <View style={styles.floatingImageWrapper}>
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz5uuG_oPQSDExf2y8qVxEu5C117V19hMwsLMmlhdB46trWzQqIDcjRUfRH0_p0QBBnk17OBK_EcoszzIACa-sndsyilPX5MSdHIGDbl2i670qjVzQ51rYwKHXaCNu3F5R9txf5OL_YpIdrvhZn0hM8qw4MP_CP56Sr9jB1wjvC2QUKKUPRvCzpMbeTkun8DqrjcjO0uMWb3XCI_o21aRt6riWMBZZ3-dnP_HZc4HH4GOsJSs18egBkKNPBDAZrGrRTzV_dNTHNgr5" }}
                            style={styles.sofaImage}
                            resizeMode="contain"
                        />

                        {/* Price Tag */}
                        <View style={[styles.priceTag, {
                            backgroundColor: isDarkMode ? colors.bgDark : 'white',
                            borderColor: isDarkMode ? '#44403C' : '#F5F5F4'
                        }]}>
                            <Text style={[styles.priceValue, { color: colors.primary }]}>$499</Text>
                            <MaterialIcons name="arrow-forward" size={14} color={isDarkMode ? '#A8A29E' : '#8D7B6F'} />
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 16,
        zIndex: 50,
        // shadow added dynamically
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    iconBtn: {
        padding: 4,
    },
    brandText: {
        fontSize: 20,
        fontFamily: 'serif', // Playfair Display replacement
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    badgeDot: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
    },
    bannerSection: {
        position: 'relative',
        paddingBottom: 48,
    },
    headerTextBlock: {
        paddingTop: 32,
        paddingBottom: 128, // space for overlap
        alignItems: 'center',
        position: 'relative',
    },
    seasonText: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    mainTitle: {
        fontSize: 40,
        fontFamily: 'serif',
        lineHeight: 44,
        textAlign: 'center',
    },
    italicText: {
        fontStyle: 'italic',
        fontWeight: 'normal',
    },
    heroContentWrapper: {
        paddingHorizontal: 16,
        marginTop: -100, // Overlap text
        position: 'relative',
    },
    promoCard: {
        height: 128,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    blurCircle1: {
        position: 'absolute',
        bottom: -32,
        left: -16,
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    blurCircle2: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    cardLeft: {
        zIndex: 10,
    },
    cardUpTo: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
    },
    cardPercent: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
        fontFamily: 'serif',
    },
    cardOff: {
        color: 'white',
        fontSize: 32, // same as percent roughly
        fontWeight: 'bold',
        lineHeight: 32,
        fontFamily: 'serif',
    },
    cardRight: {
        alignItems: 'flex-end',
        zIndex: 10,
    },
    cardSeries: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'serif',
        textAlign: 'right',
        lineHeight: 20,
    },
    limitedBadge: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    limitedText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    floatingImageWrapper: {
        marginTop: -90, // Pull up over the card
        alignItems: 'center',
        zIndex: 20,
        position: 'relative',
    },
    sofaImage: {
        width: 340,
        height: 220, // adjust ratio
    },
    priceTag: {
        position: 'absolute',
        bottom: -8,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        gap: 4,
    },
    priceValue: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default ModernHeader;
