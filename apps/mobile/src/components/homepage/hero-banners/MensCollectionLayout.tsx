import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CachedImage from '../../shared/CachedImage';

const { width } = Dimensions.get('window');

export default function MensCollectionLayout() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Background Pattern Elements */}
            <View style={styles.geometricBg} />



            {/* Hero Section */}
            <View style={styles.heroSection}>
                <View style={styles.heroImageContainer}>
                    <CachedImage
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEuynzBd2nHSibVQI3wT2OYzuGstbDMjzOywD0pt_QxjXpHf4Sn-EXbxLa9ojrY6nc-CXj_nu2V8y0UWPpgbVxheV_7T_ukIzlxMBFtHwowGS6GaAkhkttWdKYdw0CmDgvKPwwXZWQR3EsKXNX4vghu4zFFbdPI8D62V6G345f0167V1nk_bF6xJKMXNmdzPJeCoZrRKixa5xhop_Nprz311RU-GTtfw0RfiqsEV9U_z0RP6TqzBNSCxF1hnZ0aRTfnvpgn7uZdCtG' }}
                        style={styles.heroImage}
                        contentFit="contain"
                    />
                </View>

                <View style={styles.heroContent}>
                    {/* Background Big Text positioned relative to content */}
                    <View style={styles.contentBackgroundTextContainer}>
                        <Text style={styles.contentBackgroundText} numberOfLines={1} adjustsFontSizeToFit>MEN</Text>
                        <Text style={styles.contentBackgroundText} numberOfLines={1} adjustsFontSizeToFit>MEN</Text>
                        <Text style={styles.contentBackgroundText} numberOfLines={1} adjustsFontSizeToFit>MEN</Text>
                    </View>
                    <Text style={styles.specialOffer}>SPECIAL OFFER</Text>
                    <Text style={styles.mainTitle}>EXCLUSIVE</Text>
                    <Text style={styles.mainTitle}>MEN'S</Text>

                    <View style={styles.discountRow}>
                        <View style={styles.line} />
                        <Text style={styles.discountText}>50% OFF</Text>
                        <View style={styles.line} />
                    </View>

                    <TouchableOpacity style={styles.shopButton}>
                        <Text style={styles.shopButtonText}>SHOP NOW</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* New Arrivals Section */}
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>New Arrivals</Text>
                    <TouchableOpacity style={styles.viewAllBtn}>
                        <Text style={styles.viewAllText}>View All</Text>
                        <MaterialIcons name="arrow-forward" size={16} color="#D97706" />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
                    {/* Product 1 */}
                    <View style={styles.productCard}>
                        <View style={styles.productImageContainer}>
                            <CachedImage
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMtzXmq0wI6gDRY_hBGNUfm-b_trSkxzVn9ArA1J4CMFnqe_Uove6oCroh5adkzea1aqRSEGNOyFO4lfwx7yviVb3_pkIO1HWjNWuISCLQ0nxE4AjwaKurjOVYrXh-yK9reFHAYFVxp5OViwSb2viLhaOKI1XjDULWEFSPnsYHUA-BMAyGlBK8hmhaoKeS2YIcBzxfec1N69aKkMeKpScSRqikqG2NpwmDVWWEqoujCqNssMcThYLsnI4zOilwLYaA1CT0HTbWpVKs' }}
                                style={styles.productImage}
                                contentFit="cover"
                            />
                            <TouchableOpacity style={styles.favButton}>
                                <MaterialIcons name="favorite-border" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.productName}>Trench Collection</Text>
                        <Text style={styles.productSub}>Fall Essentials</Text>
                    </View>

                    {/* Product 2 */}
                    <View style={styles.productCard}>
                        <View style={styles.productImageContainer}>
                            <CachedImage
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEGLDO4V75reSP9RTq555WTOj5nIHeN_uc5moNrDj_0j7GoC9Fj6lDry-FRMs3lnYlnmcnp5URcvEASGFTy1LKQZkZ4pi-peTIWMITozVnKokEfQs9gtRj4ZlhzPV1FI_vlgfUtOkkIsVvjPUhAmxKfvwYizhwzYddMwGbucK24SfJvy4RZIsP4z6CltYMJ1rPD3IALRlrsbh6khsOgAR92zGhj-nBYPv5Z-6Ur40uhC69_-nm5N1P_DNMHuZgRqmqWStqF2-IrvdJ' }}
                                style={styles.productImage}
                                contentFit="cover"
                            />
                            <TouchableOpacity style={styles.favButton}>
                                <MaterialIcons name="favorite-border" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.productName}>Street Style</Text>
                        <Text style={styles.productSub}>Urban Vibe</Text>
                    </View>
                </ScrollView>
            </View>


            {/* Newsletter Section */}
            <View style={styles.newsletterSection}>
                <View style={styles.newsletterCard}>
                    <Text style={styles.newsletterTitle}>Winter is coming.</Text>
                    <Text style={styles.newsletterSub}>Get first access to our limited winter drop.</Text>

                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                        />
                        <TouchableOpacity style={styles.joinButton}>
                            <Text style={styles.joinButtonText}>Join</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Decorative circle */}
                    <View style={styles.decorativeCircle} />
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    geometricBg: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.4,
        // Using a simple pattern approximation or color since CSS gradients are complex
        backgroundColor: '#f9fafb',
    },
    contentBackgroundTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
        opacity: 0.05,
        paddingTop: 20,
    },
    contentBackgroundText: {
        fontSize: width * 0.32,
        fontWeight: '900',
        color: '#0F172A',
        lineHeight: width * 0.32,
        textAlign: 'center',
    },
    heroSection: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    heroImageContainer: {
        width: width * 0.85,
        aspectRatio: 0.8,
        marginTop: 32,
        marginBottom: -40, // overlap
        zIndex: 10,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroContent: {
        width: '100%',
        alignItems: 'center',
        zIndex: 20,
        // Removed background color to let the "MEN" text show through and blend with the page background
        paddingTop: 40,
        position: 'relative',
    },
    specialOffer: {
        color: '#D97706',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 4,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    mainTitle: {
        fontSize: 48,
        fontWeight: '800',
        color: '#0F172A',
        lineHeight: 48,
        textAlign: 'center',
    },
    discountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 24,
        gap: 16,
    },
    line: {
        width: 48,
        height: 1,
        backgroundColor: '#CBD5E1',
    },
    discountText: {
        fontSize: 30,
        fontWeight: '300',
        fontStyle: 'italic',
        color: '#0F172A',
    },
    shopButton: {
        backgroundColor: '#D97706',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 100,
        shadowColor: '#EA580C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    shopButtonText: {
        color: '#FFFFFF',
        fontWeight: '800',
        letterSpacing: 2,
        fontSize: 16,
    },
    sectionContainer: {
        marginTop: 40,
        paddingLeft: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        color: '#D97706',
        fontWeight: '600',
        fontSize: 14,
        marginRight: 4,
    },
    productsScroll: {
        paddingRight: 24,
        paddingBottom: 20, // space for shadow
    },
    productCard: {
        marginRight: 16,
        width: 240,
        alignItems: 'center',
    },
    productImageContainer: {
        width: '100%',
        aspectRatio: 3 / 4,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#F1F5F9',
        marginBottom: 12,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    favButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 8,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
    },
    productSub: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
    newsletterSection: {
        marginHorizontal: 24,
        marginTop: 20,
        marginBottom: 20,
    },
    newsletterCard: {
        backgroundColor: '#0F172A',
        borderRadius: 32,
        padding: 32,
        overflow: 'hidden',
        position: 'relative',
    },
    newsletterTitle: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 8,
    },
    newsletterSub: {
        color: '#CBD5E1',
        fontSize: 16,
        marginBottom: 24,
        maxWidth: 200,
    },
    inputRow: {
        flexDirection: 'row',
        height: 50,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        paddingHorizontal: 16,
        color: '#FFF',
        fontSize: 16,
    },
    joinButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButtonText: {
        color: '#0F172A',
        fontWeight: '800',
        fontSize: 16,
    },
    decorativeCircle: {
        position: 'absolute',
        bottom: -40,
        right: -40,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
});
