import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
}

const AdvancedRenderer: React.FC<AdvancedRendererProps> = ({ component }) => {
    const router = useRouter();

    if (!component) return null;

    // Destructure for easier access
    const { type, props = {}, style = {}, children = [] } = component;

    // recursive rendering helper
    const renderChildren = () => {
        return children.map((child: SDUIComponent, index: number) => (
            <AdvancedRenderer key={child.id || `child-${index}`} component={child} />
        ));
    };

    switch (type) {
        case 'Container':
            return (
                <View style={style}>
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
            // Logic for wrapping lightning deals with gradient
            // We expect products to be hydrated into props.products OR content.products
            const lightningProducts = props.products || props.content?.products || [];
            return (
                <LinearGradient
                    colors={['#FFF0F5', '#FFE4E1', '#FDF2F8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[{ paddingVertical: 24, position: "relative", overflow: "hidden", marginBottom: 16 }, style]}
                >
                    <Image
                        source={{ uri: "https://cdn-icons-png.flaticon.com/512/616/616490.png" }}
                        style={{ position: "absolute", right: -20, top: -10, width: 150, height: 150, opacity: 0.05, tintColor: "#EF4444", transform: [{ rotate: "-15deg" }] }}
                    />
                    <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                        <Text style={{ fontSize: 20, fontWeight: "800", color: "#BE123C", marginBottom: 4 }}>Lightning deals</Text>
                    </View>
                    <ProductCardGrid products={lightningProducts} layout="lightning" />
                </LinearGradient>
            );

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
            return (
                <View style={[{ paddingHorizontal: 16, marginBottom: 24 }, style]}>
                    {props.title ? <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#111827" }}>{props.title}</Text> : null}
                    <ProductCardGrid products={props.products || []} layout="horizontal" />
                </View>
            );

        case 'product_grid':
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
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={style}
                >
                    {renderChildren()}
                </ScrollView>
            );

        default:
            console.warn(`Unknown component type: ${type}`);
            return null;
    }
};

export default AdvancedRenderer;
