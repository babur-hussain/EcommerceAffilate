"use client";


import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

import Footer from "@/components/footer/Footer";
import { getStoredAffiliateCode, clearStoredAffiliateCode } from "@/hooks/useAffiliateTracking";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Razorpay script loader
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
  brand?: string;
  deliveryEstimate?: string;
}

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: Product;
}

interface Address {
  _id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

// Helper to calculate max delivery time from cart items
function calculateOrderDelivery(items: CartItemWithProduct[]): string {
  console.log("🚚 Calculating Delivery for items:", items.length);

  if (!items || items.length === 0) {
    console.log("🚚 No items, returning default: 10-15 mins");
    return "10-15 mins";
  }

  let maxMinutes = 0;
  let worstCaseString = "10-15 mins";

  for (const item of items) {
    const rawEstimate = item.product.deliveryEstimate;
    console.log(`🚚 Item: ${item.product.title}, Estimate: ${rawEstimate}`);

    const estimate = rawEstimate?.toLowerCase();
    if (!estimate) continue;

    // Normalize to upper bound minutes
    let minutes = 0;

    // Check for "days"
    if (estimate.includes("day")) {
      const parts = estimate.match(/(\d+)/g);
      // If "2-3 days", take 3. If "1 day", take 1.
      const days = parts ? parseInt(parts[parts.length - 1]) : 1;
      minutes = days * 24 * 60;
    } else if (estimate.includes("hour") || estimate.includes("hr")) {
      const parts = estimate.match(/(\d+)/g);
      const hours = parts ? parseInt(parts[parts.length - 1]) : 1;
      minutes = hours * 60;
    } else {
      // Assume minutes (e.g. "10-15 mins", "45 mins")
      const parts = estimate.match(/(\d+)/g);
      if (parts) {
        minutes = parseInt(parts[parts.length - 1]);
      }
    }

    console.log(`🚚 Parsed minutes: ${minutes}`);

    if (minutes > 0 && minutes > maxMinutes) {
      maxMinutes = minutes;
      worstCaseString = rawEstimate || "10-15 mins";
    }
  }

  console.log(`🚚 Final Max Minutes: ${maxMinutes}, Result: ${worstCaseString}`);
  // If we found a valid estimate (non-zero), use it.
  // Otherwise default to 10-15 mins.
  return maxMinutes > 0 ? worstCaseString : "10-15 mins";
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    backendUser,
    loading: authLoading,
    idToken,
    refreshToken,
  } = useAuth();
  const { cart, refreshCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("RAZORPAY");
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormLoading, setAddressFormLoading] = useState(false);
  const [addressFormError, setAddressFormError] = useState<string | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!backendUser || !idToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch cart and addresses in parallel
        const [cartRes, addressesRes] = await Promise.all([
          fetch(`${API_BASE}/cart`, {
            headers: { Authorization: `Bearer ${idToken}` },
          }),
          fetch(`${API_BASE}/addresses`, {
            headers: { Authorization: `Bearer ${idToken}` },
          }),
        ]);

        if (!cartRes.ok) throw new Error("Failed to load cart");

        const cartData = await cartRes.json();
        const addressesData = addressesRes.ok ? await addressesRes.json() : [];

        console.log('📦 Checkout - Cart data from backend:', cartData);

        // Backend returns populated products, so we just need to transform the data
        if (cartData?.items && cartData.items.length > 0) {
          const transformedItems: CartItemWithProduct[] = cartData.items
            .map((item: any): CartItemWithProduct | null => {
              // Check if productId is populated (object) or just an ID (string)
              const product = typeof item.productId === 'object' ? item.productId : null;

              if (!product) {
                console.warn('Product not populated for item:', item);
                return null;
              }

              // Transform to match our interface
              return {
                productId: product._id,
                quantity: item.quantity,
                product: {
                  _id: product._id,
                  title: product.title,
                  price: product.price,
                  image: product.primaryImage || product.image, // Handle both cases
                  stock: product.stock,
                  description: product.description,
                  brand: product.brand,
                  deliveryEstimate: product.deliveryEstimate,
                },
              };
            })
            .filter((item: CartItemWithProduct | null): item is CartItemWithProduct => item !== null);

          console.log('📦 Checkout - Transformed cart items:', transformedItems);
          setCartItems(transformedItems);
        }

