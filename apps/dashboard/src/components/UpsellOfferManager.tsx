import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';

interface LastChanceOffer {
    title: string;
    description?: string;
    originalPrice: number;
    offerPrice: number;
    discountPercentage?: number;
    tag?: string;
    features: string[]; // Changed from optional to required for easy handling
    image?: string;
}

interface UpsellOfferManagerProps {
    offers: LastChanceOffer[];
    onChange: (offers: LastChanceOffer[]) => void;
}

export default function UpsellOfferManager({ offers, onChange }: UpsellOfferManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newOffer, setNewOffer] = useState<LastChanceOffer>({
        title: '',
        description: '',
        originalPrice: 0,
        offerPrice: 0,
        features: [],
        tag: '',
    });
    const [featureInput, setFeatureInput] = useState('');

    const handleAddOffer = () => {
        if (!newOffer.title || newOffer.originalPrice <= 0 || newOffer.offerPrice <= 0) {
            alert('Please fill strictly required fields (Title, Prices)');
            return;
        }

        const discount = Math.round(((newOffer.originalPrice - newOffer.offerPrice) / newOffer.originalPrice) * 100);
        const offerToAdd = { ...newOffer, discountPercentage: discount };

        console.log('✅ Adding new offer:', offerToAdd);
        const updatedOffers = [...(offers || []), offerToAdd];
        console.log('📊 Updated offers array:', updatedOffers);

        onChange(updatedOffers);
        setIsAdding(false);
        setNewOffer({
            title: '',
            description: '',
            originalPrice: 0,
            offerPrice: 0,
            features: [],
            tag: '',
        });
    };

    const handleRemoveOffer = (index: number) => {
        console.log('❌ Removing offer at index:', index);
        const updated = [...offers];
        updated.splice(index, 1);
        console.log('📊 Updated offers after removal:', updated);
        onChange(updated);
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setNewOffer({ ...newOffer, features: [...newOffer.features, featureInput.trim()] });
            setFeatureInput('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Last Chance Upsell Offers</h3>
                <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Offer
                </button>
            </div>

            {/* List Existing Offers */}
            <div className="grid grid-cols-1 gap-4">
                {offers?.map((offer, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 relative">
                        <button
                            type="button"
                            onClick={() => handleRemoveOffer(index)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-gray-900">{offer.title}</h4>
                                <p className="text-sm text-gray-500">{offer.description}</p>
                                <div className="mt-2 text-sm">
                                    <span className="line-through text-gray-400 mr-2">₹{offer.originalPrice}</span>
                                    <span className="font-bold text-green-600">₹{offer.offerPrice}</span>
                                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                        {offer.discountPercentage}% OFF
                                    </span>
                                </div>
                                {offer.tag && (
                                    <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                        {offer.tag}
                                    </span>
                                )}
                            </div>
                            {offer.features && offer.features.length > 0 && (
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {offer.features.map((f, i) => (
                                        <li key={i}>• {f}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Offer Form */}
            {isAdding && (
                <div className="border rounded-lg p-4 bg-white shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={newOffer.title}
                                onChange={e => setNewOffer({ ...newOffer, title: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white placeholder:text-gray-500"
                                placeholder="e.g. 1 Year Protection"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Tag (Optional)</label>
                            <input
                                type="text"
                                value={newOffer.tag}
                                onChange={e => setNewOffer({ ...newOffer, tag: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white placeholder:text-gray-500"
                                placeholder="e.g. Best Value"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Original Price</label>
                            <input
                                type="number"
                                value={newOffer.originalPrice}
                                onChange={e => setNewOffer({ ...newOffer, originalPrice: parseFloat(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white placeholder:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Offer Price</label>
                            <input
                                type="number"
                                value={newOffer.offerPrice}
                                onChange={e => setNewOffer({ ...newOffer, offerPrice: parseFloat(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700">Description</label>
                        <textarea
                            value={newOffer.description}
                            onChange={e => setNewOffer({ ...newOffer, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white placeholder:text-gray-500"
                            rows={2}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700">Features</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                type="text"
                                value={featureInput}
                                onChange={e => setFeatureInput(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white placeholder:text-gray-500"
                                placeholder="Add a feature..."
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                            />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Add
                            </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {newOffer.features.map((f, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAddOffer}
                            className="px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Save Offer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
