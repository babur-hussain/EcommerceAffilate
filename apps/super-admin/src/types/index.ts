export interface User {
  uid: string;
  email: string;
  name?: string;
  role: "SUPER_ADMIN" | "SELLER_OWNER" | "INFLUENCER" | "CUSTOMER";
  isActive: boolean;
}

export interface SuperAdminProfile extends User {
  permissions: string[];
}

export interface Seller {
  _id: string;
  uid: string;
  email: string;
  name: string;
  role: "SELLER_OWNER";
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  business?: {
    _id: string;
    userId: string;
    firebaseUid: string;
    accountType: 'new' | 'convert';
    businessIdentity: {
      legalBusinessName: string;
      tradeName: string;
      businessType: 'Proprietorship' | 'Partnership' | 'LLP' | 'Private Limited' | 'Public Limited' | 'Trust / NGO';
      natureOfBusiness: 'Manufacturer' | 'Wholesaler' | 'Distributor' | 'Retailer' | 'Service Provider';
      yearOfEstablishment: number;
    };
    ownerDetails: {
      fullName: string;
      designation: string;
      mobileNumber: string;
      email: string;
      dateOfBirth?: string;
      gender?: string;
      governmentIdType: 'Aadhaar' | 'PAN' | 'Passport';
      governmentIdNumber: string;
      idProofUrl?: string;
    };
    addresses: {
      registered: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        district?: string;
        state: string;
        country: string;
        pincode: string;
      };
      operational: {
        sameAsRegistered: boolean;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        district?: string;
        state?: string;
        country?: string;
        pincode?: string;
      };
      warehouse?: {
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        district?: string;
        state?: string;
        country?: string;
        pincode?: string;
      };
    };
    taxLegal: {
      gstinNumber: string;
      gstRegistrationType: 'Regular' | 'Composition';
      gstCertificateUrl?: string;
      panNumber: string;
      panCardUrl?: string;
      cinLlpin?: string;
      shopEstablishmentUrl?: string;
      msmeUdyamNumber?: string;
    };
    bankDetails: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      accountType: 'Savings' | 'Current';
      cancelledChequeUrl?: string;
      settlementCycle: 'Daily' | 'Weekly' | 'Bi-Weekly';
    };
    verification?: {
      businessAddressProofUrl?: string;
      selfieUrl?: string;
      signatureUrl?: string;
      authorizationLetterUrl?: string;
      isVerified: boolean;
      verifiedAt?: string;
    };
    storeProfile: {
      logoUrl?: string;
      description?: string;
      categories: string[];
      brandOwnership: 'Own Brand' | 'Authorized Seller' | 'Reseller';
      brandAuthorizationUrl?: string;
      websiteUrl?: string;
      socialMediaLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
      };
    };
    logistics: {
      pickupAddress?: string;
      pickupTimeSlot?: string;
      packagingType: 'Seller Packed' | 'Platform Packed';
      courierPreference?: string;
      returnAddress?: string;
      returnPolicyAccepted: boolean;
    };
    compliance: {
      sellerAgreementAccepted: boolean;
      platformPoliciesAccepted: boolean;
      taxResponsibilityAccepted: boolean;
      acceptedAt: string;
    };
    advanced?: {
      multipleWarehouses?: boolean;
      apiAccessRequested?: boolean;
      erpIntegration?: string;
      dedicatedAccountManager?: boolean;
    };
    isActive: boolean;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    trustBadges?: string[];
    assignedAttributes?: string[];
    createdAt: string;
    updatedAt: string;
  };
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    commissionPaid: number;
  };
}

export interface Influencer {
  _id: string;
  uid: string;
  email: string;
  name: string;
  role: "INFLUENCER";
  phoneNumber?: string;
  referralCode: string;
  isActive: boolean;
  createdAt: string;
  socialMedia?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  followers?: {
    instagram?: number;
    youtube?: number;
    twitter?: number;
  };
  stats: {
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
  };
}

