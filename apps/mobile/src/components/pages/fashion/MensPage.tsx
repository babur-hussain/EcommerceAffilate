import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, TextInput, Platform, SafeAreaView, BackHandler, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { usePageLayout } from '../../../hooks/usePageLayout';
import { useData } from '../../../hooks/useData';

const { width } = Dimensions.get('window');
const COLORS = {
    primary: '#0F172A', // Slate 900
    secondary: '#334155', // Slate 700
    background: '#F8FAFC', // Slate 50
    white: '#FFFFFF',
    textMain: '#0F172A',
    textSub: '#64748B', // Slate 500
    gray100: '#F1F5F9',
    gray200: '#E2E8F0',
    gray300: '#CBD5E1',
    gray400: '#94A3B8',
    orange: '#F97316'
};

export default function MensPage() {
    const router = useRouter();
    // Use URL params for state management to support native back navigation
    const params = useLocalSearchParams();
    const selectedCategory = typeof params.category === 'string' ? params.category : null;

    // Fetch Main Page Layout
    const { layout, loading: layoutLoading, getSection } = usePageLayout('men-fashion');

    // Fetch Products for Selected Category (if any)
    const { data: productsData, loading: productsLoading } = useData(
        '/api/products',
        { category: selectedCategory },
        { enabled: !!selectedCategory }
    );

    const renderMainContent = () => {
        if (layoutLoading) {
            return (
                <View style={{ height: 400, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            );
        }

        if (!layout) {
            return (
                <View style={{ height: 400, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: COLORS.textSub }}>Failed to load content.</Text>
                </View>
            );
        }

        const heroSection = getSection('men_hero_banner');
        const categoriesSection = getSection('men_categories_grid');
        const brandsSection = getSection('men_featured_brands');
        const newInSection = getSection('men_new_in');

        return (
            <>
                {/* Hero Banner */}
                {heroSection && (
                    <View style={{ padding: 20 }}>
                        <View style={{ height: 420, borderRadius: 2, overflow: 'hidden', position: 'relative', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}>
                            <Image
                                source={{ uri: heroSection.content.backgroundImage }}
                                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(15, 39, 87, 0.2)', 'rgba(15, 39, 87, 0.9)']}
                                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '100%' }}
                            />
                            <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 24, gap: 16, alignItems: 'flex-start' }}>
                                <View>
                                    <Text style={{ fontSize: 30, color: COLORS.white, fontWeight: '800', lineHeight: 36, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}>{heroSection.content.title}</Text>
                                    <Text style={{ color: COLORS.gray300, fontSize: 14, fontWeight: '500', marginTop: 4 }}>{heroSection.content.subtitle}</Text>
                                </View>
                                <TouchableOpacity onPress={() => router.push(heroSection.content.actionUrl || "/fashion/collection/men-collection-view")} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 }}>
                                    <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 14 }}>{heroSection.content.buttonText}</Text>
                                    <MaterialIcons name="arrow-forward" size={18} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Categories Grid */}
                {categoriesSection && (
                    <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.textMain }}>{categoriesSection.content.title}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase' }}>{categoriesSection.content.viewAllText}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {categoriesSection.content.items.map((item: any) => {
                                const itemWidth = (width - 40 - 24) / 4;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => router.push({ pathname: '/fashion/collection/men', params: { category: item.id } })}
                                        style={{ width: itemWidth, gap: 8, alignItems: 'center', marginBottom: 8 }}
                                    >
                                        <View style={{ width: itemWidth, height: itemWidth, borderRadius: 2, padding: 8, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.gray200, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                            />
                                        </View>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: "#475569", textTransform: 'uppercase', textAlign: 'center' }}>{item.name}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Featured Brands */}
                {brandsSection && (
                    <View style={{ paddingBottom: 40, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 }}>
                        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                            <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.textMain }}>{brandsSection.content.title}</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
                            {brandsSection.content.items.map((brand: any, index: number) => (
                                <View key={index} style={{ minWidth: 80, height: 48, backgroundColor: COLORS.white, borderRadius: 2, borderWidth: 1, borderColor: COLORS.gray200, alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '900', letterSpacing: 1 }}>{brand.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* New In Section */}
                {newInSection && (
                    <View style={{ paddingTop: 32, paddingHorizontal: 20, paddingBottom: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.textMain }}>{newInSection.content.title}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase' }}>{newInSection.content.viewAllText}</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
                            {newInSection.content.items.map((item: any, index: number) => (
                                <View key={index} style={{ width: 240 }}>
                                    <View style={{ aspectRatio: 3 / 4, backgroundColor: COLORS.gray200, borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View>
                                            <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.textMain }}>{item.name}</Text>
                                            <Text style={{ fontSize: 12, fontWeight: '500', color: COLORS.textSub, marginTop: 2 }}>{item.desc}</Text>
                                        </View>
                                        <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.textMain }}>{item.price}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </>
        );
    };

    const renderCategoryContent = () => {
        const categoriesSection = layout?.sections?.find(s => s.id === 'men_categories_grid');
        // Fallback if layout not loaded or category not found in grid
        const categoryName = categoriesSection?.content.items.find((c: any) => c.id === selectedCategory)?.name || "Products";

        const products = Array.isArray(productsData) ? productsData : [];

        return (
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.textMain, marginLeft: 8 }}>Back to Collection</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 16 }}>{categoryName}</Text>

                {productsLoading ? (
                    <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="small" color={COLORS.primary} />
                    </View>
                ) : products.length === 0 ? (
                    <View style={{ alignItems: 'center', padding: 40 }}>
                        <Text style={{ color: COLORS.textSub }}>No products found in this category.</Text>
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                        {products.map((item: any) => {
                            const cardWidth = (width - 40 - 16) / 2;
                            return (
                                <View key={item._id || item.id} style={{ width: cardWidth }}>
                                    <View style={{ aspectRatio: 3 / 4, backgroundColor: COLORS.white, borderRadius: 2, borderWidth: 1, borderColor: COLORS.gray200, marginBottom: 8, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                        <Image
                                            source={{ uri: item.image || item.images?.[0] || 'https://via.placeholder.com/150' }}
                                            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.gray400, textTransform: 'uppercase' }}>{item.brand || "Brand"}</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.textMain, marginTop: 2 }}>{item.name}</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 4 }}>{item.price}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={{ backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold', letterSpacing: 1, color: COLORS.textSub, textTransform: 'uppercase' }}>Collection</Text>
                        <Text style={{ fontSize: 16, fontWeight: '900', color: COLORS.textMain }}>Men's Wear</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity>
                            <Ionicons name="notifications-outline" size={24} color={COLORS.textMain} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')}>
                            <Ionicons name="bag-outline" size={24} color={COLORS.textMain} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Live Search */}
                <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gray100, borderRadius: 4, paddingHorizontal: 12, height: 40 }}>
                        <Ionicons name="search" size={20} color={COLORS.textSub} />
                        <TextInput
                            placeholder="Search collection..."
                            placeholderTextColor={COLORS.textSub}
                            style={{ flex: 1, marginLeft: 8, fontSize: 14, color: COLORS.textMain }}
                        />
                    </View>
                </View>

                {/* Sub-Nav Scroll */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 24, paddingBottom: 12 }}>
                    {["Streetwear", "Formal", "Basics", "Footwear", "Accessories"].map((tab, i) => (
                        <TouchableOpacity key={i} style={{ borderBottomWidth: i === 0 ? 2 : 0, borderBottomColor: COLORS.textMain, paddingBottom: 4 }}>
                            <Text style={{ fontSize: 14, fontWeight: i === 0 ? '700' : '500', color: i === 0 ? COLORS.textMain : COLORS.textSub }}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={{ backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
                {selectedCategory ? renderCategoryContent() : renderMainContent()}
            </ScrollView>

            {/* Bottom Floating Bar */}
            {!selectedCategory && (
                <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: COLORS.primary, borderRadius: 100, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 }}>
                    <TouchableOpacity style={{ alignItems: 'center', gap: 4 }}>
                        <Ionicons name="home" size={24} color={COLORS.white} />
                        <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: 'bold' }}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center', gap: 4 }}>
                        <Ionicons name="grid-outline" size={24} color={COLORS.white} />
                        <Text style={{ color: COLORS.white, fontSize: 10 }}>Shop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center', gap: 4 }}>
                        <Ionicons name="cart-outline" size={24} color={COLORS.white} />
                        <Text style={{ color: COLORS.white, fontSize: 10 }}>Cart</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
