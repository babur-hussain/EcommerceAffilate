
export const estimateDeliveryTime = (origin: string, destination: string): string => {
    if (!origin || !destination) return "3-5 Days";

    // Normalize
    const originStr = String(origin).trim();
    const destStr = String(destination).trim();

    // Check if both are numeric (pincodes)
    const isOriginNumeric = /^\d+$/.test(originStr);
    const isDestNumeric = /^\d+$/.test(destStr);

    if (isOriginNumeric && isDestNumeric) {
        if (originStr === destStr) {
            return "90 Mins"; // Hyperlocal
        }
        if (originStr.substring(0, 3) === destStr.substring(0, 3)) {
            return "Tomorrow"; // Same city/district
        }
        if (originStr.substring(0, 2) === destStr.substring(0, 2)) {
            return "2 Days"; // Same region
        }
        // Different region
        return "4-5 Days";
    }

    // Fallback if not pincodes (e.g. city names, though comparison is hard without DB)
    return "3-5 Days";
};
