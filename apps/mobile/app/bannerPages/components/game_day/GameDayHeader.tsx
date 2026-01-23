
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const GameDayHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme Colors
    const colors = {
        primary: "#D4FF3E", // Lime
        secondary: "#00B4D8", // Cyan
        tertiary: "#023E8A", // Deep Teal
        bgLight: "#F3F4F6",
        bgDark: "#111827",
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <LinearGradient
                    colors={[colors.tertiary, colors.secondary, '#22D3EE']} // to-cyan-400 equivalent
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBg}
                />

                {/* Decorative Shapes */}
                <View style={[styles.shape1, { backgroundColor: colors.primary }]} />
                <View style={[styles.shape2, { backgroundColor: '#1E3A8A' }]} />

                {/* Navbar */}
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <MaterialIcons name="arrow-back-ios" size={18} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.iconBtn}>
                        <MaterialIcons name="shopping-bag" size={20} color="white" />
                        <View style={[styles.badge, { backgroundColor: colors.primary, borderColor: colors.tertiary }]} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.mainTitle}>
                        <Text style={styles.italicText}>GAME</Text>{'\n'}
                        <Text style={styles.italicText}>DAY</Text>
                    </Text>

                    <View style={styles.subContent}>
                        <View style={[styles.tag, { backgroundColor: colors.primary }]}>
                            <Text style={[styles.tagText, { color: colors.tertiary }]}>2025 Season</Text>
                        </View>
                        <Text style={styles.collectionText}>COLLECTION</Text>
                    </View>
                </View>

                {/* Hero Image */}
                <Image
                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk79NnXjkgOX1Vt4OuMy973qDJgcLNdQdTnrDnNkc6HxRUWpst4yLzYSSlTqp2APiskIeMo1eoYPpoXmaAJG1BpUcVAii-9On1HW9qRRULU8s1e3RG19aHjLbtU26_XxiGOLazjSkbVQOVwXN0yUeOkue6Z_tWaY4nYSpq6UCAg5BSS3xCAl_rbMpBOmIejuNQcFL9O16HsyEfFPUeQBjoIrZPTJd2lqDJyCTpvp7ggqrga2JhPMUk-5Dpw6CQSZcPl6KF0f2-57vS" }}
                    style={styles.heroImage}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    headerWrapper: {
        height: 290, // Increased height
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    gradientBg: {
        ...StyleSheet.absoluteFillObject,
    },
    shape1: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '66%',
        height: '100%',
        opacity: 0.2,
        transform: [{ skewX: '-12deg' }, { translateX: 80 }],
    },
    shape2: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '50%',
        height: '50%',
        opacity: 0.3,
        transform: [{ skewX: '12deg' }, { translateX: -40 }],
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 54, // Increased padding
        paddingHorizontal: 24,
        marginBottom: 16,
        zIndex: 20,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
    },
    content: {
        paddingHorizontal: 24,
        zIndex: 10,
    },
    mainTitle: {
        fontSize: 56,
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 56,
        opacity: 0.9,
    },
    italicText: {
        fontStyle: 'italic',
    },
    subContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    tagText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    collectionText: {
        color: 'white',
        fontSize: 18, // xl
        fontWeight: 'bold', // simplified for display font
        letterSpacing: 4, // tracking-widest
    },
    heroImage: {
        position: 'absolute',
        bottom: 0,
        right: -20,
        height: '90%',
        width: '60%', // Adjust to fit
    },
});

export default GameDayHeader;
