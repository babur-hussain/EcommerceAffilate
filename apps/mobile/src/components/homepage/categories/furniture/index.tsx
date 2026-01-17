import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
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

interface FurniturePageProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function FurniturePage({ staticHeader, renderStickyHeader }: FurniturePageProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Scroll tracking
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    // Use correct slug for category API and name for product API
    const categoryId = '695ff7de3f61939001a06389';
    const categorySlug = 'furniture';
    const categoryName = 'Furniture';

    useEffect(() => {
        fetchCategoryData();
    }, []);

    const fetchCategoryData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Category Details (for posters/banners)
            try {
                const categoryResponse = await api.get(`/api/categories/${categorySlug}`);
                if (categoryResponse.data && categoryResponse.data.posters && categoryResponse.data.posters.length > 0) {
                    setBanners(categoryResponse.data.posters);
                }
            } catch (e) {
                console.log(`Category details fetch failed for ${categorySlug}`, e);
            }

            // 2. Fetch Subcategories
            try {
                const subcategoriesResponse = await api.get(`/api/categories/${categorySlug}/subcategories`);
                if (Array.isArray(subcategoriesResponse.data) && subcategoriesResponse.data.length > 0) {
                    setSubcategories(subcategoriesResponse.data);
                } else {
                    const fallbackResponse = await api.get(`/api/categories?parentCategory=${categoryId}`);
                    if (Array.isArray(fallbackResponse.data)) {
                        setSubcategories(fallbackResponse.data);
                    }
                }
            } catch (e) {
                console.log(`Subcategories fetch failed for ${categorySlug}`, e);
            }

            // 3. Fetch Products
            // Product API expects category Name, not ID or Slug (based on Product schema)
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

                        {/* 2. Subcategories Grid (Horizontal 2 Rows) */}
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
                                                                        <Text style={{ fontSize: 20 }}>🛋️</Text>
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

                        {/* 3. Deal of the day Section */}
                        <View style={styles.dealOfDaySection}>
                            <TouchableOpacity onPress={() => router.push('/furniture/collection/deal-of-the-day')}>
                                <Text style={styles.sectionTitleBlack}>Deal of the day ›</Text>
                            </TouchableOpacity>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                                {[
                                    { title: 'Mattresses', price: 'From ₹2,990', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d7030e?auto=format&fit=crop&w=400&q=80' },
                                    { title: 'Office chairs', price: 'From ₹2,490', image: 'https://media.istockphoto.com/id/1297688846/photo/computer-chair-for-gamers.jpg?s=1024x1024&w=is&k=20&c=z6K9kSEecaJb_-Jn7uFeObKmmICGNhisUtb8H6cNlyA=' },
                                    { title: 'Recliners', price: 'From ₹5,999', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d7030e?auto=format&fit=crop&w=400&q=80' },
                                ].map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.dealCard}>
                                        <Image source={{ uri: item.image }} style={styles.dealImage} />
                                        <View style={styles.dealOverlay}>
                                            <Text style={styles.dealTitle}>{item.title}</Text>
                                        </View>
                                        <View style={styles.dealFooter}>
                                            <Text style={styles.dealPrice}>{item.price}</Text>
                                            <FontAwesome name="arrow-right" size={14} color="#fff" />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 4. Top brands, top offers Section */}
                        <View style={styles.topBrandsSection}>
                            <LinearGradient
                                colors={['#FFF176', '#FFD54F']} // Yellow gradient
                                style={styles.topBrandsContainer}
                            >
                                <TouchableOpacity
                                    style={styles.topBrandsHeader}
                                    onPress={() => router.push('/furniture/collection/top-brands')}
                                >
                                    <Text style={styles.topBrandsTitle}>Top brands, top offers ›</Text>
                                    <Text style={styles.rocketIcon}>🚀</Text>
                                </TouchableOpacity>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topBrandsScrollContent}>
                                    {[
                                        {
                                            brandName: 'GREEN SOUL',
                                            price: 'From ₹16,990',
                                            image: 'https://images.unsplash.com/photo-1598300042247-d088f11a3b18?auto=format&fit=crop&w=400&q=80', // Gaming chair
                                            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Verdes.svg/2560px-Flag_of_Verdes.svg.png' // Placeholder/Mock logo
                                        },
                                        {
                                            brandName: 'Kurl-on',
                                            price: 'From ₹10,235',
                                            image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80', // Bed
                                            logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Kurlon_Logo.jpg' // Mock
                                        },
                                        {
                                            brandName: 'Sleepwell',
                                            price: 'From ₹10,690',
                                            image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80', // Bedroom
                                            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Sleepwell_logo.png/220px-Sleepwell_logo.png' // Mock
                                        }
                                    ].map((item, index) => (
                                        <View key={index} style={styles.brandCardWrapper}>
                                            <View style={styles.brandCard}>
                                                <Image source={{ uri: item.image }} style={styles.brandImage} />
                                                <View style={styles.brandLogoPill}>
                                                    {/* Using text for brand logic if image fails, but nice UI uses image */}
                                                    <Image source={{ uri: 'https://loremflickr.com/100/40/logo' }} style={styles.brandLogoImage} />
                                                    {/* Fallback Text if needed: <Text style={styles.brandLogoText}>{item.brandName}</Text> */}
                                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', zIndex: -1 }}>
                                                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#333' }}>{item.brandName}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <Text style={styles.brandPrice}>{item.price}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </LinearGradient>
                        </View>

                        {/* 5. Sponsorship Banner Section */}
                        <View style={styles.sponsorshipSection}>
                            <Image
                                source={{ uri: 'https://loremflickr.com/800/200/furniture,sale?lock=1' }}
                                style={styles.sponsorshipImage}
                            />
                        </View>

                        {/* 6. Grab or gone Section */}
                        <View style={styles.grabOrGoneSection}>
                            <View style={styles.grabOrGoneContainer}>
                                <Text style={styles.grabOrGoneTitle}>Grab or gone</Text>
                                <View style={styles.grabGrid}>
                                    {[
                                        { title: 'Best Deal Ever', price: 'From ₹10,999', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80' }, // Dining Set
                                        { title: 'Best Deal Ever', price: 'From ₹8,999', image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=400&q=80' }, // Dining Table
                                        { title: 'Best deal ever', price: 'From ₹3,899', image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae4?auto=format&fit=crop&w=400&q=80' }, // Chairs
                                        { title: 'Best deal ever', price: 'From ₹6,999', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80' }, // Bed
                                    ].map((item, index) => (
                                        <View key={index} style={styles.grabCard}>
                                            <Image source={{ uri: item.image }} style={styles.grabImage} />
                                            <View style={styles.grabContent}>
                                                <Text style={styles.grabTag}>{item.title}</Text>
                                                <Text style={styles.grabPrice}>{item.price}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* 7. Shop by room Section */}
                        <View style={styles.shopByRoomSection}>
                            <Text style={styles.sectionTitleBlack}>Shop by room</Text>
                            <View style={styles.roomGrid}>
                                {[
                                    { title: 'Living room', color: '#FFD54F', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80' },
                                    { title: 'Bedroom', color: '#C5E1A5', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80' },
                                    { title: 'Outdoor furniture', color: '#AED581', image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=400&q=80' }, // Outdoor
                                    { title: 'Study & office', color: '#FFD54F', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80' },
                                ].map((item, index) => (
                                    <View key={index} style={styles.roomCard}>
                                        <Image source={{ uri: item.image }} style={styles.roomImage} />
                                        <View style={[styles.roomOverlay, { backgroundColor: item.color }]}>
                                            <Text style={styles.roomTitle}>{item.title}</Text>
                                            <FontAwesome name="arrow-right" size={14} color="#000" style={styles.roomArrow} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* 8. Samarth store Section */}
                        <View style={styles.samarthStoreSection}>
                            <Text style={styles.sectionTitleBlack}>Samarth store</Text>
                            <View style={styles.samarthBannerContainer}>
                                <Image
                                    source={{ uri: 'https://rukminim1.flixcart.com/fk-p-flap/850/200/image/8b996652390757d5.jpg?q=90' }} // Placeholder/Mock for Samarth
                                    style={styles.samarthBannerImage}
                                />
                            </View>
                        </View>

                        {/* 9. Special offers on no cost EMI Section */}
                        <View style={styles.emiLinksSection}>
                            <Text style={styles.sectionTitleBlack}>Special offers on no cost EMI</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                                {[
                                    { title: 'Beds', price: 'From ₹1,099/mo', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80' },
                                    { title: 'Mattresses', price: 'From ₹799/mo', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d7030e?auto=format&fit=crop&w=400&q=80' },
                                    { title: 'Wardrobes', price: 'From ₹1,499/mo', image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=400&q=80' },
                                ].map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.emiCard}>
                                        <Image source={{ uri: item.image }} style={styles.emiImage} />
                                        <View style={styles.emiFooter}>
                                            <Text style={styles.emiTitle}>{item.title}</Text>
                                            <Text style={styles.emiPrice}>{item.price}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 10. Top furniture brands Section */}
                        <View style={styles.topFurnitureBrandsSection}>
                            <Text style={styles.sectionTitleBlack}>Top furniture brands</Text>
                            <View style={styles.topBrandsGrid}>
                                {[
                                    { name: 'Nilkamal', logo: 'https://companieslogo.com/img/orig/NILKAMAL.NS-026c457f.png?t=1612566675' },
                                    { name: 'Wakefit', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Wakefit_Logo.jpg' },
                                    { name: 'Perfect Homes', logo: 'https://seeklogo.com/images/F/flipkart-logo-C9E637A758-seeklogo.com.png' }, // Mock
                                    { name: 'Wooden Street', logo: 'https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1485862226/u9082260195665_f7d45.png' }, // Mock
                                    { name: 'Green Soul', logo: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/c325785f-8705-4081-9b16-5275e0dc42aa.__CR0,0,600,180_PT0_SX600_V1___.jpg' },
                                    { name: 'View all', isViewAll: true }
                                ].map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.topBrandCard}>
                                        {item.isViewAll ? (
                                            <>
                                                <Text style={styles.viewAllText}>View all</Text>
                                                <View style={styles.viewAllIcon}>
                                                    <FontAwesome name="arrow-right" size={12} color="#fff" />
                                                </View>
                                            </>
                                        ) : (
                                            <Image source={{ uri: item.logo }} style={styles.topBrandLogo} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 11. Shop by material Section */}
                        <View style={styles.shopByMaterialSection}>
                            <Text style={styles.sectionTitleBlack}>Shop by material</Text>
                            <View style={styles.materialGrid}>
                                {[
                                    { name: 'Plastic', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=400&q=80' },
                                    { name: 'Metal', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80' },
                                    { name: 'Engineered wood', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80' },
                                    { name: 'Bamboo/ Rattan/ Cane', image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=400&q=80' },
                                ].map((item, index) => (
                                    <View key={index} style={styles.materialCard}>
                                        <Image source={{ uri: item.image }} style={styles.materialImage} />
                                        <View style={styles.materialFooter}>
                                            <Text style={styles.materialText}>{item.name}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* 12. Trending now Section */}
                        <View style={styles.trendingSection}>
                            <Text style={styles.sectionTitleBlack}>Trending now</Text>
                            <View style={styles.trendingGrid}>
                                {/* Card 1: New Launches */}
                                <TouchableOpacity style={[styles.trendingCard, styles.trendingCardYellow]}>
                                    <View style={styles.trendingIconContainer}>
                                        <FontAwesome name="rocket" size={40} color="#2962FF" />
                                    </View>
                                    <Text style={styles.trendingText}>New</Text>
                                    <Text style={styles.trendingText}>launches</Text>
                                </TouchableOpacity>

                                {/* Card 2: Betul Exclusive */}
                                <TouchableOpacity style={[styles.trendingCard, styles.trendingCardGreen]}>
                                    <View style={styles.trendingIconContainer}>
                                        <View style={styles.exclusiveIconBg}>
                                            <FontAwesome name="star" size={30} color="#2962FF" />
                                        </View>
                                    </View>
                                    <Text style={styles.trendingText}>Betul's</Text>
                                    <Text style={styles.trendingText}>Exclusive</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 13. Add to your wishlist Section */}
                        <View style={styles.wishlistSection}>
                            <View style={styles.wishlistContainer}>
                                <Text style={styles.wishlistTitle}>Add to your wishlist</Text>
                                <View style={styles.wishlistGrid}>
                                    {[
                                        { title: 'Best deal ever', price: 'From ₹11,299', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80' }, // Bed
                                        { title: 'Best deal ever', price: 'From ₹11,299', image: 'https://images.unsplash.com/photo-1616594039964-b0804955c66b?auto=format&fit=crop&w=400&q=80' }, // Bed 2
                                        { title: 'Best deal ever', price: 'From ₹11,299', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80' }, // Bedroom
                                        { title: 'Best Deal Ever', price: 'From ₹10,999', image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=400&q=80' }, // Dining
                                    ].map((item, index) => (
                                        <View key={index} style={styles.wishlistCard}>
                                            <Image source={{ uri: item.image }} style={styles.wishlistImage} />
                                            <View style={styles.wishlistCardContent}>
                                                <Text style={styles.wishlistSubtitle}>{item.title}</Text>
                                                <Text style={styles.wishlistPrice}>{item.price}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* 14. Reviews by customers Section */}
                        <View style={styles.reviewsSection}>
                            <Text style={styles.sectionTitleBlack}>Reviews by customers</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                                {[
                                    {
                                        product: 'FK Perfect Homes Sofas',
                                        rating: 5,
                                        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', // Sofa
                                        review: 'Beauty MARVELLOUS SUPER quality',
                                        user: 'Preet Agrawal'
                                    },
                                    {
                                        product: 'Wakefit Bookshelf',
                                        rating: 4,
                                        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80', // Bookshelf
                                        review: 'Packing was good & were provided with Sleep...',
                                        user: 'Rizwan Mansuri'
                                    },
                                ].map((item, index) => (
                                    <View key={index} style={styles.reviewCard}>
                                        <View>
                                            <Text style={styles.reviewProductTitle}>{item.product}</Text>
                                            <View style={styles.ratingContainer}>
                                                {[...Array(5)].map((_, i) => (
                                                    <FontAwesome key={i} name="star" size={14} color={i < item.rating ? "#FFEB3B" : "#ccc"} style={{ marginRight: 2 }} />
                                                ))}
                                            </View>
                                        </View>
                                        <Image source={{ uri: item.image }} style={styles.reviewImage} />
                                        <View style={styles.reviewOverlay}>
                                            <Text style={styles.reviewText}>{item.review}</Text>
                                            <Text style={styles.reviewUser}>{item.user}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 15. On everybody's list Section */}
                        <View style={styles.everybodyListSection}>
                            <View style={styles.everybodyListContainer}>
                                <Text style={styles.everybodyListTitle}>On everybody's list</Text>
                                {/* Placeholder for corner graphic if needed, for now just background */}
                                <View style={styles.everybodyListGrid}>
                                    {[
                                        { title: 'Best Deal Ever', subtitle: 'Upto 40% Off', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80' }, // Bean bag equivalent
                                        { title: 'Best deal ever', subtitle: 'From ₹2,499', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80' }, // Bed
                                        { title: 'Best deal ever', subtitle: 'From ₹2,499', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80' }, // Bed 2
                                        { title: 'Best deal ever', subtitle: 'From ₹2,999', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d7030e?auto=format&fit=crop&w=400&q=80' }, // Mattress
                                    ].map((item, index) => (
                                        <View key={index} style={styles.everybodyListCard}>
                                            <Image source={{ uri: item.image }} style={styles.everybodyListImage} />
                                            <View style={styles.everybodyListCardContent}>
                                                <Text style={styles.everybodyListSubtitle}>{item.title}</Text>
                                                <Text style={styles.everybodyListPrice}>{item.subtitle}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>


                        {/* 16. Betul's rare finds Section */}
                        <View style={styles.rareFindsSection}>
                            <Text style={styles.sectionTitleBlack}>Betul's rare finds</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                                {[
                                    { title: 'Pet beds', image: 'https://images.unsplash.com/photo-1541781777-c18bd3a3d919?auto=format&fit=crop&w=400&q=80' },
                                    { title: 'Decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80' },
                                    { title: 'Lighting', image: 'https://images.unsplash.com/photo-1513506003011-3b03c80165bd?auto=format&fit=crop&w=400&q=80' },
                                ].map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.rareFindCard}>
                                        <Image source={{ uri: item.image }} style={styles.rareFindImage} />
                                        <View style={styles.rareFindLabelContainer}>
                                            <View style={styles.rareFindLabel}>
                                                <Text style={styles.rareFindText}>{item.title}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 17. Shop statement pieces Section */}
                        <View style={styles.statementPiecesSection}>
                            <Text style={styles.sectionTitleBlack}>Shop statement pieces</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                                {[
                                    { title: 'Sofa sets', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80' },
                                    { title: 'Recliners', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80' },
                                    { title: 'Accent Chairs', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=400&q=80' },
                                ].map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.statementPieceCard}>
                                        <Image source={{ uri: item.image }} style={styles.statementPieceImage} />
                                        <View style={styles.statementLabelContainer}>
                                            <View style={styles.statementLabel}>
                                                <Text style={styles.statementText}>{item.title}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
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
