
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const SchoolThreeBanner = ({ data }: { data: any }) => {
    // Theme colors
    const colors = {
        secondary: "#007ea7", // Teal
        accent: "#FDE74C", // Yellow
    };

    return (
        <View style={styles.container}>
            <View style={[styles.banner, { backgroundColor: colors.accent }]}>
                {/* Decorative Circles */}
                <View style={styles.circle1} />
                <View style={styles.circle2} />

                <View style={styles.content}>
                    <View style={styles.badge}>
                        <Text style={[styles.badgeText, { color: colors.secondary }]}>NEW ARRIVAL</Text>
                    </View>
                    <Text style={[styles.title, { color: colors.secondary }]}>Eco Backpacks</Text>
                    <Text style={[styles.subtitle, { color: 'rgba(0, 126, 167, 0.8)' }]}>
                        Recycled materials, durable design.
                    </Text>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: colors.secondary }]}>
                        <Text style={styles.btnText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDKkIuLeGW0-sUDIDXL2DPs44SVN6y4O_kyPE2ADOopxKXEGMIpzSaCXaJvYqDfIzQZp7SMNMKvQkd8BoHtdp5egnkZTOdE7HyXV6hsg7pWXawL5zYJh89enDiL18_cgVaj0HlBJ3TMAzjaTR2zgAxHbcLOoSv2BUE1urfl-XXJnhHO0zMvJ-qZCE93HIJcFOuiaYRInlI_XyVrKAft402uDpeOwDKxydwC7jzl0h265I1FKgQqnsOYK-EgLzM6yJN2HSJdk_wQEdI" }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 16,
    },
    banner: {
        borderRadius: 16,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    circle1: {
        position: 'absolute',
        top: -10,
        right: 48,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    circle2: {
        position: 'absolute',
        bottom: -24,
        right: -24,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    content: {
        flex: 1,
        paddingRight: 16,
        zIndex: 10,
    },
    badge: {
        backgroundColor: 'white',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold', // Display font simulation
        lineHeight: 28,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 12,
    },
    btn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    btnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    imageWrapper: {
        width: 96,
        height: 96,
        zIndex: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        transform: [{ rotate: '-10deg' }],
    },
});

export default SchoolThreeBanner;
