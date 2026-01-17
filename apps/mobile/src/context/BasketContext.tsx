import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface BasketItem {
    productId: string | {
        _id: string;
        title: string;
        price: number;
        image: string;
        netWeight?: string;
    };
    quantity: number;
}

interface Basket {
    items: BasketItem[];
}

interface BasketContextType {
    basket: Basket | null;
    loading: boolean;
    addToBasket: (product: any, quantity?: number) => Promise<void>;
    removeFromBasket: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearBasket: () => Promise<void>;
    basketTotal: number;
    basketCount: number;
    getItemCount: (productId: string) => number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [basket, setBasket] = useState<Basket>({ items: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBasket();
    }, []);

    const loadBasket = async () => {
        try {
            const localBasket = await AsyncStorage.getItem('grocery_basket');
            if (localBasket) {
                const parsedBasket: Basket = JSON.parse(localBasket);

                // Filter out non-grocery items (cleaning up old/invalid data)
                const GROCERY_CATEGORY_ID = "696686d02c5aacc146652e03";
                const validItems = parsedBasket.items.filter(item => {
                    const product = item.productId as any;
                    const categoryId = product.categoryDetails?._id;
                    const parentCategoryId = product.categoryDetails?.parentCategory;

                    return categoryId === GROCERY_CATEGORY_ID || parentCategoryId === GROCERY_CATEGORY_ID;
                });

                if (validItems.length !== parsedBasket.items.length) {
                    // Update storage if we filtered anything out
                    setBasket({ items: validItems });
                    await AsyncStorage.setItem('grocery_basket', JSON.stringify({ items: validItems }));
                } else {
                    setBasket(parsedBasket);
                }
            }
        } catch (error) {
            console.error('Error loading basket:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveBasket = async (newBasket: Basket) => {
        try {
            await AsyncStorage.setItem('grocery_basket', JSON.stringify(newBasket));
            setBasket(newBasket);
        } catch (error) {
            console.error('Error saving basket:', error);
        }
    };

    const addToBasket = async (product: any, quantity = 1) => {
        // Enforce Grocery Restriction
        const GROCERY_CATEGORY_ID = "696686d02c5aacc146652e03";
        const categoryId = product.categoryDetails?._id;
        const parentCategoryId = product.categoryDetails?.parentCategory;

        if (categoryId !== GROCERY_CATEGORY_ID && parentCategoryId !== GROCERY_CATEGORY_ID) {
            Alert.alert("Not Available", "Only grocery items can be added to the basket.");
            return;
        }

        const currentItems = [...basket.items];
        const productId = product._id || product;

        const existingIndex = currentItems.findIndex(item => {
            const id = typeof item.productId === 'string' ? item.productId : item.productId._id;
            return id === productId;
        });

        if (existingIndex > -1) {
            currentItems[existingIndex].quantity += quantity;
        } else {
            // Ensure we store necessary display details since we don't have a backend sync yet
            const itemToStore = {
                productId: product, // Store the full product object
                quantity
            };
            currentItems.push(itemToStore);
        }

        await saveBasket({ items: currentItems });
    };

    const removeFromBasket = async (productId: string) => {
        const newItems = basket.items.filter(item => {
            const id = typeof item.productId === 'string' ? item.productId : item.productId._id;
            return id !== productId;
        });
        await saveBasket({ items: newItems });
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) {
            await removeFromBasket(productId);
            return;
        }

        const newItems = basket.items.map(item => {
            const id = typeof item.productId === 'string' ? item.productId : item.productId._id;
            if (id === productId) {
                return { ...item, quantity };
            }
            return item;
        });
        await saveBasket({ items: newItems });
    };

    const clearBasket = async () => {
        await saveBasket({ items: [] });
    };

    const basketTotal = basket.items.reduce((total, item) => {
        const product = item.productId as any;
        const price = product.price || 0;
        return total + (price * item.quantity);
    }, 0);

    const basketCount = basket.items.reduce((count, item) => count + item.quantity, 0);

    const getItemCount = (productId: string) => {
        const item = basket.items.find(i => {
            const id = typeof i.productId === 'string' ? i.productId : i.productId._id;
            return id === productId;
        });
        return item ? item.quantity : 0;
    };

    return (
        <BasketContext.Provider
            value={{
                basket,
                loading,
                addToBasket,
                removeFromBasket,
                updateQuantity,
                clearBasket,
                basketTotal,
                basketCount,
                getItemCount,
            }}
        >
            {children}
        </BasketContext.Provider>
    );
};

export const useBasket = () => {
    const context = useContext(BasketContext);
    if (context === undefined) {
        throw new Error('useBasket must be used within a BasketProvider');
    }
    return context;
};
