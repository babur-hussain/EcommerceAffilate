import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GirlsFashionHeroProps {
    data: {
        main_heading: string;
        main_subheading: string;
        collection_name: string;
        images: {
            top_main: string;
            bottom_left: string;
            bottom_right: string;
        };
        offer?: {
            value: string;
            label: string;
        }
    };
}

export default function GirlsFashionHero({ data }: GirlsFashionHeroProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Top Grid Area (Equivalent to h-64 grid) */}
            <View style={styles.topSection}>
                {/* Left Text Box */}
                <View style={styles.textBox}>
                    <View style={styles.glowCircle} />
                    <View style={styles.textContent}>
                        <Text style={styles.heading}>
                            {data.main_heading}
                            {'\n'}
                            <Text style={styles.subheading}>{data.main_subheading}</Text>
                        </Text>
                        <Text style={styles.collectionName}>{data.collection_name}</Text>
                    </View>
                </View>

                {/* Right Image */}
                <View style={styles.topImageContainer}>
                    <Image source={{ uri: data.images.top_main }} style={styles.image} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.3)']}
                        style={StyleSheet.absoluteFillObject}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0.5 }}
                    />
                </View>
            </View>

            {/* Bottom Grid Area (Equivalent to h-80 grid) */}
            <View style={styles.bottomSection}>
                {/* Bottom Left Image */}
                <View style={styles.bottomLeftImage}>
                    <Image source={{ uri: data.images.bottom_left }} style={styles.image} />
                </View>

                {/* Bottom Right Column */}
                <View style={styles.bottomRightCol}>
                    {/* Offer Box */}
                    <View style={styles.offerBox}>
                        <Text style={styles.offerValue}>{data.offer?.value || '50%'}</Text>
                        <Text style={styles.offerLabel}>{data.offer?.label || 'OFF'}</Text>
                        <TouchableOpacity style={styles.shopButton}>
                            <Text style={styles.shopButtonText}>Shop Now</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Small Bottom Right Image */}
                    <View style={styles.bottomRightImage}>
                        <Image source={{ uri: data.images.bottom_right }} style={styles.image} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        gap: 12,
    },
    topSection: {
        flexDirection: 'row',
        height: 256, // h-64
        gap: 12,
    },
    textBox: {
        flex: 7, // col-span-7
        backgroundColor: '#F5F1E8',
        borderRadius: 2,
        padding: 16,
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    glowCircle: {
        position: 'absolute',
        top: -40,
        left: -40,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'white',
        opacity: 0.5,
    },
    textContent: {
        zIndex: 10,
    },
    heading: {
        fontSize: 48,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: '#111827',
        lineHeight: 48,
    },
    subheading: {
        fontFamily: 'PlayfairDisplay_400Regular_Italic', // Italic light
        fontWeight: '300',
    },
    collectionName: {
        marginTop: 8,
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: '#6B7280',
    },
    topImageContainer: {
        flex: 5, // col-span-5
        borderRadius: 2,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    bottomSection: {
        flexDirection: 'row',
        height: 320, // h-80
        gap: 12,
    },
    bottomLeftImage: {
        flex: 6, // col-span-6
        borderRadius: 2,
        overflow: 'hidden',
    },
    bottomRightCol: {
        flex: 6, // col-span-6
        gap: 12,
    },
    offerBox: {
        flex: 1,
        backgroundColor: 'rgba(210, 180, 140, 0.2)', // accent-tan/20
        borderWidth: 1,
        borderColor: 'rgba(210, 180, 140, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
    },
    offerValue: {
        fontSize: 36,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: '#111827',
    },
    offerLabel: {
        fontSize: 24,
        fontFamily: 'PlayfairDisplay_400Regular_Italic',
        color: '#374151',
    },
    shopButton: {
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#8B0000', // primary
        paddingBottom: 2,
    },
    shopButtonText: {
        fontSize: 10,
        fontFamily: 'Lato_700Bold',
        letterSpacing: 2,
        color: '#8B0000',
        textTransform: 'uppercase',
    },
    bottomRightImage: {
        height: 128, // h-32
        borderRadius: 2,
        overflow: 'hidden',
    }
});
