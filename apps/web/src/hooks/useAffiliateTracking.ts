"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

const AFFILIATE_STORAGE_KEY = "affiliate_ref_code";
const AFFILIATE_EXPIRY_KEY = "affiliate_ref_expiry";
const AFFILIATE_EXPIRY_DAYS = 30;

interface AffiliateData {
    code: string;
    expiry: number;
}

/**
 * Hook to track affiliate referral codes from URL params
 * Stores the referral code in localStorage for 30 days
 */
export function useAffiliateTracking() {
    const searchParams = useSearchParams();

    // Capture referral code from URL on mount
    useEffect(() => {
        const refCode = searchParams.get("ref");

        if (refCode) {
            // Store referral code with 30-day expiry
            const expiryDate = Date.now() + AFFILIATE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

            try {
                localStorage.setItem(AFFILIATE_STORAGE_KEY, refCode.toUpperCase());
                localStorage.setItem(AFFILIATE_EXPIRY_KEY, expiryDate.toString());
                console.log(`🔗 Affiliate referral code stored: ${refCode}`);
            } catch (err) {
                console.error("Failed to store affiliate code:", err);
            }
        }
    }, [searchParams]);

    // Get stored referral code (checks expiry)
    const getAffiliateCode = useCallback((): string | null => {
        try {
            const code = localStorage.getItem(AFFILIATE_STORAGE_KEY);
            const expiryStr = localStorage.getItem(AFFILIATE_EXPIRY_KEY);

            if (!code || !expiryStr) {
                return null;
            }

            const expiry = parseInt(expiryStr, 10);

            // Check if expired
            if (Date.now() > expiry) {
                // Clear expired data
                localStorage.removeItem(AFFILIATE_STORAGE_KEY);
                localStorage.removeItem(AFFILIATE_EXPIRY_KEY);
                console.log("🔗 Affiliate code expired, cleared");
                return null;
            }

            return code;
        } catch (err) {
            console.error("Failed to get affiliate code:", err);
            return null;
        }
    }, []);

    // Clear affiliate code (after successful order)
    const clearAffiliateCode = useCallback(() => {
        try {
            localStorage.removeItem(AFFILIATE_STORAGE_KEY);
            localStorage.removeItem(AFFILIATE_EXPIRY_KEY);
            console.log("🔗 Affiliate code cleared after order");
        } catch (err) {
            console.error("Failed to clear affiliate code:", err);
        }
    }, []);

    return {
        getAffiliateCode,
        clearAffiliateCode,
    };
}

/**
 * Get affiliate code without hook (for use in event handlers)
 */
export function getStoredAffiliateCode(): string | null {
    try {
        const code = localStorage.getItem(AFFILIATE_STORAGE_KEY);
        const expiryStr = localStorage.getItem(AFFILIATE_EXPIRY_KEY);

        if (!code || !expiryStr) {
            return null;
        }

        const expiry = parseInt(expiryStr, 10);

        if (Date.now() > expiry) {
            localStorage.removeItem(AFFILIATE_STORAGE_KEY);
            localStorage.removeItem(AFFILIATE_EXPIRY_KEY);
            return null;
        }

        return code;
    } catch {
        return null;
    }
}

/**
 * Clear affiliate code (for use after order placement)
 */
export function clearStoredAffiliateCode(): void {
    try {
        localStorage.removeItem(AFFILIATE_STORAGE_KEY);
        localStorage.removeItem(AFFILIATE_EXPIRY_KEY);
    } catch {
        // Ignore errors
    }
}
