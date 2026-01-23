
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CenterHotDeals = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#314CB6", // Royal Blue
        textMainLight: "#1E293B",
        textMainDark: "#FFFFFF",
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: isDarkMode ? 'white' : colors.textMainLight }]}>
                Hot Deals 🔥
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Deal 1 */}
                <LinearGradient
                    colors={['#314CB6', '#3B82F6']} // primary to blue-500
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.card}
                >
                    {/* Decorative circles */}
                    <View style={[styles.circle, styles.circle1]} />
                    <View style={[styles.circle, styles.circle2]} />

                    <View style={styles.content}>
                        <View style={styles.badgeWrapper}>
                            <Text style={styles.badgeText}>Limited Time</Text>
                        </View>
                        <Text style={styles.dealTitle}>
                            Nike Air{'\n'}Zoom Pegasus
                        </Text>
                        <Text style={styles.dealSub}>30% OFF</Text>
                    </View>

                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvMUOm3Nx5l9cn0inqmwPci9wpK8_7Yju-NSgUKKXEDSIcufTg9XCFsNxLF0pH9o6BJFiRc-SLVwVUySi7jxhExcFL5Oi3mj-fNULQsqjnmeFCdp-OcGlzIi4XXnsx5-7QuCKWuXKrWwY9rxHB5Ixo96B-BOQ3WDfeYlGZ8CH6XBJQk7ggdDeiY352yRFQK9q-IasyCE6bfuVSHJXg-HmCp5_0xf6H2KbxiHQ0ZxTKrMdZlnjpX7paxIQz_Yp3vPupFDrARhcaTcv_" }}
                        style={[styles.image, { transform: [{ rotate: '-15deg' }] }]}
                        resizeMode="contain"
                    />
                </LinearGradient>

                {/* Deal 2 */}
                <LinearGradient
                    colors={isDarkMode ? ['#334155', '#475569'] : ['#1E293B', '#334155']} // slate-800/700
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.card}
                >
                    {/* Decorative circles */}
                    <View style={[styles.circle, styles.circle1, { opacity: 0.05 }]} />

                    <View style={styles.content}>
                        <View style={styles.badgeWrapper}>
                            <Text style={styles.badgeText}>New Arrival</Text>
                        </View>
                        <Text style={styles.dealTitle}>
                            Pro Wilson{'\n'}Racket Set
                        </Text>
                        <Text style={styles.dealSub}>$129.99</Text>
                    </View>

                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCImybPSSWG3Ydm3wh_8YQOAMKTXl_zPq5RGl2iC4B5oTBNBt8lpx-TfIUpFWqNWN-vCjwqjRrROwEyvbajIR9BQoENI1YH1Qr61396eHpIXRd4bH7ewUEbdf3d_kXaZJfSCYzuGceWxLNgmJIpkAivHw94hXGCYh0IDIwV_i6MQ0vWot6P-CZ2wChZMg7gE6LmP3PiZlfP20DyoO6MPdNx6spErZFfa_f9htGdX050NXQdQZ9sZGFU9tGm33Cz_N6lkeBZL5fqyTOk" }}
                        style={[styles.image, { transform: [{ rotate: '15deg' }] }]}
                        resizeMode="contain"
                    />
                </LinearGradient>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        paddingLeft: 24,
        paddingBottom: 32, // More space before footer
        marginBottom: 80, // Safe area for footer
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    scrollContent: {
        paddingRight: 24,
        gap: 16,
    },
    card: {
        width: 280,
        height: 144, // 36 * 4
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 999,
        opacity: 0.1,
    },
    circle1: {
        right: -40,
        top: -40,
        width: 160,
        height: 160,
    },
    circle2: {
        right: -20,
        bottom: -40,
        width: 128,
        height: 128,
    },
    content: {
        zIndex: 10,
        flex: 1, // Allow text to take up space
    },
    badgeWrapper: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    badgeText: {
        color: 'white',
        fontSize: 10, // xs
        fontWeight: '600',
    },
    dealTitle: {
        fontSize: 18, // xl
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 22,
    },
    dealSub: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    image: {
        height: 96, // h-24
        width: 96,
        zIndex: 10,
    },
});

export default CenterHotDeals;