        setAddresses(addressesData);

        // Auto-select default address
        const defaultAddress = addressesData.find(
          (addr: Address) => addr.isDefault
        );
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        } else if (addressesData.length > 0) {
          setSelectedAddressId(addressesData[0]._id);
        }
      } catch (err) {
        console.error("Error loading checkout data:", err);
        setOrderError("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUser, idToken]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderAmount: subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        setCouponError(data.error || "Invalid coupon code");
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon({
        code: data.code,
        discount: data.discount,
      });
      setCouponError(null);
    } catch (err) {
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  // Address Form Handlers
  const resetAddressForm = () => {
    setAddressForm({
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false,
    });
    setEditingAddressId(null);
    setAddressFormError(null);
  };

  const handleOpenAddressForm = (address?: Address) => {
    if (address) {
      setEditingAddressId(address._id);
      setAddressForm({
        name: address.name,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        isDefault: address.isDefault,
      });
    } else {
      resetAddressForm();
    }
    setShowAddressForm(true);
  };

  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    resetAddressForm();
  };

  const handleAddressFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Fetch user's current location and reverse geocode it
  const handleFetchLocation = async () => {
    if (!navigator.geolocation) {
      setAddressFormError("Geolocation is not supported by your browser");
      return;
    }

    setFetchingLocation(true);
    setAddressFormError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 0,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // Use OpenStreetMap Nominatim for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch address details");

      const data = await response.json();
      const address = data.address || {};

      // Better address parsing - try multiple levels of detail
      const addressLine1 =
        [
          address.house_number,
          address.house,
          address.building,
          address.road,
          address.street,
        ]
          .filter(Boolean)
          .join(", ") ||
        [address.suburb, address.neighbourhood].filter(Boolean).join(", ") ||
        address.amenity ||
        data.display_name?.split(",")[0] || // Use the first part of display_name as fallback
        "Location";

      const city =
        address.city ||
        address.town ||
        address.municipality ||
        address.village ||
        address.county ||
        "";

      const state = address.state || address.province || address.region || "";

      const pincode = address.postcode || address.postal_code || "";

      // Additional address line with suburb or neighbourhood
      let addressLine2 = addressForm.addressLine2;
      if (address.suburb) {
        addressLine2 = address.suburb;
      } else if (address.neighbourhood) {
        addressLine2 = address.neighbourhood;
      }

      // Update form with fetched data
      setAddressForm((prev) => ({
        ...prev,
        addressLine1:
          addressLine1 !== "Location" ? addressLine1 : prev.addressLine1,
        city: city || prev.city,
        state: state || prev.state,
        pincode: pincode || prev.pincode,
        addressLine2,
      }));

      setAddressFormError(null);
    } catch (err: any) {
      console.error("Location fetch error:", err);

      // Handle GeolocationPositionError
      if (err?.code !== undefined) {
        if (err.code === 1) {
          setAddressFormError(
            "Location permission denied. Please enable location access in your browser settings."
          );
        } else if (err.code === 2) {
          setAddressFormError(
            "Unable to retrieve your location. Please try again or enter manually."
          );
        } else if (err.code === 3) {
          setAddressFormError(
            "Location request timed out. Please check your connection and try again."
          );
        } else {
          setAddressFormError("Failed to get location. Please enter manually.");
        }
      } else if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          setAddressFormError(
            "Network error. Please check your internet connection."
          );
        } else {
          setAddressFormError(
            err.message || "Failed to fetch location. Please enter manually."
          );
        }
      } else {
        setAddressFormError(
          "Failed to fetch location. Please enter address manually."
        );
      }
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressFormLoading(true);
    setAddressFormError(null);

    // Validation
    if (
      !addressForm.name.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.addressLine1.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.pincode.trim()
    ) {
      setAddressFormError("Please fill in all required fields");
      setAddressFormLoading(false);
      return;
    }

    try {
      // Get fresh token before making request
      let token = idToken;
      if (!token) {
        token = await refreshToken();
      }

      if (!token) {
        setAddressFormError("Session expired. Please login again.");
        setAddressFormLoading(false);
        setTimeout(() => {
          window.location.href = "/login?redirect=/checkout";
        }, 2000);
        return;
      }

      const url = editingAddressId
        ? `${API_BASE}/addresses/${editingAddressId}`
        : `${API_BASE}/addresses`;

      const res = await fetch(url, {
        method: editingAddressId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle unauthorized - try to refresh token and retry once
        if (res.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            // Retry with new token
            const retryRes = await fetch(url, {
              method: editingAddressId ? "PUT" : "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${newToken}`,
              },
              body: JSON.stringify(addressForm),
            });

            const retryData = await retryRes.json();

            if (retryRes.ok) {
              // Success on retry
              if (editingAddressId) {
                setAddresses((prev) =>
                  prev.map((addr) =>
                    addr._id === editingAddressId ? retryData : addr
                  )
                );
              } else {
                setAddresses((prev) => [...prev, retryData]);
                setSelectedAddressId(retryData._id);
              }
              if (addressForm.isDefault) {
                setAddresses((prev) =>
                  prev.map((addr) => ({
                    ...addr,
                    isDefault: addr._id === (editingAddressId || retryData._id),
                  }))
                );
              }
              handleCloseAddressForm();
              return;
            }
          }

          setAddressFormError("Session expired. Please login again.");
          setTimeout(() => {
            window.location.href = "/login?redirect=/checkout";
          }, 2000);
          return;
        }
        setAddressFormError(data.error || "Failed to save address");
        return;
      }

      // Update local addresses state
      if (editingAddressId) {
        setAddresses((prev) =>
          prev.map((addr) => (addr._id === editingAddressId ? data : addr))
        );
      } else {
        setAddresses((prev) => [...prev, data]);
        // Auto-select the newly added address
        setSelectedAddressId(data._id);
      }

      // If this address is set as default, update other addresses
      if (addressForm.isDefault) {
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr._id === (editingAddressId || data._id),
          }))
        );
      }

      handleCloseAddressForm();
    } catch (err) {
      setAddressFormError("Failed to save address. Please try again.");
    } finally {
      setAddressFormLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`${API_BASE}/addresses/${addressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (res.ok) {
        setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
        if (selectedAddressId === addressId) {
          const remaining = addresses.filter((addr) => addr._id !== addressId);
          setSelectedAddressId(remaining.length > 0 ? remaining[0]._id : "");
        }
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setOrderError("Please select a delivery address");
      return;
    }
    if (!selectedPaymentMethod) {
      setOrderError("Please select a payment method");
      return;
    }
    setOrderLoading(true);
    setOrderError(null);
    try {
      const orderPayload: any = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        addressId: selectedAddressId,
      };
      if (appliedCoupon) {
        orderPayload.couponCode = appliedCoupon.code;
      }

      // Add influencer/affiliate code if customer came via affiliate link
      const affiliateCode = getStoredAffiliateCode();
      if (affiliateCode) {
        orderPayload.influencerCode = affiliateCode;
        console.log("🔗 Including affiliate code in order:", affiliateCode);
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (!res.ok || !data?._id) {
        setOrderError(data?.error || "Failed to place order");
        return;
      }
      // Create payment order
      const payRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          orderId: data._id,
          provider: selectedPaymentMethod,
        }),
      });
      const payData = await payRes.json();
      if (!payRes.ok || !payData?.paymentOrderId) {
        setOrderError(payData?.error || "Failed to initiate payment");
        return;
      }
      if (selectedPaymentMethod === "RAZORPAY") {
        // Load Razorpay script
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setOrderError("Failed to load Razorpay. Try again later.");
          return;
        }
        const options = {
          key: payData.key_id,
          amount: payData.paymentOrderData.amount,
          currency: payData.currency,
          name: payData.name,
          description: payData.description,
          order_id: payData.paymentOrderId,
          handler: async function (response: any) {
            // Call backend webhook to verify payment
            const verifyRes = await fetch("/api/payments/webhook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            await refreshCart();
            clearStoredAffiliateCode(); // Clear affiliate code after successful order
            router.push(`/payment/success?orderId=${data._id}`);
          },
          prefill: {
            name: backendUser?.name,
            email: backendUser?.email,
            contact: backendUser?.phone,
          },
          theme: { color: "#6366f1" },
        };
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // For other payment methods, mock success
        await refreshCart();
        clearStoredAffiliateCode(); // Clear affiliate code after successful order
        router.push(`/payment/success?orderId=${data._id}`);
      }
    } catch (err) {
      setOrderError("Failed to place order. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18; // 18% GST
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal + shippingFee + tax - discount;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-surface-light flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!backendUser) {
    // Redirect logic handles this, but render fallback
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">shopping_bag</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 font-display">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add items to start your premium shopping experience.</p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light font-display transition-colors duration-300 pb-20">
      <main className="max-w-[1280px] mx-auto w-full px-6 lg:px-10 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left Column: Main Content (70%) */}
          <div className="flex-1 lg:w-[70%]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Checkout</h2>
              <span className="text-gray-500 text-sm font-medium">{cartItems.length} Items</span>
            </div>

            {/* Rapid Delivery Banner */}
            <div className="bg-[#F8FFF9] dark:bg-[#122415] border border-green-500/20 rounded-xl p-5 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full pulse-glow"></div>
                </div>
                <div>
                  <h3 className="font-bold text-[#1a3a1f] dark:text-[#a3cfab]">Delivering in {calculateOrderDelivery(cartItems)}</h3>
                  <p className="text-sm text-[#3a5a3f] dark:text-[#7ba983]">Your items are ready for rapid dispatch.</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-green-500">bolt</span>
            </div>

            {/* Checkout Steps Accordion */}
            <div className="space-y-6">

              {/* Step 1: Delivery Address */}
              <div className={`group bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-300 rounded-xl overflow-hidden border ${currentStep === 1 ? 'border-primary ring-1 ring-primary/20' : 'border-gray-50'}`}>
                <div
                  className={`px-6 py-4 flex items-center justify-between cursor-pointer ${currentStep === 1 ? 'bg-primary/5' : 'bg-white'}`}
                  onClick={() => setCurrentStep(1)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${currentStep > 1 || selectedAddressId ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {currentStep > 1 || selectedAddressId ? '✓' : '1'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Delivery Address</h3>
                      {selectedAddressId && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {addresses.find(a => a._id === selectedAddressId)?.addressLine1}, {addresses.find(a => a._id === selectedAddressId)?.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">
                    {currentStep === 1 ? 'expand_less' : 'expand_more'}
                  </span>
                </div>

                {currentStep === 1 && (
                  <div className="p-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    {/* Address Selection Logic from original component */}
                    {showAddressForm ? (
                      <form onSubmit={handleSaveAddress} className="space-y-4">
                        {/* ... Address Form Fields ... (Simplified for this view, using same handler) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="name"
                            value={addressForm.name}
                            onChange={handleAddressFormChange}
                            placeholder="Full Name"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                            required
                          />
                          <input
                            type="tel"
                            name="phone"
                            value={addressForm.phone}
                            onChange={handleAddressFormChange}
                            placeholder="Phone Number"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                            required
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            name="addressLine1"
                            value={addressForm.addressLine1}
                            onChange={handleAddressFormChange}
                            placeholder="Address Line 1"
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={handleFetchLocation}
                            disabled={fetchingLocation}
                            className="px-4 py-3 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition whitespace-nowrap"
                          >
                            {fetchingLocation ? '...' : '📍 Locate Me'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <input type="text" name="city" value={addressForm.city} onChange={handleAddressFormChange} placeholder="City" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" required />
                          <input type="text" name="state" value={addressForm.state} onChange={handleAddressFormChange} placeholder="State" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" required />
                          <input type="text" name="pincode" value={addressForm.pincode} onChange={handleAddressFormChange} placeholder="Pincode" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" required />
                          <input type="text" name="country" value={addressForm.country} onChange={handleAddressFormChange} placeholder="Country" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" disabled />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button type="button" onClick={handleCloseAddressForm} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Cancel</button>
                          <button type="submit" disabled={addressFormLoading} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                            {addressFormLoading ? 'Saving...' : 'Save Address'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        {addresses.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No addresses found.</p>
                            <button onClick={() => handleOpenAddressForm()} className="px-6 py-2 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20">+ Add New Address</button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {addresses.map((address) => (
                              <div
                                key={address._id}
                                onClick={() => setSelectedAddressId(address._id)}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-4 ${selectedAddressId === address._id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'}`}
                              >
                                <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${selectedAddressId === address._id ? 'border-primary' : 'border-gray-300'}`}>
                                  {selectedAddressId === address._id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900">{address.name} <span className="text-xs font-normal text-gray-500 ml-2">{address.phone}</span></h4>
                                  <p className="text-sm text-gray-600 mt-1">{address.addressLine1}, {address.city}, {address.state} - {address.pincode}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleOpenAddressForm(address); }} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-primary">
                                  <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                              </div>
                            ))}
                            <button onClick={() => handleOpenAddressForm()} className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 font-bold rounded-xl hover:border-primary/50 hover:text-primary transition">+ Add Another Address</button>
                          </div>
                        )}

                        {selectedAddressId && (
                          <div className="pt-4 flex justify-end">
                            <button onClick={() => setCurrentStep(2)} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all">
                              Continue to Payment
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 2: Payment Method */}
              <div className={`group bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-300 rounded-xl overflow-hidden border ${currentStep === 2 ? 'border-primary ring-1 ring-primary/20' : 'border-gray-50'}`}>
                <div
                  className={`px-6 py-4 flex items-center justify-between cursor-pointer ${currentStep === 2 ? 'bg-primary/5' : 'bg-white'} ${!selectedAddressId ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => selectedAddressId && setCurrentStep(2)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${currentStep > 2 || (selectedPaymentMethod && currentStep === 3) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {currentStep > 2 || (selectedPaymentMethod && currentStep === 3) ? '✓' : '2'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Payment Method</h3>
                      {selectedPaymentMethod && (
                        <p className="text-sm text-gray-500">
                          {selectedPaymentMethod === "RAZORPAY" ? "Online Payment" : selectedPaymentMethod}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">
                    {currentStep === 2 ? 'expand_less' : 'expand_more'}
                  </span>
                </div>

                {currentStep === 2 && (
                  <div className="p-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "RAZORPAY", label: "Pay Online", sub: "Card, UPI, Netbanking", icon: "credit_card" },
                        { value: "COD", label: "Cash on Delivery", sub: "Pay at doorstep", icon: "payments" }
                      ].map((method) => (
                        <div
                          key={method.value}
                          onClick={() => setSelectedPaymentMethod(method.value)}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${selectedPaymentMethod === method.value ? 'border-primary bg-primary/5' : 'border-gray-100'}`}
                        >
                          {selectedPaymentMethod === method.value && <div className="absolute top-3 right-3 text-primary"><span className="material-symbols-outlined">check_circle</span></div>}
                          <span className="material-symbols-outlined text-3xl mb-3 text-gray-700">{method.icon}</span>
                          <h4 className="font-bold text-gray-900">{method.label}</h4>
                          <p className="text-xs text-gray-500">{method.sub}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 flex justify-end">
                      <button onClick={() => setCurrentStep(3)} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all">
                        Continue to Review
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Review & Items (Rendered as Cart List) */}
              <div className={`group bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-300 rounded-xl overflow-hidden border ${currentStep === 3 ? 'border-primary ring-1 ring-primary/20' : 'border-gray-50'}`}>
                <div
                  className={`px-6 py-4 flex items-center justify-between cursor-pointer ${currentStep === 3 ? 'bg-primary/5' : 'bg-white'} ${!selectedPaymentMethod ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => selectedPaymentMethod && setCurrentStep(3)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${currentStep === 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Review Items</h3>
                      <p className="text-sm text-gray-500">Verify your cart selection</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">
                    {currentStep === 3 ? 'expand_less' : 'expand_more'}
                  </span>
                </div>

                {currentStep === 3 && (
                  <div className="p-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200 space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex gap-6 group/item">
                        <div className="size-24 md:size-32 rounded-lg bg-gray-50 shrink-0 border border-gray-100 relative overflow-hidden">
                          <Image src={item.product.image} alt={item.product.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">{item.product.brand || "Luxe"}</p>
                              <h4 className="text-lg md:text-xl font-semibold text-gray-900 line-clamp-1">{item.product.title}</h4>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.product.description}</p>
                            </div>
                            <p className="text-lg md:text-xl font-bold bg-gray-50 px-2 py-1 rounded-lg">₹{item.product.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-6">
                              {/* We rely on Cart context to handle quantity updates, adding rudimentary controls here is complex without exposing updateCartItem directly, sticking to ready-only review for stability or adding update logic if context allows */}
                              <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-bold text-gray-700">
                                Qty: {item.quantity}
                              </div>
                            </div>
                            {/* Remove button could go here */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Recommendations Section */}
            <section className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold tracking-tight">People also bought</h3>
                <div className="flex gap-2">
                  <button className="size-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                  <button className="size-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8">
                {/* Mock Recommendations */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="min-w-[200px] bg-white border border-gray-100 rounded-xl p-3 hover:shadow-lg transition-all cursor-pointer">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>
                    <h4 className="font-bold text-sm mb-1">Premium Item {i}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">₹{(i * 500).toLocaleString()}</span>
                      <button className="size-6 bg-primary text-white rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-[12px]">add</span></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Order Summary (30%) - Sticky */}
          <div className="lg:w-[30%]">
            <div className="sticky top-8 bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-2xl shadow-primary/5 border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider">
                  <span className="text-primary">Free delivery reached!</span>
                  <span className="text-gray-400">100%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-linear-to-r from-primary to-blue-400 h-full w-full rounded-full"></div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-green-500">FREE</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (18%)</span>
                  <span className="font-medium text-gray-900">₹{tax.toLocaleString()}</span>
                </div>
                {/* Coupon Input Block */}
                <div className="pt-2 pb-2">
                  {appliedCoupon ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-green-700 font-bold text-sm">Coupon Applied</span>
                      <button onClick={handleRemoveCoupon} className="text-red-500 text-xs font-bold hover:underline">REMOVE</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Promo Code"
                        className="flex-1 bg-gray-50 border-none rounded-lg text-sm px-3 py-2 focus:ring-1 focus:ring-primary"
                      />
                      <button onClick={handleApplyCoupon} className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">APPLY</button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-bold text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading || !selectedAddressId || !selectedPaymentMethod}
                className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderLoading ? (
                  <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-b-transparent rounded-full animate-spin"></div> Processing...</span>
                ) : (
                  <>Proceed to Checkout <span className="material-symbols-outlined">arrow_forward</span></>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 cursor-help">
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-2">Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
