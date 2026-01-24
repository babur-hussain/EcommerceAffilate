
import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const WatchTimer = ({ data }: { data?: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#D32F2F", // Red
        bgGray: "#F3F4F6", // gray-100
        bgGrayDark: "#111827", // gray-900
        textRed: "#DC2626", // red-600
        textRedDark: "#EF4444", // red-500
        textGray: "#1F2937", // gray-800
        textWhite: "#FFFFFF",
    };

    return (
        <View style={styles.container}>
            <View style={[
                styles.card,
                {
                    backgroundColor: isDarkMode ? colors.bgGrayDark : colors.bgGray,
                    borderColor: colors.primary
                }
            ]}>
                <View style={[styles.labelSection, { borderRightColor: isDarkMode ? '#374151' : '#E5E7EB' }]}>
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="timer" size={20} color={isDarkMode ? colors.textRedDark : colors.textRed} />
                    </View>
                    <Text style={[styles.labelText, { color: isDarkMode ? colors.textRedDark : colors.textRed }]}>
                        ENDING SOON
                    </Text>
                </View>

                <View style={styles.timerSection}>
                    <View style={[styles.timeBox, { backgroundColor: isDarkMode ? '#1F2937' : 'white' }]}>
                        <Text style={[styles.timeText, { color: isDarkMode ? 'white' : colors.textGray }]}>04</Text>
                    </View>
                    <Text style={[styles.separator, { color: isDarkMode ? 'white' : colors.textGray }]}>:</Text>
                    <View style={[styles.timeBox, { backgroundColor: isDarkMode ? '#1F2937' : 'white' }]}>
                        <Text style={[styles.timeText, { color: isDarkMode ? 'white' : colors.textGray }]}>12</Text>
                    </View>
                    <Text style={[styles.separator, { color: isDarkMode ? 'white' : colors.textGray }]}>:</Text>
                    <View style={[styles.timeBox, { backgroundColor: isDarkMode ? '#1F2937' : 'white' }]}>
                        <Text style={[styles.timeText, { color: colors.primary }]}>45</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 4,
        // shadow-inner not directly supported, using slight opacity overlay trick or clean flat style
        // Default flat style works well for "inner" look if bg is distinct
    },
    labelSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconWrapper: {
        // animate-pulse simulation handling manually or left static
    },
    labelText: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    timerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timeBox: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    timeText: {
        fontSize: 18, // text-xl
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'], // Monospace numbers if supported
    },
    separator: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
});

export default WatchTimer;
