import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import api from '../src/lib/api';
import { useAuth } from '../src/context/AuthContext';

export default function PrivacyCenter() {
    const router = useRouter();
    const { t } = useTranslation();
    const { signOut } = useAuth();

    const handleDeactivate = () => {
        Alert.alert(
            t('privacy_center.deactivate_confirm_title'),
            t('privacy_center.deactivate_confirm_message'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('privacy_center.deactivate_account'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.post('/api/me/deactivate');
                            Alert.alert(t('privacy_center.deactivate_success'), t('privacy_center.deactivate_success_message'));
                            await signOut();
                            router.replace('/login');
                        } catch (error) {
                            console.error('Deactivation failed', error);
                            Alert.alert(t('common.error'), 'Failed to deactivate account');
                        }
                    }
                }
            ]
        );
    };

    const handleDelete = () => {
        Alert.alert(
            t('profile.confirm_delete_title'),
            t('profile.confirm_delete_message'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('profile.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete('/api/me');
                            Alert.alert(t('profile.account_deleted'), t('profile.account_deleted_message'));
                            await signOut();
                            router.replace('/login');
                        } catch (error) {
                            console.error('Deletion failed', error);
                            Alert.alert(t('common.error'), t('profile.delete_error_message'));
                        }
                    }
                }
            ]
        );
    };

    const menuItems = [
        { id: 'privacy_policy', title: 'privacy_center.privacy_policy', action: () => Alert.alert('Info', 'Privacy Policy link would open here') },
        { id: 'request_data', title: 'privacy_center.request_data', action: () => Alert.alert('Info', 'Request Data flow would start here') },
        { id: 'consent_management', title: 'privacy_center.consent_management', action: () => Alert.alert('Info', 'Consent Management flow') },
        { id: 'grievance_redressal', title: 'privacy_center.grievance_redressal', action: () => Alert.alert('Info', 'Grievance Redressal info') },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('privacy_center.title')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {menuItems.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
                        <Text style={styles.menuText}>{t(item.title)}</Text>
                        <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                ))}

                <View style={styles.divider} />

                <TouchableOpacity style={styles.actionItem} onPress={handleDeactivate}>
                    <Text style={styles.actionText}>{t('privacy_center.deactivate_account')}</Text>
                    <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={handleDelete}>
                    <Text style={styles.actionText}>{t('privacy_center.delete_account')}</Text>
                    <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // White background as per design
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'space-between',
        // No heavy border, clean look
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    content: {
        paddingVertical: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        // No borders for these items as per design, just clean list
    },
    menuText: {
        fontSize: 16,
        color: '#374151', // Dark grey text
        fontWeight: '400',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6', // Subtle divider if needed, or just space
        marginVertical: 10,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    actionText: {
        fontSize: 16,
        color: '#3B82F6', // Blue color for actions
        fontWeight: '400',
    },
});
