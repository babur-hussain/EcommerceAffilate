import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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

interface BooksPageProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function BooksPage({ staticHeader, renderStickyHeader }: BooksPageProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Scroll tracking
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    // Use correct slug for category API and name for product API
    const categoryId = '695ff7de3f61939001a06381';
    const categorySlug = 'books';
    const categoryName = 'Books';

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
                    const fallbackResponse = await api.get(`/api/categories?parentCategory=${categoryId}`);
                    if (Array.isArray(fallbackResponse.data)) {
                        setSubcategories(fallbackResponse.data);
                    }
                }
            } catch (e) {
                console.log(`Subcategories fetch failed for ${categoryName}`, e);
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
                                                                        <Text style={{ fontSize: 20 }}>📚</Text>
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

                        {/* 3. Music genres Section */}
                        <View style={styles.musicGenresSection}>
                            <TouchableOpacity onPress={() => router.push('/books/collection/music-genres')}>
                                <Text style={styles.genreSectionTitle}>Music genres ›</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.genreScrollContent}
                            >
                                {[
                                    {
                                        name: 'Pop',
                                        subtitle: 'Keyboards',
                                        gradientColors: ['#FF6BB5', '#FF8FC7'],
                                        accentColor: '#FFC266',
                                        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'Jazz',
                                        subtitle: 'Violins',
                                        gradientColors: ['#6BA3FF', '#8BBAFF'],
                                        accentColor: '#A8CFFF',
                                        image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'Classical',
                                        subtitle: 'Tabla',
                                        gradientColors: ['#FFA940', '#FFBD66'],
                                        accentColor: '#FFD699',
                                        image: 'https://images.unsplash.com/photo-1460036521480-ff49c08c2781?auto=format&fit=crop&w=400&q=80'
                                    },
                                ].map((genre, index) => (
                                    <TouchableOpacity key={index} style={styles.genreCard}>
                                        <LinearGradient
                                            colors={genre.gradientColors as unknown as readonly [string, string]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.gradientBackground}
                                        >
                                            {/* Decorative circles */}
                                            <View style={[styles.decorativeCircle, { backgroundColor: genre.accentColor, width: 120, height: 120, bottom: 80, right: -30 }]} />
                                            <View style={[styles.decorativeCircle, { backgroundColor: genre.accentColor, width: 90, height: 90, top: 120, left: -20, opacity: 0.7 }]} />

                                            <View style={styles.genreTextContainer}>
                                                <Text style={styles.genreName}>{genre.name}</Text>
                                                <Text style={styles.genreSubtitle}>{genre.subtitle}</Text>
                                            </View>
                                            <Image source={{ uri: genre.image }} style={styles.genreImage} />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 4. Books genres Section */}
                        <View style={styles.booksGenresSection}>
                            <TouchableOpacity onPress={() => router.push('/books/collection/books-genres')}>
                                <Text style={styles.genreSectionTitle}>Books genres ›</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.genreScrollContent}
                            >
                                {[
                                    {
                                        name: 'Fiction',
                                        subtitle: 'From ₹99',
                                        gradientColors: ['#FF6BB5', '#FF8FC7'],
                                        accentColor: '#FFCCE0',
                                        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'Mystery &\nthriller',
                                        subtitle: 'Up to 50% Off',
                                        gradientColors: ['#FF9940', '#FFB366'],
                                        accentColor: '#FFC266',
                                        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'Fantasy',
                                        subtitle: 'Min 40% Off',
                                        gradientColors: ['#6BA3FF', '#8BBAFF'],
                                        accentColor: '#B3D4FF',
                                        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80'
                                    },
                                ].map((genre, index) => (
                                    <TouchableOpacity key={index} style={styles.genreCard}>
                                        <LinearGradient
                                            colors={genre.gradientColors as unknown as readonly [string, string]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.gradientBackground}
                                        >
                                            {/* Decorative circles */}
                                            <View style={[styles.decorativeCircle, { backgroundColor: genre.accentColor, width: 110, height: 110, bottom: 140, right: -25, opacity: 0.8 }]} />
                                            <View style={[styles.decorativeCircle, { backgroundColor: genre.accentColor, width: 70, height: 70, top: 100, left: -15, opacity: 0.6 }]} />

                                            <View style={styles.genreTextContainer}>
                                                <Text style={styles.genreName}>{genre.name}</Text>
                                                <Text style={styles.genreSubtitle}>{genre.subtitle}</Text>
                                            </View>
                                            <Image source={{ uri: genre.image }} style={styles.bookGenreImage} />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 5. Superstar brands Section */}
                        <View style={styles.superstarBrandsSection}>
                            <TouchableOpacity onPress={() => router.push('/books/collection/superstar-brands')}>
                                <Text style={styles.genreSectionTitle}>Superstar brands ›</Text>
                            </TouchableOpacity>
                            <View style={styles.brandsGrid}>
                                {[
                                    { name: 'DigiMore', logo: 'https://ui-avatars.com/api/?name=DigiMore&background=000&color=fff&size=200' },
                                    { name: 'CASIO', logo: 'https://ui-avatars.com/api/?name=CASIO&background=0066CC&color=fff&size=200&bold=true' },
                                    { name: 'YAMAHA', logo: 'https://ui-avatars.com/api/?name=YAMAHA&background=000&color=fff&size=200&bold=true' },
                                    { name: 'Audio-Technica', logo: 'https://ui-avatars.com/api/?name=AT&background=000&color=fff&size=200' },
                                    { name: 'CLAPBOX', logo: 'https://ui-avatars.com/api/?name=CLAPBOX&background=666&color=fff&size=200' },
                                    { name: 'AHUJA', logo: 'https://ui-avatars.com/api/?name=AHUJA&background=003366&color=fff&size=200&bold=true' },
                                ].map((brand, index) => (
                                    <TouchableOpacity key={index} style={styles.brandCard}>
                                        <Image source={{ uri: brand.logo }} style={styles.brandLogo} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 6. Authors best work Section */}
                        <View style={styles.authorsBestWorkSection}>
                            <TouchableOpacity onPress={() => router.push('/books/collection/authors-best-work')}>
                                <Text style={styles.genreSectionTitle}>Authors best work ›</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.authorsScrollContent}
                            >
                                {[
                                    {
                                        name: 'Sudha Murthy',
                                        bgColor: '#6B7FFF',
                                        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'Ruskin Bond',
                                        bgColor: '#808080',
                                        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'Dharamvir Bharati',
                                        bgColor: '#FF9933',
                                        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
                                    },
                                ].map((author, index) => (
                                    <TouchableOpacity key={index} style={[styles.authorCard, { backgroundColor: author.bgColor }]}>
                                        <Image source={{ uri: author.image }} style={styles.authorImage} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 7. Budget carnival Section */}
                        <View style={styles.budgetCarnivalSection}>
                            <TouchableOpacity onPress={() => router.push('/books/collection/budget-carnival')}>
                                <Text style={styles.genreSectionTitle}>Budget carnival ›</Text>
                            </TouchableOpacity>
                            <View style={styles.budgetGrid}>
                                {[
                                    {
                                        name: 'Harmonicas',
                                        priceTag: 'Under ₹999',
                                        tagColor: '#0052FF',
                                        tagPosition: 'top-left',
                                        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'NCERT books',
                                        priceTag: 'Up to 30% Off',
                                        tagColor: '#FF3366',
                                        tagPosition: 'top-right',
                                        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'Guitars',
                                        priceTag: 'From ₹1,699',
                                        tagColor: '#0052FF',
                                        tagPosition: 'top-right',
                                        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'Microphones',
                                        priceTag: 'Min. 45% Off',
                                        tagColor: '#FF3366',
                                        tagPosition: 'top-left',
                                        image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'Popular books',
                                        priceTag: 'Under ₹299',
                                        tagColor: '#0052FF',
                                        tagPosition: 'top-right',
                                        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80'
                                    },
                                    {
                                        name: 'Indian instruments',
                                        priceTag: 'Up to 40% Off',
                                        tagColor: '#FF3366',
                                        tagPosition: 'top-right',
                                        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80'
                                    },
                                ].map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.budgetCard}>
                                        <Image source={{ uri: item.image }} style={styles.budgetCardImage} />

                                        {/* Price Tag */}
                                        <View style={styles.priceTagContainer}>
                                            <View style={[styles.priceTag, { backgroundColor: item.tagColor }]}>
                                                <Text style={styles.priceTagText}>{item.priceTag}</Text>
                                            </View>
                                        </View>

                                        {/* Product Name */}
                                        <View style={styles.budgetCardFooter}>
                                            <Text style={styles.budgetCardName}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                )}
                <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: '#F9FAFB' }} />
            </View>
        </ScrollView>
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

    // Music Genres Section Styles
    musicGenresSection: {
        marginBottom: 24,
        paddingLeft: 16,
    },
    booksGenresSection: {
        marginBottom: 24,
        paddingLeft: 16,
    },
    genreSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    genreScrollContent: {
        paddingRight: 16,
    },
    genreCard: {
        width: 180,
        height: 260,
        borderRadius: 16,
        marginRight: 12,
        overflow: 'hidden',
    },
    gradientBackground: {
        width: '100%',
        height: '100%',
        position: 'relative',
        padding: 16,
    },
    genreTextContainer: {
        zIndex: 2,
    },
    genreName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    genreSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    genreImage: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 3,
        width: 140,
        height: 180,
        resizeMode: 'contain',
    },
    bookGenreImage: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 3,
        width: 100,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    decorativeCircle: {
        position: 'absolute',
        borderRadius: 1000,
        zIndex: 1,
    },

    // Superstar Brands Section Styles
    superstarBrandsSection: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    brandsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    brandCard: {
        width: (width - 48) / 3, // 3 columns with 16px padding on each side
        aspectRatio: 1,
        backgroundColor: '#E8EEF7',
        borderRadius: 16,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    brandLogo: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },

    // Authors Best Work Section Styles
    authorsBestWorkSection: {
        marginBottom: 24,
        paddingLeft: 16,
    },
    authorsScrollContent: {
        paddingRight: 16,
    },
    authorCard: {
        width: 300,
        height: 380,
        borderRadius: 16,
        marginRight: 12,
        overflow: 'hidden',
    },
    authorImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    // Budget Carnival Section Styles
    budgetCarnivalSection: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    budgetGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    budgetCard: {
        width: (width - 44) / 2, // 2 columns with 16px padding on each side and 12px gap
        height: 200,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#2A2A2A',
    },
    budgetCardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.8,
    },
    priceTagContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 2,
    },
    priceTag: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 16,
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    priceTagText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 20,
    },
    budgetCardFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    budgetCardName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
