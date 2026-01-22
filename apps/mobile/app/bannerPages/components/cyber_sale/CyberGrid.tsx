import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 16;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface CyberProduct {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    image_url: string;
    badge_text?: string;
    badge_rotate?: string; // degree string like '3deg'
}

interface CyberGridProps {
    data: {
        items: CyberProduct[];
    };
}

export default function CyberGrid({ data }: CyberGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {data.items.map((item, index) => {
                    const rotate = item.badge_rotate || (index % 2 === 0 ? '3deg' : '-2deg');

                    return (
                        <TouchableOpacity
                            key={item.id || index}
                            style={styles.card}
                            onPress={() => router.push(`/product/${item.id}`)}
                            activeOpacity={0.9}
                        >
                            <View style={styles.imageBlock}>
                                <Image source={{ uri: item.image_url }} style={styles.image} />
                                <TouchableOpacity style={styles.favBtn}>
                                    <MaterialIcons name="favorite-border" size={16} color="black" />
                                </TouchableOpacity>

                                {/* Comic Price Tag */}
                                <View style={[styles.priceTag, { transform: [{ rotate }] }]}>
                                    <Text style={styles.priceText}>{item.price}</Text>
                                </View>

                                {item.badge_text && (
                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountText}>{item.badge_text}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.details}>
                                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.subtitle}>{item.subtitle}</Text>
                                <TouchableOpacity style={styles.addBtn}>
                                    <Text style={styles.addBtnText}>ADD TO CART</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PADDING,
        paddingBottom: 24,
        backgroundColor: '#F8FAFC',
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
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 8,
        overflow: 'hidden',
        // Hard Pop Shadow
        shadowColor: '#0F172A',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    imageBlock: {
        height: 160,
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        zIndex: 10,
    },
    priceTag: {
        position: 'absolute',
        bottom: -12,
        left: -4,
        backgroundColor: '#FFCB05', // Secondary
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    priceText: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 18,
        color: 'black',
    },
    discountBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#D9242C',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'black',
    },
    discountText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
    },
    details: {
        padding: 12,
        paddingTop: 20,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 4,
        fontFamily: 'Inter_700Bold',
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    addBtn: {
        width: '100%',
        backgroundColor: '#D9242C',
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
    },
    addBtnText: {
        color: 'white',
        fontSize: 12, // xs
        fontWeight: 'bold',
    }
});
