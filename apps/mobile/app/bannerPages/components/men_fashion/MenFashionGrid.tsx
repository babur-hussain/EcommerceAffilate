import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 16;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface ProductItem {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    image_url: string;
    badge?: string;
    badge_color?: 'primary' | 'black';
}

interface MenFashionGridProps {
    data: {
        items: ProductItem[];
    };
}

export default function MenFashionGrid({ data }: MenFashionGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            {data.items.map((item, index) => (
                <TouchableOpacity
                    key={item.id || index}
                    style={styles.card}
                    onPress={() => router.push(`/product/${item.id}`)}
                    activeOpacity={0.9}
                >
                    <View style={styles.imageContainer}>
                        {item.badge && (
                            <View style={[
                                styles.badge,
                                item.badge_color === 'black' ? { backgroundColor: 'black' } : { backgroundColor: '#EF3333' }
                            ]}>
                                <Text style={styles.badgeText}>{item.badge}</Text>
                            </View>
                        )}
                        <Image source={{ uri: item.image_url }} style={styles.image} />

                        <TouchableOpacity style={styles.addButton}>
                            <MaterialIcons name="add" size={16} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.details}>
                        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                            <Text style={styles.price}>{item.price}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16, // Row gap handled manually if gap prop fails on older RN, but standard now
    },
    card: {
        width: COLUMN_WIDTH,
        backgroundColor: 'white', // card-light
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 3 / 4,
        backgroundColor: '#F3F4F6',
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 2,
        zIndex: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontFamily: 'Inter_700Bold',
    },
    addButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    details: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        fontFamily: 'Inter_700Bold',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: 'Inter_400Regular',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        fontFamily: 'Inter_700Bold',
    }

});
