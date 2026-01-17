import axios from 'axios';

interface DistanceResult {
    distanceInKm: number | null;
    durationInSeconds: number | null;
    error?: string;
}

// Haversine Formula for free distance calculation (Straight Line)
export const calculateHaversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
};

// Nominatim Geocoding (Free)
// Note: Respect usage policy (max 1 req/sec, specific user-agent)
export const geocodePincode = async (pincode: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(pincode)}&country=India&format=json&limit=1`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'EcommerceEarn/1.0 (internal-delivery-calc)'
            }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon)
            };
        }
        return null;
    } catch (error) {
        console.error(`Geocoding failed for pincode ${pincode}:`, error);
        return null;
    }
};

export const getDistanceMatrix = async (
    originPincode: string,
    destinationPincode: string
): Promise<DistanceResult> => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            console.warn('GOOGLE_MAPS_API_KEY is not defined. Using fallback distance.');
            return { distanceInKm: null, durationInSeconds: null, error: 'API Key missing' };
        }

        // Google Maps Distance Matrix API
        const origin = `${originPincode}, India`;
        const destination = `${destinationPincode}, India`;

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
            origin
        )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.status !== 'OK') {
            console.error('Google Maps API Error:', data.status, data.error_message);
            return { distanceInKm: null, durationInSeconds: null, error: data.status };
        }

        const row = data.rows[0];
        const element = row.elements[0];

        if (element.status !== 'OK') {
            return { distanceInKm: null, durationInSeconds: null, error: element.status };
        }

        const distanceInKm = element.distance.value / 1000;
        const durationInSeconds = element.duration.value;

        return { distanceInKm, durationInSeconds };
    } catch (error) {
        console.error('Error fetching distance from Google Maps:', error);
        return { distanceInKm: null, durationInSeconds: null, error: 'Network or API error' };
    }
};

