import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export function RushHoursSection() {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768384656/IMG_1814_nufphe.jpg' }}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 20,
        overflow: 'hidden',
        height: 200, // Reasonable height for a banner, can be adjusted
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
