import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import ProductCardGrid from '../ProductCardGrid';
import CuratedCollections from '../homepage/foryou/CuratedCollections';
import GrandKitchenSale from '../homepage/foryou/GrandKitchenSale';
import FiftyPercentOffZone from '../homepage/foryou/FiftyPercentOffZone';

// Define the component types
interface SDUIComponent {
    id: string;
    type: string;
    props?: Record<string, any>;
    style?: Record<string, any>;
    children?: SDUIComponent[];
}

interface AdvancedRendererProps {
    component: SDUIComponent;
    onBack?: () => void;
}

const AdvancedRenderer: React.FC<AdvancedRendererProps> = ({ component, onBack }) => {
    const router = useRouter();

    if (!component) return null;

    // Destructure for easier access
    const { type, props = {}, style = {}, children = [] } = component;

    // recursive rendering helper
    const renderChildren = () => {
        return children.map((child: SDUIComponent, index: number) => (
            <AdvancedRenderer key={child.id || `child-${index}`} component={child} onBack={onBack} />
        ));
    };

    switch (type) {
        case 'Container':
            return (
                <View style={style} collapsable={false}>
                    {renderChildren()}
                </View>
            );

        case 'Gradient':
            return (
                <LinearGradient
                    colors={props.colors || ['#ffffff', '#000000']}
                    start={props.start || { x: 0, y: 0 }}
                    end={props.end || { x: 1, y: 1 }}
                    style={style}
                >
                    {renderChildren()}
                </LinearGradient>
            );

        case 'Text':
            return (
                <Text style={style}>
                    {props.text || ''}
                </Text>
            );

        case 'Image':
            return (
                <Image
                    source={{ uri: props.source }}
                    style={style}
                    resizeMode={props.resizeMode || 'cover'}
                />
            );

        case 'ProductGrid':
            // If dynamic data resolution worked, products should be in props.products
            if (props.products && Array.isArray(props.products)) {
                return (
                    <View style={style}>
                        <ProductCardGrid
                            products={props.products}
                            title={props.title}
                            layout={props.cardStyle} // Pass raw cardStyle (e.g. 'lightning')
                        />
                    </View>
                );
            }
            return null; // Don't render empty grid if no products

        case 'Button':
            return (
                <TouchableOpacity
                    style={style}
                    onPress={() => {
                        if (props.action === 'navigation' && props.path) {
                            router.push(props.path);
                        }
                    }}
                >
                    <Text style={props.textStyle || { color: 'white' }}>{props.text}</Text>
                </TouchableOpacity>
            );

        // --- Specialized/Legacy Cases ---

        case 'hero_carousel':
            const banners = props.content?.banners || props.banners || [];
            const { width: SCREEN_WIDTH } = Dimensions.get('window');
            // Full width minus margins
            const CARD_WIDTH = SCREEN_WIDTH - 32;

            return (
                <View style={[{ marginBottom: 16 }, style]}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH + 10} // Width + margin
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                    >
                        {banners.map((banner: any, idx: number) => (
                            <TouchableOpacity key={idx} onPress={() => { if (banner.actionUrl) router.push(banner.actionUrl) }}>
                                <Image
                                    source={{ uri: banner.imageUrl }}
                                    style={{
                                        width: CARD_WIDTH,
                                        height: 200,
                                        borderRadius: 12,
                                        marginRight: 10
                                    }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            );

        case 'lightning_deals':
            return null;

        case 'curated_collections':
            return (
                <View style={style}>
                    <CuratedCollections data={props.content || props} />
                </View>
            );

        case 'grand_kitchen':
            return <View style={style}><GrandKitchenSale /></View>;

        case 'fifty_percent_off':
            return <View style={style}><FiftyPercentOffZone /></View>;

        case 'recent_history':
            return (
                <View style={[{ paddingHorizontal: 16, marginBottom: 16 }, style]}>
                    <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12, color: "#4B5563" }}>Still looking for these?</Text>
                    {/* Assuming backend hydrates browsing history into props.products */}
                    <ProductCardGrid products={props.products || []} layout="horizontal" />
                </View>
            );

        case 'grocery_row':
            return (
                <View style={[{ paddingVertical: 16, backgroundColor: "#F0FDF4", marginBottom: 24 }, style]}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, paddingHorizontal: 16, color: "#166534" }}>Grocery Essentials 🥦</Text>
                    <ProductCardGrid products={props.products || []} layout="horizontal" />
                </View>
            );

        case 'product_list_horizontal':
            if (props.title === 'Kids Fashion') return null;
            return (
                <View style={[{ paddingHorizontal: 16, marginBottom: 24 }, style]}>
                    {props.title ? <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#111827" }}>{props.title}</Text> : null}
                    <ProductCardGrid products={props.products || []} layout="horizontal" />
                </View>
            );

        case 'product_grid':
            if (props.title === 'Kids Fashion') return null;
            return (
                <View style={[{ paddingHorizontal: 16, marginBottom: 100 }, style]}>
                    {props.title ? <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>{props.title}</Text> : null}
                    <ProductCardGrid products={props.products || []} layout="grid" />
                </View>
            );

        case 'ScrollView':
            return (
                <ScrollView
                    horizontal={props.horizontal}
                    showsVerticalScrollIndicator={false}
                    style={style}
                    contentContainerStyle={props.contentContainerStyle}
                    stickyHeaderIndices={props.stickyHeaderIndices}
                >
                    {renderChildren()}
                </ScrollView>
            );

        // --- Service Hub Components ---
        case 'service_header':
            return (
                <LinearGradient
                    colors={['#2BC0E4', '#EAECC6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1.8 }}
                    style={{ paddingBottom: 16 }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 0, paddingBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ marginRight: 8 }}>
                                <MaterialIcons name="location-on" size={24} color="#144bb8" />
                            </View>
                            <View>
                                <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500' }}>Current Location</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111318' }}>New York, USA</Text>
                                    <MaterialIcons name="expand-more" size={16} color="#111318" />
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialIcons name="account-circle" size={24} color="#4B5563" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingHorizontal: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f2f4', borderRadius: 12, height: 48, paddingHorizontal: 16 }}>
                            <MaterialIcons name="search" size={24} color="#144bb8" style={{ marginRight: 8 }} />
                            <Text style={{ flex: 1, fontSize: 16, color: '#636f88', fontWeight: '500' }}>What service do you need?</Text>
                        </View>
                    </View>
                </LinearGradient>
            );

        case 'service_hero_section':
            return (
                <View style={{ marginBottom: 24, marginTop: 16 }}>
                    <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111318' }}>Featured Services</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
                        {props.items?.map((item: any, index: number) => (
                            <TouchableOpacity key={index} style={{ width: 280, height: 157, borderRadius: 12, overflow: 'hidden', marginRight: 16 }}>
                                <Image source={{ uri: item.image }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                                    style={StyleSheet.absoluteFillObject}
                                />
                                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 }}>
                                    <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: item.tagColor || '#144bb8', marginBottom: 4 }}>
                                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#fff' }}>{item.tag}</Text>
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>{item.title}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#E5E7EB' }}>{item.subtitle}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            );

        case 'service_category_section':
            return (
                <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111318' }}>{props.title}</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#144bb8', marginRight: 4 }}>See All</Text>
                            <MaterialIcons name="arrow-forward" size={18} color="#144bb8" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {props.items?.map((item: any, index: number) => (
                            <TouchableOpacity key={index} style={{ width: '30%', alignItems: 'center', marginBottom: 16 }}>
                                <View style={{
                                    width: 64, height: 64, borderRadius: 16,
                                    backgroundColor: item.bgColor,
                                    justifyContent: 'center', alignItems: 'center',
                                    marginBottom: 12
                                }}>
                                    <MaterialIcons name={item.icon as any} size={32} color={item.iconColor} />
                                </View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#111318', textAlign: 'center' }}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );

        case 'service_bottom_nav':
            return (
                <View style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    backgroundColor: '#fff',
                    borderTopWidth: 1, borderTopColor: '#f3f4f6',
                    paddingBottom: 20, // Safe area approximation
                    paddingTop: 12,
                    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
                }}>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <MaterialIcons name="home" size={24} color="#144bb8" />
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#144bb8', marginTop: 2 }}>Services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <MaterialIcons name="calendar-today" size={24} color="#9CA3AF" />
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9CA3AF', marginTop: 2 }}>Bookings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <MaterialIcons name="account-balance-wallet" size={24} color="#9CA3AF" />
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9CA3AF', marginTop: 2 }}>Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <MaterialIcons name="person" size={24} color="#9CA3AF" />
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9CA3AF', marginTop: 2 }}>Profile</Text>
                    </TouchableOpacity>
                </View>
            );

        default:
            console.warn(`Unknown component type: ${type}`);
            return null;
    }
};

export default AdvancedRenderer;
