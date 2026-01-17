import { adminAuth, admin } from '../config/firebaseAdmin';

export class FirebaseService {
    /**
     * Send a high priority data message to a specific user (via their FCM token).
     * Note: The user's FCM token should be stored in the User model.
     * For now, we will assume we can look up the token or it's passed in.
     * Actually, usually we store FCM tokens in a separate collection or array on the User.
     * For this MVP, let's assume we might need to add fcmToken to User model or just log it if missing.
     */
    static async sendPushNotification(token: string, title: string, body: string, data: any = {}) {
        if (!token) {
            console.warn('⚠️ No FCM token provided for notification');
            return;
        }

        try {
            const message = {
                notification: {
                    title,
                    body,
                },
                data: {
                    ...data,
                    // Ensure all data values are strings
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                },
                token,
                android: {
                    priority: 'high' as const,
                    notification: {
                        channelId: 'delivery_alerts',
                        sound: 'default',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default'
                        }
                    }
                }
            };

            const response = await admin.messaging().send(message);
            console.log('✅ Successfully sent message:', response);
            return response;
        } catch (error) {
            console.error('❌ Error sending message:', error);
            // Don't throw, just log. We don't want to break the dispatch loop.
        }
    }

    static async sendDataMessage(token: string, data: any) {
        if (!token) return;

        try {
            const message = {
                data,
                token,
                android: {
                    priority: 'high' as const
                }
            };
            const response = await admin.messaging().send(message);
            console.log('✅ Successfully sent data message:', response);
            return response;
        } catch (error) {
            console.error('❌ Error sending data message:', error);
        }
    }
}
