import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

/**
 * Premium Jewelry Layout (Banner ID: 7)
 * 
 * Implements the "Premium Jewelry Collection" design (LUXE).
 * Features:
 * - Beige/Gold (#D2B48C) accents.
 * - Minimalist luxury aesthetic.
 * - Split hero image background.
 * - Serif typography emphasis (simulated with platform serifs).
 */
export default function PremiumJewelryLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>

            {/* Hero Section */}
            <View style={styles.heroSection}>
                {/* Custom Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { top: insets.top + 10 }]}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.heroImageContainer}>
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4KtvNZTORM6BF7WAkUzAbaKl09ue0n4XSt6ZFhmQe3gYh8m0SZ1NHKJpTPfOxwuigPNHzhS9nRMrZfuAifbfaOG2zAQhjMU8qyKLeE9E2FDRN16v6_q702FUuJ-dutxAr76KivmUVGWmxBloUtjNpkx3WsZHfaTu4yXMKKWl3Cm5UyAnbhWIKHDMVjsL1g7vLGSmR6IkIyzmIdhYsttn8wy3nfWcF5Ou02J7IG3KQ932ShCE66qif0Z_MuSEqgcVQJ9m7hn_kdvt4' }}
                        style={styles.heroImageSide}
                        resizeMode="cover"
                    />
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7B_ORgrzMVAzn-htq7okk_sV2-zubknWmdeCPC5YyBnXTFB5-pEnGxLUhgJS8Mu8XcxoQ4ZH-GWTOBoMRWWLiCwGeadprCA_F4hbA3mnFIrAz3H6LkFUhsdiy6i8ZePH_hwqskMNFV6h0Pm9nQR17ekhVxDiTJCxg4odCD6G7M6XslfmWhVk34wim09gnQyTba1G3OiA5Eggl0yNDeUCmBtbJpu5tNfmMgHgLrVeoYInN_UrtTrhxc8Yb-k_CBwHaDPgfxcOGR3Yl' }}
                        style={styles.heroImageCenter}
                        resizeMode="cover"
                    />
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARyivEa4K73CagAaakss47BJek7ZbxTuZmMDySdKenheUK0E5wI9GdoxgvndWMAu3aWVcx5MaTIn4sPfu-er5gAon0bx1R7wlUbfrvIhljRNRFKnOHU7lcOSMDldYtWAQKtDTjyZlzchXiJZraBlxKKszDrHjbaLlS9Qj6ETxwU40H3bIc-2MoMfgPeypyV8Y8PYX6LJm9rSZVP9E8YEkyjgWxt6iiNcYvUsXIl9rl6qK5BrCc9MX7WOqRfby7L7OAtaEEB-XhNLCP' }}
                        style={styles.heroImageSide}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.2)', 'transparent', 'rgba(0,0,0,0.4)']}
                        style={StyleSheet.absoluteFillObject}
                    />
                </View>

                <View style={styles.heroContent}>
                    <Text style={styles.heroTag}>PREMIUM JEWELRY</Text>
                    <Text style={styles.heroTitle}>Brand New Arrival</Text>
                    <TouchableOpacity style={styles.shopNowBtn}>
                        <Text style={styles.shopNowText}>SHOP NOW</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <View>
                    <Text style={styles.subHeader}>NEW COLLECTION</Text>
                    <Text style={styles.headerTitle}>The Pearl Series</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.filterBtn}>FILTER</Text>
                </TouchableOpacity>
            </View>

            {/* Product Grid */}
            <View style={styles.gridContainer}>

                {/* Row 1 */}
                <View style={styles.gridRow}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAuiwcpPXDmhUygmvYubKksiP0Y8_fj1rSL6_1zIgbogTimzcnHsd9kRCuLF2y2kSMIlqYBW3lCCgIbr-mFaiIBQR-mLA5WYSwJM4iDLKS-8ryQVxtWguCra9krVFW5nzG2MFo_WHCtwpIvzIX9nc-1u5oXPU6DphALjEuSIUj10ighhbc7M6eP60Qz2wSfumpFoUw6sUBXC-F5HpiyZOxfzp04tbezIWTirkVs7XiN3Aje-Oz6pmvOIzDIlyMC0_TF6oFpl_v40NIQ"
                        name="Aurore Pearl Necklace"
                        price="$1,250"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuDT9tTc_dXcx5eu9-bm1kUAADeIUancDxc_QuPsXmIVMRKZL-wHGNrhjpXQ71JaXkOuTWFV-d64SeW-_eDwtT6SqcFkvKzB7wCQiLy5v825lEOWYyPlmYYtLIW1YuMSgVI8T961NXBTxivHktd_x5n1hqfuPDY5FAv7jkRzBzy-e9R5QF9nmDw5kzxrrvKKwlWJgg_yqaAAcHo3Ra45trZC0vCT0Fd3aHCdKBLTLN0FfAHqX7Q4HiYacCLURemnI4ykmRDWMo_Xva6f"
                        name="Elysian Gold Ring"
                        price="$890"
                    />
                </View>

                {/* Row 2 */}
                <View style={styles.gridRow}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAs4RmqiRYhlEQQMR9z2KzonHOC2qzQnAn62H9Y44suSlUUqz6z3mhsb5da8nqXBctZ9EZUSY-h9znQup4MlSVPd6RsD8rby3ZyiKGjGx9QLx1jXt224-0R-xg8maF0ntudWhlrXpmKQaGpiPnq_yWa9WvgR9PYnL8vHWZz7sbzdzsIzXhOjQb6s0WFydalPa3VP5yMWv-cipSPZZFR6-BUr1dMt36rSpvwGzBmlBlvxLgFZJYcdOe6YoeiUtwRkSYUiXBr4MVqzb-y"
                        name="Celeste Diamond Studs"
                        price="$2,100"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuDB0fLr9vnjQkrCGfijCA7DWL213iYlcjb-9MkxwFhEOwsAouPTuIu7WmoVMv4yxrqitG7lHuERwdGAgqDvw1j2MINPnAQejmBxxV7smJ5_eERyqfhSpR9GWJKcwNYoSDNhLU6AVP9F7ikFLzgRqjoHnFIIDfpM9mcd3t7pbUwvHnZyCC--fGlLK4dnVlqV-Revfi0ND9Vs4h4bApEbLA3elOh_UdswtAOKTAR9tCtiaAJL7eJHY-71fcMfF_71ufWl96xSV8mm6NlP"
                        name="Luna Silk Choker"
                        price="$450"
                        actionIcon="favorite"
                        actionColor="#D2B48C"
                    />
                </View>

            </View>

            {/* Newsletter Section */}
            <View style={styles.newsletterSection}>
                <Text style={styles.newsletterTitle}>Join the Inner Circle</Text>
                <Text style={styles.newsletterDesc}>Early access to new arrivals and exclusive boutique events.</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Your email address"
                        placeholderTextColor="#9ca3af"
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.subscribeBtn}>
                        <Text style={styles.subscribeText}>SUBSCRIBE</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const ProductCard = ({ image, name, price, actionIcon = "favorite-border", actionColor = "#333" }: any) => (
    <View style={styles.card}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.productImage} resizeMode="cover" />
            <TouchableOpacity style={styles.favIcon}>
                <MaterialIcons name={actionIcon as any} size={20} color={actionColor} />
            </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{name}</Text>
            <Text style={styles.cardPrice}>{price}</Text>
            <TouchableOpacity style={styles.cardShopBtn}>
                <Text style={styles.cardShopText}>SHOP NOW</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFCFB', // background-light
    },
    contentContainer: {
        paddingBottom: 40,
    },
    // Hero
    heroSection: {
        height: height * 0.6,
        position: 'relative',
        backgroundColor: '#1A1816',
    },
    heroImageContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    heroImageSide: {
        width: '25%',
        height: '100%',
    },
    heroImageCenter: {
        width: '50%',
        height: '100%',
    },
    heroContent: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heroTag: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 10,
        fontWeight: '500',
        letterSpacing: 4,
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        color: '#fff',
        fontSize: 42,
        fontWeight: '400',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 32,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    shopNowBtn: {
        backgroundColor: '#D2B48C', // Primary Beige
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 4,
    },
    shopNowText: {
        color: '#1c1917', // Stone 900
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    subHeader: {
        fontSize: 10,
        color: '#a8a29e', // Stone 400
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 28,
        fontStyle: 'italic',
        color: '#1c1917',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    filterBtn: {
        fontSize: 12,
        color: '#78716c', // Stone 500
        letterSpacing: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#e7e5e4',
        paddingBottom: 2,
    },
    // Grid
    gridContainer: {
        paddingHorizontal: 16,
    },
    gridRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    // Card
    card: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 3 / 4,
        backgroundColor: '#F5F1ED', // accent-light
        position: 'relative',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    favIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        padding: 6,
    },
    cardContent: {
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        color: '#1c1917',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        marginBottom: 4,
        textAlign: 'center',
    },
    cardPrice: {
        fontSize: 12,
        color: '#a8a29e',
        marginBottom: 12,
    },
    cardShopBtn: {
        width: '100%',
        backgroundColor: 'rgba(210, 180, 140, 0.1)', // Primary/10
        paddingVertical: 10,
        alignItems: 'center',
    },
    cardShopText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#57534e', // Stone 600
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    // Newsletter
    newsletterSection: {
        marginTop: 40,
        backgroundColor: '#F5F1ED',
        paddingHorizontal: 24,
        paddingVertical: 48,
        alignItems: 'center',
    },
    newsletterTitle: {
        fontSize: 24,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#1c1917',
        marginBottom: 8,
    },
    newsletterDesc: {
        fontSize: 12,
        color: '#78716c',
        textAlign: 'center',
        marginBottom: 24,
        maxWidth: 240,
        lineHeight: 18,
    },
    inputContainer: {
        width: '100%',
        gap: 12,
    },
    input: {
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#d6d3d1',
        padding: 12,
        textAlign: 'center',
        fontSize: 14,
        color: '#1c1917',
    },
    subscribeBtn: {
        width: '100%',
        backgroundColor: '#1c1917',
        paddingVertical: 12,
        alignItems: 'center',
    },
    subscribeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});

import { Platform } from 'react-native';
