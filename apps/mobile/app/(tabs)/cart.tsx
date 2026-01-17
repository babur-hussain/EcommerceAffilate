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
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../src/context/CartContext';
import { useBasket } from '../../src/context/BasketContext';
import { useAuth } from '../../src/context/AuthContext';
import { useUserLocation } from '../../src/hooks/useUserLocation';

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

// --- Component: Shopping Cart Item ---
interface CartItemProps {
  item: any;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const product = item.productId || {};
  const productId = typeof product === 'string' ? product : (product._id || product);
  const name = product.name || product.title || 'Unknown Product';
  const price = product.price || 0;

  // Discount logic
  const originalPrice = Math.round(price * 1.05);
  const discount = 5;

  // Image logic
  const imageUri = (product.images && product.images[0]) || product.image;

  const quantity = item.quantity;

  return (
    <View style={styles.cartItemContainer}>
      <View style={styles.cartItemContent}>
        <View style={styles.imageColumn}>
          <View style={styles.imageWrapper}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.productImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="image" size={24} color="#9CA3AF" />
              </View>
            )}
          </View>
          <View style={styles.qtySelector}>
            <Text style={styles.qtyLabel}>Qty: {quantity}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#333" />
          </View>
        </View>

        <View style={styles.detailsColumn}>
          <Text style={styles.productTitle} numberOfLines={2}>{name}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>4.7</Text>
              <FontAwesome name="star" size={10} color="#fff" style={{ marginLeft: 2 }} />
            </View>
            <Text style={styles.ratingCount}> (12,567)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.discountText}>↓{discount}%</Text>
            <Text style={styles.originalPrice}>₹{originalPrice.toLocaleString()}</Text>
            <Text style={styles.currentPrice}>₹{price.toLocaleString()}</Text>
          </View>

          <Text style={styles.offersText}>2 offers applied • 5% off</Text>

          <View style={styles.deliveryRow}>
            <Text style={styles.deliveryDate}>Delivery by {new Date(Date.now() + 86400000 * 2).toLocaleDateString().slice(0, 5)}</Text>
            <View style={styles.separator} />
            <Text style={styles.freeDelivery}>Free</Text>
          </View>
        </View>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="archive" size={20} color="#878787" />
          <Text style={styles.actionText}>Save for later</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onRemove(productId)}
        >
          <MaterialIcons name="delete" size={20} color="#878787" />
          <Text style={styles.actionText}>Remove</Text>
        </TouchableOpacity>
        <View style={styles.qtyEditButton}>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onUpdateQuantity(productId, quantity - 1); }} style={styles.qtyBtn}>
            <MaterialIcons name="remove" size={16} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onUpdateQuantity(productId, quantity + 1); }} style={styles.qtyBtn}>
            <MaterialIcons name="add" size={16} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- Component: Grocery Cart View ---
