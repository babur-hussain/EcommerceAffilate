import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import api from '../../../../lib/api';
import ProductCard from '../../ProductCard';
import CategoryBannerSlider from '../../CategoryBannerSlider';

const { width } = Dimensions.get('window');

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string;
}

interface SportsPageProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function SportsPage({ staticHeader, renderStickyHeader }: SportsPageProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Scroll tracking
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    // Use 'sports' slug for category/subcategory endpoints as defined in category.route.ts
    const categorySlug = 'sports';
    const categoryName = 'Sports';

    // ID for reference if needed, but routes use slug
    // const categoryId = '695ff7de3f61939001a06380'; 

    useEffect(() => {
        fetchCategoryData();
    }, []);

    const fetchCategoryData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Category Details (for posters/banners)
            try {
                // Backend expects /categories/:slug
                const categoryResponse = await api.get(`/api/categories/${categorySlug}`);
                if (categoryResponse.data && categoryResponse.data.posters && categoryResponse.data.posters.length > 0) {
                    setBanners(categoryResponse.data.posters);
                }
            } catch (e) {
                console.log(`Category details fetch failed for ${categoryName}`, e);
            }

            // 2. Fetch Subcategories
            try {
                // Backend expects /categories/:slug/subcategories
                const subcategoriesResponse = await api.get(`/api/categories/${categorySlug}/subcategories`);
                if (Array.isArray(subcategoriesResponse.data) && subcategoriesResponse.data.length > 0) {
                    setSubcategories(subcategoriesResponse.data);
                } else {
                    // Fallback to query param if generic endpoint used (query param logic in category.route uses _id usually, but let's stick to slug route first)
                    // If slug route fails, simple generic fetch might work if we had the ID, but slug route is preferred.
                    console.log('No subcategories found via slug route');
                }
            } catch (e) {
                console.log(`Subcategories fetch failed for ${categoryName}`, e);
            }

            // 3. Fetch Products
            // Products are likely tagged with the Category NAME "Sports" or the ID. 
            // Based on FashionPage using "Fashion", we use "Sports".
            const productsResponse = await api.get(`/api/products?category=${categoryName}&limit=10`);
            const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : (productsResponse.data.products || []);
            setProducts(productsData);

        } catch (error) {
            console.error(`Error fetching data for ${categoryName}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        if (headerHeight > 0) {
            setIsSticky(scrollY > headerHeight - 10);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[1]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
                {staticHeader}
            </View>
            <View>{renderStickyHeader ? renderStickyHeader(isSticky) : null}</View>

            <View style={styles.contentContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF6F00" />
                    </View>
                ) : (
                    <>
                        {/* 1. Banners Slider */}
                        <CategoryBannerSlider banners={banners} />

                        {/* 2. Subcategories Grid (Horizontal 2 Rows - Fashion Style) */}
                        {subcategories.length > 0 && (
                            <View style={styles.subcategoriesSection}>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.horizontalScrollContent}
                                >
                                    {/* Helper to chunk into pairs for 2 rows */
                                        Array.from({ length: Math.ceil(subcategories.length / 2) }).map((_, colIndex) => {
                                            const pair = subcategories.slice(colIndex * 2, colIndex * 2 + 2);
                                            return (
                                                <View key={colIndex} style={styles.columnWrapper}>
                                                    {pair.map((sub) => (
                                                        <TouchableOpacity
                                                            key={sub._id}
                                                            style={styles.subcategoryItem}
                                                            onPress={() => router.push(`/common-category/${sub.slug}`)}
                                                        >
                                                            <View style={styles.subcategoryIconContainer}>
                                                                {sub.image || sub.icon ? (
                                                                    <Image
                                                                        source={{ uri: sub.image || sub.icon }}
                                                                        style={styles.subcategoryImage}
                                                                    />
                                                                ) : (
                                                                    <View style={[styles.subcategoryImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                                                                        <Text style={{ fontSize: 20 }}>⚽</Text>
                                                                    </View>
                                                                )}
                                                            </View>
                                                            <Text style={styles.subcategoryName} numberOfLines={2}>
                                                                {sub.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            );
                                        })}
                                </ScrollView>
                            </View>
                        )}

                        {/* Cricket Season Kick Off Section */}
                        <View style={styles.cricketSection}>
                            <TouchableOpacity onPress={() => router.push('/sports/collection/cricket-season')}>
                                <Text style={styles.sectionTitleBlack}>Cricket season kick off ›</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.cricketScrollContent}
                            >
                                {/* Card 1: Match Day Essentials */}
                                <TouchableOpacity style={styles.cricketCardLarge}>
                                    <ImageBackground
                                        source={{ uri: 'https://images.unsplash.com/photo-1531415074984-61e663ba38cb?auto=format&fit=crop&q=80&w=500' }} // Stadium/Grass
                                        style={styles.cricketCardBackground}
                                        imageStyle={{ borderRadius: 16 }}
                                    >
                                        <LinearGradient
                                            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                                            style={styles.cricketGradientOverlay}
                                        >
                                            <View style={styles.cricketCardContent}>
                                                <Text style={styles.cricketMatchDayText}>MATCH</Text>
                                                <Text style={styles.cricketMatchDayText}>DAY</Text>
                                                <Text style={styles.cricketEssentialsText}>ESSENTIALS</Text>
                                                <View style={styles.cricketArrowButton}>
                                                    <FontAwesome name="arrow-right" size={16} color="#000" />
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </ImageBackground>
                                </TouchableOpacity>

                                {/* Card 2: Cricket Kits */}
                                <TouchableOpacity style={styles.cricketCardNormal}>
                                    <LinearGradient
                                        colors={['#1e293b', '#0f172a']} // Dark Blue/Slate
                                        style={styles.cricketCardGradient}
                                    >
                                        <View style={styles.cricketCardHeader}>
                                            <Text style={styles.cricketCardTitle}>Cricket kits</Text>
                                            <Text style={styles.cricketCardOffer}>Min. 60% Off</Text>
                                        </View>
                                        <Image
                                            source={{ uri: 'https://loremflickr.com/300/400/cricket,bag?lock=101' }} // Kit bag
                                            style={styles.cricketCardImage}
                                            resizeMode="contain"
                                        />
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Card 3: Batting Gear */}
                                <TouchableOpacity style={styles.cricketCardNormal}>
                                    <LinearGradient
                                        colors={['#1e293b', '#0f172a']} // Dark Blue/Slate
                                        style={styles.cricketCardGradient}
                                    >
                                        <View style={styles.cricketCardHeader}>
                                            <Text style={styles.cricketCardTitle}>Batting Gear</Text>
                                            <Text style={styles.cricketCardOffer}>Up to 50% Off</Text>
                                        </View>
                                        <Image
                                            source={{ uri: 'https://loremflickr.com/300/400/cricket,bat?lock=102' }} // Bat
                                            style={styles.cricketCardImage}
                                            resizeMode="contain"
                                        />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>

                        {/* Winner Brands Section */}
                        <View style={styles.winnerBrandsSection}>
                            <TouchableOpacity onPress={() => router.push('/sports/collection/winner-brands')}>
                                <Text style={styles.sectionTitleBlack}>Winner brands ›</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal
                                pagingEnabled={false} // pagingEnabled usually conflicts with custom intervals on Android, snapToInterval is better
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.winnerBrandsScroll}
                                snapToInterval={(width * 0.75) + 16} // width + marginRight
                                decelerationRate="fast"
                            >
                                {[
                                    {
                                        brand: 'LEADER CYCLES',
                                        offer: 'Min. 40% Off',
                                        image: 'https://loremflickr.com/400/400/bicycle?lock=200',
                                        logoColor: '#DC2626' // Red
                                    },
                                    {
                                        brand: 'NIVIA',
                                        offer: 'Min. 30% Off',
                                        image: 'https://loremflickr.com/400/400/football?lock=201',
                                        logoColor: '#000000'
                                    },
                                    {
                                        brand: 'VECTOR X',
                                        offer: 'Min. 50% Off',
                                        image: 'https://loremflickr.com/400/400/gym?lock=202',
                                        logoColor: '#2563EB' // Blue
                                    }
                                ].map((item, index) => (
                                    <View key={index} style={styles.winnerCardContainer}>
                                        <TouchableOpacity style={styles.winnerCard}>
                                            <View style={styles.winnerLogoContainer}>
                                                <Text style={[styles.winnerLogoText, { color: item.logoColor }]}>
                                                    {item.brand.split(' ')[0]}
                                                    {item.brand.split(' ').length > 1 && <Text style={{ color: item.logoColor, fontSize: 16 }}> {item.brand.split(' ').slice(1).join(' ')}</Text>}
                                                </Text>
                                            </View>
                                            <View style={styles.winnerImageContainer}>
                                                <Image source={{ uri: item.image }} style={styles.winnerImage} />
                                            </View>
                                            <Text style={styles.winnerOfferText}>{item.offer}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                            {/* Pagination Dots */}
                            <View style={styles.paginationContainer}>
                                <View style={[styles.paginationDot, styles.paginationDotActive]} />
                                <View style={styles.paginationDot} />
                                <View style={styles.paginationDot} />
                                <View style={styles.paginationDot} />
                            </View>
                        </View>

                        {/* Support Your Goals Section */}
                        <View style={styles.supportGoalsSection}>
                            <TouchableOpacity onPress={() => router.push('/sports/collection/support-goals')}>
                                <Text style={styles.sectionTitleBlack}>Support your goals ›</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.supportGoalsScroll}
                                snapToInterval={width * 0.75 + 16}
                                decelerationRate="fast"
                            >
                                {/* Card 1: Body Building */}
                                <TouchableOpacity style={styles.supportGoalCard}>
                                    <ImageBackground
                                        source={{ uri: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800' }} // Bodybuilder lifting
                                        style={styles.supportGoalImage}
                                        imageStyle={{ borderRadius: 24 }}
                                    >
                                        <LinearGradient
                                            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                                            style={styles.supportGoalGradient}
                                        >
                                            <View style={styles.supportGoalContent}>
                                                <View>
                                                    <Text style={styles.supportGoalTitle}>BODY</Text>
                                                    <Text style={styles.supportGoalTitle}>BUILDING</Text>
                                                </View>
                                                <Text style={styles.supportGoalSubtitle}>
                                                    Build strength,{'\n'}one rep at a time!
                                                </Text>
                                            </View>
                                        </LinearGradient>
                                    </ImageBackground>
                                </TouchableOpacity>

                                {/* Card 2: Daily Training (Placeholder for the right card) */}
                                <TouchableOpacity style={styles.supportGoalCard}>
                                    <ImageBackground
                                        source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800' }} // Gym/Training
                                        style={styles.supportGoalImage}
                                        imageStyle={{ borderRadius: 24 }}
                                    >
                                        <LinearGradient
                                            colors={['rgba(2, 132, 199, 0.4)', 'rgba(8, 47, 73, 0.9)']} // Blue gradient like image
                                            style={styles.supportGoalGradient}
                                        >
                                            <View style={styles.supportGoalContent}>
                                                <View>
                                                    <Text style={styles.supportGoalTitle}>DAILY</Text>
                                                    <Text style={styles.supportGoalTitle}>LEVELS</Text>
                                                </View>
                                                <Text style={styles.supportGoalSubtitle}>
                                                    Train every day,{'\n'}sharpen the mind!
                                                </Text>
                                            </View>
                                        </LinearGradient>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>

                        {/* Gym-approved accessories Section */}
                        <View style={styles.accessoriesSection}>
                            <TouchableOpacity onPress={() => router.push('/sports/collection/gym-accessories')}>
                                <Text style={styles.sectionTitleBlack}>Gym-approved accessories ›</Text>
                            </TouchableOpacity>
                            <View style={styles.accessoriesGrid}>
                                {[
                                    { title: 'Duffle\nbags', discount: 'Min. 40% Off', image: 'https://loremflickr.com/300/300/gym,bag?lock=1', id: 1 },
                                    { title: 'Training\ngloves', discount: 'Up to 60% Off', image: 'https://loremflickr.com/300/300/gloves,gym?lock=2', id: 2 },
                                    { title: 'Shakers\n& sippers', discount: 'Up to 75% Off', image: 'https://loremflickr.com/300/300/shaker,bottle?lock=3', id: 3 },
                                    { title: 'Resistance\ntubes', discount: 'Min. 55% Off', image: 'https://loremflickr.com/300/300/resistance,band?lock=4', id: 4 },
                                ].map((item) => (
                                    <TouchableOpacity key={item.id} style={styles.accessoryCard}>
                                        <LinearGradient
                                            colors={['#3B82F6', '#172554']} // Blue to Dark Blue
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.accessoryGradient}
                                        >
                                            <Text style={styles.accessoryTitle}>{item.title}</Text>
                                            {/* Decorative Line */}
                                            <View style={styles.accessoryLine} />

                                            <Image source={{ uri: item.image }} style={styles.accessoryImage} />

                                            <Text style={styles.accessoryDiscount}>{item.discount}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* More below button */}

                        </View>

                        {/* Sports Combos Section */}
                        <View style={styles.combosSection}>
                            <TouchableOpacity onPress={() => router.push('/sports/collection/sports-combos')}>
                                <Text style={styles.sectionTitleBlack}>Sports combos ›</Text>
                            </TouchableOpacity>
                            <View style={styles.combosGrid}>
                                {[
                                    { title: 'Swimming kits', discount: 'Min. 50% Off', image: 'https://loremflickr.com/200/200/swimming,goggles?lock=10', id: 1 },
                                    { title: 'Punching kits', discount: 'Min. 40% Off', image: 'https://loremflickr.com/200/200/boxing,gloves?lock=11', id: 2 },
                                    { title: 'Badminton kits', discount: 'Min. 40% Off', image: 'https://loremflickr.com/200/200/badminton,racket?lock=12', id: 3 },
                                    { title: 'Football kits', discount: 'Min. 60% Off', image: 'https://loremflickr.com/200/200/football,ball?lock=13', id: 4 },
                                    { title: 'Skating kits', discount: 'Up to 75% Off', image: 'https://loremflickr.com/200/200/skateboard?lock=14', id: 5 },
                                    { title: 'Cycling kits', discount: 'Min. 40% Off', image: 'https://loremflickr.com/200/200/bicycle,light?lock=15', id: 6 },
                                ].map((item) => (
                                    <TouchableOpacity key={item.id} style={styles.comboCard}>
                                        <View style={styles.comboImageContainer}>
                                            <Image source={{ uri: item.image }} style={styles.comboImage} />
                                        </View>
                                        <View style={styles.comboTextContainer}>
                                            <Text style={styles.comboTitle}>{item.title}</Text>
                                            <Text style={styles.comboDiscount}>{item.discount}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Score Big Savings Section */}
                        <View style={styles.savingsSection}>
                            <TouchableOpacity onPress={() => router.push('/sports/collection/big-savings')}>
                                <Text style={styles.sectionTitleBlack}>Score big savings on sports ›</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.savingsScroll}
                                snapToInterval={width * 0.75 + 16}
                                decelerationRate="fast"
                            >
                                {/* Card 1: Badminton */}
                                <TouchableOpacity style={styles.savingsCard}>
                                    <ImageBackground
                                        source={{ uri: 'https://images.unsplash.com/photo-1626224583764-847890e0e99b?auto=format&fit=crop&q=80&w=800' }} // Badminton rackets
                                        style={styles.savingsImage}
                                        imageStyle={{ borderRadius: 24 }}
                                    >
                                        <LinearGradient
                                            colors={['rgba(8, 47, 73, 0.4)', 'rgba(8, 47, 73, 0.9)']} // Dark Blue/Slate gradient
                                            style={styles.savingsGradient}
                                        >
                                            <View style={styles.savingsContent}>
                                                <Text style={styles.savingsTitle}>BADMINTON{'\n'}GEAR</Text>
                                                <Text style={styles.savingsOffer}>Min. 50% Off</Text>
                                            </View>
                                        </LinearGradient>
                                    </ImageBackground>
                                </TouchableOpacity>

                                {/* Card 2: Swim Gear */}
                                <TouchableOpacity style={styles.savingsCard}>
                                    <ImageBackground
                                        source={{ uri: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=800' }} // Swimming
                                        style={styles.savingsImage}
                                        imageStyle={{ borderRadius: 24 }}
                                    >
                                        <LinearGradient
                                            colors={['rgba(12, 74, 110, 0.4)', 'rgba(2, 132, 199, 0.9)']} // Sky blue to dark
                                            style={styles.savingsGradient}
                                        >
                                            <View style={styles.savingsContent}>
                                                <Text style={styles.savingsTitle}>SWIM{'\n'}GEAR</Text>
                                                <Text style={styles.savingsOffer}>Up to 60% Off</Text>
                                            </View>
                                        </LinearGradient>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>



                        {/* Bottom overscroll cover */}
                        <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: '#F9FAFB' }} />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF6F00', // Matches main background
    },
    contentContainer: {
        backgroundColor: '#F9FAFB',
        flex: 1,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },

    // Subcategories Styles (Fashion Page Style)
    subcategoriesSection: {
        paddingVertical: 12,
    },
    horizontalScrollContent: {
        paddingHorizontal: 8,
    },
    columnWrapper: {
        marginRight: 12, // Spacing between columns
        justifyContent: 'flex-start',
    },
    subcategoryItem: {
        width: 85, // Fixed width approx to ensure 4 fit
        alignItems: 'center',
        marginBottom: 16, // Spacing between the 2 rows
    },
    subcategoryIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 12, // Rounded squares from Fashion Page
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    subcategoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    subcategoryName: {
        fontSize: 12,
        lineHeight: 16,
        height: 32, // Fixed height for 2 lines
        color: '#374151',
        textAlign: 'center',
        fontWeight: '500',
        paddingHorizontal: 0,
    },

    // Cricket Section Styles
    cricketSection: {
        marginBottom: 24,
        marginLeft: 16,
    },
    sectionTitleBlack: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    cricketScrollContent: {
        paddingRight: 16,
    },
    cricketCardLarge: {
        width: 160,
        height: 220,
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cricketCardBackground: {
        width: '100%',
        height: '100%',
    },
    cricketGradientOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    cricketCardContent: {
        alignItems: 'center',
    },
    cricketMatchDayText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '900', // Extra bold
        fontStyle: 'italic',
        lineHeight: 24,
        textAlign: 'center',
    },
    cricketEssentialsText: {
        color: '#CCFF00', // Lime green
        fontSize: 14,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginTop: 4,
        marginBottom: 16,
    },
    cricketArrowButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cricketCardNormal: {
        width: 150,
        height: 220,
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cricketCardGradient: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    cricketCardHeader: {
        width: '100%',
    },
    cricketCardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cricketCardOffer: {
        color: '#CCFF00', // Lime green
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    cricketCardImage: {
        width: '100%',
        height: 120,
        marginTop: 8,
    },

    winnerBrandsSection: {
        marginBottom: 32,
        paddingVertical: 8,
        marginLeft: 16, // Restore alignment with other sections
    },
    winnerBrandsScroll: {
        paddingRight: 16, // Gap at the end of list
        paddingBottom: 16, // Room for shadow
    },
    winnerCardContainer: {
        width: width * 0.75, // Matching other cards generally
        marginRight: 16,
    },
    winnerCard: {
        backgroundColor: '#E3F2FD',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        height: 420, // Increased height to prevent clipping
        justifyContent: 'space-between', // Distribute content evenly
    },
    winnerLogoContainer: {
        height: 50, // Fixed height for logo area
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    winnerLogoText: {
        fontSize: 30, // Slightly larger
        fontWeight: '900',
        fontStyle: 'italic',
        letterSpacing: -0.5,
    },
    winnerImageContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#fff',
        padding: 10,
    },
    winnerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    winnerOfferText: {
        fontSize: 26, // Larger and clearer
        fontWeight: '800',
        color: '#111827',
        letterSpacing: 0.5,
        marginBottom: 4, // Ensure it doesn't touch bottom
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8, // Closer to cards
        marginBottom: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        width: 24,
        backgroundColor: '#0F172A',
    },

    // Support Goals Styles
    supportGoalsSection: {
        marginBottom: 32,
        marginLeft: 16, // Align section title
    },
    supportGoalsScroll: {
        paddingRight: 16, // Padding at end of list
    },
    supportGoalCard: {
        width: width * 0.75, // 75% width
        height: 400, // Very tall
        marginRight: 16,
        borderRadius: 24,
        overflow: 'hidden',
    },
    supportGoalImage: {
        width: '100%',
        height: '100%',
    },
    supportGoalGradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-end',
    },
    supportGoalContent: {
        height: '100%',
        justifyContent: 'space-between',
        paddingTop: 32,
    },
    supportGoalTitle: {
        color: '#fff',
        fontSize: 36, // Very large
        fontWeight: '900',
        fontStyle: 'italic',
        lineHeight: 36,
        letterSpacing: -1,
    },
    supportGoalSubtitle: {
        color: '#CCFF00', // Lime green
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 22,
    },

    // Accessories Section
    accessoriesSection: {
        marginBottom: 40,
        marginHorizontal: 16, // Consistent side margins
    },
    accessoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    accessoryCard: {
        width: (width - 32 - 12) / 2, // (Screen - 2*margin - gap) / 2
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
    },
    accessoryGradient: {
        flex: 1,
        padding: 16,
        position: 'relative',
    },
    accessoryTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 22,
        zIndex: 2,
    },
    accessoryLine: {
        position: 'absolute',
        left: 16,
        top: 60, // Below text
        bottom: 30, // Above bottom text
        width: 40,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 16,
        borderColor: 'rgba(255,255,255,0.4)',
        zIndex: 1,
    },
    accessoryImage: {
        position: 'absolute',
        right: -10,
        top: 50,
        width: 110,
        height: 110,
        resizeMode: 'contain',
        zIndex: 3,
    },
    accessoryDiscount: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        color: '#CCFF00', // Lime green
        fontSize: 13,
        fontWeight: 'bold',
        zIndex: 4,
    },

    // Sports Combos Styles
    combosSection: {
        marginBottom: 32,
        marginHorizontal: 16,
    },
    combosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    comboCard: {
        width: (width - 32 - 16) / 3, // 3 columns with ~8px gap. (Screen - 2*margin - 2*gap)/3
        backgroundColor: '#4C7BD3', // Soft Royal Blue
        borderRadius: 12,
        padding: 5, // Creates the blue border effect
        marginBottom: 12,
        alignItems: 'center',
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    comboImageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        overflow: 'hidden',
    },
    comboImage: {
        width: '85%',
        height: '85%',
        resizeMode: 'contain',
    },
    comboTextContainer: {
        alignItems: 'center',
        paddingBottom: 4,
    },
    comboTitle: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 2,
        textAlign: 'center',
    },
    comboDiscount: {
        color: '#CCFF00', // Lime green
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // Score Big Savings Styles
    savingsSection: {
        marginBottom: 32,
        marginLeft: 16,
    },
    savingsScroll: {
        paddingRight: 16,
    },
    savingsCard: {
        width: width * 0.75, // 75% width
        height: 400, // Tall card
        marginRight: 16,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#0F172A',
    },
    savingsImage: {
        width: '100%',
        height: '100%',
    },
    savingsGradient: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    savingsContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    savingsTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        textTransform: 'uppercase',
        lineHeight: 36,
    },
    savingsOffer: {
        color: '#CCFF00', // Lime green
        fontSize: 20,
        fontWeight: 'bold',
    },


});
