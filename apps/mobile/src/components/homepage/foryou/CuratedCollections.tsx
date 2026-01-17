import React from 'react';
import { View } from 'react-native';
import CuratedTopicSection from './CuratedTopicSection';

export default function CuratedCollections() {
    return (
        <View>
            {/* 1. Discover your unique style */}
            <CuratedTopicSection
                title="Discover your unique style"
                subtitle="Elevate your fashion game with trendy picks"
                backgroundColor="#FDF2E3" // Beige/Peach
                headerImage={{ uri: 'https://cdn-icons-png.flaticon.com/512/3050/3050253.png' }} // Placeholder: Bag/Heels 
                items={[
                    {
                        name: 'Smart Gadgets',
                        image: { uri: 'https://m.media-amazon.com/images/I/71YdE55GNJL._AC_SL1500_.jpg' }, // Apple Watch styled
                        bgColor: '#FADCB8'
                    },
                    {
                        name: 'Casual Wear',
                        image: { uri: 'https://m.media-amazon.com/images/I/61I1W2o9CXL._AC_UY1100_.jpg' }, // T-shirt
                        bgColor: '#FADCB8'
                    },
                    {
                        name: 'Jewellery',
                        image: { uri: 'https://m.media-amazon.com/images/I/711zW-G0Y2L._AC_UY1100_.jpg' }, // Earrings
                        bgColor: '#FADCB8'
                    },
                    {
                        name: 'Bags & Accessories',
                        image: { uri: 'https://m.media-amazon.com/images/I/71f6I+K+gZL._AC_UY1100_.jpg' }, // Handbag
                        bgColor: '#FADCB8'
                    },
                ]}
            />

            {/* 2. Rediscover pleasure and intimacy */}
            <CuratedTopicSection
                title="Rediscover pleasure and intimacy"
                subtitle="Essentials for your passionate moments"
                backgroundColor="#FCECEC" // Light Pink
                headerImage={{ uri: 'https://cdn-icons-png.flaticon.com/512/3342/3342137.png' }} // Placeholder: Wellness
                items={[
                    {
                        name: 'Sensual Lubricants',
                        image: { uri: 'https://m.media-amazon.com/images/I/61G3T2+IqLL._AC_SL1500_.jpg' },
                        bgColor: '#F8A8A8'
                    },
                    {
                        name: 'Intimate Accessories',
                        image: { uri: 'https://m.media-amazon.com/images/I/61y4+2-kRSL._AC_SL1500_.jpg' },
                        bgColor: '#F8A8A8'
                    },
                    {
                        name: 'Intimacy Boosters',
                        image: { uri: 'https://m.media-amazon.com/images/I/71C+Z7+XyGL._AC_SL1500_.jpg' },
                        bgColor: '#F8A8A8'
                    },
                    {
                        name: 'Protection Partners',
                        image: { uri: 'https://m.media-amazon.com/images/I/81+L0+Q+m+L._AC_SL1500_.jpg' },
                        bgColor: '#F8A8A8'
                    },
                ]}
            />

            {/* 3. For a comfortable journey */}
            <CuratedTopicSection
                title="For a comfortable journey"
                subtitle="Get all your travel essentials here"
                backgroundColor="#F9FBE7" // Light Yellow/Greenish
                headerImage={{ uri: 'https://cdn-icons-png.flaticon.com/512/3125/3125713.png' }} // Luggage/Travel
                items={[
                    {
                        name: 'Sunscreen',
                        image: { uri: 'https://m.media-amazon.com/images/I/51+Z1gQ6h+L._SL1000_.jpg' },
                        bgColor: '#F0F4C3'
                    },
                    {
                        name: 'Travel Pillows',
                        image: { uri: 'https://m.media-amazon.com/images/I/71+8+gv+c+L._SL1500_.jpg' },
                        bgColor: '#F0F4C3'
                    },
                    {
                        name: 'Power Banks',
                        image: { uri: 'https://m.media-amazon.com/images/I/61X3e0rJtEL._AC_SL1500_.jpg' },
                        bgColor: '#F0F4C3'
                    },
                    {
                        name: 'T-Shirts',
                        image: { uri: 'https://m.media-amazon.com/images/I/61I1W2o9CXL._AC_UY1100_.jpg' },
                        bgColor: '#F0F4C3'
                    },
                ]}
            />
        </View>
    );
}
