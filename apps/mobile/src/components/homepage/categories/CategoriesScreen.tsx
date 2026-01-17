import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../../lib/api';
import { useCart } from '../../../context/CartContext';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = 90;
const CONTENT_WIDTH = width - SIDEBAR_WIDTH;

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string;
    parentCategory?: string | null;
    group?: string;
}

const FOR_YOU_ID = 'for-you-special-id';

export default function CategoriesScreen() {
    const router = useRouter();
    const { cartCount } = useCart();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(FOR_YOU_ID);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Parent Categories for Sidebar
    const sidebarCategories = categories.filter(c => !c.parentCategory || c.parentCategory === null);

    // Get Subcategories for Selected Category
    const subCategories = categories.filter(c => c.parentCategory === selectedCategoryId);

    const handleCategoryPress = (id: string, slug: string) => {
        // Always display in the right content area, never navigate away
        setSelectedCategoryId(id);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2874F0" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>All Categories</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Feather name="search" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/cart')}>
                        <MaterialIcons name="shopping-cart" size={24} color="#000" />
                        {cartCount > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{cartCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.contentContainer}>
                {/* Left Sidebar */}
                <View style={styles.sidebar}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarContent}>
                        {/* For You Item */}
                        <TouchableOpacity
                            style={[styles.sidebarItem, selectedCategoryId === FOR_YOU_ID && styles.sidebarItemSelected]}
                            onPress={() => handleCategoryPress(FOR_YOU_ID, 'for-you')}
                        >
                            <View style={styles.sidebarIconContainer}>
                                <View style={[styles.sidebarIconCircle, { backgroundColor: '#E0F2FE' }]}>
                                    <MaterialIcons name="local-offer" size={24} color="#0284C7" />
                                </View>
                            </View>
                            <Text style={[styles.sidebarText, selectedCategoryId === FOR_YOU_ID && styles.sidebarTextSelected]}>For You</Text>
                            {selectedCategoryId === FOR_YOU_ID && <View style={styles.selectedIndicator} />}
                        </TouchableOpacity>

                        {/* Category Items */}
                        {sidebarCategories.map((item) => (
                            <TouchableOpacity
                                key={item._id}
                                style={[styles.sidebarItem, selectedCategoryId === item._id && styles.sidebarItemSelected]}
                                onPress={() => handleCategoryPress(item._id, item.slug)}
                            >
                                <View style={styles.sidebarIconContainer}>
                                    {item.image || item.icon ? (
                                        <Image source={{ uri: item.image || item.icon }} style={styles.sidebarImage} />
                                    ) : (
                                        <View style={[styles.sidebarIconCircle, { backgroundColor: '#F3F4F6' }]}>
                                            <Text style={{ fontSize: 18, color: '#9CA3AF' }}>{item.name.charAt(0)}</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.sidebarText, selectedCategoryId === item._id && styles.sidebarTextSelected]}>
                                    {item.name}
                                </Text>
                                {selectedCategoryId === item._id && <View style={styles.selectedIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Right Content Area */}
                <View style={styles.rightContent}>
                    {/* Category Header - Full Width */}
                    {selectedCategoryId !== FOR_YOU_ID && (() => {
                        const selectedCategory = categories.find(c => c._id === selectedCategoryId);
                        if (!selectedCategory) return null;

                        return (
                            <LinearGradient
                                colors={['#FFFFFF', '#E3F2FD', '#D6EBFF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.categoryHeaderContainer}
                            >
                                <View style={styles.categoryHeader}>
                                    <View style={styles.categoryHeaderLeft}>
                                        <Text style={styles.categoryHeaderText}>{selectedCategory.name}</Text>
                                        <MaterialIcons name="chevron-right" size={26} color="#2874F0" />
                                    </View>
                                    <View style={styles.categoryHeaderRight}>
                                        {selectedCategory.image || selectedCategory.icon ? (
                                            <Image
                                                source={{ uri: selectedCategory.image || selectedCategory.icon }}
                                                style={styles.categoryHeaderIcon}
                                                resizeMode="contain"
                                            />
                                        ) : null}
                                    </View>
                                </View>
                            </LinearGradient>
                        );
                    })()}

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.rightContentScroll}>
                        {selectedCategoryId === FOR_YOU_ID ? (
                            <ForYouView />
                        ) : (
                            <>
                                {/* Grouped Subcategory Display */}
                                {subCategories.length > 0 ? (() => {
                                    // Group subcategories by their group field
                                    const groupedSubcategories = subCategories.reduce((acc, sub) => {
                                        const groupName = sub.group || 'Other';
                                        if (!acc[groupName]) {
                                            acc[groupName] = [];
                                        }
                                        acc[groupName].push(sub);
                                        return acc;
                                    }, {} as Record<string, Category[]>);

                                    return Object.entries(groupedSubcategories).map(([groupName, items]) => (
                                        <View key={groupName} style={styles.groupSection}>
                                            {/* Group Header */}
                                            <Text style={styles.groupHeader}>{groupName}</Text>

                                            {/* Subcategory Grid for this group */}
                                            <View style={styles.subCategoryGrid}>
                                                {items.map((sub) => (
                                                    <TouchableOpacity
                                                        key={sub._id}
                                                        style={styles.subCategoryItem}
                                                        onPress={() => router.push(`/common-category/${sub.slug}`)}
                                                    >
                                                        <View style={styles.subCategoryImageContainer}>
                                                            <Image
                                                                source={{ uri: sub.image || sub.icon || 'https://via.placeholder.com/100' }}
                                                                style={styles.subCategoryImage}
                                                            />
                                                        </View>
                                                        <Text style={styles.subCategoryName} numberOfLines={2}>{sub.name}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    ));
                                })() : (
                                    <View style={styles.emptySubContainer}>
                                        <Text style={styles.emptySubText}>No subcategories found.</Text>
                                        <TouchableOpacity
                                            style={styles.exploreBtn}
                                            onPress={() => {
                                                const cat = categories.find(c => c._id === selectedCategoryId);
                                                if (cat) router.push(`/common-category/${cat.slug}`);
                                            }}
                                        >
                                            <Text style={styles.exploreBtnText}>Explore Products</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}

// --- Specific "For You" View Component ---
const ForYouView = () => {
    return (
        <View style={styles.forYouContainer}>
            {/* Popular Store Section */}
            <Text style={styles.sectionTitle}>Popular Store</Text>
            <View style={styles.gridRow}>
                <GridItem
                    title="Coming soon!"
                    image="https://rukminim1.flixcart.com/fk-p-flap/100/100/image/2f85489d81944f0e.png?q=100" // Republic Day Sale
                    subTitle=""
                />
                <GridItem
                    title="Live now"
                    image="https://rukminim1.flixcart.com/fk-p-flap/100/100/image/43666d678be8c599.png?q=100" // Early Bird Deals
                    subTitle=""
                />
                <GridItem
                    title="Harvest the deals"
                    image="https://rukminim1.flixcart.com/fk-p-flap/100/100/image/f18d2d6452292026.png?q=100" // Pongal Deals
                    subTitle=""
                />
                <GridItem
                    title="Sale is Live"
                    image="https://rukminim1.flixcart.com/fk-p-flap/100/100/image/d96859345c292019.png?q=100" // Startup Day
                    subTitle=""
                />
            </View>

            {/* Recently Viewed Stores */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recently Viewed Stores</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <StoreCard
                    title="Mobiles"
                    image="https://rukminim1.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imaghx9qygjjg8hz.jpeg?q=70"
                />
                <StoreCard
                    title="Men's Clothing"
                    image="https://rukminim1.flixcart.com/image/612/612/xif0q/shoe/7/z/r/8-white-leaf-8-urbanbox-white-original-imagvgf4cuzs2hrw.jpeg?q=70"
                />
                <StoreCard
                    title="Blankets"
                    image="https://rukminim1.flixcart.com/image/612/612/kc54b0w0/blanket/q/d/a/ultra-soft-warm-single-bed-mink-blanket-for-winter-brown-original-imaftc6gh9z3z3gz.jpeg?q=70"
                />
                <StoreCard
                    title="Detergents"
                    image="https://rukminim1.flixcart.com/image/612/612/l5jxt3k0/washing-powder/a/b/f/-original-imagg72f3h7hjqzu.jpeg?q=70"
                />
            </ScrollView>

            {/* Have you tried? */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Have you tried?</Text>
            <View style={styles.gridRow}>
                <GridItem
                    title="Flipkart UPI"
                    image="https://rukminim1.flixcart.com/fk-p-flap/100/100/image/4890d7945d81b835.png?q=100"
                    isRound={true}
                />
                <GridItem
                    title="SuperCoin"
                    image="https://rukminim1.flixcart.com/fk-p-flap/100/100/image/913e9a786d149090.png?q=100"
                    isRound={true}
                />
                <GridItem
                    title="Plus Zone"
                    image="https://rukminim1.flixcart.com/fk-p-flap/100/100/image/21a5ebeb69248446.png?q=100"
                    isRound={true}
                />
            </View>
            <View style={{ height: 50 }} />
        </View>
    );
};

// --- Helper Components ---
const GridItem = ({ title, image, subTitle, isRound = false }: any) => (
    <View style={styles.gridItem}>
        <View style={[styles.gridImageContainer, isRound && { borderRadius: 30, backgroundColor: '#F3F4F6' }]}>
            <Image source={{ uri: image }} style={styles.gridImage} resizeMode="contain" />
        </View>
        <Text style={styles.gridTitle}>{title}</Text>
        {subTitle ? <Text style={styles.gridSubtitle}>{subTitle}</Text> : null}
    </View>
);

const StoreCard = ({ title, image }: any) => (
    <View style={styles.storeCard}>
        <Image source={{ uri: image }} style={styles.storeImage} resizeMode="contain" />
        <Text style={styles.storeTitle}>{title}</Text>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginLeft: 20,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#FF0000',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 2,
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    // Layout
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    // Sidebar
    sidebar: {
        width: SIDEBAR_WIDTH,
        backgroundColor: '#F0F2F5', // Light grey sidebar background
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
    },
    sidebarContent: {
        paddingBottom: 20,
    },
    sidebarItem: {
        alignItems: 'center',
        paddingVertical: 16,
        position: 'relative',
    },
    sidebarItemSelected: {
        backgroundColor: '#fff',
    },
    selectedIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: '#2874F0', // Blue indicator
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
    },
    sidebarIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 6,
    },
    sidebarIconCircle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sidebarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 25,
    },
    sidebarText: {
        fontSize: 11,
        color: '#4B5563',
        textAlign: 'center',
        paddingHorizontal: 4,
    },
    sidebarTextSelected: {
        color: '#2874F0',
        fontWeight: '600',
    },
    // Right Content
    rightContent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    rightContentScroll: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    // For You View
    forYouContainer: {},
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    gridRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    gridItem: {
        width: '33%', // 3 columns
        alignItems: 'center',
        marginBottom: 20,
    },
    gridImageContainer: {
        width: 70,
        height: 70,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    gridTitle: {
        fontSize: 12,
        textAlign: 'center',
        color: '#1F2937',
        paddingHorizontal: 4,
        fontWeight: '500'
    },
    gridSubtitle: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
    },
    horizontalScroll: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    storeCard: {
        width: 120,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
    },
    storeImage: {
        width: 100,
        height: 100,
        marginBottom: 8,
    },
    storeTitle: {
        fontSize: 12,
        color: '#374151',
        textAlign: 'center',
    },
    // Category Header
    categoryHeaderContainer: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 0,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryHeaderText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2874F0',
        marginRight: 2,
    },
    categoryHeaderRight: {
        width: 110,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryHeaderIcon: {
        width: '100%',
        height: '100%',
    },
    // Group Section
    groupSection: {
        marginBottom: 24,
    },
    groupHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        marginTop: 4,
    },
    // Subcategory Grid
    subCategoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    subCategoryItem: {
        width: '33.33%',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 6,
    },
    subCategoryImageContainer: {
        width: 75,
        height: 75,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#DBEAFE',
    },
    subCategoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    subCategoryName: {
        fontSize: 11,
        textAlign: 'center',
        color: '#111827',
        paddingHorizontal: 2,
        lineHeight: 13,
        fontWeight: '400',
    },
    emptySubContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptySubText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    exploreBtn: {
        backgroundColor: '#2874F0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    exploreBtnText: {
        color: '#fff',
        fontWeight: '600',
    }
});
