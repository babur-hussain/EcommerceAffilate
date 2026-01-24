import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from '../i18n/i18n';

const LANGUAGE_KEY = 'user_language';

interface LanguageContextType {
    language: string;
    changeLanguage: (lang: string) => Promise<void>;
    isLanguageLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    changeLanguage: async () => { },
    isLanguageLoaded: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
                if (savedLanguage) {
                    setLanguage(savedLanguage);
                    await i18next.changeLanguage(savedLanguage);
                }
            } catch (error) {
                console.error('Failed to load language', error);
            } finally {
                setIsLanguageLoaded(true);
            }
        };

        loadLanguage();
    }, []);

    const changeLanguage = async (lang: string) => {
        try {
            setLanguage(lang);
            await i18next.changeLanguage(lang);
            await AsyncStorage.setItem(LANGUAGE_KEY, lang);
        } catch (error) {
            console.error('Failed to save language', error);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, isLanguageLoaded }}>
            {children}
        </LanguageContext.Provider>
    );
};
