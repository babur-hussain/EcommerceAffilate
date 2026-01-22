import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 20;
const PADDING = 24;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface LuxProduct {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    image_url: string;
    badge?: string;
}

interface LuxGridProps {
    data: {
        items: LuxProduct[];
    };
}

export default function LuxGrid({ data }: LuxGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {data.items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id || index}
                        style={styles.card}
                        onPress={() => router.push(`/product/${item.id}`)}
                        activeOpacity={0.95}
                    >
                        <View style={styles.imageContainer}>
                            {item.badge && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            )}
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                            <TouchableOpacity style={styles.favButton}>
                                <MaterialIcons name="favorite-border" size={16} color="#8B5E55" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>

                            <View style={styles.footer}>
                                <Text style={styles.price}>{item.price}</Text>
                                <TouchableOpacity style={styles.addButton}>
                                    <MaterialIcons name="add" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PADDING,
        paddingBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: GAP,
    },
    card: {
        width: COLUMN_WIDTH,
        backgroundColor: 'white',
        borderRadius: 20, // rounded-2xl
        padding: 12,
        elevation: 2, // shadow-soft sim
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 10 },
        marginBottom: 8,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 3 / 4,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        backgroundColor: '#F9FAFB',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        zIndex: 10,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    favButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    details: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        color: '#6B7280',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontFamily: 'Antonio_700Bold',
        color: '#8B5E55',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#8B5E55',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#8B5E55',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
    }
});
