'use client';

import React from 'react';

interface Fee {
    name: string;
    amount: number;
}

interface FeesManagerProps {
    fees: Fee[];
    onChange: (fees: Fee[]) => void;
}

export default function FeesManager({ fees, onChange }: FeesManagerProps) {
    const addFee = () => {
        onChange([...fees, { name: '', amount: 0 }]);
    };

    const removeFee = (index: number) => {
        onChange(fees.filter((_, i) => i !== index));
    };

    const updateFee = (index: number, field: keyof Fee, value: string | number) => {
        const newFees = [...fees];
        if (field === 'amount') {
            newFees[index][field] = typeof value === 'number' ? value : parseFloat(value) || 0;
        } else {
            newFees[index][field] = value as string;
        }
        onChange(newFees);
    };

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Additional Fees
                </label>
                <button
                    type="button"
                    onClick={addFee}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + Add Fee
                </button>
            </div>

            {fees.length > 0 && (
                <div className="space-y-3">
                    {fees.map((fee, index) => (
                        <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Fee name (e.g., Protect Promise Fee, Handling Fee, Platform Fee)"
                                    value={fee.name}
                                    onChange={(e) => updateFee(index, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 bg-white"
                                />
                            </div>
                            <div className="w-32">
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={fee.amount}
                                    onChange={(e) => updateFee(index, 'amount', e.target.value)}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFee(index)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                                title="Remove fee"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {fees.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                    No additional fees added. Click "Add Fee" to add fees like Protect Promise Fee, Handling Fee, Platform Fee, etc.
                </p>
            )}
        </div>
    );
}
