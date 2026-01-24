import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../src/context/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function LanguagePage() {
    const router = useRouter();
    const { language, changeLanguage } = useLanguage();
    const { t } = useTranslation();
    const [selectedLang, setSelectedLang] = useState(language);

    const handleSave = async () => {
        await changeLanguage(selectedLang);
        router.back();
    };

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English', subtext: 'Default' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', subtext: 'हिंदी में देखें' }
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('language.selectLanguage')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Choose your preferred language</Text>
                <Text style={styles.subtitle}>You can change this anytime from settings</Text>

                <View style={styles.langList}>
                    {languages.map((lang) => {
                        const isSelected = selectedLang === lang.code;
                        return (
                            <TouchableOpacity
                                key={lang.code}
                                style={[styles.langCard, isSelected && styles.selectedCard]}
                                onPress={() => setSelectedLang(lang.code)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.langInfo}>
                                    <Text style={[styles.langNative, isSelected && styles.selectedText]}>{lang.nativeName}</Text>
                                    <Text style={[styles.langName, isSelected && styles.selectedSubText]}>{lang.name}</Text>
                                    {lang.subtext && <Text style={[styles.subtext, isSelected && styles.selectedSubText]}>{lang.subtext}</Text>}
                                </View>
                                <View style={[styles.radioOuter, isSelected && styles.selectedRadioOuter]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.continueButton} onPress={handleSave}>
                    <Text style={styles.continueText}>{t('language.continue')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
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
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 32,
    },
    langList: {
        gap: 16,
    },
    langCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCard: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },
    langInfo: {
        gap: 4,
    },
    langNative: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    langName: {
        fontSize: 14,
        color: '#4B5563',
    },
    subtext: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic'
    },
    selectedText: {
        color: '#1E40AF',
    },
    selectedSubText: {
        color: '#3B82F6',
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRadioOuter: {
        borderColor: '#2563EB',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2563EB',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    continueButton: {
        backgroundColor: '#2563EB',
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
