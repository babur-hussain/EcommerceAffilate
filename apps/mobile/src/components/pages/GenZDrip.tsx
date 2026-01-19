import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, SafeAreaView, Platform, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CachedImage from '../shared/CachedImage';
import api from '../../lib/api';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

// Color Palette
const COLORS = {
    primary: '#bef264', // Lime green
    backgroundLight: '#ffffff',
    backgroundDark: '#000000',
    accentPink: '#f472b6',
    accentTeal: '#2dd4bf',
    accentPurple: '#a78bfa',
    zinc900: '#18181b',
    zinc800: '#27272a',
    zinc500: '#71717a',
    rose100: '#ffe4e6',
    rose900: '#881337',
    teal100: '#ccfbf1',
    teal900: '#134e4a',
    amber100: '#fef3c7',
    amber900: '#78350f',
    purple100: '#f3e8ff',
    purple900: '#581c87',
    blue100: '#dbeafe',
    blue900: '#1e3a8a',
    orange100: '#ffedd5',
    orange900: '#7c2d12',
    emerald100: '#d1fae5',
    emerald900: '#064e3b',
    indigo100: '#e0e7ff',
    indigo900: '#312e81',
};

// Live Data Interface
interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    icon?: string;
    group?: string;
    bgColor?: string; // Optional: Backend could send color or we map it
}

// Map backgrounds to index for consistency since backend might not send colors
const BG_COLORS = [
    { light: COLORS.rose100, dark: COLORS.rose900 },
    { light: COLORS.teal100, dark: COLORS.teal900 },
    { light: COLORS.amber100, dark: COLORS.amber900 },
    { light: COLORS.purple100, dark: COLORS.purple900 },
    { light: COLORS.blue100, dark: COLORS.blue900 },
    { light: COLORS.orange100, dark: COLORS.orange900 },
    { light: COLORS.emerald100, dark: COLORS.emerald900 },
    { light: COLORS.indigo100, dark: COLORS.indigo900 },
];

