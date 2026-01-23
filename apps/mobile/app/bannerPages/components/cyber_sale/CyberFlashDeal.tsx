
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const CyberFlashDeal = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#D9242C",
        secondary: "#FFCB05",
        accent: "#2A7FFF",
        textWhite: "#FFFFFF",
        textBlack: "#000000",
    };

    return (
        <View style={styles.container}>
            <View style={[styles.card, { backgroundColor: colors.accent, borderColor: 'black' }]}>
                {/* Background Icon */}
                <View style={styles.bgIcon}>
                    <MaterialIcons name="shopping-cart" size={120} color="rgba(255,255,255,0.2)" />
                </View>

                <View style={styles.content}>
                    <View>
                        <Text style={styles.title}>FLASH DEAL</Text>
                        <Text style={styles.timer}>Ends in 04:23:12</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: colors.secondary, borderColor: 'black' }
                        ]}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>VIEW</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 24,
        marginTop: 8,
    },
    card: {
        borderRadius: 12, // rounded-xl
        borderWidth: 2,
        padding: 16,
        overflow: 'hidden',
        position: 'relative',
        // Pop shadow
        shadowColor: '#0F172A',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    bgIcon: {
        position: 'absolute',
        top: -20,
        right: -20,
        transform: [{ rotate: '-15deg' }],
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '900', // Comic/Display font simulation
        color: 'white',
        letterSpacing: 1,
        marginBottom: 4,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },
    timer: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.9)',
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 2,
        // Small pop shadow for button
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default CyberFlashDeal;
