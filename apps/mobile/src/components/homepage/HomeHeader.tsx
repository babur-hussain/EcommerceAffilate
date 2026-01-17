import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Animated, Easing, FlatList } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TopCategoryBoxes, TabType } from '../shared/TopCategoryBoxes';
import { useUserLocation } from '../../hooks/useUserLocation';

// ==================== Shared Types ====================

interface Category {
    id: string;
    name: string;
    icon: string;
    iconFamily: 'MaterialIcons' | 'MaterialCommunityIcons';
}

// --- LocationBar ---
function LocationBar() {
    const { address, loading, fetchLocation, errorMsg } = useUserLocation();

    // Determine what to show
    // If loading: "Locating..."
    // If address found: Show city/street
    // If error or no address: "Select your location"

    const displayLabel = address?.formattedAddress || "Select your location";
    const titleLabel = loading ? "LOCATING..." : (address ? "CURRENT LOCATION" : "WORK");

    return (
        <View style={locationStyles.container}>
            <TouchableOpacity style={locationStyles.leftSection} onPress={fetchLocation} activeOpacity={0.8}>
                <MaterialIcons name="location-on" size={20} color="#FFFFFF" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={locationStyles.label}>{titleLabel}</Text>
                    <Text style={locationStyles.addressLine} numberOfLines={1}>
                        <Text style={locationStyles.address}>{loading ? "Fetching address..." : displayLabel}</Text>
                    </Text>
                </View>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={locationStyles.pointsButton}>
                <MaterialIcons name="stars" size={16} color="#FFFFFF" />
                <Text style={locationStyles.pointsText}>0</Text>
            </TouchableOpacity>
        </View>
    );
}

const locationStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#A0522D',
        paddingHorizontal: 12,
        paddingVertical: 8, // Increased slightly for two lines of text better spacing
        borderRadius: 8,
        marginHorizontal: 12,
        marginVertical: 8,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    addressLine: {
        flex: 1,
        fontSize: 12,
        color: '#FFFFFF',
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFD700', // Gold color for label to stand out
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    address: {
        fontSize: 13,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    pointsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 8,
    },
    pointsText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 4,
    },
});

// --- SearchBar ---
function SearchBar() {
    const router = useRouter();
    return (
        <View style={searchStyles.container}>
            <TouchableOpacity
                style={searchStyles.searchContainer}
                onPress={() => router.push('/search')}
                activeOpacity={0.9}
            >
                <MaterialIcons name="search" size={22} color="#9CA3AF" style={searchStyles.icon} />
                <Text style={searchStyles.placeholder}>Search products...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={searchStyles.scanButton}>
                <MaterialIcons name="qr-code-scanner" size={24} color="#FF6B00" />
            </TouchableOpacity>
        </View>
    );
}

const searchStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 6,
        backgroundColor: '#FF6B00',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 14,
        height: 44,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
    },
    placeholder: {
        fontSize: 15,
        color: '#9CA3AF',
    },
    scanButton: {
        width: 44,
        height: 44,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
});

// --- CategoriesSlider ---
const sliderCategories: Category[] = [
    { id: '1', name: 'For You', icon: 'local-offer', iconFamily: 'MaterialIcons' },
    { id: '695ff7de3f61939001a0637d', name: 'Fashion', icon: 'checkroom', iconFamily: 'MaterialIcons' },
    { id: '3', name: 'Mobiles', icon: 'smartphone', iconFamily: 'MaterialIcons' },
    { id: '695ff7de3f61939001a0637f', name: 'Beauty', icon: 'face', iconFamily: 'MaterialIcons' },
    { id: '695ff7de3f61939001a0637c', name: 'Electronics', icon: 'laptop', iconFamily: 'MaterialIcons' },
    { id: '695ff7de3f61939001a0637e', name: 'Home', icon: 'home', iconFamily: 'MaterialIcons' },
    { id: '7', name: 'Appliances', icon: 'kitchen', iconFamily: 'MaterialIcons' },
    { id: '695ff7de3f61939001a06382', name: 'Toys', icon: 'toys', iconFamily: 'MaterialIcons' },
    { id: '695ff7de3f61939001a06383', name: 'Food & Health', icon: 'fastfood', iconFamily: 'MaterialIcons' },
    { id: '695ff7de3f61939001a06384', name: 'Auto Accessories', icon: 'directions-car', iconFamily: 'MaterialIcons' },
    { id: '11', name: '2 Wheelers', icon: 'two-wheeler', iconFamily: 'MaterialIcons' },
    { id: '695ff7de3f61939001a06380', name: 'Sports', icon: 'sports-soccer', iconFamily: 'MaterialIcons' },
    { id: '695ff7de3f61939001a06381', name: 'Books', icon: 'menu-book', iconFamily: 'MaterialIcons' },
    { id: '695ff7de3f61939001a06389', name: 'Furniture', icon: 'weekend', iconFamily: 'MaterialIcons' },
];

