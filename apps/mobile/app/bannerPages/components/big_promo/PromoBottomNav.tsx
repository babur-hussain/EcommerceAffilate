import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function PromoBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={28} color="#F59E0B" />
                    <Text style={[styles.label, { color: '#F59E0B', fontWeight: 'bold' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="category" size={28} color="#9CA3AF" />
                    <Text style={styles.label}>Catalog</Text>
                </TouchableOpacity>

                <View style={styles.centerButtonWrapper}>
                    <View style={styles.centerButton}>
                        <MaterialIcons name="shopping-bag" size={28} color="white" />
                    </View>
                </View>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="favorite" size={28} color="#9CA3AF" />
                    <Text style={styles.label}>Saved</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="person" size={28} color="#9CA3AF" />
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
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: -5 },
        elevation: 20,
    },
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 24,
        paddingBottom: 24, // Safe area
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    navItem: {
        alignItems: 'center',
        padding: 4,
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        color: '#9CA3AF', // gray-400
        fontFamily: 'Nunito_600SemiBold',
    },
    centerButtonWrapper: {
        width: 56,
        alignItems: 'center',
    },
    centerButton: {
        position: 'absolute',
        top: -48,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F59E0B',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'white',
        shadowColor: '#F97316',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 8,
    }
});
