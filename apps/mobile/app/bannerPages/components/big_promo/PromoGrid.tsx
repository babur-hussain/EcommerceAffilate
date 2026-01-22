import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 16;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface PromoProduct {
    id: string;
    title: string;
    price: string;
    original_price?: string;
    image_url: string;
    badge_text?: string;
}

interface PromoGridProps {
    data: {
        items: PromoProduct[];
    };
}

const StarburstBadge = ({ text }: { text: string }) => (
    <View style={styles.starburstContainer}>
        {/* Simple rotated square simulation for starburst effect */}
        <View style={[styles.starShape, { transform: [{ rotate: '0deg' }] }]} />
        <View style={[styles.starShape, { transform: [{ rotate: '45deg' }] }]} />
        <View style={styles.starTextContainer}>
            <Text style={styles.starText}>{text}</Text>
        </View>
    </View>
);

export default function PromoGrid({ data }: PromoGridProps) {
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
                        {item.badge_text && (
                            <View style={styles.badgeWrapper}>
                                <StarburstBadge text={item.badge_text} />
                            </View>
                        )}

                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

                            <View style={styles.footer}>
                                <View>
                                    {item.original_price && (
                                        <Text style={styles.originalPrice}>{item.original_price}</Text>
                                    )}
                                    <Text style={styles.price}>{item.price}</Text>
                                </View>

                                <TouchableOpacity style={styles.cartButton}>
                                    <MaterialIcons name="shopping-cart" size={20} color="white" />
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
        borderRadius: 24, // rounded-3xl
        padding: 12,
        elevation: 6,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 10 },
        marginBottom: 8,
    },
    badgeWrapper: {
        position: 'absolute',
        top: -12,
        right: -12,
        zIndex: 20,
        transform: [{ rotate: '12deg' }],
    },
    starburstContainer: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    starShape: {
        position: 'absolute',
        width: 40,
        height: 40,
        backgroundColor: '#38BDF8', // sky-400
    },
    starTextContainer: {
        zIndex: 10,
        alignItems: 'center',
    },
    starText: {
        color: 'white',
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 8,
    },
    imageContainer: {
        width: '100%',
        height: 144, // h-36
        backgroundColor: '#F3F4F6', // gray-100
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        // HTML has mix-blend-multiply, roughly opacity here implies layering
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold', // bold
        color: '#1E293B', // slate-800
        marginBottom: 4,
        lineHeight: 18,
    },
    footer: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF', // gray-400
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold', // font-black
        color: '#F59E0B',
    },
    cartButton: {
        backgroundColor: '#F59E0B',
        padding: 8,
        borderRadius: 12, // rounded-xl
        shadowColor: '#F97316',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        elevation: 4,
    }
});