interface CategoriesSliderProps {
    onCategorySelect?: (category: Category) => void;
    selectedCategory?: string;
    showIcons?: boolean;
}

function CategoriesSlider({ onCategorySelect, selectedCategory, showIcons = true }: CategoriesSliderProps) {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);

    // Standard Animated API values
    const animValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(animValue, {
            toValue: showIcons ? 1 : 0,
            duration: 300,
            useNativeDriver: false, // Layout properties like height/margin cannot use native driver
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }).start();
    }, [showIcons]);

    // Scroll to selected category when it changes or on mount
    useEffect(() => {
        if (selectedCategory && flatListRef.current) {
            const index = sliderCategories.findIndex(c => c.name === selectedCategory);
            if (index !== -1) {
                // Wait slightly for layout or run immediately
                try {
                    flatListRef.current.scrollToIndex({
                        index,
                        animated: true,
                        viewPosition: 0.5 // Center the item
                    });
                } catch (e) {
                    // Ignore errors if layout not ready yet, onScrollToIndexFailed will handle it potentially
                }
            }
        }
    }, [selectedCategory]);

    const iconHeight = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 30],
    });

    const iconOpacity = animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const marginBottom = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 4],
    });

    const handleCategoryPress = (category: Category) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onCategorySelect) {
            onCategorySelect(category);
        } else {
            router.push({
                pathname: '/common-category/[id]',
                params: { id: category.name }
            });
        }
    };

    const renderIcon = (category: Category) => {
        const IconComponent = category.iconFamily === 'MaterialIcons'
            ? MaterialIcons
            : MaterialCommunityIcons;

        return <IconComponent name={category.icon as any} size={24} color="#FFFFFF" />;
    };

    // Retry scrolling if layout wasn't ready
    const onScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
        const wait = new Promise(resolve => setTimeout(resolve, 100));
        wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
        });
    };

    return (
        <View style={sliderStyles.container}>
            <FlatList
                ref={flatListRef}
                data={sliderCategories}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={sliderStyles.scrollContent}
                keyExtractor={(item) => item.id}
                onScrollToIndexFailed={onScrollToIndexFailed}
                renderItem={({ item, index }) => {
                    const isActive = selectedCategory === item.name;
                    return (
                        <TouchableOpacity
                            style={[
                                sliderStyles.categoryItem,
                                index === 0 && sliderStyles.firstItem,
                                isActive && sliderStyles.activeItem
                            ]}
                            onPress={() => handleCategoryPress(item)}
                            activeOpacity={0.7}
                        >
                            <Animated.View style={[
                                sliderStyles.iconContainer,
                                {
                                    height: iconHeight,
                                    opacity: iconOpacity,
                                    marginBottom: marginBottom
                                }
                            ]}>
                                {renderIcon(item)}
                            </Animated.View>
                            <Text style={[
                                sliderStyles.categoryText,
                                isActive && sliderStyles.activeText
                            ]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}


const sliderStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FF6F00',
        paddingTop: 4,
        paddingBottom: 0,
    },
    scrollContent: {
        paddingHorizontal: 8,
    },
    categoryItem: {
        alignItems: 'center',
        marginHorizontal: 12,
        paddingBottom: 12,
    },
    firstItem: {
        marginLeft: 16,
    },
    iconContainer: {
        width: 40,
        // Height, Opacity, MarginBottom are controlled by Animation
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    activeItem: {
        borderBottomWidth: 3,
        borderBottomColor: '#FFFFFF',
    },
    categoryText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
        textAlign: 'center',
    },
    activeText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
});

// ==================== Exported Components ====================

interface HomeStaticHeaderProps {
    onTabPress: (categoryId: string) => void;
}

interface HomeStickyHeaderProps {
    onCategorySelect: (category: Category) => void;
    selectedCategory: string;
    showIcons?: boolean;
}

export const HomeStaticHeader = ({ onTabPress }: HomeStaticHeaderProps) => {
    return (
        <View style={{ backgroundColor: '#FF6B00' }}>
            <TopCategoryBoxes
                activeTab="shopping"
                onTabPress={(id) => onTabPress(id)}
                backgroundColor="#FF6B00"
                activeBackgroundColor="#FFD700"
            />
            <LocationBar />
        </View>
    );
};

export const HomeStickyHeader = ({ onCategorySelect, selectedCategory, showIcons = true }: HomeStickyHeaderProps) => {
    return (
        <View style={{ backgroundColor: '#FF6B00' }}>
            <SearchBar />
            <CategoriesSlider
                onCategorySelect={onCategorySelect}
                selectedCategory={selectedCategory}
                showIcons={showIcons}
            />
        </View>
    );
};
