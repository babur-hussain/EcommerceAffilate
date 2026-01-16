"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import { ArrowLeft, ChevronDown, ChevronUp, Upload, X, MapPin } from "lucide-react";
import Link from "next/link";
import LocationPickerModal from "@/components/LocationPickerModal";

interface Brand {
  _id: string;
  name: string;
  logo?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
}

interface Variant {
  type: string;
  value: string;
  sku: string;
  priceOverride: string;
  stock: string;
  image: string;
}

interface Product {
  _id: string;
  title?: string;
  subtitle?: string;
  category?: string;
  subCategory?: string;
  productType?: string;
  brandName?: string;
  manufacturerName?: string;
  countryOfOrigin?: string;
  modelName?: string;
  sku?: string;
  hsnCode?: string;
  productCondition?: string;
  upc?: string;
  internalCode?: string;
  batchNumber?: string;
  serialNumberRequired?: boolean;
  mrp?: number | string;
  price?: number | string;
  costPrice?: number | string;
  discountType?: string;
  discountValue?: number | string;
  gstRate?: number | string;
  taxInclusive?: boolean;
  stock?: number | string;
  minOrderQty?: number | string;
  maxOrderQty?: number | string;
  lowStockThreshold?: number | string;
  inventoryType?: string;
  warehouseLocation?: string;
  skuStatus?: string;
  variants?: Variant[];
  shortDescription?: string;
  description?: string;
  keyFeatures?: string[];
  boxContents?: string;
  usageInstructions?: string;
  careInstructions?: string;
  warrantyDetails?: string;
  warrantyDuration?: string;
  returnable?: boolean;
  returnWindow?: number | string;
  image?: string;
  images?: string[];
  productVideo?: string;
  datasheet?: string;
  netWeight?: number | string;
  grossWeight?: number | string;
  dimensions?: {
    length?: number | string;
    width?: number | string;
    height?: number | string;
  };
  fragile?: boolean;
  liquid?: boolean;
  hazardous?: boolean;
  shippingClass?: string;
  pickupLocation?: string;
  pickupLocationCoordinates?: { lat: number; lng: number };
  processingTime?: { value: number; unit: 'hours' | 'days' };
  shippingCharges?: number | string;
  codAvailable?: boolean;
  internationalShipping?: boolean;
  fssaiNumber?: string;
  drugLicenseNumber?: string;
  bisCertification?: string;
  expiryDateRequired?: boolean;
  manufacturingDate?: string;
  expiryDate?: string;
  safetyDisclaimer?: string;
  legalDisclaimer?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  searchKeywords?: string;
  urlSlug?: string;
  eligibleForOffers?: boolean;
  bankOfferEnabled?: boolean;
  flashSaleEligible?: boolean;
  dealOfDayEligible?: boolean;
  bulkDiscountEnabled?: boolean;
  wholesalePrice?: number | string;
  minWholesaleQty?: number | string;
  tieredPricing?: boolean;
  businessOnlyVisibility?: boolean;
  gstInvoiceMandatory?: boolean;
  qualityCheckConfirmed?: boolean;
  authenticityConfirmed?: boolean;
  brandAuthorizationConfirmed?: boolean;
  status?: string;
  publishDate?: string;
  visibility?: string;
  brandId?: string;
  trustBadges?: string[];
}

// Section component moved outside to prevent recreation on every render
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

