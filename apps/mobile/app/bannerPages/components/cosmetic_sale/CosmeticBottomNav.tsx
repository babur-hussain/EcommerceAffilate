import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CosmeticBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.glassPanel}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={24} color="#112D4E" />
                    <Text style={[styles.label, { color: '#4B5563' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Search</Text>
                </TouchableOpacity>

                <View style={styles.centerButtonWrapper}>
                    <View style={styles.centerButton}>
                        <MaterialIcons name="grid-view" size={24} color="white" />
                    </View>
                </View>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="favorite-border" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Wishlist</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="person-outline" size={24} color="#9CA3AF" />
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
    },
    glassPanel: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)', // Glass sim
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        paddingBottom: 24, // Safe area
        paddingTop: 12,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        color: '#9CA3AF',
    },
    centerButtonWrapper: {
        width: 48,
        alignItems: 'center',
    },
    centerButton: {
        position: 'absolute',
        top: -32,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#112D4E',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    }
});
