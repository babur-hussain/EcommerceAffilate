
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SchoolThreeHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#FF8C42", // Bright Orange
        secondary: "#007ea7", // Teal
        accent: "#FDE74C", // Yellow
        bgLight: "#FAFAF9",
        bgDark: "#121212",
        cardLight: "#FFFFFF",
        cardDark: "#1E1E1E",
    };

    return (
        <View style={styles.container}>
            <View style={[styles.headerBg, { backgroundColor: colors.secondary }]}>
                {/* Background Pattern Icons */}
                <MaterialIcons name="eco" size={120} color={colors.accent} style={[styles.bgIcon, styles.icon1]} />
                <MaterialIcons name="eco" size={100} color={colors.accent} style={[styles.bgIcon, styles.icon2]} />
                <MaterialIcons name="attachment" size={48} color="white" style={[styles.bgIcon, styles.icon3]} />
                <MaterialIcons name="attachment" size={40} color="white" style={[styles.bgIcon, styles.icon4]} />

                <View style={styles.content}>
                    <Text style={styles.subTitle}>back to</Text>
                    <Text style={[styles.mainTitle, { color: colors.accent }]}>SCHOOL</Text>

                    <View style={styles.searchContainer}>
                        <View style={[
                            styles.searchBox,
                            { backgroundColor: isDarkMode ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)' }
                        ]}>
                            <MaterialIcons name="search" size={24} color="#9CA3AF" />
                            <TextInput
                                placeholder="Find pencils, rulers, backpacks..."
                                placeholderTextColor="#9CA3AF"
                                style={[styles.input, { color: isDarkMode ? 'white' : '#333' }]}
                            />
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
    headerBg: {
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    bgIcon: {
        position: 'absolute',
        opacity: 0.2,
    },
    icon1: {
        top: 16,
        right: -20,
        transform: [{ rotate: '45deg' }],
    },
    icon2: {
        top: 40,
        left: -10,
        transform: [{ rotate: '-12deg' }],
    },
    icon3: {
        bottom: 16,
        right: 48,
        transform: [{ rotate: '12deg' }],
        opacity: 0.3,
    },
    icon4: {
        top: 80,
        left: 32,
        transform: [{ rotate: '-45deg' }],
        opacity: 0.3,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    subTitle: {
        fontFamily: 'System', // Using System instead of Pacifico for mobile simplified
        fontSize: 24,
        color: 'white',
        fontStyle: 'italic', // simulating script feeling
        marginBottom: -8,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    mainTitle: {
        fontSize: 56,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        marginBottom: 24,
    },
    searchContainer: {
        width: '100%',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 999,
        // backdrop blur handled by rgba opacity usually enough
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
    },
});

export default SchoolThreeHeader;
