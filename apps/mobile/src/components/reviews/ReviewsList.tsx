import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import api from '../../lib/api';
import ReviewItem from './ReviewItem';

interface ReviewsListProps {
    productId: string;
    refreshTrigger?: number; // Increment to reload
}

const ReviewsList: React.FC<ReviewsListProps> = ({ productId, refreshTrigger }) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [productId, refreshTrigger]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/reviews/${productId}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#2874F0" />
            </View>
        );
    }

    if (reviews.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No reviews yet. Be the first to review!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ratings & Reviews</Text>
            {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        backgroundColor: '#fff',
        padding: 16,
    },
    loadingContainer: {
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 8,
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
});

export default ReviewsList;
