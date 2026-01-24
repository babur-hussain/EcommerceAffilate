import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function FaqsPage() {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'FAQs' }} />
            <Text style={styles.text}>Frequently Asked Questions.</Text>
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
