import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import api from '../../src/lib/api';
import { useCart } from '../../src/context/CartContext';

// Components
import ProductTimer from '../../src/components/product/ProductTimer';
import ProductImageCarousel from '../../src/components/product/ProductImageCarousel';
import VariantSelector from '../../src/components/product/VariantSelector';
import PriceAndTitle from '../../src/components/product/PriceAndTitle';
import WowDealBanner from '../../src/components/product/WowDealBanner';
import BankOffers from '../../src/components/product/BankOffers';
import DeliveryInfo from '../../src/components/product/DeliveryInfo';
import ProductHighlights from '../../src/components/product/ProductHighlights';
import RichContent from '../../src/components/product/RichContent';

import BottomActionBar from '../../src/components/product/BottomActionBar';
import LastChancePopup from '../../src/components/product/LastChancePopup';

interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  description?: string;
  shortDescription?: string;
  category?: string;
  brandName?: string;
  stock?: number;
  saleEndDate?: string;
  protectPromiseFee?: number;
  offers?: {
    type: string;
    title: string;
    description: string;
    discountAmount: number;
    code?: string;
  }[];
  sellerName?: string;
  warrantyDetails?: string;
  trustBadges?: {
    id: string;
    name: string;
    icon: string;
  }[];
  lastChanceOffers?: {
    _id: string;
    title: string;
    description?: string;
    originalPrice: number;
    offerPrice: number;
    discountPercentage?: number;
    tag?: string;
    features?: string[];
    image?: string;
  }[];
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [isUpsellVisible, setUpsellVisible] = useState(false);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}`);
      console.log('📦 Product fetched:', response.data.title);
      console.log('🎁 Last Chance Offers:', response.data.lastChanceOffers);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product._id, 1, product);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('🛒 Buy Now clicked');
    console.log('📊 Product:', product?.title);
    console.log('🎁 Offers available:', product?.lastChanceOffers);
    console.log('📏 Offers length:', product?.lastChanceOffers?.length);

    // Check for upsell offers
    if (product?.lastChanceOffers && product.lastChanceOffers.length > 0) {
      console.log('✅ Opening popup with', product.lastChanceOffers.length, 'offers');
      setUpsellVisible(true);
    } else {
      console.log('❌ No offers found, proceeding to checkout');
      proceedToCheckout([]);
    }
  };



  const proceedToCheckout = (selectedOfferIds: string[]) => {
    console.log('🛍️ Proceeding to checkout with offers:', selectedOfferIds);
    setUpsellVisible(false);

    // Navigate to checkout page
    router.push({
      pathname: '/checkout',
      params: {
        productId: id,
        selectedOffers: JSON.stringify(selectedOfferIds)
      }
    });
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }

  // Use product images or fallbacks
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://via.placeholder.com/400'];

  // Derived values for dynamic display
  const mrp = Math.round(product.price * 1.3);
  const discount = '30% off';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.contentContainer}>
        {/* Main Scroll Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* 1. Timer */}
          <View style={{ paddingTop: 0 }}>
            <ProductTimer targetDate={product.saleEndDate} />
          </View>

          {/* 2. Image Carousel */}
          <ProductImageCarousel images={images} />

          {/* 3. Variants - Hidden as we don't have variant data */}
          {/* <VariantSelector /> */}

          {/* 4. Title & Price */}
          <PriceAndTitle
            brand={product.brandName}
            name={product.title}
            shortDescription={product.shortDescription || product.description}
            price={product.price}
            mrp={mrp}
            discount={discount}
            protectPromiseFee={product.protectPromiseFee}
          />

          {/* Product Long Description */}
          {product.description && (
            <View style={{ paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#fff' }}>
              <Text style={{ fontSize: 13, color: '#4B5563', lineHeight: 20 }}>
                {product.description}
              </Text>
            </View>
          )}

          {/* 5. Wow Deal Banner */}
          <WowDealBanner price={product.price} offers={product.offers} />

          {/* 6. Bank Offers */}
          <BankOffers offers={product.offers} />

          {/* 7. Delivery Info */}
          <DeliveryInfo
            productId={product._id}
            sellerName={product.sellerName}
            trustBadges={product.trustBadges}
          />

          {/* 8. Highlights */}
          <ProductHighlights description={product.description} />

          {/* 9. Rich Content (Display Banner, Videos) */}
          <RichContent />

          {/* Spacer for bottom bar */}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Sticky Bottom Footer */}
        <BottomActionBar
          price={product.price}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onOpenCart={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/cart');
          }}
        />
      </View>

      <LastChancePopup
        visible={isUpsellVisible}
        onClose={() => proceedToCheckout([])}
        onContinue={(selectedIds) => proceedToCheckout(selectedIds)}
        offers={product?.lastChanceOffers || []}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E0F2FE', // Blue top
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White body
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
