import { useState, useRef } from "react";
import { ChevronDown, Upload, X, Plus, Trash } from "lucide-react";

interface SectionProps {
    title: string;
    name: string;
    children: React.ReactNode;
    isActive: boolean;
    onToggle: (name: string) => void;
    sectionRef: (el: HTMLDivElement | null) => void;
}

const Section = ({
    title,
    name,
    children,
    isActive,
    onToggle,
    sectionRef,
}: SectionProps) => {
    return (
        <div
            ref={sectionRef}
            className={`border rounded-xl mb-6 transition-all duration-300 ${isActive
                ? "border-primary-500 shadow-lg"
                : "border-gray-200 shadow-sm hover:border-gray-300"
                }`}
        >
            <button
                type="button"
                onClick={() => onToggle(name)}
                className={`w-full px-6 py-5 flex items-center justify-between rounded-t-xl transition-all duration-200 ${isActive
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-150"
                    : "bg-gray-50 hover:bg-gray-100"
                    }`}
            >
                <h3
                    className={`text-lg font-semibold flex items-center gap-3 ${isActive ? "text-primary-700" : "text-gray-900"
                        }`}
                >
                    {title}
                </h3>
                <div
                    className={`transition-transform duration-200 ${isActive ? "rotate-180 text-primary-600" : "text-gray-500"
                        }`}
                >
                    <ChevronDown className="h-5 w-5" />
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isActive ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="p-6 bg-white space-y-6 rounded-b-xl">{children}</div>
            </div>
        </div>
    );
};

interface GroceryProductFormProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData: (data: any) => void;
    brands: any[];
    categories: any[];
}

