import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface StoryItem {
    id: string;
    image_url: string;
}

interface AestheteHeaderProps {
    data: {
        logo_text: string;
        stories: StoryItem[];
        hero_title: string;
        hero_subtitle?: string;
        button_text: string;
    };
}

export default function AestheteHeader({ data }: AestheteHeaderProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Background Effects */}
            <LinearGradient
                colors={['#E5E7EB', '#F3F4F6']} // gray-200 to background-light
                style={StyleSheet.absoluteFillObject}
            />
            {/* Simple decoration blob simulation */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            <View style={styles.content}>
                {/* Nav Bar */}
                <View style={styles.navBar}>
                    <TouchableOpacity style={styles.iconButton}>
                        <MaterialIcons name="menu" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.logo}>{data.logo_text}</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <MaterialIcons name="shopping-bag" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                {/* Horizontal Stories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.storiesContainer}
                >
                    {data.stories.map((story, index) => (
                        <View key={story.id || index} style={styles.storyWrapper}>
                            <View style={styles.storyCard}>
                                <Image source={{ uri: story.image_url }} style={styles.storyImage} />
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Hero Text */}
                <View style={styles.heroSection}>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.heroTitle}>{data.hero_title}</Text>
                        <MaterialIcons name="auto-awesome" size={24} color="#EAB308" style={styles.sparkle} />
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.shopButton}>
                        <Text style={styles.shopButtonText}>{data.button_text}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 48, // Safe area ish
        paddingBottom: 32,
        overflow: 'hidden',
        position: 'relative',
    },
    blob1: {
        position: 'absolute',
        top: -80,
        left: -80,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(209, 213, 219, 0.3)', // gray-300
        opacity: 0.3,
    },
    blob2: {
        position: 'absolute',
        top: 100,
        right: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(209, 213, 219, 0.3)',
        opacity: 0.3,
    },
    content: {
        zIndex: 10,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    logo: {
        fontSize: 20,
        fontFamily: 'Cinzel_600SemiBold',
        letterSpacing: 4,
        color: '#1F2937', // text-main-light
        fontWeight: 'bold',
    },
    iconButton: {
        padding: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    storiesContainer: {
        paddingHorizontal: 16,
        gap: 12,
        paddingBottom: 16,
    },
    storyWrapper: {
        width: 112, // w-28
        // snap-center stuff handled by ScrollView props if explicitly needed, usually snapToInterval
    },
    storyCard: {
        height: 160, // h-40
        backgroundColor: '#E5E7EB',
        borderTopLeftRadius: 100, // rounded-t-arch
        borderTopRightRadius: 100,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    storyImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heroSection: {
        alignItems: 'center',
        marginTop: 24,
    },
    titleWrapper: {
        position: 'relative',
        flexDirection: 'row',
    },
    heroTitle: {
        fontSize: 36, // text-4xl
        fontFamily: 'Cinzel_500Medium',
        color: '#1F2937',
        textAlign: 'center',
        letterSpacing: 1,
    },
    sparkle: {
        position: 'absolute',
        top: -10,
        right: -25,
    },
    divider: {
        width: 64,
        height: 2,
        backgroundColor: '#D1D5DB', // gray-300
        marginVertical: 16,
    },
    shopButton: {
        backgroundColor: '#1A1A1A', // Primary
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 999,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    shopButtonText: {
        color: 'white',
        fontFamily: 'Cinzel_500Medium',
        fontSize: 16,
        letterSpacing: 1,
    }
});
