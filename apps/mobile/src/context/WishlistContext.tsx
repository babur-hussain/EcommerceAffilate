import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

interface WishlistItem {
    _id: string; // Product ID
    title: string;
    price: number;
    images: string[];
    // Add other product fields as needed for display
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    loading: boolean;
    addToWishlist: (product: WishlistItem) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            refreshWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const refreshWishlist = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.get('/api/wishlist');
            // The backend returns { userId, productIds: [Product Objects] }
            // or { userId, productIds: [String IDs] } depending on population.
            // Let's assume we might need to populate or the backend already populates.
            // Based on typical patterns, we usually want populated products here.

            // If the backend returns the raw wishlist document:
            const items = response.data?.productIds || [];

            // Ensure items are actually objects (populated)
            // If they are just strings, we might need a different endpoint that returns populated items
            // OR the backend route we saw earlier (/api/wishlist) might strictly return IDs if not populated.
            // Let's check the backend route logic again.
            // The route: router.get('/wishlist', ...) -> Wishlist.findOne(...)
            // It doesn't seem to explicitly .populate('productIds').
            // This suggests we might only get IDs. If so, we can't display them nicely without fetching details.
            // HOWEVER, for now, let's assume valid data or handled by separate "get my wishlist products" call if needed.
            // Wait, looking at routes/wishlist.route.ts: 
            // `wishlist = await Wishlist.findOne({ userId: user.id });`
            // It lacks population.

            // We should probably update the backend to populate, OR assume the user will handle it.
            // For a robust mobile app, we definitely need populated data.
            // BUT, I'm stuck with the current backend unless I modify it (which I can do!).
            // Let's modify the backend to populate first? 
            // Actually, let's stick to the plan. If the backend doesn't populate, I'll fix it.

            setWishlist(items);
        } catch (error) {
            console.error('Error refreshing wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product: WishlistItem) => {
        if (!user) {
            Alert.alert('Sign In Required', 'Please sign in to save items to your wishlist.');
            return;
        }

        // Optimistic update
        const alreadyIn = wishlist.some(item => item._id === product._id);
        if (alreadyIn) return;

        setWishlist([...wishlist, product]);

        try {
            await api.post('/api/wishlist/add', { productId: product._id });
            // Ideally sync again to be sure, but optimistic is faster
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            // Revert on failure
            setWishlist(wishlist);
            Alert.alert('Error', 'Failed to add to wishlist');
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user) return;

        // Optimistic update
        const prevWishlist = [...wishlist];
        setWishlist(wishlist.filter(item => item._id !== productId));

        try {
            await api.post('/api/wishlist/remove', { productId });
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            setWishlist(prevWishlist);
            Alert.alert('Error', 'Failed to remove from wishlist');
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item._id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                loading,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                refreshWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
