import React, { useEffect, useState } from 'react';
import { Image, ImageProps } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';

// Ensure cache directory exists
const baseDir = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory;
const CACHE_DIR = `${baseDir}images/`;

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
};

interface CachedImageProps extends ImageProps {
    uri: string;
}

export const CachedImage: React.FC<CachedImageProps> = ({ uri, style, ...props }) => {
    const [localUri, setLocalUri] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const cacheImage = async () => {
            try {
                if (!uri) return;

                await ensureDirExists();

                // Create a unique filename based on the URI
                const hash = await Crypto.digestStringAsync(
                    Crypto.CryptoDigestAlgorithm.SHA256,
                    uri
                );
                const filename = `${hash}.jpg`; // Assuming jpg for simplicity, or could extract extension
                const fileUri = `${CACHE_DIR}${filename}`;

                const fileInfo = await FileSystem.getInfoAsync(fileUri);

                if (fileInfo.exists) {
                    if (isMounted) setLocalUri(fileUri);
                } else {
                    // Download the image
                    const downloadRes = await FileSystem.downloadAsync(uri, fileUri);
                    if (isMounted && downloadRes.status === 200) {
                        setLocalUri(downloadRes.uri);
                    } else {
                        // Fallback to remote if download failed (e.g., offline but not cached yet)
                        if (isMounted) setLocalUri(uri);
                    }
                }
            } catch (e) {
                console.error('Error caching image:', e);
                if (isMounted) setLocalUri(uri); // Fallback
            }
        };

        cacheImage();

        return () => {
            isMounted = false;
        };
    }, [uri]);

    if (!localUri) {
        // If we don't have a local URI yet, we can try showing the remote one as a placeholder
        // assuming the native Image cache might have it, or just return null to wait.
        // Returning null avoids flickering if it loads fast.
        // However, for better UX, maybe we should start with `uri`?
        // But `localUri` ensures we use the file system one.
        return null;
    }

    return (
        <Image
            {...props}
            style={style}
            source={{ uri: localUri }}
        />
    );
};
