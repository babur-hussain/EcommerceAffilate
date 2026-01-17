import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    Platform,
    ImageBackground,
    Animated,
    Easing
} from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { GroceryStaticHeader, GroceryStickyHeader } from './GroceryHeader';
import { useRouter } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StealDealSection } from './StealDealSection';
import { SoftSkinSection } from './SoftSkinSection';
import { WinterMustHavesSection } from './WinterMustHavesSection';
import { LaundryFavouritesSection } from './LaundryFavouritesSection';
import { PriceCrashSection } from './PriceCrashSection';
import { YourSmartBasketSection } from './YourSmartBasketSection';
import { RushHoursSection } from './RushHoursSection';
import { SpecialsSection } from './SpecialsSection';
import { BestSellersSection } from './BestSellersSection';
import { TopPicksSection } from './TopPicksSection';
import { ContinuousBannerSlider } from './ContinuousBannerSlider';
import { BreakfastEssentialsSection } from './BreakfastEssentialsSection';
import { DealsOfTheDaySection } from './DealsOfTheDaySection';
import { GroceryBottomBar } from './GroceryBottomBar';
import BasketScreen from './BasketScreen';

// ==================== Configuration Data ====================
const SUBCATEGORY_DATA = [
    {
        id: '6966996881e3721fae838d09',
        title: 'Winter Essential',
        discount: 'Up to 70% off',
        iconUrl: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768339003/products/z9nxbc93hgfkkogpflbk.png',
        badgeColor: '#1B5E20'
    },
    {
        id: 'snacks-beverages',
        title: 'Snack & Sip',
        discount: 'Up to 50% off',
        iconUrl: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768339123/products/nn8po2g34ud2irlriuxl.png',
        badgeColor: '#1B5E20'
    },
    {
        id: 'cooking-essentials',
        title: 'Cooking Corner',
        discount: 'Up to 40% off',
        iconUrl: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768339216/products/kxl5ejlw3jyuxicbdimo.png',
        badgeColor: '#1B5E20'
    }
];

// ==================== Typing Animation Component ====================
function TypingText() {
    const text = "Lowest price...";
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isDeleting && index < text.length) {
                setDisplayText((prev: string) => prev + text[index]);
                setIndex((prev: number) => prev + 1);
            } else if (isDeleting && index > 0) {
                setDisplayText((prev: string) => prev.slice(0, -1));
                setIndex((prev: number) => prev - 1);
            } else if (index === text.length) {
                // Pause at the end before deleting
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (index === 0 && isDeleting) {
                setIsDeleting(false);
            }
        }, isDeleting ? 100 : 200);

        return () => clearTimeout(timeout);
    }, [index, isDeleting]);

    return (
        <View style={typingStyles.container}>
            <Text style={typingStyles.text}>
                {displayText}
                <Text style={typingStyles.cursor}>|</Text>
            </Text>
        </View>
    );
}

const typingStyles = StyleSheet.create({
    container: {
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    text: {
        fontSize: 38,
        fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',
        color: '#FFFFFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    cursor: {
        fontSize: 34,
        color: '#FFFFFF',
        fontWeight: '300',
    }
});

const { width } = Dimensions.get('window');

// ==================== Hero Banner Section ====================
function GroceryHeroBanner() {
    return (
        <View style={heroBannerStyles.container}>
            <View style={heroBannerStyles.bannerCard}>
                {/* Decorative elements */}
                <View style={heroBannerStyles.decorCircle1} />
                <View style={heroBannerStyles.decorCircle2} />

                {/* Main content */}
                <View style={heroBannerStyles.content}>
                    <Text style={heroBannerStyles.title}>Lowest</Text>
                    <Text style={heroBannerStyles.subtitle}>Prices Ever!</Text>
                </View>

                {/* Offer categories */}
                <View style={heroBannerStyles.offersRow}>
                    <TouchableOpacity style={heroBannerStyles.offerCard}>
                        <View style={heroBannerStyles.discountBadge}>
                            <Text style={heroBannerStyles.discountText}>Up to 70% off</Text>
                        </View>
                        <Text style={heroBannerStyles.offerTitle}>Winter Essential</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={heroBannerStyles.offerCard}>
                        <View style={heroBannerStyles.discountBadge}>
                            <Text style={heroBannerStyles.discountText}>Up to 50% off</Text>
                        </View>
                        <Text style={heroBannerStyles.offerTitle}>Snack & Sip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={heroBannerStyles.offerCard}>
                        <View style={heroBannerStyles.discountBadge}>
                            <Text style={heroBannerStyles.discountText}>Up to 40% off</Text>
                        </View>
                        <Text style={heroBannerStyles.offerTitle}>Cooking Corner</Text>
                    </TouchableOpacity>
                </View>

                {/* Bank offer */}
                <View style={heroBannerStyles.bankOffer}>
                    <View style={heroBannerStyles.bankLogo}>
                        <Text style={heroBannerStyles.bankText}>HDFC BANK</Text>
                    </View>
                    <Text style={heroBannerStyles.bankOfferText}>₹200 Off on ₹2,499</Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
            </View>
        </View>
    );
}

const heroBannerStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    bannerCard: {
        backgroundColor: '#FF9800',
        borderRadius: 16,
        padding: 20,
        minHeight: 280,
        overflow: 'hidden',
        position: 'relative',
    },
    decorCircle1: {
        position: 'absolute',
        top: -30,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    decorCircle2: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 215, 0, 0.4)',
    },
    content: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.9,
    },
    offersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    offerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        width: (width - 76) / 3,
        alignItems: 'center',
    },
    discountBadge: {
        backgroundColor: '#E53935',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        marginBottom: 8,
    },
    discountText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    offerTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    bankOffer: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    bankLogo: {
        backgroundColor: '#003087',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 10,
    },
    bankText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    bankOfferText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
    },
});

