import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

export interface LocationAddress {
    city?: string | null;
    district?: string | null;
    street?: string | null;
    region?: string | null;
    country?: string | null;
    postalCode?: string | null;
    name?: string | null;
    formattedAddress?: string | null;
}

export interface UseUserLocationResult {
    location: Location.LocationObject | null;
    address: LocationAddress | null;
    errorMsg: string | null;
    loading: boolean;
    fetchLocation: () => Promise<void>;
}

export function useUserLocation(): UseUserLocationResult {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [address, setAddress] = useState<LocationAddress | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchLocation = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert('Permission Denied', 'Please allow location access to show your current address.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setLocation(location);

            // Reverse geocode
            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (reverseGeocode && reverseGeocode.length > 0) {
                const result = reverseGeocode[0];
                const formattedAddr = [
                    result.street,
                    result.city,
                    result.region
                ].filter(Boolean).join(', ');

                setAddress({
                    city: result.city,
                    district: result.district,
                    street: result.street,
                    region: result.region,
                    country: result.country,
                    postalCode: result.postalCode,
                    name: result.name,
                    formattedAddress: formattedAddr
                });
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            setErrorMsg('Error fetching location');
        } finally {
            setLoading(false);
        }
    }, []);

    // Optionally auto-fetch on mount, or leave it to user action. 
    // Let's auto-fetch on mount for better UX as per "fetch the user's location and display".
    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    return {
        location,
        address,
        errorMsg,
        loading,
        fetchLocation
    };
}
