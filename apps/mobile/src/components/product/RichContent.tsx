import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RichContent() {
    return (
        <View style={styles.container}>
            {/* 3D Curved Banner */}
            <View style={styles.bannerContainer}>
                <LinearGradient
                    colors={['#FFFFFF', '#F0F9FF', '#E0F2FE']}
                    style={styles.gradientBg}
                />
                <Text style={styles.bannerText}>
                    <Text style={{ color: '#3B82F6' }}>3D CURVED</Text> pOLED DISPLAY{"\n"}
                    <Text style={{ color: '#000000', fontWeight: '800' }}>IP68 Protection</Text>
                </Text>

                <Text style={styles.hzText}>
                    <Text style={{ fontSize: 60, fontWeight: '900', color: '#1B6B92' }}>144Hz</Text>
                </Text>

                {/* Placeholder for balloons/landscape imagery */}
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2909/2909805.png' }}
                    style={styles.balloonIcon}
                />
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/91/91632.png' }}
                    style={[styles.balloonIcon, { right: 80, top: 40, width: 40, height: 40, tintColor: '#F59E0B' }]}
                />
            </View>

            <TouchableOpacity style={styles.showMoreBtn}>
                <Text style={styles.showMoreText}>Show More</Text>
                <Ionicons name="chevron-forward" size={16} color="#1F2937" />
            </TouchableOpacity>

            {/* Product Videos */}
            <View style={styles.videoSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.videoTitle}>Product videos</Text>
                    <TouchableOpacity>
                        <Ionicons name="chevron-up" size={20} color="#4B5563" />
                    </TouchableOpacity>
                </View>

                <View style={styles.videoCard}>
                    <Image
                        source={{ uri: 'https://m.media-amazon.com/images/I/71YdE55GNJL._AC_SL1500_.jpg' }} // Placeholder thumbnail
                        style={styles.videoThumb}
                        resizeMode="cover"
                    />
                    {/* Overlay Text mimics Youtube shorts style */}
                    <View style={styles.videoOverlay}>
                        <View style={styles.viewCount}>
                            <Ionicons name="eye" size={12} color="#FFF" />
                            <Text style={styles.viewText}> 18.6L</Text>
                        </View>
                        <Text style={styles.videoCaption}>Budget phone{"\n"}with premium features</Text>
                    </View>
                    <View style={styles.playBtn}>
                        <Ionicons name="play" size={20} color="#FFF" />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 20,
    },
    bannerContainer: {
        height: 200,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginTop: 16,
    },
    gradientBg: {
        ...StyleSheet.absoluteFillObject,
    },
    bannerText: {
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 28,
    },
    hzText: {
        marginTop: 10,
        zIndex: 10,
    },
    balloonIcon: {
        position: 'absolute',
        right: 40,
        top: 20,
        width: 60,
        height: 60,
        opacity: 0.8,
    },
    showMoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginHorizontal: 16,
        borderRadius: 8,
        marginVertical: 16,
    },
    showMoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginRight: 4,
    },
    videoSection: {
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    videoCard: {
        width: 140,
        height: 220,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    videoThumb: {
        width: '100%',
        height: '100%',
    },
    videoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    viewCount: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    viewText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    videoCaption: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 16,
        fontStyle: 'italic',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    playBtn: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