// ==================== Deals Section ====================
function DealsSection() {
    return (
        <View style={dealsStyles.container}>
            <Text style={dealsStyles.sectionTitle}>Steal Deal - Pick any one!</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={dealsStyles.scrollContent}
            >
                <TouchableOpacity style={dealsStyles.dealCard}>
                    <View style={dealsStyles.lockBanner}>
                        <MaterialIcons name="lock" size={12} color="#FFFFFF" />
                        <Text style={dealsStyles.lockText}>Shop for ₹599 to unlock this deal</Text>
                    </View>
                    <View style={dealsStyles.dealContent}>
                        <View style={dealsStyles.dealImagePlaceholder}>
                            <MaterialIcons name="local-offer" size={32} color="#FF9800" />
                        </View>
                        <View style={dealsStyles.dealInfo}>
                            <Text style={dealsStyles.dealWeight}>242 g</Text>
                            <Text style={dealsStyles.dealName} numberOfLines={2}>
                                Sunfeast Dark Fantasy Yumfills Cookie Cake Biscu...
                            </Text>
                            <View style={dealsStyles.priceRow}>
                                <Text style={dealsStyles.dealPrice}>₹1</Text>
                                <Text style={dealsStyles.originalPrice}>current price ₹77</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={dealsStyles.dealCard}>
                    <View style={dealsStyles.lockBanner}>
                        <MaterialIcons name="lock" size={12} color="#FFFFFF" />
                        <Text style={dealsStyles.lockText}>Shop for ₹599 to unlock</Text>
                    </View>
                    <View style={dealsStyles.dealContent}>
                        <View style={dealsStyles.dealImagePlaceholder}>
                            <MaterialIcons name="local-drink" size={32} color="#0288D1" />
                        </View>
                        <View style={dealsStyles.dealInfo}>
                            <Text style={dealsStyles.dealWeight}>500 ml</Text>
                            <Text style={dealsStyles.dealName} numberOfLines={2}>
                                Premium Shampoo Anti-Dandruff...
                            </Text>
                            <View style={dealsStyles.priceRow}>
                                <Text style={dealsStyles.dealPrice}>₹1</Text>
                                <Text style={dealsStyles.originalPrice}>current price ₹199</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const dealsStyles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    scrollContent: {
        paddingRight: 12,
    },
    dealCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: 280,
        marginRight: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    lockBanner: {
        backgroundColor: '#7C3AED',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    lockText: {
        fontSize: 11,
        color: '#FFFFFF',
        fontWeight: '500',
        marginLeft: 6,
    },
    dealContent: {
        flexDirection: 'row',
        padding: 12,
    },
    dealImagePlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    dealInfo: {
        flex: 1,
    },
    dealWeight: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 4,
    },
    dealName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dealPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#10B981',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 11,
        color: '#9CA3AF',
    },
});

// ==================== Main Screen Component ====================
interface GroceryScreenProps {
    onTabPress?: (tabId: string) => void;
    setStatusColor?: (color: string) => void;
}

