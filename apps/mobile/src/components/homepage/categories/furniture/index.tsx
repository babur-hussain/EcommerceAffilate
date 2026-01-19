import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient'; // No longer needed here if extracted
// import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; // No longer needed
// import api from '../../../../lib/api'; // No longer needed
import CategoryPulseLoader from '../../../shared/CategoryPulseLoader';
import { usePageLayout } from '../../../../hooks/usePageLayout';
import SectionRenderer from '../../SectionRenderer';

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

interface FurniturePageProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function FurniturePage({ staticHeader, renderStickyHeader }: FurniturePageProps) {
    // SDUI Hook
    const { layout, loading: layoutLoading, refresh } = usePageLayout('furniture');
    
    // Scroll tracking
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

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
                {layoutLoading && !layout ? (
                    <View style={styles.loadingContainer}>
                        <CategoryPulseLoader />
                    </View>
                ) : (
                    <>
                        {layout?.sections.sort((a: any, b: any) => a.priority - b.priority).map((section: any) => (
                            <SectionRenderer key={section.id} section={section} />
                        ))}
                    </>
                )}
                <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: '#F9FAFB' }} />
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF6F00',
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
        width: (width - 60) / 4, // Slightly fewer items to ensure 4 are clearly visible, or stick to plain div
        // Let's set a fixed width approx 85px to ensure 4 fit in 360-400px width with margins
        maxWidth: 85,
        alignItems: 'center',
        marginBottom: 16, // Spacing between the 2 rows
    },
    subcategoryIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 12,
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
        height: 32, // Fixed height for 2 lines to ensure alignment
        color: '#374151',
        textAlign: 'center',
        fontWeight: '500',
        paddingHorizontal: 0,
    },

    // Deal of the Day Styles
    dealOfDaySection: {
        marginBottom: 24,
        paddingLeft: 16,
    },
    sectionTitleBlack: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    dealCard: {
        width: 250,
        height: 160,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    dealImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    dealOverlay: {
        position: 'absolute',
        bottom: 30, // Above footer
        left: 0,
        right: 0,
        padding: 8,
    },
    dealTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    dealFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    dealPrice: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // Top Brands Styles
    topBrandsSection: {
        marginBottom: 24,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    topBrandsContainer: {
        paddingVertical: 16,
        paddingLeft: 16,
        borderRadius: 16,
    },
    topBrandsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    topBrandsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 8,
    },
    rocketIcon: {
        fontSize: 20,
    },
    topBrandsScrollContent: {
        paddingRight: 16,
    },
    brandCardWrapper: {
        marginRight: 16,
        width: 140,
    },
    brandCard: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 8,
    },
    brandImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    brandLogoPill: {
        position: 'absolute',
        bottom: 12,
        left: '15%', // Centerish
        right: '15%',
        height: 32,
        backgroundColor: '#fff',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
        paddingHorizontal: 8,
    },
    brandLogoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    brandPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },

    // Sponsorship Banner Styles
    sponsorshipSection: {
        marginHorizontal: 16,
        marginBottom: 24,
        height: 110, // Reduced height as requested
        borderRadius: 16,
        overflow: 'hidden',
    },
    sponsorshipImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    // Grab or Gone Styles
    grabOrGoneSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    grabOrGoneContainer: {
        backgroundColor: '#FFCCBC', // Peach/Orange from image
        borderRadius: 16,
        padding: 16,
    },
    grabOrGoneTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    grabGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    grabCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        paddingBottom: 8,
    },
    grabImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        marginBottom: 8,
    },
    grabContent: {
        paddingHorizontal: 8,
    },
    grabTag: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    grabPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },

    // Shop by Room Styles
    shopByRoomSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    roomGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    roomCard: {
        width: '48%',
        height: 200,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#eee',
    },
    roomImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    roomOverlay: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        left: 30, // Offset to give it that "corner" look
        backgroundColor: '#FFD54F',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    roomTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        flex: 1, // Allow text to wrap if needed
        marginRight: 8,
    },
    roomArrow: {
        backgroundColor: '#000',
        color: '#fff',
        borderRadius: 10,
        width: 20,
        height: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 20,
        fontSize: 10,
        overflow: 'hidden', // Important for rounded background on icon
    },

    // Samarth Store Styles
    samarthStoreSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    samarthBannerContainer: {
        height: 100, // Roughly the height in the screenshot
        borderRadius: 12,
        overflow: 'hidden',
    },
    samarthBannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    // EMI Links Styles
    emiLinksSection: {
        marginBottom: 24,
        paddingLeft: 16,
    },
    emiCard: {
        width: 140,
        height: 180,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff',
    },
    emiImage: {
        width: '100%',
        height: '75%', // Leaves space for footer
        resizeMode: 'cover',
    },
    emiFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: '25%', // Ensure it takes up the bottom part
    },
    emiTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    emiPrice: {
        fontSize: 12,
        color: '#ccc',
    },

    // Top Furniture Brands Styles
    topFurnitureBrandsSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    topBrandsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    topBrandCard: {
        width: '31%', // 3 columns with gap
        aspectRatio: 1, // Square
        backgroundColor: '#FFF9C4', // Cream/Beige
        borderRadius: 12,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    topBrandLogo: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    viewAllIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Shop by Material Styles
    shopByMaterialSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    materialGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    materialCard: {
        width: '48%',
        height: 180,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff',
    },
    materialImage: {
        width: '100%',
        height: '80%',
        resizeMode: 'cover',
    },
    materialFooter: {
        width: '100%',
        height: '20%',
        backgroundColor: '#000',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    materialText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // Trending Now Styles
    trendingSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    trendingGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    trendingCard: {
        width: '48%',
        height: 160,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    trendingCardYellow: {
        backgroundColor: '#FFF59D',
    },
    trendingCardGreen: {
        backgroundColor: '#C5E1A5',
    },
    trendingIconContainer: {
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exclusiveIconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFEB3B', // Yellow bg for icon
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        lineHeight: 22,
    },

    // Add to your wishlist Styles
    wishlistSection: {
        marginBottom: 24,
        marginHorizontal: 16,
    },
    wishlistContainer: {
        backgroundColor: '#FFCCBC', // Peach/Orange bg
        borderRadius: 16,
        padding: 16,
    },
    wishlistTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    wishlistGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    wishlistCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        paddingBottom: 8,
    },
    wishlistImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
        marginBottom: 8,
    },
    wishlistCardContent: {
        paddingHorizontal: 8,
    },
    wishlistSubtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    wishlistPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },

    // Reviews by Customers Styles
    reviewsSection: {
        marginBottom: 24,
        paddingLeft: 16,
    },
    reviewCard: {
        width: 250,
        height: 280,
        backgroundColor: '#9575CD', // Purple
        borderRadius: 16,
        marginRight: 16,
        padding: 16,
        position: 'relative',
        justifyContent: 'space-between',
    },
    reviewProductTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    reviewImage: {
        width: '100%',
        height: 120, // Adjust based on card height
        resizeMode: 'contain',
        position: 'absolute',
        top: 60,
        left: 16, // To center somewhat or align
        zIndex: 1,
    },
    reviewOverlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white/purple feel
        borderRadius: 12,
        padding: 12,
        marginTop: 100, // Push down to make space for image
    },
    reviewText: {
        fontSize: 12,
        color: '#000',
        fontWeight: '600',
        marginBottom: 4,
        lineHeight: 16,
    },
    reviewUser: {
        fontSize: 10,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'right',
    },

    // On everybody's list Styles
    everybodyListSection: {
        marginBottom: 24,
        marginHorizontal: 16,
    },
    everybodyListContainer: {
        backgroundColor: '#FFCCBC', // Peach/Orange bg, same as wishlist for consistency or slightly different
        borderRadius: 16,
        padding: 16,
        position: 'relative',
    },
    everybodyListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    everybodyListGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    everybodyListCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        paddingBottom: 8,
    },
    everybodyListImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
        marginBottom: 8,
    },
    everybodyListCardContent: {
        paddingHorizontal: 8,
    },
    everybodyListSubtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    everybodyListPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },

    // Betul's Rare Finds Styles
    rareFindsSection: {
        marginBottom: 24,
        paddingLeft: 16,
    },
    rareFindCard: {
        width: 280,
        height: 280,
        marginRight: 16,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    rareFindImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    rareFindLabelContainer: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    rareFindLabel: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    rareFindText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },

    // Shop Statement Pieces Styles
    statementPiecesSection: {
        marginBottom: 24,
        paddingLeft: 16,
    },
    statementPieceCard: {
        width: 280,
        height: 350, // Taller than rare finds
        marginRight: 16,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    statementPieceImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    statementLabelContainer: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    statementLabel: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    statementText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'serif', // Trying to match the elegant font in reference
    },
});
