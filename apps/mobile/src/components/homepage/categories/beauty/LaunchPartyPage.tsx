import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const launchData = [
    {
        brand: "L'ORÉAL PARIS",
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', // Dark aesthetic serum
        offer: 'Up to 25% Off'
    },
    {
        brand: 'SKIN1004',
        image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80', // Beige/Rock aesthetic
        offer: 'Up to 25% Off'
    },
    {
        brand: 'Glazed Makeup',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=400&q=80', // Pink/Glossy
        offer: 'Up to 40% Off'
    }
];

export default function LaunchPartyPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>The Launch Party</Text>
                    <Text style={styles.headerSubtitle}>Fresh drops just for you</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {launchData.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <ImageBackground
                            source={{ uri: item.image }}
                            style={styles.imageBackground}
                            imageStyle={{ borderRadius: 24 }}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.8)']}
                                style={styles.gradientOverlay}
                            >
                                <View style={styles.cardContent}>
                                    <Text style={styles.brandText}>{item.brand}</Text>
                                    <View style={styles.offerBadge}>
                                        <Text style={styles.offerText}>{item.offer}</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60, // Safe area
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 16,
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        width: '100%',
        height: 300,
        marginBottom: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        backgroundColor: '#fff',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    gradientOverlay: {
        padding: 20,
        paddingTop: 60,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    brandText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        flex: 1,
        marginRight: 10,
    },
    offerBadge: {
        backgroundColor: '#FF4081',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        transform: [{ rotate: '-2deg' }],
    },
    offerText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
