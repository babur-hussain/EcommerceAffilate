import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const { user } = useAuth();

    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>
                    {user ? `Hi, ${user.name?.split(' ')[0] || 'User'}` : 'Welcome Back'}
                </Text>
                <Text style={styles.subtitle}>Let's find something great!</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
                <MaterialIcons name="notifications-none" size={24} color="#111827" />
                <View style={styles.badge} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
});
