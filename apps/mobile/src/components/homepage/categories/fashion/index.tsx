import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../../lib/api';
import ProductCard from '../../ProductCard';
import CategoryBannerSlider from '../../CategoryBannerSlider';
import { FontAwesome5 } from '@expo/vector-icons';

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

interface FashionPageProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function FashionPage({ staticHeader, renderStickyHeader }: FashionPageProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Scroll tracking
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        console.log('FashionPage mounted - Fetching live data');
        fetchFashionData();
    }, []);

    const fetchFashionData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Fashion Category for Banners (Posters)
            const categoryResponse = await api.get('/api/categories/fashion');
            if (categoryResponse.data && categoryResponse.data.posters && categoryResponse.data.posters.length > 0) {
                setBanners(categoryResponse.data.posters);
            }

            // 2. Fetch Subcategories
            const subcategoriesResponse = await api.get('/api/categories/fashion/subcategories');
            if (Array.isArray(subcategoriesResponse.data) && subcategoriesResponse.data.length > 0) {
                setSubcategories(subcategoriesResponse.data);
            }

            // 3. Fetch Products (retaining the "Latest in Fashion" section)
            const productsResponse = await api.get('/api/products?category=Fashion&limit=10');
            const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : (productsResponse.data.products || []);
            setProducts(productsData);

        } catch (error) {
            console.error('Error fetching fashion data:', error);
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
                                                                        <Text style={{ fontSize: 20 }}>👕</Text>
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

                        {/* 3. Shopping For Others Section */}
                        <View style={styles.shoppingForOthersSection}>
                            <TouchableOpacity onPress={() => router.push('/fashion/shopping-for-others')}>
                                <Text style={styles.sectionTitleBlack}>Shopping for others? ›</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.shoppingOthersScrollContent}
                            >
                                {[
                                    { name: 'Women', slug: 'women', image: 'https://loremflickr.com/400/400/woman,fashion?lock=1' },
                                    { name: 'Gen Z Drips', slug: 'gen-z-drips', image: 'https://loremflickr.com/400/400/couple,fashion?lock=2' },
                                    { name: 'Kids', slug: 'kids', image: 'https://loremflickr.com/400/400/kids,fashion?lock=3' },
                                    { name: 'Men', slug: 'men', image: 'https://loremflickr.com/400/400/man,fashion?lock=4' },
                                    { name: 'Luxe', slug: 'luxe', image: 'https://loremflickr.com/400/400/luxury,fashion?lock=5' },
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.shoppingOthersItem}
                                        onPress={() => router.push(`/fashion/collection/${item.slug}`)}
                                    >
                                        <View style={styles.shoppingOthersImageContainer}>
                                            <Image source={{ uri: item.image }} style={styles.shoppingOthersImage} />
                                        </View>
                                        <Text style={styles.shoppingOthersName}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 4. Early Bird Deals Section */}
                        <View style={styles.earlyBirdSection}>
                            <TouchableOpacity
                                style={styles.earlyBirdHeader}
                                onPress={() => router.push('/fashion/collection/early-bird-deals')}
                            >
                                <Text style={styles.earlyBirdTitle}>Early Bird Deals! ›</Text>
                            </TouchableOpacity>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.earlyBirdScrollContent}>
                                {[
                                    { id: 'dummy_cat_01', brand: 'USPA & more', offer: 'Min. 60% Off', image: 'https://loremflickr.com/300/400/shirt,men?lock=10' },
                                    { id: 'dummy_cat_02', brand: 'PUMA & more', offer: 'Min. 70% Off', image: 'https://loremflickr.com/300/400/shoes,sneakers?lock=11' },
                                    { id: 'dummy_cat_03', brand: 'Titan & more', offer: '30-60% Off', image: 'https://loremflickr.com/300/400/watch?lock=12' },
                                    { id: 'dummy_cat_04', brand: 'Levis & more', offer: 'Min. 50% Off', image: 'https://loremflickr.com/300/400/jeans?lock=13' },
                                    { id: 'dummy_cat_05', brand: 'Nike & more', offer: 'Min. 40% Off', image: 'https://loremflickr.com/300/400/sportswear?lock=14' },
                                    { id: 'dummy_cat_06', brand: 'Adidas & more', offer: 'Min. 50% Off', image: 'https://loremflickr.com/300/400/running,shoes?lock=15' },
                                ].map((deal, index) => {
                                    // Extract percentage from offer string for filtering (e.g., "Min. 60% Off" -> 60)
                                    const discountMatch = deal.offer.match(/(\d+)%/);
                                    const discountValue = discountMatch ? parseInt(discountMatch[1], 10) : 0;

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.earlyBirdCard}
                                            onPress={() => {
                                                router.push({
                                                    pathname: '/common-category/[id]',
                                                    params: {
                                                        id: deal.id,
                                                        isFilter: 'true',
                                                        filters: JSON.stringify({ minDiscount: discountValue })
                                                    }
                                                });
                                            }}
                                        >
                                            <View style={styles.earlyBirdImageContainer}>
                                                <Image source={{ uri: deal.image }} style={styles.earlyBirdImage} />
                                            </View>
                                            <View style={styles.earlyBirdOfferBadge}>
                                                <Text style={styles.earlyBirdOfferText}>{deal.offer}</Text>
                                            </View>
                                            <Text style={styles.earlyBirdBrand}>{deal.brand}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* 5. Shine bright this Sankranti Section */}
                        <View style={styles.festiveSection}>
                            <TouchableOpacity onPress={() => router.push('/fashion/collection/sankranti')}>
                                <Text style={styles.sectionTitleBlack}>Shine bright this Sankranti ›</Text>
                            </TouchableOpacity>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                                {[
                                    { id: 'sankranti_cat_01', title: 'Short kurtas', price: 'From ₹199', image: 'https://loremflickr.com/300/400/kurta,men?lock=20' },
                                    { id: 'sankranti_cat_02', title: 'Kurtas & sets', price: 'From ₹299', image: 'https://loremflickr.com/300/400/kurta,man?lock=21' },
                                    { id: 'sankranti_cat_03', title: 'Ethnic sets', price: 'Under ₹499', image: 'https://loremflickr.com/300/400/kid,ethnic?lock=22' },
                                    { id: 'sankranti_cat_04', title: 'Nehru Jackets', price: 'From ₹399', image: 'https://loremflickr.com/300/400/jacket,ethnic?lock=23' },
                                    { id: 'sankranti_cat_05', title: 'Dhotis', price: 'From ₹149', image: 'https://loremflickr.com/300/400/dhoti,men?lock=24' },
                                ].map((item, index) => {
                                    // Extract price for filtering
                                    const priceMatch = item.price.match(/₹(\d+)/);
                                    const priceValue = priceMatch ? parseInt(priceMatch[1], 10) : 0;

                                    // Determine filter param based on text ("From" -> minPrice, "Under" -> maxPrice)
                                    const isUnder = item.price.toLowerCase().includes('under');
                                    const filterParams = isUnder ? { maxPrice: priceValue } : { minPrice: priceValue };

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.festiveCard}
                                            onPress={() => {
                                                router.push({
                                                    pathname: '/common-category/[id]',
                                                    params: {
                                                        id: item.id,
                                                        isFilter: 'true',
                                                        filters: JSON.stringify(filterParams)
                                                    }
                                                });
                                            }}
                                        >
                                            <View style={styles.festiveImageContainer}>
                                                <Image source={{ uri: item.image }} style={styles.festiveImage} />
                                            </View>
                                            <View style={styles.festiveBanner}>
                                                <View style={styles.festiveIconLeft} />
                                                <View>
                                                    <Text style={styles.festiveTitle}>{item.title}</Text>
                                                    <Text style={styles.festivePrice}>{item.price}</Text>
                                                </View>
                                                <View style={styles.festiveIconRight} />
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* 6. Shoe's steal Fest Section */}
                        <View style={styles.shoeFestSection}>
                            <TouchableOpacity onPress={() => router.push('/fashion/collection/shoe-steal-fest')}>
                                <Text style={styles.sectionTitleBlack}>Shoe's steal Fest ›</Text>
                            </TouchableOpacity>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                                {[
                                    { id: 'shoes_cat_01', title: 'Men’s sneakers', offer: 'Min. 70% Off', image: 'https://loremflickr.com/300/400/sneakers?lock=30' },
                                    { id: 'shoes_cat_02', title: 'Heels, wedges & more', offer: 'Under ₹499', image: 'https://loremflickr.com/300/400/heels?lock=31' },
                                    { id: 'shoes_cat_03', title: 'Men’s sports shoes', offer: 'Under ₹449', image: 'https://loremflickr.com/300/400/sportshoes?lock=32' },
                                    { id: 'shoes_cat_04', title: 'Girls’ boots', offer: 'From ₹299', image: 'https://loremflickr.com/300/400/girl,boots?lock=33' },
                                    { id: 'shoes_cat_05', title: 'Boys’ casuals', offer: 'Min. 50% Off', image: 'https://loremflickr.com/300/400/boy,shoes?lock=34' },
                                ].map((item, index) => {
                                    let filterParams = {};

                                    // Hybrid Logic: Check for Discount (%) OR Price (₹)
                                    if (item.offer.includes('%')) {
                                        // Handle Discount
                                        const discountMatch = item.offer.match(/(\d+)%/);
                                        const discountValue = discountMatch ? parseInt(discountMatch[1], 10) : 0;
                                        filterParams = { minDiscount: discountValue };
                                    } else if (item.offer.includes('₹')) {
                                        // Handle Price
                                        const priceMatch = item.offer.match(/₹(\d+)/);
                                        const priceValue = priceMatch ? parseInt(priceMatch[1], 10) : 0;
                                        const isUnder = item.offer.toLowerCase().includes('under');
                                        filterParams = isUnder ? { maxPrice: priceValue } : { minPrice: priceValue };
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.shoeFestCard}
                                            onPress={() => {
                                                router.push({
                                                    pathname: '/common-category/[id]',
                                                    params: {
                                                        id: item.id,
                                                        isFilter: 'true',
                                                        filters: JSON.stringify(filterParams)
                                                    }
                                                });
                                            }}
                                        >
                                            <View style={styles.shoeFestImageContainer}>
                                                <Image source={{ uri: item.image }} style={styles.shoeFestImage} />
                                            </View>
                                            <View style={styles.shoeFestInfo}>
                                                <Text style={styles.shoeFestTitle} numberOfLines={1}>{item.title}</Text>
                                                <Text style={styles.shoeFestOffer}>{item.offer}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>


                        {/* 7. Winter Clearance Sale Section */}
                        <View style={styles.winterClearanceSection}>
                            <TouchableOpacity onPress={() => router.push('/fashion/collection/winter-clearance')}>
                                <Text style={styles.sectionTitleBlack}>Winter Clearance Sale is live! ›</Text>
                            </TouchableOpacity>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                                {[
                                    { offer: 'Min. 60% Off', brand: 'FORT COLLINS', image: 'https://loremflickr.com/300/400/winter,jacket?lock=40' },
                                    { offer: 'Min. 50% Off', brand: 'MONTE CARLO', image: 'https://loremflickr.com/300/400/jacket,men?lock=41' },
                                    { offer: 'Min. 50% Off', brand: 'Allen Solly', image: 'https://loremflickr.com/300/400/sweatshirt,men?lock=42' },
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.winterClearanceCard}
                                        onPress={() => router.push('/fashion/collection/winter-clearance')}
                                    >
                                        <View style={styles.winterClearanceImageContainer}>
                                            <Image source={{ uri: item.image }} style={styles.winterClearanceImage} />
                                        </View>
                                        <View style={styles.winterClearanceOverlay}>
                                            {/* Abstract curve SVG or just a view with border radius */}
                                            <View style={styles.winterCurve} />
                                            <View style={styles.winterInfo}>
                                                <Text style={styles.winterOffer}>{item.offer}</Text>
                                                <View style={styles.winterBrandContainer}>
                                                    <Text style={styles.winterBrand}>{item.brand}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 8. Deals of the day Section */}
                        <View style={styles.dealsOfDaySection}>
                            <TouchableOpacity onPress={() => router.push('/fashion/collection/deals-of-the-day')}>
                                <Text style={styles.sectionTitleBlack}>Deals of the day ›</Text>
                            </TouchableOpacity>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                                {[
                                    { brand: 'Spykar', offer: 'Min. 70% Off', image: 'https://loremflickr.com/300/400/jeans,men?lock=50' },
                                    { brand: 'Asics, Skechers...', offer: 'Min. 55% Off', image: 'https://loremflickr.com/300/400/runningshoes?lock=51' },
                                    { brand: 'Killer', offer: 'Min 80% Off', image: 'https://loremflickr.com/300/400/hoodie?lock=52' },
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dealsOfDayCard}
                                        onPress={() => router.push('/fashion/collection/deals-of-the-day')}
                                    >
                                        <View style={styles.dealsOfDayImageContainer}>
                                            <Image source={{ uri: item.image }} style={styles.dealsOfDayImage} />
                                        </View>
                                        <View style={styles.dealsOfDayInfo}>
                                            <Text style={styles.dealsOfDayBrand} numberOfLines={1}>{item.brand}</Text>
                                            <Text style={styles.dealsOfDayOffer}>{item.offer}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>


                        {/* 9. Budget Buys Section */}
                        <View style={styles.budgetBuysSection}>
                            <TouchableOpacity onPress={() => router.push('/fashion/collection/budget-buys')}>
                                <Text style={styles.sectionTitleBlack}>Budget Buys ›</Text>
                            </TouchableOpacity>
                            <View style={styles.budgetBuysGrid}>
                                {[
                                    { price: '299', image: 'https://loremflickr.com/300/300/fashion,woman?lock=60' },
                                    { price: '399', image: 'https://loremflickr.com/300/300/fashion,man?lock=61' },
                                    { price: '699', image: 'https://loremflickr.com/300/300/fashion,model?lock=62' },
                                    { price: '999', image: 'https://loremflickr.com/300/300/fashion,dress?lock=63' },
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.budgetBuysCard}
                                        onPress={() => router.push('/fashion/collection/budget-buys')}
                                    >
                                        <Image source={{ uri: item.image }} style={styles.budgetBuysImage} />
                                        <View style={styles.budgetBuysOverlay}>
                                            <Text style={styles.budgetBuysUnder}>UNDER</Text>
                                            <Text style={styles.budgetBuysPrice}>₹{item.price}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 10. Fashion Forecast Section */}
                        <View style={styles.forecastSection}>
                            <TouchableOpacity onPress={() => router.push('/fashion/collection/fashion-forecast')}>
                                <Text style={styles.forecastHeader}>FASHION FORECAST ›</Text>
                            </TouchableOpacity>
                            {[
                                { title: 'TEXTURED\nSWEATERS', sub: 'From ₹249', image: 'https://loremflickr.com/400/200/sweater,man?lock=70', align: 'left' },
                                { title: 'BAGGY\nJEANS', sub: 'Min. 60% Off', image: 'https://loremflickr.com/400/200/jeans,legs?lock=71', align: 'right' },
                                { title: 'PLAID\nSHIRTS', sub: '', image: 'https://loremflickr.com/400/200/plaid,shirt,man?lock=72', align: 'bottomLeft' },
                                { title: 'OVERSIZED\nTEES', sub: 'Under ₹399', image: 'https://loremflickr.com/400/200/tshirt,streetwear?lock=73', align: 'right' },
                            ].map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.forecastCard}
                                    onPress={() => router.push('/fashion/collection/fashion-forecast')}
                                >
                                    <Image source={{ uri: item.image }} style={styles.forecastImage} />
                                    <View style={[
                                        styles.forecastOverlay,
                                        item.align === 'left' ? styles.alignLeft :
                                            item.align === 'right' ? styles.alignRight :
                                                styles.alignBottomLeft
                                    ]}>
                                        <Text style={styles.forecastTitle}>{item.title}</Text>
                                        {item.sub ? <Text style={styles.forecastSub}>{item.sub}</Text> : null}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* 11. Winter Collection Section */}
                        <View style={styles.winterCollectionSection}>
                            <TouchableOpacity onPress={() => router.push('/fashion/collection/winter-collection')}>
                                <Text style={styles.sectionTitleBlack}>Winter collection ›</Text>
                            </TouchableOpacity>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.winterScroll}>
                                {[
                                    { name: 'PUMA, USPA...', offer: 'Min. 50% Off', image: 'https://loremflickr.com/200/250/man,jacket?lock=80' },
                                    { name: 'Allen Solly...', offer: 'Min. 50% Off', image: 'https://loremflickr.com/200/250/man,sweater?lock=81' },
                                    { name: 'Sweater', offer: 'Min. 60% Off', image: 'https://loremflickr.com/200/250/boy,sweater?lock=82' },
                                    { name: 'Jackets', offer: 'Min. 40% Off', image: 'https://loremflickr.com/200/250/woman,jacket?lock=83' },
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.winterCollectionCard}
                                        onPress={() => router.push('/fashion/collection/winter-collection')}
                                    >
                                        <Image source={{ uri: item.image }} style={styles.winterCollectionImage} />
                                        <View style={styles.winterCollectionFooter}>
                                            <View style={styles.snowflakeLeft}>
                                                <FontAwesome5 name="snowflake" size={16} color="#B3E5FC" />
                                            </View>
                                            <View style={styles.snowflakeRight}>
                                                <FontAwesome5 name="snowflake" size={16} color="#B3E5FC" />
                                            </View>
                                            <Text style={styles.winterCollectionName}>{item.name}</Text>
                                            <Text style={styles.winterCollectionOffer}>{item.offer}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.productsSection}>

                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Latest in Fashion</Text>
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
                                        <Text style={styles.emptyText}>No fashion products found</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Bottom overscroll cover */}
                        <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: '#F9FAFB' }} />
                    </>
                )}
            </View>
        </ScrollView >
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
        borderTopLeftRadius: 0, // Optional: if you want rounded corners for the content sheet
        borderTopRightRadius: 0,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },

    // Subcategories Styles
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

    // Products Styles
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

    // Shopping For Others Styles
    shoppingForOthersSection: {
        marginTop: 8,
        // paddingHorizontal: 16, // Removed container padding so scroll view touches edges if desired, but we probably want text to align. 
        // Let's keep margin mostly but handle scroll padding in contentContainer
        marginBottom: 20,
        marginLeft: 16, // Align title
    },
    sectionTitleBlack: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    shoppingOthersScrollContent: {
        paddingRight: 16, // Padding at the end of scroll
    },
    shoppingOthersItem: {
        width: 110, // Fixed width for scrollable items
        marginRight: 12,
        alignItems: 'center',
    },
    shoppingOthersImageContainer: {
        width: '100%',
        aspectRatio: 1, // Square-ish
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
    },
    shoppingOthersImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    shoppingOthersName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111',
        textAlign: 'center',
    },

    // Early Bird Deals Styles
    earlyBirdSection: {
        marginHorizontal: 12,
        marginBottom: 24,
        backgroundColor: '#A2D2FF', // Light Blue
        borderRadius: 16,
        paddingVertical: 16,
        paddingLeft: 16,
        overflow: 'hidden',
    },
    earlyBirdHeader: {
        marginBottom: 12,
        paddingRight: 16,
    },
    earlyBirdTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    earlyBirdScrollContent: {
        paddingRight: 16,
    },
    earlyBirdCard: {
        width: 140,
        marginRight: 12,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    earlyBirdImageContainer: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: 0, // Offer badge overlaps or connects
    },
    earlyBirdImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    earlyBirdOfferBadge: {
        backgroundColor: '#0056D2', // Darker Blue
        width: '100%',
        paddingVertical: 6,
        alignItems: 'center',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        marginTop: -10, // Pull up overlap if needed, or just standard
        zIndex: 1,
    },
    earlyBirdOfferText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    earlyBirdBrand: {
        marginTop: 6,
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
    },

    // Shine Bright (Festive) Styles
    festiveSection: {
        marginBottom: 24,
        marginLeft: 16,
    },
    festiveCard: {
        width: 130, // Smaller width
        marginRight: 12,
        borderRadius: 12, // Slightly tighter radius
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    festiveImageContainer: {
        width: '100%',
        height: 160, // Reduced height proportionally
        backgroundColor: '#eee',
    },
    festiveImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    festiveBanner: {
        backgroundColor: '#BA68C8', // Lighter purple
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    // Replaced text emoji with a yellow diamond shape (kite)
    festiveIconLeft: {
        width: 14,
        height: 14,
        backgroundColor: '#FFEB3B', // Yellow
        transform: [{ rotate: '-45deg' }],
        borderRadius: 2,
    },
    festiveIconRight: {
        width: 14,
        height: 14,
        backgroundColor: '#FFEB3B', // Yellow
        transform: [{ rotate: '45deg' }],
        borderRadius: 2,
    },
    festiveTitle: {
        color: 'rgba(255,255,255,0.95)',
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 2,
        fontWeight: '500',
    },
    festivePrice: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // Shoe's Steal Fest Styles
    shoeFestSection: {
        marginBottom: 24,
        marginLeft: 16,
    },
    shoeFestCard: {
        width: 160,
        marginRight: 12,
        marginBottom: 4,
    },
    shoeFestImageContainer: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: '#eee',
    },
    shoeFestImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    shoeFestInfo: {
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    shoeFestTitle: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 2,
        textAlign: 'center',
    },
    shoeFestOffer: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'center',
    },


    // Winter Clearance Styles
    winterClearanceSection: {
        marginBottom: 24,
        marginLeft: 16,
    },
    winterClearanceCard: {
        width: 150,
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1E88E5',
        height: 240,
        paddingBottom: 0,
    },
    winterClearanceImageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
        marginBottom: 0,
    },
    winterClearanceImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    winterClearanceOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 4,
    },
    winterCurve: {
        display: 'none',
    },
    winterInfo: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    winterOffer: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    winterBrandContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        minWidth: 80,
        alignItems: 'center',
    },
    winterBrand: {
        color: '#111',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

    // Deals of the day Styles
    dealsOfDaySection: {
        marginBottom: 24,
        marginLeft: 16,
    },
    dealsOfDayCard: {
        width: 140,
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        paddingBottom: 8,
    },
    dealsOfDayImageContainer: {
        width: '100%',
        height: 160,
        backgroundColor: '#FAFAFA',
        marginBottom: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: 'hidden',
    },
    dealsOfDayImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    dealsOfDayInfo: {
        paddingHorizontal: 8,
    },
    dealsOfDayBrand: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 2,
    },
    dealsOfDayOffer: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111',
    },

    // Budget Buys Styles
    budgetBuysSection: {
        marginBottom: 24,
        marginLeft: 16,
        marginRight: 16, // Grid needs right margin constrained
    },
    budgetBuysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    budgetBuysCard: {
        width: '48%', // 2 items per row with space
        aspectRatio: 1, // Square cards
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f0f0f0',
    },
    budgetBuysImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.9,
    },
    budgetBuysOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        // Transparent overlay
    },
    budgetBuysUnder: {
        color: '#111',
        fontSize: 18,
        letterSpacing: 2,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
        marginBottom: -4,
    },
    budgetBuysPrice: {
        color: '#111',
        fontSize: 42,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
        marginTop: 0,
    },

    // Fashion Forecast Styles
    forecastSection: {
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    forecastHeader: {
        fontSize: 24,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
        fontWeight: 'bold', // Or '400' if Didot is bold enough naturally, image looks standard weight but large
        color: '#111',
        textAlign: 'center',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    forecastCard: {
        width: '100%',
        height: 180,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    forecastImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    forecastOverlay: {
        position: 'absolute',
        padding: 20,
        justifyContent: 'center',
    },
    alignLeft: {
        top: 0,
        bottom: 0,
        left: 0,
        alignItems: 'flex-start',
    },
    alignRight: {
        top: 0,
        bottom: 0,
        right: 0,
        alignItems: 'flex-end',
    },
    alignBottomLeft: {
        bottom: 0,
        left: 0,
        alignItems: 'flex-start',
    },
    forecastTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
        lineHeight: 32,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    forecastSub: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },

    // Winter Collection Styles
    winterCollectionSection: {
        marginBottom: 32,
        marginLeft: 16,
    },
    winterScroll: {
        paddingRight: 16,
    },
    winterCollectionCard: {
        width: 140,
        height: 220,
        marginRight: 16,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F5F5DC', // Beige/Cream background for the footer part
    },
    winterCollectionImage: {
        width: '100%',
        height: '70%',
        resizeMode: 'cover',
    },
    winterCollectionFooter: {
        width: '100%',
        height: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#FAF0E6', // Linen/very light beige
    },
    winterCollectionName: {
        fontSize: 12,
        color: '#555',
        marginBottom: 2,
        textAlign: 'center',
    },
    winterCollectionOffer: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'center',
    },
    snowflakeLeft: {
        position: 'absolute',
        bottom: 10,
        left: 5,
        opacity: 0.6,
        transform: [{ rotate: '15deg' }]
    },
    snowflakeRight: {
        position: 'absolute',
        bottom: 10,
        right: 5,
        opacity: 0.6,
        transform: [{ rotate: '-15deg' }]
    },
});