const GroceryCartView = ({ items, updateQuantity, basketTotal }: any) => {
  return (
    <View style={styles.listContent}>
      {/* Delivery Banner */}
      <View style={styles.deliveryBanner}>
        <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#15803d" />
        <View style={styles.deliveryTextContainer}>
          <Text style={styles.deliveryTitle}>Delivery in 15 mins</Text>
          <Text style={styles.deliverySubtitle}>Shipment of {items.length} items</Text>
        </View>
      </View>

      {/* Items List */}
      <View style={styles.itemsList}>
        {items.map((item: any, index: number) => {
          const product = item.productId as any;
          const price = product.price || 0;
          const originalPrice = product.mrp || (price * 1.2);
          const pid = product._id || product;

          return (
            <View key={pid || `item-${index}`} style={styles.groceryItemCard}>
              {/* Image */}
              <View style={styles.groceryImageContainer}>
                <Image source={{ uri: product.image || product.primaryImage }} style={styles.productImage} resizeMode="contain" />
              </View>

              {/* Info */}
              <View style={styles.groceryItemInfo}>
                <Text style={styles.groceryItemTitle} numberOfLines={2}>{product.title}</Text>
                <Text style={styles.groceryItemWeight}>{product.netWeight || '1 pc'}</Text>

                <View style={styles.groceryPriceRow}>
                  <Text style={styles.groceryCurrentPrice}>₹{price}</Text>
                  <Text style={styles.groceryOriginalPrice}>₹{Math.round(originalPrice)}</Text>
                </View>
              </View>

              {/* Quantity Control */}
              <View style={styles.groceryQuantityControl}>
                <TouchableOpacity
                  style={styles.groceryQtyBtn}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQuantity(pid, item.quantity - 1); }}
                >
                  <Text style={styles.groceryQtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.groceryQtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.groceryQtyBtn}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQuantity(pid, item.quantity + 1); }}
                >
                  <Text style={styles.groceryQtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Bill Details */}
      <View style={styles.billSection}>
        <Text style={styles.sectionTitle}>Bill Details</Text>

        <View style={styles.billRow}>
          <View style={styles.billRowLeft}>
            <MaterialIcons name="receipt-long" size={16} color="#6B7280" />
            <Text style={styles.billLabel}>Item Total</Text>
          </View>
          <Text style={styles.billValue}>₹{basketTotal}</Text>
        </View>

        <View style={styles.billRow}>
          <View style={styles.billRowLeft}>
            <MaterialIcons name="delivery-dining" size={16} color="#6B7280" />
            <Text style={styles.billLabel}>Delivery Fee</Text>
          </View>
          <Text style={[styles.billValue, { color: '#15803d' }]}>Free</Text>
        </View>

        <View style={styles.billRow}>
          <View style={styles.billRowLeft}>
            <MaterialIcons name="shopping-bag" size={16} color="#6B7280" />
            <Text style={styles.billLabel}>Handling Charge</Text>
          </View>
          <Text style={styles.billValue}>₹2</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>To Pay</Text>
          <Text style={styles.totalValue}>₹{basketTotal + 2}</Text>
        </View>
      </View>

      {/* Savings Banner */}
      <View style={styles.savingsBanner}>
        <MaterialIcons name="local-offer" size={18} color="#155E75" />
        <Text style={styles.savingsText}>You saved ₹{Math.round(basketTotal * 0.2)} on this order!</Text>
      </View>

      {/* Safe Area padding for footer */}
      <View style={{ height: 100 }} />
    </View>
  );
};


export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuth();

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
    });
  };

  // --- Render ---

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.contentBackground}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]} // Stick ONLY the tabs (Index 1)
        >
          {/* Index 0: Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {activeTab === 'shopping' ? 'My Cart' : `My Basket (${count} Items)`}
            </Text>
          </View>

          {/* Index 1: Sticky Tabs */}
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

          {/* Index 2: Address Bar */}
          <AddressBar />

          {/* Index 3: Content Items */}
          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#2874F0" />
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyContainer}>
              {/* Dynamic Empty State Image based on tab */}
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
          ) : (
            activeTab === 'shopping' ? (
              <View style={styles.listContent}>
                {items.map((item, index) => {
                  const pid = typeof item.productId === 'string' ? item.productId : item.productId?._id;
                  const key = (pid || 'item') + `_${index}`;
                  return (
                    <CartItem
                      key={key}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemove}
                    />
                  );
                })}

                {/* Price Details Block (Shopping) */}
                <View style={styles.priceDetailsContainer}>
                  <Text style={styles.priceHeader}>Price Details</Text>
                  <View style={styles.detailsRow}>
                    <Text style={styles.priceLabel}>Price ({count} items)</Text>
                    <Text style={styles.priceValue}>₹{(Math.round(total * 1.05)).toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.priceLabel}>Discount</Text>
                    <Text style={styles.discountValue}>-₹{(Math.round(total * 0.05)).toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.priceLabel}>Delivery Charges</Text>
                    <Text style={[styles.discountValue, { color: '#388E3C' }]}>FREE</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
                  </View>
                  <Text style={styles.savingsText}>You will save ₹{(Math.round(total * 0.05)).toLocaleString()} on this order</Text>
                </View>
                <View style={{ height: 80 }} />
              </View>
            ) : (
              // Grocery View
              <GroceryCartView
                items={items}
                updateQuantity={handleUpdateQuantity}
                basketTotal={total}
              />
            )
          )}
        </ScrollView>
      </View>

      {/* Footer Logic (Dynamic based on Tab) */}
      {items.length > 0 && (
        activeTab === 'shopping' ? (
          <View style={styles.footer}>
            <View style={styles.footerTotal}>
              <Text style={styles.footerOldPrice}>₹{(Math.round(total * 1.05)).toLocaleString()}</Text>
              <Text style={styles.footerCurrentPrice}>₹{total.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.placeOrderBtn} onPress={handleCheckout}>
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Grocery Footer
          <View style={styles.checkoutBar}>
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
