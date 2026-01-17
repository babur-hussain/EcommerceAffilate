import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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

interface BeautyHomeProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function BeautyHome({ staticHeader, renderStickyHeader }: BeautyHomeProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Scroll tracking
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = React.useRef<ScrollView>(null);

    // K-Beauty Auto-slider Logic
    const [kBeautyActiveIndex, setKBeautyActiveIndex] = useState(0);
    const kBeautyScrollRef = React.useRef<ScrollView>(null);
    const K_BEAUTY_CARD_WIDTH = width * 0.85;
    const K_BEAUTY_SPACING = 16;
    const K_BEAUTY_SNAP_INTERVAL = K_BEAUTY_CARD_WIDTH + K_BEAUTY_SPACING;

    const kBeautyData = [
        {
            brand: 'TIRTIR',
            ingredientTitle: 'Star\ningredient',
            ingredient: 'Niacinamide',
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', // Red theme
            bg: '#880E4F', // Deep Burgundy
            offer: 'Up to 20% Off',
            filter: { brand: 'TIRTIR', minDiscount: 20 }
        },
        {
            brand: 'COSRX',
            ingredientTitle: 'Star\ningredient',
            ingredient: 'Snail Mucin',
            image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=600&q=80', // White/Yellow theme
            bg: '#FFF9C4', // Light Yellow/White
            offer: 'Up to 25% Off',
            darkText: true,
            filter: { brand: 'COSRX', minDiscount: 25 }
        },
        {
            brand: 'Innisfree',
            ingredientTitle: 'Star\ningredient',
            ingredient: 'Green Tea',
            image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80', // Green theme
            bg: '#C8E6C9', // Light Green
            offer: 'From ₹499',
            darkText: true,
            filter: { brand: 'Innisfree', maxPrice: 499 }
        },
        {
            brand: 'Innisfree',
            ingredientTitle: 'Star\ningredient',
            ingredient: 'Green Tea',
            image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80', // Green theme
            bg: '#C8E6C9', // Light Green
            offer: 'From ₹499',
            darkText: true,
            filter: { brand: 'Innisfree', maxPrice: 499 }
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = kBeautyActiveIndex + 1;
            if (nextIndex >= kBeautyData.length) {
                nextIndex = 0;
            }
            setKBeautyActiveIndex(nextIndex);
            kBeautyScrollRef.current?.scrollTo({ x: nextIndex * K_BEAUTY_SNAP_INTERVAL, animated: true });
        }, 5000); // 5 Seconds

        return () => clearInterval(interval);
    }, [kBeautyActiveIndex]);

    const onKBeautyScroll = (event: any) => {
        const index = event.nativeEvent.contentOffset.x / K_BEAUTY_SNAP_INTERVAL;
        const roundIndex = Math.round(index);
        // Optional: Update state if user scrolls manually
        // setKBeautyActiveIndex(roundIndex); 
    };
    const categorySlug = 'beauty';
    const categoryName = 'Beauty';

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
                console.log(`Category details fetch failed for ${categoryName}`, e);
            }

            // 2. Fetch Subcategories
            try {
                const subcategoriesResponse = await api.get(`/api/categories/${categorySlug}/subcategories`);
                if (Array.isArray(subcategoriesResponse.data) && subcategoriesResponse.data.length > 0) {
                    setSubcategories(subcategoriesResponse.data);
                } else {
                    // Fallback using slug if needed, but the main endpoint should work
                    console.log('No subcategories found via main endpoint');
                }
            } catch (e) {
                console.log(`Subcategories fetch failed for ${categoryName}`, e);
            }

            // 3. Fetch Products
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
                                                                        <Text style={{ fontSize: 20 }}>💄</Text>
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

                        {/* Promotional Poster */}
                        <View style={styles.promoPosterContainer}>
                            <Image
                                source={{ uri: 'https://loremflickr.com/800/200/makeup,banner?lock=100' }}
                                style={styles.promoPoster}
                            />
                        </View>

                        {/* Glow for the harvest Section */}
                        <View style={styles.harvestSection}>
                            <Text style={styles.sectionTitleBlack}>Glow for the harvest</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.harvestScrollContent}
                            >
                                {[
                                    {
                                        name: 'Lipstick',
                                        offer: 'Min. 40% Off',
                                        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
                                        filter: { minDiscount: 40 }
                                    },
                                    {
                                        name: 'Eye Makeup',
                                        offer: 'Up to 70% Off',
                                        image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?auto=format&fit=crop&w=400&q=80',
                                        filter: { minDiscount: 10 } // Show discounted items
                                    },
                                    {
                                        name: 'Foundations',
                                        offer: 'Under ₹499',
                                        image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=400&q=80',
                                        filter: { maxPrice: 499 }
                                    },
                                    {
                                        name: 'Skincare',
                                        offer: 'Min. 30% Off',
                                        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
                                        filter: { minDiscount: 30 }
                                    },
                                ].map((item, index) => (
                                    <View key={index} style={styles.harvestItemContainer}>
                                        <TouchableOpacity
                                            style={styles.harvestCard}
                                            onPress={() => router.push({
                                                pathname: '/common-category/[id]',
                                                params: {
                                                    id: 'beauty',
                                                    subcategory: item.name,
                                                    filters: JSON.stringify(item.filter)
                                                }
                                            })}
                                        >
                                            <View style={styles.harvestCardInner}>
                                                <ImageBackground
                                                    source={{ uri: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768414560/IMG_1856_tkqhto.jpg' }}
                                                    style={styles.harvestBackground}
                                                    imageStyle={{ resizeMode: 'cover', opacity: 0.6 }}
                                                >
                                                    <View style={styles.harvestImageWrapper}>
                                                        <Image source={{ uri: item.image }} style={styles.harvestImage} />
                                                        <Text style={styles.kiteIcon}>🪁</Text>
                                                        <Text style={styles.kiteIconSmall}>🪁</Text>
                                                    </View>
                                                    <View style={styles.offerBadge}>
                                                        <Text style={styles.offerText}>{item.offer}</Text>
                                                    </View>
                                                </ImageBackground>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.labelPill}>
                                            <Text style={styles.labelText}>{item.name}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Sponsorship Banner */}
                        <View style={styles.consultationBanner}>
                            <View style={styles.consultationContent}>
                                <View style={styles.consultationTextContainer}>
                                    <View style={styles.consultationTitleRow}>
                                        <Text style={{ fontSize: 24, marginRight: 8 }}>🩺</Text>
                                        <Text style={styles.consultationTitle}>Free{'\n'}dermatologist's{'\n'}consultation</Text>
                                    </View>
                                    <View style={styles.consultationDivider} />
                                    <View style={styles.callContainer}>
                                        <Text style={styles.consultationCallText}>Call on</Text>
                                        <Text style={styles.consultationPhone}>011-35664195</Text>
                                    </View>
                                </View>
                                <View style={styles.sarvrachnaBadge}>
                                    <Text style={styles.poweredByText}>Powered by</Text>
                                    <View style={styles.sarvrachnaLogoContainer}>
                                        <Text style={styles.sarvrachnaText}>Sarvrachna</Text>
                                    </View>
                                </View>
                            </View>
                            <Image
                                source={{ uri: 'https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-young-afro-professional-doctor-png-image_10148632.png' }}
                                style={styles.consultationDoctorImage}
                            />
                            {/* Decorative bubbles - Repositioned for this banner */}
                            <View style={[styles.bubble, { top: 10, right: 80, width: 20, height: 20, opacity: 0.2 }]} />
                            <View style={[styles.bubble, { bottom: 20, right: 100, width: 10, height: 10, opacity: 0.1 }]} />
                        </View>


                        {/* Trending Brands */}
                        <View style={styles.trendingSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Trending brands</Text>
                                <TouchableOpacity onPress={() => router.push('/common-category/beauty/trending-brands')}>
                                    <Text style={{ color: '#FF6F00', fontWeight: '600' }}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.trendingGrid}>
                                {[
                                    {
                                        name: 'Vaseline',
                                        offer: 'Up to 70% Off',
                                        bg: '#FFEBEE',
                                        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=400&q=80',
                                        filter: { brand: 'Vaseline', minDiscount: 70 }
                                    },
                                    {
                                        name: 'NIVEA',
                                        offer: 'Up to 65% Off',
                                        bg: '#FCE4EC',
                                        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
                                        filter: { brand: 'NIVEA', minDiscount: 65 }
                                    },
                                    {
                                        name: 'Wottagirl!',
                                        offer: 'Up to 60% Off',
                                        bg: '#F8BBD0',
                                        image: 'https://images.unsplash.com/photo-1594038683693-00a0899386c6?auto=format&fit=crop&w=400&q=80',
                                        filter: { brand: 'Wottagirl!', minDiscount: 60 }
                                    },
                                    {
                                        name: 'DENVER',
                                        offer: 'Up to 65% Off',
                                        bg: '#FFCDD2',
                                        image: 'https://images.unsplash.com/photo-1615108422115-3bd44f291307?auto=format&fit=crop&w=400&q=80',
                                        filter: { brand: 'DENVER', minDiscount: 65 }
                                    },
                                    {
                                        name: 'Swiss Beauty',
                                        offer: 'Under ₹299',
                                        bg: '#FCE4EC',
                                        image: 'https://images.unsplash.com/photo-1591327164292-444b79e27303?auto=format&fit=crop&w=400&q=80',
                                        filter: { brand: 'Swiss Beauty', maxPrice: 299 }
                                    },
                                    {
                                        name: "L'ORÉAL",
                                        offer: 'Up to 35% Off',
                                        bg: '#F48FB1',
                                        image: 'https://images.unsplash.com/photo-1571781565023-40f8d4752541?auto=format&fit=crop&w=400&q=80',
                                        filter: { brand: "L'ORÉAL", minDiscount: 35 }
                                    }
                                ].map((brand, index) => (
                                    <View key={index} style={styles.trendingCardContainer}>
                                        <TouchableOpacity
                                            style={[styles.trendingCard, { backgroundColor: brand.bg }]}
                                            onPress={() => router.push({
                                                pathname: '/common-category/[id]',
                                                params: {
                                                    id: 'beauty',
                                                    filters: JSON.stringify(brand.filter)
                                                }
                                            })}
                                        >
                                            <View style={styles.brandLogoPill}>
                                                <Text style={styles.brandLogoText}>{brand.name}</Text>
                                            </View>
                                            <Image source={{ uri: brand.image }} style={styles.trendingImage} />
                                        </TouchableOpacity>
                                        <Text style={styles.trendingOffer}>{brand.offer}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Globally Loved A-listers */}
                        <View style={styles.alistersSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Globally loved A-listers</Text>
                            </View>
                            <View style={styles.trendingGrid}>
                                {[
                                    {
                                        brand: 'MAYBELLINE',
                                        subBrand: 'NEW YORK',
                                        offer: 'Min. 20% Off',
                                        model: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=400&q=80', // Model resembling Gigi
                                        product: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=200&q=80', // Foundation/Tube
                                        bg: '#FFE0B2',
                                        filter: { brand: 'MAYBELLINE', minDiscount: 20 }
                                    },
                                    {
                                        brand: 'COLORBAR',
                                        offer: 'Up to 40% Off',
                                        model: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', // Model resembling Jacqueline
                                        product: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=200&q=80', // Lipstick
                                        bg: '#FFF3E0',
                                        filter: { brand: 'COLORBAR', minDiscount: 40 }
                                    },
                                    {
                                        brand: "L'ORÉAL",
                                        subBrand: 'PROFESSIONNEL PARIS',
                                        offer: 'Up to 20% Off',
                                        model: 'https://images.unsplash.com/photo-1583195763986-0231cf1db3fd?auto=format&fit=crop&w=400&q=80', // Model resembling Alia
                                        product: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80', // Serum bottle
                                        bg: '#FFECB3',
                                        filter: { brand: "L'ORÉAL", minDiscount: 20 }
                                    },
                                    {
                                        brand: 'Dove',
                                        offer: 'Up to 40% Off',
                                        model: 'https://images.unsplash.com/photo-1552699609-899684617562?auto=format&fit=crop&w=400&q=80', // Smiling model
                                        product: 'https://images.unsplash.com/photo-1556228720-1957be979c29?auto=format&fit=crop&w=200&q=80', // Dove bottle style
                                        bg: '#FFE0B2',
                                        filter: { brand: 'Dove', minDiscount: 40 }
                                    }
                                ].map((item, index) => (
                                    <View key={index} style={styles.trendingCardContainer}>
                                        <TouchableOpacity
                                            style={[styles.alisterCard, { backgroundColor: item.bg }]}
                                            onPress={() => router.push({
                                                pathname: '/common-category/[id]',
                                                params: {
                                                    id: 'beauty',
                                                    filters: JSON.stringify(item.filter)
                                                }
                                            })}
                                        >
                                            <View style={styles.alisterHeader}>
                                                <Text style={styles.alisterBrandText}>{item.brand}</Text>
                                                {item.subBrand && <Text style={styles.alisterSubBrandText}>{item.subBrand}</Text>}
                                            </View>

                                            <Image source={{ uri: item.model }} style={styles.alisterModel} />

                                            {/* Product Insert - Overlapping */}
                                            <View style={styles.alisterProductWrapper}>
                                                <Image source={{ uri: item.product }} style={styles.alisterProduct} />
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={styles.trendingOffer}>{item.offer}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>



                        {/* The Launch Party */}
                        <LinearGradient
                            colors={['#F06292', '#FF8A65']} // Pink to Orange Gradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.launchPartyContainer}
                        >
                            <TouchableOpacity onPress={() => router.push('/common-category/beauty/launch-party')} style={styles.launchPartyHeaderRow}>
                                <Text style={styles.launchTitle}>The Launch Party</Text>
                                <View style={styles.launchBadge}>
                                    <Text style={styles.launchBadgeText}>The{'\n'}LAUNCH{'\n'}party</Text>
                                </View>
                            </TouchableOpacity>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.launchScrollContent}>
                                {[
                                    {
                                        brand: "L'ORÉAL PARIS",
                                        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', // Dark aesthetic serum
                                        offer: 'Up to 25% Off',
                                        filter: { brand: "L'ORÉAL PARIS", minDiscount: 25 }
                                    },
                                    {
                                        brand: 'SKIN1004',
                                        image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80', // Beige/Rock aesthetic
                                        offer: 'Up to 25% Off',
                                        filter: { brand: 'SKIN1004', minDiscount: 25 }
                                    },
                                    {
                                        brand: 'Glazed Makeup',
                                        image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=400&q=80', // Pink/Glossy
                                        offer: 'Up to 40% Off',
                                        filter: { brand: 'Glazed Makeup', minDiscount: 40 }
                                    }
                                ].map((item, index) => (
                                    <View key={index} style={styles.launchCard}>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={() => router.push({
                                                pathname: '/common-category/[id]',
                                                params: {
                                                    id: 'beauty',
                                                    filters: JSON.stringify(item.filter)
                                                }
                                            })}
                                        >
                                            <ImageBackground source={{ uri: item.image }} style={styles.launchCardBg} resizeMode="cover">
                                                {/* Brand Overlay if needed, or rely on image composition */}
                                            </ImageBackground>
                                            <View style={styles.launchFooter}>
                                                <Text style={styles.launchFooterText}>{item.offer}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>

                        </LinearGradient>

                        {/* Trend more, spend less */}
                        <View style={styles.trendMoreSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Trend more, spend less</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendMoreScrollContent}>
                                {[
                                    {
                                        title: 'Glazed makeup',
                                        image: 'https://images.unsplash.com/photo-1512413914633-b5043f4041ea?auto=format&fit=crop&w=400&q=80', // Shiny makeup
                                        brands: 'SUGAR | RENEE',
                                        offer: 'Up to 50% Off',
                                        filter: { subcategory: 'Glazed makeup', minDiscount: 50 },
                                        query: 'Glazed makeup'
                                    },
                                    {
                                        title: 'Glass skin',
                                        image: 'https://images.unsplash.com/photo-1512257771764-da7f912cd71a?auto=format&fit=crop&w=400&q=80', // Clear skin
                                        brands: 'COSRX | THE FACE SHOP',
                                        offer: 'Up to 60% Off',
                                        filter: { subcategory: 'Glass skin', minDiscount: 60 },
                                        query: 'Glass skin'
                                    },
                                    {
                                        title: 'Bold Lips',
                                        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80', // Red lips
                                        brands: 'LAKME | MAYBELLINE',
                                        offer: 'Up to 40% Off',
                                        filter: { subcategory: 'Bold Lips', minDiscount: 40 },
                                        query: 'Bold Lips'
                                    }
                                ].map((item, index) => (
                                    <View key={index} style={styles.trendMoreCardContainer}>
                                        <TouchableOpacity
                                            style={styles.trendMoreCard}
                                            onPress={() => router.push({
                                                pathname: '/common-category/[id]',
                                                params: {
                                                    id: 'beauty',
                                                    subcategory: item.query,
                                                    filters: JSON.stringify(item.filter)
                                                }
                                            })}
                                        >
                                            <Text style={styles.trendMoreTitle}>{item.title}</Text>
                                            <View style={styles.trendMoreImageContainer}>
                                                <Image source={{ uri: item.image }} style={styles.trendMoreImage} />
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.trendMoreFooter}>
                                            <Text style={styles.brandRowText}>{item.brands}</Text>
                                            <Text style={styles.trendOfferText}>{item.offer}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Internet-famed brands */}
                        <View style={styles.internetSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Internet-famed brands</Text>
                            </View>
                            <View style={styles.internetGrid}>
                                {[
                                    {
                                        brand: 'PLIX',
                                        desc: 'Anti-hairfall shampoo...',
                                        offer: 'Up to 30% Off',
                                        image: 'https://images.unsplash.com/photo-1556228578-8d84f55d9185?auto=format&fit=crop&w=200&q=80', // Shampoo
                                        bg: ['#F8BBD0', '#EC407A'],
                                        filter: { brand: 'PLIX', minDiscount: 30 }
                                    },
                                    {
                                        brand: 'MOXIE',
                                        desc: 'Dry shampoos, wax sticks...',
                                        offer: 'Up to 10% Off',
                                        image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=200&q=80', // Spray
                                        bg: ['#F48FB1', '#E91E63'],
                                        filter: { brand: 'MOXIE', minDiscount: 10 }
                                    },
                                    {
                                        brand: 'foxtale',
                                        desc: 'Face wash, face serums...',
                                        offer: 'Up to 30% Off',
                                        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=200&q=80', // Orange tube
                                        bg: ['#FFCCBC', '#F06292'],
                                        filter: { brand: 'foxtale', minDiscount: 30 }
                                    },
                                    {
                                        brand: 'mCaffeine',
                                        desc: 'Face & body scrubs...',
                                        offer: 'From ₹149',
                                        image: 'https://images.unsplash.com/photo-1558222043-4f94480bf131?auto=format&fit=crop&w=200&q=80', // Scrub jar
                                        bg: ['#FFAB91', '#F4511E'],
                                        filter: { brand: 'mCaffeine', maxPrice: 149 }
                                    },
                                    {
                                        brand: 'paradyes',
                                        desc: 'Hair tint, hair dye...',
                                        offer: 'From ₹299',
                                        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80', // Hair color box style
                                        bg: ['#F48FB1', '#E91E63'],
                                        filter: { brand: 'paradyes', maxPrice: 299 }
                                    },
                                    {
                                        brand: 'pilgrim',
                                        desc: 'Hair growth serums...',
                                        offer: 'Under ₹499',
                                        image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=200&q=80', // Serum bottle
                                        bg: ['#F8BBD0', '#EC407A'],
                                        filter: { brand: 'pilgrim', maxPrice: 499 }
                                    }
                                ].map((item, index) => (
                                    <View key={index} style={styles.internetCardContainer}>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={() => router.push({
                                                pathname: '/common-category/[id]',
                                                params: {
                                                    id: 'beauty',
                                                    filters: JSON.stringify(item.filter)
                                                }
                                            })}
                                        >
                                            <LinearGradient
                                                colors={item.bg as [string, string]}
                                                style={styles.internetCard}
                                            >
                                                <View style={styles.logoPill}>
                                                    <Text style={styles.logoPillText}>{item.brand}</Text>
                                                </View>
                                                <Text style={styles.internetDesc}>{item.desc}</Text>
                                                <Image source={{ uri: item.image }} style={styles.internetImage} />
                                            </LinearGradient>
                                            <Text style={styles.internetOffer}>{item.offer}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>



                        {/* K-Beauty Obsessed */}
                        <View style={styles.kBeautySection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>K-Beauty obsessed?</Text>
                                <TouchableOpacity onPress={() => router.push('/common-category/beauty/k-beauty')}>
                                    <Text style={{ color: '#FF6F00', fontWeight: '600' }}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.kBeautyContainer}>
                                <ScrollView
                                    ref={kBeautyScrollRef}
                                    horizontal

                                    showsHorizontalScrollIndicator={false}
                                    scrollEventThrottle={16}
                                    onScroll={onKBeautyScroll}
                                    contentContainerStyle={{ paddingHorizontal: 16 }}
                                    snapToInterval={Dimensions.get('window').width * 0.85 + 16} // Card width + margin
                                    decelerationRate="fast"
                                    pagingEnabled={false} // Disable standard paging to allow partial snaps
                                >
                                    {kBeautyData.map((item, index) => (
                                        <View key={index} style={[styles.kBeautyCard, { backgroundColor: item.bg, width: Dimensions.get('window').width * 0.85, marginRight: 16 }]}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ flex: 1 }}
                                                onPress={() => router.push({
                                                    pathname: '/common-category/[id]',
                                                    params: {
                                                        id: 'beauty',
                                                        filters: JSON.stringify(item.filter)
                                                    }
                                                })}
                                            >
                                                {/* Brand Pill */}
                                                <View style={styles.kBeautyBrandPill}>
                                                    <Text style={[styles.kBeautyBrandText, item.darkText && { color: '#000' }]}>{item.brand}</Text>
                                                </View>

                                                {/* Product Image */}
                                                <Image source={{ uri: item.image }} style={styles.kBeautyImage} />

                                                {/* Ingredient Box */}
                                                <View style={styles.kBeautyIngredientBox}>
                                                    <Text style={styles.ingredientTitle}>{item.ingredientTitle}</Text>
                                                    <View style={styles.ingredientDivider} />
                                                    <Text style={styles.ingredientName}>{item.ingredient}</Text>
                                                </View>

                                                {/* Offer Footer */}
                                                <LinearGradient
                                                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                                                    style={styles.kBeautyGradientFooter}
                                                >
                                                    <Text style={styles.kBeautyOfferText}>{item.offer}</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>

                                {/* Pagination Dots */}
                                <View style={styles.paginationContainer}>
                                    {kBeautyData.map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.paginationDot,
                                                kBeautyActiveIndex === index ? styles.activeDot : styles.inactiveDot
                                            ]}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>



                        {/* Glam on a budget */}
                        <View style={styles.glamSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Glam on a budget</Text>
                            </View>
                            <View style={styles.glamGrid}>
                                {/* Price Row */}
                                {[
                                    { label: 'Under', value: '₹199', maxPrice: 199 },
                                    { label: 'Under', value: '₹299', maxPrice: 299 },
                                    { label: 'Under', value: '₹399', maxPrice: 399 }
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={`price-${index}`}
                                        style={styles.glamCard}
                                        onPress={() => router.push({
                                            pathname: '/common-category/[id]',
                                            params: {
                                                id: 'beauty',
                                                filters: JSON.stringify({ maxPrice: item.maxPrice })
                                            }
                                        })}
                                    >
                                        <LinearGradient
                                            colors={['#FFFDE7', '#FFD54F']} // Light to Rich Gold
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 0, y: 1 }} // Vertical gradient
                                            style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
                                        />
                                        <Text style={styles.glamLabel}>{item.label}</Text>
                                        <Text style={styles.glamValue}>{item.value}</Text>
                                    </TouchableOpacity>
                                ))}

                                {/* Discount Row */}
                                {[
                                    { label: 'Min.', value: '30%', sub: 'Off', minDiscount: 30 },
                                    { label: 'Min.', value: '50%', sub: 'Off', minDiscount: 50 },
                                    { label: 'Min.', value: '70%', sub: 'Off', minDiscount: 70 }
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={`disc-${index}`}
                                        style={styles.glamCard}
                                        onPress={() => router.push({
                                            pathname: '/common-category/[id]',
                                            params: {
                                                id: 'beauty',
                                                filters: JSON.stringify({ minDiscount: item.minDiscount })
                                            }
                                        })}
                                    >
                                        <LinearGradient
                                            colors={['#FFECB3', '#FFCA28']} // Amber to Deep Gold
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 0, y: 1 }} // Vertical gradient
                                            style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
                                        />
                                        <Text style={styles.glamLabel}>{item.label}</Text>
                                        <Text style={styles.glamValue}>{item.value}</Text>
                                        <Text style={styles.glamSub}>{item.sub}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 3. Latest Products */}
                        <View style={styles.productsSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Latest in {categoryName}</Text>
                            </View>

                            <View style={styles.productsGrid}>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onPress={() => router.push(`/product/${product._id}`)}
                                        />
                                    ))
                                ) : (
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyText}>No products found</Text>
                                    </View>
                                )}
                            </View>
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
        paddingTop: 12,
        paddingBottom: 0, // Reduced bottom padding
    },
    horizontalScrollContent: {
        paddingHorizontal: 8,
    },
    columnWrapper: {
        marginRight: 12,
        justifyContent: 'flex-start',
    },
    subcategoryItem: {
        width: (width - 60) / 4,
        maxWidth: 85,
        alignItems: 'center',
        marginBottom: 12, // Reduced item bottom margin slightly too
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
        paddingHorizontal: 0, // Matched FashionPage
    },

    // Promo Poster Styles
    promoPosterContainer: {
        marginTop: 4,
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        height: 120,
        backgroundColor: '#f0f0f0',
    },
    promoPoster: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    consultationDoctorImage: {
        width: 120, // Slightly larger
        height: 120,
        resizeMode: 'contain',
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 999,
        position: 'absolute',
    },

    // Harvest Section Styles
    harvestSection: {
        paddingBottom: 20,
        paddingLeft: 16,
    },
    sectionTitleBlack: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    harvestScrollContent: {
        paddingRight: 16,
    },
    harvestItemContainer: {
        marginRight: 12,
        alignItems: 'center',
    },
    harvestCard: {
        width: 140,
        height: 180, // Fixed height for consistency
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#FFF3E0', // Fallback color
        marginBottom: 8,
    },
    harvestCardInner: {
        flex: 1,
    },
    harvestBackground: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
    },
    harvestImageWrapper: {
        width: 100,
        height: 100, // Product image size
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    harvestImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        zIndex: 1,
    },
    kiteIcon: {
        position: 'absolute',
        top: -10,
        right: -15,
        fontSize: 24,
        zIndex: 2,
        transform: [{ rotate: '15deg' }]
    },
    kiteIconSmall: {
        position: 'absolute',
        top: 10,
        left: -10,
        fontSize: 16,
        zIndex: 2,
        transform: [{ rotate: '-10deg' }]
    },
    offerBadge: {
        backgroundColor: '#E91E63', // Deep Pink
        width: '100%', // Full width for wave look
        paddingVertical: 6,
        borderTopLeftRadius: 50, // More curve to simulate the wave/dip
        borderTopRightRadius: 50,
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    offerText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    // Label Pill below the card
    labelPill: {
        backgroundColor: '#FCE4EC', // Very light pink
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    labelText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },


    // Consultation Banner Styles
    consultationBanner: {
        backgroundColor: '#D1E7FC', // Light Blue
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        height: 110,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        paddingLeft: 16,
    },
    consultationContent: {
        flex: 1,
        zIndex: 2,
    },
    consultationTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    consultationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stethoscopeIconContainer: {
        marginRight: 8,
    },
    consultationTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0D47A1',
        lineHeight: 18,
    },
    consultationDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#90CAF9',
        marginHorizontal: 12,
    },
    callContainer: {
        justifyContent: 'center',
    },
    consultationCallText: {
        fontSize: 10,
        color: '#1565C0',
    },
    consultationPhone: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0D47A1',
    },
    sarvrachnaBadge: {
        marginTop: 4,
    },
    poweredByText: {
        fontSize: 9,
        color: '#555',
    },
    sarvrachnaLogoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sarvrachnaText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0056D2',
        fontStyle: 'italic',
    },



    // Trending Brands Styles
    trendingSection: {
        marginBottom: 24,
    },
    trendingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    trendingCardContainer: {
        width: '48%',
        marginBottom: 16,
        alignItems: 'center',
    },
    trendingCard: {
        width: '100%',
        height: 160,
        borderRadius: 20,
        position: 'relative',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10,
        overflow: 'hidden',
    },
    brandLogoPill: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#fff',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        zIndex: 2,
    },
    brandLogoText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
        textTransform: 'uppercase',
    },
    trendingImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    trendingOffer: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },

    // A-listers Styles
    alistersSection: {
        marginBottom: 24,
    },
    alisterCard: {
        width: '100%',
        height: 190,
        borderRadius: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    alisterHeader: {
        position: 'absolute',
        top: 15,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 2,
    },
    alisterBrandText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 1,
        textAlign: 'center',
    },
    alisterSubBrandText: {
        fontSize: 8,
        color: '#333',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    alisterModel: {
        width: '70%',
        height: '80%',
        position: 'absolute',
        bottom: 0,
        right: 0,
        resizeMode: 'cover',
        borderTopLeftRadius: 50, // Smooth blend
    },
    alisterProductWrapper: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: 70,
        height: 90,
        backgroundColor: 'rgba(255,255,255,0.4)', // Subtle backing
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    alisterProduct: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
        transform: [{ rotate: '-10deg' }]
    },



    // Launch Party Styles
    launchPartyContainer: {
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
    },
    launchPartyHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    launchTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 4,
    },
    launchBadge: {
        backgroundColor: '#E91E63', // Darker pink/red badge
        borderRadius: 50,
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    launchBadgeText: {
        color: '#fff',
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 10,
    },
    launchScrollContent: {
        paddingRight: 0,
    },
    launchCard: {
        width: 150,
        height: 200,
        borderRadius: 16,
        marginRight: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    launchCardBg: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
    },
    launchFooter: {
        backgroundColor: '#D32F2F', // Red footer
        paddingVertical: 8,
        alignItems: 'center',
    },
    launchFooterText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },



    // Trend More Styles
    trendMoreSection: {
        marginBottom: 24,
    },
    trendMoreScrollContent: {
        paddingHorizontal: 16,
    },
    trendMoreCardContainer: {
        marginRight: 16,
        alignItems: 'center',
    },
    trendMoreCard: {
        width: 160,
        height: 200,
        backgroundColor: '#E91E63', // Hot Pink
        borderRadius: 24,
        paddingTop: 16,
        alignItems: 'center',
        overflow: 'hidden',
    },
    trendMoreTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    trendMoreImageContainer: {
        flex: 1,
        width: '100%',
        borderTopLeftRadius: 100, // Create the unique curved shape at top of image (bottom of card content)
        borderTopRightRadius: 100,
        overflow: 'hidden',
        backgroundColor: '#fff', // Or image bg
        marginTop: 4,
    },
    trendMoreImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    trendMoreFooter: {
        marginTop: 8,
        alignItems: 'center',
    },
    brandRowText: {
        fontSize: 10,
        color: '#666',
        fontWeight: '500',
        marginBottom: 2,
        textTransform: 'uppercase',
    },


    trendOfferText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },

    // Internet-famed Styles
    internetSection: {
        marginBottom: 24,
    },
    internetGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    internetCardContainer: {
        width: '48%',
        marginBottom: 16,
        alignItems: 'center',
    },
    internetCard: {
        width: '100%',
        height: 200,
        borderRadius: 20,
        borderTopLeftRadius: 80, // High arch
        borderTopRightRadius: 80,
        alignItems: 'center',
        paddingTop: 20,
        overflow: 'hidden',
    },
    logoPill: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    logoPillText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        textTransform: 'uppercase',
    },
    internetDesc: {
        color: '#fff',
        fontSize: 11,
        textAlign: 'center',
        paddingHorizontal: 10,
        marginBottom: 8,
        fontWeight: '500',
    },
    internetImage: {
        width: '70%',
        height: 100,
        resizeMode: 'contain',
        position: 'absolute',
        bottom: 0,
    },
    internetOffer: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },



    // K-Beauty Styles
    kBeautySection: {
        marginBottom: 32,
        paddingHorizontal: 16,
    },

    // Glam on a Budget Styles
    glamSection: {
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    glamGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    glamCard: {
        width: '31%', // Fits 3 in a row
        aspectRatio: 1, // Square
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    glamLabel: {
        fontSize: 14,
        color: '#5D4037', // Dark brown
        marginBottom: 2,
        fontWeight: '500',
    },
    glamValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3E2723', // Very dark brown/red
    },
    glamSub: {
        fontSize: 16,
        color: '#5D4037',
        fontWeight: '500',
    },
    glamCurve: {
        position: 'absolute',
        bottom: -20,
        left: -10,
        right: -10,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 100,
        transform: [{ scaleX: 1.5 }],
    },
    kBeautyContainer: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    kBeautyCard: {
        width: Dimensions.get('window').width - 32, // Full width minus padding (overridden inline)
        height: 340, // Reduced from 400
        borderRadius: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    kBeautyBrandPill: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 30,
        zIndex: 2,
    },
    kBeautyBrandText: {
        fontSize: 24,
        fontWeight: '300', // Light font weight for elegance
        color: '#fff',
        letterSpacing: 2,
    },
    kBeautyImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    kBeautyIngredientBox: {
        position: 'absolute',
        right: 0,
        top: '45%',
        backgroundColor: '#E91E63',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        zIndex: 2,
        elevation: 4,
    },
    ingredientTitle: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    ingredientDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginVertical: 4,
        width: '100%',
    },
    ingredientName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    kBeautyGradientFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    kBeautyOfferText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    paginationDot: {
        height: 4,
        borderRadius: 2,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: '#000',
    },
    inactiveDot: {
        width: 12,
        backgroundColor: '#E0E0E0',
    },

    productsSection: {
        marginTop: 8,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    emptyState: {
        width: '100%',
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },


});
