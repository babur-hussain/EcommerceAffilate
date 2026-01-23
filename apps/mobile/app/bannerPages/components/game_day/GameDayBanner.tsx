
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const GameDayBanner = ({ data }: { data: any }) => {
    // Theme colors
    const colors = {
        primary: "#D4FF3E", // Lime
        tertiary: "#023E8A", // Deep Blue
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#111827', '#1F2937']} // gray-900 to gray-800
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.banner}
            >
                {/* Decorative overlay */}
                <View style={[styles.overlay, { backgroundColor: colors.primary }]} />

                <View style={styles.content}>
                    <View style={styles.leftCol}>
                        <Text style={[styles.limitedText, { color: colors.primary }]}>Limited Offer</Text>
                        <Text style={styles.title}>
                            BUNDLE & SAVE{'\n'}
                            <Text style={styles.subtitle}>ON TEAM KITS</Text>
                        </Text>
                        <TouchableOpacity style={[styles.linkBtn, { borderBottomColor: colors.primary }]}>
                            <Text style={styles.linkText}>View Deals</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rightCol}>
                        <MaterialIcons name="groups" size={48} color="#4B5563" style={{ opacity: 0.5 }} />
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 20,
        marginBottom: 32, // More space before footer
    },
    banner: {
        borderRadius: 16,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        opacity: 0.1,
        transform: [{ skewX: '12deg' }],
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    leftCol: {
        flex: 2,
    },
    rightCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    limitedText: {
        fontSize: 12, // xs
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 24,
        marginBottom: 12,
    },
    subtitle: {
        color: '#9CA3AF',
    },
    linkBtn: {
        alignSelf: 'flex-start',
        borderBottomWidth: 2,
        paddingBottom: 2,
    },
    linkText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default GameDayBanner;
