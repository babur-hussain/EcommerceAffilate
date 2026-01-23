
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const SaleFeedHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#52665F", // Deep Green
        secondary: "#8DA866", // Light Green
        bgLight: "#F2F4F3",
        bgDark: "#121816",
        textLight: "#FFFFFF",
        textDark: "#F3F4F6",
        dotWhite: "rgba(255,255,255,0.4)",
    };

    return (
        <View style={styles.container}>
            <View style={[styles.headerBg, { backgroundColor: colors.primary }]}>
                {/* Decorative Overlays */}
                <View style={[styles.blob1, { backgroundColor: colors.secondary }]} />
                <View style={[styles.blob2, { backgroundColor: colors.secondary }]} />

                {/* Dot patterns simulated */}
                <View style={[styles.dotPattern1, { borderColor: colors.dotWhite }]} />
                <View style={[styles.dotPattern2, { borderColor: colors.dotWhite }]} />

                {/* Navbar */}
                <View style={styles.navbar}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="search" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>FURNITURE{'\n'}SALE!</Text>
                    <TouchableOpacity style={styles.ctaButton}>
                        <Text style={[styles.ctaText, { color: colors.primary }]}>SHOP NOW</Text>
                    </TouchableOpacity>
                </View>

                {/* Floating Images (Overlapping Bottom) */}
                <View style={styles.imageContainer}>
                    {/* Transforming images to simulate the layout */}
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYOymJQS__w0fwplHjTrSMeEIi27_nf877K8fpGOKSslYbL1aQzgd_e_6ymt7PKvRUeO2WcO_YeXMyVgrme2GPiAlaDpYDFfJzIr1BLCv-vZ6iBq-fzb0u16AxFUbm99FeMVi0Di28-rpQNB96vbwM8enzDxwvSG0xqDcZedMhrUObslIvyFqZkCt5nyMJY-55Z3httCe3u2QkIn7OqIjWQBseADVqVTUIXEr6k5tlOuPRIu8_o4o-A1jhNSsCUBvKAuJvtNTqsRPr" }}
                        style={styles.chairImage1}
                        resizeMode="contain"
                    />
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHJu1b7UvmaeS_DX72Up9rlLXbTJc-S67KfRIhBhDfG7dvtoTk8g-oOQ-qQkmzflRafY35srXoJ3TZBSpq7a9eJgtVvSqbj083sLXa7uk2gj5KkYtZP2HCdoiNyNOvWjdB36NngakXkGnyAAUreMPc5asay55UCO67Q4R5wrJ8iqN6MaGJbhVERGYfDj2yjJK1iBmCc-GPrWExZjE0lSPu2GeLQKWsa0m5np-4ESvms7MERUuhYh5G1P2IARvIx-9OeMJYf73bbeTt" }}
                        style={styles.chairImage2}
                        resizeMode="contain"
                    />
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
        height: 420,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        position: 'relative',
        overflow: 'hidden',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 10 },
        // shadowOpacity: 0.1,
        // elevation: 10,
    },
    blob1: {
        position: 'absolute',
        top: -40,
        left: -40,
        width: 192,
        height: 192,
        borderRadius: 96,
        opacity: 0.8,
        // simple circle as fallback for irregular shapes
    },
    blob2: {
        position: 'absolute',
        bottom: 80,
        right: 40,
        width: 256,
        height: 256,
        borderRadius: 128,
        opacity: 0.6,
        transform: [{ scaleX: 1.5 }], // rudimentary blob
    },
    dotPattern1: {
        position: 'absolute',
        top: 40,
        left: 16,
        width: 96,
        height: 96,
        borderStyle: 'dotted',
        borderWidth: 2,
        opacity: 0.5,
        // RN doesn't do "background radial gradient dots" easily without SVG. 
        // Using dotted border wrapper as placeholder for texture
    },
    dotPattern2: {
        position: 'absolute',
        bottom: 128,
        right: 16,
        width: 64,
        height: 192,
        borderStyle: 'dotted',
        borderWidth: 2,
        opacity: 0.5,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 50, // Safe area
        zIndex: 50,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 32,
        zIndex: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: 'white',
        lineHeight: 48,
        marginBottom: 24,
    },
    ctaButton: {
        backgroundColor: 'white',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    ctaText: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    imageContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: 260,
        pointerEvents: 'none',
        zIndex: 10,
    },
    chairImage1: {
        position: 'absolute',
        bottom: 48,
        right: -20,
        width: 160,
        height: 200,
        transform: [{ rotate: '-5deg' }],
        zIndex: 20,
    },
    chairImage2: {
        position: 'absolute',
        bottom: -40,
        left: -20,
        width: 320,
        height: 240, // rough aspect
        zIndex: 30,
        // mix-blend modes unavailable in RN standard Image component without specialized libraries
    },
});

export default SaleFeedHeader;
