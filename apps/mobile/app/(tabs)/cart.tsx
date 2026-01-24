import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../src/context/CartContext';
import { useBasket } from '../../src/context/BasketContext';
import { useAuth } from '../../src/context/AuthContext';
import { useUserLocation } from '../../src/hooks/useUserLocation';
import CartItem from '../../src/components/cart/CartItem';
import GroceryCartView from '../../src/components/cart/GroceryCartView';

// --- Shared Types ---
type TabType = 'shopping' | 'grocery';

// --- Component: Address Bar ---
const AddressBar = () => {
  const { address, loading, fetchLocation } = useUserLocation();

  // Default or fetched address
  const name = address?.name || "User";
  const pincode = address?.postalCode || "460001"; // Default from design if missing
  const fullAddress = address?.formattedAddress || "Select your location to see delivery options";
  const label = address ? "HOME" : "WORK"; // Just a placeholder label logic

  return (
    <View style={styles.addressBar}>
      <View style={{ flex: 1 }}>
        <View style={styles.addressHeaderRow}>
          <Text style={styles.deliverToText}>Deliver to: </Text>
          <Text style={styles.deliverName}>{name}, {pincode}</Text>
          <View style={styles.addressLabelContainer}>
            <Text style={styles.addressLabelText}>{label}</Text>
          </View>
        </View>
        <Text style={styles.addressSubText} numberOfLines={1}>
          {loading ? "Fetching location..." : fullAddress}
        </Text>
      </View>
      <TouchableOpacity style={styles.changeButton} onPress={fetchLocation}>
        <Text style={styles.changeButtonText}>Change</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Main Component: Cart Screen ---
export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // Shopping Cart Context
  const {
    cart,
    loading: cartLoading,
    updateQuantity: updateCartQty,
    removeFromCart,
    cartTotal,
    cartCount
  } = useCart();

  // Grocery Basket Context
  const {
    basket,
    loading: basketLoading,
    updateQuantity: updateBasketQty,
    removeFromBasket,
    basketTotal,
    basketCount
  } = useBasket();

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('shopping');

  // Determine Data Source
  const isLoading = activeTab === 'shopping' ? cartLoading : basketLoading;
  const items = activeTab === 'shopping' ? (cart?.items || []) : (basket?.items || []);
  const total = activeTab === 'shopping' ? cartTotal : basketTotal;
  const count = activeTab === 'shopping' ? cartCount : basketCount;

  // Handlers
  const handleUpdateQuantity = async (id: string, qty: number) => {
    if (qty < 1) {
      handleRemove(id);
      return;
    }
    if (activeTab === 'shopping') {
      await updateCartQty(id, qty);
    } else {
      await updateBasketQty(id, qty);
    }
  };

  const handleRemove = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive', onPress: async () => {
            if (activeTab === 'shopping') {
              await removeFromCart(id);
            } else {
              await removeFromBasket(id);
            }
          }
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push({
      pathname: '/checkout',
      params: { source: 'cart' }
    } as any);
  };

  // --- Render Sections ---

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        {activeTab === 'shopping' ? 'My Cart' : `My Basket (${count} Items)`}
      </Text>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsStickyContainer}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shopping' && styles.activeTab]}
          onPress={() => setActiveTab('shopping')}
        >
          <Text style={[styles.tabText, activeTab === 'shopping' && styles.activeTabText]}>
            Shopping ({cartCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'grocery' && styles.activeTab]}
          onPress={() => setActiveTab('grocery')}
        >
          <Text style={[styles.tabText, activeTab === 'grocery' && styles.activeTabText]}>
            Grocery
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabLineBackground}>
        <View style={[
          styles.activeTabLine,
          {
            width: '50%',
            left: activeTab === 'shopping' ? '0%' : '50%'
          }
        ]} />
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{
          uri: activeTab === 'shopping'
            ? 'https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90'
            : 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png'
        }}
        style={{ width: 200, height: 150, resizeMode: 'contain' }}
      />
      <Text style={styles.emptyText}>Your {activeTab} {activeTab === 'shopping' ? 'cart' : 'basket'} is empty!</Text>
      <Text style={styles.emptySubText}>Explore our wide range of products.</Text>
      <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push('/')}>
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.priceDetailsContainer}>
      <Text style={styles.priceHeader}>Price Details</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.priceLabel}>Price ({count} items)</Text>
        <Text style={styles.priceValue}>₹{total.toLocaleString()}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.priceLabel}>Delivery Charges</Text>
        <Text style={[styles.discountValue, { color: '#388E3C' }]}>FREE</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
      </View>

      {/* Spacer for bottom bar */}
      <View style={{ height: 100 }} />
    </View>
  );

  // FlatList Render Item
  const renderItem = ({ item, index }: { item: any, index: number }) => {
    // Generate stable key for component (API data might lack id on item level sometimes)
    const pid = typeof item.productId === 'string' ? item.productId : item.productId?._id;

    return (
      <CartItem
        item={item}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header and Tabs are static outside scroll for stickiness/layout control or could be ListHeaderComponent */}
      <View style={{ zIndex: 10 }}>
        {renderHeader()}
        {renderTabs()}
        <AddressBar />
      </View>

      <View style={styles.contentBackground}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2874F0" />
          </View>
        ) : items.length === 0 ? (
          renderEmptyState()
        ) : (
          activeTab === 'shopping' ? (
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item, index) => {
                const pid = typeof item.productId === 'string' ? item.productId : item.productId?._id;
                return pid || `cart-item-${index}`;
              }}
              ListFooterComponent={renderFooter}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            // Grocery View (Kept as single component for now as it renders complex nested list)
            // Ideally refactor this to FlatList as well if grocery lists get huge
            <ScrollView showsVerticalScrollIndicator={false}>
              <GroceryCartView
                items={items}
                updateQuantity={handleUpdateQuantity}
                basketTotal={total}
              />
            </ScrollView>
          )
        )}
      </View>

      {/* Bottom Sticky Checkout Bar */}
      {items.length > 0 && !isLoading && (
        activeTab === 'shopping' ? (
          <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
            <View style={styles.footerTotal}>
              <Text style={styles.footerOldPrice}>₹{total < 10000 ? (total * 1.1).toFixed(0) : ''}</Text>
              <Text style={styles.footerCurrentPrice}>₹{total.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.placeOrderBtn} onPress={handleCheckout}>
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.checkoutBar, { paddingBottom: 16 + insets.bottom }]}>
            <View>
              <Text style={styles.checkoutTotalLabel}>Total</Text>
              <Text style={styles.checkoutTotalValue}>₹{total + 2}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Proceed to Pay</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        )
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentBackground: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsStickyContainer: {
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  listContent: {
    flex: 1
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  activeTabText: {
    color: '#2874F0',
    fontWeight: '600',
  },
  tabLineBackground: {
    height: 2,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  activeTabLine: {
    height: 2,
    backgroundColor: '#2874F0',
    position: 'absolute',
    top: 0
  },
  // Address Bar
  addressBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 8,
    borderBottomColor: '#F1F3F6',
  },
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliverToText: {
    fontSize: 14,
    color: '#000',
  },
  deliverName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginRight: 6
  },
  addressLabelContainer: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addressLabelText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  addressSubText: {
    fontSize: 13,
    color: '#878787',
    width: '90%',
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
  },
  changeButtonText: {
    color: '#2874F0',
    fontSize: 12,
    fontWeight: '600',
  },
  // Common Cart Item Styles
  cartItemContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#F1F3F6',
  },
  cartItemContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageColumn: {
    width: 100,
    alignItems: 'center',
  },
  imageWrapper: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  qtyLabel: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '500',
  },
  detailsColumn: {
    flex: 1,
    paddingLeft: 12,
  },
  productTitle: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 6,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBadge: {
    backgroundColor: '#388E3C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingCount: {
    fontSize: 12,
    color: '#878787',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: '#878787',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountText: {
    fontSize: 13,
    color: '#388E3C',
    fontWeight: '600',
    marginRight: 6
  },
  offersText: {
    fontSize: 12,
    color: '#2874F0',
    marginBottom: 6,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryDate: {
    fontSize: 12,
    color: '#212121',
  },
  separator: {
    width: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 6,
  },
  freeDelivery: {
    fontSize: 12,
    color: '#388E3C',
    fontWeight: '600'
  },
  itemActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  actionText: {
    fontSize: 14,
    color: '#878787',
    marginLeft: 6,
    fontWeight: '500',
  },
  qtyEditButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  qtyBtn: {
    padding: 5
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    color: '#212121',
  },
  emptySubText: {
    fontSize: 14,
    color: '#878787',
    marginTop: 8,
    marginBottom: 24,
  },
  shopNowBtn: {
    backgroundColor: '#2874F0',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 4,
  },
  shopNowText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  // Price Details (Shopping)
  priceDetailsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 8,
    borderTopColor: '#F1F3F6',
  },
  priceHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#878787',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#212121',
  },
  priceValue: {
    fontSize: 14,
    color: '#212121',
  },
  discountValue: {
    fontSize: 14,
    color: '#388E3C',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 16,
    marginBottom: 12
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  savingsText: {
    fontSize: 14,
    color: '#388E3C',
    fontWeight: '500',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Shopping Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    padding: 10,
    alignItems: 'center',
  },
  footerTotal: {
    flex: 1,
    paddingLeft: 10,
  },
  footerOldPrice: {
    fontSize: 12,
    color: '#878787',
    textDecorationLine: 'line-through',
  },
  footerCurrentPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  placeOrderBtn: {
    backgroundColor: '#FB641B',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
    width: '45%',
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // --- Grocery Specific Styles ---
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7', // Green-100
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  deliveryTextContainer: {
    marginLeft: 12,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#14532D',
  },
  deliverySubtitle: {
    fontSize: 12,
    color: '#166534',
  },
  itemsList: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 16,
    borderBottomColor: '#F1F3F6',
  },
  groceryItemCard: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  groceryImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  groceryItemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  groceryItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  groceryItemWeight: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  groceryPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groceryCurrentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  groceryOriginalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  groceryQuantityControl: {
    backgroundColor: '#15803d', // Green
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    height: 32,
    alignSelf: 'center',
  },
  groceryQtyBtn: {
    width: 28,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groceryQtyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groceryQtyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  billSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  billLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  savingsBanner: {
    backgroundColor: '#ECFEFF', // Cyan-50
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CFFAFE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 12,
    paddingBottom: 20, // Add explicit padding for bottom/SafeArea
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutTotalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  checkoutTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  checkoutButton: {
    backgroundColor: '#15803d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