export interface PlatformMetrics {
  overview: {
    totalUsers: number;
    totalSellers: number;
    totalInfluencers: number;
    totalCustomers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalCommissions: number;
  };
  growth: {
    usersGrowth: number;
    sellersGrowth: number;
    influencersGrowth: number;
    revenueGrowth: number;
  };
  recent: {
    newUsers: number;
    newOrders: number;
    pendingApprovals: number;
  };
}

export interface Transaction {
  _id: string;
  type: "ORDER" | "COMMISSION" | "PAYOUT";
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  userId: string;
  userName: string;
  userRole: string;
  createdAt: string;
  details: any;
}

export interface AuditLog {
  _id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: "USER" | "BUSINESS" | "PRODUCT" | "ORDER" | "SYSTEM";
  targetId?: string;
  details: any;
  createdAt: string;
}

export interface Report {
  period: string;
  users: {
    total: number;
    new: number;
    active: number;
  };
  orders: {
    total: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
  commissions: {
    total: number;
    paid: number;
    pending: number;
  };
  topSellers: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
  }>;
  topInfluencers: Array<{
    id: string;
    name: string;
    earnings: number;
    conversions: number;
  }>;
  // ... existing fields
  platformCommission?: number;
  influencerCommission?: number;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  mrp?: number;
  costPrice?: number;
  category: string;
  subCategory?: string;
  brand?: string;
  brandName?: string;
  manufacturerName?: string;
  countryOfOrigin?: string;
  modelName?: string;
  sku?: string;
  hsnCode?: string;
  productType?: string;
  productCondition?: string;
  upc?: string;
  internalCode?: string;
  batchNumber?: string;
  serialNumberRequired?: boolean;
  image: string;
  images?: string[];
  primaryImage: string;
  thumbnailImage?: string;
  productVideo?: string;
  stock: number;
  minOrderQty?: number;
  maxOrderQty?: number;
  lowStockThreshold?: number;
  inventoryType?: string;
  warehouseLocation?: string;
  weight?: number;
  netWeight?: string;
  grossWeight?: string;
  dimensions?: { length: number; breadth: number; height: number };
  fragile?: boolean;
  liquid?: boolean;
  hazardous?: boolean;
  warrantyDetails?: string;
  warrantyDuration?: string;
  shippingCharges?: number;
  shippingClass?: string;
  isCodAvailable?: boolean;
  codAvailable?: boolean;
  processingTime?: { value: number; unit: string };
  pickupLocation?: string;
  internationalShipping?: boolean;
  protectPromiseFee?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  seoKeywords?: string;
  searchKeywords?: string;
  urlSlug?: string;
  saleStartDate?: string;
  saleEndDate?: string;
  offers?: any[];
  lastChanceOffers?: any[];
  fees?: any[];
  trustBadges?: string[];
  keyFeatures?: string[];
  boxContents?: string;
  usageInstructions?: string;
  careInstructions?: string;
  returnable?: boolean;
  returnWindow?: number;
  gstRate?: number;
  taxInclusive?: boolean;
  discountType?: string;
  discountValue?: number;
  fssaiNumber?: string;
  drugLicenseNumber?: string;
  bisCertification?: string;
  expiryDateRequired?: boolean;
  manufacturingDate?: string;
  expiryDate?: string;
  safetyDisclaimer?: string;
  legalDisclaimer?: string;
  eligibleForOffers?: boolean;
  bankOfferEnabled?: boolean;
  flashSaleEligible?: boolean;
  dealOfDayEligible?: boolean;
  bulkDiscountEnabled?: boolean;
  wholesalePrice?: number;
  minWholesaleQty?: number;
  tieredPricing?: boolean;
  businessOnlyVisibility?: boolean;
  gstInvoiceMandatory?: boolean;
  qualityCheckConfirmed?: boolean;
  authenticityConfirmed?: boolean;
  brandAuthorizationConfirmed?: boolean;
  status?: string;
  publishDate?: string;
  visibility?: string;
  variants?: any[];
  attributes?: any[];
  createdAt: string;
  platformCommission?: number;
  influencerCommission?: number;
  isActive?: boolean;
  approvalStatus?: string;
  isSponsored?: boolean;
}
