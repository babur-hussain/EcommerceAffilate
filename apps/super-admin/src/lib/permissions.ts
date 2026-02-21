import {
    LayoutDashboard,
    Users,
    TrendingUp,
    FileText,
    Settings,
    Store,
    UserCheck,
    BarChart3,
    Tags,
    Sliders,
    Percent,
    ClipboardCheck,
    UsersRound,
    LucideIcon,
} from "lucide-react";
import { AdminRole } from "@/types";

// ─── Super Admin Email ───────────────────────────────────────────────
export const SUPER_ADMIN_EMAIL = "thebaburhussain2@gmail.com";

// ─── Permission Keys ─────────────────────────────────────────────────
export const PERMISSION_KEYS = [
    "dashboard",
    "review_products",
    "sellers",
    "influencers",
    "categories",
    "attributes",
    "users",
    "analytics",
    "offers",
    "delivery_rules",
    "reports",
    "homepage",
    "layout_manager",
    "settings",
    "team",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

// ─── Permission Labels (for UI display) ──────────────────────────────
export const PERMISSION_LABELS: Record<PermissionKey, string> = {
    dashboard: "Dashboard",
    review_products: "Review Products",
    sellers: "Sellers",
    influencers: "Influencers",
    categories: "Categories",
    attributes: "Attributes",
    users: "All Users",
    analytics: "Analytics",
    offers: "Steal Deals",
    delivery_rules: "Delivery Rules",
    reports: "Reports",
    homepage: "Layout Manager",
    layout_manager: "Advanced Layouts",
    settings: "Settings",
    team: "Team Management",
};

// ─── Default Permissions per Role ────────────────────────────────────
export const DEFAULT_PERMISSIONS: Record<AdminRole, PermissionKey[]> = {
    super_admin: [...PERMISSION_KEYS],
    manager: [
        "dashboard",
        "review_products",
        "sellers",
        "influencers",
        "categories",
        "attributes",
        "users",
        "analytics",
        "offers",
        "delivery_rules",
        "reports",
        "homepage",
        "layout_manager",
        "team",
    ],
    staff: ["dashboard", "review_products", "categories"],
};

// ─── Navigation Items with Permission Keys ───────────────────────────
export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    permission: PermissionKey;
}

export const NAVIGATION: NavItem[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "dashboard" },
    { name: "Review Products", href: "/admin/review-products", icon: ClipboardCheck, permission: "review_products" },
    { name: "Sellers", href: "/admin/sellers", icon: Store, permission: "sellers" },
    { name: "Influencers", href: "/admin/influencers", icon: UserCheck, permission: "influencers" },
    { name: "Categories", href: "/admin/categories", icon: Tags, permission: "categories" },
    { name: "Attributes", href: "/admin/attributes", icon: Sliders, permission: "attributes" },
    { name: "All Users", href: "/admin/users", icon: Users, permission: "users" },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, permission: "analytics" },
    { name: "Steal Deals", href: "/admin/offers", icon: Percent, permission: "offers" },
    { name: "Delivery Rules", href: "/admin/delivery-rules", icon: TrendingUp, permission: "delivery_rules" },
    { name: "Reports", href: "/admin/reports", icon: FileText, permission: "reports" },
    { name: "Layout Manager", href: "/admin/homepage", icon: LayoutDashboard, permission: "homepage" },
    { name: "Advanced Layouts", href: "/admin/layout-manager", icon: Sliders, permission: "layout_manager" },
    { name: "Settings", href: "/admin/settings", icon: Settings, permission: "settings" },
    { name: "Team", href: "/admin/team", icon: UsersRound, permission: "team" },
];

// ─── Helpers ─────────────────────────────────────────────────────────
export function isSuperAdmin(email: string | null | undefined): boolean {
    return email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

export function hasPermission(
    userPermissions: PermissionKey[],
    required: PermissionKey
): boolean {
    return userPermissions.includes(required);
}

/** Given a pathname, find which permission key is required */
export function getRequiredPermission(pathname: string): PermissionKey | null {
    // Exact match first
    const exact = NAVIGATION.find((n) => n.href === pathname);
    if (exact) return exact.permission;

    // Prefix match for sub-routes (e.g., /admin/sellers/[id])
    const prefix = NAVIGATION.find(
        (n) => n.href !== "/admin" && pathname.startsWith(n.href + "/")
    );
    if (prefix) return prefix.permission;

    // /admin itself → dashboard
    if (pathname === "/admin") return "dashboard";

    return null;
}
