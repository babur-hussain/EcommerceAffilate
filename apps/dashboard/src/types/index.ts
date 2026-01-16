export type UserRole = 'ADMIN' | 'SELLER_OWNER' | 'SELLER_MANAGER' | 'SELLER_STAFF' | 'INFLUENCER' | 'CUSTOMER' | 'BUSINESS_OWNER' | 'BUSINESS_MANAGER' | 'BUSINESS_STAFF';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  businessId?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface Business {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  category: string;
  brandId?: string;
  businessId: string;
  isActive: boolean;
  pickupLocation?: string;
  pickupLocationCoordinates?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  businessId: string;
}

export interface Sponsorship {
  _id: string;
  businessId: string;
  productIds: string[];
  totalBudget: number;
  dailyBudget: number;
  spentAmount: number;
  status: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'REJECTED';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  revenue: number;
  orders: number;
  sponsoredRevenue: number;
  organicRevenue: number;
  influencerPayouts: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    revenue: number;
    orders: number;
  }>;
  revenueTimeSeries: Array<{
    date: string;
    revenue: number;
  }>;
}

export interface HomepageSection {
  _id?: string;
  type: 'HERO' | 'CATEGORIES' | 'SPONSORED_PRODUCTS' | 'INFLUENCER_PICKS' | 'TRENDING' | 'CATEGORY_PRODUCTS' | 'DEALS' | 'RECOMMENDED' | 'FEATURED_BRANDS' | 'REFERRAL' | 'CONTENT';
  title: string;
  enabled: boolean;
  order: number;
  config: Record<string, any>;
}

export interface HomepageConfig {
  _id: string;
  sections: HomepageSection[];
  updatedAt: string;
}

export interface AuditLog {
  _id: string;
  userId: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}
