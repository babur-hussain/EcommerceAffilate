'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Tag, 
  Package, 
  TrendingUp, 
  BarChart3, 
  Settings,
  Store,
  Megaphone,
  FileText,
  Home,
  Link as LinkIcon,
  DollarSign,
  Activity
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navigationConfig: NavItem[] = [
  // Admin routes
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['ADMIN'] },
  { name: 'Sellers', href: '/admin/sellers', icon: Store, roles: ['ADMIN'] },
  { name: 'Brands', href: '/admin/brands', icon: Tag, roles: ['ADMIN'] },
  { name: 'Products', href: '/admin/products', icon: Package, roles: ['ADMIN'] },
  { name: 'Influencers', href: '/admin/influencers', icon: Users, roles: ['ADMIN'] },
  { name: 'Sponsorships', href: '/admin/sponsorships', icon: Megaphone, roles: ['ADMIN'] },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['ADMIN'] },
  { name: 'Homepage CMS', href: '/admin/homepage', icon: Home, roles: ['ADMIN'] },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText, roles: ['ADMIN'] },
  
  // Seller routes
  { name: 'Dashboard', href: '/seller', icon: LayoutDashboard, roles: ['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF'] },
  { name: 'Brands', href: '/seller/brands', icon: Tag, roles: ['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF'] },
  { name: 'Products', href: '/seller/products', icon: Package, roles: ['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF'] },
  { name: 'Inventory', href: '/seller/inventory', icon: ShoppingBag, roles: ['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF'] },
  { name: 'Orders', href: '/seller/orders', icon: FileText, roles: ['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF'] },
  { name: 'Sponsorships', href: '/seller/sponsorships', icon: Megaphone, roles: ['SELLER_OWNER', 'SELLER_MANAGER'] },
  { name: 'Analytics', href: '/seller/analytics', icon: BarChart3, roles: ['SELLER_OWNER', 'SELLER_MANAGER'] },
  { name: 'Influencer Impact', href: '/seller/influencers', icon: TrendingUp, roles: ['SELLER_OWNER', 'SELLER_MANAGER'] },
  
  // Influencer routes
  { name: 'Dashboard', href: '/influencer', icon: LayoutDashboard, roles: ['INFLUENCER'] },
  { name: 'My Links', href: '/influencer/links', icon: LinkIcon, roles: ['INFLUENCER'] },
  { name: 'Earnings', href: '/influencer/earnings', icon: DollarSign, roles: ['INFLUENCER'] },
  { name: 'Performance', href: '/influencer/performance', icon: Activity, roles: ['INFLUENCER'] },
];

interface SidebarProps {
  userRole: UserRole;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = navigationConfig.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold">ShopPlatform</h1>
        <p className="text-sm text-gray-400 mt-1">Business Dashboard</p>
      </div>

      <nav className="mt-6 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && item.href !== '/seller' && item.href !== '/influencer' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          Role: <span className="text-gray-300">{userRole}</span>
        </div>
      </div>
    </aside>
  );
}
