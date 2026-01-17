import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/lib/api';
import { useAuth } from '../../src/context/AuthContext';
import { useUserLocation } from '../../src/hooks/useUserLocation';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

// 2 Steps: 'MAP_SELECT' -> 'DETAILS_FORM'
type Step = 'MAP_SELECT' | 'DETAILS_FORM';

export default function AddAddressScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { fetchLocation, address: gpsAddress, location, loading: gpsLoading } = useUserLocation();

    const mapRef = useRef<MapView>(null);
    const currentRegion = useRef<any>(null);

    const [step, setStep] = useState<Step>('MAP_SELECT');
    const [loading, setLoading] = useState(false);

    // New State for "Interactive Mode"
    const [isMapActive, setIsMapActive] = useState(false);

    const [regionName, setRegionName] = useState('Locating...');
    const [fullAddress, setFullAddress] = useState('');

    // Form State
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        pincode: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        landmark: '',
        country: 'India',
        isDefault: false
    });

    const handleChange = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    // Animate map to user location when fetched
    useEffect(() => {
        if (location && mapRef.current) {
            const region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005, // Zoom in closer
                longitudeDelta: 0.005,
            };
            mapRef.current.animateToRegion(region, 1000);
            currentRegion.current = region;
        }
    }, [location]);

    const handleUseCurrentLocation = async () => {
        setLoading(true);
        try {
            await fetchLocation(); // Triggers location update
            setIsMapActive(true); // Switch to Interactive Mode
        } finally {
            setLoading(false);
        }
    };

    const handleRecenter = () => {
        if (location && mapRef.current) {
            const region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            mapRef.current.animateToRegion(region, 1000);
        } else {
            fetchLocation();
        }
    };

    const handleAwayFromLocation = () => {
        // "Away from my location" logic usually implies manual entry or searching
        // For now, let's just go to the form details directly as per previous behavior,
        // OR we could enable the map to let them search.
        // Based on "Away from my location" button usually meaning "I am not there", 
        // effectively manual entry is the safest bet or just active map to search.
        // Let's go to Details Form for manual entry.
        setStep('DETAILS_FORM');
    };

    // Proceed to form from the "Deliver To" sheet
    const handleProceedToDetails = () => {
        setStep('DETAILS_FORM');
    };

    const handleRegionChangeComplete = async (region: any) => {
        currentRegion.current = region;
        try {
            // Reverse geocode center of map to get area name for the tag
            const result = await Location.reverseGeocodeAsync({
                latitude: region.latitude,
                longitude: region.longitude
            });
            if (result && result.length > 0) {
                const r = result[0];
                const area = r.district || r.city || r.name || 'Unknown Location';
                setRegionName(area);

                // Construct full address for the sheet
                const addressParts = [
                    r.name !== r.street ? r.name : '',
                    r.street,
                    r.subregion,
                    r.city,
                    r.region,
                    r.postalCode
                ].filter(Boolean).join(', ');
                setFullAddress(addressParts);

                // Update form state
                setForm(prev => ({
                    ...prev,
                    city: r.city || '',
                    state: r.region || '',
                    pincode: r.postalCode || '',
                    addressLine1: r.street || '',
                    addressLine2: r.name !== r.street ? r.name || '' : '',
                }));
            }
        } catch (e) {
            // ignore
        }
    };

    const handleSave = async () => {
        if (!form.name || !form.phone || !form.pincode || !form.addressLine1 || !form.city || !form.state) {
            Alert.alert('Missing Fields', 'Please fill all required fields.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/addresses', {
                ...form,
                userId: user?._id
            });
            Alert.alert('Success', 'Address added successfully');
            router.back();
        } catch (error) {
            console.error('Error adding address:', error);
            Alert.alert('Error', 'Failed to save address. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ---------------- RENDER: MAP SELECTION STEP ----------------
    if (step === 'MAP_SELECT') {
        return (
            <SafeAreaView style={styles.mapContainer} edges={['top']}>
                {/* Header Overlay */}
                <View style={styles.mapHeader}>
                    <TouchableOpacity onPress={() => {
                        // If map is active, back button returns to inactive state?
                        // Or acts as normal back? Usually user expects back to exit or go up one level.
                        // Let's say if active, go back to inactive.
                        if (isMapActive) setIsMapActive(false);
                        else router.back();
                    }} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.mapHeaderTitle}>Add new address</Text>
                </View>

                {/* Search Bar Overlay - Only when Active */}
                {isMapActive && (
                    <View style={styles.searchBarContainer}>
                        <Ionicons name="search" size={20} color="#6B7280" />
                        <TextInput
                            placeholder="Search by area, name, street."
                            placeholderTextColor="#6B7280"
                            style={styles.searchBarInput}
                        />
                    </View>
                )}

                {/* Google Map */}
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                        initialRegion={{
                            latitude: location?.coords.latitude || 37.78825,
                            longitude: location?.coords.longitude || -122.4324,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        // Interactions enabled only when Map is Active
                        scrollEnabled={isMapActive}
                        zoomEnabled={isMapActive}
                        rotateEnabled={isMapActive}
                        pitchEnabled={isMapActive}
                        onRegionChangeComplete={handleRegionChangeComplete}
                    />

                    {/* Dark Overlay (30% Visibility) - Only when Inactive */}
                    {!isMapActive && <View style={styles.darkOverlay} pointerEvents="none" />}

                    {/* Center Pin Overlay */}
                    <View style={styles.centerPinContainer} pointerEvents="none">
                        <View style={styles.tooltip}>
                            <Text style={styles.tooltipText}>Place pin on the exact location</Text>
                            <View style={styles.tooltipArrow} />
                        </View>
                        <Ionicons name="location" size={48} color="#2563EB" />
                        <View style={styles.pinShadow} />
                        <View style={styles.areaTag}>
                            <Text style={styles.areaTagText}>{regionName}</Text>
                        </View>
                    </View>

                    {/* Floating Pill Button - Only when Active */}
                    {isMapActive && (
                        <TouchableOpacity style={styles.floatingLocButton} onPress={handleRecenter}>
                            <MaterialIcons name="my-location" size={16} color="#2563EB" />
                            <Text style={styles.floatingLocText}>Use my current location</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Bottom Sheet */}
                <View style={styles.bottomSheet}>
                    {!isMapActive ? (
                        // INACTIVE STATE: 2 Buttons
                        <>
                            <Text style={styles.sheetTitle}>Where do you want us to deliver the order?</Text>
                            <Text style={styles.sheetSubtitle}>This will help with the right map location</Text>

                            <TouchableOpacity style={styles.primaryButton} onPress={handleAwayFromLocation}>
                                <Text style={styles.primaryButtonText}>Away from my location</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.secondaryButton} onPress={handleUseCurrentLocation}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#2563EB" />
                                ) : (
                                    <>
                                        <MaterialIcons name="my-location" size={20} color="#2563EB" style={styles.buttonIcon} />
                                        <Text style={styles.secondaryButtonText}>Use current location</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        // ACTIVE STATE: Deliver To Sheet
                        <>
                            <Text style={styles.deliverToTitle}>Deliver To</Text>
                            <View style={styles.addressCard}>
                                <View style={styles.addressHeader}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="location-outline" size={20} color="#374151" />
                                        <Text style={styles.addressAreaName}>{regionName}</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <Text style={styles.changeText}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.addressText} numberOfLines={2}>
                                    {fullAddress || "Fetching address..."}
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.primaryButton} onPress={handleProceedToDetails}>
                                <Text style={styles.primaryButtonText}>Add address Details</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    // ---------------- RENDER: DETAILS FORM STEP ----------------
    return (
        <SafeAreaView style={styles.formContainer} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setStep('MAP_SELECT')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.title}>Add Delivery Address</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionTitle}>Contact Details</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name (Required)*"
                        value={form.name}
                        onChangeText={(t) => handleChange('name', t)}
                        placeholderTextColor="#9CA3AF"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number (Required)*"
                        value={form.phone}
                        onChangeText={(t) => handleChange('phone', t)}
                        keyboardType="phone-pad"
                        placeholderTextColor="#9CA3AF"
                    />

                    <Text style={styles.sectionTitle}>Address Details</Text>
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Pincode (Required)*"
                            value={form.pincode}
                            onChangeText={(t) => handleChange('pincode', t)}
                            keyboardType="numeric"
                            placeholderTextColor="#9CA3AF"
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="City (Required)*"
                            value={form.city}
                            onChangeText={(t) => handleChange('city', t)}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="State (Required)*"
                        value={form.state}
                        onChangeText={(t) => handleChange('state', t)}
                        placeholderTextColor="#9CA3AF"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="House No., Building Name (Required)*"
                        value={form.addressLine1}
                        onChangeText={(t) => handleChange('addressLine1', t)}
                        placeholderTextColor="#9CA3AF"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Road Name, Area, Colony (Required)*"
                        value={form.addressLine2}
                        onChangeText={(t) => handleChange('addressLine2', t)}
                        placeholderTextColor="#9CA3AF"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Landmark (Optional)"
                        value={form.landmark}
                        onChangeText={(t) => handleChange('landmark', t)}
                        placeholderTextColor="#9CA3AF"
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Address</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // --- MAP STYLES ---
    mapContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    mapHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        zIndex: 10,
    },
    mapHeaderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginLeft: 12,
    },
    // Search Bar
    searchBarContainer: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        zIndex: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchBarInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#1F2937',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)', // 30% black overlay
        zIndex: 1,
    },
    centerPinContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 48,
        zIndex: 2,
    },
    tooltip: {
        backgroundColor: '#000000',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
        marginBottom: 8,
        position: 'relative',
    },
    tooltipText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    tooltipArrow: {
        position: 'absolute',
        bottom: -6,
        left: '45%',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#000000',
    },
    pinShadow: {
        width: 12,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginTop: -4,
    },
    areaTag: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#2563EB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    areaTagText: {
        color: '#2563EB',
        fontSize: 12,
        fontWeight: '600'
    },
    floatingLocButton: {
        position: 'absolute',
        bottom: 230,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 3,
    },
    floatingLocText: {
        color: '#2563EB',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6
    },

    // --- BOTTOM SHEET ---
    bottomSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        paddingBottom: 40,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
    },
    sheetTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 4,
    },
    sheetSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#2563EB',
        flexDirection: 'row',
    },
    secondaryButtonText: {
        color: '#2563EB',
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    buttonIcon: {
        marginRight: 0,
    },

    // --- NEW SHEET STYLES ---
    deliverToTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    addressCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressAreaName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginLeft: 8,
    },
    changeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },
    addressText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },

    // --- FORM STYLES ---
    formContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 12,
        marginTop: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    saveButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100, // Extra space for keyboard
    },
});
