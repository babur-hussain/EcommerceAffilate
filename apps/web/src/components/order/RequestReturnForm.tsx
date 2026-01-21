"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrderItem {
    _id: string; // This is the order item subdocument ID usually, or we track by product ID? 
    // The backend model uses { productId, quantity, ... }. 
    // ReturnRequest expects items: [{ productId, quantity, reason, condition }]
    productId: {
        _id: string;
        title: string;
        images: string[];
        price: number;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    createdAt: string;
}

// Reasons matching backend enum roughly or defined list
const RETURN_REASONS = [
    "Defective",
    "Wrong Item",
    "Not as Described",
    "Size/Fit Issue",
    "Damaged in Shipping",
    "Other"
];

const ITEM_CONDITIONS = [
    "New",
    "Opened",
    "Damaged"
];

export default function RequestReturnForm({ order, apiBase, token }: { order: Order, apiBase: string, token: string }) {
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [reasons, setReasons] = useState<Record<string, string>>({});
    const [conditions, setConditions] = useState<Record<string, string>>({});
    const [customerNote, setCustomerNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const toggleItem = (productId: string, maxQty: number) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
            // Cleanup state
            const newQty = { ...quantities };
            delete newQty[productId];
            setQuantities(newQty);
        } else {
            newSelected.add(productId);
            setQuantities({ ...quantities, [productId]: 1 }); // Default to 1
            setReasons({ ...reasons, [productId]: RETURN_REASONS[0] });
            setConditions({ ...conditions, [productId]: ITEM_CONDITIONS[0] });
        }
        setSelectedItems(newSelected);
    };

    const updateQuantity = (productId: string, qty: number, max: number) => {
        if (qty < 1) qty = 1;
        if (qty > max) qty = max;
        setQuantities({ ...quantities, [productId]: qty });
    };

    const updateReason = (productId: string, val: string) => {
        setReasons({ ...reasons, [productId]: val });
    };

    const updateCondition = (productId: string, val: string) => {
        setConditions({ ...conditions, [productId]: val });
    };

    const handleSubmit = async () => {
        if (selectedItems.size === 0) {
            setError("Please select at least one item to return.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const items = Array.from(selectedItems).map(pid => ({
                productId: pid,
                quantity: quantities[pid] || 1,
                reason: reasons[pid] || "Other",
                condition: conditions[pid] || "New"
            }));

            const res = await fetch(`${apiBase}/returns`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: order._id,
                    items,
                    customerNote,
                    images: [] // TODO: Implement image upload
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to submit return request');
            }

            // Success
            router.push('/account/returns');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                    <span className="material-symbols-outlined filled">error</span>
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl border border-[#e8f0f2] shadow-sm">
                <h3 className="text-lg font-bold mb-6 text-neutral-900">Select Items to Return</h3>
                <div className="space-y-6">
                    {order.items.map((item) => {
                        const pid = item.productId._id;
                        const isSelected = selectedItems.has(pid);

                        return (
                            <div key={pid} className={`p-4 rounded-xl border transition-all ${isSelected ? 'border-[#22a8c3] bg-[#f0f9fa]' : 'border-[#e8f0f2] hover:border-[#b4dbe3]'}`}>
                                <div className="flex gap-4 items-start">
                                    <div className="pt-1">
                                        <div
                                            className={`size-6 rounded border cursor-pointer flex items-center justify-center transition-colors ${isSelected ? 'bg-[#22a8c3] border-[#22a8c3]' : 'bg-white border-neutral-300'}`}
                                            onClick={() => toggleItem(pid, item.quantity)}
                                        >
                                            {isSelected && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                        </div>
                                    </div>

                                    <div className="size-16 bg-white rounded-lg p-2 flex items-center justify-center border border-[#e8f0f2] shrink-0">
                                        {item.productId.images?.[0] ? (
                                            <img src={item.productId.images[0]} alt={item.productId.title} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="material-symbols-outlined text-neutral-300">image</span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-bold text-[#0f181a]">{item.productId.title}</p>
                                        <p className="text-sm text-[#538893]">Purchased Qty: {item.quantity} • ₹{item.price}</p>

                                        {isSelected && (
                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                                                <div>
                                                    <label className="block text-xs font-bold text-[#538893] mb-1">Return Qty</label>
                                                    <div className="flex items-center gap-3 bg-white border border-[#e8f0f2] rounded-lg px-3 py-2 w-max">
                                                        <button
                                                            onClick={() => updateQuantity(pid, (quantities[pid] || 1) - 1, item.quantity)}
                                                            className="text-[#538893] hover:text-[#22a8c3]"
                                                            disabled={(quantities[pid] || 1) <= 1}
                                                        >
                                                            <span className="material-symbols-outlined text-sm">remove</span>
                                                        </button>
                                                        <span className="font-bold w-4 text-center">{quantities[pid] || 1}</span>
                                                        <button
                                                            onClick={() => updateQuantity(pid, (quantities[pid] || 1) + 1, item.quantity)}
                                                            className="text-[#538893] hover:text-[#22a8c3]"
                                                            disabled={(quantities[pid] || 1) >= item.quantity}
                                                        >
                                                            <span className="material-symbols-outlined text-sm">add</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-[#538893] mb-1">Reason</label>
                                                    <select
                                                        className="w-full bg-white border border-[#e8f0f2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22a8c3]"
                                                        value={reasons[pid] || RETURN_REASONS[0]}
                                                        onChange={(e) => updateReason(pid, e.target.value)}
                                                    >
                                                        {RETURN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-[#538893] mb-1">Condition</label>
                                                    <select
                                                        className="w-full bg-white border border-[#e8f0f2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22a8c3]"
                                                        value={conditions[pid] || ITEM_CONDITIONS[0]}
                                                        onChange={(e) => updateCondition(pid, e.target.value)}
                                                    >
                                                        {ITEM_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#e8f0f2] shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-neutral-900">Additional Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-[#538893] mb-2">Comments (Optional)</label>
                        <textarea
                            className="w-full bg-[#f6f8f8] border border-[#e8f0f2] rounded-xl p-4 text-sm focus:outline-none focus:border-[#22a8c3] min-h-[100px]"
                            placeholder="Please provide any additional details about your return request..."
                            value={customerNote}
                            onChange={(e) => setCustomerNote(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-transparent border border-[#e8f0f2] text-[#538893] font-bold rounded-xl hover:bg-[#f6f8f8] transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedItems.size === 0}
                    className={`px-8 py-3 bg-[#22a8c3] text-white font-bold rounded-xl shadow-lg shadow-[#22a8c3]/30 transition-all flex items-center gap-2 ${isSubmitting || selectedItems.size === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1b8fa6] hover:translate-y-[-2px]'}`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    {!isSubmitting && <span className="material-symbols-outlined">send</span>}
                </button>
            </div>
        </div>
    );
}
