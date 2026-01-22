import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function CosmeticJoinClub() {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Background Pattern sim */}
                <View style={styles.patternOverlay} />

                <Text style={styles.title}>Join the Club</Text>
                <Text style={styles.subtitle}>Get 10% off your first order.</Text>

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Your email"
                        placeholderTextColor="#4B5563"
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Join</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 32,
        marginBottom: 32,
    },
    card: {
        backgroundColor: '#112D4E', // Primary
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    patternOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        backgroundColor: 'transparent',
        // In a real app, use an ImageBackground with repeat
    },
    title: {
        fontSize: 24,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: 'white',
        marginBottom: 8,
        zIndex: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#BFDBFE', // blue-200
        marginBottom: 16,
        zIndex: 10,
    },
    inputRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 8,
        zIndex: 10,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
    },
    button: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#112D4E',
        fontWeight: 'bold',
        fontSize: 14,
    }
});
