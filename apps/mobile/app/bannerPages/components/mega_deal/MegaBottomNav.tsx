import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function MegaBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={24} color="#DC2626" />
                    <Text style={[styles.label, { color: '#DC2626' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="category" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Categories</Text>
                </TouchableOpacity>

                <View style={styles.centerButtonWrapper}>
                    <View style={styles.centerButton}>
                        <MaterialIcons name="qr-code-scanner" size={28} color="white" />
                    </View>
                </View>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="local-offer" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Vouchers</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="person" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: 'transparent',
    },
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 24,
        paddingBottom: 24, // Safe area
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    navItem: {
        alignItems: 'center',
        padding: 4,
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    centerButtonWrapper: {
        width: 56,
        alignItems: 'center',
    },
    centerButton: {
        position: 'absolute',
        top: -48,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#DC2626',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 6,
    }
});
