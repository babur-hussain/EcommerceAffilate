import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getMessaging, onMessage, getInitialNotification, onNotificationOpenedApp } from '@react-native-firebase/messaging';
import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from 'react';

// Background Handler (Must be outside component)
// Using legacy syntax for background handler as modular API caused runtime crash
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

export default function RootLayout() {
    const router = useRouter();

    useEffect(() => {
        const messaging = getMessaging();

        // 1. Foreground Message
        const unsubscribe = onMessage(messaging, async remoteMessage => {
            console.log('A new FCM message arrived!', remoteMessage);
            handleMessage(remoteMessage);
        });

        // 2. Initial Notification (Cold Start)
        getInitialNotification(messaging).then(remoteMessage => {
            if (remoteMessage) {
                console.log('Notification caused app to open from quit state:', remoteMessage);
                handleMessage(remoteMessage);
            }
        });

        // 3. Background Notification (App Running in Background)
        onNotificationOpenedApp(messaging, remoteMessage => {
            console.log('Notification caused app to open from background state:', remoteMessage);
            handleMessage(remoteMessage);
        });

        return unsubscribe;
    }, []);

    const handleMessage = (remoteMessage: any) => {
        if (remoteMessage?.data?.type === 'NEW_ORDER') {
            const { orderId, amount, address } = remoteMessage.data;
            router.push({
                pathname: '/alarm',
                params: { orderId, amount, address }
            });
        }
    };

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth/login" options={{ headerShown: false }} />
                <Stack.Screen name="alarm" options={{
                    presentation: 'fullScreenModal',
                    animation: 'slide_from_bottom',
                    headerShown: false
                }} />
            </Stack>
            <StatusBar style="dark" />
        </>
    );
}
