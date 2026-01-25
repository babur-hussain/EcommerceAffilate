"use client";

import { Suspense } from "react";
import { useAffiliateTracking } from "@/hooks/useAffiliateTracking";

/**
 * Inner component that uses useSearchParams via useAffiliateTracking
 */
function AffiliateTrackerInner() {
    useAffiliateTracking();
    return null;
}

/**
 * Global component to handle affiliate tracking logic.
 * This should be mounted in the root layout to ensure tracking works
 * on any page entrance.
 */
export default function AffiliateTracker() {
    return (
        <Suspense fallback={null}>
            <AffiliateTrackerInner />
        </Suspense>
    );
}
