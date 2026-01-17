import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import api from '../../lib/api';

// Types
interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    brand?: string;
}

interface SearchHistoryItem {
    id: string;
    text: string;
    timestamp: number;
}

export default function GlobalSearch() {
    const router = useRouter();
    const inputRef = useRef<TextInput>(null);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadHistory();
        // Auto-focus input
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    // Load history from local storage
    const loadHistory = async () => {
        try {
            const savedHistory = await AsyncStorage.getItem('search_history');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error('Failed to load history', e);
        }
    };

    // Save item to history
    const addToHistory = async (text: string) => {
        if (!text.trim()) return;
        const newItem: SearchHistoryItem = { id: Date.now().toString(), text: text.trim(), timestamp: Date.now() };
        // Remove duplicates and keep top 10
        const updatedHistory = [newItem, ...history.filter(h => h.text.toLowerCase() !== text.toLowerCase().trim())].slice(0, 10);
        setHistory(updatedHistory);
        await AsyncStorage.setItem('search_history', JSON.stringify(updatedHistory));
    };

    const clearHistory = async () => {
        setHistory([]);
        await AsyncStorage.removeItem('search_history');
    };

    // Live Search
    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(() => {
            fetchSuggestions(query);
        }, 300); // Debounce

        return () => clearTimeout(timer);
    }, [query]);

    const fetchSuggestions = async (text: string) => {
        setLoading(true);
        try {
            // Adjust endpoint as per actual backend. Assuming generic product search.
            const response = await api.get(`/api/products?search=${text}&limit=5`);
            const data = response.data.products || response.data; // Handle pagination structure if any
            setSuggestions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchCheck = (text: string) => {
        setQuery(text);
    };

    const performSearch = (text: string) => {
        if (!text.trim()) return;
        addToHistory(text);
        router.push(`/search/results?q=${encodeURIComponent(text)}`);
    };

    const handleSuggestionPress = (product: Product) => {
        addToHistory(product.name);
        router.push(`/product/${product._id}`);
    };

    const renderHistoryItem = ({ item }: { item: SearchHistoryItem }) => (
        <TouchableOpacity style={styles.historyItem} onPress={() => performSearch(item.text)}>
            <View style={styles.historyIcon}>
                <MaterialIcons name="history" size={20} color="#9CA3AF" />
            </View>
            <Text style={styles.historyText}>{item.text}</Text>
            <TouchableOpacity style={styles.historyArrow} onPress={() => setQuery(item.text)}>
                <Feather name="arrow-up-left" size={18} color="#D1D5DB" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderSuggestionItem = ({ item }: { item: Product }) => (
        <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSuggestionPress(item)}>
            <Image source={{ uri: item.images[0] }} style={styles.suggestionImage} />
            <View style={styles.suggestionContent}>
                <Text style={styles.suggestionTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.suggestionSubtext} numberOfLines={1}>
                    in {item.category}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder="Search for products, brands..."
                        placeholderTextColor="#9CA3AF"
                        value={query}
                        onChangeText={handleSearchCheck}
                        onSubmitEditing={() => performSearch(query)}
                        returnKeyType="search"
                        autoCapitalize="none"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {query.length === 0 ? (
                    // History View
                    <View style={styles.section}>
                        {history.length > 0 && (
                            <>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                                    <TouchableOpacity onPress={clearHistory}>
                                        <Text style={styles.clearHistoryText}>Clear</Text>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    data={history}
                                    keyExtractor={item => item.id}
                                    renderItem={renderHistoryItem}
                                    contentContainerStyle={styles.listContent}
                                />
                            </>
                        )}

                        {/* Trending or Popular could go here */}
                        <View style={styles.trendingSection}>
                            <Text style={styles.sectionTitle}>Trending Now</Text>
                            <View style={styles.trendingTags}>
                                {['iPhone 15', 'Sneakers', 'Smart Watch', 'Headphones', 'Kurtas'].map((tag, i) => (
                                    <TouchableOpacity key={i} style={styles.trendingTag} onPress={() => performSearch(tag)}>
                                        <Feather name="trending-up" size={14} color="#4B5563" style={{ marginRight: 6 }} />
                                        <Text style={styles.trendingTagText}>{tag}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                ) : (
                    // Suggestions View
                    <View style={styles.section}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#FF6F00" style={{ marginTop: 20 }} />
                        ) : suggestions.length > 0 ? (
                            <FlatList
                                data={suggestions}
                                keyExtractor={item => item._id}
                                renderItem={renderSuggestionItem}
                                contentContainerStyle={styles.listContent}
                            />
                        ) : (
                            <TouchableOpacity style={styles.searchAction} onPress={() => performSearch(query)}>
                                <View style={styles.searchActionIcon}>
                                    <Ionicons name="search" size={20} color="#FFFFFF" />
                                </View>
                                <Text style={styles.searchActionText}>Search for "{query}"</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 50, // Safe Area padding top approximation
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 12,
        padding: 4,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    clearButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    section: {
        paddingTop: 16,
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    clearHistoryText: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: 20,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F4F6',
    },
    historyIcon: {
        marginRight: 12,
    },
    historyText: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
    },
    historyArrow: {
        padding: 4,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F4F6',
    },
    suggestionImage: {
        width: 40,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#F3F4F6',
        marginRight: 12,
    },
    suggestionContent: {
        flex: 1,
    },
    suggestionTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 2,
    },
    suggestionSubtext: {
        fontSize: 12,
        color: '#6B7280',
    },
    searchAction: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 8,
    },
    searchActionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF6F00',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    searchActionText: {
        fontSize: 16,
        color: '#FF6F00',
        fontWeight: '600',
    },
    trendingSection: {
        paddingTop: 24,
        paddingHorizontal: 16,
    },
    trendingTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 8,
    },
    trendingTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    trendingTagText: {
        fontSize: 14,
        color: '#4B5563',
    },
});
