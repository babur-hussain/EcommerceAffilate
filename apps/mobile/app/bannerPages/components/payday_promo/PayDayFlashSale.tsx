
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PayDayFlashSale = ({ data }: { data: any }) => {
    // Theme colors
    const colors = {
        primary: "#4FA960", // Vibrant Green
        secondary: "#1B4B63", // Teal/Blue
    };

    return (
        <View style={styles.container}>
            <View style={styles.banner}>
                {/* Background overlay */}
                <View style={[styles.overlay, { backgroundColor: colors.secondary }]} />

                <View style={styles.content}>
                    <View style={styles.leftCol}>
                        <Text style={styles.title}>
                            FLASH{'\n'}SALE
                        </Text>
                        <Text style={styles.timer}>Ending in 02:45:12</Text>
                        <TouchableOpacity style={styles.shopBtn}>
                            <Text style={styles.btnText}>Shop Now</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.rightCol}>
                        <MaterialIcons
                            name="bolt"
                            size={80}
                            color={colors.primary}
                            style={styles.icon}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 96, // Space for footer
    },
    banner: {
        backgroundColor: '#111827', // gray-900
        borderRadius: 12, // xl
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    leftCol: {
        flex: 2,
    },
    rightCol: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        fontStyle: 'italic',
        lineHeight: 24,
        marginBottom: 4,
    },
    timer: {
        color: '#D1D5DB', // gray-300
        fontSize: 12,
        marginBottom: 12,
    },
    shopBtn: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    btnText: {
        fontSize: 12, // xs
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
    },
    icon: {
        opacity: 0.8,
        transform: [{ rotate: '-15deg' }],
    },
});

export default PayDayFlashSale;
