"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Fix for default Leaflet marker icons in Next.js/React
const icon = L.icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
// Since we don't have these images locally yet, we can use CDN or ignore for a moment.
// Or better, use a custom div icon or the default one from unpkg.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (address: string, lat: number, lng: number) => void;
    initialAddress?: string;
    initialLat?: number;
    initialLng?: number;
}

const LocationMarker = ({ position, setPosition, setAddress }: any) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            fetchAddress(e.latlng.lat, e.latlng.lng, setAddress);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position} />
    );
};

// Nominatim Geocoding
const fetchAddress = async (lat: number, lng: number, setAddress: (addr: string) => void) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.display_name) {
            setAddress(data.display_name);
        }
    } catch (error) {
        console.error("Geocoding failed", error);
        toast.error("Failed to fetch address details");
    }
};

const searchAddress = async (query: string): Promise<{ lat: number; lon: number; display_name: string } | null> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data && data.length > 0) {
            return data[0];
        }
        return null;
    } catch (error) {
        console.error("Search failed", error);
        return null;
    }
};


export default function LocationPickerModal({ isOpen, onClose, onSelect, initialLat, initialLng }: LocationPickerModalProps) {
    const [position, setPosition] = useState<L.LatLngExpression | null>(
        initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
    );
    const [address, setAddress] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Default center (India)
    const defaultCenter = { lat: 20.5937, lng: 78.9629 };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        const result = await searchAddress(searchQuery);
        setIsSearching(false);

        if (result) {
            const newPos = { lat: parseFloat(result.lat as any), lng: parseFloat(result.lon as any) };
            setPosition(newPos);
            setAddress(result.display_name);
        } else {
            toast.error("Location not found");
        }
    };

    const handleUseCurrentLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition({ lat: latitude, lng: longitude });
                    fetchAddress(latitude, longitude, setAddress);
                    setIsLocating(false);
                },
                (err) => {
                    console.error("Geolocation Error:", err);
                    let msg = "Could not get your location.";
                    if (err.code === 1) msg = "Location permission denied. Please enable it in browser settings.";
                    if (err.code === 2) msg = "Location unavailable. Please try searching for your city/address instead.";
                    if (err.code === 3) msg = "Location request timed out. Please try user search.";

                    toast.error(msg);
                    setIsLocating(false);
                }
            );
        } else {
            setIsLocating(false);
            toast.error("Geolocation not supported");
        }
    };

    const handleConfirm = () => {
        if (position && address) {
            // Leaflet position is { lat, lng }
            const lat = (position as any).lat;
            const lng = (position as any).lng;
            onSelect(address, lat, lng);
            onClose();
        } else {
            toast.error("Please select a location");
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

                <div className="p-4 space-y-4">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search for a city or area..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 placeholder:text-gray-400"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                        </button>
                    </form>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={address}
                            readOnly
                            placeholder="Selected address will appear here"
                            className="flex-1 px-3 py-2 border border-blue-200 bg-blue-50 text-blue-900 rounded-lg text-sm"
                        />
                        <button
                            onClick={handleUseCurrentLocation}
                            disabled={isLocating}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                            {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                            Use Current
                        </button>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-gray-300 h-[400px] relative z-0">
                        <MapContainer
                            center={position || defaultCenter}
                            zoom={5}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
                        </MapContainer>
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
