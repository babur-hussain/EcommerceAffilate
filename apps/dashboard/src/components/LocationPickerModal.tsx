import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { X, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (address: string, lat: number, lng: number) => void;
    initialAddress?: string;
}

const containerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629 // India center
};

// Libraries must be defined outside component to avoid re-loading
const libraries: "places"[] = ["places"];

export default function LocationPickerModal({ isOpen, onClose, onSelect }: LocationPickerModalProps) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [isLocating, setIsLocating] = useState(false);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries
    });

    const headersRef = useRef<any>(null);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const onMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPosition({ lat, lng });

            // Reverse Geocoding
            try {
                const geocoder = new google.maps.Geocoder();
                const response = await geocoder.geocode({ location: { lat, lng } });
                if (response.results[0]) {
                    setSelectedAddress(response.results[0].formatted_address);
                }
            } catch (error) {
                console.error("Geocoding failed:", error);
            }
        }
    }, []);

    const handleConfirm = () => {
        if (markerPosition && selectedAddress) {
            onSelect(selectedAddress, markerPosition.lat, markerPosition.lng);
            onClose();
        } else {
            toast.error("Please select a location on the map");
        }
    };

    const handleUseCurrentLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const pos = { lat, lng };

                    setMarkerPosition(pos);
                    map?.panTo(pos);
                    map?.setZoom(15);

                    try {
                        const geocoder = new google.maps.Geocoder();
                        const response = await geocoder.geocode({ location: pos });
                        if (response.results[0]) {
                            setSelectedAddress(response.results[0].formatted_address);
                        }
                    } catch (error) {
                        console.error("Geocoding failed:", error);
                    } finally {
                        setIsLocating(false);
                    }
                },
                (error) => {
                    console.error("Error getting location", error);
                    toast.error("Could not get your location");
                    setIsLocating(false);
                }
            );
        } else {
            toast.error("Geolocation is not supported by your browser");
            setIsLocating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Select Pickup Location</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-4 flex gap-2">
                        <input
                            type="text"
                            value={selectedAddress}
                            readOnly
                            placeholder="Selected address will appear here"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium text-sm"
                        />
                        <button
                            onClick={handleUseCurrentLocation}
                            disabled={isLocating}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                            {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                            Use Current
                        </button>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-gray-300">
                        {isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={defaultCenter}
                                zoom={5}
                                onLoad={onMapLoad}
                                onUnmount={onUnmount}
                                onClick={onMapClick}
                                options={{
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                }}
                            >
                                {markerPosition && <Marker position={markerPosition} />}
                            </GoogleMap>
                        ) : (
                            <div className="h-[400px] flex items-center justify-center bg-gray-100">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
}
