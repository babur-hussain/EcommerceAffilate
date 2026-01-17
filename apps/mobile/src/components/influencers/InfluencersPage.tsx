import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock Data
const TRENDING_INFLUENCERS = [
    { id: '1', name: 'Alisha Keys', handle: '@alishastyle', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', category: 'Fashion' },
    { id: '2', name: 'David Miller', handle: '@techdavid', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', category: 'Tech' },
    { id: '3', name: 'Sarah Jones', handle: '@sarahglam', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', category: 'Beauty' },
];

const FEATURED_CONTENT = [
    { id: '1', title: 'Summer Essentials', influencer: 'Alisha Keys', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', likes: '12K' },
    { id: '2', title: 'Tech Review 2024', influencer: 'David Miller', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80', likes: '8.5K' },
    { id: '3', title: 'Morning Routine', influencer: 'Sarah Jones', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80', likes: '22K' },
];

const CATEGORIES = ['All', 'Fashion', 'Tech', 'Beauty', 'Fitness', 'Lifestyle', 'Gaming'];

import TopCategoryBoxes, { TabType } from '../shared/TopCategoryBoxes';

export default function InfluencersPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = React.useState('All');

    const handleTabPress = (tabId: TabType) => {
        if (tabId !== 'influencers') {
            // Navigate back to home and set the tab
            // Use replace to avoid stacking influencers on top if we come back
            // Actually push/replace to index with params
            router.dismissAll(); // Clear stack to go back to root? Or just push?
            // Since we are in a stack, going "back" to index is cleaner if index is below.
            // But if we want to switch tabs, we can navigate to index with params.
            router.replace({ pathname: '/', params: { tab: tabId } });
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <LinearGradient
                colors={['rgba(0,0,0,0.9)', 'transparent']}
                style={styles.headerGradient}
            />

            <View style={styles.topTabsContainer}>
                <TopCategoryBoxes
                    activeTab="influencers"
                    onTabPress={handleTabPress}
                    backgroundColor="transparent"
                    activeBackgroundColor="#CCFF00"
                    inactiveBackgroundColor="#000000"
                    borderColor="#FFFFFF"
                    inactiveLabelColor="#FFFFFF"
                />
            </View>

            <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>EXCLUSIVE</Text>
                        <Text style={styles.headerSubtitle}>CREATORS</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCategories = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesWrapper}
            contentContainerStyle={styles.categoriesContainer}
        >
            {CATEGORIES.map((cat, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.categoryPill,
                        selectedCategory === cat && styles.categoryPillActive
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                >
                    <Text style={[
                        styles.categoryText,
                        selectedCategory === cat && styles.categoryTextActive
                    ]}>
                        {cat}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderTrending = () => (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>TRENDING NOW</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={TRENDING_INFLUENCERS}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.trendingList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.trendingCard}>
                        <Image source={{ uri: item.image }} style={styles.trendingImage} />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
                            style={styles.trendingOverlay}
                        />
                        <View style={styles.trendingInfo}>
                            <Text style={styles.trendingName}>{item.name}</Text>
                            <Text style={styles.trendingHandle}>{item.handle}</Text>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryBadgeText}>{item.category}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    const renderFeatured = () => (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>FRESH DROPS</Text>
            {FEATURED_CONTENT.map((item) => (
                <TouchableOpacity key={item.id} style={styles.featuredCard}>
                    <Image source={{ uri: item.image }} style={styles.featuredImage} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                        style={styles.featuredOverlay}
                    />
                    <View style={styles.featuredContent}>
                        <View style={styles.featuredHeader}>
                            <View style={styles.featuredAuthor}>
                                <View style={styles.authorAvatar}>
                                    <Text style={styles.authorInitial}>{item.influencer[0]}</Text>
                                </View>
                                <Text style={styles.authorName}>{item.influencer}</Text>
                            </View>
                            <View style={styles.likeContainer}>
                                <Ionicons name="heart" size={16} color="#FF4B4B" />
                                <Text style={styles.likeCount}>{item.likes}</Text>
                            </View>
                        </View>
                        <Text style={styles.featuredTitle}>{item.title}</Text>
                        <TouchableOpacity style={styles.shopButton}>
                            <Text style={styles.shopButtonText}>SHOP COLLECTION</Text>
                            <MaterialIcons name="arrow-forward" size={16} color="#000" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                stickyHeaderIndices={[1]}
            >
                {renderHeader()}
                {renderCategories()}
                {renderTrending()}
                {renderFeatured()}

                <View style={styles.footerSpacing} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        position: 'relative',
        zIndex: 10,
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topTabsContainer: {
        marginBottom: 20,
        marginHorizontal: -10, // Offset internal padding of TopCategoryBoxes
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    headerTitle: {
        fontFamily: 'System',
        fontSize: 14,
        fontWeight: '800',
        color: '#CCFF00', // Neon Lime
        letterSpacing: 2,
    },
    headerSubtitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        lineHeight: 36,
    },
    searchButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    scrollContent: {
        paddingTop: 10,
    },
    categoriesWrapper: {
        backgroundColor: '#000',
        zIndex: 100,
        paddingVertical: 10,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
        marginBottom: 20, // Reduced bottom margin since wrapper has padding
    },
    categoryPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 100,
        backgroundColor: '#1A1A1A',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    categoryPillActive: {
        backgroundColor: '#CCFF00',
        borderColor: '#CCFF00',
    },
    categoryText: {
        color: '#888',
        fontWeight: '600',
        fontSize: 14,
    },
    categoryTextActive: {
        color: '#000',
        fontWeight: '700',
    },
    sectionContainer: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginLeft: 20, // Manual margin for standalone title
        marginBottom: 15, // Manual margin for standalone title
    },
    // Fix for sectionTitle usage inside sectionHeader vs standalone
    // Actually simpler to just apply paddingHorizontal to container?
    // Let's rely on specific usage classes.

    seeAllText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    trendingList: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    trendingCard: {
        width: 160,
        height: 220,
        borderRadius: 20,
        marginRight: 16,
        overflow: 'hidden',
        backgroundColor: '#1E1E1E',
        position: 'relative',
    },
    trendingImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    trendingOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        justifyContent: 'flex-end',
        padding: 12,
    },
    trendingInfo: {
        zIndex: 2,
    },
    trendingName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    trendingHandle: {
        color: '#AAA',
        fontSize: 12,
        marginBottom: 8,
    },
    categoryBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    categoryBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    featuredCard: {
        marginHorizontal: 20,
        height: 400,
        borderRadius: 30,
        marginBottom: 20,
        overflow: 'hidden',
        backgroundColor: '#1A1A1A', // Fallback
    },
    featuredImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    featuredOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    featuredContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
    },
    featuredHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    featuredAuthor: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#CCFF00',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    authorInitial: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    authorName: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100,
    },
    likeCount: {
        color: '#FFF',
        marginLeft: 4,
        fontWeight: '600',
        fontSize: 12,
    },
    featuredTitle: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: '800',
        lineHeight: 32,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    shopButton: {
        backgroundColor: '#FFF',
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shopButtonText: {
        color: '#000',
        fontWeight: '800',
        textTransform: 'uppercase',
        marginRight: 8,
        letterSpacing: 1,
    },
    footerSpacing: {
        height: 100,
    },
});
