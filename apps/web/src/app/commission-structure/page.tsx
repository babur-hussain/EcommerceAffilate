
'use client';

import React, { useState } from 'react';
import { COMMISSIONS } from './data';

const CommissionPage = () => {
    // State to track expanded categories. Default to all closed or specifically open.
    // Using a set to allow multiple to be open, or just a string for one.
    // Let's allow multiple to be open for better UX.
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

    const toggleCategory = (index: number) => {
        setExpandedCategories(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
                        Commission Structure
                    </h1>
                    <p className="mt-4 text-lg text-neutral-600">
                        Category wise Platfrom Commision.
                    </p>
                </div>

                <div className="space-y-4">
                    {COMMISSIONS.map((category, index) => {
                        const isExpanded = expandedCategories.includes(index);
                        return (
                            <div key={index} className="bg-white overflow-hidden shadow-sm rounded-lg border border-neutral-200">
                                <button
                                    onClick={() => toggleCategory(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 transition-colors focus:outline-none"
                                >
                                    <h3 className="text-lg font-bold text-neutral-900 text-left">
                                        {category.name}
                                    </h3>
                                    <span className="shrink-0 ml-4">
                                        {isExpanded ? (
                                            <span className="material-symbols-outlined text-neutral-500">remove</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-neutral-500">add</span>
                                        )}
                                    </span>
                                </button>

                                {isExpanded && (
                                    <div className="px-6 py-6 border-t border-neutral-200 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {category.subCategories.length > 0 ? (
                                                category.subCategories.map((sub, subIndex) => (
                                                    <div
                                                        key={subIndex}
                                                        className="relative rounded-lg border border-neutral-100 bg-neutral-50/50 px-5 py-4 flex flex-col space-y-3 hover:border-neutral-200 transition-colors"
                                                    >
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-semibold text-neutral-900 mb-2">
                                                                {sub.name}
                                                            </h4>
                                                            <div className="text-sm text-neutral-600">
                                                                <ul className="space-y-2">
                                                                    {sub.rates.map((rate, rateIndex) => (
                                                                        <li key={rateIndex} className="flex justify-between items-start text-xs sm:text-sm">
                                                                            <span className="text-neutral-500 pr-2">{rate.range}</span>
                                                                            <span className="font-bold text-neutral-800 whitespace-nowrap">{rate.rate}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full text-center text-neutral-500 italic py-4">
                                                    No specific sub-categories.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CommissionPage;
