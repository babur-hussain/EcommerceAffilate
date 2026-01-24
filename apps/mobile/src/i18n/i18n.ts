import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import hi from './locales/hi.json';

const resources = {
    en: { translation: en },
    hi: { translation: hi },
};

export const defaultLanguage = 'en';

i18next
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3' as any, // For Android compatibility (v3 fixed)
        resources,
        lng: defaultLanguage, // Default to English, will be updated by Context
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already safe from XSS
        },
        react: {
            useSuspense: false,
        },
    });

export default i18next;
