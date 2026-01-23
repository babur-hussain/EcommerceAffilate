
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SchoolTwoBanner = ({ data }: { data: any }) => {
    // Theme colors
    const colors = {
        primary: "#FACC15", // Yellow-400
        primaryLight: "#FDE047", // Yellow-300
        bgGreen: "#155e48",
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.banner}
            >
                {/* Dashed Border Overlay */}
                <View style={styles.dashedBorder} pointerEvents="none" />

                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.bgGreen }]}>Back To School</Text>
                    <Text style={[styles.subtitle, { color: colors.bgGreen }]}>Get 50% OFF on all bundles</Text>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: colors.bgGreen }]}>
                        <Text style={styles.btnText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Decorative Icon */}
                <View style={styles.iconWrapper}>
                    <MaterialIcons name="school" size={64} color={colors.bgGreen} style={{ opacity: 0.9 }} />
                </View>

                {/* Decorative Shapes */}
                {/* <View style={styles.circle1} />
                <View style={styles.circle2} /> */}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    banner: {
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    dashedBorder: {
        position: 'absolute',
        top: 4,
        left: 4,
        right: 4,
        bottom: 4,
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'dashed',
        borderRadius: 12,
    },
    content: {
        zIndex: 10,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
        // fontFamily: 'Display'
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    btn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    btnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    iconWrapper: {
        paddingRight: 16,
        zIndex: 10,
    },
    circle1: {
        position: 'absolute',
        bottom: -24,
        right: -24,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        opacity: 0.2,
    },
    circle2: {
        position: 'absolute',
        top: -24,
        left: -24,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        opacity: 0.2,
    },
});

export default SchoolTwoBanner;
