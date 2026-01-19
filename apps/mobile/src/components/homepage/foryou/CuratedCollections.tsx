import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import CuratedTopicSection from './CuratedTopicSection';

interface Item {
    name: string;
    image: string;
    bgColor: string;
    actionUrl: string;
}

interface Collection {
    title: string;
    subtitle: string;
    backgroundColor: string;
    headerImage: string;
    items: Item[];
}

interface CuratedCollectionsProps {
    data?: {
        collections: Collection[];
    };
}

export default function CuratedCollections({ data }: CuratedCollectionsProps) {
    const router = useRouter();
    const collections = data?.collections || [];

    const handlePress = (actionUrl: string) => {
        if (!actionUrl) return;

        // Handle direct paths
        if (actionUrl.startsWith('/')) {
            router.push(actionUrl as any);
            return;
        }

        // Fallback for relative paths or just IDs if data is malformed
        router.push(actionUrl as any);
    };

    if (!collections.length) return null;

    return (
        <View>
            {collections.map((collection, index) => (
                <CuratedTopicSection
                    key={index}
                    title={collection.title}
                    subtitle={collection.subtitle}
                    backgroundColor={collection.backgroundColor}
                    headerImage={{ uri: collection.headerImage }}
                    items={collection.items.map(item => ({
                        name: item.name,
                        image: { uri: item.image },
                        bgColor: item.bgColor,
                        onPress: () => handlePress(item.actionUrl)
                    }))}
                />
            ))}
        </View>
    );
}
