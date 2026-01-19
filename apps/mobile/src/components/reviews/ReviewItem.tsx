import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import StarRating from './StarRating';
import { format } from 'date-fns'; // Assuming date-fns is available, otherwise use native Int'l

const { width } = Dimensions.get('window');

interface Review {
    _id: string;
    userId: {
        _id: string;
        name?: string;
        profileImage?: string;
    };
    rating: number;
    comment?: string;
    images?: string[];
    createdAt: string | Date;
}

interface ReviewItemProps {
    review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
    const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <View style={styles.container}>
            {/* Header: User Info & Rating */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    {review.userId?.profileImage ? (
                        <Image source={{ uri: review.userId.profileImage }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {review.userId?.name ? review.userId.name.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                    )}
                    <View>
                        <Text style={styles.userName}>{review.userId?.name || 'Anonymous'}</Text>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                </View>
                <StarRating rating={review.rating} size={14} readonly />
            </View>

            {/* Content: Comment */}
            {review.comment && <Text style={styles.comment}>{review.comment}</Text>}

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <View style={styles.imagesContainer}>
                    {review.images.map((img, index) => (
                        <Image key={index} source={{ uri: img }} style={styles.reviewImage} />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#1565C0',
        fontWeight: 'bold',
        fontSize: 14,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    comment: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginTop: 4,
    },
    imagesContainer: {
        flexDirection: 'row',
        marginTop: 12,
        flexWrap: 'wrap',
    },
    reviewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#f5f5f5',
    },
});

export default ReviewItem;
