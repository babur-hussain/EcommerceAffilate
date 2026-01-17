import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useUserLocation } from '../../hooks/useUserLocation';

interface Address {
    _id: string;
    userId: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
}

interface AddressSelectorProps {
    visible: boolean;
    onClose: () => void;
    savedAddresses: Address[];
    selectedAddressId?: string;
    onSelectAddress: (address: Address) => void;
    onUseCurrentLocation: () => void;
    onAddNewAddress?: () => void;
}

export default function AddressSelector({
    visible,
    onClose,
    savedAddresses,
    selectedAddressId,
    onSelectAddress,
    onUseCurrentLocation,
    onAddNewAddress
}: AddressSelectorProps) {
    const { loading: locationLoading } = useUserLocation();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalBackdrop} />
                </TouchableWithoutFeedback>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContent}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Select delivery address</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="close" size={24} color="#1F2937" />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search by area, street name, pin code"
                            placeholderTextColor="#9CA3AF"
                            style={styles.searchInput}
                        />
                    </View>

                    {/* Current Location Option */}
                    <TouchableOpacity
                        style={styles.currentLocationRow}
                        onPress={() => {
                            onUseCurrentLocation();
                            onClose();
                        }}
                    >
                        <View style={styles.locationIconContainer}>
                            <MaterialIcons name="my-location" size={22} color="#2563EB" />
                        </View>
                        <Text style={styles.currentLocationText}>
                            {locationLoading ? "Locating..." : "Use my current location"}
                        </Text>
                    </TouchableOpacity>

                    {/* Simple Divider */}
                    <View style={styles.divider} />

                    {/* Saved Addresses List */}
                    <View style={styles.listHeader}>
                        <Text style={styles.savedAddressesTitle}>Saved addresses</Text>
                        <TouchableOpacity onPress={onAddNewAddress}>
                            <Text style={styles.addNewText}>+ Add New</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                    >
                        {savedAddresses.map((addr) => {
                            const isSelected = selectedAddressId === addr._id;
                            return (
                                <TouchableOpacity
                                    key={addr._id}
                                    style={[styles.addressItem, isSelected && styles.selectedAddressItem]}
                                    onPress={() => {
                                        onSelectAddress(addr);
                                        onClose();
                                    }}
                                >
                                    <View style={styles.addressIconCol}>
                                        <Ionicons
                                            name={addr.isDefault ? "home-outline" : "business-outline"}
                                            size={20}
                                            color="#4B5563"
                                        />
                                    </View>

                                    <View style={styles.addressContent}>
                                        <View style={styles.nameRow}>
                                            <Text style={styles.nameText}>{addr.name}</Text>
                                            {isSelected && (
                                                <View style={styles.selectedBadge}>
                                                    <Text style={styles.selectedBadgeText}>Currently selected</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.addressDetails} numberOfLines={2}>
                                            {addr.addressLine1}, {addr.city}, {addr.state}, {addr.pincode}
                                        </Text>
                                    </View>

                                    <TouchableOpacity style={styles.menuButton}>
                                        <MaterialIcons name="more-horiz" size={24} color="#6B7280" />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            );
                        })}

                        {savedAddresses.length === 0 && (
                            <Text style={styles.emptyText}>No saved addresses found.</Text>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackdrop: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 20,
        maxHeight: '80%', // Takes up to 80% screen height
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    currentLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 8,
    },
    locationIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        // backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    currentLocationText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2563EB',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6', // Dashed styling is tricky in RN without separate logic, keeping solid simple
        marginBottom: 16,
        borderStyle: 'dashed', // Works on iOS
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    savedAddressesTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
    },
    addNewText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },
    scrollView: {
        // flex: 1,
    },
    addressItem: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    selectedAddressItem: {
        backgroundColor: '#F9FAFB', // Slight highlight
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    addressIconCol: {
        marginRight: 12,
        paddingTop: 2,
    },
    addressContent: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    nameText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginRight: 8,
    },
    selectedBadge: {
        backgroundColor: '#DBEAFE', // Light blue
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    selectedBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#2563EB',
    },
    addressDetails: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    menuButton: {
        padding: 4,
        marginLeft: 8,
    },
    emptyText: {
        textAlign: 'center',
        color: '#9CA3AF',
        marginTop: 20,
        marginBottom: 40,
    }
});
