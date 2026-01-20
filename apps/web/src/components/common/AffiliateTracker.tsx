"use client";

import { useAffiliateTracking } from "@/hooks/useAffiliateTracking";

/**
 * Global component to handle affiliate tracking logic.
 * This should be mounted in the root layout to ensure tracking works
 * on any page entrance.
 */
export default function AffiliateTracker() {
    // This hook automatically captures ?ref=CODE from URL
    // and stores it in localStorage
    useAffiliateTracking();

    return null;
}
