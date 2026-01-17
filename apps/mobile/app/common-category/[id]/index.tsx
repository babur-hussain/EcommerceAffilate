import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Dimensions, TextInput, FlatList, Alert, Modal } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import api from '../../../src/lib/api';
import { useCart } from '../../../src/context/CartContext';
import BeautyHome from '../../../src/components/homepage/categories/beauty/index';
import AppliancesHome from '../../../src/components/homepage/categories/appliances/index';
import AutoAccessoriesHome from '../../../src/components/homepage/categories/auto-accessories/index';
import BooksHome from '../../../src/components/homepage/categories/books/index';
import ElectronicsHome from '../../../src/components/homepage/categories/electronics/index';
import FashionHome from '../../../src/components/homepage/categories/fashion/index';
import FoodAndHealthHome from '../../../src/components/homepage/categories/food-and-health/index';
import FurnitureHome from '../../../src/components/homepage/categories/furniture/index';
import HomeCategoryHome from '../../../src/components/homepage/categories/home/index';
import MobilesHome from '../../../src/components/homepage/categories/mobiles/index';
import SportsHome from '../../../src/components/homepage/categories/sports/index';
import ToysHome from '../../../src/components/homepage/categories/toys/index';
import TwoWheelersHome from '../../../src/components/homepage/categories/two-wheelers/index';

const { width } = Dimensions.get('window');
const COLUMN_count = 2;
const GAP = 10;
const ITEM_WIDTH = (width - 32 - GAP) / 2;

interface Product {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    images: string[];
    category: string;
    description: string;
    rating?: number;
    reviewCount?: number;
    brand?: string;
    isAd?: boolean;
    offerTag?: string; // "WOW! ₹1,180 with 3 offers"
}

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string;
}

