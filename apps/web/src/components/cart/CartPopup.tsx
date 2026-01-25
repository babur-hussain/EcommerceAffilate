"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

// Helper to format price
const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
};

export default function CartPopup({ onClose }: { onClose: () => void }) {
    const { cart, removeFromCart } = useCart();
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        if (cart?.items) {
            setItems(cart.items);
        }
    }, [cart]);

    if (!items || items.length === 0) {
        return (
            <div className="fixed inset-x-0 bottom-0 md:absolute md:top-full md:right-0 md:bottom-auto md:inset-x-auto mt-0 md:mt-3 w-full md:w-80 bg-white rounded-t-2xl md:rounded-2xl shadow-xl ring-1 ring-slate-900/5 py-6 px-4 z-50 origin-bottom md:origin-top-right animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200 text-center max-h-[80vh] md:max-h-none">
                <div className="mx-auto size-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-3xl text-slate-300">shopping_cart_off</span>
                </div>
                <p className="text-slate-900 font-semibold">Your cart is empty</p>
                <p className="text-sm text-slate-500 mt-1 mb-4">Add items to start shopping</p>
                <Link
                    href="/"
                    onClick={onClose}
                    className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary/90 transition-colors w-full"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    const subtotal = items.reduce((sum, item) => {
        return sum + (item.productId?.price || 0) * item.quantity;
    }, 0);

    return (
        <div className="fixed inset-x-0 bottom-0 md:absolute md:top-full md:right-0 md:bottom-auto md:inset-x-auto mt-0 md:mt-3 w-full md:w-96 bg-white rounded-t-2xl md:rounded-2xl shadow-xl ring-1 ring-slate-900/5 z-50 origin-bottom md:origin-top-right animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200 overflow-hidden max-h-[85vh] md:max-h-none">
            {/* Header */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Shopping Cart ({items.length})</h3>
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    {formatPrice(subtotal)}
                </span>
            </div>

            {/* Items List - Max 3 items */}
            <div className="py-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex gap-3 px-4 sm:px-5 py-3 hover:bg-slate-50 transition-colors group relative">
                        {/* Image */}
                        <div className="shrink-0 size-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                            {item.productId?.image ? (
                                <img
                                    src={item.productId.image}
                                    alt={item.productId.title}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="size-full flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-xl">image</span>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-sm font-medium text-slate-900 truncate">
                                {item.productId?.title || "Product"}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                                <span className="text-xs text-slate-300">•</span>
                                <span className="text-xs font-bold text-slate-700">
                                    {formatPrice(item.productId?.price || 0)}
                                </span>
                            </div>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (item.productId?._id) removeFromCart(item.productId._id);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-full border border-slate-200 hover:border-red-100 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                ))}
                {items.length > 3 && (
                    <div className="px-5 py-2 text-center border-t border-slate-50/50">
                        <span className="text-xs text-slate-500 font-medium">
                            +{items.length - 3} more items
                        </span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-50 bg-slate-50/30 space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500 font-medium">Subtotal</span>
                    <span className="text-lg font-bold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href="/cart"
                        onClick={onClose}
                        className="flex items-center justify-center px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                        View Cart
                    </Link>
                    <Link
                        href="/checkout"
                        onClick={onClose}
                        className="flex items-center justify-center px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                        Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
