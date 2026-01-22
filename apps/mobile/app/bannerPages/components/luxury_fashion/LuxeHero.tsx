import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = 600;

interface LuxeHeroProps {
    data: {
        main_text: string;
        sub_text: string;
        special_offer_text: string;
        discount_text: string;
        button_text: string;
        images: {
            left: string;
            right: string;
        };
    };
}

export default function LuxeHero({ data }: LuxeHeroProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Left Image (Hidden on mobile usually in web code, but we can show part or just one on mobile. 
                Web code: hidden md:block for left, md:hidden for mobile left.
                Let's emulate the mobile layout from HTML: Left strip, Center content, Right strip? 
                Actually simpler: React Native mobile usually stacks.
                But the HTML suggests: 
                <div class="md:hidden w-[15%] h-full relative border-r ..."><img ...></div>
                <div class="flex-1 ... center content ..."></div>
                <div class="md:hidden w-[15%] h-full relative border-l ..."><img ...></div>
                
                So it's: [Img 15%] [Content 70%] [Img 15%]
            */}

            {/* Left Strip */}
            <View style={styles.sideStrip}>
                <Image source={{ uri: data.images.left }} style={styles.sideImage} />
                <View style={styles.overlay} />
            </View>

            {/* Center Content */}
            <View style={styles.centerContent}>
                <Text style={styles.smallText}>{data.special_offer_text}</Text>

                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>{data.main_text}</Text>
                    <Text style={styles.scriptText}>{data.sub_text}</Text>
                </View>

                <Text style={[styles.smallText, { marginTop: 16 }]}>{data.discount_text}</Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{data.button_text}</Text>
                </TouchableOpacity>
            </View>

            {/* Right Strip */}
            <View style={styles.sideStrip}>
                <Image source={{ uri: data.images.right }} style={styles.sideImage} />
                <View style={styles.overlay} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: HERO_HEIGHT,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    sideStrip: {
        width: '15%',
        height: '100%',
        position: 'relative',
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    sideImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    centerContent: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        paddingHorizontal: 8,
    },
    smallText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 3, // tracking-[0.3em]
        textTransform: 'uppercase',
        color: 'black',
        textAlign: 'center',
    },
    titleContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 0,
    },
    mainTitle: {
        fontSize: 90, // Adjusted from 120px for mobile width
        fontFamily: 'SixCaps_400Regular',
        color: 'black',
        textAlign: 'center',
        includeFontPadding: false,
        lineHeight: 90,
        transform: [{ scaleY: 1.5 }],
        letterSpacing: -2,
    },
    scriptText: {
        position: 'absolute',
        fontFamily: 'MrDafoe_400Regular',
        fontSize: 48, // text-6xl
        color: '#E60023', // primary
        transform: [{ rotate: '-12deg' }],
        zIndex: 20,
        top: '30%',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    button: {
        marginTop: 32,
        backgroundColor: 'black',
        paddingHorizontal: 32,
        paddingVertical: 12,
    },
    buttonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontFamily: 'Montserrat_700Bold',
    }
});
