export const PERMISSIONS = {
    // Services
    SERVICES_CREATE: 'services.create',
    SERVICES_EDIT: 'services.edit',
    SERVICES_DELETE: 'services.delete',
    SERVICES_PUBLISH: 'services.publish',

    // Bookings
    BOOKINGS_VIEW: 'bookings.view',
    BOOKINGS_EDIT: 'bookings.edit', // Modify status/date
    BOOKINGS_OVERRIDE: 'bookings.override', // Price/slot override

    // Pricing
    PRICING_VIEW: 'pricing.view',
    PRICING_MODIFY: 'pricing.modify',

    // SDUI (Layouts)
    SDUI_VIEW: 'sdui.view',
    SDUI_EDIT: 'sdui.edit',
    SDUI_PUBLISH: 'sdui.publish',

    // Analytics
    ANALYTICS_VIEW: 'analytics.view',
    ANALYTICS_EXPORT: 'analytics.export',

    // Users & Roles (RBAC)
    RBAC_ROLE_CREATE: 'rbac.role.create',
    RBAC_ROLE_EDIT: 'rbac.role.edit',
    RBAC_ROLE_DELETE: 'rbac.role.delete',
    RBAC_USER_ASSIGN: 'rbac.user.assign',

    // Audit
    AUDIT_VIEW: 'audit.view',
};

export const PERMISSION_GROUPS = {
    Services: [
        PERMISSIONS.SERVICES_CREATE,
        PERMISSIONS.SERVICES_EDIT,
        PERMISSIONS.SERVICES_DELETE,
        PERMISSIONS.SERVICES_PUBLISH
    ],
    Bookings: [
        PERMISSIONS.BOOKINGS_VIEW,
        PERMISSIONS.BOOKINGS_EDIT,
        PERMISSIONS.BOOKINGS_OVERRIDE
    ],
    Pricing: [
        PERMISSIONS.PRICING_VIEW,
        PERMISSIONS.PRICING_MODIFY
    ],
    SDUI: [
        PERMISSIONS.SDUI_VIEW,
        PERMISSIONS.SDUI_EDIT,
        PERMISSIONS.SDUI_PUBLISH
    ],
    Analytics: [
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.ANALYTICS_EXPORT
    ],
    RBAC: [
        PERMISSIONS.RBAC_ROLE_CREATE,
        PERMISSIONS.RBAC_ROLE_EDIT,
        PERMISSIONS.RBAC_ROLE_DELETE,
        PERMISSIONS.RBAC_USER_ASSIGN,
        PERMISSIONS.AUDIT_VIEW,
    ]
};
