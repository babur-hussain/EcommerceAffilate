import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import StarRating from './StarRating';
import api from '../../lib/api';

interface AddReviewModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    productId: string;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
    isVisible,
    onClose,
    onSubmit,
    productId,
}) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (submitting) return;

        // Basic validation
        if (!comment.trim()) {
            Alert.alert('Validation', 'Please write a short comment describing your experience.');
            return;
        }

        try {
            setSubmitting(true);
            await api.post('/api/reviews', {
                productId,
                rating,
                comment,
            });

            Alert.alert('Success', 'Review submitted successfully!');
            setComment('');
            setRating(5);
            onSubmit(); // Trigger refresh in parent
            onClose();
        } catch (error: any) {
            console.error('Submit review error:', error);
            const msg = error.response?.data?.error || 'Failed to submit review. Please try again.';
            Alert.alert('Error', msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>Write a Review</Text>
                                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <MaterialIcons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Rate this product</Text>
                            <View style={styles.starsContainer}>
                                <StarRating
                                    rating={rating}
                                    size={32}
                                    onRatingPress={setRating}
                                />
                                <Text style={styles.ratingText}>{rating}/5</Text>
                            </View>

                            <Text style={styles.label}>Write your review</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="What did you like or dislike?"
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={comment}
                                onChangeText={setComment}
                            />

                            <TouchableOpacity
                                style={[styles.submitBtn, submitting && styles.disabledBtn]}
                                onPress={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitBtnText}>Submit Review</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    keyboardView: {
        width: '100%',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        minHeight: 400,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 12,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    ratingText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        fontSize: 16,
        color: '#333',
        marginBottom: 24,
    },
    submitBtn: {
        backgroundColor: '#2874F0', // Flipkart Blue
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledBtn: {
        backgroundColor: '#A0C4FF',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddReviewModal;
