import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import CachedImage from '../../shared/CachedImage';
import api from '../../../../src/lib/api';

const { width } = Dimensions.get('window');

/**
 * Grand Mobiles Sale Layout (Banner ID: 5)
 * 
 * Implements the "Betul's Exclusive" design.
 * Features:
 * - Vibrant gradient hero section with phone carousel
 * - Shop by Brand section (Dynamic Subcategories from Mobiles Category)
 * - Trending Now iPhone 15 series card
 */
export default function GrandMobilesSaleLayout() {
    const [subCategories, setSubCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch ALL categories and filter for Mobiles (ID: 69680eb93e452f159339f524)
                // The API returns a flat list, so we must filter by parentCategory.
                const response = await api.get('/api/categories');

                if (Array.isArray(response.data)) {
                    const mobileSubCategories = response.data.filter((cat: any) => cat.parentCategory === '69680eb93e452f159339f524');
                    console.log('Filtered Mobile Subcategories:', mobileSubCategories.length);
                    setSubCategories(mobileSubCategories);
                }
            } catch (error) {
                console.error('Error fetching mobile subcategories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Header Content is handled by the parent page now, we just render the main body */}

            {/* Hero Section */}
            <View style={styles.heroSectionWrapper}>
                <LinearGradient
                    colors={['#4FB0AE', '#D4E2D4', '#FFD670', '#FF9248']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0, 0.4, 0.7, 1]}
                    style={styles.heroGradient}
                >
                    {/* Sparkle Icons */}
                    <MaterialIcons name="auto-awesome" size={24} color="#001B44" style={[styles.sparkle, styles.sparkle1]} />
                    <MaterialIcons name="auto-awesome" size={24} color="#001B44" style={[styles.sparkle, styles.sparkle2]} />
                    <MaterialIcons name="auto-awesome" size={24} color="#001B44" style={[styles.sparkle, styles.sparkle3]} />

                    <Text style={styles.heroPreTitle}>Betul's Exclusive</Text>
                    <Text style={styles.heroTitle}>GRAND MOBILES{'\n'}SALE</Text>

                    <TouchableOpacity style={styles.heroButton} activeOpacity={0.8}>
                        <Text style={styles.heroButtonText}>GRAB NOW</Text>
                    </TouchableOpacity>

                    <View style={styles.heroImagesContainer}>
                        {/* Using the specific images from the design or fallbacks */}
                        <Image
                            source={{ uri: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768747996/17pro_deepblue_mzhis0.png' }}
                            style={[styles.phoneImage, styles.phone1]}
                            resizeMode="cover"
                        />
                        <Image
                            source={{ uri: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768748192/samsung-galaxy-s25-ultra-front-and-back-1_zaqglc.png' }}
                            style={[styles.phoneImage, styles.phone2]}
                            resizeMode="cover"
                        />
                    </View>
                </LinearGradient>
            </View>

            {/* Shop by Brand Section */}
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Shop by Brand</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.brandsScrollContent}
                    style={styles.brandsScroll}
                >
                    {subCategories.length > 0 ? (
                        subCategories.map((sub, index) => (
                            <BrandItem
                                key={sub._id || index}
                                image={sub.image || sub.icon}
                                name={sub.name}
                            />
                        ))
                    ) : (
                        // Fallback/Loading State
                        <>
                            <BrandItem name="Loading..." library="MaterialIcons" icon="more-horiz" />
                        </>
                    )}
                </ScrollView>
            </View>

            {/* Trending Now Section */}
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
                <Text style={styles.sectionTitle}>Trending Now</Text>
                <View style={[styles.trendingCard, { backgroundColor: '#FFEBEB' }]}>
                    <View style={styles.trendingContent}>
                        <Text style={styles.newArrivalTag}>NEW ARRIVAL</Text>
                        <Text style={styles.trendingTitle}>iPhone 15{'\n'}Series</Text>
                        <Text style={styles.trendingSubtitle}>Save up to 20% today</Text>
                        <TouchableOpacity style={styles.exploreButton}>
                            <Text style={styles.exploreButtonText}>Explore</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVV4YQT7IkJity6Ll4xYYghfXwEIIkTuqN-tN8iFCCYUakCOEcQuw4-oimostQWNU6COhUpptI2X5yR4gsFmNKmN8HYJE5iGnMX0pOgHBKx7pxq7PrYjzbc9zK6FoXhCSp8f3sDye0IOeWnTK_bmys5g1watgJWkCIXOdrZMmY6d_JI_X4jzVYILVz0XFQOXUBBTMxbANODeO84DENHZ3mg6nFH0Ll7feupW-r1PKtePcnKh1ZhPOaSdy_h0yz5LdEyff6-IbvM7sO' }}
                        style={styles.trendingImage}
                        resizeMode="contain"
                    />
                </View>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const BrandItem = ({ image, name, icon, library }: { image?: string, name: string, icon?: string, library?: any }) => (
    <View style={styles.brandItem}>
        <View style={styles.brandIconContainer}>
            {image ? (
                <CachedImage source={{ uri: image }} style={styles.brandImage} contentFit="contain" />
            ) : (
                <MaterialIcons name={icon as any || 'image'} size={28} color="#001B44" />
            )}
        </View>
        <Text style={styles.brandName} numberOfLines={1}>{name}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    contentContainer: {
        paddingBottom: 40,
    },
    heroSectionWrapper: {
        margin: 16,
        marginTop: 8,
        borderRadius: 32,
        overflow: 'hidden',
        minHeight: 500,
    },
    heroGradient: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 500,
        ...StyleSheet.absoluteFillObject,
    },
    sparkle: {
        position: 'absolute',
        opacity: 0.8,
    },
    sparkle1: { top: 48, left: 40 },
    sparkle2: { top: 128, right: 48, opacity: 0.4 },
    sparkle3: { bottom: 160, left: 64 },
    heroPreTitle: {
        color: '#001B44',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.5,
        zIndex: 10,
    },
    heroTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: '#001B44',
        textAlign: 'center',
        lineHeight: 46,
        marginBottom: 32,
        zIndex: 10,
    },
    heroButton: {
        borderWidth: 2,
        borderColor: '#001B44',
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginBottom: 48,
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    heroButtonText: {
        color: '#001B44',
        fontWeight: '900',
        fontSize: 18,
        letterSpacing: 2,
    },
    heroImagesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: '100%',
        marginTop: 20,
        gap: 4,
    },
    phoneImage: {
        width: width * 0.40,
        borderRadius: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    phone1: { height: 160, transform: [{ translateY: 8 }] },
    phone2: { height: 160, transform: [{ translateY: 8 }] },

    sectionContainer: {
        marginTop: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    seeAllText: {
        color: '#001B44',
        fontSize: 14,
        fontWeight: '600',
    },
    brandsScroll: {
        flexGrow: 0,
    },
    brandsScrollContent: {
        paddingHorizontal: 24,
        gap: 16,
    },
    brandItem: {
        alignItems: 'center',
        gap: 8,
        width: 70,
    },
    brandIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
    },
    brandImage: {
        width: '60%',
        height: '60%',
    },
    brandName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
        textAlign: 'center',
    },
    trendingCard: {
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    trendingContent: {
        flex: 1,
    },
    newArrivalTag: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#EF4444',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    trendingTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A',
        lineHeight: 28,
    },
    trendingSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
    },
    exploreButton: {
        marginTop: 16,
        backgroundColor: '#001B44',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 99,
        alignSelf: 'flex-start',
    },
    exploreButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    trendingImage: {
        width: 120,
        height: 120,
    },
});
