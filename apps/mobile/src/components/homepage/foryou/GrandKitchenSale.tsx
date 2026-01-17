import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const PROMO_ITEMS = [
    {
        title: 'Dining &\nDrinkware',
        image: 'https://images.unsplash.com/photo-1577934214051-94285f25e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', // Glassware
        offer: 'Up to 80% off',
        id: 'dining'
    },
    {
        title: 'Cookware\n& Tools',
        image: 'https://images.unsplash.com/photo-1584990347449-a0c92335e953?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', // Pots/Pans
        offer: 'Up to 70% off',
        id: 'cookware'
    },
    {
        title: 'Kitchen\nStorage',
        image: 'https://images.unsplash.com/photo-1517056463774-4b830d1de725?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', // Jars/Storage
        offer: 'Up to 80% off',
        id: 'storage'
    },
    {
        title: 'Limited time\nDeals',
        image: 'https://cdn-icons-png.flaticon.com/512/2972/2972531.png', // Clock/Timer icon style
        isIllustration: true,
        offer: 'Starting from ₹45',
        id: 'deals'
    },
    {
        title: 'Pressure\nCooker',
        image: 'https://images.unsplash.com/photo-1593922712952-b8f36c56c257?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', // Placeholder pressure cooker lookalike
        offer: 'Up to 60% off',
        id: 'pressure-cooker'
    },
    {
        title: 'Winter\nEssentials',
        image: 'https://images.unsplash.com/photo-1544026230-01d2f838bc35?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', // Flask/Thermos
        offer: 'Starting @ ₹99',
        id: 'winter'
    }
];

export default function GrandKitchenSale() {
    return (
        <View style={styles.container}>
            {/* Background Gradient */}
            <LinearGradient
                colors={['#FFF8F3', '#FDEEE4']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Header / Banner Area */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerSurtitle}>GRAND</Text>
                    <Text style={styles.headerTitle}>KITCHEN</Text>
                    <View style={styles.titleRow}>
                        <Text style={styles.headerTitle}>SALE</Text>
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>UP TO 80% OFF</Text>
                        </View>
                    </View>
                </View>
                {/* Hero Image - Kitchen items composition */}
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1556910602-38f53e68e15d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }}
                    style={styles.heroImage}
                    resizeMode="contain"
                />
            </View>

            {/* Grid Items */}
            <View style={styles.gridContainer}>
                {PROMO_ITEMS.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.card} activeOpacity={0.9}>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Image
                                source={{ uri: item.image }}
                                style={[styles.cardImage, item.isIllustration && styles.illustration]}
                                resizeMode={item.isIllustration ? "contain" : "contain"}
                            />
                        </View>
                        <View style={styles.cardFooter}>
                            <Text style={styles.footerText}>{item.offer}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bank Offers Banner */}
            <View style={styles.bankOffersContainer}>
                <View style={styles.bankOffer}>
                    <View style={styles.bankLogoRow}>
                        <Image
                            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/2560px-HSBC_logo_%282018%29.svg.png' }}
                            style={{ width: 80, height: 20 }}
                            resizeMode="contain"
                        />
                        <View style={styles.divider} />
                        <Text style={styles.bankText}>Flat ₹100 off on orders above ₹999</Text>
                    </View>
                    <Text style={styles.bankSubText}>with HSBC Bank Credit Cards</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingBottom: 24,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
        height: 180,
        alignItems: 'center',
    },
    headerContent: {
        flex: 1,
        zIndex: 10,
    },
    headerSurtitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#6F5C4C',
        letterSpacing: 1,
        marginBottom: -4,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F3443',
        letterSpacing: -1,
        lineHeight: 36,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    discountBadge: {
        backgroundColor: '#5D4037', // Dark brown
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 2,
        marginLeft: 8,
        marginTop: 4,
    },
    discountText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 10,
    },
    heroImage: {
        width: 160,
        height: 140,
        position: 'absolute',
        right: -10,
        bottom: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    card: {
        width: (width - 32 - 16) / 3, // (Screen width - padding - gap) / 3 columns
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        height: 160,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 12,
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 16,
    },
    cardImage: {
        width: 70,
        height: 70,
    },
    illustration: {
        width: 60,
        height: 60,
    },
    cardFooter: {
        backgroundColor: '#0F3443', // Dark blue/green
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    bankOffersContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
    },
    bankOffer: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'column',
    },
    bankLogoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    divider: {
        width: 1,
        height: 16,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 12,
    },
    bankText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1F2937',
        flex: 1,
    },
    bankSubText: {
        fontSize: 10,
        color: '#6B7280',
        marginTop: 2,
        marginLeft: 92 + 12, // Align with text start
    }
});
