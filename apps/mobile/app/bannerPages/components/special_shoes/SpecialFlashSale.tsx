
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SpecialFlashSale = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#C62828", // Deep Red
    };

    return (
        <View style={styles.container}>
            <View style={[styles.banner, { backgroundColor: isDarkMode ? '#1F2937' : 'black' }]}>
                {/* Texture overlay simulation */}
                <View style={[styles.overlay, { opacity: 0.1, backgroundColor: colors.primary }]} />

                <View style={styles.content}>
                    <View style={styles.textColumn}>
                        <Text style={styles.title}>FLASH SALE</Text>
                        <Text style={styles.offer}>Get 50% off on second pair</Text>
                        <TouchableOpacity style={styles.codeBtn}>
                            <Text style={[styles.codeBtnText, { color: colors.primary }]}>GRAB CODE</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Background Image / Texture */}
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPwRRquMhMk5L04yCVblT7ve_TQhccaKPsGQct4nFVGFWpNmpKA4C-3QI_IzW57ZfIeUnJ1a_cdiWO8rr-M8341zdyse7dM2359qGgU5s3gvX56K9V5vDp4b-uKRZloCB3bcIDXnRoKbZ6gnVeOMIqo20NZssEO3BfESf2gr6TtaJOrvOs_2U9IYKGBUocOQhy3JDrSXewzoBPGWtm9zxqt03T0kQdgeT6YRBlkoKQ6Aaufegs6Lp-g4t1hUNRDIu6Lh_tjTQ6GEai" }}
                        style={styles.bgImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={isDarkMode ? ['#1F2937', 'transparent'] : ['black', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFill}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 32, // More space before footer
        paddingBottom: 64, // Safe area for footer
    },
    banner: {
        height: 128, // h-32
        borderRadius: 16,
        flexDirection: 'row',
        position: 'relative',
        overflow: 'hidden',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        paddingLeft: 24,
        justifyContent: 'center',
        zIndex: 20,
    },
    textColumn: {
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold', // italic handled if font supports
        fontStyle: 'italic',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    offer: {
        fontSize: 12,
        color: '#E5E7EB', // gray-200
        marginBottom: 12,
    },
    codeBtn: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    codeBtnText: {
        fontSize: 12, // xs
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    imageWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '50%',
        zIndex: 10,
    },
    bgImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
});

export default SpecialFlashSale;