export default function EditProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeSection, setActiveSection] = useState<string>("basics");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [formData, setFormData] = useState({
    // 1. Product Basics
    title: "",
    subtitle: "",
    category: "",
    subCategory: "",
    productType: "Physical",
    brandName: "",
    manufacturerName: "",
    countryOfOrigin: "India",
    modelName: "",
    sku: "",
    hsnCode: "",
    productCondition: "New",

    // 2. Product Identifiers
    upc: "",
    internalCode: "",
    batchNumber: "",
    serialNumberRequired: false,

    // 3. Pricing & Taxation
    mrp: "",
    price: "",
    costPrice: "",
    discountType: "Percentage",
    discountValue: "",
    gstRate: "18",
    taxInclusive: true,

    // 4. Inventory & Stock
    stock: "",
    minOrderQty: "1",
    maxOrderQty: "",
    lowStockThreshold: "10",
    inventoryType: "Seller Managed",
    warehouseLocation: "",
    skuStatus: "Active",

    // 5. Variants
    variants: [] as Variant[],

    // 6. Product Description
    shortDescription: "",
    description: "",
    keyFeatures: ["", "", "", "", ""],
    boxContents: "",
    usageInstructions: "",
    careInstructions: "",
    warrantyDetails: "",
    warrantyDuration: "",
    returnable: true,
    returnWindow: "7",

    // 7. Media & Assets
    image: "",
    images: [""],
    productVideo: "",
    datasheet: "",

    // 8. Physical Attributes
    netWeight: "",
    grossWeight: "",
    length: "",
    width: "",
    height: "",
    fragile: false,
    liquid: false,
    hazardous: false,

    // 9. Shipping & Logistics
    shippingClass: "Standard",
    pickupLocation: "",
    pickupLocationCoordinates: undefined as { lat: number; lng: number } | undefined,
    processingTime: { value: 2, unit: "days" } as { value: number; unit: "hours" | "days" },
    shippingCharges: "Free",
    codAvailable: true,
    internationalShipping: false,

    // 10. Compliance & Legal
    fssaiNumber: "",
    drugLicenseNumber: "",
    bisCertification: "",
    expiryDateRequired: false,
    manufacturingDate: "",
    expiryDate: "",
    safetyDisclaimer: "",
    legalDisclaimer: "",

    // 11. SEO & Discoverability
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    searchKeywords: "",
    urlSlug: "",

    // 12. Offers & Promotions
    eligibleForOffers: true,
    bankOfferEnabled: false,
    flashSaleEligible: false,
    dealOfDayEligible: false,
    bulkDiscountEnabled: false,

    // 13. B2B / Wholesale
    wholesalePrice: "",
    minWholesaleQty: "",
    tieredPricing: false,
    businessOnlyVisibility: false,
    gstInvoiceMandatory: false,

    // 14. Quality & Moderation
    qualityCheckConfirmed: false,
    authenticityConfirmed: false,
    brandAuthorizationConfirmed: false,

    // 15. Product Status
    status: "draft",
    publishDate: "",
    visibility: "Public",

    brandId: "",
    trustBadges: [] as string[],
  });

  const [availableTrustBadges, setAvailableTrustBadges] = useState<Array<{ id: string; name: string; description: string }>>([]);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchProduct();
    fetchTrustBadges();
  }, []);

  const fetchProduct = async () => {
    try {
      setFetchingProduct(true);
      const response = await apiClient.get(`/api/products/${productId}`);
      const product: Partial<Product> = response.data;

      // Pre-fill form with product data
      setFormData({
        title: product.title || "",
        subtitle: product.subtitle || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        productType: product.productType || "Physical",
        brandName: product.brandName || "",
        manufacturerName: product.manufacturerName || "",
        countryOfOrigin: product.countryOfOrigin || "India",
        modelName: product.modelName || "",
        sku: product.sku || "",
        hsnCode: product.hsnCode || "",
        productCondition: product.productCondition || "New",
        upc: product.upc || "",
        internalCode: product.internalCode || "",
        batchNumber: product.batchNumber || "",
        serialNumberRequired: product.serialNumberRequired || false,
        mrp: product.mrp?.toString() || "",
        price: product.price?.toString() || "",
        costPrice: product.costPrice?.toString() || "",
        discountType: product.discountType || "Percentage",
        discountValue: product.discountValue?.toString() || "",
        gstRate: product.gstRate?.toString() || "18",
        taxInclusive:
          product.taxInclusive !== undefined ? product.taxInclusive : true,
        stock: product.stock?.toString() || "",
        minOrderQty: product.minOrderQty?.toString() || "1",
        maxOrderQty: product.maxOrderQty?.toString() || "",
        lowStockThreshold: product.lowStockThreshold?.toString() || "10",
        inventoryType: product.inventoryType || "Seller Managed",
        warehouseLocation: product.warehouseLocation || "",
        skuStatus: product.skuStatus || "Active",
        variants: product.variants || [],
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        keyFeatures: product.keyFeatures?.length
          ? product.keyFeatures
          : ["", "", "", "", ""],
        boxContents: product.boxContents || "",
        usageInstructions: product.usageInstructions || "",
        careInstructions: product.careInstructions || "",
        warrantyDetails: product.warrantyDetails || "",
        warrantyDuration: product.warrantyDuration || "",
        returnable:
          product.returnable !== undefined ? product.returnable : true,
        returnWindow: product.returnWindow?.toString() || "7",
        image: product.image || "",
        images: product.images?.length ? product.images : [""],
        productVideo: product.productVideo || "",
        datasheet: product.datasheet || "",
        netWeight: product.netWeight?.toString() || "",
        grossWeight: product.grossWeight?.toString() || "",
        length: product.dimensions?.length?.toString() || "",
        width: product.dimensions?.width?.toString() || "",
        height: product.dimensions?.height?.toString() || "",
        fragile: product.fragile || false,
        liquid: product.liquid || false,
        hazardous: product.hazardous || false,
        shippingClass: product.shippingClass || "Standard",
        pickupLocation: product.pickupLocation || "",
        pickupLocationCoordinates: product.pickupLocationCoordinates,
        processingTime:
          typeof product.processingTime === "object" && product.processingTime
            ? product.processingTime
            : {
              value: parseInt(product.processingTime?.toString() || "2"),
              unit: "days",
            },
        shippingCharges: product.shippingCharges?.toString() || "Free",
        codAvailable:
          product.codAvailable !== undefined ? product.codAvailable : true,
        internationalShipping: product.internationalShipping || false,
        fssaiNumber: product.fssaiNumber || "",
        drugLicenseNumber: product.drugLicenseNumber || "",
        bisCertification: product.bisCertification || "",
        expiryDateRequired: product.expiryDateRequired || false,
        manufacturingDate: product.manufacturingDate || "",
        expiryDate: product.expiryDate || "",
        safetyDisclaimer: product.safetyDisclaimer || "",
        legalDisclaimer: product.legalDisclaimer || "",
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
        seoKeywords: product.seoKeywords || "",
        searchKeywords: product.searchKeywords || "",
        urlSlug: product.urlSlug || "",
        eligibleForOffers:
          product.eligibleForOffers !== undefined
            ? product.eligibleForOffers
            : true,
        bankOfferEnabled: product.bankOfferEnabled || false,
        flashSaleEligible: product.flashSaleEligible || false,
        dealOfDayEligible: product.dealOfDayEligible || false,
        bulkDiscountEnabled: product.bulkDiscountEnabled || false,
        wholesalePrice: product.wholesalePrice?.toString() || "",
        minWholesaleQty: product.minWholesaleQty?.toString() || "",
        tieredPricing: product.tieredPricing || false,
        businessOnlyVisibility: product.businessOnlyVisibility || false,
        gstInvoiceMandatory: product.gstInvoiceMandatory || false,
        qualityCheckConfirmed: product.qualityCheckConfirmed || false,
        authenticityConfirmed: product.authenticityConfirmed || false,
        brandAuthorizationConfirmed:
          product.brandAuthorizationConfirmed || false,
        status: product.status || "draft",
        publishDate: product.publishDate || "",
        visibility: product.visibility || "Public",
        brandId: product.brandId || "",
        trustBadges: product.trustBadges || [],
      });

      // Set existing images as preview
      if (product.images?.length) {
        setImagePreview(product.images);
      }

      toast.success("Product loaded successfully");
    } catch (error: any) {
      console.error("Failed to fetch product:", error);
      toast.error("Failed to load product");
      router.push("/seller/products");
    } finally {
      setFetchingProduct(false);
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await apiClient.get<Brand[]>("/api/business/brands");
      setBrands(response.data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get<Category[]>("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const fetchTrustBadges = async () => {
    try {
      const response = await apiClient.get<{ business?: { trustBadges?: string[] } }>("/api/me");
      const business = response.data.business;
      if (business?.trustBadges) {
        const badgesResponse = await apiClient.get<Array<{ id: string; name: string; description: string }>>("/api/super-admin/trust-badges");
        const assignedBadges = badgesResponse.data.filter((badge) =>
          business.trustBadges!.includes(badge.id)
        );
        setAvailableTrustBadges(assignedBadges);
      }
    } catch (error) {
      console.error("Failed to fetch trust badges:", error);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    if (imageFiles.length + fileArray.length > 7) {
      toast.error("Maximum 7 images allowed");
      return;
    }

    // Check file sizes
    for (const file of fileArray) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return;
      }
    }

    setImageFiles([...imageFiles, ...fileArray]);

    // Generate preview URLs
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);

    // Revoke old preview URL to free memory
    URL.revokeObjectURL(imagePreview[index]);

    setImageFiles(newFiles);
    setImagePreview(newPreviews);
  };

  const uploadImagesToCloudinary = async () => {
    if (imageFiles.length === 0) {
      toast.error("Please select at least one image");
      return [];
    }

    setUploadingImages(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await apiClient.post<{
        success: boolean;
        images: string[];
        count: number;
      }>("/api/upload/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.images;
    } catch (error: any) {
      console.error("Failed to upload images:", error);
      toast.error("Failed to upload images");
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSaveDraft = async () => {
    // Minimal validation for draft
    if (!formData.title || !formData.category || !formData.price) {
      toast.error(
        "Please fill in at least Title, Category, and Price to save draft"
      );
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrls: string[] = [];

      // Upload images if any
      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadImagesToCloudinary();
      }

      const productData: any = {
        title: formData.title,
        subtitle: formData.subtitle,
        price: parseFloat(formData.price),
        mrp: formData.mrp
          ? parseFloat(formData.mrp)
          : parseFloat(formData.price),
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        shortDescription: formData.shortDescription,
        brandId: formData.brandId,
        brandName: formData.brandName,
        manufacturerName: formData.manufacturerName,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        sku: formData.sku,
        hsnCode: formData.hsnCode,
        productType: formData.productType,
        productCondition: formData.productCondition,
        countryOfOrigin: formData.countryOfOrigin,
        modelName: formData.modelName,
        status: "draft", // Always draft
        visibility: formData.visibility,
      };

      // Only update images if new ones were uploaded
      if (uploadedImageUrls.length > 0) {
        productData.image = uploadedImageUrls[0];
        productData.images = uploadedImageUrls;
      }

      await apiClient.put(`/api/products/${productId}`, productData);
      toast.success("Draft saved successfully!");
      router.push("/seller/products");
    } catch (error: any) {
      console.error("Failed to save draft:", error);
      toast.error(error.response?.data?.error || "Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.qualityCheckConfirmed ||
      !formData.authenticityConfirmed ||
      !formData.brandAuthorizationConfirmed
    ) {
      toast.error("Please confirm all quality and authenticity declarations");
      return;
    }

    setLoading(true);

    try {
      // Upload new images if any
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadImagesToCloudinary();
      }

      const productData: any = {
        title: formData.title,
        subtitle: formData.subtitle,
        price: parseFloat(formData.price),
        mrp: parseFloat(formData.mrp),
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        shortDescription: formData.shortDescription,
        brandId: formData.brandId,
        brandName: formData.brandName,
        manufacturerName: formData.manufacturerName,
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku,
        hsnCode: formData.hsnCode,
        productType: formData.productType,
        productCondition: formData.productCondition,
        countryOfOrigin: formData.countryOfOrigin,
        modelName: formData.modelName,
        upc: formData.upc,
        gstRate: parseFloat(formData.gstRate),
        taxInclusive: formData.taxInclusive,
        minOrderQty: parseInt(formData.minOrderQty),
        maxOrderQty: formData.maxOrderQty
          ? parseInt(formData.maxOrderQty)
          : undefined,
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        keyFeatures: formData.keyFeatures.filter((f) => f.trim() !== ""),
        warrantyDetails: formData.warrantyDetails,
        warrantyDuration: formData.warrantyDuration,
        returnable: formData.returnable,
        returnWindow: parseInt(formData.returnWindow),
        netWeight: formData.netWeight,
        dimensions: {
          length: formData.length,
          width: formData.width,
          height: formData.height,
        },
        shippingClass: formData.shippingClass,
        processingTime: {
          value:
            typeof formData.processingTime === "object"
              ? formData.processingTime.value
              : parseInt(formData.processingTime),
          unit:
            typeof formData.processingTime === "object"
              ? formData.processingTime.unit
              : "days",
        },
        pickupLocationCoordinates: formData.pickupLocationCoordinates,
        codAvailable: formData.codAvailable,
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
        status: formData.status,
        visibility: formData.visibility,
        trustBadges: formData.trustBadges,
      };

      // Only update images if new ones were uploaded
      if (uploadedImageUrls.length > 0) {
        productData.image = uploadedImageUrls[0];
        productData.images = uploadedImageUrls;
      }

      await apiClient.put(`/api/products/${productId}`, productData);
      toast.success("Product updated successfully!");
      router.push("/seller/products");
    } catch (error: any) {
      console.error("Failed to update product:", error);
      toast.error(error.response?.data?.error || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.keyFeatures];
    newFeatures[index] = value;
    setFormData({ ...formData, keyFeatures: newFeatures });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          type: "",
          value: "",
          sku: "",
          priceOverride: "",
          stock: "",
          image: "",
        },
      ],
    });
  };

  const removeVariant = (index: number) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string
  ) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const toggleSection = (section: string) => {
    const newSection = activeSection === section ? "" : section;
    setActiveSection(newSection);

    // Scroll to center the section smoothly
    if (newSection && sectionRefs.current[newSection]) {
      setTimeout(() => {
        sectionRefs.current[newSection]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  // Reusable input classes for better styling
  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-400 bg-white text-gray-900";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";
  const selectClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-400 bg-white cursor-pointer text-gray-900";
  const textareaClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 focus:border-primary-500";

  if (!user) return null;

  return (
    <ProtectedRoute
      allowedRoles={["SELLER_OWNER", "SELLER_MANAGER", "SELLER_STAFF"]}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/seller/products"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Edit Product
                  </h1>
                  <p className="text-gray-500 mt-1 text-sm">
                    {fetchingProduct
                      ? "Loading product..."
                      : "Update your product information"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const form = document.querySelector("form");
                    if (form) {
                      const submitEvent = new Event("submit", {
                        bubbles: true,
                        cancelable: true,
                      });
                      form.dispatchEvent(submitEvent);
                    }
                  }}
                  disabled={loading || uploadingImages || fetchingProduct}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all font-medium"
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Product Basics */}
            <Section
              title="1️⃣ Product Basics (Mandatory)"
              name="basics"
              isActive={activeSection === "basics"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["basics"] = el;
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelClass}>Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter product title"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Product Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="Brief subtitle or tagline"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={selectClass}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Sub-Category</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    placeholder="e.g., Smartphones, T-Shirts"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Product Type *</label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="Physical">Physical</option>
                    <option value="Digital">Digital</option>
                    <option value="Service">Service</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Brand *</label>
                  <select
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleChange}
                    required
                    className={selectClass}
                  >
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Brand Name</label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="Brand display name"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Manufacturer Name</label>
                  <input
                    type="text"
                    name="manufacturerName"
                    value={formData.manufacturerName}
                    onChange={handleChange}
                    placeholder="Manufacturer company name"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Country of Origin *</label>
                  <input
                    type="text"
                    name="countryOfOrigin"
                    value={formData.countryOfOrigin}
                    onChange={handleChange}
                    placeholder="e.g., India, USA, China"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Model Name / Number</label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleChange}
                    placeholder="Product model identifier"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Stock Keeping Unit"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>HSN / SAC Code</label>
                  <input
                    type="text"
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleChange}
                    placeholder="Tax classification code"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Product Condition</label>
                  <select
                    name="productCondition"
                    value={formData.productCondition}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
              </div>
            </Section>

            {/* 2. Product Identifiers */}
            <Section
              title="2️⃣ Product Identifiers"
              name="identifiers"
              isActive={activeSection === "identifiers"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["identifiers"] = el;
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPC / EAN / ISBN
                  </label>
                  <input
                    type="text"
                    name="upc"
                    value={formData.upc}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Internal Product Code
                  </label>
                  <input
                    type="text"
                    name="internalCode"
                    value={formData.internalCode}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div className="flex items-center pt-7">
                  <input
                    type="checkbox"
                    name="serialNumberRequired"
                    checked={formData.serialNumberRequired}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Serial Number Required
                  </label>
                </div>
              </div>
            </Section>

            {/* 3. Pricing & Taxation */}
            <Section
              title="3️⃣ Pricing & Taxation"
              name="pricing"
              isActive={activeSection === "pricing"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["pricing"] = el;
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MRP (Maximum Retail Price) *
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price (Internal)
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className={textareaClass}
                  >
                    <option value="Flat">Flat</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    min="0"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Rate (%) *
                  </label>
                  <select
                    name="gstRate"
                    value={formData.gstRate}
                    onChange={handleChange}
                    className={textareaClass}
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                <div className="flex items-center pt-7">
                  <input
                    type="checkbox"
                    name="taxInclusive"
                    checked={formData.taxInclusive}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Tax Inclusive Price
                  </label>
                </div>
              </div>
            </Section>

            {/* 4. Inventory & Stock */}
            <Section
              title="4️⃣ Inventory & Stock"
              name="inventory"
              isActive={activeSection === "inventory"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["inventory"] = el;
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Quantity
                  </label>
                  <input
                    type="number"
                    name="minOrderQty"
                    value={formData.minOrderQty}
                    onChange={handleChange}
                    min="1"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Order Quantity
                  </label>
                  <input
                    type="number"
                    name="maxOrderQty"
                    value={formData.maxOrderQty}
                    onChange={handleChange}
                    min="1"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Low Stock Alert Threshold
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    min="0"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inventory Type
                  </label>
                  <select
                    name="inventoryType"
                    value={formData.inventoryType}
                    onChange={handleChange}
                    className={textareaClass}
                  >
                    <option value="Seller Managed">Seller Managed</option>
                    <option value="Platform Managed">Platform Managed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warehouse Location
                  </label>
                  <input
                    type="text"
                    name="warehouseLocation"
                    value={formData.warehouseLocation}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU Status
                  </label>
                  <select
                    name="skuStatus"
                    value={formData.skuStatus}
                    onChange={handleChange}
                    className={textareaClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </Section>

            {/* 5. Product Variants */}
            <Section
              title="5️⃣ Product Variants (Optional)"
              name="variants"
              isActive={activeSection === "variants"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["variants"] = el;
              }}
            >
              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Variant Type
                        </label>
                        <select
                          value={variant.type}
                          onChange={(e) =>
                            handleVariantChange(index, "type", e.target.value)
                          }
                          className={textareaClass}
                        >
                          <option value="">Select type</option>
                          <option value="Size">Size</option>
                          <option value="Color">Color</option>
                          <option value="Weight">Weight</option>
                          <option value="Pack Size">Pack Size</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Value
                        </label>
                        <input
                          type="text"
                          value={variant.value}
                          onChange={(e) =>
                            handleVariantChange(index, "value", e.target.value)
                          }
                          className={textareaClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Variant SKU
                        </label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) =>
                            handleVariantChange(index, "sku", e.target.value)
                          }
                          className={textareaClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price Override
                        </label>
                        <input
                          type="number"
                          value={variant.priceOverride}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "priceOverride",
                              e.target.value
                            )
                          }
                          className={textareaClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(index, "stock", e.target.value)
                          }
                          className={textareaClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={variant.image}
                          onChange={(e) =>
                            handleVariantChange(index, "image", e.target.value)
                          }
                          className={textareaClass}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="mt-2 text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Variant
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  + Add Variant
                </button>
              </div>
            </Section>

            {/* 6. Product Description */}
            <Section
              title="6️⃣ Product Description & Content"
              name="description"
              isActive={activeSection === "description"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["description"] = el;
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    rows={2}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Features (Min 5)
                  </label>
                  {formData.keyFeatures.map((feature, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      placeholder={`Feature ${index + 1}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 mb-2 bg-white text-gray-900"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Box Contents
                    </label>
                    <textarea
                      name="boxContents"
                      value={formData.boxContents}
                      onChange={handleChange}
                      rows={2}
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Instructions
                    </label>
                    <textarea
                      name="usageInstructions"
                      value={formData.usageInstructions}
                      onChange={handleChange}
                      rows={2}
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Care Instructions
                    </label>
                    <textarea
                      name="careInstructions"
                      value={formData.careInstructions}
                      onChange={handleChange}
                      rows={2}
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty Details
                    </label>
                    <textarea
                      name="warrantyDetails"
                      value={formData.warrantyDetails}
                      onChange={handleChange}
                      rows={2}
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty Duration
                    </label>
                    <input
                      type="text"
                      name="warrantyDuration"
                      value={formData.warrantyDuration}
                      onChange={handleChange}
                      placeholder="e.g., 1 Year"
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Window (Days)
                    </label>
                    <input
                      type="number"
                      name="returnWindow"
                      value={formData.returnWindow}
                      onChange={handleChange}
                      min="0"
                      className={textareaClass}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="returnable"
                    checked={formData.returnable}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Returnable Product
                  </label>
                </div>
              </div>
            </Section>

            {/* 7. Media & Assets */}
            <Section
              title="7️⃣ Media & Assets"
              name="media"
              isActive={activeSection === "media"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["media"] = el;
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images (Max 7) *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                      disabled={imageFiles.length >= 7}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center cursor-pointer ${imageFiles.length >= 7
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                        }`}
                    >
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG up to 5MB ({imageFiles.length}/7
                        uploaded)
                      </p>
                    </label>
                  </div>

                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Video URL
                  </label>
                  <input
                    type="url"
                    name="productVideo"
                    value={formData.productVideo}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Datasheet / Manual (URL)
                  </label>
                  <input
                    type="url"
                    name="datasheet"
                    value={formData.datasheet}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
              </div>
            </Section>

            {/* 8. Physical Attributes */}
            <Section
              title="8️⃣ Physical Attributes & Dimensions"
              name="physical"
              isActive={activeSection === "physical"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["physical"] = el;
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Net Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="netWeight"
                    value={formData.netWeight}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gross Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="grossWeight"
                    value={formData.grossWeight}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={textareaClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="fragile"
                    checked={formData.fragile}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Fragile Item
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="liquid"
                    checked={formData.liquid}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Liquid Item
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hazardous"
                    checked={formData.hazardous}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Hazardous Item
                  </label>
                </div>
              </div>
            </Section>

            {/* 9. Shipping & Logistics */}
            <Section
              title="9️⃣ Shipping & Logistics"
              name="shipping"
              isActive={activeSection === "shipping"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["shipping"] = el;
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Class
                  </label>
                  <select
                    name="shippingClass"
                    value={formData.shippingClass}
                    onChange={handleChange}
                    className={textareaClass}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Heavy">Heavy</option>
                    <option value="Oversized">Oversized</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Location
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      className={textareaClass.replace("w-full", "flex-1")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLocationPicker(true)}
                      className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500"
                      title="Pick from map"
                    >
                      <MapPin className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {/* Location Picker Modal moved outside to generic valid location later, or effectively it is fine inside a div, 
                    BUT the whole page content is wrapped in a <form> tag?
                    Let's check where the form starts. Line 250 in the original file probably.
                 */
                }
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Processing Time
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.processingTime.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          processingTime: {
                            ...formData.processingTime,
                            value: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      min="0"
                      className={textareaClass.replace("w-full", "flex-1")}
                    />
                    <select
                      value={formData.processingTime.unit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          processingTime: {
                            ...formData.processingTime,
                            unit: e.target.value as "hours" | "days",
                          },
                        })
                      }
                      className={textareaClass.replace("w-full", "w-32")}
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Charges
                  </label>
                  <select
                    name="shippingCharges"
                    value={formData.shippingCharges}
                    onChange={handleChange}
                    className={textareaClass}
                  >
                    <option value="Free">Free</option>
                    <option value="Flat">Flat Rate</option>
                    <option value="Weight-based">Weight-based</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="codAvailable"
                    checked={formData.codAvailable}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    COD Available
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="internationalShipping"
                    checked={formData.internationalShipping}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    International Shipping
                  </label>
                </div>
              </div>
            </Section>

            {/* 10. Compliance & Legal */}
            <Section
              title="🔟 Compliance & Legal"
              name="compliance"
              isActive={activeSection === "compliance"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["compliance"] = el;
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FSSAI Number (Food Products)
                  </label>
                  <input
                    type="text"
                    name="fssaiNumber"
                    value={formData.fssaiNumber}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Drug License Number (Medical)
                  </label>
                  <input
                    type="text"
                    name="drugLicenseNumber"
                    value={formData.drugLicenseNumber}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BIS / ISI Certification
                  </label>
                  <input
                    type="text"
                    name="bisCertification"
                    value={formData.bisCertification}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div className="flex items-center pt-7">
                  <input
                    type="checkbox"
                    name="expiryDateRequired"
                    checked={formData.expiryDateRequired}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Expiry Date Required
                  </label>
                </div>
                {formData.expiryDateRequired && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Manufacturing Date
                      </label>
                      <input
                        type="date"
                        name="manufacturingDate"
                        value={formData.manufacturingDate}
                        onChange={handleChange}
                        className={textareaClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className={textareaClass}
                      />
                    </div>
                  </>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Safety Disclaimer
                  </label>
                  <textarea
                    name="safetyDisclaimer"
                    value={formData.safetyDisclaimer}
                    onChange={handleChange}
                    rows={2}
                    className={textareaClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legal Disclaimer
                  </label>
                  <textarea
                    name="legalDisclaimer"
                    value={formData.legalDisclaimer}
                    onChange={handleChange}
                    rows={2}
                    className={textareaClass}
                  />
                </div>
              </div>
            </Section>

            {/* 11. SEO & Discoverability */}
            <Section
              title="1️⃣1️⃣ SEO & Discoverability"
              name="seo"
              isActive={activeSection === "seo"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["seo"] = el;
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Meta Description
                  </label>
                  <textarea
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    rows={2}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    name="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Keywords (Backend)
                  </label>
                  <input
                    type="text"
                    name="searchKeywords"
                    value={formData.searchKeywords}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="urlSlug"
                    value={formData.urlSlug}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
              </div>
            </Section>

            {/* 12. Offers & Promotions */}
            <Section
              title="1️⃣2️⃣ Offers & Promotions"
              name="offers"
              isActive={activeSection === "offers"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["offers"] = el;
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="eligibleForOffers"
                    checked={formData.eligibleForOffers}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Eligible for Platform Offers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="bankOfferEnabled"
                    checked={formData.bankOfferEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Bank Offer Enabled
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="flashSaleEligible"
                    checked={formData.flashSaleEligible}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Flash Sale Eligible
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="dealOfDayEligible"
                    checked={formData.dealOfDayEligible}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Deal of the Day Eligible
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="bulkDiscountEnabled"
                    checked={formData.bulkDiscountEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Bulk Purchase Discount (B2B)
                  </label>
                </div>
              </div>
            </Section>

            {/* 13. B2B / Wholesale */}
            <Section
              title="1️⃣3️⃣ B2B / Wholesale (Optional)"
              name="b2b"
              isActive={activeSection === "b2b"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["b2b"] = el;
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wholesale Price
                  </label>
                  <input
                    type="number"
                    name="wholesalePrice"
                    value={formData.wholesalePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Wholesale Quantity
                  </label>
                  <input
                    type="number"
                    name="minWholesaleQty"
                    value={formData.minWholesaleQty}
                    onChange={handleChange}
                    min="0"
                    className={textareaClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="tieredPricing"
                    checked={formData.tieredPricing}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Tiered Pricing
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="businessOnlyVisibility"
                    checked={formData.businessOnlyVisibility}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Business-only Visibility
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="gstInvoiceMandatory"
                    checked={formData.gstInvoiceMandatory}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    GST Invoice Mandatory
                  </label>
                </div>
              </div>
            </Section>

            {/* 14. Quality & Moderation */}
            <Section
              title="1️⃣4️⃣ Quality & Moderation"
              name="quality"
              isActive={activeSection === "quality"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["quality"] = el;
              }}
            >
              <div className="space-y-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="qualityCheckConfirmed"
                    checked={formData.qualityCheckConfirmed}
                    onChange={handleChange}
                    required
                    className="h-4 w-4 text-primary-600 rounded mt-1"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    <span className="font-semibold">
                      * I confirm that I have performed a self quality check
                    </span>{" "}
                    on this product and it meets all quality standards.
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="authenticityConfirmed"
                    checked={formData.authenticityConfirmed}
                    onChange={handleChange}
                    required
                    className="h-4 w-4 text-primary-600 rounded mt-1"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    <span className="font-semibold">
                      * Product Authenticity Declaration:
                    </span>{" "}
                    I declare that this product is genuine and authentic.
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="brandAuthorizationConfirmed"
                    checked={formData.brandAuthorizationConfirmed}
                    onChange={handleChange}
                    required
                    className="h-4 w-4 text-primary-600 rounded mt-1"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    <span className="font-semibold">
                      * Brand Authorization:
                    </span>{" "}
                    I confirm that I am authorized to sell products under this
                    brand.
                  </label>
                </div>
              </div>
            </Section>

            {/* 15. Product Status */}
            <Section
              title="1️⃣5️⃣ Product Status & Publishing"
              name="status"
              isActive={activeSection === "status"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                sectionRefs.current["status"] = el;
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={textareaClass}
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="pending">Submit for Approval</option>
                    <option value="active">Publish Immediately</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule Publish Date
                  </label>
                  <input
                    type="datetime-local"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Visibility
                  </label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleChange}
                    className={textareaClass}
                  >
                    <option value="Public">Public</option>
                    <option value="Business Only">Business Only</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>
            </Section>

            {/* 1️⃣6️⃣ Trust Badges */}
            <Section
              title="1️⃣6️⃣ Trust Badges"
              name="trustBadges"
              isActive={activeSection === "trustBadges"}
              onToggle={toggleSection}
              sectionRef={(el) => {
                if (el) sectionRefs.current["trustBadges"] = el;
              }}
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select trust badges to display on this product (assigned by admin)
                </p>

                {availableTrustBadges.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No trust badges assigned to your business yet. Contact admin to get badges assigned.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableTrustBadges.map((badge) => {
                      const isSelected = formData.trustBadges.includes(badge.id);
                      return (
                        <div
                          key={badge.id}
                          onClick={() => {
                            if (isSelected) {
                              setFormData(prev => ({
                                ...prev,
                                trustBadges: prev.trustBadges.filter(id => id !== badge.id)
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                trustBadges: [...prev.trustBadges, badge.id]
                              }));
                            }
                          }}
                          className={`cursor-pointer border rounded-lg p-4 transition-all duration-200 flex items-start gap-3
                            ${isSelected ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                          `}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors
                            ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-300 bg-white'}
                          `}>
                            {isSelected && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                              {badge.name}
                            </h3>
                            {badge.description && (
                              <p className={`text-xs mt-1 ${isSelected ? 'text-primary-700' : 'text-gray-500'}`}>
                                {badge.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Section>
          </form>
        </div>
        <LocationPickerModal
          isOpen={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSelect={(address, lat, lng) => {
            setFormData({
              ...formData,
              pickupLocation: address,
              pickupLocationCoordinates: { lat, lng }
            } as any);
          }}
          initialLat={formData.pickupLocationCoordinates?.lat}
          initialLng={formData.pickupLocationCoordinates?.lng}
        />
      </div>
    </ProtectedRoute >
  );
}