export default function GroceryProductForm({
    formData,
    handleChange,
    setFormData,
    brands,
    categories,
}: GroceryProductFormProps) {
    const [activeSection, setActiveSection] = useState<string>("basics");
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const toggleSection = (section: string) => {
        const newSection = activeSection === section ? "" : section;
        setActiveSection(newSection);

        if (newSection && sectionRefs.current[newSection]) {
            setTimeout(() => {
                sectionRefs.current[newSection]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
        }
    };

    const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-400 bg-white text-gray-900";
    const labelClass = "block text-sm font-medium text-gray-700 mb-2";
    const selectClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-400 bg-white cursor-pointer text-gray-900";
    const textareaClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 focus:border-primary-500";

    return (
        <div className="space-y-6">
            {/* 1. Basic Information */}
            <Section
                title="1️⃣ Basic Product Information"
                name="basics"
                isActive={activeSection === "basics"}
                onToggle={toggleSection}
                sectionRef={(el) => { sectionRefs.current["basics"] = el; }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={labelClass}>Product Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="e.g. Amul Gold Milk" />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Brand *</label>
                        <select name="brandId" value={formData.brandId} onChange={handleChange} required className={selectClass}>
                            <option value="">Select Brand</option>
                            {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className={labelClass}>Short Description</label>
                        <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className={inputClass} placeholder="1-2 lines summary" />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className={labelClass}>Detailed Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={textareaClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Category (Group) *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    category: e.target.value,
                                    subCategory: "" // Reset sub-category on change
                                });
                            }}
                            required
                            className={selectClass}
                        >
                            <option value="">Select Group</option>
                            {/* Filter for Fixed Parent (Grocery Root) */}
                            {categories
                                .filter(c => c.parentCategory === "697095953758a7d8f76fa88c")
                                .map((c) => <option key={c._id} value={c.name}>{c.name}</option>)
                            }
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Sub-Category *</label>
                        <select
                            name="subCategory"
                            value={formData.subCategory}
                            onChange={handleChange}
                            required
                            className={selectClass}
                            disabled={!formData.category} // Disable if no group selected
                        >
                            <option value="">Select Sub-Category</option>
                            {/* Filter for children of selected group */}
                            {(() => {
                                const selectedGroup = categories.find(c => c.name === formData.category);
                                if (!selectedGroup) return null;
                                return categories
                                    .filter(c => c.parentCategory === selectedGroup._id)
                                    .map((c) => <option key={c._id} value={c.name}>{c.name}</option>);
                            })()}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Product Type</label>
                        <select name="productType" value={formData.productType} onChange={handleChange} className={selectClass}>
                            <option value="Packaged">Packaged</option>
                            <option value="Loose">Loose</option>
                            <option value="Fresh">Fresh</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Food Type</label>
                        <select name="foodType" value={formData.foodType} onChange={handleChange} className={selectClass}>
                            <option value="Veg">Veg 🟢</option>
                            <option value="Non-Veg">Non-Veg 🔴</option>
                            <option value="Egg">Egg 🟡</option>
                            <option value="Vegan">Vegan 🥬</option>
                        </select>
                    </div>
                    {/* Manufacturer & Compliance */}
                    <div className="space-y-2">
                        <label className={labelClass}>HSN Code</label>
                        <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>GST Percentage (%)</label>
                        <input type="number" name="gstRate" value={formData.gstRate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Country of Origin</label>
                        <input type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Manufacturer Name</label>
                        <input type="text" name="manufacturerName" value={formData.manufacturerName} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className={labelClass}>Manufacturer Address</label>
                        <textarea name="manufacturerAddress" value={formData.manufacturerAddress} onChange={handleChange} rows={2} className={textareaClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Importer Name (if applicable)</label>
                        <input type="text" name="importerName" value={formData.importerName} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Customer Care</label>
                        <input type="text" name="customerCare" value={formData.customerCare} onChange={handleChange} className={inputClass} />
                    </div>
                </div>
            </Section>

            {/* 2. Pricing & Tax */}
            <Section
                title="2️⃣ Pricing & Tax"
                name="pricing"
                isActive={activeSection === "pricing"}
                onToggle={toggleSection}
                sectionRef={(el) => { sectionRefs.current["pricing"] = el; }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={labelClass}>MRP *</label>
                        <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Selling Price *</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Cost Price (Optional)</label>
                        <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Discount Type</label>
                        <select name="discountType" value={formData.discountType} onChange={handleChange} className={selectClass}>
                            <option value="Percentage">Percentage</option>
                            <option value="Flat">Flat</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Discount Value</label>
                        <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="flex items-center space-x-2 mt-8">
                        <input type="checkbox" name="taxInclusive" checked={formData.taxInclusive} onChange={handleChange} className="w-5 h-5" />
                        <label className="text-gray-900 font-medium">GST Inclusive</label>
                    </div>
                </div>
            </Section>

            {/* 3. Inventory */}
            <Section
                title="3️⃣ Inventory & Fulfilment"
                name="inventory"
                isActive={activeSection === "inventory"}
                onToggle={toggleSection}
                sectionRef={(el) => { sectionRefs.current["inventory"] = el; }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={labelClass}>SKU</label>
                        <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Barcode / UPC / EAN</label>
                        <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Stock Quantity *</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Low Stock Alert</label>
                        <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Inventory Type</label>
                        <select name="inventoryType" value={formData.inventoryType} onChange={handleChange} className={selectClass}>
                            <option value="Seller Managed">Seller Fulfilled</option>
                            <option value="Platform Fulfilled">Platform Fulfilled</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Max Order Qty</label>
                        <input type="number" name="maxOrderQty" value={formData.maxOrderQty} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Min Order Qty</label>
                        <input type="number" name="minOrderQty" value={formData.minOrderQty} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Restock Lead Time (Days)</label>
                        <input type="number" name="restockLeadTime" value={formData.restockLeadTime} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Warehouse Location</label>
                        <input type="text" name="warehouseLocation" value={formData.warehouseLocation} onChange={handleChange} className={inputClass} />
                    </div>
                </div>
            </Section>

            {/* 4. Packaging */}
            <Section
                title="4️⃣ Packaging & Size Details"
                name="packaging"
                isActive={activeSection === "packaging"}
                onToggle={toggleSection}
                sectionRef={(el) => { sectionRefs.current["packaging"] = el; }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className={labelClass}>Pack Size Value</label>
                        <input type="number" name="packSize" value={formData.packSize} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Units</label>
                        <select name="packUnit" value={formData.packUnit} onChange={handleChange} className={selectClass}>
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="ml">ml</option>
                            <option value="L">L</option>
                            <option value="pcs">pcs</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Net Quantity</label>
                        <input type="text" name="netQuantity" value={formData.netQuantity} onChange={handleChange} placeholder="e.g. 500g" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Units in Pack</label>
                        <input type="number" name="unitsInPack" value={formData.unitsInPack} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Total Weight</label>
                        <input type="number" name="totalWeight" value={formData.totalWeight} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Packaging Type</label>
                        <select name="packagingType" value={formData.packagingType} onChange={handleChange} className={selectClass}>
                            <option value="Pouch">Pouch</option>
                            <option value="Bottle">Bottle</option>
                            <option value="Box">Box</option>
                            <option value="Tin">Tin</option>
                            <option value="Jar">Jar</option>
                            <option value="Tetra Pack">Tetra Pack</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2 mt-8">
                        <input type="checkbox" name="isLoose" checked={formData.isLoose} onChange={handleChange} className="w-5 h-5" />
                        <label className="text-gray-900 font-medium">Loose Item?</label>
                    </div>
                </div>
            </Section>

            {/* 5. Shelf Life */}
            <Section
                title="5️⃣ Shelf Life & Storage"
                name="storage"
                isActive={activeSection === "storage"}
                onToggle={toggleSection}
                sectionRef={(el) => { sectionRefs.current["storage"] = el; }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={labelClass}>Shelf Life Value</label>
                        <input type="number" name="shelfLifeValue" value={formData.shelfLifeValue} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Shelf Life Unit</label>
                        <select name="shelfLifeUnit" value={formData.shelfLifeUnit} onChange={handleChange} className={selectClass}>
                            <option value="Days">Days</option>
                            <option value="Months">Months</option>
                            <option value="Years">Years</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Manufacturing Date</label>
                        <input type="date" name="manufacturingDate" value={formData.manufacturingDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Expiry Date</label>
                        <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className={labelClass}>Storage Instructions</label>
                        <textarea name="storageInstructions" value={formData.storageInstructions} onChange={handleChange} rows={2} className={textareaClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Storage Type</label>
                        <select name="storageType" value={formData.storageType} onChange={handleChange} className={selectClass}>
                            <option value="Room Temperature">Room Temperature</option>
                            <option value="Refrigerated">Refrigerated</option>
                            <option value="Frozen">Frozen</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Temperature (°C)</label>
                        <input type="text" name="temperatureRequirement" value={formData.temperatureRequirement} onChange={handleChange} className={inputClass} />
                    </div>
                </div>
            </Section>

            {/* 6. Food Safety */}
            <Section
                title="6️⃣ Food Safety & Compliance"
                name="compliance"
                isActive={activeSection === "compliance"}
                onToggle={toggleSection}
                sectionRef={(el) => { sectionRefs.current["compliance"] = el; }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={labelClass}>FSSAI License Number</label>
                        <input type="text" name="fssaiLicense" value={formData.fssaiLicense} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Allergen Info</label>
                        <input type="text" name="allergens" value={formData.allergens} onChange={handleChange} placeholder="e.g. Milk, Nuts" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Certifications</label>
                        <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} placeholder="comma separated" className={inputClass} />
                    </div>
                    {/* Toggles */}
                    <div className="flex items-center space-x-6 col-span-2">
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="preservatives" checked={formData.preservatives} onChange={handleChange} className="w-5 h-5" />
                            <label>Contains Preservatives</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="artificialColors" checked={formData.artificialColors} onChange={handleChange} className="w-5 h-5" />
                            <label>Artificial Colors</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="isOrganic" checked={formData.isOrganic} onChange={handleChange} className="w-5 h-5" />
                            <label>Organic Certified</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="isGMO" checked={formData.isGMO} onChange={handleChange} className="w-5 h-5" />
                            <label>Genetically Modified</label>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 7. Nutrition */}
            <Section
                title="7️⃣ Nutrition Information"
                name="nutrition"
                isActive={activeSection === "nutrition"}
                onToggle={toggleSection}
                sectionRef={(el) => { sectionRefs.current["nutrition"] = el; }}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className={labelClass}>Serving Size</label>
                        <input type="text" name="nutrition_servingSize" value={formData.nutrition?.servingSize} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClass}>Servings/Pack</label>
                        <input type="number" name="nutrition_servingsPerPack" value={formData.nutrition?.servingsPerPack} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClass}>Energy (kcal)</label>
                        <input type="number" name="nutrition_energy" value={formData.nutrition?.energy} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClass}>Protein (g)</label>
                        <input type="number" name="nutrition_protein" value={formData.nutrition?.protein} onChange={handleChange} className={inputClass} />
                    </div>
                    {/* More Nutrients */}
                    {['carbohydrates', 'sugars', 'fat', 'saturatedFat', 'transFat', 'cholesterol', 'sodium', 'fiber'].map(nutrient => (
                        <div key={nutrient} className="space-y-1">
                            <label className={labelClass} style={{ textTransform: 'capitalize' }}>{nutrient.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input type="number" name={`nutrition_${nutrient}`} value={formData.nutrition?.[nutrient]} onChange={handleChange} className={inputClass} />
                        </div>
                    ))}
                </div>
            </Section>

            {/* 8. Ingredients */}
            <Section
                title="8️⃣ Ingredients & Composition"
                name="ingredients"
                isActive={activeSection === "ingredients"}
                onToggle={toggleSection}
                sectionRef={(el) => { sectionRefs.current["ingredients"] = el; }}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className={labelClass}>Complete Ingredient List</label>
                        <textarea name="ingredientList" value={formData.ingredientList} onChange={handleChange} rows={4} className={textareaClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Key Ingredients (Highlights)</label>
                        <textarea name="keyIngredients" value={formData.keyIngredients} onChange={handleChange} rows={2} placeholder="Comma separated" className={textareaClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Additives / Flavors</label>
                        <input type="text" name="additives" value={formData.additives} onChange={handleChange} className={inputClass} />
                    </div>
                </div>
            </Section>

            {/* 10. Logistics */}
            <Section
                title="🔟 Logistics & Dimensions"
                name="logistics"
                isActive={activeSection === "logistics"}
                onToggle={toggleSection}
                sectionRef={(el) => { sectionRefs.current["logistics"] = el; }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className={labelClass}>Length (cm)</label>
                        <input type="number" name="length" value={formData.length} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Width (cm)</label>
                        <input type="number" name="width" value={formData.width} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Height (cm)</label>
                        <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Volumetric Weight</label>
                        <input type="number" name="volumetricWeight" value={formData.volumetricWeight} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="flex items-center space-x-6 col-span-3">
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="isFragile" checked={formData.isFragile} onChange={handleChange} className="w-5 h-5" />
                            <label>Fragile</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="isPerishable" checked={formData.isPerishable} onChange={handleChange} className="w-5 h-5" />
                            <label>Perishable</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="isColdChain" checked={formData.isColdChain} onChange={handleChange} className="w-5 h-5" />
                            <label>Requires Cold Chain</label>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 12. Seller Controls */}
            <Section
                title="1️⃣2️⃣ Seller Controls"
                name="controls"
                isActive={activeSection === "controls"}
                onToggle={toggleSection}
                sectionRef={(el) => { sectionRefs.current["controls"] = el; }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={labelClass}>Product Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className={selectClass}>
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Return Window (Days)</label>
                        <input type="number" name="returnWindow" value={formData.returnWindow} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="flex items-center space-x-6 col-span-2">
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="returnable" checked={formData.returnable} onChange={handleChange} className="w-5 h-5" />
                            <label>Returnable</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="codAvailable" checked={formData.codAvailable} onChange={handleChange} className="w-5 h-5" />
                            <label>COD Available</label>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
