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
    businessName: string;
    businessType: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
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
}