export default function GenZDrip() {
    const router = useRouter();
    const { cartCount } = useCart();
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<any[]>([]); // To store product results
    const [isSearching, setIsSearching] = React.useState(false);

    // Debounced Search Effect
    React.useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                // Search for products globally
                console.log('Searching for:', searchQuery);
                const response = await api.get('/api/products', {
                    params: { search: searchQuery, limit: 10 }
                });
                console.log('Search response:', response.data?.length);
                if (Array.isArray(response.data)) {
                    setSearchResults(response.data);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 400); // 400ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch Categories (Initial Load)
    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Use shared API instance which handles Base URL (4000) and Auth
                const response = await api.get('/api/categories', {
                    params: { group: 'GenZ' }
                });

                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    console.error('Invalid category data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching GenZ categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Dark mode logic if we had it, for now hardcoding to look like screenshot which is dark mode mostly
    const isDark = true;
    const bgColor = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
    const textColor = isDark ? '#fff' : '#0f172a';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Hide Default Header */}
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <MaterialIcons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>

                {/* Open Search Bar */}
                {/* Live Search Bar */}
                <View style={[styles.searchBar, { zIndex: 2001, overflow: 'visible' }]}>
                    <MaterialIcons name="search" size={20} color={COLORS.zinc500} style={{ marginLeft: 8 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Gen Z Drip..."
                        placeholderTextColor="#a1a1aa"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialIcons name="close" size={18} color={COLORS.zinc500} style={{ marginRight: 8 }} />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/cart')}>
                    <MaterialIcons name="shopping-cart" size={24} color={textColor} />
                    {cartCount > 0 && (
                        <View style={styles.cBadge}>
                            <Text style={styles.cBadgeText}>{cartCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>



            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Girls / Guys Grid */}
                <View style={styles.genderGrid}>
                    {/* Girls */}
                    <TouchableOpacity style={styles.genderCard} activeOpacity={0.9}>
                        {/* Red Plaid Background */}
                        <CachedImage
                            source={{ uri: 'https://img.freepik.com/free-vector/tartan-plaid-pattern_1284-13837.jpg' }} // Use a subtle plaid texture or gradient
                            style={[StyleSheet.absoluteFill, { opacity: 0.6 }]}
                            contentFit="cover"
                        />
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#e11d48', opacity: 0.85 }]} />

                        <CachedImage
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-RLB1uRr6nsMaOA-njZ-TJmjekXr8Pp6PBIwC7V8sES4o13IoN8WxpVGkv03oyh2wkKRiXLeMT_SwiSGorKkH41cjg-AGZm-ENev4S_uMxdtV3hQlefYnjMXOyMOsHfmb4y6gd3NB43t2i9AJrJYnyJD_jRrhBkBPm6GzMYrIUyYi7hmDinQWvsOvQB7umZqLH7OlUquvEFdYm28MCc4XJTmV9pDqN8gYU4uJOomiwUdPJBd6_8IiCszdoCMCuiClwlOsgxS-xwlL' }}
                            style={styles.genderImage}
                            contentFit="contain"
                        />
                        <Text style={styles.genderText}>Girls</Text>
                    </TouchableOpacity>

                    {/* Guys */}
                    <TouchableOpacity style={styles.genderCard} activeOpacity={0.9}>
                        {/* Green Grid Background */}
                        <CachedImage
                            source={{ uri: 'https://ih1.redbubble.net/image.1037324838.4838/st,small,507x507-pad,600x600,f8f8f8.jpg' }} // Grid texture
                            style={[StyleSheet.absoluteFill, { opacity: 0.4 }]}
                            contentFit="cover"
                        />
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#10b981', opacity: 0.85 }]} />

                        <CachedImage
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-tX8NW7yRqa7ClLQ5hyJwisocbg1fOnQ_9_6y6RKH73J36RJ8Ryh1pzdeXMcgpx09U2EpAfjjzHvex9qMg9X3Z-0rReSlSX0L_q44QfnTe_ds9yeCkmww-YqU5FRtMvgaeVaW4P4ceqBShtwgBoov8nmZ6y5EvLTRpkXz2ItArIV03ULK8WLzr3aVxx7WN2n1KGWvMWA-FxI3a3KEFYaLQyJiDHILsDRp11uje8SMAaB4JXDKftD30pOstq4yYTjj9u_DAF-bCmIA' }}
                            style={styles.genderImage}
                            contentFit="contain"
                        />
                        <Text style={styles.genderText}>Guys</Text>
                    </TouchableOpacity>
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroContainer}>
                        <CachedImage
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAw9KcuR_KaBrBCrzBK22ziELTXEGbybkUR9LdzmfDu-u5_GBfR5HkoxRW3N1t6dMnJHV35wAxaLXtHe8IqnFd_CUyboUKi-c_mXCpdgpmrBnWRf6AHq4qQOss74K9NpeDxPiZeezjmfIgYP26PzmkJfFGNjuJBb8Fr7u_Fdc1B8DvthKiacf0IfsCdxjsp3o4WQ_vtaVj1jhDlN6nMc_VqA8DDZ9gayIfWifOZEXTn2OoJfIOKIrWVOgDln3dfWNbQfafVnPtwBFG' }} // Back to reliable user image
                            style={styles.heroImage}
                            contentFit="cover"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
                            style={styles.heroGradient}
                        >
                            <Text style={[styles.heroTitle, { color: COLORS.primary }]}>Satin Jacquard</Text>
                            <TouchableOpacity style={styles.heroButtonSpoyl}>
                                <Text style={styles.heroButtonTextSpoyl}>From ₹249</Text>
                            </TouchableOpacity>

                            <View style={styles.carouselIndicators}>
                                {/* Dots */}
                            </View>
                        </LinearGradient>

                        {/* Sparkles / Confetti */}
                        <MaterialIcons name="auto-awesome" size={20} color="rgba(255,255,255,0.6)" style={{ position: 'absolute', bottom: 40, left: 20 }} />
                        <MaterialIcons name="auto-awesome" size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', bottom: 80, right: 30 }} />
                        <MaterialIcons name="auto-awesome" size={24} color="rgba(255,255,255,0.7)" style={{ position: 'absolute', top: 30, right: 20 }} />

                    </View>
                </View>

                {/* Categories Grid - Use original full list here, filter happens in popup */}
                <View style={styles.categoriesGrid}>
                    {loading ? (
                        <Text style={{ color: 'white', alignSelf: 'center' }}>Loading Drip...</Text>
                    ) : (
                        categories.map((item, index) => {
                            const colors = BG_COLORS[index % BG_COLORS.length]; // Cycle through colors
                            return (
                                <TouchableOpacity key={item._id} style={styles.categoryItem} onPress={() => router.push(`/fashion/collection/${item.slug}`)}>
// ... (rest is same)
                                    <View style={[
                                        styles.categoryImageContainer,
                                        { backgroundColor: isDark ? colors.dark + '66' : colors.light }
                                    ]}>
                                        <CachedImage source={{ uri: item.image || item.icon || '' }} style={styles.categoryImage} />
                                    </View>
                                    <Text style={[styles.categoryTitle, { color: isDark ? '#a1a1aa' : '#475569' }]}>{item.name}</Text>

                                    {/* Random badges for flair since backend doesn't have isStar yet */}
                                    {index % 3 === 0 && <MaterialIcons name="star" size={14} color={COLORS.primary} style={styles.badgeStar} />}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>

                {/* Republic Day Special Footer */}
                <View style={styles.footerSection}>
                    <View style={[styles.specialCard, { backgroundColor: isDark ? COLORS.zinc900 : '#f4f4f5', borderColor: isDark ? COLORS.zinc800 : '#e4e4e7' }]}>
                        <Text style={[styles.specialTitle, { color: textColor }]}>Republic Day Special</Text>
                        <Text style={styles.specialSubtitle}>SHOP THE COLLECTION</Text>

                        <MaterialIcons name="celebration" size={40} color={textColor} style={styles.specialIconLeft} />
                        <MaterialIcons name="flare" size={40} color={textColor} style={styles.specialIconRight} />
                    </View>
                </View>

                {/* Bottom spacer for nav */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Custom Bottom Navigation from Design */}
            <View style={[styles.bottomNav, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? COLORS.zinc800 : '#e2e8f0' }]}>
                {/* Blur effect would require Expo BlurView, simulating with opacity for now */}

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={24} color={COLORS.primary} />
                    <Text style={[styles.navLabel, { color: COLORS.primary }]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="category" size={24} color={COLORS.zinc500} />
                    <Text style={[styles.navLabel, { color: COLORS.zinc500 }]}>Categories</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <View style={[styles.navFreshIcon, { borderColor: bgColor }]}>
                        <MaterialIcons name="bolt" size={24} color="black" />
                    </View>
                    <Text style={[styles.navLabel, { color: COLORS.zinc500 }]}>Fresh</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="favorite-border" size={24} color={COLORS.zinc500} />
                    <Text style={[styles.navLabel, { color: COLORS.zinc500 }]}>Wishlist</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="person-outline" size={24} color={COLORS.zinc500} />
                    <Text style={[styles.navLabel, { color: COLORS.zinc500 }]}>Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Home Indicator */}
            <View style={styles.homeIndicatorContainer}>
                <View style={styles.homeIndicator} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // ... existing styles ...
    container: {
        flex: 1,
    },
    // ...

    // Bottom Nav
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 32, // Accommodate home indicator
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    navItem: {
        alignItems: 'center',
        gap: 4,
    },
    navLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: -0.5,
    },
    navFreshIcon: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -24, // Lift up
        borderWidth: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    homeIndicatorContainer: {
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 60,
    },
    homeIndicator: {
        width: 128,
        height: 4,
        backgroundColor: '#52525b', // zinc-600
        borderRadius: 2,
    },

    // ... (rest of styles)
    scrollContent: {
        paddingTop: 10,
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        zIndex: 2000, // Very high zIndex
        elevation: 50, // Android elevation
        overflow: 'visible', // Ensure popup isn't clipped
        gap: 12,
    },
    // headerLeft/Right removed as we flattened the structure
    searchBar: {
        flex: 1, // Take available space
        height: 40,
        backgroundColor: '#27272a', // zinc800
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#3f3f46', // zinc700
    },
    searchInput: {
        flex: 1,
        color: 'white',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
        height: '100%',
    },
    iconButton: {
        padding: 4,
        position: 'relative',
    },
    cBadge: {
        position: 'absolute',
        top: -4, // Adjusted for better alignment
        right: -4,
        backgroundColor: COLORS.primary, // Use Theme Primary (Lime) for Badge pop
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cBadgeText: {
        color: 'black', // Black text on Lime
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Gender Grid
    genderGrid: {
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 16,
        marginBottom: 24,
        height: 140, // consistent height
    },
    genderCard: {
        flex: 1,
        height: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 12,
    },
    genderImage: {
        width: 110,
        height: 120, // Adjust to overlap top
        position: 'absolute',
        bottom: 0,
    },
    genderText: {
        color: 'white',
        fontSize: 30, // Large text
        fontWeight: 'bold',
        fontStyle: 'italic',
        zIndex: 10,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },

    // Hero Section
    heroSection: {
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    heroContainer: {
        width: '100%',
        aspectRatio: 4 / 5,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: COLORS.zinc900,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        height: '50%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 40,
    },
    heroTitle: {
        fontSize: 42,
        fontWeight: '900',
        fontStyle: 'italic',
        marginBottom: 16,
        textAlign: 'center',
        lineHeight: 50,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    heroButtonSpoyl: {
        backgroundColor: 'black',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 20,
        alignSelf: 'center', // Fix stretching
    },
    heroButtonTextSpoyl: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    carouselIndicators: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 24,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    dotActive: {
        width: 16,
        backgroundColor: 'white',
    },
    dotInactive: {
        width: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    sparkleTop: {
        position: 'absolute',
        top: 16,
        left: 16,
        opacity: 0.6,
    },
    sparkleBottom: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        opacity: 0.6,
    },

    // Categories Grid
    categoriesGrid: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 24,
    },
    categoryItem: {
        width: '23%', // 4 columns
        alignItems: 'center',
        position: 'relative',
    },
    categoryImageContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 16,
        padding: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    categoryTitle: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    badgeStar: {
        position: 'absolute',
        top: -4,
        right: -4,
    },
    badgeAwesome: {
        position: 'absolute',
        bottom: 12, // Adjusted
        left: '50%',
        marginLeft: -7,
    },

    // Footer
    footerSection: {
        paddingHorizontal: 16,
        marginTop: 48,
    },
    specialCard: {
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    specialTitle: {
        fontSize: 24,
        marginBottom: 4,
        fontStyle: 'italic',
        fontWeight: '600',
    },
    specialSubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        color: COLORS.zinc500,
        marginTop: 4,
    },
    specialIconLeft: {
        position: 'absolute',
        top: 16,
        left: 16,
        opacity: 0.1,
    },
    specialIconRight: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        opacity: 0.1,
    },
    // Search Popup
    searchPopup: {
        position: 'absolute',
        top: 39,
        left: 0,
        right: 0,
        maxHeight: 300,
        minHeight: 100, // Ensure some height even if empty
        backgroundColor: '#27272a', // Was red for debugging, moved back to match theme
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 1,
        borderColor: '#3f3f46',
        borderTopWidth: 0,
        zIndex: 3000,
        elevation: 100, // Android high elevation


        // Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    searchResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        // No border bottom
    },
    searchResultIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    searchResultImage: {
        width: 24,
        height: 24,
    },
    searchResultText: {
        flex: 1,
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    noResultsText: {
        color: COLORS.zinc500,
        textAlign: 'center',
        marginVertical: 16,
        fontSize: 14,
    },
});