export default function CategoryPage() {
    const { id, name, subcategory: initialSubcat, filters } = useLocalSearchParams<{ id: string; name: string; subcategory?: string; filters?: string }>();
    const router = useRouter();
    const { cartCount } = useCart();

    // Registry Logic
    // If specific flags (subcategory, filters) are passed, we likely want the generic product list view
    const isGenericView = initialSubcat || filters;

    if (!isGenericView) {
        switch (id) {
            case 'beauty': return <BeautyHome />;
            case 'appliances': return <AppliancesHome />;
            case 'auto-accessories': return <AutoAccessoriesHome />;
            case 'books': return <BooksHome />;
            case 'electronics': return <ElectronicsHome />;
            case 'fashion': return <FashionHome />;
            case 'food-and-health': return <FoodAndHealthHome />;
            case 'furniture': return <FurnitureHome />;
            case 'home': return <HomeCategoryHome />;
            case 'mobiles': return <MobilesHome />;
            case 'sports': return <SportsHome />;
            case 'toys': return <ToysHome />;
            case 'two-wheelers': return <TwoWheelersHome />;
        }
    }

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [attributes, setAttributes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSubcat, setActiveSubcat] = useState<string | null>(initialSubcat || null);

    // Filter Modal State
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<any>(null);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id, activeSubcat, filters]);

    const fetchData = async () => {
        try {
            setLoading(true);

            let currentCategoryId = id;
            // Handle special "kids-clothing" or other non-ObjectID tags
            // If it's not a valid MongoID, we might need to resolve it or skip direct fetching
            const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(id);

            if (isValidMongoId) {
                // 1. Fetch Category Details (for attributes) - Only if valid ID
                try {
                    const categoryDetailsResponse = await api.get(`/api/categories/${id}`);
                    if (categoryDetailsResponse.data && categoryDetailsResponse.data.attributes) {
                        const rawAttrs = categoryDetailsResponse.data.attributes || [];
                        // Filter for filterable attributes only
                        const filterableAttrs = rawAttrs.filter((attr: any) => {
                            const attrObj = attr.attributeId;
                            if (typeof attrObj === 'object' && attrObj !== null) {
                                return attrObj.isFilterable !== false;
                            }
                            return true;
                        });
                        setAttributes(filterableAttrs);
                    }
                } catch (e) {
                    console.log('Error fetching category details, continuing...');
                }
            }

            // 2. Fetch subcategories
            // If the current ID is a subcategory itself (isValidMongoId), we might want to fetch its siblings
            // OR if it's 'kids-clothing', we fetch the kids subcategories.

            // For now, if it's 'kids-clothing', specific logic:
            let parentCategoryForSubs = id;
            if (id === 'kids-clothing') {
                parentCategoryForSubs = '6968f0e29424899fc3d9cc54'; // Kids Category ID from config
            } else if (isValidMongoId) {
                // If we navigated to a specific subcategory, we might want to see its siblings?
                // Or just show products. For now, let's assume we want to show products for this ID.
                // We could fetch its parent to get siblings, but let's keep it simple.
            }

            if (id === 'kids-clothing' || parentCategoryForSubs === '6968f0e29424899fc3d9cc54') {
                const subCatResponse = await api.get(`/api/categories?parentCategory=6968f0e29424899fc3d9cc54`);
                const loadedSubcats = subCatResponse.data || [];
                setSubcategories(loadedSubcats);

                // Resolve subcategory name to ID if needed
                if (initialSubcat && !/^[0-9a-fA-F]{24}$/.test(initialSubcat)) {
                    const matchedSub = loadedSubcats.find((s: Category) => s.name.toLowerCase() === initialSubcat.toLowerCase());
                    if (matchedSub) {
                        setActiveSubcat(matchedSub._id);
                    }
                }
            } else if (!isValidMongoId) {
                // Try fetching by slug if not ID
                const subCatResponse = await api.get(`/api/categories?parentCategory=${id}`);
                const loadedSubcats = subCatResponse.data || [];
                setSubcategories(loadedSubcats);

                // Resolve subcategory name to ID if needed (e.g. from Beauty Harvest)
                if (initialSubcat && !/^[0-9a-fA-F]{24}$/.test(initialSubcat)) {
                    const matchedSub = loadedSubcats.find((s: Category) => s.name.toLowerCase() === initialSubcat.toLowerCase());
                    if (matchedSub) {
                        setActiveSubcat(matchedSub._id);
                    }
                }
            }


            // 3. Fetch Products
            // If activeSubcat is explicitly set by user interaction, use it.
            // If not, and the initial 'id' is a valid MongoID (meaning we navigated to a subcat page), use that 'id'.
            // If 'id' is 'kids-clothing', we might want to fetch all kids products (or rely on filters).

            let categoryQuery = activeSubcat;
            if (!categoryQuery && isValidMongoId) {
                categoryQuery = id;
            }

            let productEndpoint = '/api/products';
            let params: any = {};

            if (categoryQuery) {
                params.category = categoryQuery;
            } else if (id === 'kids-clothing') {
                // Fallback for generic kids page if no subcat selected
                params.category = '6968f0e29424899fc3d9cc54';
            } else {
                params.category = id; // Default fallback
            }

            // Merge any passed filters (e.g. from Shop by Age)
            if (filters && typeof filters === 'string') {
                try {
                    const parsed = JSON.parse(filters);
                    params = { ...params, ...parsed };
                } catch (e) { }
            }

            const response = await api.get(productEndpoint, { params });
            const data = Array.isArray(response.data) ? response.data : (response.data.products || []);

            // Transform data to match UI if fields are missing
            const enhancedData = data.map((p: any) => ({
                ...p,
                originalPrice: p.originalPrice || Math.floor(p.price * 1.4),
                discount: p.discount || Math.floor(Math.random() * 30) + 30, // Mock discount 30-60%
                rating: 4.2,
                reviewCount: 120 + Math.floor(Math.random() * 200),
                brand: p.brand || 'Premium Brand',
                offerTag: '₹991 with 3 offers'
            }));

            setProducts(enhancedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={name ? `Search for ${name}` : "Search for products"}
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/(tabs)/cart')}>
                <Ionicons name="cart-outline" size={26} color="#1F2937" />
                {cartCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderSubCategories = () => {
        if (!subcategories || subcategories.length === 0) return null;

        return (
            <View style={styles.subCatSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subCatContent}>
                    {/* "All" Option */}
                    <TouchableOpacity
                        style={styles.subCatItem}
                        onPress={() => setActiveSubcat(null)}
                    >
                        <View style={styles.subCatImageContainer}>
                            <View style={[styles.subCatImage, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}>
                                <Ionicons name="apps" size={24} color="#555" />
                            </View>
                            {activeSubcat === null && (
                                <View style={styles.activeOverlay}>
                                    <Ionicons name="checkmark" size={24} color="#fff" />
                                </View>
                            )}
                        </View>
                        <Text style={[styles.subCatName, activeSubcat === null && styles.activeSubCatText]}>All</Text>
                    </TouchableOpacity>

                    {subcategories.map((sub) => (
                        <TouchableOpacity
                            key={sub._id}
                            style={styles.subCatItem}
                            onPress={() => setActiveSubcat(sub._id)}
                        >
                            <View style={styles.subCatImageContainer}>
                                <Image
                                    source={{ uri: sub.image || sub.icon || 'https://via.placeholder.com/80' }}
                                    style={styles.subCatImage}
                                />
                                {activeSubcat === sub._id && (
                                    <View style={styles.activeOverlay}>
                                        <Ionicons name="checkmark" size={24} color="#fff" />
                                    </View>
                                )}
                            </View>
                            <Text style={[styles.subCatName, activeSubcat === sub._id && styles.activeSubCatText]} numberOfLines={2}>
                                {sub.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    const renderFilters = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
            <TouchableOpacity
                style={styles.filterChip}
                onPress={() => Alert.alert('Sort', 'Sorting options coming soon!')}
            >
                <Text style={styles.filterText}>Sort</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.filterChip, styles.blackFilter]}
                onPress={() => Alert.alert('Filters', 'Advanced filter options coming soon!')}
            >
                <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>3</Text></View>
                <Text style={[styles.filterText, { color: '#FFF' }]}>Filter</Text>
                <Ionicons name="options-outline" size={16} color="#FFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            {/* Dynamic Attributes from Category */}
            {attributes.length > 0 ? (
                attributes.map((attr: any, index: number) => {
                    const label = attr.attributeId?.name || attr.name || 'Option';
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.filterChip}
                            onPress={() => openFilterModal(attr)}
                        >
                            <Text style={styles.filterText}>{label}</Text>
                            <MaterialIcons name="keyboard-arrow-down" size={20} color="#374151" />
                        </TouchableOpacity>
                    );
                })
            ) : (
                // Fallback static filters if no dynamic ones found
                <>
                    <TouchableOpacity
                        style={styles.filterChip}
                        onPress={() => Alert.alert('Brand', 'Brand filter coming soon!')}
                    >
                        <Text style={styles.filterText}>Brand</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={20} color="#374151" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.filterChip}
                        onPress={() => Alert.alert('Gender', 'Gender filter coming soon!')}
                    >
                        <Text style={styles.filterText}>Gender</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={20} color="#374151" />
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );

    const renderProductCard = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item._id}`)}
            activeOpacity={0.9}
        >
            <View style={styles.imageWrapper}>
                <Image source={{ uri: item.images[0] }} style={styles.productImage} />
                {item.isAd && (
                    <View style={styles.adBadge}>
                        <Text style={styles.adText}>AD</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.heartBtn}>
                    <Ionicons name="heart-outline" size={20} color="#4B5563" />
                </TouchableOpacity>
                <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{item.rating} </Text>
                    <FontAwesome name="star" size={10} color="#166534" />
                    <Text style={[styles.ratingText, { color: '#D1D5DB', marginHorizontal: 3 }]}>|</Text>
                    <Text style={styles.ratingText}>{item.reviewCount}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.brandName} numberOfLines={1}>{item.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.discountText}>↓{item.discount}%</Text>
                    <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                    <Text style={styles.currentPrice}>₹{item.price}</Text>
                </View>

                {item.offerTag && (
                    <View style={styles.offerTag}>
                        <View style={styles.wowBadge}>
                            <Text style={styles.wowText}>WOW!</Text>
                        </View>
                        <Text style={styles.offerText}>{item.offerTag}</Text>
                    </View>
                )}
                <Text style={styles.deliveryText}>Delivery by 18th Jan</Text>
            </View>
        </TouchableOpacity>
    );

    // Handle filter selection
    const openFilterModal = (filter: any) => {
        setSelectedFilter(filter);
        setSelectedValues([]);
        setFilterModalVisible(true);
    };

    const toggleValue = (value: string) => {
        if (selectedValues.includes(value)) {
            setSelectedValues(selectedValues.filter(v => v !== value));
        } else {
            setSelectedValues([...selectedValues, value]);
        }
    };

    const applyFilters = () => {
        // TODO: Actually filter products based on selected values
        console.log('Applying filters:', { filter: selectedFilter, values: selectedValues });
        setFilterModalVisible(false);
    };

    const resetFilters = () => {
        setSelectedValues([]);
    };

    const renderFilterModal = () => (
        <Modal
            visible={filterModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setFilterModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.modalBackground}
                    activeOpacity={1}
                    onPress={() => setFilterModalVisible(false)}
                />
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{selectedFilter?.attributeId?.name || selectedFilter?.name || 'Filter'}</Text>
                        <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Values List */}
                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                        {selectedFilter?.attributeId?.values?.map((value: string, index: number) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.filterOption}
                                onPress={() => toggleValue(value)}
                            >
                                <View style={[
                                    styles.checkbox,
                                    selectedValues.includes(value) && styles.checkboxSelected
                                ]}>
                                    {selectedValues.includes(value) && (
                                        <Ionicons name="checkmark" size={16} color="#FFF" />
                                    )}
                                </View>
                                <Text style={styles.filterOptionText}>{value}</Text>
                            </TouchableOpacity>
                        )) || (
                                <Text style={styles.noOptionsText}>No options available</Text>
                            )}
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={resetFilters}
                        >
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={applyFilters}
                        >
                            <Text style={styles.applyButtonText}>
                                Apply {selectedValues.length > 0 && `(${selectedValues.length})`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
                {renderHeader()}
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            >
                {renderSubCategories()}
                {renderFilters()}

                {loading ? (
                    <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={products}
                        renderItem={renderProductCard}
                        keyExtractor={item => item._id}
                        numColumns={2}
                        scrollEnabled={false} // Nested in ScrollView
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No products found</Text>
                            </View>
                        }
                    />
                )}
            </ScrollView>

            {/* Filter Modal */}
            {renderFilterModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // White background below searchbar
    },
    headerSafeArea: {
        backgroundColor: '#EBF4FF', // Blue background from top of screen
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#EBF4FF', // Light Blue background
        borderBottomWidth: 0, // Removed border for cleaner look with blue bg
    },
    backButton: {
        padding: 4,
        marginRight: 8,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        // borderWidth: 1, // Removed for cleaner look on blue
        // borderColor: '#E5E7EB',
        borderRadius: 24, // High radius for pill shape
        paddingHorizontal: 12,
        height: 44,
        marginRight: 12,
        // Box shadow for search bar to stand out lightly
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
    },
    cartButton: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
    subCatSection: {
        paddingTop: 16,
        paddingBottom: 2,
    },
    subCatContent: {
        paddingHorizontal: 16,
        gap: 16,
    },
    subCatItem: {
        alignItems: 'center',
        width: 72,
    },
    subCatImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
        marginBottom: 6,
        position: 'relative', // For overlay
    },
    activeOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // activeSubCatImage style removed in favor of overlay
    subCatImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    subCatName: {
        fontSize: 11,
        color: '#4B5563',
        textAlign: 'center',
        fontWeight: '500',
    },
    activeSubCatText: {
        color: '#111',
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 4,
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 36, // Fixed height for consistency
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFF',
        marginRight: 8,
    },
    filterText: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
        marginRight: 2,
    },
    blackFilter: {
        backgroundColor: '#1F2937',
        borderColor: '#1F2937',
    },
    filterBadge: {
        backgroundColor: '#FFF',
        borderRadius: 4,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    filterBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    listContent: {
        padding: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: ITEM_WIDTH,
        backgroundColor: 'transparent', // Card style is simpler in screenshot
        marginBottom: 24,
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 0.8, // Taller image
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 10,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    adBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    adText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF',
    },
    heartBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFF',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#111827',
    },
    cardContent: {
        paddingHorizontal: 2,
    },
    brandName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#111827',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    productName: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    discountText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#059669', // Green
        marginRight: 4,
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        marginRight: 4,
    },
    currentPrice: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
    },
    offerTag: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        marginBottom: 4,
    },
    wowBadge: {
        borderWidth: 1,
        borderColor: '#2563EB',
        borderRadius: 3,
        paddingHorizontal: 3,
        paddingVertical: 1,
        marginRight: 4,
    },
    wowText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    offerText: {
        fontSize: 10,
        color: '#111827',
        fontWeight: '500',
    },
    deliveryText: {
        fontSize: 10,
        color: '#111',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300, // Ensure it takes space if list is empty
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    modalBody: {
        maxHeight: 400,
        paddingHorizontal: 20,
    },
    filterOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    filterOptionText: {
        fontSize: 15,
        color: '#374151',
    },
    noOptionsText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        paddingVertical: 40,
    },
    modalFooter: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 12,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
});
