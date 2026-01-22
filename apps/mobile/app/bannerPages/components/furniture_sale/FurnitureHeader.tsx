import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface FurnitureHeaderProps {
    data: {
        season_text: string;
        title_main: string;
        title_italic: string;
        discount_text: {
            prefix: string;
            value: string;
            suffix: string;
        };
        collection_name: string[];
        image_url: string;
        price_tag: string;
    };
}

export default function FurnitureHeader({ data }: FurnitureHeaderProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="menu" size={24} color="#4A3B32" />
                </TouchableOpacity>
                <Text style={styles.brand}>LUSSO</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="shopping-bag" size={24} color="#4A3B32" />
                    <View style={styles.dot} />
                </TouchableOpacity>
            </View>

            {/* Hero Section */}
            <View style={styles.heroSection}>
                <LinearGradient
                    colors={['#F5F5F4', 'rgba(245, 245, 244, 0)']}
                    style={styles.gradientBg}
                >
                    <Text style={styles.seasonText}>{data.season_text}</Text>
                    <Text style={styles.heroTitle}>
                        {data.title_main} <Text style={{ fontFamily: 'PlayfairDisplay_400Regular_Italic', fontWeight: 'normal' }}>{data.title_italic}</Text>
                    </Text>
                </LinearGradient>

                <View style={styles.imageWrapper}>
                    {/* Floating Discount Card */}
                    <View style={styles.discountCard}>
                        {/* Background Blurs */}
                        <View style={styles.blurCircleLeft} />
                        <View style={styles.blurCircleRight} />

                        <View style={styles.discountLeft}>
                            <Text style={styles.discountPrefix}>{data.discount_text.prefix}</Text>
                            <Text style={styles.discountValue}>{data.discount_text.value}</Text>
                            <Text style={styles.discountSuffix}>{data.discount_text.suffix}</Text>
                        </View>

                        <View style={styles.discountRight}>
                            <Text style={styles.collectionName}>
                                {data.collection_name.map((line, i) => <Text key={i}>{line}{'\n'}</Text>)}
                            </Text>
                            <View style={styles.limitedTag}>
                                <Text style={styles.limitedText}>LIMITED</Text>
                            </View>
                        </View>
                    </View>

                    {/* Main Image */}
                    <View style={styles.mainImageContainer}>
                        <Image source={{ uri: data.image_url }} style={styles.mainImage} />

                        {/* Price Tag */}
                        <View style={styles.priceTag}>
                            <Text style={styles.price}>{data.price_tag}</Text>
                            <MaterialIcons name="arrow-forward" size={14} color="#8D7B6F" />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FDFBF7', // background-light
        paddingBottom: 24,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 48,
        paddingHorizontal: 24,
        paddingBottom: 16,
        backgroundColor: 'rgba(253, 251, 247, 0.9)',
        zIndex: 50,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brand: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 20,
        color: '#9F6B08', // primary
        letterSpacing: 1,
    },
    dot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#9F6B08',
        borderWidth: 2,
        borderColor: '#FDFBF7',
    },
    heroSection: {
        position: 'relative',
        marginBottom: 24,
    },
    gradientBg: {
        paddingTop: 32,
        paddingBottom: 128, // space for image overlap
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    seasonText: {
        color: '#9F6B08',
        fontWeight: '500',
        fontSize: 12, // xs
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    heroTitle: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 40, // ~4xl
        color: '#4A3B32',
        textAlign: 'center',
        lineHeight: 44,
    },
    imageWrapper: {
        paddingHorizontal: 16,
        marginTop: -96, // Negative margin to pull up
        position: 'relative',
        width: '100%',
        alignItems: 'center',
    },
    discountCard: {
        position: 'absolute',
        top: 0,
        left: 16,
        right: 16,
        height: 128,
        backgroundColor: '#9F6B08', // primary
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        overflow: 'hidden',
        zIndex: 0,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    blurCircleLeft: {
        position: 'absolute',
        left: -16,
        bottom: -32,
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(255,255,255,0.1)',
        zIndex: -1,
    },
    blurCircleRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'rgba(0,0,0,0.05)',
        zIndex: -1,
    },
    discountLeft: {
        zIndex: 10,
    },
    discountPrefix: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },
    discountValue: {
        color: 'white',
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 36,
        lineHeight: 36,
    },
    discountSuffix: {
        color: 'white',
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 24,
        lineHeight: 24,
    },
    discountRight: {
        zIndex: 10,
        alignItems: 'flex-end',
    },
    collectionName: {
        color: 'white',
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 18,
        lineHeight: 20,
        textAlign: 'right',
    },
    limitedTag: {
        marginTop: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    limitedText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    mainImageContainer: {
        marginTop: 48, // Push down below discount card top
        zIndex: 20,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    mainImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        transform: [{ scale: 1.1 }],
    },
    priceTag: {
        position: 'absolute',
        bottom: -8,
        right: 16,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F5F5F4',
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    price: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9F6B08',
    }
});
