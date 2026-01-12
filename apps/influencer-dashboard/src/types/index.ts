export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: "influencer";
}

export interface InfluencerProfile {
  _id: string;
  uid: string;
  name: string;
  email: string;
  phoneNumber?: string;
  socialMedia?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
  };
  followers?: {
    instagram?: number;
    youtube?: number;
    twitter?: number;
    facebook?: number;
    tiktok?: number;
  };
  categories?: string[];
  bio?: string;
  profileImage?: string;
  referralCode: string;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attribution {
  _id: string;
  influencerId: string;
  referralCode: string;
  productId: string;
  product?: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  customerId?: string;
  customerEmail?: string;
  clickTimestamp: string;
  conversionTimestamp?: string;
  orderId?: string;
  orderAmount?: number;
  commissionRate: number;
  commissionAmount?: number;
  status: "click" | "conversion" | "paid";
  metadata?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  createdAt: string;
}

export interface InfluencerStats {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  averageOrderValue: number;
  totalOrders: number;
}

export interface ClicksOverTime {
  date: string;
  clicks: number;
  conversions: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  productImage: string;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
}

export interface Payout {
  _id: string;
  influencerId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  method: "bank_transfer" | "upi" | "paypal";
  accountDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    paypalEmail?: string;
  };
  transactionId?: string;
  attributionIds: string[];
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateLink {
  _id: string;
  influencerId: string;
  productId: string;
  product?: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  url: string;
  shortCode: string;
  clicks: number;
  conversions: number;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardMetrics {
  today: {
    clicks: number;
    conversions: number;
    earnings: number;
  };
  thisWeek: {
    clicks: number;
    conversions: number;
    earnings: number;
  };
  thisMonth: {
    clicks: number;
    conversions: number;
    earnings: number;
  };
  allTime: InfluencerStats;
}