export default function GroceryScreen({ onTabPress, setStatusColor }: GroceryScreenProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('grocery');

    // Use a Ref to track if we are currently animating
    const isAnimating = useRef(false);

    // Standard Animated Value
    const slideAnim = useRef(new Animated.Value(width)).current;

    const openBasket = () => {
        setStatusColor?.('#FFFFFF');
        setActiveTab('basket');
    };

    const closeBasket = () => {
        if (isAnimating.current) return;
        isAnimating.current = true;

        setStatusColor?.('#FFF8E7');

        Animated.timing(slideAnim, {
            toValue: width,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad), // Smoother linear-like feel
        }).start(({ finished }) => {
            if (finished) {
                setActiveTab('grocery');
                isAnimating.current = false;
            }
        });
    };

    useEffect(() => {
        if (activeTab === 'basket') {
            setStatusColor?.('#FFFFFF');
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad),
            }).start();
        }
    }, [activeTab]);

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: slideAnim } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const { translationX, velocityX } = event.nativeEvent;

            if (translationX > width * 0.3 || velocityX > 800) {
                closeBasket();
            } else {
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 0
                }).start();
            }
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Main Grocery Content */}
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
                scrollEventThrottle={16}
            >
                <GroceryStaticHeader onTabPress={onTabPress} />
                <GroceryStickyHeader />
                <View style={styles.contentContainer}>
                    <View style={styles.mainBannerCard}>
                        <Image
                            source={{ uri: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768337045/Grocery_Offer_Backgroung_krgtp0.jpg' }}
                            style={styles.bannerBackground}
                            resizeMode="cover"
                        />
                        <View style={styles.typingWrapper}>
                            <TypingText />
                        </View>
                        <View style={styles.subcategoryRow}>
                            {SUBCATEGORY_DATA.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.subcategoryCard}
                                    onPress={() => router.push(`/common-category/${item.id}`)}
                                >
                                    <View style={[styles.discountBadge, { backgroundColor: item.badgeColor }]}>
                                        <Text style={styles.discountText}>{item.discount}</Text>
                                    </View>
                                    <Text style={styles.subcategoryTitle}>{item.title}</Text>
                                    <View style={styles.iconContainer}>
                                        <Image
                                            source={{ uri: item.iconUrl }}
                                            style={styles.productIcon}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.deliveryBanner}>
                            <MaterialCommunityIcons name="timer-outline" size={20} color="#FF9800" />
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#000' }}>
                                Get delivered in 30 Minutes
                            </Text>
                        </View>
                    </View>
                    <StealDealSection />
                    <TopPicksSection />
                    <ContinuousBannerSlider />
                    <BreakfastEssentialsSection />
                    <DealsOfTheDaySection />
                    <BestSellersSection />
                    <SpecialsSection />
                    <SoftSkinSection />
                    <RushHoursSection />
                    <YourSmartBasketSection />
                    <WinterMustHavesSection />
                    <LaundryFavouritesSection />
                    <PriceCrashSection />
                </View>
            </ScrollView>

            <GroceryBottomBar currentTab={activeTab} onTabPress={(tab) => {
                if (tab === 'basket') openBasket();
                else if (tab === 'grocery' && activeTab === 'basket') closeBasket();
                else setActiveTab(tab);
            }} />

            {/* Sliding Basket Screen Overlay */}
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetX={10}
            >
                <Animated.View
                    style={[
                        styles.basketOverlay,
                        { transform: [{ translateX: slideAnim }] }
                    ]}
                >
                    <BasketScreen onBack={closeBasket} />
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E7',
    },
    contentContainer: {
        backgroundColor: '#FFF8E7',
        minHeight: 800,
        paddingBottom: 120, // Increased space for bottom bar
    },
    mainBannerCard: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 20,
        overflow: 'hidden',
        paddingBottom: 16,
    },
    bannerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    typingWrapper: {
        marginTop: 20, // Relative positioning instead of absolute
        alignItems: 'center',
        zIndex: 10,
    },
    subcategoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginTop: 10, // Positive margin since tying is relative now
    },
    subcategoryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: (Dimensions.get('window').width - 64) / 3,
        paddingVertical: 8,
        paddingHorizontal: 6,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    deliveryBanner: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 40,
        marginTop: 20,
        marginBottom: 8,
        paddingVertical: 10,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    deliveryText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },
    discountBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        marginBottom: 6,
    },
    discountText: {
        fontSize: 8,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    subcategoryTitle: {
        fontSize: 10,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 6,
    },
    iconContainer: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        overflow: 'hidden',
    },
    productIcon: {
        width: '85%',
        height: '85%',
    },
    basketOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 50, // Above bottom bar and content
    }
});
