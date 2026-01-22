import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function LumiereNewsletter() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join the Club</Text>
            <Text style={styles.subtitle}>Get exclusive offers and early access to new drops.</Text>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Your email"
                    placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity style={styles.button}>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 20,
        fontFamily: 'PlayfairDisplay_600SemiBold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#111827',
    },
    button: {
        backgroundColor: '#6D28D9',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#6D28D9',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    }
});
