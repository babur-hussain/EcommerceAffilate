import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function PlusPage() {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Premium Membership' }} />
            <Text style={styles.text}>Premium Membership details.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
});
