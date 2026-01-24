import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function NotificationsPage() {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Notifications' }} />
            <Text style={styles.text}>Notification preferences.</Text>
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
