import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, GripVertical, Trash2, Pencil, Copy, Image as ImageIcon, Check } from 'lucide-react';
import { IFilterConfig, IVariant } from '../../types/product';

interface VariantGeneratorProps {
    filterConfig: IFilterConfig[];
    basePrice: number;
    baseStock: number;
    baseSku?: string;
    onVariantsGenerated: (variants: IVariant[]) => void;
    existingVariants?: IVariant[];
}

interface SelectedAttribute {
    key: string;
    label: string;
    values: string[];
}

const VariantGenerator: React.FC<VariantGeneratorProps> = ({
    filterConfig,
    basePrice,
    baseStock,
    baseSku,
    onVariantsGenerated,
    existingVariants = []
}) => {
    const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);
    const [generatedVariants, setGeneratedVariants] = useState<IVariant[]>(existingVariants);
    const [bulkPrice, setBulkPrice] = useState<string>(basePrice.toString());
    const [bulkStock, setBulkStock] = useState<string>(baseStock.toString());
    const [bulkImage, setBulkImage] = useState<string>('');

    // Filter out only variant type configs
    const variantConfigs = useMemo(() =>
        filterConfig.filter(config => config.type === 'variant' || config.isVariant),
        [filterConfig]
    );

    // Initialize selected attributes based on available configs
    useEffect(() => {
        if (variantConfigs.length > 0 && selectedAttributes.length === 0) {
            setSelectedAttributes(
                variantConfigs.map(config => ({
                    key: config.key,
                    label: config.label,
                    values: []
                }))
            );
        }
    }, [variantConfigs]);

    const handleAttributeValueChange = (key: string, value: string, checked: boolean) => {
        setSelectedAttributes(prev => prev.map(attr => {
            if (attr.key === key) {
                if (checked) {
                    return { ...attr, values: [...attr.values, value] };
                } else {
                    return { ...attr, values: attr.values.filter(v => v !== value) };
                }
            }
            return attr;
        }));
    };

    const handleAddCustomValue = (key: string, value: string) => {
        if (!value.trim()) return;
        handleAttributeValueChange(key, value.trim(), true);
    };

    // Cartesian Product Generator
    const generateCombinations = (attributes: SelectedAttribute[]) => {
        const validAttributes = attributes.filter(attr => attr.values.length > 0);
        if (validAttributes.length === 0) return [];

        return validAttributes.reduce<Record<string, string>[]>((acc, attr) => {
            if (acc.length === 0) {
                return attr.values.map(val => ({ [attr.label]: val }));
            }
            const newCombinations: Record<string, string>[] = [];
            acc.forEach(combo => {
                attr.values.forEach(val => {
                    newCombinations.push({ ...combo, [attr.label]: val });
                });
            });
            return newCombinations;
        }, []);
    };

    const generateVariants = () => {
        const combinations = generateCombinations(selectedAttributes);

        // Convert combinations to variants
        const newVariants: IVariant[] = combinations.map((combo, index) => {
            // Create a unique SKU/Identifier based on attributes
            // Sort keys to ensure consistency
            const attrString = Object.entries(combo)
                .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                .map(([_, val]) => val)
                .join('-');

            const sku = baseSku ? `${baseSku}-${attrString}` : attrString;

            return {
                sku: sku.toUpperCase(),
                attributes: combo,
                price: Number(bulkPrice) || basePrice,
                priceOverride: bulkPrice || basePrice.toString(), // For input field binding
                stock: Number(bulkStock) || baseStock,
                images: bulkImage ? [bulkImage] : [],
                image: bulkImage || '', // For backward comp
                isActive: true
            };
        });

        setGeneratedVariants(newVariants);
        onVariantsGenerated(newVariants);
    };

    const updateVariant = (index: number, field: keyof IVariant | 'priceOverride', value: string | number) => {
        const updated = [...generatedVariants];
        if (field === 'priceOverride') {
            updated[index] = {
                ...updated[index],
                priceOverride: value as string,
                price: Number(value)
            };
        } else if (field === 'stock') {
            updated[index] = { ...updated[index], stock: Number(value) };
        } else if (field === 'image') {
            updated[index] = {
                ...updated[index],
                image: value as string,
                images: value ? [value as string] : []
            };
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }
        setGeneratedVariants(updated);
        onVariantsGenerated(updated);
    };

    const removeVariant = (index: number) => {
        const updated = generatedVariants.filter((_, i) => i !== index);
        setGeneratedVariants(updated);
        onVariantsGenerated(updated);
    };

    const applyBulkChanges = () => {
        const updated = generatedVariants.map(v => ({
            ...v,
            price: Number(bulkPrice) || v.price,
            priceOverride: bulkPrice || v.priceOverride,
            stock: Number(bulkStock) || v.stock,
            images: bulkImage ? [bulkImage] : v.images,
            image: bulkImage || v.image
        }));
        setGeneratedVariants(updated);
        onVariantsGenerated(updated);
    };

    if (variantConfigs.length === 0) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-500">
                    No variant options available for this category.
                    Use standard product attributes instead.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                {/* Attribute Selection */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">1. Select Options</h3>
                    {variantConfigs.map((config, idx) => {
                        const currentSelected = selectedAttributes.find(a => a.key === config.key)?.values || [];

                        return (
                            <div key={config.key} className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    {config.label} <span className="text-gray-400 text-xs">({config.key})</span>
                                </label>

                                <div className="flex flex-wrap gap-2 mb-2">
                                    {config.options?.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => handleAttributeValueChange(config.key, opt, !currentSelected.includes(opt))}
                                            className={`px-3 py-1.5 text-sm rounded-full transition-all border ${currentSelected.includes(opt)
                                                    ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium ring-1 ring-primary-500'
                                                    : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                                                }`}
                                        >
                                            {opt} {currentSelected.includes(opt) && '✓'}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Value Input */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={`Add custom ${config.label}...`}
                                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddCustomValue(config.key, (e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                                        onClick={(e) => {
                                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                            handleAddCustomValue(config.key, input.value);
                                            input.value = '';
                                        }}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bulk Actions & Generation */}
                <div className="space-y-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">2. Default Values</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Price</label>
                                <input
                                    type="number"
                                    value={bulkPrice}
                                    onChange={(e) => setBulkPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Stock</label>
                                <input
                                    type="number"
                                    value={bulkStock}
                                    onChange={(e) => setBulkStock(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Image URL</label>
                                <input
                                    type="text"
                                    value={bulkImage}
                                    onChange={(e) => setBulkImage(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={generateVariants}
                            className="flex-1 py-2.5 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Generate Combinations
                        </button>
                        {generatedVariants.length > 0 && (
                            <button
                                type="button"
                                onClick={applyBulkChanges}
                                className="py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                title="Apply default values to all generated variants"
                            >
                                Apply Defaults to All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Generated Variants Table */}
            {generatedVariants.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Generated Variants ({generatedVariants.length})
                        </h3>
                        <button
                            type="button"
                            onClick={() => { setGeneratedVariants([]); onVariantsGenerated([]); }}
                            className="text-sm text-red-600 hover:text-red-700"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-4 py-3 border-b">Check</th>
                                    <th className="px-4 py-3 border-b">Variant (Attributes)</th>
                                    <th className="px-4 py-3 border-b w-32">Price</th>
                                    <th className="px-4 py-3 border-b w-24">Stock</th>
                                    <th className="px-4 py-3 border-b w-40">SKU</th>
                                    <th className="px-4 py-3 border-b">Image</th>
                                    <th className="px-4 py-3 border-b w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {generatedVariants.map((variant, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" defaultChecked />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {Object.entries(variant.attributes).map(([key, val]) => (
                                                    <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        {key}: {val}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={variant.priceOverride || variant.price}
                                                onChange={(e) => updateVariant(index, 'priceOverride', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={variant.sku}
                                                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2 items-center">
                                                {variant.image ? (
                                                    <img src={variant.image} alt="" className="w-8 h-8 rounded object-cover border" />
                                                ) : (
                                                    <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center text-gray-400">
                                                        <ImageIcon className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <input
                                                    type="text"
                                                    value={variant.image || ''}
                                                    onChange={(e) => updateVariant(index, 'image', e.target.value)}
                                                    placeholder="Image URL"
                                                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded text-gray-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantGenerator;
