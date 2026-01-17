"use client";


import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Header from "@/components/header/Header";
import CategoryNav from "@/components/header/CategoryNav";
import Footer from "@/components/footer/Footer";

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
            .map((item: any) => {
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
                  title: product.name || product.title || 'Unknown Product',
                  price: product.price || 0,
                  image: product.images?.[0] || product.image || '/placeholder.png',
                  stock: product.stock || 0,
                  description: product.description,
                  brand: product.brand,
                },
              };
            })
            .filter((item): item is CartItemWithProduct => item !== null);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <CategoryNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!backendUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <CategoryNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Sign in to checkout
              </h2>
              <p className="text-gray-600 mb-8">
                Please sign in to complete your purchase securely.
              </p>
              <Link
                href="/login?redirect=/checkout"
                className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Sign In
              </Link>
              <Link
                href="/"
                className="block mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <CategoryNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Add items to your cart before proceeding to checkout.
              </p>
              <Link
                href="/"
                className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <CategoryNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-600">
            Complete your order in a few simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
              { step: 1, label: "Delivery Address", icon: "📍" },
              { step: 2, label: "Payment Method", icon: "💳" },
              { step: 3, label: "Review Order", icon: "✓" },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${currentStep >= item.step
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${currentStep >= item.step
                      ? "text-blue-600"
                      : "text-gray-500"
                      }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`h-1 flex-1 transition-all ${currentStep > item.step ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    style={{ marginTop: "-2rem" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between cursor-pointer"
                onClick={() => setCurrentStep(1)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h2 className="text-lg font-bold">Delivery Address</h2>
                    <p className="text-blue-100 text-sm">
                      {selectedAddressId
                        ? addresses.find((a) => a._id === selectedAddressId)
                          ?.name || "Selected"
                        : "Select delivery address"}
                    </p>
                  </div>
                </div>
                <button className="text-white hover:text-blue-100">
                  {currentStep === 1 ? "▲" : "▼"}
                </button>
              </div>

              {currentStep === 1 && (
                <div className="p-6">
                  {/* Address Form */}
                  {showAddressForm ? (
                    <form onSubmit={handleSaveAddress} className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          {editingAddressId
                            ? "Edit Address"
                            : "Add New Address"}
                        </h3>
                        <button
                          type="button"
                          onClick={handleCloseAddressForm}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {addressFormError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {addressFormError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={addressForm.name}
                            onChange={handleAddressFormChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={addressForm.phone}
                            onChange={handleAddressFormChange}
                            placeholder="9876543210"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Address Line 1{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleFetchLocation}
                            disabled={fetchingLocation}
                            className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Use your current location"
                          >
                            {fetchingLocation ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                Fetching...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                Use Location
                              </>
                            )}
                          </button>
                        </div>
                        <input
                          type="text"
                          name="addressLine1"
                          value={addressForm.addressLine1}
                          onChange={handleAddressFormChange}
                          placeholder="House No., Building, Street"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={addressForm.addressLine2}
                          onChange={handleAddressFormChange}
                          placeholder="Landmark, Area"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressFormChange}
                            placeholder="Mumbai"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={addressForm.state}
                            onChange={handleAddressFormChange}
                            placeholder="Maharashtra"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            PIN Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={addressForm.pincode}
                            onChange={handleAddressFormChange}
                            placeholder="400001"
                            maxLength={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          name="country"
                          value={addressForm.country}
                          onChange={handleAddressFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                        >
                          <option value="India">India</option>
                          <option value="USA">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isDefault"
                          id="isDefault"
                          checked={addressForm.isDefault}
                          onChange={handleAddressFormChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="isDefault"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Set as default address
                        </label>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCloseAddressForm}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={addressFormLoading}
                          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {addressFormLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              {editingAddressId
                                ? "Update Address"
                                : "Save Address"}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-4">
                        No addresses saved yet
                      </p>
                      <button
                        onClick={() => handleOpenAddressForm()}
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        + Add New Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`flex items-start p-4 border-2 rounded-xl transition-all ${selectedAddressId === address._id
                            ? "border-blue-600 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300"
                            }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={address._id}
                            checked={selectedAddressId === address._id}
                            onChange={() => setSelectedAddressId(address._id)}
                            className="mt-1 mr-4 w-5 h-5 text-blue-600 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-gray-900">
                                {address.name}
                              </span>
                              {address.isDefault && (
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm">
                              {address.addressLine1}
                              {address.addressLine2 &&
                                `, ${address.addressLine2}`}
                            </p>
                            <p className="text-gray-700 text-sm">
                              {address.city}, {address.state} -{" "}
                              {address.pincode}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              Phone: {address.phone}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleOpenAddressForm(address)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => handleOpenAddressForm()}
                        className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition"
                      >
                        <span className="text-2xl">+</span>
                        <span className="font-semibold">Add New Address</span>
                      </button>

                      {selectedAddressId && (
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition transform hover:scale-105"
                        >
                          Continue to Payment →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            {selectedAddressId && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setCurrentStep(2)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <h2 className="text-lg font-bold">Payment Method</h2>
                      <p className="text-green-100 text-sm">
                        {selectedPaymentMethod === "RAZORPAY"
                          ? "Razorpay (All Options)"
                          : selectedPaymentMethod}
                      </p>
                    </div>
                  </div>
                  <button className="text-white hover:text-green-100">
                    {currentStep === 2 ? "▲" : "▼"}
                  </button>
                </div>

                {currentStep === 2 && (
                  <div className="p-6 space-y-4">
                    {[
                      {
                        value: "RAZORPAY",
                        label: "Credit/Debit Card, UPI, Wallets",
                        icon: "💳",
                      },
                      { value: "COD", label: "Cash on Delivery", icon: "💵" },
                      {
                        value: "NET_BANKING",
                        label: "Net Banking",
                        icon: "🏦",
                      },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.value
                          ? "border-green-600 bg-green-50 shadow-md"
                          : "border-gray-200 hover:border-green-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.value}
                          checked={selectedPaymentMethod === method.value}
                          onChange={() =>
                            setSelectedPaymentMethod(method.value)
                          }
                          className="mr-4 w-5 h-5 text-green-600"
                        />
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <span className="font-semibold text-gray-900">
                          {method.label}
                        </span>
                      </label>
                    ))}

                    {selectedPaymentMethod && (
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition transform hover:scale-105"
                      >
                        Continue to Review →
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review Order */}
            {selectedAddressId && selectedPaymentMethod && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setCurrentStep(3)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <h2 className="text-lg font-bold">Review Your Order</h2>
                      <p className="text-purple-100 text-sm">
                        {cartItems.length} items in cart
                      </p>
                    </div>
                  </div>
                  <button className="text-white hover:text-purple-100">
                    {currentStep === 3 ? "▲" : "▼"}
                  </button>
                </div>

                {currentStep === 3 && (
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition"
                        >
                          <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product.image ? (
                              <Image
                                src={item.product.image}
                                alt={item.product.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                📦
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.product.title}
                            </h3>
                            {item.product.brand && (
                              <p className="text-xs text-gray-500 mb-1">
                                Brand: {item.product.brand}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </span>
                              <span className="font-bold text-blue-600">
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {orderError && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {orderError}
                      </div>
                    )}

                    <button
                      onClick={handlePlaceOrder}
                      disabled={orderLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {orderLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          🔒 Place Order Securely
                        </span>
                      )}
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Easy Returns</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Order Summary + Help (sticky together) */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4">
                  <h2 className="text-lg font-bold">Order Summary</h2>
                  <p className="text-orange-100 text-sm">
                    {cartItems.length} items
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Coupon Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>🎫</span> Apply Coupon
                    </h3>

                    {appliedCoupon ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-green-900">
                              {appliedCoupon.code}
                            </p>
                            <p className="text-sm text-green-700">
                              Saved ₹{appliedCoupon.discount.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              setCouponError(null);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponCode.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {couponLoading ? "..." : "Apply"}
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-xs text-red-600">{couponError}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-700">
                      <span>Shipping Fee</span>
                      <span className="font-semibold">
                        {shippingFee === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `₹{shippingFee.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-700">
                      <span>Tax (GST 18%)</span>
                      <span className="font-semibold">₹{tax.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span className="font-semibold">
                          -₹{discount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t-2">
                      <span>Total</span>
                      <span className="text-blue-600">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Savings Badge */}
                  {(shippingFee === 0 || discount > 0) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-green-800 font-semibold text-sm">
                        🎉 You're saving ₹{(shippingFee + discount).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="pt-4 border-t space-y-2">
                    {[
                      { icon: "🔒", text: "100% Secure Payment" },
                      { icon: "📦", text: "Fast & Free Delivery" },
                      { icon: "↩️", text: "Easy Returns & Refunds" },
                    ].map((badge, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <span>{badge.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <span>💬</span> Need Help?
                </h3>
                <p className="text-sm text-blue-800 mb-4">
                  Our customer support team is here to assist you with your
                  order.
                </p>
                <Link
                  href="/support"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
