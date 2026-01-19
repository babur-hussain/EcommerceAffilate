import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: number;
    color?: string;
    onRatingPress?: (rating: number) => void;
    readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 20,
    color = '#FFD700', // Gold color
    onRatingPress,
    readonly = false,
}) => {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
        const isFilled = i <= Math.round(rating);
        const Icon = (
            <FontAwesome
                name={isFilled ? 'star' : 'star-o'}
                size={size}
                color={isFilled ? color : '#E0E0E0'}
                style={{ marginHorizontal: 2 }}
            />
        );

        if (readonly) {
            stars.push(<View key={i}>{Icon}</View>);
        } else {
            stars.push(
                <TouchableOpacity key={i} onPress={() => onRatingPress && onRatingPress(i)} activeOpacity={0.7}>
                    {Icon}
                </TouchableOpacity>
            );
        }
    }

    return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default StarRating;
